'use client';

import { usePathname } from 'next/navigation';

export function HeaderScope({ classrooms }: { classrooms: { id: string; name: string }[] }) {
  const pathname = usePathname();
  const match = pathname.match(/^\/salas\/([^\/]+)/);
  const isClassroom = !!match;
  const classroomId = match?.[1];
  const classroom = classrooms.find((c) => c.id === classroomId);

  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-accent">Escopo</p>
      <p className="text-sm font-semibold text-slate-700">
        {isClassroom && classroom ? classroom.name : 'Toda a escola'}
      </p>
    </div>
  );
}
