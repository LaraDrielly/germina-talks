import { ScopeType, UserRole } from '@prisma/client';
import { createBulletinSchema, bulletinQuerySchema } from '@germina-talks/shared/bulletin';
import {
  bulletinPrisma,
  canAccessBulletinClassroom,
  canPinBulletin,
  findAccessibleBulletins,
  getBulletinIdentity,
} from '@/lib/bulletin';

function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

export async function GET(request: Request) {
  try {
    const identity = await getBulletinIdentity();
    if (!identity) return errorResponse(401, 'UNAUTHORIZED', 'Entre para acessar o mural.');

    const params = new URL(request.url).searchParams;
    const parsedQuery = bulletinQuerySchema.safeParse({
      scopeType: params.get('scopeType') ?? undefined,
      classroomId: params.get('classroomId') ?? undefined,
    });
    if (!parsedQuery.success) {
      return errorResponse(400, 'VALIDATION_ERROR', 'Os filtros informados para o mural são inválidos.');
    }

    const { scopeType, classroomId } = parsedQuery.data;
    if (classroomId && !(await canAccessBulletinClassroom(identity, classroomId))) {
      return errorResponse(403, 'FORBIDDEN_SCOPE', 'Você não tem acesso a esta sala.');
    }

    const data = await findAccessibleBulletins(identity, {
      scopeType: scopeType as ScopeType | undefined,
      classroomId,
    });
    return Response.json({ data });
  } catch (error) {
    console.error('Falha ao consultar o mural:', error);
    return errorResponse(500, 'INTERNAL_ERROR', 'Não foi possível carregar os recados agora.');
  }
}

export async function POST(request: Request) {
  try {
    const identity = await getBulletinIdentity();
    if (!identity) return errorResponse(401, 'UNAUTHORIZED', 'Entre para publicar um recado.');

    let input: unknown;
    try {
      input = await request.json();
    } catch {
      return errorResponse(400, 'VALIDATION_ERROR', 'Envie os dados do recado em JSON.');
    }

    const parsedInput = createBulletinSchema.safeParse(input);
    if (!parsedInput.success) {
      return errorResponse(400, 'VALIDATION_ERROR', 'Confira o título, o texto, o escopo e a data do recado.');
    }
    const { title, body, scopeType, classroomId, isPinned, expiresAt } = parsedInput.data;

    if (scopeType === ScopeType.global && identity.role !== UserRole.admin) {
      return errorResponse(403, 'FORBIDDEN', 'Somente a coordenação pode publicar recados para toda a escola.');
    }
    if (scopeType === ScopeType.classroom && !(await canAccessBulletinClassroom(identity, classroomId!))) {
      return errorResponse(403, 'FORBIDDEN_SCOPE', 'Você só pode publicar em salas das quais participa.');
    }
    if (isPinned && !(await canPinBulletin(identity, scopeType === ScopeType.classroom ? classroomId! : null))) {
      return errorResponse(403, 'FORBIDDEN', 'Apenas professores da sala e coordenação podem fixar recados.');
    }

    const data = await bulletinPrisma.bulletinItem.create({
      data: {
        title,
        body,
        isPinned,
        scopeType,
        classroomId: scopeType === ScopeType.classroom ? classroomId : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        authorId: identity.id,
      },
      include: {
        author: { select: { name: true, role: true } },
        classroom: { select: { id: true, name: true, schoolTrack: true } },
      },
    });
    return Response.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Falha ao criar recado:', error);
    return errorResponse(500, 'INTERNAL_ERROR', 'Não foi possível publicar o recado agora.');
  }
}
