import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getClassroomsForUser, getAllClassrooms, createClassroom } from '@/lib/services/classroom';
import { authOptions } from '@/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const classrooms = await getClassroomsForUser(session.user.id, session.user.role);
  return NextResponse.json(classrooms);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Apenas administradores podem criar salas' }, { status: 403 });
  }

  const body = await req.json();
  try {
    const classroom = await createClassroom(body, session.user.id);
    return NextResponse.json(classroom, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar sala' }, { status: 400 });
  }
}
