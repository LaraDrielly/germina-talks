import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '@germina-talks/shared/password';

describe('password hashing', () => {
  it('stores a salted hash and verifies only the original password', async () => {
    const firstHash = await hashPassword('a-local-test-password');
    const secondHash = await hashPassword('a-local-test-password');

    expect(firstHash).not.toContain('a-local-test-password');
    expect(firstHash).not.toBe(secondHash);
    await expect(verifyPassword('a-local-test-password', firstHash)).resolves.toBe(true);
    await expect(verifyPassword('another-password', firstHash)).resolves.toBe(false);
  });

  it('rejects missing or malformed hashes', async () => {
    await expect(verifyPassword('password', null)).resolves.toBe(false);
    await expect(verifyPassword('password', 'not-a-password-hash')).resolves.toBe(false);
  });
});
