import { prisma } from '../db/prisma';
import { MemberRole } from '@prisma/client';

export async function getClassroomsForUser(userId: string) {
  return await prisma.classroom.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: {
        where: {
          userId,
        },
      },
    },
  });
}

export async function getAllClassrooms() {
  return await prisma.classroom.findMany();
}

export async function createClassroom(
  data: { name: string; slug: string; schoolTrack: any; year: number },
  adminUserId: string,
) {
  // Simples verificação de admin, assumindo que chamadas externas verificam autenticação
  const user = await prisma.user.findUnique({ where: { id: adminUserId } });
  if (user?.role !== 'admin') {
    throw new Error('Apenas administradores podem criar salas');
  }

  return await prisma.classroom.create({
    data: {
      name: data.name,
      slug: data.slug,
      schoolTrack: data.schoolTrack,
      year: data.year,
    },
  });
}

export async function addMemberToClassroom(
  classroomId: string,
  userId: string,
  role: MemberRole,
) {
  return await prisma.classroomMember.create({
    data: {
      classroomId,
      userId,
      role,
    },
  });
}
