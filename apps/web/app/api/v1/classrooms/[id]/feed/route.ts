import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getPosts, createPost } from '@/lib/services/content';
import { authOptions } from '@/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const posts = await getPosts(session.user.id, 'classroom', params.id);
    return NextResponse.json(posts);
  } catch (e) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const body = await req.json();
  try {
    const post = await createPost(session.user.id, { ...body, scopeType: 'classroom', classroomId: params.id });
    return NextResponse.json(post, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }
}
