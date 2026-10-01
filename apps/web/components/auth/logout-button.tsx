'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function logout() {
    setIsLoading(true);
    await signOut({ callbackUrl: '/login' });
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={isLoading}
      className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5 disabled:opacity-60"
    >
      {isLoading ? 'Saindo…' : 'Sair da conta'}
    </button>
  );
}
