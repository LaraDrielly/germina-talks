import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { confirmPhotoSchema } from '@germina-talks/shared/content';
import { getBulletinIdentity } from '@/lib/bulletin';
import { canAccessContentClassroom, contentPrisma } from '@/lib/content';
import { getPhotoBucket, getS3Client, getSignedUrl } from '@/lib/storage/s3';

function errorResponse(status: number, code: string, message: string) { return Response.json({ error: { code, message } }, { status }); }
type Context = { params: Promise<{ id: string }> };

function matchesImageSignature(contentType: string, bytes: Uint8Array) {
  if (contentType === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (contentType === 'image/png') return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value);
  if (contentType === 'image/webp') return String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
  return false;
}

async function getAlbumForIdentity(id: string, identity: NonNullable<Awaited<ReturnType<typeof getBulletinIdentity>>>) {
  const album = await contentPrisma.photoAlbum.findFirst({ where: { id, deletedAt: null } });
  if (!album) return { album: null, denied: false };
  if (album.classroomId && !(await canAccessContentClassroom(identity, album.classroomId))) return { album: null, denied: true };
  return { album, denied: false };
}

export async function GET(_request: Request, context: Context) {
  try {
    const identity = await getBulletinIdentity();
    if (!identity) return errorResponse(401, 'UNAUTHORIZED', 'Entre para acessar as fotos.');
    const { id } = await context.params;
    if (!z.string().uuid().safeParse(id).success) return errorResponse(400, 'VALIDATION_ERROR', 'O identificador do álbum é inválido.');
    const { album, denied } = await getAlbumForIdentity(id, identity);
    if (denied) return errorResponse(403, 'FORBIDDEN_SCOPE', 'Você não tem acesso a este álbum.');
    if (!album) return errorResponse(404, 'NOT_FOUND', 'Álbum não encontrado.');
    const photos = await contentPrisma.photo.findMany({
      where: { albumId: id }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: { uploader: { select: { name: true } } },
    });
    const client = getS3Client();
    const data = await Promise.all(photos.map(async (photo) => ({
      ...photo,
      url: await getSignedUrl(client, new GetObjectCommand({ Bucket: getPhotoBucket(), Key: photo.objectKey }), { expiresIn: 300 }),
    })));
    return Response.json({ data: { album, photos: data } });
  } catch (error) {
    console.error('Falha ao consultar fotos:', error);
    return errorResponse(500, 'INTERNAL_ERROR', 'Não foi possível carregar as fotos agora.');
  }
}

export async function POST(request: Request, context: Context) {
  try {
    const identity = await getBulletinIdentity();
    if (!identity) return errorResponse(401, 'UNAUTHORIZED', 'Entre para confirmar o envio.');
    const { id } = await context.params;
    if (!z.string().uuid().safeParse(id).success) return errorResponse(400, 'VALIDATION_ERROR', 'O identificador do álbum é inválido.');
    let input: unknown;
    try { input = await request.json(); } catch { return errorResponse(400, 'VALIDATION_ERROR', 'Envie os dados da foto em JSON.'); }
    const parsed = confirmPhotoSchema.safeParse(input);
    if (!parsed.success) return errorResponse(400, 'VALIDATION_ERROR', 'Os dados da foto são inválidos.');
    const { album, denied } = await getAlbumForIdentity(id, identity);
    if (denied) return errorResponse(403, 'FORBIDDEN_SCOPE', 'Você não tem acesso a este álbum.');
    if (!album) return errorResponse(404, 'NOT_FOUND', 'Álbum não encontrado.');
    const { objectKey, contentType, sizeBytes, caption } = parsed.data;
    if (!objectKey.startsWith(`albums/${id}/${identity.id}/`)) return errorResponse(403, 'FORBIDDEN', 'A chave do arquivo não pertence a este envio.');
    const object = await getS3Client().send(new HeadObjectCommand({ Bucket: getPhotoBucket(), Key: objectKey }));
    if (object.ContentLength !== sizeBytes || object.ContentType !== contentType) return errorResponse(400, 'UPLOAD_MISMATCH', 'O arquivo enviado não corresponde aos dados informados.');
    const sample = await getS3Client().send(new GetObjectCommand({ Bucket: getPhotoBucket(), Key: objectKey, Range: 'bytes=0-15' }));
    const signature = sample.Body ? await sample.Body.transformToByteArray() : new Uint8Array();
    if (!matchesImageSignature(contentType, signature)) return errorResponse(400, 'INVALID_IMAGE', 'O conteúdo do arquivo não corresponde a uma imagem permitida.');
    const data = await contentPrisma.$transaction(async (tx) => {
      const count = await tx.photo.count({ where: { albumId: id } });
      if (count >= 50) throw new Error('ALBUM_LIMIT');
      return tx.photo.create({ data: { albumId: id, uploaderId: identity.id, objectKey, contentType, sizeBytes, caption: caption || null } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return Response.json({ data }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'ALBUM_LIMIT') return errorResponse(400, 'ALBUM_LIMIT', 'Este álbum já atingiu o limite de 50 fotos.');
    console.error('Falha ao confirmar foto:', error);
    return errorResponse(500, 'STORAGE_ERROR', 'Não foi possível registrar a foto enviada.');
  }
}
