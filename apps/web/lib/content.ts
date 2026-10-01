import { MemberRole, ScopeType, UserRole } from '@prisma/client';
import type { BulletinIdentity } from '@/lib/bulletin';
import { prisma } from '@/lib/db/prisma';

export async function canAccessContentClassroom(identity: BulletinIdentity, classroomId: string) {
  if (identity.role === UserRole.admin) {
    return Boolean(await prisma.classroom.findUnique({ where: { id: classroomId }, select: { id: true } }));
  }
  return Boolean(await prisma.classroomMember.findUnique({
    where: { userId_classroomId: { userId: identity.id, classroomId } },
    select: { classroomId: true },
  }));
}

export async function canManageAlbumInClassroom(identity: BulletinIdentity, classroomId: string) {
  if (identity.role === UserRole.admin) return canAccessContentClassroom(identity, classroomId);
  if (identity.role !== UserRole.teacher) return false;
  const membership = await prisma.classroomMember.findUnique({
    where: { userId_classroomId: { userId: identity.id, classroomId } },
    select: { roleInClass: true },
  });
  return membership?.roleInClass === MemberRole.teacher;
}

export async function accessibleClassroomIds(identity: BulletinIdentity) {
  if (identity.role === UserRole.admin) return null;
  const memberships = await prisma.classroomMember.findMany({
    where: { userId: identity.id }, select: { classroomId: true },
  });
  return memberships.map(({ classroomId }) => classroomId);
}

export function scopeWhere(identity: BulletinIdentity, scopeType?: ScopeType, classroomId?: string) {
  if (classroomId) return { scopeType: ScopeType.classroom, classroomId };
  if (scopeType === ScopeType.global) return { scopeType: ScopeType.global };
  if (scopeType === ScopeType.classroom) {
    return { scopeType: ScopeType.classroom, ...(identity.role === UserRole.admin ? {} : { classroomId: { in: [] as string[] } }) };
  }
  return identity.role === UserRole.admin
    ? {}
    : { OR: [{ scopeType: ScopeType.global }, { scopeType: ScopeType.classroom, classroomId: { in: [] as string[] } }] };
}

export async function accessibleScopeWhere(identity: BulletinIdentity, scopeType?: ScopeType, classroomId?: string) {
  const where = scopeWhere(identity, scopeType, classroomId);
  const ids = await accessibleClassroomIds(identity);
  if (ids === null) return where;
  if (scopeType === ScopeType.classroom) return { scopeType, classroomId: classroomId ?? { in: ids } };
  if (scopeType === ScopeType.global) return where;
  return { OR: [{ scopeType: ScopeType.global }, { scopeType: ScopeType.classroom, classroomId: { in: ids } }] };
}

export { prisma as contentPrisma };
