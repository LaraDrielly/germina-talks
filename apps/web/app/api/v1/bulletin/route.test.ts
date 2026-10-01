import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  identity: vi.fn(),
  canAccess: vi.fn(),
  canPin: vi.fn(),
  find: vi.fn(),
  create: vi.fn(),
}));

vi.mock('@/lib/bulletin', () => ({
  getBulletinIdentity: mocks.identity,
  canAccessBulletinClassroom: mocks.canAccess,
  canPinBulletin: mocks.canPin,
  findAccessibleBulletins: mocks.find,
  bulletinPrisma: { bulletinItem: { create: mocks.create } },
}));

import { GET, POST } from './route';

const classroomId = '6c572166-cd18-4ae8-a821-a53ef4fdfb33';
const student = { id: '90a90760-cf35-4317-8d7e-8c7aab45a5ee', email: 'aluno@institutojef.org.br', name: 'Aluno', role: 'student' as const };

function jsonRequest(body: unknown) {
  return new Request('http://localhost/api/v1/bulletin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/v1/bulletin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.identity.mockResolvedValue(student);
    mocks.canAccess.mockResolvedValue(true);
    mocks.canPin.mockResolvedValue(false);
    mocks.find.mockResolvedValue([]);
    mocks.create.mockResolvedValue({ id: 'new-bulletin' });
  });

  it('requires a signed-in account to list recados', async () => {
    mocks.identity.mockResolvedValue(null);
    const response = await GET(new Request('http://localhost/api/v1/bulletin'));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ error: { code: 'UNAUTHORIZED' } });
  });

  it('does not return recados from a classroom the user cannot access', async () => {
    mocks.canAccess.mockResolvedValue(false);
    const response = await GET(new Request(`http://localhost/api/v1/bulletin?classroomId=${classroomId}`));

    expect(response.status).toBe(403);
    expect(mocks.find).not.toHaveBeenCalled();
  });

  it('rejects a student creating a global recado', async () => {
    const response = await POST(jsonRequest({ title: 'Aviso', body: 'Texto', scopeType: 'global' }));

    expect(response.status).toBe(403);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('rejects a student trying to pin a classroom recado', async () => {
    const response = await POST(jsonRequest({ title: 'Aviso', body: 'Texto', scopeType: 'classroom', classroomId, isPinned: true }));

    expect(response.status).toBe(403);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('creates an unpinned recado in a classroom the student belongs to', async () => {
    const response = await POST(jsonRequest({ title: ' Aviso ', body: ' Texto ', scopeType: 'classroom', classroomId }));

    expect(response.status).toBe(201);
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        title: 'Aviso',
        body: 'Texto',
        scopeType: 'classroom',
        classroomId,
        isPinned: false,
        authorId: student.id,
      }),
    }));
  });
});
