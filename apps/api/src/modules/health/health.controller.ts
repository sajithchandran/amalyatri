import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Liveness probe' })
  live() {
    return { status: 'ok', service: 'amalyatri-api', time: new Date().toISOString() };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe (DB check)' })
  async ready() {
    try {
      await this.prisma.$transaction([this.prisma.user.findFirst({ select: { id: true } })]);
      return { status: 'ok', db: 'ok' };
    } catch (err) {
      return { status: 'degraded', db: 'down', error: (err as Error).message };
    }
  }
}
