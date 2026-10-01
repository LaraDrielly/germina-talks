import { describe, expect, it } from 'vitest';
import { validateScopeSelection } from './scope';

describe('validateScopeSelection', () => {
  it('accepts a global scope without a classroom id', () => {
    expect(validateScopeSelection('global', null)).toEqual({
      scopeType: 'global',
      classroomId: null,
    });
  });

  it('accepts a classroom scope with a classroom id', () => {
    expect(validateScopeSelection('classroom', 'classroom-123')).toEqual({
      scopeType: 'classroom',
      classroomId: 'classroom-123',
    });
  });

  it('rejects invalid scope and classroom combinations', () => {
    expect(() => validateScopeSelection('global', 'classroom-123')).toThrow(
      'Escopo global não pode ter classroomId',
    );
    expect(() => validateScopeSelection('classroom', null)).toThrow(
      'Escopo de sala exige classroomId',
    );
  });
});
