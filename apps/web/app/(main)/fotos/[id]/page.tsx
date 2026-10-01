import { PhotoAlbumDetail } from '@/components/photo-album-detail';

export default async function PhotoAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PhotoAlbumDetail albumId={id} />;
}
