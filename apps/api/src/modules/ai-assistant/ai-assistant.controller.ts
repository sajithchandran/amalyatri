import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { AiAssistantService } from './ai-assistant.service';
import { CreateConversationDto, SendMessageDto } from './dto';

@ApiTags('ai-assistant')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-assistant')
export class AiAssistantController {
  constructor(private readonly svc: AiAssistantService) {}

  @Get('conversations')
  conversations(@CurrentUser() user: AuthenticatedUser) {
    return this.svc.listConversations(user);
  }

  @Post('conversations')
  createConversation(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateConversationDto) {
    return this.svc.createConversation(user, dto.title, dto.topic);
  }

  @Get('conversations/:id')
  conversation(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.svc.getConversation(user, id);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Send a user message; the assistant replies synchronously' })
  send(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.svc.sendMessage(user, id, dto.message);
  }
}
