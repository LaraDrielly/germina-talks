import {
  ContentStatus,
  ScopeType,
  UserRole,
  type PrismaClient,
} from '@prisma/client';
import type { Session } from 'next-auth';
import {
  createAlbumSchema,
  listAlbumsQuerySchema,
  moderationActionSchema,
  type CreateAlbumInput,
  type ListAlbumsQuery,
  type ModerationActionInput,
} from '@germina-talks/shared';
import { prisma } from '../db/prisma';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export class AlbumServiceError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'AlbumServiceError';
  }
}

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

type SessionActor = {
  email: string;
  name: string;
  role: UserRole;
};

function statusForRole(role: UserRole): ContentStatus {
  return role === UserRole.student ? ContentStatus.pending : ContentStatus.approved;
}

export class AlbumsService {
  constructor(private readonly db: PrismaClient) {}

  private requireActor(session: Session | null): SessionActor {
    const email = session?.user?.email?.trim().toLowerCase();
    const role = session?.user?.role;

    if (!email || !role || !Object.values(UserRole).includes(role as UserRole)) {
      throw new AlbumServiceError(401, 'UNAUTHORIZED', 'Autenticação necessária.');
    }

    return {
      email,
      name: session.user.name?.trim() || email.split('@')[0],
      role: role as UserRole,
    };
  }

  private async resolveActor(session: Session | null) {
    const actor = this.requireActor(session);
    const user = await this.db.user.upsert({
      where: { email: actor.email },
      update: { name: actor.name, role: actor.role },
      create: actor,
    });
    return { actor, user };
  }

  private async requireClassroomMembership(userId: string, classroomId: string, role: UserRole) {
    if (role === UserRole.admin) return;
    const membership = await this.db.classroomMember.findUnique({
      where: { userId_classroomId: { userId, classroomId } },
      select: { userId: true },
    });
    if (!membership) {
      throw new AlbumServiceError(403, 'FORBIDDEN_SCOPE', 'Você não tem acesso a esta sala.');
    }
  }

  private publicAlbumWhere(userId: string, role: UserRole) {
    if (role === UserRole.admin) {
      return {};
    }
    return {
      OR: [{ status: ContentStatus.approved }, { createdBy: userId }],
    };
  }

  async list(session: Session | null, queryInput: ListAlbumsQuery) {
    const query = listAlbumsQuerySchema.parse(queryInput);
    const { actor, user } = await this.resolveActor(session);

    if (query.classroomId) {
      await this.requireClassroomMembership(user.id, query.classroomId, actor.role);
    }

    const albums = await this.db.album.findMany({
      where: {
        ...(query.classroomId
          ? { scopeType: ScopeType.classroom, classroomId: query.classroomId }
          : { scopeType: ScopeType.global, classroomId: null }),
        ...this.publicAlbumWhere(user.id, actor.role),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        photos: {
          where:
            actor.role === UserRole.admin
              ? undefined
              : {
                  OR: [{ status: ContentStatus.approved }, { uploadedBy: user.id }],
                },
          orderBy: { createdAt: 'desc' },
        },
        creator: { select: { id: true, name: true, role: true } },
      },
    });

    return { data: albums, meta: { viewerId: user.id } };
  }

  async getById(session: Session | null, id: string) {
    const { actor, user } = await this.resolveActor(session);
    const album = await this.db.album.findUnique({
      where: { id },
      include: {
        photos: {
          where:
            actor.role === UserRole.admin
              ? undefined
              : {
                  OR: [{ status: ContentStatus.approved }, { uploadedBy: user.id }],
                },
          orderBy: { createdAt: 'desc' },
        },
        creator: { select: { id: true, name: true, role: true } },
      },
    });

    if (!album) {
      throw new AlbumServiceError(404, 'NOT_FOUND', 'Álbum não encontrado.');
    }

    if (album.classroomId) {
      await this.requireClassroomMembership(user.id, album.classroomId, actor.role);
    }

    const visible =
      actor.role === UserRole.admin ||
      album.status === ContentStatus.approved ||
      album.createdBy === user.id;
    if (!visible) {
      throw new AlbumServiceError(404, 'NOT_FOUND', 'Álbum não encontrado.');
    }

    return { data: album, meta: { viewerId: user.id } };
  }

  async create(session: Session | null, input: CreateAlbumInput) {
    const parsed = createAlbumSchema.parse(input);
    const { actor, user } = await this.resolveActor(session);

    if (actor.role === UserRole.student) {
      throw new AlbumServiceError(403, 'FORBIDDEN', 'Alunos não podem criar álbuns.');
    }

    if (parsed.scopeType === 'classroom' && parsed.classroomId) {
      await this.requireClassroomMembership(user.id, parsed.classroomId, actor.role);
    }

    const album = await this.db.album.create({
      data: {
        title: parsed.title,
        description: parsed.description ?? null,
        scopeType: parsed.scopeType === 'global' ? ScopeType.global : ScopeType.classroom,
        classroomId: parsed.classroomId ?? null,
        createdBy: user.id,
        status: ContentStatus.approved,
      },
      include: {
        creator: { select: { id: true, name: true, role: true } },
        photos: true,
      },
    });

    return { data: album };
  }

  async addPhoto(session: Session | null, albumId: string, formData: FormData) {
    const { actor, user } = await this.resolveActor(session);
    const album = await this.db.album.findUnique({ where: { id: albumId } });

    if (!album) {
      throw new AlbumServiceError(404, 'NOT_FOUND', 'Álbum não encontrado.');
    }

    if (album.classroomId) {
      await this.requireClassroomMembership(user.id, album.classroomId, actor.role);
    } else if (actor.role === UserRole.student && album.createdBy !== user.id) {
      // global album: any authenticated user can contribute when approved/visible
    }

    const file = formData.get('file');
    if (!(file instanceof File)) {
      throw new AlbumServiceError(400, 'VALIDATION_ERROR', 'Selecione uma foto para enviar.');
    }

    if (!ALLOWED_MIME.has(file.type)) {
      throw new AlbumServiceError(400, 'VALIDATION_ERROR', 'Formato inválido. Use JPEG, PNG ou WebP.');
    }

    if (file.size > MAX_PHOTO_BYTES) {
      throw new AlbumServiceError(400, 'VALIDATION_ERROR', 'A foto excede o limite de 10 MB.');
    }

    const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const fileName = `${randomUUID()}.${extension}`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, fileName), buffer);

    const captionRaw = formData.get('caption');
    const caption =
      typeof captionRaw === 'string' && captionRaw.trim() ? captionRaw.trim().slice(0, 200) : null;

    const photo = await this.db.photo.create({
      data: {
        url: `/uploads/${fileName}`,
        caption,
        albumId: album.id,
        uploadedBy: user.id,
        status: statusForRole(actor.role),
      },
    });

    return { data: photo };
  }

  async listPending(session: Session | null) {
    const { actor, user } = await this.resolveActor(session);
    if (actor.role === UserRole.student) {
      throw new AlbumServiceError(403, 'FORBIDDEN', 'Apenas a coordenação e professores podem moderar conteúdo.');
    }

    let classroomIds: string[] = [];
    if (actor.role === UserRole.teacher) {
      const memberships = await this.db.classroomMember.findMany({
        where: { userId: user.id, role: 'teacher' },
        select: { classroomId: true },
      });
      classroomIds = memberships.map(m => m.classroomId);
    }

    const albumWhere = actor.role === UserRole.admin
      ? { status: ContentStatus.pending }
      : { status: ContentStatus.pending, classroomId: { in: classroomIds } };

    const photoWhere = actor.role === UserRole.admin
      ? { status: ContentStatus.pending }
      : { status: ContentStatus.pending, album: { classroomId: { in: classroomIds } } };

    const [albums, photos] = await Promise.all([
      this.db.album.findMany({
        where: albumWhere,
        orderBy: { createdAt: 'desc' },
        include: { creator: { select: { id: true, name: true } } },
      }),
      this.db.photo.findMany({
        where: photoWhere,
        orderBy: { createdAt: 'desc' },
        include: { album: { select: { id: true, title: true } } },
      }),
    ]);

    return { data: { albums, photos } };
  }

  async moderateAlbum(session: Session | null, id: string, input: ModerationActionInput) {
    const parsed = moderationActionSchema.parse(input);
    const { actor, user } = await this.resolveActor(session);
    
    const albumToUpdate = await this.db.album.findUnique({
      where: { id },
    });

    if (!albumToUpdate) {
      throw new AlbumServiceError(404, 'NOT_FOUND', 'Álbum não encontrado.');
    }

    if (actor.role !== UserRole.admin) {
      if (actor.role === UserRole.teacher && albumToUpdate.classroomId) {
        const membership = await this.db.classroomMember.findUnique({
          where: { userId_classroomId: { userId: user.id, classroomId: albumToUpdate.classroomId } },
          select: { role: true },
        });
        if (membership?.role !== 'teacher') {
          throw new AlbumServiceError(403, 'FORBIDDEN', 'Você não tem permissão para moderar este álbum.');
        }
      } else {
        throw new AlbumServiceError(403, 'FORBIDDEN', 'Apenas a coordenação e professores da sala podem moderar conteúdo.');
      }
    }

    const album = await this.db.album.update({
      where: { id },
      data: {
        status: parsed.status === 'approved' ? ContentStatus.approved : ContentStatus.rejected,
        moderatedBy: user.id,
        moderatedAt: new Date(),
      },
    });

    return { data: album };
  }

  async moderatePhoto(session: Session | null, id: string, input: ModerationActionInput) {
    const parsed = moderationActionSchema.parse(input);
    const { actor, user } = await this.resolveActor(session);
    
    const photoToUpdate = await this.db.photo.findUnique({
      where: { id },
      include: { album: true },
    });

    if (!photoToUpdate) {
      throw new AlbumServiceError(404, 'NOT_FOUND', 'Foto não encontrada.');
    }

    if (actor.role !== UserRole.admin) {
      if (actor.role === UserRole.teacher && photoToUpdate.album.classroomId) {
        const membership = await this.db.classroomMember.findUnique({
          where: { userId_classroomId: { userId: user.id, classroomId: photoToUpdate.album.classroomId } },
          select: { role: true },
        });
        if (membership?.role !== 'teacher') {
          throw new AlbumServiceError(403, 'FORBIDDEN', 'Você não tem permissão para moderar esta foto.');
        }
      } else {
        throw new AlbumServiceError(403, 'FORBIDDEN', 'Apenas a coordenação e professores da sala podem moderar conteúdo.');
      }
    }

    const photo = await this.db.photo.update({
      where: { id },
      data: {
        status: parsed.status === 'approved' ? ContentStatus.approved : ContentStatus.rejected,
        moderatedBy: user.id,
        moderatedAt: new Date(),
      },
    });

    return { data: photo };
  }
}

export const albumsService = new AlbumsService(prisma);
