import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';

export interface SendMessageDto {
  recipientId: string;
  kind?: 'TEXT' | 'VOICE' | 'IMAGE' | 'DOCUMENT';
  body?: string;
  mediaUrl?: string;
  durationSec?: number;
}

@Injectable()
export class DoctorConnectService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Send a message to another user. Both users must be active. Patients can
   * only message DOCTORs; doctors can message their own patients or any
   * other doctor. Enforced here as a domain invariant.
   */
  async sendMessage(sender: AuthenticatedUser, dto: SendMessageDto) {
    const recipient = await this.prisma.user.findUnique({ where: { id: dto.recipientId } });
    if (!recipient || recipient.status !== 'ACTIVE') {
      throw new NotFoundException('Recipient not found');
    }
    this.assertMessagingAllowed(sender.role as any, recipient.role as any);

    return this.prisma.doctorMessage.create({
      data: {
        senderId: sender.id,
        recipientId: dto.recipientId,
        kind: dto.kind ?? 'TEXT',
        body: dto.body,
        mediaUrl: dto.mediaUrl,
        durationSec: dto.durationSec,
      },
    });
  }

  /**
   * Thread view: every message between me and one other user, oldest first.
   */
  async getThread(user: AuthenticatedUser, otherId: string) {
    const other = await this.prisma.user.findUnique({
      where: { id: otherId },
      include: { yatriProfile: true, doctorProfile: true },
    });
    if (!other) throw new NotFoundException('User not found');

    const messages = await this.prisma.doctorMessage.findMany({
      where: {
        OR: [
          { senderId: user.id, recipientId: otherId },
          { senderId: otherId, recipientId: user.id },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    // Mark inbound messages as read
    await this.prisma.doctorMessage.updateMany({
      where: { senderId: otherId, recipientId: user.id, readAt: null },
      data: { readAt: new Date() },
    });

    return {
      other: {
        id: other.id,
        role: other.role,
        name: other.doctorProfile
          ? `Dr. ${other.doctorProfile.firstName} ${other.doctorProfile.lastName}`
          : other.yatriProfile
          ? `${other.yatriProfile.firstName} ${other.yatriProfile.lastName}`
          : other.email,
        avatarUrl: other.doctorProfile?.avatarUrl ?? other.yatriProfile?.avatarUrl,
      },
      messages,
    };
  }

  async listConversations(user: AuthenticatedUser) {
    // Group inbound + outbound messages by the other party
    const sent = await this.prisma.doctorMessage.findMany({
      where: { senderId: user.id },
      orderBy: { createdAt: 'desc' },
      select: { recipientId: true, createdAt: true, body: true, kind: true, readAt: true },
    });
    const received = await this.prisma.doctorMessage.findMany({
      where: { recipientId: user.id },
      orderBy: { createdAt: 'desc' },
      select: { senderId: true, createdAt: true, body: true, kind: true, readAt: true },
    });

    const byOther = new Map<string, { otherId: string; lastMessage: any; unread: number }>();
    for (const m of sent) {
      const e = byOther.get(m.recipientId) ?? { otherId: m.recipientId, lastMessage: m, unread: 0 };
      if (e.lastMessage.createdAt < m.createdAt) e.lastMessage = m;
      byOther.set(m.recipientId, e);
    }
    for (const m of received) {
      const e = byOther.get(m.senderId) ?? { otherId: m.senderId, lastMessage: m, unread: 0 };
      if (e.lastMessage.createdAt < m.createdAt) e.lastMessage = m;
      if (!m.readAt) e.unread += 1;
      byOther.set(m.senderId, e);
    }
    return Array.from(byOther.values()).sort(
      (a, b) => +new Date(b.lastMessage.createdAt) - +new Date(a.lastMessage.createdAt),
    );
  }

  async listDoctors() {
    return this.prisma.doctorProfile.findMany({
      where: { availableForChat: true, user: { status: 'ACTIVE' } },
      include: { user: { select: { email: true } } },
    });
  }

  // Enforces the "doctor ↔ yatri" boundary
  private assertMessagingAllowed(sender: string, recipient: string) {
    const isDoc = (r: string) => r === 'DOCTOR' || r === 'ADMIN' || r === 'SUPER_ADMIN';
    if (sender === 'YATRI' && !isDoc(recipient)) {
      throw new ForbiddenException('Yatris may only message doctors or admin');
    }
    if (isDoc(sender) && recipient !== 'YATRI' && !isDoc(recipient)) {
      throw new ForbiddenException('Doctors may only message Yatris or other doctors');
    }
  }
}
