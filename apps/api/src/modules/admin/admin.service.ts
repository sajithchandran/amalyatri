import { Injectable } from '@nestjs/common';
import { UserRole, UserStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Admin-only operations. Every method assumes the RolesGuard has already
 * verified the caller is in { ADMIN, SUPER_ADMIN }.
 */
@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async kpis() {
    const [users, yatris, doctors, communities, posts, aiConvs, activeSubs] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: UserRole.YATRI, status: UserStatus.ACTIVE } }),
      this.prisma.doctorProfile.count(),
      this.prisma.community.count(),
      this.prisma.communityPost.count({ where: { deletedAt: null } }),
      this.prisma.aiConversation.count(),
      this.prisma.eventRegistration.count(),
    ]);
    return {
      totalUsers: users,
      activeYatris: yatris,
      doctors,
      communities,
      posts,
      aiConversations: aiConvs,
      eventRegistrations: activeSubs,
    };
  }

  listUsers(opts: { role?: UserRole; status?: UserStatus; limit?: number; offset?: number } = {}) {
    const { role, status, limit = 50, offset = 0 } = opts;
    return this.prisma.user.findMany({
      where: { ...(role ? { role } : {}), ...(status ? { status } : {}) },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, role: true, status: true, createdAt: true, lastLoginAt: true },
    });
  }

  updateUserStatus(userId: string, status: UserStatus) {
    return this.prisma.user.update({ where: { id: userId }, data: { status } });
  }
}
