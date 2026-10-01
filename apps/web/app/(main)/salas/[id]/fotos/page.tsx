import { notFound, redirect } from 'next/navigation';
import { PhotoAlbums } from '@/components/photo-albums';
import { canAccessContentClassroom, contentPrisma } from '@/lib/content';
import { getBulletinClassrooms, getBulletinIdentity } from '@/lib/bulletin';

export default async function ClassroomPhotosPage({ params }: { params: Promise<{ id: string }> }) {
  const identity = await getBulletinIdentity();
  if (!identity) redirect('/login');
  const { id } = await params;
  if (!(await canAccessContentClassroom(identity, id))) notFound();
  const [classroom, classrooms] = await Promise.all([
    contentPrisma.classroom.findUnique({ where: { id } }), getBulletinClassrooms(identity),
  ]);
  if (!classroom) notFound();
  const room = { id: classroom.id, name: classroom.name, schoolTrack: classroom.schoolTrack };
  return <PhotoAlbums role={identity.role} classrooms={classrooms.map(({ id: roomId, name, schoolTrack }) => ({ id: roomId, name, schoolTrack }))} classroom={room} />;
}
