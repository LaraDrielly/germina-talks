import { NextResponse } from 'next/server';
import { prisma } from '@germina-talks/db';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const userRole = data.userRole || 'student';
    const moderatedById = data.moderatedById;
    
    if (userRole === 'student') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    if (!moderatedById || !['APPROVED', 'REJECTED'].includes(data.status)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const album = await prisma.album.update({
      where: { id: params.id },
      data: {
        status: data.status,
        moderatedById,
        moderatedAt: new Date(),
      },
    });

    return NextResponse.json(album, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to moderate album' }, { status: 500 });
  }
}
