'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type ClassroomLink = { id: string; name: string };

export function ScopeHeader({ classrooms, name }: { classrooms: ClassroomLink[]; name: string }) {
  const pathname = usePathname();
  const match = pathname.match(/^\/salas\/([^/]+)\/mural(?:\/|$)/);
  const currentClassroom = match ? classrooms.find((classroom) => classroom.id === match[1]) : undefined;
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toLocaleUpperCase('pt-BR')).join('');

  return (
    <header className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent">Escopo atual</p>
        <p className="truncate text-sm font-semibold text-ink">{currentClassroom?.name ?? 'Toda a escola'}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden max-w-64 truncate text-sm text-text-muted sm:block">{name}</span>
        <Link href="/perfil" aria-label={`Abrir perfil de ${name}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          {initials || 'GT'}
        </Link>
      </div>
    </header>
  );
}
