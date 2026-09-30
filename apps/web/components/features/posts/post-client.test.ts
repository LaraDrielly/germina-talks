import { describe, expect, it } from 'vitest';
import { parseCreatedPostResponse } from './post-client';

const createdPost = {
  id: 'post-id',
  content: 'Publicação criada',
  scopeType: 'global',
  createdAt: '2026-09-28T12:00:00.000Z',
  author: { id: 'author-id', name: 'Ana', role: 'student', avatarUrl: null },
  classroom: null,
};

describe('parseCreatedPostResponse', () => {
  it('accepts a valid 201 JSON resource envelope', async () => {
    const response = Response.json({ data: createdPost }, { status: 201 });

    await expect(parseCreatedPostResponse(response)).resolves.toEqual(createdPost);
  });

  it('uses the JSON API error message for non-success status', async () => {
    const response = Response.json(
      { error: { code: 'UNAUTHORIZED', message: 'Autenticação necessária.' } },
      { status: 401 },
    );

    await expect(parseCreatedPostResponse(response)).rejects.toThrow('Autenticação necessária.');
  });

  it('rejects HTML redirects without trying to parse them as JSON', async () => {
    const response = new Response('<html>login</html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });

    await expect(parseCreatedPostResponse(response)).rejects.toThrow('Verifique sua sessão');
  });

  it('rejects malformed JSON and unexpected success envelopes', async () => {
    const malformed = new Response('{', {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
    const unexpected = Response.json({ ok: true }, { status: 200 });

    await expect(parseCreatedPostResponse(malformed)).rejects.toThrow('Verifique sua sessão');
    await expect(parseCreatedPostResponse(unexpected)).rejects.toThrow('Verifique sua sessão');
  });
});