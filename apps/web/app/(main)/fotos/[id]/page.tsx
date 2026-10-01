'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PhotoTile } from '@/components/albums/PhotoTile';
import { PhotoUploadForm } from '@/components/albums/PhotoUploadForm';

type AlbumDetail = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  photos: Array<{
    id: string;
    url: string;
    status: string;
    uploadedBy: string;
    caption: string | null;
  }>;
};

export default function AlbumDetailPage() {
  const params = useParams<{ id: string }>();
  const [album, setAlbum] = useState<AlbumDetail | null>(null);
  const [viewerId, setViewerId] = useState('');
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/v1/albums/${params.id}`)
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error?.message || 'Álbum não encontrado.');
        }
        return response.json();
      })
      .then((payload) => {
        setAlbum(payload.data);
        setViewerId(payload.meta?.viewerId ?? '');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar álbum.'));
  }, [params.id, reloadKey]);

  if (error) {
    return <p className="text-sm text-[#DC4405]">{error}</p>;
  }

  if (!album) {
    return <p className="text-sm text-[#6B7280]">Carregando álbum...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-[#3A255B]">{album.title}</h2>
        {album.description ? <p className="mt-1 text-sm text-[#6B7280]">{album.description}</p> : null}
      </div>

      <PhotoUploadForm albumId={album.id} onSuccess={() => setReloadKey((value) => value + 1)} />

      {album.photos.length === 0 ? (
        <p className="text-sm text-[#6B7280]">Nenhuma foto neste álbum ainda.</p>
      ) : (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
          {album.photos.map((photo) => (
            <PhotoTile key={photo.id} photo={photo} viewerId={viewerId} />
          ))}
        </div>
      )}
    </div>
  );
}
