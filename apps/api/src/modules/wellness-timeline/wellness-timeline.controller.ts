import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { WellnessTimelineService } from './wellness-timeline.service';
import {
  CreateAssessmentDto,
  CreateGoalDto,
  CreateRetreatDto,
  CreateTimelineEventDto,
  UpdateGoalDto,
} from './dto';

@ApiTags('wellness-timeline')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wellness-timeline')
export class WellnessTimelineController {
  constructor(private readonly svc: WellnessTimelineService) {}

  // ── Retreats ─────────────────────────────────────────────────────────────
  @Get('retreats')
  @ApiOperation({ summary: 'My retreats' })
  retreats(@CurrentUser() user: AuthenticatedUser) {
    return this.svc.listRetreats(user);
  }

  @Post('retreats')
  @ApiOperation({ summary: 'Record a completed retreat' })
  createRetreat(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateRetreatDto) {
    return this.svc.createRetreat(user, dto);
  }

  // ── Assessments ──────────────────────────────────────────────────────────
  @Get('assessments')
  @ApiOperation({ summary: 'My wellness assessments over time' })
  assessments(@CurrentUser() user: AuthenticatedUser) {
    return this.svc.listAssessments(user);
  }

  @Post('assessments')
  @ApiOperation({ summary: 'Record a new assessment' })
  createAssessment(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateAssessmentDto) {
    return this.svc.createAssessment(user, dto);
  }

  // ── Goals ─────────────────────────────────────────────────────────────────
  @Get('goals')
  @ApiOperation({ summary: 'My active and past goals' })
  goals(@CurrentUser() user: AuthenticatedUser) {
    return this.svc.listGoals(user);
  }

  @Post('goals')
  @ApiOperation({ summary: 'Create a new goal' })
  createGoal(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateGoalDto) {
    return this.svc.createGoal(user, dto);
  }

  @Patch('goals/:id')
  @ApiOperation({ summary: 'Update goal progress' })
  updateGoal(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateGoalDto,
  ) {
    return this.svc.updateGoal(user, id, dto);
  }

  // ── Timeline ─────────────────────────────────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'My lifelong wellness timeline (retreats + events)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, type: String })
  timeline(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
  ) {
    return this.svc.getTimeline(user, {
      limit: limit ? Number(limit) : undefined,
      type,
    });
  }

  @Post('events')
  @ApiOperation({ summary: 'Add a custom event to my timeline' })
  addEvent(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTimelineEventDto) {
    return this.svc.addTimelineEvent(user, dto);
  }
}
