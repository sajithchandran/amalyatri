import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WellnessTimelineModule } from './modules/wellness-timeline/wellness-timeline.module';
import { DoctorConnectModule } from './modules/doctor-connect/doctor-connect.module';
import { CommunitiesModule } from './modules/communities/communities.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { EventsModule } from './modules/events/events.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AiAssistantModule } from './modules/ai-assistant/ai-assistant.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../../.env'] }),
    ThrottlerModule.forRoot([{
      ttl: Number(process.env.THROTTLE_TTL ?? 60) * 1000,
      limit: Number(process.env.THROTTLE_LIMIT ?? 120),
    }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    WellnessTimelineModule,
    DoctorConnectModule,
    CommunitiesModule,
    KnowledgeModule,
    EventsModule,
    NotificationsModule,
    AiAssistantModule,
    AdminModule,
    HealthModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
