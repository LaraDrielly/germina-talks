import { prisma } from '../../../lib/db/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return Response.json({
      ok: true,
      service: 'germina-talks',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      {
        ok: true,
        service: 'germina-talks',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Database unavailable',
      },
      { status: 200 },
    );
  }
}
