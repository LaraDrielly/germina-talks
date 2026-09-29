import { prisma } from '@/lib/db/prisma';
import { ScopeType } from '@prisma/client';

export async function checkUserAccessToClassroom(userId: string, classroomId: string) {
  const membership = await prisma.classroomMember.findUnique({
    where: {
      userId_classroomId: {
        userId,
        classroomId,
      },
    },
  });
  return !!membership;
}

export function getScopeFilter(
  scopeType: ScopeType,
  classroomId?: string | null,
) {
  if (scopeType === 'global') {
    return { scopeType: 'global' as const };
  }

  if (scopeType === 'classroom' && classroomId) {
    return {
      scopeType: 'classroom' as const,
      classroomId,
    };
  }

  // Default to global if invalid or empty
  return { scopeType: 'global' as const };
}
