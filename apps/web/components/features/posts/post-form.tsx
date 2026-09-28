'use client';

import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { parseCreatedPostResponse } from './post-client';
import type { ClassroomOption, PostsPage } from './types';

type PostFormProps = {
  classrooms: ClassroomOption[];
  canPostGlobal: boolean;
  defaultClassroomId?: string;
};

export function PostForm({ classrooms, canPostGlobal, defaultClassroomId }: PostFormProps) {
  const queryClient = useQueryClient();
  const firstClassroomId = defaultClassroomId ?? classrooms[0]?.id ?? '';
  const [content, setContent] = useState('');
  const [scopeType, setScopeType] = useState<'global' | 'classroom'>(
    defaultClassroomId || !canPostGlobal ? 'classroom' : 'global',
  );
  const [classroomId, setClassroomId] = useState(firstClassroomId);
  const [errorMessage, setErrorMessage] = useState('');
  const queryKey = ['posts', scopeType === 'global' ? 'global' : classroomId] as const;
  const mutation = useMutation({
    mutationFn: async () => {
      let response: Response;
      try {
        response = await fetch('/api/v1/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            scopeType,
            ...(scopeType === 'classroom' ? { classroomId } : {}),
          }),
        });
      } catch {
        throw new Error('Não foi possível conectar ao servidor. Sua publicação continua salva neste formulário.');
      }

      return parseCreatedPostResponse(response);
    },
    onSuccess: (createdPost) => {
      setContent('');
      setErrorMessage('');
      queryClient.setQueryData<InfiniteData<PostsPage>>(queryKey, (current) => {
        if (!current?.pages.length) return current;
        const [firstPage, ...otherPages] = current.pages;
        if (firstPage.data.some((post) => post.id === createdPost.id)) return current;

        return {
          ...current,
          pages: [{ ...firstPage, data: [createdPost, ...firstPage.data] }, ...otherPages],
        };
      });
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => setErrorMessage(error.message),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    mutation.mutate();
  }

  const canSubmit =
    !!content.trim() &&
    content.length <= 280 &&
    (scopeType === 'global' ? canPostGlobal : !!classroomId);

  return (
    <form className="mb-6 border-b border-slate-200 pb-6" onSubmit={handleSubmit}>
      <label className="mb-2 block text-sm font-semibold text-primary" htmlFor="post-content">
        Nova publicação
      </label>
      <textarea
        id="post-content"
        className="min-h-28 w-full resize-y rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        value={content}
        maxLength={280}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Compartilhe uma dúvida ou novidade com a comunidade"
        aria-describedby="post-counter"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2" aria-label="Escopo da publicação">
          {canPostGlobal && (
            <button
              type="button"
              aria-pressed={scopeType === 'global'}
              className={`rounded-md border px-3 py-2 text-sm ${scopeType === 'global' ? 'border-primary bg-primary text-white' : 'border-slate-300 text-slate-700'}`}
              onClick={() => setScopeType('global')}
            >
              Toda a escola
            </button>
          )}
          {classrooms.length > 0 && (
            <button
              type="button"
              aria-pressed={scopeType === 'classroom'}
              className={`rounded-md border px-3 py-2 text-sm ${scopeType === 'classroom' ? 'border-primary bg-primary text-white' : 'border-slate-300 text-slate-700'}`}
              onClick={() => setScopeType('classroom')}
            >
              Uma sala
            </button>
          )}
          {scopeType === 'classroom' && classrooms.length > 0 && (
            <label className="sr-only" htmlFor="post-classroom">Sala</label>
          )}
          {scopeType === 'classroom' && classrooms.length > 0 && (
            <select
              id="post-classroom"
              className="max-w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
              value={classroomId}
              onChange={(event) => setClassroomId(event.target.value)}
            >
              {classrooms.map((classroom) => (
                <option key={classroom.id} value={classroom.id}>{classroom.name}</option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span id="post-counter" className="text-sm text-slate-500" aria-live="polite">
            {content.length} / 280
          </span>
          <button
            type="submit"
            disabled={!canSubmit || mutation.isPending}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mutation.isPending ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </div>

      {!canPostGlobal && classrooms.length === 0 && (
        <p className="mt-2 text-sm text-slate-600">Você ainda não participa de uma sala.</p>
      )}
      {errorMessage && <p className="mt-2 text-sm text-red-700" role="alert">{errorMessage}</p>}
    </form>
  );
}