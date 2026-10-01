import { redirect } from 'next/navigation';
import { PhotoAlbums } from '@/components/photo-albums';
import { getBulletinClassrooms, getBulletinIdentity } from '@/lib/bulletin';

export default async function FotosPage() {
  const identity = await getBulletinIdentity();
  if (!identity) redirect('/login');
  const classrooms = await getBulletinClassrooms(identity);
  return <PhotoAlbums role={identity.role} classrooms={classrooms.map(({ id, name, schoolTrack }) => ({ id, name, schoolTrack }))} />;
}
