import { describe, expect, it } from 'vitest';
import { GET } from './route';

describe('GET /api/health', () => {
  it('returns app and database status', async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    const json = await response.json();

    expect(json.ok).toBe(true);
    expect(json.service).toBe('germina-talks');
    expect(json.database).toMatch(/^(connected|disconnected)$/);
  });
});
