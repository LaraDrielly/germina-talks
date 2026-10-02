'use client';

import { useEffect, useState } from 'react';
import { ConfirmModal } from '@/components/ui/confirm-modal';

type PendingPhoto = {
  id: string;
  url: string;
  album?: { title: string } | null;
};

export default function ModerationPage() {
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionPending, setActionPending] = useState<{ id: string, action: 'approved' | 'rejected' } | null>(null);

  const load = () => {
    setLoading(true);
    fetch('/api/v1/moderation/pending')
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error?.message || 'Sem permissão para moderar.');
        }
        return response.json();
      })
      .then((payload) => {
        setPhotos(payload.data?.photos ?? []);
        setError('');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar fila.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const moderate = async (type: 'albums' | 'photos', id: string, status: 'approved' | 'rejected') => {
    const response = await fetch(`/api/v1/moderation/${type}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      load();
    } else {
      const payload = await response.json().catch(() => null);
      setError(payload?.error?.message || 'Falha ao moderar.');
    }
    setActionPending(null);
  };

  if (error && !loading && photos.length === 0) {
    return (
      <p className="rounded-xl border border-[#DC4405]/20 bg-[#DC4405]/5 px-3 py-2 text-sm text-[#DC4405]">
        {error}
      </p>
    );
  }

  return (
    <section className="space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent">Coordenação</p>
        <h2 className="mt-1 text-2xl font-semibold text-primary sm:text-3xl">Moderação</h2>
        <p className="mt-1 text-sm text-slate-500">Fila de fotos pendentes</p>
      </header>

      {error ? (
        <p className="rounded-xl border border-[#DC4405]/20 bg-[#DC4405]/5 px-3 py-2 text-sm text-[#DC4405]">
          {error}
        </p>
      ) : null}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Fotos pendentes ({photos.length})</h3>
        {photos.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            Nenhuma foto pendente.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <div key={photo.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="Pendente" className="aspect-square w-full object-cover" />
                <div className="space-y-3 p-3">
                  <p className="text-sm text-slate-500">Álbum: {photo.album?.title}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActionPending({ id: photo.id, action: 'approved' })}
                      className="flex-1 rounded-xl bg-[#11C76F] py-2 text-sm font-semibold text-white"
                    >
                      Aprovar
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionPending({ id: photo.id, action: 'rejected' })}
                      className="flex-1 rounded-xl bg-[#DC4405] py-2 text-sm font-semibold text-white"
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={actionPending !== null}
        onClose={() => setActionPending(null)}
        onConfirm={() => {
          if (actionPending) {
            moderate('photos', actionPending.id, actionPending.action);
          }
        }}
        title={actionPending?.action === 'approved' ? 'Aprovar foto' : 'Rejeitar foto'}
        description={
          actionPending?.action === 'approved'
            ? 'A foto ficará visível para todos os membros do escopo. Deseja continuar?'
            : 'A foto será descartada e não poderá ser recuperada. Deseja continuar?'
        }
        variant={actionPending?.action === 'approved' ? 'primary' : 'danger'}
        confirmText={actionPending?.action === 'approved' ? 'Aprovar' : 'Rejeitar'}
      />
    </section>
  );
}
