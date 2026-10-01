import { AlbumsList } from '@/components/albums/AlbumsList';

type PageProps = { params: Promise<{ id: string }> };

export default async function ClassroomFotosPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AlbumsList
      classroomId={id}
      title="Fotos da sala"
      subtitle="Álbuns desta turma"
    />
  );
}
