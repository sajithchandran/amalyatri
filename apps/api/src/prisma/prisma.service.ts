import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Thin DI-friendly wrapper around the singleton Prisma client.
 *
 * Construction order in NestJS made the @Inject(PRISMA_CLIENT) symbol-token
 * dance finicky across @Global module boundaries. Simplest reliable form:
 * instantiate PrismaClient directly here (it has its own internal pooling
 * + dev hot-reload guard). Everything that imports PrismaService gets the
 * same client.
 */
@Injectable()
export class PrismaService {
  readonly client: PrismaClient;

  constructor() {
    this.client = new PrismaClient({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).__prisma = this.client;
    }
  }

  get user() { return this.client.user; }
  get yatriProfile() { return this.client.yatriProfile; }
  get doctorProfile() { return this.client.doctorProfile; }
  get retreat() { return this.client.retreat; }
  get panchakarmaProgram() { return this.client.panchakarmaProgram; }
  get wellnessAssessment() { return this.client.wellnessAssessment; }
  get wellnessGoal() { return this.client.wellnessGoal; }
  get wellnessPlan() { return this.client.wellnessPlan; }
  get medicineReminder() { return this.client.medicineReminder; }
  get timelineEvent() { return this.client.timelineEvent; }
  get doctorMessage() { return this.client.doctorMessage; }
  get consultation() { return this.client.consultation; }
  get therapistProfile() { return this.client.therapistProfile; }
  get wellnessGuideProfile() { return this.client.wellnessGuideProfile; }
  get community() { return this.client.community; }
  get communityMembership() { return this.client.communityMembership; }
  get communityPost() { return this.client.communityPost; }
  get comment() { return this.client.comment; }
  get like() { return this.client.like; }
  get knowledgeItem() { return this.client.knowledgeItem; }
  get event() { return this.client.event; }
  get eventRegistration() { return this.client.eventRegistration; }
  get aiConversation() { return this.client.aiConversation; }
  get aiMessage() { return this.client.aiMessage; }
  get notification() { return this.client.notification; }
  get mediaAsset() { return this.client.mediaAsset; }
  get auditLog() { return this.client.auditLog; }
  get refreshToken() { return this.client.refreshToken; }
  get session() { return this.client.session; }
  get passwordResetToken() { return this.client.passwordResetToken; }
  get emailVerificationToken() { return this.client.emailVerificationToken; }

  $transaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
    return this.client.$transaction(fn);
  }
  $connect() { return this.client.$connect(); }
  $disconnect() { return this.client.$disconnect(); }
}
