'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
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

  return (
    <section aria-label="Feed de publicações">
      <PostForm
        classrooms={classrooms}
        canPostGlobal={canPostGlobal}
        defaultClassroomId={classroomId}
      />
      <PostList
        posts={posts}
        viewerId={viewerId}
        isLoading={query.isLoading}
        isError={query.isError}
        isFetchingNextPage={query.isFetchingNextPage}
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