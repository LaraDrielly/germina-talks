import { z } from 'zod';

export const bulletinScopeSchema = z.enum(['global', 'classroom']);

export const listBulletinsQuerySchema = z
  .object({
    scopeType: bulletinScopeSchema.optional(),
    classroomId: z.string().min(1).optional(),
  })
  .superRefine((query, context) => {
    if (query.scopeType === 'global' && query.classroomId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['classroomId'],
        message: 'O escopo global não pode indicar uma sala.',
      });
    }
  });

export const createBulletinSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    body: z.string().trim().min(1),
    scopeType: bulletinScopeSchema,
    classroomId: z.string().min(1).optional(),
    isPinned: z.boolean().optional().default(false),
    expiresAt: z.string().datetime({ offset: true }).optional().nullable(),
  })
  .superRefine((bulletin, context) => {
    if (bulletin.scopeType === 'classroom' && !bulletin.classroomId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['classroomId'],
        message: 'Escolha uma sala para publicar o recado.',
      });
    }
    if (bulletin.scopeType === 'global' && bulletin.classroomId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['classroomId'],
        message: 'O escopo global não pode indicar uma sala.',
      });
    }
  });

export type CreateBulletinInput = z.input<typeof createBulletinSchema>;
export type ListBulletinsQuery = z.input<typeof listBulletinsQuerySchema>;
