'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Classroom = { id: string; name: string; schoolTrack: 'business' | 'tech' | 'factory' };
type Post = {
  id: string; authorId: string; content: string; scopeType: 'global' | 'classroom'; createdAt: string;
  author: { name: string; role: 'student' | 'teacher' | 'admin' };
  classroom: Classroom | null;
};
type Props = { classrooms: Classroom[]; userId: string; classroom?: Classroom };

const roles = { student: 'Aluno', teacher: 'Professor', admin: 'Coordenação' };
function dateLabel(value: string) { return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }
function initials(name: string) { return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join(''); }

export function PostFeed({ classrooms, userId, classroom }: Props) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [scopeType, setScopeType] = useState<'global' | 'classroom'>(classroom ? 'classroom' : 'global');
  const [classroomId, setClassroomId] = useState(classroom?.id ?? classrooms[0]?.id ?? '');
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [message, setMessage] = useState('');
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  async function loadPosts(reset = false) {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setLoadFailed(false);
    try {
      const query = new URLSearchParams();
      if (classroom) { query.set('scopeType', 'classroom'); query.set('classroomId', classroom.id); }
      if (!reset && cursor) query.set('cursor', cursor);
      const response = await fetch(`/api/v1/posts?${query}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? 'Não foi possível carregar o feed.');
      setPosts((current) => reset ? result.data : [...current, ...result.data]);
      setCursor(result.nextCursor ?? null);
    } catch (error) {
      setLoadFailed(true);
      setMessage(error instanceof Error ? error.message : 'Não foi possível carregar o feed.');
    } finally { loadingRef.current = false; setLoading(false); }
  }
  const loadPostsRef = useRef(loadPosts);
  useEffect(() => { loadPostsRef.current = loadPosts; });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void loadPosts(true); }, [classroom?.id]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !cursor || loading || loadFailed) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void loadPostsRef.current();
    }, { rootMargin: '240px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, [cursor, loading, loadFailed]);

  async function createPost(event: FormEvent) {
    event.preventDefault(); setSubmitting(true); setMessage('');
    try {
      const response = await fetch('/api/v1/posts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, scopeType, classroomId: scopeType === 'classroom' ? classroom?.id ?? classroomId : undefined }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? 'Não foi possível publicar.');
      setContent(''); setMessage('Publicação enviada.'); setCursor(null); await loadPosts(true); router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível publicar agora.'); }
    finally { setSubmitting(false); }
  }

  async function deletePost(id: string) {
    setBusyId(id); setMessage('');
    try {
      const response = await fetch(`/api/v1/posts/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? 'Não foi possível excluir.');
      setPosts((current) => current.filter((post) => post.id !== id)); setMessage('Publicação excluída.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível excluir agora.'); }
    finally { setBusyId(null); }
  }

  return <div>
    <div className="mb-6"><p className="text-xs uppercase tracking-[0.2em] text-accent">Comunidade</p><h2 className="mt-1 text-3xl font-semibold text-primary">{classroom ? `Feed · ${classroom.name}` : 'Feed'}</h2><p className="mt-2 text-sm text-text-muted">Compartilhe ideias e novidades com a comunidade escolar.</p></div>
    <form onSubmit={createPost} className="mb-6 rounded-2xl border border-border bg-surface p-5">
      <label htmlFor="post-content" className="mb-2 block font-semibold text-primary">Nova publicação</label>
      <textarea id="post-content" value={content} onChange={(event) => setContent(event.target.value)} maxLength={280} required rows={3} placeholder="O que você gostaria de compartilhar?" className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {!classroom && <select aria-label="Escopo da publicação" value={scopeType} onChange={(event) => setScopeType(event.target.value as 'global' | 'classroom')} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option value="global">Toda a escola</option><option value="classroom" disabled={!classrooms.length}>Uma sala</option></select>}
          {!classroom && scopeType === 'classroom' && <select aria-label="Sala" value={classroomId} onChange={(event) => setClassroomId(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">{classrooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}</select>}
          {classroom && <span className="rounded-full bg-accent/10 px-3 py-2 text-sm text-accent">{classroom.name}</span>}
        </div>
        <div className="flex items-center gap-3"><span className="text-xs text-text-muted">{content.length}/280</span><button type="submit" disabled={submitting || !content.trim() || (scopeType === 'classroom' && !classroom && !classroomId)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60">{submitting ? 'Publicando…' : 'Publicar'}</button></div>
      </div>
    </form>
    <p role="status" aria-live="polite" className="mb-3 min-h-5 text-sm text-slate-600">{message}</p>
    {posts.length ? <div className="space-y-4">{posts.map((post) => <article key={post.id} className="rounded-2xl border border-border bg-white p-5">
      <div className="mb-3 flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{initials(post.author.name)}</span><div><p className="font-semibold text-primary">{post.author.name}</p><p className="text-xs text-text-muted">{roles[post.author.role]} · {dateLabel(post.createdAt)}</p></div></div><span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">{post.scopeType === 'global' ? 'Toda a escola' : post.classroom?.name ?? 'Sala'}</span></div>
      <p className="whitespace-pre-wrap text-sm leading-6 text-ink">{post.content}</p>
      {post.authorId === userId && <div className="mt-3 text-right"><button type="button" onClick={() => void deletePost(post.id)} disabled={busyId !== null} className="text-xs font-medium text-red-700 hover:underline">{busyId === post.id ? 'Excluindo…' : 'Excluir'}</button></div>}
    </article>)}</div> : !loading ? <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center"><h3 className="font-semibold text-primary">Ainda não há publicações</h3><p className="mt-1 text-sm text-text-muted">Seja a primeira pessoa a compartilhar algo com a comunidade.</p></div> : null}
    {loading && <p className="py-4 text-center text-sm text-text-muted">Carregando publicações…</p>}
    {cursor && <div ref={loadMoreRef} className="mt-5 text-center"><button type="button" onClick={() => void loadPosts()} disabled={loading} className="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 disabled:opacity-60">{loading ? 'Carregando…' : loadFailed ? 'Tentar novamente' : 'Carregar mais'}</button></div>}
  </div>;
}
