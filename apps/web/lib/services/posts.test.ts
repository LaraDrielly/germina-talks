import type { PrismaClient } from '@prisma/client';
import type { Session } from 'next-auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PostsService } from './posts';

const classroomId = '7c7e0ee7-ae5a-45c6-9b6b-a2d6081f46dc';
const userId = 'e45fe480-c170-4d86-9b16-dc38c873d6bb';

const memberSession = {
  user: {
    email: 'ana.aluna@institutojef.org.br',
    name: 'Ana Aluna',
    role: 'student',
    image: null,
  },
} as Session;

function createService(isMember: boolean, posts: unknown[] = []) {
  const db = {
    user: {
      upsert: vi.fn().mockResolvedValue({ id: userId }),
    },
    classroomMember: {
      findUnique: vi.fn().mockResolvedValue(isMember ? { userId } : null),
    },
    post: {
      findMany: vi.fn().mockResolvedValue(posts),
      create: vi.fn().mockResolvedValue({ id: 'post-id' }),
      findUnique: vi.fn(),
      update: vi.fn().mockResolvedValue({}),
    },
  } as unknown as PrismaClient;

  return { service: new PostsService(db), db };
}

describe('PostsService authorization', () => {
  beforeEach(() => vi.clearAllMocks());

  it('rejects requests without an authenticated session', async () => {
    const { service, db } = createService(false);

    await expect(service.list(null, { classroomId, limit: 20 })).rejects.toMatchObject({
      status: 401,
      code: 'UNAUTHORIZED',
    });
    expect(db.user.upsert).not.toHaveBeenCalled();
  });

  it('denies a user who is not a classroom member', async () => {
    const { service, db } = createService(false);

    await expect(service.list(memberSession, { classroomId, limit: 20 })).rejects.toMatchObject({
      status: 403,
      code: 'FORBIDDEN_SCOPE',
    });
    expect(db.post.findMany).not.toHaveBeenCalled();
  });

  it('allows a classroom member to read that classroom feed', async () => {
    const { service, db } = createService(true);

    await expect(service.list(memberSession, { classroomId, limit: 20 })).resolves.toEqual({
      data: [],
      meta: { cursor: null, hasMore: false, viewerId: userId },
    });
    expect(db.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ classroomId }),
      }),
    );
  });

  it('uses a stable cursor and returns only the requested page', async () => {
    const records = [
      { id: 'newest-post' },
      { id: 'next-post' },
      { id: 'older-post' },
    ];
    const { service, db } = createService(false, records);

    await expect(service.list(memberSession, { limit: 2 })).resolves.toEqual({
      data: records.slice(0, 2),
      meta: { cursor: 'next-post', hasMore: true, viewerId: userId },
    });
    expect(db.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: 3,
      }),
    );
  });

  it('creates a classroom post with the session user as author', async () => {
    const { service, db } = createService(true);

    await service.create(memberSession, {
      content: '  Dúvida da aula  ',
      scopeType: 'classroom',
      classroomId,
    });

    expect(db.post.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          authorId: userId,
          content: 'Dúvida da aula',
          classroomId,
        }),
      }),
    );
  });

  it('soft-deletes an author post and denies deletion by another member', async () => {
    const { service, db } = createService(true);
    vi.mocked(db.post.findUnique).mockResolvedValue({
      id: 'post-id',
      authorId: userId,
      deletedAt: null,
    } as never);

    await service.delete(memberSession, 'post-id');
    expect(db.post.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'post-id' }, data: { deletedAt: expect.any(Date) } }),
    );

    vi.mocked(db.user.upsert).mockResolvedValue({ id: 'another-user' } as never);
    await expect(service.delete(memberSession, 'post-id')).rejects.toMatchObject({
      status: 403,
      code: 'FORBIDDEN',
    });
  });
});