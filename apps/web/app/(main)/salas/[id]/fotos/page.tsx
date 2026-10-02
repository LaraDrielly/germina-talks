import { AlbumsList } from '@/components/albums/AlbumsList';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

type PageProps = { params: Promise<{ id: string }> };

export default async function ClassroomFotosPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  return (
    <AlbumsList
      classroomId={id}
      title="Fotos da sala"
      subtitle="Álbuns desta turma"
      role={session?.user?.role}
    />
  );
}
