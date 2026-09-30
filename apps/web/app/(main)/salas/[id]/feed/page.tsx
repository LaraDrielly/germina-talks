import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { authOptions } from '@/auth';
import { PostsFeed } from '@/components/features/posts/posts-feed';
import { checkUserAccessToClassroom } from '@/lib/services/scope';
import { PostServiceError, postsService } from '@/lib/services/posts';

export default async function ClassroomFeedPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolved = await Promise.resolve(params);
  const classroomId = resolved.id;
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect('/login');

  const userId = session.user.id;
  if (!userId) notFound();

  const hasAccess = await checkUserAccessToClassroom(userId, classroomId);
  if (!hasAccess) notFound();

  try {
    const [initialPage, composer] = await Promise.all([
      postsService.list(session, { classroomId, limit: 20 }),
      postsService.composerContext(session),
    ]);

    const classroom =
      initialPage.data[0]?.classroom ??
      composer.classrooms.find((item) => item.id === classroomId);

    return (
      <div>
        <div className="mb-6">
          <p className="text-xs uppercase text-accent">Feed da sala</p>
          <h2 className="text-3xl font-semibold text-primary">{classroom?.name ?? 'Publicações'}</h2>
        </div>
        <PostsFeed
          initialPage={initialPage}
          classrooms={composer.classrooms}
          canPostGlobal={composer.canPostGlobal}
          classroomId={classroomId}
        />
      </div>
    );
  } catch (error) {
    if (error instanceof PostServiceError && error.status === 403) notFound();
    throw error;
  }
}
