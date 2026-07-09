import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma.service';

export const PRISMA_CLIENT = Symbol('PRISMA_CLIENT');

const prisma =
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

@Global()
@Module({
  providers: [
    { provide: PRISMA_CLIENT, useValue: prisma },
    PrismaService,
  ],
  exports: [PRISMA_CLIENT, PrismaService],
})
export class PrismaModule {}
