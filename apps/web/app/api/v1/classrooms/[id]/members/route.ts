import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getClassroomMembers, addMemberToClassroom, removeMemberFromClassroom } from '@/lib/services/classroom';
import { authOptions } from '@/auth';

type RouteContext = { params: Promise<{ id: string }> | { id: string } };

export async function GET(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { id } = await Promise.resolve(context.params);
  const members = await getClassroomMembers(id);
  return NextResponse.json(members);
}

export async function POST(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Apenas administradores podem gerenciar membros' }, { status: 403 });
  }

  const { id } = await Promise.resolve(context.params);
  const { userId, role } = await req.json();
  const member = await addMemberToClassroom(id, userId, role, session.user.id);
  return NextResponse.json(member, { status: 201 });
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Apenas administradores podem gerenciar membros' }, { status: 403 });
  }

  const { id } = await Promise.resolve(context.params);
  const { userId } = await req.json();
  await removeMemberFromClassroom(id, userId, session.user.id);
  return NextResponse.json({ success: true });
}
