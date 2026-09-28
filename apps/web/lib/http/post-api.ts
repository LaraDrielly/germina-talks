import { ZodError } from 'zod';
import { PostServiceError } from '../services/posts';

export function postApiErrorResponse(error: unknown): Response {
  if (error instanceof ZodError || error instanceof SyntaxError) {
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Os dados enviados são inválidos.' } },
      { status: 400 },
    );
  }

  if (error instanceof PostServiceError) {
    return Response.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  }

  return Response.json(
    { error: { code: 'INTERNAL_ERROR', message: 'Não foi possível concluir a operação.' } },
    { status: 500 },
  );
}