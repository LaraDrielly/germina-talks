import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  identity: vi.fn(),
  canAccess: vi.fn(),
  scopeWhere: vi.fn(),
  findMany: vi.fn(),
  findFirst: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
}));

vi.mock('@/lib/bulletin', () => ({ getBulletinIdentity: mocks.identity }));
vi.mock('@/lib/content', () => ({
  accessibleScopeWhere: mocks.scopeWhere,
  canAccessContentClassroom: mocks.canAccess,
  contentPrisma: { post: { findMany: mocks.findMany, findFirst: mocks.findFirst, create: mocks.create, update: mocks.update } },
}));

import { DELETE } from './[id]/route';
import { GET, POST } from './route';

const classroomId = '6c572166-cd18-4ae8-a821-a53ef4fdfb33';
const postId = '90a90760-cf35-4317-8d7e-8c7aab45a5ee';
const student = { id: '013b2ce2-dedf-441d-916f-a3620bf657fb', email: 'aluno@institutojef.org.br', name: 'Aluno', role: 'student' as const };

function jsonRequest(body: unknown) {
  return new Request('http://localhost/api/v1/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}

describe('/api/v1/posts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.identity.mockResolvedValue(student);
    mocks.canAccess.mockResolvedValue(true);
    mocks.scopeWhere.mockResolvedValue({ OR: [{ scopeType: 'global' }] });
    mocks.findMany.mockResolvedValue([]);
    mocks.findFirst.mockResolvedValue({ id: postId, authorId: student.id });
    mocks.create.mockResolvedValue({ id: postId });
    mocks.update.mockResolvedValue({ id: postId });
  });

  it('requires a signed-in account to read the feed', async () => {
    mocks.identity.mockResolvedValue(null);
    const response = await GET(new Request('http://localhost/api/v1/posts'));
    expect(response.status).toBe(401);
  });

  it('rejects a classroom feed request outside the user memberships', async () => {
    mocks.canAccess.mockResolvedValue(false);
    const response = await GET(new Request(`http://localhost/api/v1/posts?classroomId=${classroomId}&scopeType=classroom`));
    expect(response.status).toBe(403);
    expect(mocks.findMany).not.toHaveBeenCalled();
  });

  it('returns a cursor only when another page exists', async () => {
    mocks.findMany.mockResolvedValue(Array.from({ length: 21 }, (_, index) => ({ id: `post-${index}` })));
    const response = await GET(new Request('http://localhost/api/v1/posts'));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(20);
    expect(body.nextCursor).toBe('post-19');
  });

  it('creates a trimmed public post with its author identity', async () => {
    const response = await POST(jsonRequest({ content: ' Olá escola ', scopeType: 'global' }));
    expect(response.status).toBe(201);
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ content: 'Olá escola', scopeType: 'global', classroomId: null, authorId: student.id }),
    }));
  });

  it('allows only the author to soft-delete a post', async () => {
    mocks.findFirst.mockResolvedValue({ id: postId, authorId: '3147a447-03e4-4c3e-a9ec-5e9a52a6b18a' });
    const response = await DELETE(new Request(`http://localhost/api/v1/posts/${postId}`), { params: Promise.resolve({ id: postId }) });
    expect(response.status).toBe(403);
    expect(mocks.update).not.toHaveBeenCalled();
  });
});
