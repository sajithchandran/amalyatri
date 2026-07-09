import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WellnessTimelineController } from './wellness-timeline.controller';
import { WellnessTimelineService } from './wellness-timeline.service';

@Module({
  imports: [AuthModule],
  controllers: [WellnessTimelineController],
  providers: [WellnessTimelineService],
  exports: [WellnessTimelineService],
})
export class WellnessTimelineModule {}
