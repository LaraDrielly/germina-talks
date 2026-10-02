import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { authOptions } from '@/auth';
import { BulletinBoard } from '@/components/features/bulletin/bulletin-board';
import { BulletinServiceError, bulletinService } from '@/lib/services/bulletin';
import { checkUserAccessToClassroom } from '@/lib/services/scope';

export default async function ClassroomMuralPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolved = await Promise.resolve(params);
  const classroomId = resolved.id;
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect('/login');

  const userId = session.user.id;
  const isAdmin = session.user.role === 'admin';
  if (!userId && !isAdmin) notFound();

  if (userId && !isAdmin) {
    const hasAccess = await checkUserAccessToClassroom(userId, classroomId);
    if (!hasAccess) notFound();
  }

  try {
    const [listed, composer] = await Promise.all([
      bulletinService.list(session, { classroomId }),
      bulletinService.composerContext(session),
    ]);

    const targetClassroom = composer.classrooms.find((classroom) => classroom.id === classroomId);
    if (!targetClassroom) notFound();

    return (
      <BulletinBoard
        items={listed.data}
        classrooms={composer.classrooms}
        role={composer.role}
        targetClassroom={targetClassroom}
      />
    );
  } catch (error) {
    if (error instanceof BulletinServiceError && error.status === 403) notFound();
    if (error instanceof BulletinServiceError && error.status === 401) redirect('/login');
    throw error;
  }
}
