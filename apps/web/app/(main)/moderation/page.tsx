'use client';

import { useEffect, useState } from 'react';

type PendingAlbum = {
  id: string;
  title: string;
  creator?: { name: string } | null;
};

type PendingPhoto = {
  id: string;
  url: string;
  album?: { title: string } | null;
};

export default function ModerationPage() {
  const [albums, setAlbums] = useState<PendingAlbum[]>([]);
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch('/api/v1/moderation/pending')
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error?.message || 'Sem permissão para moderar.');
        }
        return response.json();
      })
      .then((payload) => {
        setAlbums(payload.data?.albums ?? []);
        setPhotos(payload.data?.photos ?? []);
        setError('');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar fila.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const moderate = async (type: 'albums' | 'photos', id: string, status: 'approved' | 'rejected') => {
    const response = await fetch(`/api/v1/moderation/${type}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      load();
    } else {
      const payload = await response.json().catch(() => null);
      setError(payload?.error?.message || 'Falha ao moderar.');
    }
  };

  if (error && !loading && albums.length === 0 && photos.length === 0) {
    return (
      <p className="rounded-xl border border-[#DC4405]/20 bg-[#DC4405]/5 px-3 py-2 text-sm text-[#DC4405]">
        {error}
      </p>
    );
  }

  return (
    <section className="space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent">Coordenação</p>
        <h2 className="mt-1 text-2xl font-semibold text-primary sm:text-3xl">Moderação</h2>
        <p className="mt-1 text-sm text-slate-500">Fila de álbuns e fotos pendentes</p>
      </header>

      {error ? (
        <p className="rounded-xl border border-[#DC4405]/20 bg-[#DC4405]/5 px-3 py-2 text-sm text-[#DC4405]">
          {error}
        </p>
      ) : null}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Álbuns pendentes ({albums.length})</h3>
        {albums.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            Nenhum álbum pendente.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {albums.map((album) => (
              <div key={album.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="font-semibold text-slate-800">{album.title}</p>
                <p className="mt-1 text-sm text-slate-500">Por: {album.creator?.name || 'Desconhecido'}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => moderate('albums', album.id, 'approved')}
                    className="rounded-xl bg-[#11C76F] px-3 py-2 text-sm font-semibold text-white"
                  >
                    Aprovar
                  </button>
                  <button
                    type="button"
                    onClick={() => moderate('albums', album.id, 'rejected')}
                    className="rounded-xl bg-[#DC4405] px-3 py-2 text-sm font-semibold text-white"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Fotos pendentes ({photos.length})</h3>
        {photos.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            Nenhuma foto pendente.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <div key={photo.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="Pendente" className="aspect-square w-full object-cover" />
                <div className="space-y-3 p-3">
                  <p className="text-sm text-slate-500">Álbum: {photo.album?.title}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => moderate('photos', photo.id, 'approved')}
                      className="flex-1 rounded-xl bg-[#11C76F] py-2 text-sm font-semibold text-white"
                    >
                      Aprovar
                    </button>
                    <button
                      type="button"
                      onClick={() => moderate('photos', photo.id, 'rejected')}
                      className="flex-1 rounded-xl bg-[#DC4405] py-2 text-sm font-semibold text-white"
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
