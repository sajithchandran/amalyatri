import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto, AuthResponse } from './auth.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { UserRole, UserStatus } from '@prisma/client';

const REFRESH_TTL_DAYS = 30;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (exists) throw new ConflictException('Email already registered');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash: hash,
        role: dto.role as UserRole,
        status: dto.role === UserRole.YATRI ? UserStatus.ACTIVE : UserStatus.PENDING_VERIFICATION,
        emailVerified: false,
        phone: dto.phone,
        // Auto-create the role-appropriate profile shell
        ...(dto.role === 'YATRI'
          ? {
              yatriProfile: {
                create: {
                  firstName: dto.firstName,
                  lastName: dto.lastName,
                  displayName: dto.displayName ?? dto.firstName,
                },
              },
            }
          : dto.role === 'DOCTOR'
          ? {
              doctorProfile: {
                create: {
                  firstName: dto.firstName,
                  lastName: dto.lastName,
                  qualifications: '—',
                  specialties: [],
                },
              },
            }
          : dto.role === 'WELLNESS_GUIDE'
          ? {
              guideProfile: {
                create: {
                  firstName: dto.firstName,
                  lastName: dto.lastName,
                  speciality: '—',
                },
              },
            }
          : {}),
      },
      include: { yatriProfile: true, doctorProfile: true, guideProfile: true },
    });

    // In production: send verification email. We log it so devs can see it.
    this.logger.log(`User ${user.email} registered (status=${user.status})`);

    return this.issueTokens(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { yatriProfile: true, doctorProfile: true, guideProfile: true },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    if (user.status === UserStatus.SUSPENDED || user.status === UserStatus.DEACTIVATED) {
      throw new UnauthorizedException('Account is not active');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return this.issueTokens(user);
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const tokenHash = sha256(refreshToken);
    const row = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: { yatriProfile: true, doctorProfile: true, guideProfile: true },
        },
      },
    });
    if (!row || row.revokedAt || row.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    // Rotate: revoke old, issue new
    await this.prisma.refreshToken.update({
      where: { id: row.id },
      data: { revokedAt: new Date() },
    });
    return this.issueTokens(row.user);
  }

  async logout(refreshToken: string): Promise<{ ok: true }> {
    if (!refreshToken) return { ok: true };
    const tokenHash = sha256(refreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { ok: true };
  }

  async forgotPassword(email: string): Promise<{ ok: true }> {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return { ok: true }; // do not leak existence
    const token = generateOpaqueToken();
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: sha256(token),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1h
      },
    });
    // In production: email token. For dev we log it.
    this.logger.warn(`Password-reset link for ${user.email}: /reset?token=${token}`);
    return { ok: true };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ ok: true }> {
    const row = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash: sha256(token) },
    });
    if (!row || row.usedAt || row.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: row.userId }, data: { passwordHash: hash } });
      await tx.passwordResetToken.update({
        where: { id: row.id },
        data: { usedAt: new Date() },
      });
      await tx.refreshToken.updateMany({
        where: { userId: row.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    });
    return { ok: true };
  }

  // ── private ──────────────────────────────────────────────────────────────
  private async issueTokens(user: {
    id: string;
    email: string;
    role: UserRole;
    yatriProfile?: { firstName: string; lastName: string } | null;
    doctorProfile?: { firstName: string; lastName: string } | null;
    guideProfile?: { firstName: string; lastName: string } | null;
  }): Promise<AuthResponse> {
    const accessExpiresIn = this.cfg.get<string>('JWT_ACCESS_TTL') ?? '15m';
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email, role: user.role },
      { expiresIn: accessExpiresIn },
    );

    const refreshOpaque = generateOpaqueToken();
    const refreshTtlDays =
      Number(this.cfg.get<string>('JWT_REFRESH_TTL_DAYS') ?? REFRESH_TTL_DAYS);
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: sha256(refreshOpaque),
        expiresAt: new Date(Date.now() + refreshTtlDays * 86400 * 1000),
      },
    });

    const firstName =
      user.yatriProfile?.firstName ??
      user.doctorProfile?.firstName ??
      user.guideProfile?.firstName;
    const lastName =
      user.yatriProfile?.lastName ??
      user.doctorProfile?.lastName ??
      user.guideProfile?.lastName;

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName,
        lastName,
      },
      accessToken,
      refreshToken: refreshOpaque,
      accessExpiresInSec: parseTtlSeconds(accessExpiresIn),
    };
  }
}

function generateOpaqueToken(): string {
  return crypto.randomBytes(48).toString('base64url');
}

export function sha256(s: string): string {
  return crypto.createHash('sha256').update(s).digest('hex');
}

function parseTtlSeconds(ttl: string): number {
  const m = /^(\d+)([smhd])$/.exec(ttl);
  if (!m) return 900;
  const v = Number(m[1]);
  return { s: 1, m: 60, h: 3600, d: 86400 }[m[2] as 's' | 'm' | 'h' | 'd']! * v;
}
