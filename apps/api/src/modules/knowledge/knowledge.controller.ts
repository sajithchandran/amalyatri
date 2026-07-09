import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ContentKind } from '@prisma/client';
import { KnowledgeService } from './knowledge.service';

@ApiTags('knowledge')
@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly svc: KnowledgeService) {}

  @Get()
  @ApiOperation({ summary: 'List content (filter by kind / tag / page)' })
  @ApiQuery({ name: 'kind', required: false, enum: ContentKind })
  @ApiQuery({ name: 'tag', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  list(
    @Query('kind') kind?: ContentKind,
    @Query('tag') tag?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.svc.list({ kind, tag, limit: limit ? Number(limit) : undefined, offset: offset ? Number(offset) : undefined });
  }

  @Get('featured')
  @ApiOperation({ summary: 'Most-liked featured items' })
  featured() {
    return this.svc.featured();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'A single item by slug' })
  one(@Param('slug') slug: string) {
    return this.svc.getBySlug(slug);
  }
}
