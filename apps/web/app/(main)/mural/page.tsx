import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/auth';
import { BulletinBoard } from '@/components/features/bulletin/bulletin-board';
import { BulletinServiceError, bulletinService } from '@/lib/services/bulletin';

export default async function MuralPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  let items: Awaited<ReturnType<typeof bulletinService.list>>['data'] = [];
  let context: Awaited<ReturnType<typeof bulletinService.composerContext>> | null = null;
  let loadError = false;

  try {
    const [listed, composer] = await Promise.all([
      bulletinService.list(session, {}),
      bulletinService.composerContext(session),
    ]);
    items = listed.data;
    context = composer;
  } catch (error) {
    if (error instanceof BulletinServiceError && error.status === 401) redirect('/login');
    loadError = true;
  }

  if (!context) {
    return (
      <BulletinBoard items={[]} classrooms={[]} role="student" loadError />
    );
  }

  return (
    <BulletinBoard
      items={items}
      classrooms={context.classrooms}
      role={context.role}
      loadError={loadError}
    />
  );
}
