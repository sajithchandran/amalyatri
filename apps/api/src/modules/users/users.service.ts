import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './users.dto';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /** Resolves the active profile record for the given user, regardless of role. */
  async getMyProfile(user: AuthenticatedUser) {
    const full = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        yatriProfile: true,
        doctorProfile: true,
        therapistProfile: true,
        guideProfile: true,
      },
    });
    if (!full) throw new NotFoundException('User not found');
    return {
      id: full.id,
      email: full.email,
      role: full.role,
      status: full.status,
      emailVerified: full.emailVerified,
      profile: full.yatriProfile ?? full.doctorProfile ?? full.therapistProfile ?? full.guideProfile ?? null,
    };
  }

  async updateMyProfile(user: AuthenticatedUser, dto: UpdateProfileDto) {
    const full = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { yatriProfile: true, doctorProfile: true, therapistProfile: true, guideProfile: true },
    });
    if (!full) throw new NotFoundException('User not found');

    // Pick the role-appropriate profile relation
    if (full.yatriProfile) {
      await this.prisma.yatriProfile.update({ where: { id: full.yatriProfile.id }, data: dto });
    } else if (full.doctorProfile) {
      const { firstName, lastName, displayName, city, country, bio, avatarUrl, preferredLanguage, ...rest } = dto;
      await this.prisma.doctorProfile.update({
        where: { id: full.doctorProfile.id },
        data: { firstName, lastName, bio, avatarUrl, languages: preferredLanguage ? [preferredLanguage] : undefined, ...rest },
      });
    } else if (full.guideProfile) {
      const { firstName, lastName, bio, avatarUrl, ...rest } = dto;
      await this.prisma.guideProfile.update({
        where: { id: full.guideProfile.id },
        data: { firstName, lastName, bio, avatarUrl, ...rest },
      });
    }
    return this.getMyProfile(user);
  }

  async getPublicProfile(userId: string) {
    const full = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { yatriProfile: true, doctorProfile: true },
    });
    if (!full) throw new NotFoundException('User not found');
    const p = full.yatriProfile ?? full.doctorProfile ?? null;
    if (!p) return { id: full.id, role: full.role };
    return {
      id: full.id,
      role: full.role,
      displayName: 'firstName' in p ? `${p.firstName} ${p.lastName}` : undefined,
      bio: 'bio' in p ? p.bio : null,
      avatarUrl: 'avatarUrl' in p ? p.avatarUrl : null,
      ...(full.doctorProfile ? { specialties: full.doctorProfile.specialties, yearsOfPractice: full.doctorProfile.yearsOfPractice } : {}),
    };
  }
}
