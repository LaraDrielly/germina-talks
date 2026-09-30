import { NextResponse } from 'next/server';
import { prisma } from '@germina-talks/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Simulating user role retrieval from auth token/session
    // In a real app, this comes from auth context (e.g. Auth.js)
    const userRole = data.userRole || 'student'; 
    const createdById = data.createdById; 

    if (!createdById) {
      return NextResponse.json({ error: 'createdById is required' }, { status: 400 });
    }

    const status = userRole === 'student' ? 'PENDING' : 'APPROVED';

    const album = await prisma.album.create({
      data: {
        title: data.title,
        description: data.description,
        scope: data.scope || 'global',
        classroomId: data.classroomId,
        createdById,
        status,
      },
    });

    return NextResponse.json(album, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create album' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('userRole') || 'student';

    // Se admin ou professor, retorna tudo
    // Se aluno, retorna APPROVED e os seus próprios PENDING/REJECTED
    
    const whereClause: any = {};
    
    if (userRole === 'student') {
      whereClause.OR = [
        { status: 'APPROVED' },
        { createdById: userId }
      ];
    }

    const albums = await prisma.album.findMany({
      where: whereClause,
      include: {
        createdBy: true
      }
    });

    return NextResponse.json(albums, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to list albums' }, { status: 500 });
  }
}
