import { prisma } from '../db/prisma';

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
  scopeType: 'global' | 'classroom',
  classroomId?: string | null,
  userId?: string,
) {
  if (scopeType === 'global') {
    return { scopeType: 'global' };
  }

  if (scopeType === 'classroom' && classroomId) {
    return {
      scopeType: 'classroom',
      classroomId,
    };
  }

  // Default to global if invalid or empty
  return { scopeType: 'global' };
}
