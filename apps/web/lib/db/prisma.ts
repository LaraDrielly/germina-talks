import { PrismaClient } from '@prisma/client';
import { mockRepository } from './mock-repository';

const useMock =
  process.env.DATABASE_PROVIDER === 'mock' ||
  process.env.NEXT_PUBLIC_USE_MOCK_DB === 'true' ||
  process.env.USE_MOCK_DB === 'true' ||
  process.env.NODE_ENV === 'test';

const globalForPrisma = global as unknown as { prisma: any };

export const prisma =
  globalForPrisma.prisma ||
  (useMock
    ? mockRepository
    : new PrismaClient({
        log: ['query'],
      }));

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
