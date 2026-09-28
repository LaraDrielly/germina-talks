// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PostCard } from './post-card';
import { PostForm } from './post-form';
import { PostList } from './post-list';
import { PostsFeed } from './posts-feed';
import type { FeedPost, PostsPage } from './types';

function withQueryClient(children: React.ReactNode, client = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 30_000 } },
})) {
  render(<QueryClientProvider client={client}>{children}</QueryClientProvider>);
  return client;
}

const post: FeedPost = {
  id: 'post-id',
  content: 'Publicação de teste',
  scopeType: 'classroom',
  createdAt: '2026-09-28T10:00:00.000Z',
  author: { id: 'author-id', name: 'Ana Aluna', role: 'student', avatarUrl: null },
  classroom: { id: 'classroom-id', name: '3º ano Tecnologia 2026', schoolTrack: 'tech' },
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('post components', () => {
  it('shows the character count and submits a selected classroom scope', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: { id: 'created-post' } }), { status: 201 }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    client.setQueryData(['posts', 'global'], { pages: [], pageParams: [] });
    withQueryClient(
      <PostForm
        classrooms={[{ id: 'classroom-id', name: '3º ano Tecnologia 2026' }]}
        canPostGlobal
      />,
      client,
    );

    const textarea = screen.getByRole('textbox', { name: 'Nova publicação' });
    await user.click(screen.getByRole('button', { name: 'Uma sala' }));
    await user.type(textarea, 'Dúvida da turma');

    expect(screen.getByText('15 / 280')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Publicar' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      content: 'Dúvida da turma',
      scopeType: 'classroom',
      classroomId: 'classroom-id',
    });
    expect(client.getQueryState(['posts', 'global'])?.isInvalidated).toBe(true);
  });

  it('disables submission when the character limit is exceeded', () => {
    withQueryClient(
      <PostForm
        classrooms={[{ id: 'classroom-id', name: '3º ano Tecnologia 2026' }]}
        canPostGlobal
      />,
    );
    const textarea = screen.getByRole('textbox', { name: 'Nova publicação' });
    fireEvent.change(textarea, { target: { value: 'x'.repeat(281) } });

    expect(screen.getByText('281 / 280')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Publicar' }).hasAttribute('disabled')).toBe(true);
  });

  it('shows delete only to the post author', () => {
    withQueryClient(<PostCard post={post} viewerId="author-id" />);
    expect(screen.getByRole('button', { name: 'Excluir publicação' })).toBeTruthy();
    cleanup();

    withQueryClient(<PostCard post={post} viewerId="another-user" />);
    expect(screen.queryByRole('button', { name: 'Excluir publicação' })).toBeNull();
  });

  it('renders loading, error, and empty list states', () => {
    withQueryClient(<PostList posts={[]} viewerId="viewer-id" isLoading isError={false} isFetchingNextPage={false} />);
    expect(screen.getByRole('status').textContent).toContain('Carregando');
    cleanup();

    withQueryClient(<PostList posts={[]} viewerId="viewer-id" isLoading={false} isError isFetchingNextPage={false} />);
    expect(screen.getByRole('alert').textContent).toContain('Não foi possível');
    cleanup();

    withQueryClient(<PostList posts={[]} viewerId="viewer-id" isLoading={false} isError={false} isFetchingNextPage={false} />);
    expect(screen.getByText('Nenhuma publicação por enquanto')).toBeTruthy();
  });

  it('loads the next cursor page and refreshes the list after an author delete', async () => {
    const user = userEvent.setup();
    const nextPost = { ...post, id: 'next-post', content: 'Próxima página' };
    const initialPage: PostsPage = {
      data: [post],
      meta: { cursor: 'cursor-id', hasMore: true, viewerId: 'author-id' },
    };
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [nextPost], meta: { cursor: null, hasMore: false, viewerId: 'author-id' } })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: { id: 'post-id', deleted: true } })));
    vi.stubGlobal('fetch', fetchMock);
    const client = withQueryClient(
      <PostsFeed initialPage={initialPage} classrooms={[]} canPostGlobal={false} />,
    );

    await user.click(screen.getByRole('button', { name: 'Carregar mais publicações' }));
    await screen.findByText('Próxima página');
    expect(fetchMock.mock.calls[0][0]).toContain('cursor=cursor-id');

    await user.click(screen.getAllByRole('button', { name: 'Excluir publicação' })[0]);
    await waitFor(() => expect(client.getQueryState(['posts', 'global'])?.isInvalidated).toBe(true));
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[1][1]?.method).toBe('DELETE');
    expect(fetchMock.mock.calls[2][0]).toContain('/api/v1/posts?');
  });
});