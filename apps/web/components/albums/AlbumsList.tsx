'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AlbumCard } from '@/components/albums/AlbumCard';

type Album = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdBy: string;
  photos: { id: string }[];
};

type AlbumsListProps = {
  classroomId?: string;
  title: string;
  subtitle: string;
};

export function AlbumsList({ classroomId, title, subtitle }: AlbumsListProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [viewerId, setViewerId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (classroomId) params.set('classroomId', classroomId);

    fetch(`/api/v1/albums?${params.toString()}`)
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error?.message || 'Não foi possível carregar os álbuns.');
        }
        return response.json();
      })
      .then((payload) => {
        setAlbums(payload.data ?? []);
        setViewerId(payload.meta?.viewerId ?? '');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar álbuns.'))
      .finally(() => setLoading(false));
  }, [classroomId]);

  if (loading) {
    return <p className="text-sm text-[#6B7280]">Carregando álbuns...</p>;
  }

  if (error) {
    return <p className="text-sm text-[#DC4405]">{error}</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#27AAE1]">Galeria</p>
        <h2 className="text-3xl font-semibold text-[#3A255B]">{title}</h2>
        <p className="mt-1 text-sm text-[#6B7280]">{subtitle}</p>
      </div>

      {albums.length === 0 ? (
        <p className="text-sm text-[#6B7280]">Nenhum álbum por aqui ainda.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {albums.map((album) => (
            <Link key={album.id} href={`/fotos/${album.id}`}>
              <AlbumCard album={album} viewerId={viewerId} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
