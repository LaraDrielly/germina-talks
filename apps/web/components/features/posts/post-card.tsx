'use client';

import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { FeedPost } from './types';

const roleLabels: Record<FeedPost['author']['role'], string> = {
  student: 'Aluno',
  teacher: 'Professor',
  admin: 'Coordenação',
};

export function PostCard({ post, viewerId }: { post: FeedPost; viewerId: string }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/v1/posts/${post.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Não foi possível excluir a publicação.');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
  const date = new Date(post.createdAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
  const initials = post.author.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <article className="border-b border-slate-200 py-5 last:border-b-0" aria-label={`Publicação de ${post.author.name}`}>
      <div className="flex items-start gap-3">
        {post.author.avatarUrl ? (
          <Image
            src={post.author.avatarUrl}
            alt=""
            width={40}
            height={40}
            unoptimized
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white" aria-hidden="true">
            {initials}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="font-semibold text-slate-800">{post.author.name}</h3>
            <span className="text-sm text-slate-500">{roleLabels[post.author.role]}</span>
            <time className="text-sm text-slate-500" dateTime={new Date(post.createdAt).toISOString()}>{date}</time>
          </div>
          <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800">
            {post.scopeType === 'global' ? 'Toda a escola' : post.classroom?.name ?? 'Sala'}
          </span>
          <p className="mt-3 whitespace-pre-wrap break-words text-slate-700">{post.content}</p>
          {viewerId === post.author.id && (
            <button
              type="button"
              className="mt-3 text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-2 hover:text-red-700"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              aria-label="Excluir publicação"
            >
              {mutation.isPending ? 'Excluindo...' : 'Excluir'}
            </button>
          )}
          {mutation.isError && <p className="mt-2 text-sm text-red-700" role="alert">Não foi possível excluir a publicação.</p>}
        </div>
      </div>
    </article>
  );
}