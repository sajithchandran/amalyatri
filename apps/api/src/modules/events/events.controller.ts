import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { EventsService } from './events.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly svc: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'List published events (optionally upcoming only)' })
  @ApiQuery({ name: 'upcoming', required: false, type: Boolean })
  list(@Query('upcoming') upcoming?: string) {
    return this.svc.list({ upcomingOnly: upcoming === 'true' });
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Events I am registered for' })
  mine(@CurrentUser() user: AuthenticatedUser) {
    return this.svc.myRegistrations(user);
  }

  @Post(':id/register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  register(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.svc.register(user, id);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  cancel(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.svc.cancel(user, id);
  }
}
