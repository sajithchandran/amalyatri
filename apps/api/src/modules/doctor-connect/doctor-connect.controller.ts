import {
  Body,
  Controller,
  Delete,
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

  @Get('doctor-consultations')
  @ApiOperation({ summary: 'Consultations for my patients (doctor view)' })
  async doctorConsultations(@CurrentUser() user: AuthenticatedUser) {
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { userId: user.id },
    });
    if (!doctor) return [];

    return this.prisma.consultation.findMany({
      where: { doctorProfileId: doctor.id },
      orderBy: [{ scheduledFor: 'desc' }, { createdAt: 'desc' }],
      include: {
        patient: {
          include: { yatriProfile: true },
        },
      },
    });
  }

  @Post('doctor-consultations')
  @ApiOperation({ summary: 'Create a consultation as a doctor' })
  async createConsultation(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: { patientUserId: string; mode?: string; scheduledFor?: string; patientNote?: string; doctorNote?: string },
  ) {
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { userId: user.id },
    });
    if (!doctor) throw new Error('Doctor profile not found');

    return this.prisma.consultation.create({
      data: {
        patientUserId: dto.patientUserId,
        doctorProfileId: doctor.id,
        mode: (dto.mode as any) ?? 'VIDEO',
        scheduledFor: dto.scheduledFor ? new Date(dto.scheduledFor) : null,
        patientNote: dto.patientNote,
        doctorNote: dto.doctorNote,
        status: 'SCHEDULED',
      },
      include: {
        patient: {
          include: { yatriProfile: true },
        },
      },
    });
  }

  @Get('my-doctors')
  @ApiOperation({ summary: 'My assigned doctors (patient view)' })
  async myDoctors(@CurrentUser() user: AuthenticatedUser) {
    const assignments = await this.prisma.doctorPatientAssignment.findMany({
      where: { patientUserId: user.id },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    return assignments.map((a) => ({
      id: a.doctor.id,
      userId: a.doctor.userId,
      firstName: a.doctor.firstName,
      lastName: a.doctor.lastName,
      qualifications: a.doctor.qualifications,
      specialties: a.doctor.specialties,
      avatarUrl: a.doctor.avatarUrl,
      yearsOfPractice: a.doctor.yearsOfPractice,
      bio: a.doctor.bio,
      availableForChat: a.doctor.availableForChat,
      assignedAt: a.assignedAt,
      notes: a.notes,
    }));
  }

  @Get('patients')
  @ApiOperation({ summary: 'My assigned patients (doctor view)' })
  async myPatients(@CurrentUser() user: AuthenticatedUser) {
    // Get the doctor's profile
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { userId: user.id },
    });
    if (!doctor) return [];

    // Get all assigned patients with their profiles, latest message, and consultations
    const assignments = await this.prisma.doctorPatientAssignment.findMany({
      where: { doctorId: doctor.id },
      include: {
        patient: {
          include: {
            yatriProfile: true,
            receivedMsgs: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });

    return Promise.all(assignments.map(async (a) => {
      const consultationCount = await this.prisma.consultation.count({
        where: { patientUserId: a.patientUserId, doctorProfileId: doctor.id },
      });

      return {
        id: a.patient.id,
        email: a.patient.email,
        firstName: a.patient.yatriProfile?.firstName ?? '',
        lastName: a.patient.yatriProfile?.lastName ?? '',
        avatarUrl: a.patient.yatriProfile?.avatarUrl ?? null,
        city: a.patient.yatriProfile?.city ?? null,
        wellnessScore: a.patient.yatriProfile?.wellnessScore ?? 0,
        lastMessage: a.patient.receivedMsgs[0] ?? null,
        consultationCount,
        assignedAt: a.assignedAt,
        notes: a.notes,
      };
    }));
  }

  // ── Yoga Pose Master Catalog ──────────────────────────────────────────

  @Get('yoga-poses')
  @ApiOperation({ summary: 'List all yoga poses in the master catalog' })
  async listYogaPoses() {
    return this.prisma.yogaPose.findMany({ orderBy: { title: 'asc' } });
  }

  @Post('yoga-poses')
  @ApiOperation({ summary: 'Create a yoga pose in the master catalog' })
  async createYogaPose(@Body() dto: { title: string; imageUrl: string; description?: string; durationMin?: number; difficulty?: string; tags?: string[] }) {
    return this.prisma.yogaPose.create({
      data: {
        title: dto.title,
        imageUrl: dto.imageUrl,
        description: dto.description,
        durationMin: dto.durationMin ?? 15,
        difficulty: dto.difficulty ?? 'beginner',
        tags: dto.tags ?? [],
      },
    });
  }

  @Delete('yoga-poses/:id')
  @ApiOperation({ summary: 'Delete a yoga pose from the master catalog' })
  async deleteYogaPose(@Param('id') id: string) {
    return this.prisma.yogaPose.delete({ where: { id } });
  }

  // ── Yoga Recommendations (doctor → patient, multi-pose) ────────────────

  @Post('yoga-recommendations')
  @ApiOperation({ summary: 'Recommend yoga poses to a patient' })
  async recommendYoga(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: { patientUserId: string; poseIds: string[]; note?: string },
  ) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId: user.id } });
    if (!doctor) throw new Error('Doctor profile not found');

    const recommendation = await this.prisma.yogaRecommendation.create({
      data: {
        doctorId: doctor.id,
        patientUserId: dto.patientUserId,
        note: dto.note,
        poses: {
          create: dto.poseIds.map((poseId, i) => ({
            poseId,
            order: i,
          })),
        },
      },
      include: {
        poses: {
          include: { pose: true },
          orderBy: { order: 'asc' },
        },
        doctor: { select: { firstName: true, lastName: true, avatarUrl: true } },
      },
    });

    return recommendation;
  }

  @Get('yoga-recommendations')
  @ApiOperation({ summary: 'My yoga recommendations (doctor view)' })
  async myYogaRecommendations(@CurrentUser() user: AuthenticatedUser) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId: user.id } });
    if (!doctor) return [];

    return this.prisma.yogaRecommendation.findMany({
      where: { doctorId: doctor.id },
      orderBy: { date: 'desc' },
      include: {
        poses: {
          include: { pose: true },
          orderBy: { order: 'asc' },
        },
        patient: { select: { id: true, email: true, yatriProfile: { select: { firstName: true, lastName: true } } } },
      },
    });
  }

  @Get('my-yoga')
  @ApiOperation({ summary: 'Yoga recommended to me (patient view)' })
  async myYoga(@CurrentUser() user: AuthenticatedUser) {
    return this.prisma.yogaRecommendation.findMany({
      where: { patientUserId: user.id },
      orderBy: { date: 'desc' },
      include: {
        poses: {
          include: { pose: true },
          orderBy: { order: 'asc' },
        },
        doctor: { select: { firstName: true, lastName: true, avatarUrl: true } },
      },
    });
  }
}
