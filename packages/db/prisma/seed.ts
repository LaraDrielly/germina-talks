import { MemberRole, PrismaClient, SchoolTrack, ScopeType, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: 'ana.aluna@institutojef.org.br', name: 'Ana Aluna', role: UserRole.student },
    { email: 'bruno.aluno@institutojef.org.br', name: 'Bruno Aluno', role: UserRole.student },
    { email: 'carla.professora@institutojef.org.br', name: 'Carla Professora', role: UserRole.teacher },
    { email: 'diego.professor@institutojef.org.br', name: 'Diego Professor', role: UserRole.teacher },
    { email: 'elisa.coordenacao@institutojef.org.br', name: 'Elisa Coordenação', role: UserRole.admin },
  ];

  const seededUsers = await Promise.all(
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

  const seededClassrooms = await Promise.all(
    classrooms.map((classroom) =>
      prisma.classroom.upsert({
        where: { slug: classroom.slug },
        update: classroom,
        create: { ...classroom, year: 2026 },
      }),
    ),
  );

  const userByEmail = new Map(seededUsers.map((user) => [user.email, user] as const));
  const classroomBySlug = new Map(seededClassrooms.map((classroom) => [classroom.slug, classroom] as const));

  const memberships = [
    { email: 'ana.aluna@institutojef.org.br', slug: '3-ano-negocios-2026', roleInClass: MemberRole.student },
    { email: 'ana.aluna@institutojef.org.br', slug: '3-ano-tecnologia-2026', roleInClass: MemberRole.student },
    { email: 'bruno.aluno@institutojef.org.br', slug: '3-ano-tecnologia-2026', roleInClass: MemberRole.student },
    { email: 'carla.professora@institutojef.org.br', slug: '3-ano-tecnologia-2026', roleInClass: MemberRole.teacher },
    { email: 'diego.professor@institutojef.org.br', slug: '3-ano-fabrica-2026', roleInClass: MemberRole.teacher },
  ];

  await Promise.all(
    memberships.map(({ email, slug, roleInClass }) => {
      const user = userByEmail.get(email);
      const classroom = classroomBySlug.get(slug);

      if (!user || !classroom) {
        throw new Error(`Missing seed relation for ${email} in ${slug}`);
      }

      return prisma.classroomMember.upsert({
        where: { userId_classroomId: { userId: user.id, classroomId: classroom.id } },
        update: { roleInClass },
        create: { userId: user.id, classroomId: classroom.id, roleInClass },
      });
    }),
  );

  const ana = userByEmail.get('ana.aluna@institutojef.org.br');
  const elisa = userByEmail.get('elisa.coordenacao@institutojef.org.br');
  const technologyClassroom = classroomBySlug.get('3-ano-tecnologia-2026');

  if (!ana || !elisa || !technologyClassroom) {
    throw new Error('Missing seed author or classroom');
  }

  const posts = [
    {
      id: 'f6ed6613-6d39-4bd5-8a15-75fbd12d5301',
      authorId: ana.id,
      content: 'Alguém tem o material da aula de hoje?',
      scopeType: ScopeType.classroom,
      classroomId: technologyClassroom.id,
    },
    {
      id: 'f6ed6613-6d39-4bd5-8a15-75fbd12d5302',
      authorId: elisa.id,
      content: 'Bem-vindos ao feed da comunidade escolar!',
      scopeType: ScopeType.global,
      classroomId: null,
    },
  ];

  await Promise.all(
    posts.map((post) =>
      prisma.post.upsert({
        where: { id: post.id },
        update: { ...post, deletedAt: null },
        create: post,
      }),
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
