'use client';

import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { parseCreatedPostResponse } from './post-client';
import type { PostsPage } from './types';

export type PostTarget =
  | { type: 'global' }
  | { type: 'classroom'; classroomId: string; classroomName: string };

type PostFormProps = {
  target: PostTarget;
};

export function PostForm({ target }: PostFormProps) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const queryKey = ['posts', target.type === 'global' ? 'global' : target.classroomId] as const;
  const mutation = useMutation({
    mutationFn: async () => {
      let response: Response;
      try {
        response = await fetch('/api/v1/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            scopeType: target.type,
            ...(target.type === 'classroom' ? { classroomId: target.classroomId } : {}),
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

  const canSubmit = !!content.trim() && content.length <= 280;
  const audience = target.type === 'global'
    ? 'Visível para toda a escola.'
    : `Visível em ${target.classroomName}.`;

  return (
    <form className="mb-6 border-b border-slate-200 pb-6" onSubmit={handleSubmit}>
      <label className="block text-sm font-semibold text-primary" htmlFor="post-content">
        Nova publicação
      </label>
      <p className="mb-2 mt-1 text-sm text-slate-600">{audience}</p>
      <textarea
        id="post-content"
        className="min-h-28 w-full resize-y rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        value={content}
        maxLength={280}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Compartilhe uma dúvida ou novidade com a comunidade"
        aria-describedby="post-counter"
      />

      <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
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

      {errorMessage && <p className="mt-2 text-sm text-red-700" role="alert">{errorMessage}</p>}
    </form>
  );
}