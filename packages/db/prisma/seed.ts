import { ContentStatus, MemberRole, PrismaClient, SchoolTrack, ScopeType, UserRole } from '@prisma/client';

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

  const carla = await prisma.user.findUnique({ where: { email: 'carla.professora@institutojef.org.br' } });
  const techClassroom = await prisma.classroom.findUnique({ where: { slug: '3-ano-tecnologia-2026' } });

  if (carla && techClassroom) {
    const globalAlbum = await prisma.album.upsert({
      where: { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' },
      update: {
        title: 'Formatura 2026',
        description: 'Álbum global de eventos da escola',
        scopeType: ScopeType.global,
        classroomId: null,
        createdBy: carla.id,
        status: ContentStatus.approved,
      },
      create: {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        title: 'Formatura 2026',
        description: 'Álbum global de eventos da escola',
        scopeType: ScopeType.global,
        classroomId: null,
        createdBy: carla.id,
        status: ContentStatus.approved,
      },
    });

    const classroomAlbum = await prisma.album.upsert({
      where: { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' },
      update: {
        title: 'Feira de Ciências 2026',
        description: 'Registros da turma de Tecnologia',
        scopeType: ScopeType.classroom,
        classroomId: techClassroom.id,
        createdBy: carla.id,
        status: ContentStatus.approved,
      },
      create: {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        title: 'Feira de Ciências 2026',
        description: 'Registros da turma de Tecnologia',
        scopeType: ScopeType.classroom,
        classroomId: techClassroom.id,
        createdBy: carla.id,
        status: ContentStatus.approved,
      },
    });

    await prisma.photo.upsert({
      where: { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc' },
      update: {
        url: '/uploads/seed-formatura.jpg',
        caption: 'Cerimônia',
        albumId: globalAlbum.id,
        uploadedBy: carla.id,
        status: ContentStatus.approved,
      },
      create: {
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        url: '/uploads/seed-formatura.jpg',
        caption: 'Cerimônia',
        albumId: globalAlbum.id,
        uploadedBy: carla.id,
        status: ContentStatus.approved,
      },
    });

    await prisma.photo.upsert({
      where: { id: 'dddddddd-dddd-dddd-dddd-dddddddddddd' },
      update: {
        url: '/uploads/seed-feira.jpg',
        caption: 'Estande da turma',
        albumId: classroomAlbum.id,
        uploadedBy: carla.id,
        status: ContentStatus.approved,
      },
      create: {
        id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        url: '/uploads/seed-feira.jpg',
        caption: 'Estande da turma',
        albumId: classroomAlbum.id,
        uploadedBy: carla.id,
        status: ContentStatus.approved,
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
