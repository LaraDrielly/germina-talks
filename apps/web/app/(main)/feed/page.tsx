import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth';
import { PostsFeed } from '../../../components/features/posts/posts-feed';
import { postsService } from '../../../lib/services/posts';

export default async function FeedPage() {
  const session = await getServerSession(authOptions);
  const [initialPage, composer] = await Promise.all([
    postsService.list(session, { limit: 20 }),
    postsService.composerContext(session),
  ]);

  return (
    <div>
      <div className="mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Comunidade</p>
          <h2 className="text-3xl font-semibold text-primary">Feed</h2>
        </div>
      </div>

      <PostsFeed
        initialPage={initialPage}
        classrooms={composer.classrooms}
        canPostGlobal={composer.canPostGlobal}
      />
    </div>
  );
}
