import { randomUUID } from 'node:crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { uploadIntentSchema } from '@germina-talks/shared/content';
import { getBulletinIdentity } from '@/lib/bulletin';
import { canAccessContentClassroom, contentPrisma } from '@/lib/content';
import { ensurePhotoBucket, getPhotoBucket, getS3Client, getSignedUrl } from '@/lib/storage/s3';

function errorResponse(status: number, code: string, message: string) { return Response.json({ error: { code, message } }, { status }); }

export async function POST(request: Request) {
  try {
    const identity = await getBulletinIdentity();
    if (!identity) return errorResponse(401, 'UNAUTHORIZED', 'Entre para enviar uma foto.');
    let input: unknown;
    try { input = await request.json(); } catch { return errorResponse(400, 'VALIDATION_ERROR', 'Envie os dados do arquivo em JSON.'); }
    const parsed = uploadIntentSchema.safeParse(input);
    if (!parsed.success) return errorResponse(400, 'VALIDATION_ERROR', 'Envie uma imagem JPEG, PNG ou WebP de até 10 MB.');
    const album = await contentPrisma.photoAlbum.findFirst({ where: { id: parsed.data.albumId, deletedAt: null } });
    if (!album) return errorResponse(404, 'NOT_FOUND', 'Álbum não encontrado.');
    if (album.classroomId && !(await canAccessContentClassroom(identity, album.classroomId))) return errorResponse(403, 'FORBIDDEN_SCOPE', 'Você não tem acesso a este álbum.');
    const count = await contentPrisma.photo.count({ where: { albumId: album.id } });
    if (count >= 50) return errorResponse(400, 'ALBUM_LIMIT', 'Este álbum já atingiu o limite de 50 fotos.');
    await ensurePhotoBucket();
    const extension = parsed.data.contentType === 'image/jpeg' ? 'jpg' : parsed.data.contentType.split('/')[1];
    const objectKey = `albums/${album.id}/${identity.id}/${randomUUID()}.${extension}`;
    const url = await getSignedUrl(getS3Client(), new PutObjectCommand({
      Bucket: getPhotoBucket(), Key: objectKey, ContentType: parsed.data.contentType, ContentLength: parsed.data.sizeBytes,
    }), { expiresIn: 300 });
    return Response.json({ data: { uploadUrl: url, objectKey, expiresIn: 300 } });
  } catch (error) {
    console.error('Falha ao gerar URL de upload:', error);
    return errorResponse(500, 'STORAGE_ERROR', 'Não foi possível preparar o envio da foto.');
  }
}
