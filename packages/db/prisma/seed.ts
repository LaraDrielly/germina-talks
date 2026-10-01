import { MemberRole, PrismaClient, SchoolTrack, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: 'ana.aluna@institutojef.org.br', name: 'Ana Aluna', role: UserRole.student },
    { email: 'bruno.aluno@institutojef.org.br', name: 'Bruno Aluno', role: UserRole.student },
    { email: 'carla.professora@institutojef.org.br', name: 'Carla Professora', role: UserRole.teacher },
    { email: 'diego.professor@institutojef.org.br', name: 'Diego Professor', role: UserRole.teacher },
    { email: 'elisa.coordenacao@institutojef.org.br', name: 'Elisa Coordenação', role: UserRole.admin },
  ];

  await Promise.all(
    users.map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: user,
        create: user,
      }),
    ),
  );

  const classrooms = [
    { name: '3º ano Negócios 2026', slug: '3-ano-negocios-2026', schoolTrack: SchoolTrack.business },
    { name: '3º ano Tecnologia 2026', slug: '3-ano-tecnologia-2026', schoolTrack: SchoolTrack.tech },
    { name: '3º ano Fábrica 2026', slug: '3-ano-fabrica-2026', schoolTrack: SchoolTrack.factory },
  ];

  await Promise.all(
    classrooms.map((classroom) =>
      prisma.classroom.upsert({
        where: { slug: classroom.slug },
        update: classroom,
        create: { ...classroom, year: 2026 },
      }),
    ),
  );

  const memberships = [
    { userEmail: 'ana.aluna@institutojef.org.br', classroomSlug: '3-ano-negocios-2026', role: MemberRole.student },
    { userEmail: 'bruno.aluno@institutojef.org.br', classroomSlug: '3-ano-tecnologia-2026', role: MemberRole.student },
    { userEmail: 'carla.professora@institutojef.org.br', classroomSlug: '3-ano-negocios-2026', role: MemberRole.teacher },
    { userEmail: 'carla.professora@institutojef.org.br', classroomSlug: '3-ano-tecnologia-2026', role: MemberRole.teacher },
    { userEmail: 'diego.professor@institutojef.org.br', classroomSlug: '3-ano-fabrica-2026', role: MemberRole.teacher },
  ];

  for (const membership of memberships) {
    const user = await prisma.user.findUnique({ where: { email: membership.userEmail } });
    const classroom = await prisma.classroom.findUnique({ where: { slug: membership.classroomSlug } });

    if (!user || !classroom) {
      continue;
    }

    await prisma.classroomMember.upsert({
      where: {
        userId_classroomId: {
          userId: user.id,
          classroomId: classroom.id,
        },
      },
      update: { role: membership.role },
      create: {
        userId: user.id,
        classroomId: classroom.id,
        role: membership.role,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
