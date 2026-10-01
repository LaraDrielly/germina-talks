import { redirect } from 'next/navigation';
import { PostFeed } from '@/components/post-feed';
import { getBulletinClassrooms, getBulletinIdentity } from '@/lib/bulletin';

export default async function FeedPage() {
  const identity = await getBulletinIdentity();
  if (!identity) redirect('/login');
  const classrooms = await getBulletinClassrooms(identity);
  return <PostFeed userId={identity.id} classrooms={classrooms.map(({ id, name, schoolTrack }) => ({ id, name, schoolTrack }))} />;
}
