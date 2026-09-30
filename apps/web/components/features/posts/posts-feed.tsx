'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { PostForm } from './post-form';
import { PostList } from './post-list';
import type { ClassroomOption, PostsPage } from './types';

type PostsFeedProps = {
  initialPage: PostsPage;
  classrooms: ClassroomOption[];
  canPostGlobal: boolean;
  classroomId?: string;
};

export function PostsFeed({ initialPage, classrooms, canPostGlobal, classroomId }: PostsFeedProps) {
  const sentinel = useRef<HTMLDivElement>(null);
  const query = useInfiniteQuery({
    queryKey: ['posts', classroomId ?? 'global'],
    initialPageParam: null as string | null,
    initialData: { pages: [initialPage], pageParams: [null] },
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({ limit: '20' });
      if (classroomId) params.set('classroomId', classroomId);
      if (pageParam) params.set('cursor', pageParam);

      const response = await fetch(`/api/v1/posts?${params.toString()}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? 'Não foi possível carregar as publicações.');
      return result as PostsPage;
    },
    getNextPageParam: (lastPage) => lastPage.meta.cursor ?? undefined,
  });
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = query;

  useEffect(() => {
    const element = sentinel.current;
    if (!element || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const posts = query.data.pages.flatMap((page) => page.data);
  const viewerId = query.data.pages[0]?.meta.viewerId ?? initialPage.meta.viewerId;
  const activeClassroom = classrooms.find((classroom) => classroom.id === classroomId);
  const emptyDescription = classroomId
    ? 'Quando alguém da turma publicar, a mensagem aparece aqui.'
    : 'Os avisos da coordenação para toda a escola aparecem aqui.';

  return (
    <section aria-label="Feed de publicações">
      {classroomId && activeClassroom ? (
        <PostForm
          target={{
            type: 'classroom',
            classroomId: activeClassroom.id,
            classroomName: activeClassroom.name,
          }}
        />
      ) : canPostGlobal ? (
        <PostForm target={{ type: 'global' }} />
      ) : (
        <div className="mb-6 border-b border-slate-200 pb-6">
          <p className="text-sm text-slate-600">
            Este feed mostra os avisos de toda a escola. Para publicar, abra a sala da sua turma.
          </p>
          {classrooms.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {classrooms.map((classroom) => (
                <li key={classroom.id}>
                  <Link
                    href={`/salas/${classroom.id}/feed`}
                    className="inline-flex rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-primary hover:text-primary"
                  >
                    {classroom.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-600">Você ainda não participa de uma sala.</p>
          )}
        </div>
      )}
      <PostList
        posts={posts}
        viewerId={viewerId}
        isLoading={query.isLoading}
        isError={query.isError}
        isFetchingNextPage={query.isFetchingNextPage}
        emptyDescription={emptyDescription}
      />
      <div ref={sentinel} aria-hidden="true" />
      {hasNextPage && (
        <button
          type="button"
          className="mt-3 rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 lg:sr-only"
          onClick={() => void fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          Carregar mais publicações
        </button>
      )}
    </section>
  );
}