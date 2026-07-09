import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentKind } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class KnowledgeService {
  constructor(private readonly prisma: PrismaService) {}

  async list(opts: { kind?: ContentKind; tag?: string; limit?: number; offset?: number } = {}) {
    const { kind, tag, limit = 24, offset = 0 } = opts;
    return this.prisma.knowledgeItem.findMany({
      where: {
        publishedAt: { not: null },
        ...(kind ? { kind } : {}),
        ...(tag ? { tags: { has: tag } } : {}),
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getBySlug(slug: string) {
    const item = await this.prisma.knowledgeItem.findUnique({
      where: { slug },
      include: { authorDoctor: true },
    });
    if (!item || !item.publishedAt) throw new NotFoundException();
    await this.prisma.knowledgeItem.update({
      where: { id: item.id },
      data: { viewCount: { increment: 1 } },
    });
    return item;
  }

  async featured(limit = 6) {
    return this.prisma.knowledgeItem.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { likeCount: 'desc' },
      take: limit,
    });
  }
}
