import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { bulletinService, BulletinServiceError } from '@/lib/services/bulletin';

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    await bulletinService.delete(session, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof BulletinServiceError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    console.error('Failed to delete bulletin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
