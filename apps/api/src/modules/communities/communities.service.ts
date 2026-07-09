import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@Injectable()
export class CommunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.community.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { memberships: true, posts: true } } },
    });
  }

  async getOrCreate(slug: string) {
    const c = await this.prisma.community.findUnique({ where: { slug }, include: { posts: { take: 20, orderBy: { createdAt: 'desc' } } } });
    if (!c) throw new NotFoundException('Community not found');
    return c;
  }

  async join(user: AuthenticatedUser, slug: string) {
    const c = await this.prisma.community.findUnique({ where: { slug } });
    if (!c) throw new NotFoundException();
    if (c.isPrivate) throw new ForbiddenException('This community is invite-only');
    await this.prisma.communityMembership.upsert({
      where: { communityId_userId: { communityId: c.id, userId: user.id } },
      update: {},
      create: { communityId: c.id, userId: user.id, role: 'MEMBER' },
    });
    await this.prisma.community.update({
      where: { id: c.id },
      data: { memberCount: { increment: 1 } },
    });
    return { ok: true };
  }

  async leave(user: AuthenticatedUser, slug: string) {
    const c = await this.prisma.community.findUnique({ where: { slug } });
    if (!c) throw new NotFoundException();
    await this.prisma.communityMembership.deleteMany({
      where: { communityId: c.id, userId: user.id },
    });
    await this.prisma.community.update({
      where: { id: c.id },
      data: { memberCount: { decrement: 1 } },
    });
    return { ok: true };
  }

  async myCommunities(user: AuthenticatedUser) {
    const memberships = await this.prisma.communityMembership.findMany({
      where: { userId: user.id },
      include: { community: true },
    });
    return memberships.map((m) => ({ ...m.community, myRole: m.role }));
  }

  async listPosts(slug: string) {
    const c = await this.prisma.community.findUnique({ where: { slug } });
    if (!c) throw new NotFoundException();
    return this.prisma.communityPost.findMany({
      where: { communityId: c.id, deletedAt: null },
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
      include: {
        author: { select: { id: true, yatriProfile: true, doctorProfile: true } },
        _count: { select: { comments: true, likes: true } },
      },
    });
  }

  async createPost(user: AuthenticatedUser, slug: string, body: string, title?: string) {
    const c = await this.prisma.community.findUnique({ where: { slug } });
    if (!c) throw new NotFoundException();
    return this.prisma.communityPost.create({
      data: { communityId: c.id, authorId: user.id, title, body, kind: 'DISCUSSION' },
    });
  }

  async addComment(user: AuthenticatedUser, postId: string, body: string) {
    return this.prisma.comment.create({ data: { postId, authorId: user.id, body } });
  }

  async toggleLike(user: AuthenticatedUser, postId: string) {
    const existing = await this.prisma.like.findUnique({
      where: { postId_userId: { postId, userId: user.id } },
    });
    if (existing) {
      await this.prisma.like.delete({ where: { id: existing.id } });
      return { liked: false };
    }
    await this.prisma.like.create({ data: { postId, userId: user.id } });
    return { liked: true };
  }
}
