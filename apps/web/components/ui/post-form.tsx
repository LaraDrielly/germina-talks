'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScopeType } from '@prisma/client';

export function PostForm({ classrooms, defaultClassroomId }: { classrooms: any[], defaultClassroomId?: string }) {
  const [content, setContent] = useState('');
  const [scopeType, setScopeType] = useState<ScopeType>(defaultClassroomId ? 'classroom' : 'global');
  const [classroomId, setClassroomId] = useState(defaultClassroomId || '');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/v1/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, scopeType, classroomId: scopeType === 'classroom' ? classroomId : null }),
    });
    setContent('');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full rounded-lg border border-slate-300 p-3 outline-none"
        placeholder="O que está acontecendo?"
        required
      />
      
      <div className="flex gap-4">
        <select value={scopeType} onChange={(e) => setScopeType(e.target.value as ScopeType)}>
          <option value="global">Toda a escola</option>
          <option value="classroom">Sala de aula</option>
        </select>
        
        {scopeType === 'classroom' && (
          <select value={classroomId} onChange={(e) => setClassroomId(e.target.value)} required>
            <option value="">Selecione uma sala</option>
            {classrooms.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </div>

      <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-white">Publicar</button>
    </form>
  );
}
