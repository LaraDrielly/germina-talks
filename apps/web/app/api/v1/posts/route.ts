import { Prisma, ScopeType } from '@prisma/client';
import { createPostSchema, postQuerySchema } from '@germina-talks/shared/content';
import { accessibleScopeWhere, canAccessContentClassroom, contentPrisma } from '@/lib/content';
import { getBulletinIdentity } from '@/lib/bulletin';

function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

export async function GET(request: Request) {
  try {
    const identity = await getBulletinIdentity();
    if (!identity) return errorResponse(401, 'UNAUTHORIZED', 'Entre para acessar o feed.');
    const params = new URL(request.url).searchParams;
    const parsed = postQuerySchema.safeParse({
      scopeType: params.get('scopeType') ?? undefined,
      classroomId: params.get('classroomId') ?? undefined,
      cursor: params.get('cursor') ?? undefined,
      limit: params.get('limit') ?? undefined,
    });
    if (!parsed.success) return errorResponse(400, 'VALIDATION_ERROR', 'Os filtros do feed são inválidos.');
    const { scopeType, classroomId, cursor, limit } = parsed.data;
    if (classroomId && !(await canAccessContentClassroom(identity, classroomId))) {
      return errorResponse(403, 'FORBIDDEN_SCOPE', 'Você não tem acesso a esta sala.');
    }
    const scopeWhere = await accessibleScopeWhere(identity, scopeType as ScopeType | undefined, classroomId);
    const where: Prisma.PostWhereInput = { ...scopeWhere, deletedAt: null };
    let cursorWhere: Prisma.PostWhereInput = {};
    if (cursor) {
      const cursorPost = await contentPrisma.post.findFirst({ where: { id: cursor, ...where }, select: { id: true, createdAt: true } });
      if (!cursorPost) return errorResponse(400, 'INVALID_CURSOR', 'O cursor do feed não é válido.');
      cursorWhere = { OR: [
        { createdAt: { lt: cursorPost.createdAt } },
        { createdAt: cursorPost.createdAt, id: { lt: cursorPost.id } },
      ] };
    }
    const rows = await contentPrisma.post.findMany({
      where: cursor ? { AND: [where, cursorWhere] } : where,
      take: limit + 1,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: { author: { select: { name: true, role: true } }, classroom: { select: { id: true, name: true, schoolTrack: true } } },
    });
    const hasMore = rows.length > limit;
    const data = rows.slice(0, limit);
    return Response.json({ data, nextCursor: hasMore ? data[data.length - 1]?.id ?? null : null });
  } catch (error) {
    console.error('Falha ao consultar o feed:', error);
    return errorResponse(500, 'INTERNAL_ERROR', 'Não foi possível carregar o feed agora.');
  }
}

export async function POST(request: Request) {
  try {
    const identity = await getBulletinIdentity();
    if (!identity) return errorResponse(401, 'UNAUTHORIZED', 'Entre para publicar.');
    let input: unknown;
    try { input = await request.json(); } catch { return errorResponse(400, 'VALIDATION_ERROR', 'Envie os dados em JSON.'); }
    const parsed = createPostSchema.safeParse(input);
    if (!parsed.success) return errorResponse(400, 'VALIDATION_ERROR', 'A publicação deve ter até 280 caracteres e um escopo válido.');
    const { content, scopeType, classroomId } = parsed.data;
    if (scopeType === ScopeType.classroom && !(await canAccessContentClassroom(identity, classroomId!))) {
      return errorResponse(403, 'FORBIDDEN_SCOPE', 'Você só pode publicar em salas das quais participa.');
    }
    const data = await contentPrisma.post.create({
      data: { authorId: identity.id, content, scopeType, classroomId: classroomId ?? null },
      include: { author: { select: { name: true, role: true } }, classroom: { select: { id: true, name: true, schoolTrack: true } } },
    });
    return Response.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Falha ao criar publicação:', error);
    return errorResponse(500, 'INTERNAL_ERROR', 'Não foi possível publicar agora.');
  }
}
