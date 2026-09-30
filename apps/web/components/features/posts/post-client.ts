import type { FeedPost } from './types';

const unexpectedResponseMessage = 'Não foi possível confirmar a publicação. Verifique sua sessão e tente novamente.';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFeedPost(value: unknown): value is FeedPost {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.content !== 'string') return false;
  if (value.scopeType !== 'global' && value.scopeType !== 'classroom') return false;
  if (typeof value.createdAt !== 'string' && !(value.createdAt instanceof Date)) return false;
  if (!isRecord(value.author) || typeof value.author.id !== 'string' || typeof value.author.name !== 'string') {
    return false;
  }
  return value.classroom === null || isRecord(value.classroom);
}

export async function parseCreatedPostResponse(response: Response): Promise<FeedPost> {
  const contentType = response.headers.get('content-type') ?? '';

  if (response.redirected || !contentType.toLowerCase().includes('application/json')) {
    throw new Error(unexpectedResponseMessage);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error(unexpectedResponseMessage);
  }

  if (!response.ok) {
    const message = isRecord(payload) && isRecord(payload.error) && typeof payload.error.message === 'string'
      ? payload.error.message
      : 'Não foi possível publicar. Tente novamente.';
    throw new Error(message);
  }

  if (response.status !== 201 || !isRecord(payload) || !isFeedPost(payload.data)) {
    throw new Error(unexpectedResponseMessage);
  }

  return payload.data;
}