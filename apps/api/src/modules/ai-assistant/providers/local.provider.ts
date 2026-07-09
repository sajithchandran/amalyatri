// Local LLM provider stub — same shape as OpenAI; expects an OpenAI-compatible
// endpoint (Ollama, vLLM, LM Studio). Real HTTP wiring is a tracked task.

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiCompletion, AiMessage, AiProvider, SAFETY_DISCLAIMER } from '../ai.provider';

@Injectable()
export class LocalProvider implements AiProvider {
  readonly id = 'local' as const;
  private readonly logger = new Logger(LocalProvider.name);

  constructor(private readonly cfg: ConfigService) {}

  async complete(_args: { system: string; messages: AiMessage[] }): Promise<AiCompletion> {
    this.logger.error('Local LLM HTTP transport not yet wired');
    return {
      content: `I am not yet connected to my model. ${SAFETY_DISCLAIMER}`,
      model: this.cfg.get<string>('AI_MODEL') ?? 'local-placeholder',
      meta: { provider: 'local', stage: 'not-wired' },
    };
  }
}
