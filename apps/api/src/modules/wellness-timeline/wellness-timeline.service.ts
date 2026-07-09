import { Injectable, NotFoundException } from '@nestjs/common';
import { RetreatType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateAssessmentDto,
  CreateGoalDto,
  CreateRetreatDto,
  CreateTimelineEventDto,
  UpdateGoalDto,
} from './dto';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@Injectable()
export class WellnessTimelineService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Retreats ──────────────────────────────────────────────────────────────
  async listRetreats(user: AuthenticatedUser) {
    const yp = await this.requireYatriProfile(user);
    return this.prisma.retreat.findMany({
      where: { yatriId: yp.id },
      orderBy: { startDate: 'desc' },
      include: { programs: true, assessments: true },
    });
  }

  async createRetreat(user: AuthenticatedUser, dto: CreateRetreatDto) {
    const yp = await this.requireYatriProfile(user);
    return this.prisma.retreat.create({
      data: {
        yatriId: yp.id,
        title: dto.title,
        type: dto.type as RetreatType,
        status: dto.status,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        locationCity: dto.locationCity ?? 'Kerala',
        notes: dto.notes,
      },
    });
  }

  // ── Assessments ──────────────────────────────────────────────────────────
  async listAssessments(user: AuthenticatedUser) {
    return this.prisma.wellnessAssessment.findMany({
      where: { yatriUserId: user.id },
      orderBy: { recordedAt: 'desc' },
    });
  }

  async createAssessment(user: AuthenticatedUser, dto: CreateAssessmentDto) {
    return this.prisma.wellnessAssessment.create({
      data: {
        yatriUserId: user.id,
        retreatId: dto.retreatId,
        kind: dto.kind as any,
        metrics: dto.metrics as any,
        summary: dto.summary,
      },
    });
  }

  // ── Goals ─────────────────────────────────────────────────────────────────
  async listGoals(user: AuthenticatedUser) {
    return this.prisma.wellnessGoal.findMany({
      where: { yatriUserId: user.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createGoal(user: AuthenticatedUser, dto: CreateGoalDto) {
    return this.prisma.wellnessGoal.create({
      data: {
        yatriUserId: user.id,
        title: dto.title,
        category: dto.category ?? 'general',
        metric: dto.metric,
        targetValue: dto.targetValue,
        currentValue: dto.currentValue,
        unit: dto.unit,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      },
    });
  }

  async updateGoal(user: AuthenticatedUser, goalId: string, dto: UpdateGoalDto) {
    const goal = await this.prisma.wellnessGoal.findFirst({
      where: { id: goalId, yatriUserId: user.id },
    });
    if (!goal) throw new NotFoundException('Goal not found');
    return this.prisma.wellnessGoal.update({
      where: { id: goalId },
      data: {
        title: dto.title,
        currentValue: dto.currentValue,
        status: dto.status as any,
      },
    });
  }

  // ── Timeline ─────────────────────────────────────────────────────────────
  /**
   * Returns the merged wellness timeline (retreats + assessments + goals +
   * plans + standalone events) sorted newest first.
   */
  async getTimeline(user: AuthenticatedUser, opts: { limit?: number; type?: string } = {}) {
    const limit = opts.limit ?? 50;
    const where: any = { yatriUserId: user.id };
    if (opts.type) where.type = opts.type;
    const events = await this.prisma.timelineEvent.findMany({
      where,
      orderBy: { occurredAt: 'desc' },
      take: limit,
    });
    const retreats = await this.prisma.retreat.findMany({
      where: { yatri: { user: { id: user.id } } },
      orderBy: { startDate: 'desc' },
      take: limit,
    });

    const merged = [
      ...events.map((e) => ({ kind: 'EVENT', ...e })),
      ...retreats.map((r) => ({
        kind: 'RETREAT',
        occurredAt: r.startDate,
        title: `Retreat: ${r.title}`,
        description: `${r.type} · ${r.startDate.toDateString()} → ${r.endDate.toDateString()}`,
        type: 'RETREAT',
      })),
    ]
      .sort((a, b) => +new Date(b.occurredAt) - +new Date(a.occurredAt))
      .slice(0, limit);

    return merged;
  }

  async addTimelineEvent(user: AuthenticatedUser, dto: CreateTimelineEventDto) {
    const yp = await this.requireYatriProfile(user);
    return this.prisma.timelineEvent.create({
      data: {
        yatriUserId: user.id,
        yatriProfileId: yp.id,
        type: dto.type as any,
        title: dto.title,
        description: dto.description,
        occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : new Date(),
        metricName: dto.metricName,
        metricValue: dto.metricValue,
        metricUnit: dto.metricUnit,
        tags: dto.tags ?? [],
      },
    });
  }

  // ── helpers ──────────────────────────────────────────────────────────────
  private async requireYatriProfile(user: AuthenticatedUser) {
    const yp = await this.prisma.yatriProfile.findUnique({ where: { userId: user.id } });
    if (!yp) throw new NotFoundException('Yatri profile not initialised');
    return yp;
  }
}
