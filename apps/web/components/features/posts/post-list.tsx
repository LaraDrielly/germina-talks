'use client';

import { PostCard } from './post-card';
import type { FeedPost } from './types';

type PostListProps = {
  posts: FeedPost[];
  viewerId: string;
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  emptyDescription: string;
};

export function PostList({ posts, viewerId, isLoading, isError, isFetchingNextPage, emptyDescription }: PostListProps) {
  if (isLoading && posts.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500" role="status">Carregando publicações...</p>;
  }

  if (isError && posts.length === 0) {
    return <p className="py-6 text-center text-sm text-red-700" role="alert">Não foi possível carregar as publicações.</p>;
  }

  if (posts.length === 0) {
    return (
      <div className="py-10 text-center">
        <h3 className="font-semibold text-primary">Nenhuma publicação por enquanto</h3>
        <p className="mt-2 text-sm text-slate-600">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => <PostCard key={post.id} post={post} viewerId={viewerId} />)}
      {isFetchingNextPage && <p className="py-4 text-center text-sm text-slate-500" role="status">Carregando mais publicações...</p>}
      {isError && <p className="py-4 text-center text-sm text-red-700" role="alert">Não foi possível carregar mais publicações.</p>}
    </div>
  );
}