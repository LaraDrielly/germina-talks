import { describe, expect, it } from 'vitest';
import { confirmPhotoSchema, createAlbumSchema, createPostSchema, postQuerySchema, uploadIntentSchema } from '@germina-talks/shared/content';

const classroomId = '6c572166-cd18-4ae8-a821-a53ef4fdfb33';
const albumId = '90a90760-cf35-4317-8d7e-8c7aab45a5ee';

describe('content request schemas', () => {
  it('accepts a trimmed classroom post and rejects text above 280 characters', () => {
    expect(createPostSchema.parse({ content: ' Olá ', scopeType: 'classroom', classroomId }).content).toBe('Olá');
    expect(createPostSchema.safeParse({ content: 'x'.repeat(281), scopeType: 'global' }).success).toBe(false);
  });

  it('requires a classroom id only for classroom scope', () => {
    expect(createPostSchema.safeParse({ content: 'Oi', scopeType: 'classroom' }).success).toBe(false);
    expect(createPostSchema.safeParse({ content: 'Oi', scopeType: 'global', classroomId }).success).toBe(false);
  });

  it('limits feed page size to 20', () => {
    expect(postQuerySchema.parse({}).limit).toBe(20);
    expect(postQuerySchema.safeParse({ limit: 21 }).success).toBe(false);
  });

  it('validates album title and scope', () => {
    expect(createAlbumSchema.safeParse({ title: 'Feira', scopeType: 'classroom', classroomId }).success).toBe(true);
    expect(createAlbumSchema.safeParse({ title: ' ', scopeType: 'global' }).success).toBe(false);
  });

  it('limits photo formats and size to 10 MB', () => {
    const valid = { albumId, fileName: 'foto.webp', contentType: 'image/webp', sizeBytes: 10 * 1024 * 1024 };
    expect(uploadIntentSchema.safeParse(valid).success).toBe(true);
    expect(uploadIntentSchema.safeParse({ ...valid, contentType: 'image/gif' }).success).toBe(false);
    expect(confirmPhotoSchema.safeParse({ objectKey: 'key', contentType: valid.contentType, sizeBytes: valid.sizeBytes }).success).toBe(true);
    expect(uploadIntentSchema.safeParse({ ...valid, sizeBytes: 10 * 1024 * 1024 + 1 }).success).toBe(false);
  });
});
