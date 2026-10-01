import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  identity: vi.fn(),
  canAccess: vi.fn(),
  canManage: vi.fn(),
  create: vi.fn(),
  findMany: vi.fn(),
  accessibleWhere: vi.fn(),
}));

vi.mock('@/lib/bulletin', () => ({ getBulletinIdentity: mocks.identity }));
vi.mock('@/lib/content', () => ({
  accessibleScopeWhere: mocks.accessibleWhere,
  canAccessContentClassroom: mocks.canAccess,
  canManageAlbumInClassroom: mocks.canManage,
  contentPrisma: { photoAlbum: { create: mocks.create, findMany: mocks.findMany } },
}));
vi.mock('@/lib/storage/s3', () => ({
  getPhotoBucket: vi.fn(), getS3Client: vi.fn(), getSignedUrl: vi.fn(),
}));

import { POST } from './route';

const classroomId = '6c572166-cd18-4ae8-a821-a53ef4fdfb33';
const teacher = { id: '90a90760-cf35-4317-8d7e-8c7aab45a5ee', email: 'prof@institutojef.org.br', name: 'Professora', role: 'teacher' as const };
const student = { ...teacher, role: 'student' as const };

function request() {
  return new Request('http://localhost/api/v1/albums', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Feira de Ciências', scopeType: 'classroom', classroomId }),
  });
}

describe('/api/v1/albums POST', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.identity.mockResolvedValue(teacher);
    mocks.canAccess.mockResolvedValue(true);
    mocks.canManage.mockResolvedValue(true);
    mocks.create.mockResolvedValue({ id: 'album-id' });
  });

  it('allows only teachers and coordination to create albums', async () => {
    mocks.identity.mockResolvedValue(student);
    const response = await POST(request());
    expect(response.status).toBe(403);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('requires a teacher to manage the selected classroom', async () => {
    mocks.canManage.mockResolvedValue(false);
    const response = await POST(request());
    expect(response.status).toBe(403);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('creates the album in the authorized scope', async () => {
    const response = await POST(request());
    expect(response.status).toBe(201);
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ creatorId: teacher.id, scopeType: 'classroom', classroomId }),
    }));
  });
});
