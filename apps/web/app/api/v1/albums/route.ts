import { ScopeType, UserRole } from '@prisma/client';
import { createAlbumSchema } from '@germina-talks/shared/content';
import { accessibleScopeWhere, canAccessContentClassroom, canManageAlbumInClassroom, contentPrisma } from '@/lib/content';
import { getBulletinIdentity } from '@/lib/bulletin';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getPhotoBucket, getS3Client, getSignedUrl } from '@/lib/storage/s3';

function errorResponse(status: number, code: string, message: string) { return Response.json({ error: { code, message } }, { status }); }

export async function GET(request: Request) {
  try {
    const identity = await getBulletinIdentity();
    if (!identity) return errorResponse(401, 'UNAUTHORIZED', 'Entre para acessar os álbuns.');
    const params = new URL(request.url).searchParams;
    const classroomId = params.get('classroomId') ?? undefined;
    if (classroomId && !(await canAccessContentClassroom(identity, classroomId))) return errorResponse(403, 'FORBIDDEN_SCOPE', 'Você não tem acesso a esta sala.');
    const data = await contentPrisma.photoAlbum.findMany({
      where: { ...await accessibleScopeWhere(identity, classroomId ? ScopeType.classroom : undefined, classroomId), deletedAt: null },
      include: {
        classroom: { select: { id: true, name: true, schoolTrack: true } },
        _count: { select: { photos: true } },
        photos: { take: 1, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], select: { objectKey: true } },
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
    const client = getS3Client();
    const albumsWithCovers = await Promise.all(data.map(async (album) => ({
      ...album,
      coverUrl: album.photos[0]
        ? await getSignedUrl(client, new GetObjectCommand({ Bucket: getPhotoBucket(), Key: album.photos[0].objectKey }), { expiresIn: 300 })
        : null,
    })));
    return Response.json({ data: albumsWithCovers });
  } catch (error) {
    console.error('Falha ao consultar álbuns:', error);
    return errorResponse(500, 'INTERNAL_ERROR', 'Não foi possível carregar os álbuns agora.');
  }
}

export async function POST(request: Request) {
  try {
    const identity = await getBulletinIdentity();
    if (!identity) return errorResponse(401, 'UNAUTHORIZED', 'Entre para criar um álbum.');
    if (identity.role !== UserRole.teacher && identity.role !== UserRole.admin) return errorResponse(403, 'FORBIDDEN', 'Somente professores e coordenação podem criar álbuns.');
    let input: unknown;
    try { input = await request.json(); } catch { return errorResponse(400, 'VALIDATION_ERROR', 'Envie os dados em JSON.'); }
    const parsed = createAlbumSchema.safeParse(input);
    if (!parsed.success) return errorResponse(400, 'VALIDATION_ERROR', 'Confira o título, a descrição e o escopo do álbum.');
    const { title, description, scopeType, classroomId } = parsed.data;
    if (scopeType === ScopeType.classroom && !(await canManageAlbumInClassroom(identity, classroomId!))) {
      return errorResponse(403, 'FORBIDDEN_SCOPE', 'Você precisa ser professor desta sala para criar um álbum.');
    }
    const data = await contentPrisma.photoAlbum.create({
      data: { creatorId: identity.id, title, description: description || null, scopeType, classroomId: classroomId ?? null },
      include: { classroom: { select: { id: true, name: true, schoolTrack: true } }, _count: { select: { photos: true } } },
    });
    return Response.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Falha ao criar álbum:', error);
    return errorResponse(500, 'INTERNAL_ERROR', 'Não foi possível criar o álbum agora.');
  }
}
