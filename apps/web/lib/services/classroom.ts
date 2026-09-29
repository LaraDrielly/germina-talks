import { prisma } from '../db/prisma';
import { MemberRole } from '@prisma/client';

export async function getClassroomMembers(classroomId: string) {
  return await prisma.classroomMember.findMany({
    where: { classroomId },
    include: { user: true },
  });
}

export async function addMemberToClassroom(
  classroomId: string,
  userId: string,
  role: MemberRole,
  adminUserId: string,
) {
  const admin = await prisma.user.findUnique({ where: { id: adminUserId } });
  if (admin?.role !== 'admin') {
    throw new Error('Apenas administradores podem gerenciar membros');
  }

  return await prisma.classroomMember.upsert({
    where: {
      userId_classroomId: {
        userId,
        classroomId,
      },
    },
    update: { role },
    create: {
      userId,
      classroomId,
      role,
    },
  });
}

export async function removeMemberFromClassroom(
  classroomId: string,
  userId: string,
  adminUserId: string,
) {
  const admin = await prisma.user.findUnique({ where: { id: adminUserId } });
  if (admin?.role !== 'admin') {
    throw new Error('Apenas administradores podem gerenciar membros');
  }

  return await prisma.classroomMember.delete({
    where: {
      userId_classroomId: {
        userId,
        classroomId,
      },
    },
  });
}
