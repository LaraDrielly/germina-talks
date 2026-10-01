'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlbumCardLink } from '@/components/albums/AlbumCard';

type Album = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdBy: string;
  photos: Array<{ id: string; url?: string }>;
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

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-accent">Galeria</p>
          <h2 className="mt-1 text-2xl font-semibold text-primary sm:text-3xl">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate((value) => !value)}
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          {showCreate ? 'Cancelar' : 'Novo álbum'}
        </button>
      </header>

      {showCreate ? (
        <form
          onSubmit={handleCreate}
          className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
        >
          <p className="text-sm font-semibold text-slate-700">Criar álbum</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              maxLength={120}
              required
              placeholder="Título do álbum"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 sm:col-span-2"
            />
            <input
              value={newDescription}
              onChange={(event) => setNewDescription(event.target.value)}
              maxLength={2000}
              placeholder="Descrição (opcional)"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 sm:col-span-2"
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="inline-flex rounded-xl bg-[#11C76F] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-50"
          >
            {creating ? 'Criando...' : 'Criar álbum'}
          </button>
        </form>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-[#DC4405]/20 bg-[#DC4405]/5 px-3 py-2 text-sm text-[#DC4405]">
          {error}
        </p>
      ) : null}

      {loading && albums.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-56 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : albums.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
          <p className="text-base font-semibold text-primary">Nenhum álbum ainda</p>
          <p className="mt-2 text-sm text-slate-500">
            Crie o primeiro álbum e depois abra-o para enviar fotos.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {albums.map((album) => (
            <AlbumCardLink key={album.id} album={album} viewerId={viewerId} />
          ))}
        </div>
      )}
    </section>
  );
}
