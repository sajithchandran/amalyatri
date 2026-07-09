import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { CommunitiesService } from './communities.service';

@ApiTags('communities')
@Controller('communities')
export class CommunitiesController {
  constructor(private readonly svc: CommunitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Browse all communities' })
  list() {
    return this.svc.list();
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Communities I have joined' })
  mine(@CurrentUser() user: AuthenticatedUser) {
    return this.svc.myCommunities(user);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'A single community' })
  one(@Param('slug') slug: string) {
    return this.svc.getOrCreate(slug);
  }

  @Post(':slug/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  join(@CurrentUser() user: AuthenticatedUser, @Param('slug') slug: string) {
    return this.svc.join(user, slug);
  }

  @Post(':slug/leave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  leave(@CurrentUser() user: AuthenticatedUser, @Param('slug') slug: string) {
    return this.svc.leave(user, slug);
  }

  @Get(':slug/posts')
  @ApiOperation({ summary: 'Posts in this community (newest first, pinned on top)' })
  posts(@Param('slug') slug: string) {
    return this.svc.listPosts(slug);
  }

  @Post(':slug/posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a discussion' })
  createPost(
    @CurrentUser() user: AuthenticatedUser,
    @Param('slug') slug: string,
    @Body('body') body: string,
    @Body('title') title?: string,
  ) {
    return this.svc.createPost(user, slug, body, title);
  }

  @Post('posts/:id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Comment on a post' })
  comment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body('body') body: string,
  ) {
    return this.svc.addComment(user, id, body);
  }

  @Post('posts/:id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle like on a post' })
  like(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.svc.toggleLike(user, id);
  }
}
