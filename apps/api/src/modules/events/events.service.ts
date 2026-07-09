import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  list(opts: { upcomingOnly?: boolean; limit?: number } = {}) {
    return this.prisma.event.findMany({
      where: {
        isPublished: true,
        ...(opts.upcomingOnly ? { startsAt: { gte: new Date() } } : {}),
      },
      orderBy: { startsAt: 'asc' },
      take: opts.limit ?? 50,
    });
  }

  async register(user: AuthenticatedUser, eventId: string) {
    const ev = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!ev) throw new NotFoundException();
    if (ev.capacity) {
      const count = await this.prisma.eventRegistration.count({ where: { eventId } });
      if (count >= ev.capacity) throw new BadRequestException('Event is full');
    }
    await this.prisma.eventRegistration.upsert({
      where: { eventId_userId: { eventId, userId: user.id } },
      update: {},
      create: { eventId, userId: user.id },
    });
    return { ok: true };
  }

  async cancel(user: AuthenticatedUser, eventId: string) {
    await this.prisma.eventRegistration.deleteMany({ where: { eventId, userId: user.id } });
    return { ok: true };
  }

  myRegistrations(user: AuthenticatedUser) {
    return this.prisma.eventRegistration.findMany({
      where: { userId: user.id },
      include: { event: true },
      orderBy: { event: { startsAt: 'asc' } },
    });
  }
}
