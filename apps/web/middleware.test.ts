import { describe, expect, it } from 'vitest';
import { config } from './middleware';

describe('auth middleware matcher', () => {
  const protectedPageMatcher = new RegExp(`^${config.matcher[0]}`);

  it('leaves API v1 routes to their JSON session handlers', () => {
    expect(protectedPageMatcher.test('/api/v1/posts')).toBe(false);
    expect(protectedPageMatcher.test('/api/v1/posts/post-id')).toBe(false);
    expect(protectedPageMatcher.test('/api/v1/classrooms')).toBe(false);
  });

  it('continues to protect application pages', () => {
    expect(protectedPageMatcher.test('/feed')).toBe(true);
    expect(protectedPageMatcher.test('/salas/classroom-id/feed')).toBe(true);
  });
});