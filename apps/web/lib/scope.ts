export type ScopeType = 'global' | 'classroom';

export type ValidatedScopeSelection = {
  scopeType: ScopeType;
  classroomId: string | null;
};

export function validateScopeSelection(
  scopeType: ScopeType,
  classroomId: string | null,
): ValidatedScopeSelection {
  if (scopeType === 'global') {
    if (classroomId) {
      throw new Error('Escopo global não pode ter classroomId');
    }

    return {
      scopeType,
      classroomId: null,
    };
  }

  if (!classroomId || !classroomId.trim()) {
    throw new Error('Escopo de sala exige classroomId');
  }

  return {
    scopeType,
    classroomId,
  };
}
