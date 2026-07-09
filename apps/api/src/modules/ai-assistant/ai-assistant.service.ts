import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { StubProvider } from './providers/stub.provider';
import { OpenAiProvider } from './providers/openai.provider';
import { AiCompletion, AiProvider } from './ai.provider';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';

const SYSTEM_PROMPT = `
You are the Amal Yatri wellness companion for guests of Amal Tamara Ayurveda.
You speak calmly, simply, and never diagnose. You suggest general wellness
practices (breathwork, gentle yoga, sleep hygiene, seasonal foods, restful
routines). For anything medical — pain, fever, pregnancy, meds, mental health
crisis — you escalate to the user's doctor or local emergency services.
Keep answers short (4-8 sentences). Use everyday English. Avoid emoji except
sparingly (🌿 at most once).
`.trim();

@Injectable()
export class AiAssistantService {
  private readonly logger = new Logger(AiAssistantService.name);
  private readonly provider: AiProvider;

  constructor(
    private readonly prisma: PrismaService,
    cfg: ConfigService,
    stub: StubProvider,
    openai: OpenAiProvider,
  ) {
    const want = (cfg.get<string>('AI_PROVIDER') ?? 'stub').toLowerCase();
    this.provider = want === 'openai' && cfg.get<string>('AI_API_KEY') ? openai : stub;
    if (this.provider.id !== want) {
      this.logger.warn(`AI_PROVIDER=${want} requested but using '${this.provider.id}' (reason: missing key)`);
    }
  }

  async listConversations(user: AuthenticatedUser) {
    return this.prisma.aiConversation.findMany({
      where: { userId: user.id },
      orderBy: { lastMsgAt: 'desc' },
      select: { id: true, title: true, topic: true, startedAt: true, lastMsgAt: true },
    });
  }

  async createConversation(user: AuthenticatedUser, title?: string, topic?: string) {
    return this.prisma.aiConversation.create({
      data: { userId: user.id, title: title ?? 'New conversation', topic },
    });
  }

  async getConversation(user: AuthenticatedUser, id: string) {
    const conv = await this.prisma.aiConversation.findFirst({
      where: { id, userId: user.id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!conv) throw new NotFoundException();
    return conv;
  }

  async sendMessage(user: AuthenticatedUser, conversationId: string, userText: string) {
    const conv = await this.prisma.aiConversation.findFirst({
      where: { id: conversationId, userId: user.id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!conv) throw new NotFoundException();

    // Persist the user message
    await this.prisma.aiMessage.create({
      data: { conversationId, role: AiRole.USER, content: userText },
    });

    // Build the model context from history (cap at last 20 to bound tokens)
    const history = conv.messages.slice(-20).map((m) => ({
      role: m.role.toLowerCase() as 'user' | 'assistant' | 'system',
      content: m.content,
    }));
    history.push({ role: 'user' as const, content: userText });

    let completion: AiCompletion;
    try {
      completion = await this.provider.complete({ system: SYSTEM_PROMPT, messages: history });
    } catch (err) {
      this.logger.error('Provider failed', err as Error);
      completion = {
        content: "I'm having trouble connecting to my model right now. Please try again in a moment.",
        model: 'amalyatri-fallback',
        meta: { error: true },
      };
    }

    await this.prisma.$transaction([
      this.prisma.aiMessage.create({
        data: {
          conversationId,
          role: AiRole.ASSISTANT,
          content: completion.content,
          providerMeta: completion as any,
        },
      }),
      this.prisma.aiConversation.update({
        where: { id: conversationId },
        data: { lastMsgAt: new Date() },
      }),
    ]);

    return completion;
  }
}
