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

  const load = () => {
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
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar fila.'));
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

  if (error) {
    return <p className="text-sm text-[#DC4405]">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-[#3A255B]">Moderação</h2>
        <p className="text-sm text-[#6B7280]">Fila de álbuns e fotos pendentes</p>
      </div>

      <section>
        <h3 className="text-xl text-[#3A255B] font-semibold mb-4">Álbuns pendentes ({albums.length})</h3>
        {albums.length === 0 ? <p className="text-sm text-[#6B7280]">Nenhum álbum pendente.</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          {albums.map((album) => (
            <div key={album.id} className="border border-[#E5E7EB] p-4 bg-white">
              <p className="font-semibold text-[#3C3F4F]">{album.title}</p>
              <p className="text-sm text-[#6B7280]">Por: {album.creator?.name || 'Desconhecido'}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => moderate('albums', album.id, 'approved')}
                  className="bg-[#11C76F] text-white px-3 py-1"
                >
                  Aprovar
                </button>
                <button
                  type="button"
                  onClick={() => moderate('albums', album.id, 'rejected')}
                  className="bg-[#DC4405] text-white px-3 py-1"
                >
                  Rejeitar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl text-[#3A255B] font-semibold mb-4">Fotos pendentes ({photos.length})</h3>
        {photos.length === 0 ? <p className="text-sm text-[#6B7280]">Nenhuma foto pendente.</p> : null}
        <div className="grid gap-4 md:grid-cols-3">
          {photos.map((photo) => (
            <div key={photo.id} className="border border-[#E5E7EB] bg-white overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt="Pendente" className="w-full aspect-square object-cover" />
              <div className="p-3">
                <p className="text-sm text-[#6B7280]">Álbum: {photo.album?.title}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => moderate('photos', photo.id, 'approved')}
                    className="flex-1 bg-[#11C76F] text-white py-1 text-sm"
                  >
                    Aprovar
                  </button>
                  <button
                    type="button"
                    onClick={() => moderate('photos', photo.id, 'rejected')}
                    className="flex-1 bg-[#DC4405] text-white py-1 text-sm"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
