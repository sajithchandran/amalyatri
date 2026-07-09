import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PRISMA_CLIENT } from './prisma.module';

/**
 * Thin wrapper around the singleton Prisma client, so modules can inject
 * it via DI rather than reaching for the global. Kept tiny on purpose.
 */
@Injectable()
export class PrismaService {
  constructor(@Inject(PRISMA_CLIENT) private readonly client: PrismaClient) {}

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
