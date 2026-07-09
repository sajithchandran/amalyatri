import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

  @Get()
  @ApiQuery({ name: 'onlyUnread', required: false, type: Boolean })
  list(@CurrentUser() user: AuthenticatedUser, @Query('onlyUnread') onlyUnread?: string) {
    return this.svc.listForUser(user, { onlyUnread: onlyUnread === 'true' });
  }

  @Patch(':id/read')
  markRead(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.svc.markRead(user, id);
  }

  @Patch('read-all')
  markAll(@CurrentUser() user: AuthenticatedUser) {
    return this.svc.markAllRead(user);
  }
}
