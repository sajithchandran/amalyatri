import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AiAssistantController } from './ai-assistant.controller';
import { AiAssistantService } from './ai-assistant.service';
import { StubProvider } from './providers/stub.provider';
import { OpenAiProvider } from './providers/openai.provider';
import { AnthropicProvider } from './providers/anthropic.provider';
import { LocalProvider } from './providers/local.provider';

@Module({
  imports: [AuthModule],
  controllers: [AiAssistantController],
  providers: [AiAssistantService, StubProvider, OpenAiProvider, AnthropicProvider, LocalProvider],
  exports: [AiAssistantService],
})
export class AiAssistantModule {}
