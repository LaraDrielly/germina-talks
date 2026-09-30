import { ScopeType, UserRole, type PrismaClient, type SchoolTrack } from '@prisma/client';
import type { Session } from 'next-auth';
import {
  createPostSchema,
  type CreatePostInput,
  type ListPostsQuery,
  listPostsQuerySchema,
} from '@germina-talks/shared';
import { prisma } from '../db/prisma';

export class PostServiceError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'PostServiceError';
  }
}

type SessionActor = {
  email: string;
  name: string;
  role: UserRole;
};

const postInclude = {
  author: { select: { id: true, name: true, role: true } },
  classroom: { select: { id: true, name: true, schoolTrack: true } },
};

type FeedPostDto = {
  id: string;
  content: string;
  scopeType: ScopeType;
  createdAt: Date;
  author: { id: string; name: string; role: UserRole; avatarUrl: string | null };
  classroom: { id: string; name: string; schoolTrack: SchoolTrack } | null;
};

type PostsPageDto = {
  data: FeedPostDto[];
  meta: { cursor: string | null; hasMore: boolean; viewerId: string };
};

function toFeedPost(post: {
  id: string;
  content: string;
  scopeType: ScopeType;
  createdAt: Date;
  author: { id: string; name: string; role: UserRole };
  classroom: { id: string; name: string; schoolTrack: SchoolTrack } | null;
}): FeedPostDto {
  return {
    id: post.id,
    content: post.content,
    scopeType: post.scopeType,
    createdAt: post.createdAt,
    author: { ...post.author, avatarUrl: null },
    classroom: post.classroom,
  };
}

export class PostsService {
  constructor(private readonly db: PrismaClient) {}

  private requireActor(session: Session | null): SessionActor {
    const email = session?.user?.email?.trim().toLowerCase();
    const role = session?.user?.role;

    if (!email || !role || !Object.values(UserRole).includes(role as UserRole)) {
      throw new PostServiceError(401, 'UNAUTHORIZED', 'Autenticação necessária.');
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

  private async requireClassroomMembership(userId: string, classroomId: string) {
    const membership = await this.db.classroomMember.findUnique({
      where: { userId_classroomId: { userId, classroomId } },
      select: { userId: true },
    });

    if (!membership) {
      throw new PostServiceError(403, 'FORBIDDEN_SCOPE', 'Você não tem acesso a esta sala.');
    }
  }

  async list(session: Session | null, queryInput: ListPostsQuery): Promise<PostsPageDto> {
    const query = listPostsQuerySchema.parse(queryInput);
    const { user } = await this.resolveActor(session);

    if (query.classroomId) {
      await this.requireClassroomMembership(user.id, query.classroomId);
    }

    const where = query.classroomId
      ? { scopeType: ScopeType.classroom, classroomId: query.classroomId, deletedAt: null }
      : { scopeType: ScopeType.global, classroomId: null, deletedAt: null };
    const records = await this.db.post.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      cursor: query.cursor ? { id: query.cursor } : undefined,
      skip: query.cursor ? 1 : 0,
      take: query.limit + 1,
      include: postInclude,
    });
    const hasMore = records.length > query.limit;
    const page = records.slice(0, query.limit);
    const data = page.map((post) =>
      toFeedPost({
        id: post.id,
        content: post.content,
        scopeType: post.scopeType,
        createdAt: post.createdAt,
        author: post.author,
        classroom: post.classroom,
      }),
    );

    return {
      data,
      meta: { cursor: hasMore ? data[data.length - 1]?.id ?? null : null, hasMore, viewerId: user.id },
    };
  }

  async composerContext(session: Session | null) {
    const { actor, user } = await this.resolveActor(session);
    const memberships = await this.db.classroomMember.findMany({
      where: { userId: user.id },
      include: { classroom: { select: { id: true, name: true, schoolTrack: true } } },
    });

    return {
      viewerId: user.id,
      canPostGlobal: actor.role === UserRole.admin,
      classrooms: memberships.map(({ classroom }) => classroom),
    };
  }

  async create(session: Session | null, input: CreatePostInput) {
    const parsed = createPostSchema.parse(input);
    const { actor, user } = await this.resolveActor(session);

    if (parsed.scopeType === 'global' && actor.role !== UserRole.admin) {
      throw new PostServiceError(403, 'FORBIDDEN', 'Você não tem permissão para publicar no escopo global.');
    }

    if (parsed.scopeType === 'classroom' && parsed.classroomId) {
      await this.requireClassroomMembership(user.id, parsed.classroomId);
    }

    const created = await this.db.post.create({
      data: {
        authorId: user.id,
        content: parsed.content,
        scopeType: parsed.scopeType === 'global' ? ScopeType.global : ScopeType.classroom,
        classroomId: parsed.classroomId ?? null,
      },
      include: postInclude,
    });

    return toFeedPost({
      id: created.id,
      content: created.content,
      scopeType: created.scopeType,
      createdAt: created.createdAt,
      author: created.author,
      classroom: created.classroom,
    });
  }

  async delete(session: Session | null, id: string) {
    const { user } = await this.resolveActor(session);
    const post = await this.db.post.findUnique({ where: { id } });

    if (!post || post.deletedAt) {
      throw new PostServiceError(404, 'NOT_FOUND', 'Publicação não encontrada.');
    }

    if (post.authorId !== user.id) {
      throw new PostServiceError(403, 'FORBIDDEN', 'Somente o autor pode excluir esta publicação.');
    }

    await this.db.post.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

export const postsService = new PostsService(prisma);