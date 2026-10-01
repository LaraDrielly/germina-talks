'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type SchoolTrack = 'business' | 'tech' | 'factory';
type ClassroomOption = { id: string; name: string; schoolTrack: SchoolTrack; roleInClass: 'student' | 'teacher' };
type BulletinItem = {
  id: string;
  title: string;
  body: string;
  isPinned: boolean;
  scopeType: 'global' | 'classroom';
  expiresAt: string | null;
  createdAt: string;
  canPin: boolean;
  author: { name: string; role: 'student' | 'teacher' | 'admin' };
  classroom: { id: string; name: string; schoolTrack: SchoolTrack } | null;
};

type Props = {
  items: BulletinItem[];
  classrooms: ClassroomOption[];
  role: 'student' | 'teacher' | 'admin';
  loadError?: boolean;
  targetClassroom?: ClassroomOption;
};

const roleLabels = { student: 'Aluno', teacher: 'Professor', admin: 'Coordenação' };
const classroomColors: Record<SchoolTrack, string> = {
  business: 'bg-school-business',
  tech: 'bg-school-tech',
  factory: 'bg-school-factory',
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function BulletinBoard({ items, classrooms, role, loadError = false, targetClassroom }: Props) {
  const router = useRouter();
  const [scopeType, setScopeType] = useState<'global' | 'classroom'>(targetClassroom || role !== 'admin' ? 'classroom' : 'global');
  const [classroomId, setClassroomId] = useState(targetClassroom?.id ?? classrooms[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pinningId, setPinningId] = useState<string | null>(null);
  const canPublish = role === 'admin' || classrooms.length > 0;
  const canPinInSelectedClassroom = role === 'admin' || (
    role === 'teacher' && (
      targetClassroom?.roleInClass === 'teacher' ||
      classrooms.some((classroom) => classroom.id === classroomId && classroom.roleInClass === 'teacher')
    )
  );

  async function createBulletin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/v1/bulletin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          scopeType,
          classroomId: scopeType === 'classroom' ? (targetClassroom?.id ?? classroomId) : undefined,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
          isPinned,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error?.message ?? 'Não foi possível publicar o recado.');
        return;
      }

      setTitle('');
      setBody('');
      setExpiresAt('');
      setIsPinned(false);
      setMessage('Recado publicado.');
      router.refresh();
    } catch {
      setMessage('Não foi possível publicar o recado agora. Verifique sua conexão e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function pinBulletin(id: string) {
    setMessage('');
    setPinningId(id);
    try {
      const response = await fetch(`/api/v1/bulletin/${id}/pin`, { method: 'POST' });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error?.message ?? 'Não foi possível fixar o recado.');
        return;
      }
      setMessage('Recado fixado no mural.');
      router.refresh();
    } catch {
      setMessage('Não foi possível fixar o recado agora. Verifique sua conexão e tente novamente.');
    } finally {
      setPinningId(null);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Informações da comunidade</p>
        <h2 className="mt-1 text-3xl font-semibold text-primary">{targetClassroom ? `Mural · ${targetClassroom.name}` : 'Mural'}</h2>
        <p className="mt-2 text-sm text-slate-600">{targetClassroom ? 'Avisos importantes desta sala.' : 'Avisos importantes da escola e das suas salas.'}</p>
      </div>

      {canPublish ? (
        <form onSubmit={createBulletin} className="mb-8 rounded-2xl border border-slate-200 bg-surface p-5">
          <h3 className="mb-4 text-lg font-semibold text-primary">Compartilhe um recado</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="bulletin-title" className="mb-1.5 block text-sm font-medium text-ink">Título</label>
              <input
                id="bulletin-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={120}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Ex.: Reunião de orientação"
              />
              <p className="mt-1 text-right text-xs text-slate-500">{title.length}/120</p>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="bulletin-body" className="mb-1.5 block text-sm font-medium text-ink">Recado</label>
              <textarea
                id="bulletin-body"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                required
                rows={4}
                className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Escreva as informações que a comunidade precisa saber."
              />
            </div>

            {role === 'admin' && !targetClassroom ? (
              <div>
                <label htmlFor="bulletin-scope" className="mb-1.5 block text-sm font-medium text-ink">Compartilhar com</label>
                <select
                  id="bulletin-scope"
                  value={scopeType}
                  onChange={(event) => setScopeType(event.target.value as 'global' | 'classroom')}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="global">Toda a escola</option>
                  <option value="classroom">Uma sala</option>
                </select>
              </div>
            ) : null}

            {(scopeType === 'classroom' || (role !== 'admin' && classrooms.length > 1)) && !targetClassroom ? (
              <div>
                <label htmlFor="bulletin-classroom" className="mb-1.5 block text-sm font-medium text-ink">Sala</label>
                <select
                  id="bulletin-classroom"
                  value={classroomId}
                  onChange={(event) => setClassroomId(event.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {classrooms.map((classroom) => <option key={classroom.id} value={classroom.id}>{classroom.name}</option>)}
                </select>
              </div>
            ) : targetClassroom ? (
              <div>
                <span className="mb-1.5 block text-sm font-medium text-ink">Sala</span>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium text-white ${classroomColors[targetClassroom.schoolTrack]}`}>{targetClassroom.name}</span>
              </div>
            ) : null}

            <div>
              <label htmlFor="bulletin-expires" className="mb-1.5 block text-sm font-medium text-ink">Data de expiração <span className="font-normal text-slate-500">(opcional)</span></label>
              <input
                id="bulletin-expires"
                type="datetime-local"
                value={expiresAt}
                onChange={(event) => setExpiresAt(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {canPinInSelectedClassroom ? (
              <label className="flex items-center gap-2 self-end pb-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(event) => setIsPinned(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                />
                Fixar no topo do mural
              </label>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">Seu papel: {roleLabels[role]}. Recados de sala ficam visíveis apenas para seus membros.</p>
            <button
              type="submit"
              disabled={isSubmitting || (scopeType === 'classroom' && !classroomId)}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Publicando…' : 'Publicar recado'}
            </button>
          </div>
        </form>
      ) : (
        <p className="mb-8 rounded-xl border border-slate-200 bg-surface p-4 text-sm text-slate-600">
          Você ainda não participa de uma sala. Quando estiver vinculado a uma turma, poderá publicar recados por lá.
        </p>
      )}

      <p role="status" aria-live="polite" className="mb-4 min-h-5 text-sm text-slate-600">{message}</p>
      {loadError ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          Não foi possível carregar os recados agora. Tente atualizar a página.
        </div>
      ) : items.length ? (
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className={`rounded-xl border-l-4 p-5 shadow-sm ${item.isPinned ? 'border-accent bg-surface' : 'border-slate-200 bg-white'}`}
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium text-white ${item.scopeType === 'global' ? 'bg-school-community' : classroomColors[item.classroom?.schoolTrack ?? 'business']}`}>
                      {item.scopeType === 'global' ? 'Toda a escola' : item.classroom?.name ?? 'Sala'}
                    </span>
                    {item.isPinned ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary"><span aria-hidden="true">📌</span> Fixado</span> : null}
                  </div>
                  <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.author.name} · {roleLabels[item.author.role]} · {formatDate(item.createdAt)}
                  </p>
                </div>
                {item.canPin ? (
                  item.isPinned ? (
                    <span className="text-xs font-medium text-slate-500">No topo do mural</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => pinBulletin(item.id)}
                      disabled={pinningId !== null}
                      className="rounded-lg border border-primary px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {pinningId === item.id ? 'Fixando…' : 'Fixar recado'}
                    </button>
                  )
                ) : null}
              </div>
              <p className="whitespace-pre-wrap text-sm leading-6 text-ink">{item.body}</p>
              {item.expiresAt ? <p className="mt-4 text-xs font-medium text-slate-500">Expira em {formatDate(item.expiresAt)}</p> : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-xl text-accent" aria-hidden="true">📌</div>
          <h3 className="font-semibold text-primary">Nenhum recado por aqui</h3>
          <p className="mt-1 text-sm text-slate-600">Quando houver novidades da escola ou da sua sala, elas aparecerão neste mural.</p>
        </div>
      )}
    </div>
  );
}
