'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
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
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const loadAlbums = useCallback(() => {
    setLoading(true);
    setError('');
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

  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    setError('');

    try {
      const response = await fetch('/api/v1/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim() || null,
          scopeType: classroomId ? 'classroom' : 'global',
          classroomId: classroomId || undefined,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error?.message || 'Não foi possível criar o álbum.');
      }

      setNewTitle('');
      setNewDescription('');
      setShowCreate(false);
      loadAlbums();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar álbum.');
    } finally {
      setCreating(false);
    }
  };

  if (loading && albums.length === 0) {
    return <p className="text-sm text-[#6B7280]">Carregando álbuns...</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#27AAE1]">Galeria</p>
          <h2 className="text-3xl font-semibold text-[#3A255B]">{title}</h2>
          <p className="mt-1 text-sm text-[#6B7280]">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate((value) => !value)}
          className="px-4 py-2 bg-[#3A255B] text-white text-sm font-medium"
        >
          {showCreate ? 'Cancelar' : 'Novo álbum'}
        </button>
      </div>

      {showCreate ? (
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-3 p-4 border border-[#E5E7EB] bg-[#F5F6F8]">
          <p className="text-sm font-medium text-[#3C3F4F]">Criar álbum</p>
          <input
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            maxLength={120}
            required
            placeholder="Título do álbum"
            className="border border-[#E5E7EB] px-3 py-2 text-sm bg-white"
          />
          <input
            value={newDescription}
            onChange={(event) => setNewDescription(event.target.value)}
            maxLength={2000}
            placeholder="Descrição (opcional)"
            className="border border-[#E5E7EB] px-3 py-2 text-sm bg-white"
          />
          <button
            type="submit"
            disabled={creating}
            className="self-start px-4 py-2 bg-[#11C76F] text-white disabled:opacity-50"
          >
            {creating ? 'Criando...' : 'Criar álbum'}
          </button>
        </form>
      ) : null}

      {error ? <p className="mb-4 text-sm text-[#DC4405]">{error}</p> : null}

      {albums.length === 0 ? (
        <p className="text-sm text-[#6B7280]">
          Nenhum álbum por aqui ainda. Crie um álbum e abra-o para enviar fotos.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {albums.map((album) => (
            <Link key={album.id} href={`/fotos/${album.id}`} className="block">
              <AlbumCard album={album} viewerId={viewerId} />
              <p className="mt-1 text-xs text-[#27AAE1]">Abrir álbum para enviar fotos →</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
