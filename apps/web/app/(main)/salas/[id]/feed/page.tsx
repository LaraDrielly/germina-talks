import { notFound, redirect } from 'next/navigation';
import { PostFeed } from '@/components/post-feed';
import { canAccessContentClassroom, contentPrisma } from '@/lib/content';
import { getBulletinClassrooms, getBulletinIdentity } from '@/lib/bulletin';

export default async function ClassroomFeedPage({ params }: { params: Promise<{ id: string }> }) {
  const identity = await getBulletinIdentity();
  if (!identity) redirect('/login');
  const { id } = await params;
  if (!(await canAccessContentClassroom(identity, id))) notFound();
  const [classroom, classrooms] = await Promise.all([
    contentPrisma.classroom.findUnique({ where: { id } }), getBulletinClassrooms(identity),
  ]);
  if (!classroom) notFound();
  const room = { id: classroom.id, name: classroom.name, schoolTrack: classroom.schoolTrack };
  return <PostFeed userId={identity.id} classrooms={classrooms.map(({ id: roomId, name, schoolTrack }) => ({ id: roomId, name, schoolTrack }))} classroom={room} />;
}
