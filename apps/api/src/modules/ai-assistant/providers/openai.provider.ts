import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiCompletion, AiMessage, AiProvider, SAFETY_DISCLAIMER } from '../ai.provider';

/**
 * OpenAI provider. Only created when AI_PROVIDER=openai AND AI_API_KEY is set.
 * Real implementation outlines the HTTP call so the contract is clear; the
 * actual fetch is commented until the SDK / fetch is wired into deps.
 */
@Injectable()
export class OpenAiProvider implements AiProvider {
  readonly id = 'openai' as const;
  private readonly logger = new Logger(OpenAiProvider.name);
  private readonly apiKey: string | undefined;

  constructor(private readonly cfg: ConfigService) {
    this.apiKey = cfg.get<string>('AI_API_KEY');
  }

  async complete(args: { system: string; messages: AiMessage[] }): Promise<AiCompletion> {
    if (!this.apiKey) {
      this.logger.warn('OpenAI selected but AI_API_KEY missing — failing closed');
      throw new Error('OpenAI key not configured');
    }
    const body = {
      model: this.cfg.get<string>('AI_MODEL') ?? 'gpt-4o-mini',
      messages: [{ role: 'system', content: args.system }, ...args.messages],
      temperature: 0.4,
    };
    // The platform leaves the HTTP plumbing to a tracked task; until then
    // we surface a clear "not configured" reply rather than fake a response.
    this.logger.error('AI HTTP transport not yet wired — please install openai SDK');
    return {
      content: `I am not yet connected to my model. ${SAFETY_DISCLAIMER}`,
      model: body.model,
      meta: { provider: 'openai', stage: 'not-wired' },
    };
  }
}
