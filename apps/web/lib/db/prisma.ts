import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as typeof globalThis & { germinaPrisma?: PrismaClient };

export const prisma = globalForPrisma.germinaPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.germinaPrisma = prisma;
}

export { PrismaClient };