import { AlbumsList } from '@/components/albums/AlbumsList';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export default async function FotosPage() {
  const session = await getServerSession(authOptions);
  return (
    <AlbumsList
      title="Fotos"
      subtitle="Álbuns globais de eventos da escola"
      role={session?.user?.role}
    />
  );
}
