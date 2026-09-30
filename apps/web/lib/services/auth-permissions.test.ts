import { describe, it, expect } from 'vitest';
import { checkUserAccessToClassroom, getScopeFilter } from './scope';
import { ScopeType } from '@prisma/client';

describe('Auth & Permissions Services', () => {
  it('should validate scope filter correctly', () => {
    const globalFilter = getScopeFilter(ScopeType.global);
    expect(globalFilter).toEqual({ scopeType: 'global' });

    const classroomFilter = getScopeFilter(ScopeType.classroom, 'class-ads-3');
    expect(classroomFilter).toEqual({
      scopeType: 'classroom',
      classroomId: 'class-ads-3',
    });
  });

  it('should check user access to classroom using mock repository', async () => {
    // user-student-1 is member of class-ads-3 in mock data
    const hasAccess = await checkUserAccessToClassroom('user-student-1', 'class-ads-3');
    expect(hasAccess).toBe(true);

    // user-student-1 is NOT member of class-log-2
    const noAccess = await checkUserAccessToClassroom('user-student-1', 'class-log-2');
    expect(noAccess).toBe(false);
  });
});
