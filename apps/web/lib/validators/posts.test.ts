import { describe, expect, it } from 'vitest';
import { createPostSchema, listPostsQuerySchema } from '@germina-talks/shared';

const classroomId = '7c7e0ee7-ae5a-45c6-9b6b-a2d6081f46dc';

describe('post validators', () => {
  it('accepts global and classroom posts with explicit scope', () => {
    expect(createPostSchema.safeParse({ content: '  Olá  ', scopeType: 'global' }).success).toBe(true);
    expect(
      createPostSchema.safeParse({ content: 'Olá', scopeType: 'classroom', classroomId }).success,
    ).toBe(true);
  });

  it('rejects empty and over-limit content', () => {
    expect(createPostSchema.safeParse({ content: '   ', scopeType: 'global' }).success).toBe(false);
    expect(createPostSchema.safeParse({ content: 'x'.repeat(281), scopeType: 'global' }).success).toBe(false);
    expect(createPostSchema.parse({ content: '  Olá  ', scopeType: 'global' }).content).toBe('Olá');
  });

  it('requires a classroom id only for classroom scope', () => {
    expect(createPostSchema.safeParse({ content: 'Olá', scopeType: 'classroom' }).success).toBe(false);
    expect(
      createPostSchema.safeParse({ content: 'Olá', scopeType: 'global', classroomId }).success,
    ).toBe(false);
    expect(createPostSchema.safeParse({ content: 'Olá', scopeType: 'invalid' }).success).toBe(false);
  });

  it('defaults list page size and rejects invalid cursors or limits', () => {
    expect(listPostsQuerySchema.parse({}).limit).toBe(20);
    expect(listPostsQuerySchema.safeParse({ limit: '51' }).success).toBe(false);
    expect(listPostsQuerySchema.safeParse({ cursor: 'not-a-uuid' }).success).toBe(false);
  });
});