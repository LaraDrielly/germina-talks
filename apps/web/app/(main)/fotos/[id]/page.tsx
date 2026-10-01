'use client';

import Link from 'next/link';
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
    return (
      <div className="space-y-4">
        <Link href="/fotos" className="text-sm font-medium text-accent hover:underline">
          ← Voltar para fotos
        </Link>
        <p className="rounded-xl border border-[#DC4405]/20 bg-[#DC4405]/5 px-3 py-2 text-sm text-[#DC4405]">
          {error}
        </p>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
        <div className="h-8 w-2/3 animate-pulse rounded bg-slate-100" />
        <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header className="space-y-3 border-b border-slate-200 pb-5">
        <Link href="/fotos" className="inline-flex text-sm font-medium text-accent hover:underline">
          ← Voltar para fotos
        </Link>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-accent">Álbum</p>
          <h2 className="mt-1 text-2xl font-semibold text-primary sm:text-3xl">{album.title}</h2>
          {album.description ? (
            <p className="mt-2 max-w-2xl text-sm text-slate-500">{album.description}</p>
          ) : null}
        </div>
      </header>

      <PhotoUploadForm albumId={album.id} onSuccess={() => setReloadKey((value) => value + 1)} />

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-slate-700">Fotos do álbum</h3>
          <span className="text-xs font-medium text-slate-400">
            {album.photos.length} {album.photos.length === 1 ? 'foto' : 'fotos'}
          </span>
        </div>

        {album.photos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
            <p className="font-semibold text-primary">Nenhuma foto ainda</p>
            <p className="mt-1 text-sm text-slate-500">Use o formulário acima para enviar a primeira.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6">
            {album.photos.map((photo) => (
              <PhotoTile key={photo.id} photo={photo} viewerId={viewerId} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
