import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET, POST } from './route';
import { postsService } from '../../../../lib/services/posts';

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('../../../../lib/services/posts', () => {
  class MockPostServiceError extends Error {
    constructor(
      public readonly status: number,
      public readonly code: string,
      message: string,
    ) {
      super(message);
    }
  }

  return {
    PostServiceError: MockPostServiceError,
    postsService: { list: vi.fn(), create: vi.fn() },
  };
});
import { PostServiceError } from '../../../../lib/services/posts';

const session = {
  user: { email: 'elisa.coordenacao@institutojef.org.br', role: 'admin' },
} as Session;

describe('/api/v1/posts handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getServerSession).mockResolvedValue(session);
  });

  it('returns the documented list envelope and applies the default page size', async () => {
    vi.mocked(postsService.list).mockResolvedValue({
      data: [],
      meta: { cursor: null, hasMore: false, viewerId: 'viewer-id' },
    });

    const response = await GET(new Request('http://localhost/api/v1/posts'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      data: [],
      meta: { cursor: null, hasMore: false, viewerId: 'viewer-id' },
    });
    expect(postsService.list).toHaveBeenCalledWith(session, { limit: 20 });
  });

  it('creates a valid post with a resource envelope', async () => {
    vi.mocked(postsService.create).mockResolvedValue({ id: 'post-id' } as never);

    const response = await POST(
      new Request('http://localhost/api/v1/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Aviso', scopeType: 'global' }),
      }),
    );

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ data: { id: 'post-id' } });
  });

  it('returns a validation error for invalid payloads', async () => {
    const response = await POST(
      new Request('http://localhost/api/v1/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '  ', scopeType: 'global' }),
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: { code: 'VALIDATION_ERROR' } });
    expect(postsService.create).not.toHaveBeenCalled();
  });

  it('returns a JSON 401 for unauthenticated feed reads', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    vi.mocked(postsService.list).mockRejectedValue(
      new PostServiceError(401, 'UNAUTHORIZED', 'Autenticação necessária.'),
    );

    const response = await GET(new Request('http://localhost/api/v1/posts'));

    expect(response.status).toBe(401);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(response.headers.get('location')).toBeNull();
    expect(await response.json()).toMatchObject({ error: { code: 'UNAUTHORIZED' } });
  });

  it('returns a JSON 401 for unauthenticated post creation', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    vi.mocked(postsService.create).mockRejectedValue(
      new PostServiceError(401, 'UNAUTHORIZED', 'Autenticação necessária.'),
    );

    const response = await POST(
      new Request('http://localhost/api/v1/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Publicação válida', scopeType: 'global' }),
      }),
    );

    expect(response.status).toBe(401);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(response.headers.get('location')).toBeNull();
    expect(await response.json()).toMatchObject({ error: { code: 'UNAUTHORIZED' } });
  });
});