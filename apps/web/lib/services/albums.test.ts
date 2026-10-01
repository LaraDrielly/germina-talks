import { describe, expect, it } from 'vitest';
import { ContentStatus, ScopeType, UserRole } from '@prisma/client';
import { AlbumsService } from './albums';
import { mockRepository } from '../db/mock-repository';

describe('AlbumsService', () => {
  it('lists approved global albums for students', async () => {
    const service = new AlbumsService(mockRepository as any);
    const session = {
      user: {
        email: 'aluno.joao@institutojef.org.br',
        name: 'João Pedro Aluno',
        role: UserRole.student,
      },
      expires: new Date(Date.now() + 60_000).toISOString(),
    };

    const result = await service.list(session as any, {});
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data.every((album: any) => album.scopeType === ScopeType.global)).toBe(true);
    expect(result.data.every((album: any) => album.status === ContentStatus.approved || album.createdBy === result.meta.viewerId)).toBe(true);
  });
});
