import { PrismaClient } from '@prisma/client';

// Centralised Prisma client. Re-exported so apps import from one place:
//   import { prisma } from '@amalyatri/prisma';
//
// In NestJS we register it via a Global module, but for scripts and tests
// this singleton is fine.

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.__prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV === 'development') {
  global.__prisma = prisma;
}

export * from '@prisma/client';
export default prisma;
