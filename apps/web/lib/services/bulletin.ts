import {
  MemberRole,
  ScopeType,
  UserRole,
  type PrismaClient,
  type SchoolTrack,
} from '@prisma/client';
import type { Session } from 'next-auth';
import {
  createBulletinSchema,
  listBulletinsQuerySchema,
  type CreateBulletinInput,
  type ListBulletinsQuery,
} from '@germina-talks/shared';
import { prisma } from '../db/prisma';

export class BulletinServiceError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'BulletinServiceError';
  }
}

type SessionActor = {
  email: string;
  name: string;
  role: UserRole;
};

const bulletinInclude = {
  author: { select: { id: true, name: true, role: true } },
  classroom: { select: { id: true, name: true, schoolTrack: true } },
};

export type BulletinDto = {
  id: string;
  title: string;
  body: string;
  isPinned: boolean;
  scopeType: ScopeType;
  classroomId: string | null;
  expiresAt: string | null;
  createdAt: string;
  canPin: boolean;
  author: { id: string; name: string; role: UserRole };
  classroom: { id: string; name: string; schoolTrack: SchoolTrack } | null;
};

export type BulletinClassroomOption = {
  id: string;
  name: string;
  schoolTrack: SchoolTrack;
  roleInClass: MemberRole;
};

function toBulletinDto(
  item: {
    id: string;
    title: string;
    body: string;
    isPinned: boolean;
    scopeType: ScopeType;
    classroomId: string | null;
    expiresAt: Date | null;
    createdAt: Date;
    author: { id: string; name: string; role: UserRole };
    classroom: { id: string; name: string; schoolTrack: SchoolTrack } | null;
  },
  canPin: boolean,
): BulletinDto {
  return {
    id: item.id,
    title: item.title,
    body: item.body,
    isPinned: item.isPinned,
    scopeType: item.scopeType,
    classroomId: item.classroomId,
    expiresAt: item.expiresAt?.toISOString() ?? null,
    createdAt: item.createdAt.toISOString(),
    canPin,
    author: item.author,
    classroom: item.classroom,
  };
}

export class BulletinService {
  constructor(private readonly db: PrismaClient) {}

  private requireActor(session: Session | null): SessionActor {
    const email = session?.user?.email?.trim().toLowerCase();
    const role = session?.user?.role;

    if (!email || !role || !Object.values(UserRole).includes(role as UserRole)) {
      throw new BulletinServiceError(401, 'UNAUTHORIZED', 'Autenticação necessária.');
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

  private async requireClassroomAccess(userId: string, classroomId: string, role: UserRole) {
    if (role === UserRole.admin) {
      const classroom = await this.db.classroom.findUnique({
        where: { id: classroomId },
        select: { id: true },
      });
      if (!classroom) {
        throw new BulletinServiceError(403, 'FORBIDDEN_SCOPE', 'Você não tem acesso a esta sala.');
      }
      return;
    }

    const membership = await this.db.classroomMember.findUnique({
      where: { userId_classroomId: { userId, classroomId } },
      select: { userId: true },
    });
    if (!membership) {
      throw new BulletinServiceError(403, 'FORBIDDEN_SCOPE', 'Você não tem acesso a esta sala.');
    }
  }

  private async canPinInClassroom(userId: string, role: UserRole, classroomId: string | null) {
    if (role === UserRole.admin) return true;
    if (role !== UserRole.teacher || !classroomId) return false;

    const membership = await this.db.classroomMember.findUnique({
      where: { userId_classroomId: { userId, classroomId } },
      select: { role: true },
    });
    return membership?.role === MemberRole.teacher;
  }

  private async membershipClassroomIds(userId: string) {
    const memberships = await this.db.classroomMember.findMany({
      where: { userId },
      select: { classroomId: true },
    });
    return memberships.map(({ classroomId }) => classroomId);
  }

  private async pinCapabilityMap(userId: string, role: UserRole, classroomIds: Array<string | null>) {
    const uniqueIds = [...new Set(classroomIds.filter((id): id is string => Boolean(id)))];
    const map = new Map<string | null, boolean>();
    map.set(null, role === UserRole.admin);

    await Promise.all(
      uniqueIds.map(async (classroomId) => {
        map.set(classroomId, await this.canPinInClassroom(userId, role, classroomId));
      }),
    );

    return map;
  }

  async list(session: Session | null, queryInput: ListBulletinsQuery = {}): Promise<{ data: BulletinDto[] }> {
    const query = listBulletinsQuerySchema.parse(queryInput);
    const { actor, user } = await this.resolveActor(session);

    if (query.classroomId) {
      await this.requireClassroomAccess(user.id, query.classroomId, actor.role);
    }

    const classroomIds =
      actor.role === UserRole.admin ? null : await this.membershipClassroomIds(user.id);

    const scopeFilter = query.classroomId
      ? { scopeType: ScopeType.classroom, classroomId: query.classroomId }
      : query.scopeType === 'global'
        ? { scopeType: ScopeType.global }
        : query.scopeType === 'classroom'
          ? {
              scopeType: ScopeType.classroom,
              ...(actor.role === UserRole.admin ? {} : { classroomId: { in: classroomIds ?? [] } }),
            }
          : actor.role === UserRole.admin
            ? {}
            : {
                OR: [
                  { scopeType: ScopeType.global },
                  { scopeType: ScopeType.classroom, classroomId: { in: classroomIds ?? [] } },
                ],
              };

    const now = new Date();
    const records = await this.db.bulletinItem.findMany({
      where: {
        AND: [
          scopeFilter,
          { deletedAt: null },
          {
            OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
          },
        ],
      },
      include: bulletinInclude,
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
    });

    const pinMap = await this.pinCapabilityMap(
      user.id,
      actor.role,
      records.map((item) => item.classroomId),
    );

    return {
      data: records.map((item) =>
        toBulletinDto(item, pinMap.get(item.classroomId) ?? false),
      ),
    };
  }

  async composerContext(session: Session | null) {
    const { actor, user } = await this.resolveActor(session);

    if (actor.role === UserRole.admin) {
      const classrooms = await this.db.classroom.findMany({
        orderBy: [{ schoolTrack: 'asc' }, { name: 'asc' }],
      });
      return {
        viewerId: user.id,
        role: actor.role,
        canPostGlobal: true,
        classrooms: classrooms.map((classroom) => ({
          id: classroom.id,
          name: classroom.name,
          schoolTrack: classroom.schoolTrack,
          roleInClass: MemberRole.teacher,
        })) satisfies BulletinClassroomOption[],
      };
    }

    const memberships = await this.db.classroomMember.findMany({
      where: { userId: user.id },
      include: { classroom: { select: { id: true, name: true, schoolTrack: true } } },
    });

    return {
      viewerId: user.id,
      role: actor.role,
      canPostGlobal: false,
      classrooms: memberships.map(({ classroom, role }) => ({
        id: classroom.id,
        name: classroom.name,
        schoolTrack: classroom.schoolTrack,
        roleInClass: role,
      })) satisfies BulletinClassroomOption[],
    };
  }

  async create(session: Session | null, input: CreateBulletinInput): Promise<{ data: BulletinDto }> {
    const parsed = createBulletinSchema.parse(input);
    const { actor, user } = await this.resolveActor(session);

    if (parsed.scopeType === 'global' && actor.role !== UserRole.admin) {
      throw new BulletinServiceError(
        403,
        'FORBIDDEN',
        'Somente a coordenação pode publicar recados para toda a escola.',
      );
    }

    if (parsed.scopeType === 'classroom' && parsed.classroomId) {
      await this.requireClassroomAccess(user.id, parsed.classroomId, actor.role);
    }

    const classroomId = parsed.scopeType === 'classroom' ? parsed.classroomId! : null;
    if (parsed.isPinned && !(await this.canPinInClassroom(user.id, actor.role, classroomId))) {
      throw new BulletinServiceError(
        403,
        'FORBIDDEN',
        'Apenas professores da sala e coordenação podem fixar recados.',
      );
    }

    const created = await this.db.bulletinItem.create({
      data: {
        title: parsed.title,
        body: parsed.body,
        isPinned: parsed.isPinned ?? false,
        scopeType: parsed.scopeType === 'global' ? ScopeType.global : ScopeType.classroom,
        classroomId,
        expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
        authorId: user.id,
      },
      include: bulletinInclude,
    });

    return {
      data: toBulletinDto(
        created,
        await this.canPinInClassroom(user.id, actor.role, created.classroomId),
      ),
    };
  }

  async pin(session: Session | null, id: string): Promise<{ data: BulletinDto }> {
    if (!id.trim()) {
      throw new BulletinServiceError(400, 'VALIDATION_ERROR', 'O identificador do recado é inválido.');
    }

    const { actor, user } = await this.resolveActor(session);
    if (actor.role !== UserRole.teacher && actor.role !== UserRole.admin) {
      throw new BulletinServiceError(
        403,
        'FORBIDDEN',
        'Apenas professores e coordenação podem fixar recados.',
      );
    }

    const item = await this.db.bulletinItem.findUnique({ where: { id } });
    if (!item || item.deletedAt) {
      throw new BulletinServiceError(404, 'NOT_FOUND', 'Este recado não foi encontrado.');
    }

    if (!(await this.canPinInClassroom(user.id, actor.role, item.classroomId))) {
      throw new BulletinServiceError(403, 'FORBIDDEN_SCOPE', 'Você não pode fixar recados desta sala.');
    }

    const updated = await this.db.bulletinItem.update({
      where: { id },
      data: { isPinned: true },
      include: bulletinInclude,
    });

    return {
      data: toBulletinDto(updated, true),
    };
  }
}

export const bulletinService = new BulletinService(prisma);
