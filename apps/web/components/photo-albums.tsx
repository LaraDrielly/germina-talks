'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

type Classroom = { id: string; name: string; schoolTrack: 'business' | 'tech' | 'factory' };
type Album = {
  id: string; title: string; description: string | null; scopeType: 'global' | 'classroom'; createdAt: string;
  classroom: Classroom | null; _count: { photos: number }; coverUrl: string | null;
};
type Props = { classrooms: Classroom[]; role: 'student' | 'teacher' | 'admin'; classroom?: Classroom };

export function PhotoAlbums({ classrooms, role, classroom }: Props) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scopeType, setScopeType] = useState<'global' | 'classroom'>(classroom ? 'classroom' : 'global');
  const [classroomId, setClassroomId] = useState(classroom?.id ?? classrooms[0]?.id ?? '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const canCreate = role === 'teacher' || role === 'admin';

  async function loadAlbums() {
    setLoading(true);
    try {
      const query = classroom ? `?classroomId=${encodeURIComponent(classroom.id)}` : '';
      const response = await fetch(`/api/v1/albums${query}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? 'Não foi possível carregar os álbuns.');
      setAlbums(result.data);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível carregar os álbuns.'); }
    finally { setLoading(false); }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void loadAlbums(); }, [classroom?.id]);

  async function createAlbum(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage('');
    try {
      const response = await fetch('/api/v1/albums', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: description || undefined, scopeType, classroomId: scopeType === 'classroom' ? classroom?.id ?? classroomId : undefined }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? 'Não foi possível criar o álbum.');
      setTitle(''); setDescription(''); setMessage('Álbum criado.'); await loadAlbums();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível criar o álbum.'); }
    finally { setSaving(false); }
  }

  return <div>
    <div className="mb-6"><p className="text-xs uppercase tracking-[0.2em] text-accent">Galeria</p><h2 className="mt-1 text-3xl font-semibold text-primary">{classroom ? `Fotos · ${classroom.name}` : 'Álbuns de fotos'}</h2><p className="mt-2 text-sm text-text-muted">Registros dos eventos e momentos da comunidade escolar.</p></div>
    {canCreate && <form onSubmit={createAlbum} className="mb-6 rounded-2xl border border-border bg-surface p-5">
      <h3 className="mb-4 font-semibold text-primary">Criar álbum</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <div><label htmlFor="album-title" className="mb-1 block text-sm font-medium text-ink">Título</label><input id="album-title" value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={120} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5" placeholder="Ex.: Feira de Ciências" /></div>
        <div><label htmlFor="album-description" className="mb-1 block text-sm font-medium text-ink">Descrição (opcional)</label><input id="album-description" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={500} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5" placeholder="Conte um pouco sobre o evento" /></div>
        {!classroom && <div className="flex gap-2"><select aria-label="Escopo do álbum" value={scopeType} onChange={(event) => setScopeType(event.target.value as 'global' | 'classroom')} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option value="global">Toda a escola</option><option value="classroom" disabled={!classrooms.length}>Uma sala</option></select>{scopeType === 'classroom' && <select aria-label="Sala do álbum" value={classroomId} onChange={(event) => setClassroomId(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">{classrooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}</select>}</div>}
        {classroom && <p className="self-center text-sm text-text-muted">Este álbum será visível para membros de {classroom.name}.</p>}
        <div className="flex items-center justify-end"><button disabled={saving || (scopeType === 'classroom' && !classroom && !classroomId)} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? 'Criando…' : 'Criar álbum'}</button></div>
      </div>
    </form>}
    {role === 'student' && <p className="mb-5 rounded-xl bg-surface p-4 text-sm text-text-muted">Professores e coordenação podem criar álbuns. Você pode contribuir com fotos nos álbuns da sua sala.</p>}
    <p role="status" aria-live="polite" className="mb-3 min-h-5 text-sm text-slate-600">{message}</p>
    {albums.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{albums.map((album) => <Link key={album.id} href={`/fotos/${album.id}`} className="overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
      {album.coverUrl ? <><span className="sr-only">Foto de capa</span>
        {/* eslint-disable-next-line @next/next/no-img-element -- URLs assinadas são externas e expiram rapidamente. */}
        <img src={album.coverUrl} alt="" className="h-44 w-full object-cover" />
      </> : <div className="flex h-44 items-center justify-center bg-gradient-to-br from-primary/20 via-accent/20 to-slate-200 text-lg font-semibold text-primary">Germina Talks</div>}
      <div className="p-4"><div className="mb-2 flex items-start justify-between gap-2"><h3 className="font-semibold text-primary">{album.title}</h3><span className="shrink-0 rounded-full bg-accent/10 px-2 py-1 text-xs text-accent">{album._count.photos} fotos</span></div><p className="text-sm text-text-muted">{album.classroom?.name ?? 'Toda a escola'}</p>{album.description && <p className="mt-2 line-clamp-2 text-sm text-ink">{album.description}</p>}</div>
    </Link>)}</div> : !loading ? <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center"><h3 className="font-semibold text-primary">Nenhum álbum por aqui</h3><p className="mt-1 text-sm text-text-muted">Quando houver fotos de eventos, os álbuns aparecerão aqui.</p></div> : <p className="py-6 text-center text-sm text-text-muted">Carregando álbuns…</p>}
  </div>;
}
