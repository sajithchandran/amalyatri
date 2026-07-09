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
import { DoctorConnectService } from './doctor-connect.service';
import { RequestConsultationDto, SendMessageDto } from './dto';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('doctor-connect')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('doctor-connect')
export class DoctorConnectController {
  constructor(
    private readonly svc: DoctorConnectService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('doctors')
  @ApiOperation({ summary: 'List doctors available for chat' })
  doctors() {
    return this.svc.listDoctors();
  }

  @Get('conversations')
  @ApiOperation({ summary: 'My recent conversations (with last message + unread)' })
  conversations(@CurrentUser() user: AuthenticatedUser) {
    return this.svc.listConversations(user);
  }

  @Get('threads/:otherId')
  @ApiOperation({ summary: 'Thread with a specific user (oldest first)' })
  thread(@CurrentUser() user: AuthenticatedUser, @Param('otherId') otherId: string) {
    return this.svc.getThread(user, otherId);
  }

  @Post('messages')
  @ApiOperation({ summary: 'Send a message to a doctor' })
  sendMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SendMessageDto,
  ) {
    return this.svc.sendMessage(user, dto);
  }

  @Post('consultations')
  @ApiOperation({ summary: 'Request a consultation with a doctor' })
  requestConsultation(@CurrentUser() user: AuthenticatedUser, @Body() dto: RequestConsultationDto) {
    return this.prisma.consultation.create({
      data: {
        patientUserId: user.id,
        doctorProfileId: dto.doctorProfileId,
        mode: dto.mode ?? 'CHAT',
        scheduledFor: dto.scheduledFor ? new Date(dto.scheduledFor) : null,
        patientNote: dto.patientNote,
      },
    });
  }

  @Get('consultations')
  @ApiOperation({ summary: 'My consultations (as patient)' })
  myConsultations(@CurrentUser() user: AuthenticatedUser) {
    return this.prisma.consultation.findMany({
      where: { patientUserId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { doctor: true },
    });
  }
}
