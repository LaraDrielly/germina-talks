import 'dotenv/config';
import { MemberRole, PrismaClient, UserRole } from '@prisma/client';
import { hashPassword } from '@germina-talks/shared/password';

const prisma = new PrismaClient();

async function main() {
  const [rawEmail, rawName, rawRole, classroomSlug] = process.argv.slice(2);
  const email = rawEmail?.trim().toLowerCase();
  const name = rawName?.trim();
  const password = process.env.ACCOUNT_INITIAL_PASSWORD;

  if (!email || !name || !rawRole || !Object.values(UserRole).includes(rawRole as UserRole)) {
    throw new Error('Uso: npm run db:provision -- <email> <nome> <student|teacher|admin> [slug-da-sala]');
  }
  if (!email.endsWith('@institutojef.org.br') && !email.endsWith('@jef.org.br')) {
    throw new Error('Use um e-mail de domínio institucional autorizado.');
  }
  if (!password || password.length < 12) {
    throw new Error('Defina ACCOUNT_INITIAL_PASSWORD com pelo menos 12 caracteres no ambiente.');
  }
  if (classroomSlug && rawRole === UserRole.admin) {
    throw new Error('Coordenação tem acesso global e não precisa de vínculo com uma sala.');
  }
  const classroom = classroomSlug
    ? await prisma.classroom.findUnique({ where: { slug: classroomSlug } })
    : null;
  if (classroomSlug && !classroom) throw new Error(`A sala "${classroomSlug}" não existe.`);

  const passwordHash = await hashPassword(password);
  await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.upsert({
      where: { email },
      update: { name, role: rawRole as UserRole, passwordHash },
      create: { email, name, role: rawRole as UserRole, passwordHash },
    });

    if (classroom) {
      await transaction.classroomMember.upsert({
        where: { userId_classroomId: { userId: user.id, classroomId: classroom.id } },
        update: { roleInClass: rawRole === UserRole.teacher ? MemberRole.teacher : MemberRole.student },
        create: {
          userId: user.id,
          classroomId: classroom.id,
          roleInClass: rawRole === UserRole.teacher ? MemberRole.teacher : MemberRole.student,
        },
      });
    }
  });

  console.info(`Conta ${email} provisionada como ${rawRole}.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : 'Falha ao provisionar conta.');
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
