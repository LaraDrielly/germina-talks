'use client';

import { useId, useState } from 'react';

type PhotoUploadFormProps = {
  albumId: string;
  onSuccess?: () => void;
};

export function PhotoUploadForm({ albumId, onSuccess }: PhotoUploadFormProps) {
  const inputId = useId();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);
    setError('');

    const form = event.currentTarget;
    const fileInput = form.elements.namedItem('file') as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (!file) {
      setError('Selecione uma foto para enviar.');
      setIsUploading(false);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('A foto excede o limite de 10 MB.');
      setIsUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      const captionInput = form.elements.namedItem('caption') as HTMLInputElement | null;
      if (captionInput?.value) {
        formData.append('caption', captionInput.value);
      }

      const response = await fetch(`/api/v1/albums/${albumId}/photos`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error?.message || 'Falha no upload da foto.');
      }

      form.reset();
      setFileName('');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar foto.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-primary">Enviar foto</h3>
        <p className="mt-1 text-sm text-slate-500">
          JPEG, PNG ou WebP · até 10 MB · armazenamento local
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
            Arquivo
          </label>
          <input
            id={inputId}
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={isUploading}
            className="block w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-primary/90"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setFileName(file ? file.name : '');
              setError('');
            }}
          />
          <p className="mt-1.5 text-xs text-slate-500">
            {fileName ? `Selecionado: ${fileName}` : 'Nenhum arquivo selecionado'}
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor={`${inputId}-caption`}>
            Legenda (opcional)
          </label>
          <input
            id={`${inputId}-caption`}
            type="text"
            name="caption"
            maxLength={200}
            placeholder="Ex.: Feira de ciências"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            disabled={isUploading}
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#11C76F] px-8 text-base font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:min-w-[220px] sm:w-auto sm:px-10 sm:text-lg"
        >
          {isUploading ? 'Enviando...' : 'Enviar foto'}
        </button>
      </div>

      {error ? (
        <p className="mt-3 rounded-xl border border-[#DC4405]/20 bg-[#DC4405]/5 px-3 py-2 text-sm text-[#DC4405]">
          {error}
        </p>
      ) : null}
    </form>
  );
}
