import { z } from 'zod';

export const createPostSchema = z
  .object({
    content: z.string().trim().min(1).max(280),
    scopeType: z.enum(['global', 'classroom']),
    classroomId: z.string().uuid().optional(),
  })
  .superRefine((value, context) => {
    if (value.scopeType === 'classroom' && !value.classroomId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['classroomId'],
        message: 'A sala é obrigatória para publicações no escopo de sala.',
      });
    }

    if (value.scopeType === 'global' && value.classroomId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['classroomId'],
        message: 'Publicações globais não podem informar uma sala.',
      });
    }
  });

export const listPostsQuerySchema = z.object({
  classroomId: z.string().uuid().optional(),
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type ListPostsQuery = z.infer<typeof listPostsQuerySchema>;