import { z } from 'zod';

export const createAlbumSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().max(2000).optional().nullable(),
    scopeType: z.enum(['global', 'classroom']),
    classroomId: z.string().uuid().optional(),
  })
  .superRefine((value, context) => {
    if (value.scopeType === 'classroom' && !value.classroomId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['classroomId'],
        message: 'A sala é obrigatória para álbuns no escopo de sala.',
      });
    }

    if (value.scopeType === 'global' && value.classroomId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['classroomId'],
        message: 'Álbuns globais não podem informar uma sala.',
      });
    }
  });

export const listAlbumsQuerySchema = z.object({
  classroomId: z.string().uuid().optional(),
});

export const moderationActionSchema = z.object({
  status: z.enum(['approved', 'rejected']),
});

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;
export type ListAlbumsQuery = z.infer<typeof listAlbumsQuerySchema>;
export type ModerationActionInput = z.infer<typeof moderationActionSchema>;
