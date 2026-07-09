// Anthropic provider stub — same shape as OpenAI provider; actual HTTP call
// left to a tracked task. Exists so the factory can be wired without surprise.
// Kept as a single file so Anthropic is easy to add later.

import { Injectable, Logger } from '@nestjs/common';
import { AiCompletion, AiMessage, AiProvider, SAFETY_DISCLAIMER } from '../ai.provider';

@Injectable()
export class AnthropicProvider implements AiProvider {
  readonly id = 'anthropic' as const;
  private readonly logger = new Logger(AnthropicProvider.name);

  async complete(_args: { system: string; messages: AiMessage[] }): Promise<AiCompletion> {
    this.logger.error('Anthropic HTTP transport not yet wired');
    return {
      content: `I am not yet connected to my model. ${SAFETY_DISCLAIMER}`,
      model: 'claude-placeholder',
      meta: { provider: 'anthropic', stage: 'not-wired' },
    };
  }
}
