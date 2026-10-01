import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  identity: vi.fn(),
  canPin: vi.fn(),
  findUnique: vi.fn(),
  update: vi.fn(),
}));

vi.mock('@/lib/bulletin', () => ({
  getBulletinIdentity: mocks.identity,
  canPinBulletin: mocks.canPin,
  bulletinPrisma: { bulletinItem: { findUnique: mocks.findUnique, update: mocks.update } },
}));

import { POST } from './route';

const bulletinId = '6c572166-cd18-4ae8-a821-a53ef4fdfb33';

describe('/api/v1/bulletin/:id/pin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.identity.mockResolvedValue({ id: 'user-id', role: 'teacher' });
    mocks.canPin.mockResolvedValue(true);
    mocks.findUnique.mockResolvedValue({ id: bulletinId, classroomId: 'classroom-id' });
    mocks.update.mockResolvedValue({ id: bulletinId, isPinned: true });
  });

  it('rejects students before accessing the recado', async () => {
    mocks.identity.mockResolvedValue({ id: 'user-id', role: 'student' });
    const response = await POST(new Request('http://localhost'), { params: Promise.resolve({ id: bulletinId }) });

    expect(response.status).toBe(403);
    expect(mocks.findUnique).not.toHaveBeenCalled();
  });

  it('requires the teacher to have permission in the recado classroom', async () => {
    mocks.canPin.mockResolvedValue(false);
    const response = await POST(new Request('http://localhost'), { params: Promise.resolve({ id: bulletinId }) });

    expect(response.status).toBe(403);
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it('fixes recados when the teacher has classroom permission', async () => {
    const response = await POST(new Request('http://localhost'), { params: Promise.resolve({ id: bulletinId }) });

    expect(response.status).toBe(200);
    expect(mocks.update).toHaveBeenCalledWith(expect.objectContaining({ data: { isPinned: true } }));
  });
});
