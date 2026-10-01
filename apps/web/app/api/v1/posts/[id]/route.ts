import { getBulletinIdentity } from '@/lib/bulletin';
import { contentPrisma } from '@/lib/content';
import { z } from 'zod';

function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const identity = await getBulletinIdentity();
    if (!identity) return errorResponse(401, 'UNAUTHORIZED', 'Entre para excluir uma publicação.');
    const { id } = await context.params;
    if (!z.string().uuid().safeParse(id).success) return errorResponse(400, 'VALIDATION_ERROR', 'O identificador da publicação é inválido.');
    const post = await contentPrisma.post.findFirst({ where: { id, deletedAt: null }, select: { id: true, authorId: true } });
    if (!post) return errorResponse(404, 'NOT_FOUND', 'Publicação não encontrada.');
    if (post.authorId !== identity.id) return errorResponse(403, 'FORBIDDEN', 'Você só pode excluir suas próprias publicações.');
    await contentPrisma.post.update({ where: { id }, data: { deletedAt: new Date() } });
    return Response.json({ data: { id, deleted: true } });
  } catch (error) {
    console.error('Falha ao excluir publicação:', error);
    return errorResponse(500, 'INTERNAL_ERROR', 'Não foi possível excluir a publicação agora.');
  }
}
