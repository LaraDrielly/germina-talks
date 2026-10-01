import { z } from 'zod';

export const contentScopeSchema = z.enum(['global', 'classroom']);

export const postQuerySchema = z.object({
  scopeType: contentScopeSchema.optional(),
  classroomId: z.string().uuid().optional(),
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(20).default(20),
}).superRefine((query, context) => {
  if (query.scopeType === 'global' && query.classroomId) {
    context.addIssue({ code: 'custom', path: ['classroomId'], message: 'O escopo global não pode indicar uma sala.' });
  }
  if (query.classroomId && query.scopeType === 'global') {
    context.addIssue({ code: 'custom', path: ['scopeType'], message: 'Uma sala exige escopo de turma.' });
  }
});

export const createPostSchema = z.object({
  content: z.string().trim().min(1).max(280),
  scopeType: contentScopeSchema,
  classroomId: z.string().uuid().optional(),
}).superRefine((post, context) => {
  if (post.scopeType === 'classroom' && !post.classroomId) {
    context.addIssue({ code: 'custom', path: ['classroomId'], message: 'Escolha uma sala.' });
  }
  if (post.scopeType === 'global' && post.classroomId) {
    context.addIssue({ code: 'custom', path: ['classroomId'], message: 'Publicações globais não indicam sala.' });
  }
});

export const createAlbumSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().nullable(),
  scopeType: contentScopeSchema,
  classroomId: z.string().uuid().optional(),
}).superRefine((album, context) => {
  if (album.scopeType === 'classroom' && !album.classroomId) {
    context.addIssue({ code: 'custom', path: ['classroomId'], message: 'Escolha uma sala.' });
  }
  if (album.scopeType === 'global' && album.classroomId) {
    context.addIssue({ code: 'custom', path: ['classroomId'], message: 'Álbuns globais não indicam sala.' });
  }
});

export const uploadIntentSchema = z.object({
  albumId: z.string().uuid(),
  fileName: z.string().trim().min(1).max(255),
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  sizeBytes: z.number().int().positive().max(10 * 1024 * 1024),
  caption: z.string().trim().max(200).optional().nullable(),
});

export const confirmPhotoSchema = z.object({
  objectKey: z.string().min(1).max(512),
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  sizeBytes: z.number().int().positive().max(10 * 1024 * 1024),
  caption: z.string().trim().max(200).optional().nullable(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;
