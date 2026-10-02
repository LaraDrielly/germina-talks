import type { PrismaClient } from '@prisma/client';
import type { Session } from 'next-auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BulletinService } from './bulletin';

const classroomId = 'class-ads-3';
const userId = 'user-student-1';
const teacherId = 'user-teacher-1';
const bulletinId = 'f2020002-0002-4000-8000-000000000002';

const studentSession = {
  user: {
    email: 'aluno.joao@institutojef.org.br',
    name: 'João Pedro Aluno',
    role: 'student',
    image: null,
  },
} as Session;

const teacherSession = {
  user: {
    email: 'professor.silva@institutojef.org.br',
    name: 'Prof. Carlos Silva',
    role: 'teacher',
    image: null,
  },
} as Session;

function createService(options?: {
  isMember?: boolean;
  membershipRole?: 'student' | 'teacher';
  bulletins?: unknown[];
  userId?: string;
}) {
  const resolvedUserId = options?.userId ?? userId;
  const db = {
    user: {
      upsert: vi.fn().mockResolvedValue({ id: resolvedUserId }),
    },
    classroom: {
      findUnique: vi.fn().mockResolvedValue({ id: classroomId }),
      findMany: vi.fn().mockResolvedValue([]),
    },
    classroomMember: {
      findUnique: vi.fn().mockResolvedValue(
        options?.isMember === false
          ? null
          : { userId: resolvedUserId, role: options?.membershipRole ?? 'student' },
      ),
      findMany: vi.fn().mockResolvedValue(
        options?.isMember === false
          ? []
          : [{ classroomId, role: options?.membershipRole ?? 'student', classroom: { id: classroomId, name: '3º ADS', schoolTrack: 'tech' } }],
      ),
    },
    bulletinItem: {
      findMany: vi.fn().mockResolvedValue(options?.bulletins ?? []),
      create: vi.fn().mockResolvedValue({
        id: 'new-bulletin',
        title: 'Aviso',
        body: 'Texto',
        isPinned: false,
        scopeType: 'classroom',
        classroomId,
        expiresAt: null,
        createdAt: new Date('2026-09-30T12:00:00.000Z'),
        author: { id: resolvedUserId, name: 'João Pedro Aluno', role: 'student' },
        classroom: { id: classroomId, name: '3º ADS', schoolTrack: 'tech' },
      }),
      findUnique: vi.fn().mockResolvedValue({
        id: bulletinId,
        classroomId,
        deletedAt: null,
      }),
      update: vi.fn().mockResolvedValue({
        id: bulletinId,
        title: 'Prova',
        body: 'Detalhe',
        isPinned: true,
        scopeType: 'classroom',
        classroomId,
        expiresAt: null,
        createdAt: new Date('2026-09-02T15:00:00.000Z'),
        author: { id: teacherId, name: 'Prof. Carlos Silva', role: 'teacher' },
        classroom: { id: classroomId, name: '3º ADS', schoolTrack: 'tech' },
      }),
    },
  } as unknown as PrismaClient;

  return { service: new BulletinService(db), db };
}

describe('BulletinService authorization', () => {
  beforeEach(() => vi.clearAllMocks());

  it('rejects requests without an authenticated session', async () => {
    const { service, db } = createService();

    await expect(service.list(null, {})).rejects.toMatchObject({
      status: 401,
      code: 'UNAUTHORIZED',
    });
    expect(db.user.upsert).not.toHaveBeenCalled();
  });

  it('denies a user who is not a classroom member', async () => {
    const { service, db } = createService({ isMember: false });

    await expect(service.list(studentSession, { classroomId })).rejects.toMatchObject({
      status: 403,
      code: 'FORBIDDEN_SCOPE',
    });
    expect(db.bulletinItem.findMany).not.toHaveBeenCalled();
  });

  it('allows a classroom member to read that classroom mural', async () => {
    const { service, db } = createService({ isMember: true });

    await expect(service.list(studentSession, { classroomId })).resolves.toEqual({ data: [] });
    expect(db.bulletinItem.findMany).toHaveBeenCalled();
  });

  it('rejects a student creating a global recado', async () => {
    const { service, db } = createService({ isMember: true });

    await expect(
      service.create(studentSession, {
        title: 'Aviso',
        body: 'Texto',
        scopeType: 'global',
      }),
    ).rejects.toMatchObject({ status: 403, code: 'FORBIDDEN' });
    expect(db.bulletinItem.create).not.toHaveBeenCalled();
  });

  it('rejects a student trying to pin on create', async () => {
    const { service, db } = createService({ isMember: true, membershipRole: 'student' });

    await expect(
      service.create(studentSession, {
        title: 'Aviso',
        body: 'Texto',
        scopeType: 'classroom',
        classroomId,
        isPinned: true,
      }),
    ).rejects.toMatchObject({ status: 403, code: 'FORBIDDEN' });
    expect(db.bulletinItem.create).not.toHaveBeenCalled();
  });

  it('creates an unpinned classroom recado for a member student', async () => {
    const { service, db } = createService({ isMember: true, membershipRole: 'student' });

    await expect(
      service.create(studentSession, {
        title: ' Aviso ',
        body: ' Texto ',
        scopeType: 'classroom',
        classroomId,
      }),
    ).resolves.toMatchObject({
      data: expect.objectContaining({ title: 'Aviso', body: 'Texto' }),
    });
    expect(db.bulletinItem.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'Aviso',
          body: 'Texto',
          isPinned: false,
          classroomId,
          authorId: userId,
        }),
      }),
    );
  });

  it('rejects students before pinning', async () => {
    const { service, db } = createService({ isMember: true, membershipRole: 'student' });

    await expect(service.pin(studentSession, bulletinId)).rejects.toMatchObject({
      status: 403,
      code: 'FORBIDDEN',
    });
    expect(db.bulletinItem.update).not.toHaveBeenCalled();
  });

  it('pins a classroom recado when teacher has permission', async () => {
    const { service, db } = createService({
      isMember: true,
      membershipRole: 'teacher',
      userId: teacherId,
    });

    await expect(service.pin(teacherSession, bulletinId)).resolves.toMatchObject({
      data: expect.objectContaining({ id: bulletinId, isPinned: true, canPin: true }),
    });
    expect(db.bulletinItem.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { isPinned: true } }),
    );
  });
});
