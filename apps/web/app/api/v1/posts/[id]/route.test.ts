import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DELETE } from './route';
import { postsService } from '../../../../../lib/services/posts';

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('../../../../../lib/services/posts', () => {
  class MockPostServiceError extends Error {
    constructor(
      public readonly status: number,
      public readonly code: string,
      message: string,
    ) {
      super(message);
    }
  }

  return { PostServiceError: MockPostServiceError, postsService: { delete: vi.fn() } };
});
import { PostServiceError } from '../../../../../lib/services/posts';

const session = { user: { email: 'ana.aluna@institutojef.org.br', role: 'student' } } as Session;

describe('DELETE /api/v1/posts/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getServerSession).mockResolvedValue(session);
  });

  it('returns a success envelope for a deleted post', async () => {
    vi.mocked(postsService.delete).mockResolvedValue(undefined);

    const response = await DELETE(new Request('http://localhost/api/v1/posts/post-id'), {
      params: Promise.resolve({ id: 'post-id' }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ data: { id: 'post-id', deleted: true } });
  });

  it('preserves forbidden status and error envelope from the service', async () => {
    vi.mocked(postsService.delete).mockRejectedValue(
      new PostServiceError(403, 'FORBIDDEN', 'Somente o autor pode excluir esta publicação.'),
    );

    const response = await DELETE(new Request('http://localhost/api/v1/posts/post-id'), {
      params: Promise.resolve({ id: 'post-id' }),
    });

    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ error: { code: 'FORBIDDEN' } });
  });

  it('returns a JSON 401 for unauthenticated deletion', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    vi.mocked(postsService.delete).mockRejectedValue(
      new PostServiceError(401, 'UNAUTHORIZED', 'Autenticação necessária.'),
    );

    const response = await DELETE(new Request('http://localhost/api/v1/posts/post-id'), {
      params: Promise.resolve({ id: 'post-id' }),
    });

    expect(response.status).toBe(401);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(response.headers.get('location')).toBeNull();
    expect(await response.json()).toMatchObject({ error: { code: 'UNAUTHORIZED' } });
  });
});