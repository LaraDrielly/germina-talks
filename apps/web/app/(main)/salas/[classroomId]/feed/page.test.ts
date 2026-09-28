import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { PostServiceError, postsService } from '../../../../../lib/services/posts';
import ClassroomFeedPage from './page';

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('next/navigation', () => ({
  notFound: () => { throw new Error('NOT_FOUND'); },
}));
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

  return {
    PostServiceError: MockPostServiceError,
    postsService: { list: vi.fn(), composerContext: vi.fn() },
  };
});

const session = { user: { email: 'ana.aluna@institutojef.org.br', role: 'student' } } as Session;
const classroomId = '7c7e0ee7-ae5a-45c6-9b6b-a2d6081f46dc';

describe('classroom feed page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getServerSession).mockResolvedValue(session);
  });

  it('renders for a classroom member', async () => {
    vi.mocked(postsService.list).mockResolvedValue({
      data: [],
      meta: { cursor: null, hasMore: false, viewerId: 'viewer-id' },
    } as never);
    vi.mocked(postsService.composerContext).mockResolvedValue({
      viewerId: 'viewer-id',
      canPostGlobal: false,
      classrooms: [{ id: classroomId, name: '3º ano Tecnologia 2026' }],
    } as never);

    const page = await ClassroomFeedPage({ params: Promise.resolve({ classroomId }) });

    expect(page).toBeTruthy();
    expect(postsService.list).toHaveBeenCalledWith(session, { classroomId, limit: 20 });
  });

  it('does not render for a non-member', async () => {
    vi.mocked(postsService.list).mockRejectedValue(
      new PostServiceError(403, 'FORBIDDEN_SCOPE', 'Você não tem acesso a esta sala.'),
    );
    vi.mocked(postsService.composerContext).mockResolvedValue({
      viewerId: 'viewer-id',
      canPostGlobal: false,
      classrooms: [],
    } as never);

    await expect(ClassroomFeedPage({ params: Promise.resolve({ classroomId }) })).rejects.toThrow('NOT_FOUND');
  });
});