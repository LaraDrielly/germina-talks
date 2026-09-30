// @vitest-environment jsdom

import { QueryClient, QueryClientProvider, type InfiniteData } from '@tanstack/react-query';
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

const createdClassroomPost: FeedPost = {
  ...post,
  id: 'created-classroom-post',
  content: 'Dúvida da turma',
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('post components', () => {
  it('shows the character count and submits a selected classroom scope', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({ data: createdClassroomPost }, { status: 201 }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const initialPage: PostsPage = {
      data: [post],
      meta: { cursor: null, hasMore: false, viewerId: 'author-id' },
    };
    client.setQueryData(['posts', 'classroom-id'], { pages: [initialPage], pageParams: [null] });
    withQueryClient(
      <PostForm
        target={{ type: 'classroom', classroomId: 'classroom-id', classroomName: '3º ano Tecnologia 2026' }}
      />,
      client,
    );

    const textarea = screen.getByRole('textbox', { name: 'Nova publicação' });
    expect(screen.queryByRole('button', { name: 'Uma sala' })).toBeNull();
    expect(screen.getByText('Visível em 3º ano Tecnologia 2026.')).toBeTruthy();
    await user.type(textarea, 'Dúvida da turma');

    expect(screen.getByText('15 / 280')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Publicar' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      content: 'Dúvida da turma',
      scopeType: 'classroom',
      classroomId: 'classroom-id',
    });
    expect((screen.getByRole('textbox', { name: 'Nova publicação' }) as HTMLTextAreaElement).value).toBe('');
    expect(client.getQueryData<InfiniteData<PostsPage>>(['posts', 'classroom-id'])?.pages[0].data[0].id)
      .toBe('created-classroom-post');
    expect(client.getQueryState(['posts', 'classroom-id'])?.isInvalidated).toBe(true);
    expect(client.getQueryState(['posts', 'global'])).toBeUndefined();
  });

  it('points a student on the school feed to their classroom instead of a scope switch', () => {
    const initialPage: PostsPage = {
      data: [],
      meta: { cursor: null, hasMore: false, viewerId: 'viewer-id' },
    };
    withQueryClient(
      <PostsFeed
        initialPage={initialPage}
        classrooms={[{ id: 'classroom-id', name: '3º ano Tecnologia 2026' }]}
        canPostGlobal={false}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Uma sala' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Publicar' })).toBeNull();
    expect(screen.getByRole('link', { name: '3º ano Tecnologia 2026' }).getAttribute('href'))
      .toBe('/salas/classroom-id/feed');
    expect(screen.getByText('Os avisos da coordenação para toda a escola aparecem aqui.')).toBeTruthy();
  });

  it('preserves the draft and announces an API error', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Autenticação necessária.' } },
      { status: 401 },
    )));
    withQueryClient(
      <PostForm target={{ type: 'global' }} />,
    );

    const textarea = screen.getByRole('textbox', { name: 'Nova publicação' }) as HTMLTextAreaElement;
    await user.type(textarea, 'Meu rascunho');
    await user.click(screen.getByRole('button', { name: 'Publicar' }));

    expect((await screen.findByRole('alert')).textContent).toContain('Autenticação necessária.');
    expect(textarea.value).toBe('Meu rascunho');
  });

  it('preserves the draft when fetch receives HTML or fails on the network', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response('<html>login</html>', { headers: { 'Content-Type': 'text/html' } }))
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);
    withQueryClient(
      <PostForm target={{ type: 'global' }} />,
    );

    const textarea = screen.getByRole('textbox', { name: 'Nova publicação' }) as HTMLTextAreaElement;
    await user.type(textarea, 'Rascunho resiliente');
    await user.click(screen.getByRole('button', { name: 'Publicar' }));
    expect((await screen.findByRole('alert')).textContent).toContain('Verifique sua sessão');
    expect(textarea.value).toBe('Rascunho resiliente');

    await user.click(screen.getByRole('button', { name: 'Publicar' }));
    expect((await screen.findByRole('alert')).textContent).toContain('Não foi possível conectar ao servidor.');
    expect(textarea.value).toBe('Rascunho resiliente');
  });

  it('disables submission when the character limit is exceeded', () => {
    withQueryClient(
      <PostForm target={{ type: 'global' }} />,
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
    withQueryClient(<PostList posts={[]} viewerId="viewer-id" isLoading isError={false} isFetchingNextPage={false} emptyDescription="Os avisos da coordenação para toda a escola aparecem aqui." />);
    expect(screen.getByRole('status').textContent).toContain('Carregando');
    cleanup();

    withQueryClient(<PostList posts={[]} viewerId="viewer-id" isLoading={false} isError isFetchingNextPage={false} emptyDescription="Os avisos da coordenação para toda a escola aparecem aqui." />);
    expect(screen.getByRole('alert').textContent).toContain('Não foi possível');
    cleanup();

    withQueryClient(<PostList posts={[]} viewerId="viewer-id" isLoading={false} isError={false} isFetchingNextPage={false} emptyDescription="Os avisos da coordenação para toda a escola aparecem aqui." />);
    expect(screen.getByText('Nenhuma publicação por enquanto')).toBeTruthy();
    expect(screen.getByText('Os avisos da coordenação para toda a escola aparecem aqui.')).toBeTruthy();
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