/**
 * Legado / não canônico.
 * O feed da UI usa GET|POST /api/v1/posts?classroomId= (ver docs/technical/api-contracts.md).
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getPosts, createPost } from '@/lib/services/content';
import { authOptions } from '@/auth';

type RouteContext = { params: Promise<{ id: string }> | { id: string } };

export async function GET(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { id } = await Promise.resolve(context.params);

  try {
    const posts = await getPosts(session.user.id, 'classroom', id);
    return NextResponse.json(posts);
  } catch (e) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }
}

export async function POST(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { id } = await Promise.resolve(context.params);
  const body = await req.json();
  try {
    const post = await createPost(session.user.id, { ...body, scopeType: 'classroom', classroomId: id });
    return NextResponse.json(post, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }
}
