import { MemberRole, Prisma, ScopeType, UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/db/prisma';

export type BulletinIdentity = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export async function getBulletinIdentity(): Promise<BulletinIdentity | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.trim().toLowerCase();
  if (!email) return null;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, role: true },
  });

  return user ?? null;
}

export async function getBulletinClassrooms(identity: BulletinIdentity) {
  if (identity.role === UserRole.admin) {
    const classrooms = await prisma.classroom.findMany({ orderBy: [{ schoolTrack: 'asc' }, { name: 'asc' }] });
    return classrooms.map((classroom) => ({ ...classroom, roleInClass: MemberRole.teacher }));
  }

  const memberships = await prisma.classroomMember.findMany({
    where: { userId: identity.id },
    include: { classroom: true },
    orderBy: { classroom: { name: 'asc' } },
  });
  return memberships.map((membership) => ({ ...membership.classroom, roleInClass: membership.roleInClass }));
}

export async function canAccessBulletinClassroom(identity: BulletinIdentity, classroomId: string) {
  if (identity.role === UserRole.admin) {
    return Boolean(await prisma.classroom.findUnique({ where: { id: classroomId }, select: { id: true } }));
  }

  return Boolean(
    await prisma.classroomMember.findUnique({
      where: { userId_classroomId: { userId: identity.id, classroomId } },
      select: { classroomId: true },
    }),
  );
}

export async function canPinBulletin(identity: BulletinIdentity, classroomId: string | null) {
  if (identity.role === UserRole.admin) return true;
  if (identity.role !== UserRole.teacher || !classroomId) return false;

  const membership = await prisma.classroomMember.findUnique({
    where: { userId_classroomId: { userId: identity.id, classroomId } },
    select: { roleInClass: true },
  });
  return membership?.roleInClass === MemberRole.teacher;
}

export async function findAccessibleBulletins(identity: BulletinIdentity, options?: {
  scopeType?: ScopeType;
  classroomId?: string;
}) {
  const memberships = identity.role === UserRole.admin
    ? null
    : await prisma.classroomMember.findMany({
        where: { userId: identity.id },
        select: { classroomId: true },
      });
  const classroomIds = memberships?.map(({ classroomId }) => classroomId);

  const scopeFilter: Prisma.BulletinItemWhereInput = options?.classroomId
    ? { scopeType: ScopeType.classroom, classroomId: options.classroomId }
    : options?.scopeType === ScopeType.global
      ? { scopeType: ScopeType.global }
      : options?.scopeType === ScopeType.classroom
        ? { scopeType: ScopeType.classroom, ...(identity.role === UserRole.admin ? {} : { classroomId: { in: classroomIds } }) }
        : identity.role === UserRole.admin
          ? {}
          : { OR: [{ scopeType: ScopeType.global }, { scopeType: ScopeType.classroom, classroomId: { in: classroomIds } }] };

  return prisma.bulletinItem.findMany({
    where: {
      AND: [
        scopeFilter,
        { deletedAt: null },
        {
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      ],
    },
    include: {
      author: { select: { name: true, role: true } },
      classroom: { select: { id: true, name: true, schoolTrack: true } },
    },
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
  });
}

export { prisma as bulletinPrisma };
