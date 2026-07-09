import { Global, Module } from '@nestjs/common';
import { prisma } from '@amalyatri/prisma';
import { PrismaService } from './prisma.service';

export const PRISMA_CLIENT = Symbol('PRISMA_CLIENT');

@Global()
@Module({
  providers: [
    { provide: PRISMA_CLIENT, useValue: prisma },
    PrismaService,
  ],
  exports: [PRISMA_CLIENT, PrismaService],
})
export class PrismaModule {}
