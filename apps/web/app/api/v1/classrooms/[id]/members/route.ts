import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getClassroomMembers, addMemberToClassroom, removeMemberFromClassroom } from '@/lib/services/classroom';
import { authOptions } from '@/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const members = await getClassroomMembers(params.id);
  return NextResponse.json(members);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Apenas administradores podem gerenciar membros' }, { status: 403 });
  }

  const { userId, role } = await req.json();
  const member = await addMemberToClassroom(params.id, userId, role, session.user.id);
  return NextResponse.json(member, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Apenas administradores podem gerenciar membros' }, { status: 403 });
  }

  const { userId } = await req.json();
  await removeMemberFromClassroom(params.id, userId, session.user.id);
  return NextResponse.json({ success: true });
}
