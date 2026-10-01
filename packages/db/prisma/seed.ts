import 'dotenv/config';
import { MemberRole, PrismaClient, SchoolTrack, UserRole } from '@prisma/client';
import { hashPassword } from '@germina-talks/shared/password';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('O seed de demonstração não pode ser executado em produção.');
  }
  const demoPassword = process.env.DEMO_USERS_PASSWORD;
  if (!demoPassword || demoPassword.length < 12) {
    throw new Error('Defina DEMO_USERS_PASSWORD com pelo menos 12 caracteres no ambiente local.');
  }

  const users = [
    { email: 'ana.aluna@institutojef.org.br', name: 'Ana Aluna', role: UserRole.student },
    { email: 'bruno.aluno@institutojef.org.br', name: 'Bruno Aluno', role: UserRole.student },
    { email: 'carla.professora@institutojef.org.br', name: 'Carla Professora', role: UserRole.teacher },
    { email: 'diego.professor@institutojef.org.br', name: 'Diego Professor', role: UserRole.teacher },
    { email: 'elisa.coordenacao@institutojef.org.br', name: 'Elisa Coordenação', role: UserRole.admin },
  ];

  await Promise.all(
    users.map(async (user) => {
      const passwordHash = await hashPassword(demoPassword);
      return prisma.user.upsert({
        where: { email: user.email },
        update: { name: user.name, role: user.role, passwordHash },
        create: { ...user, passwordHash },
      });
    }),
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

  const [ana, bruno, carla, diego] = await Promise.all(
    users.slice(0, 4).map((user) => prisma.user.findUniqueOrThrow({ where: { email: user.email } })),
  );
  const [business, tech] = await Promise.all([
    prisma.classroom.findUniqueOrThrow({ where: { slug: '3-ano-negocios-2026' } }),
    prisma.classroom.findUniqueOrThrow({ where: { slug: '3-ano-tecnologia-2026' } }),
  ]);

  await prisma.classroomMember.createMany({
    data: [
      { userId: ana.id, classroomId: business.id, roleInClass: MemberRole.student },
      { userId: bruno.id, classroomId: tech.id, roleInClass: MemberRole.student },
      { userId: carla.id, classroomId: business.id, roleInClass: MemberRole.teacher },
      { userId: diego.id, classroomId: tech.id, roleInClass: MemberRole.teacher },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
