import { UserRole } from '@prisma/client';
import {
  bulletinPrisma,
  canPinBulletin,
  getBulletinIdentity,
} from '@/lib/bulletin';

type RouteContext = { params: Promise<{ id: string }> };

function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

export async function POST(_request: Request, context: RouteContext) {
  try {
  const identity = await getBulletinIdentity();
  if (!identity) return errorResponse(401, 'UNAUTHORIZED', 'Entre para fixar um recado.');
  if (identity.role !== UserRole.teacher && identity.role !== UserRole.admin) {
    return errorResponse(403, 'FORBIDDEN', 'Apenas professores e coordenação podem fixar recados.');
  }

  const { id } = await context.params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return errorResponse(400, 'VALIDATION_ERROR', 'O identificador do recado é inválido.');
  }
  const item = await bulletinPrisma.bulletinItem.findUnique({ where: { id } });
  if (!item) return errorResponse(404, 'NOT_FOUND', 'Este recado não foi encontrado.');
  if (!(await canPinBulletin(identity, item.classroomId))) {
    return errorResponse(403, 'FORBIDDEN_SCOPE', 'Você não pode fixar recados desta sala.');
  }

  const data = await bulletinPrisma.bulletinItem.update({
    where: { id },
    data: { isPinned: true },
    include: {
      author: { select: { name: true, role: true } },
      classroom: { select: { id: true, name: true, schoolTrack: true } },
    },
  });
  return Response.json({ data });
  } catch (error) {
    console.error('Falha ao fixar recado:', error);
    return errorResponse(500, 'INTERNAL_ERROR', 'Não foi possível fixar o recado agora.');
  }
}
