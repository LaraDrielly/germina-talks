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
      className="flex flex-col gap-4 rounded-xl border-2 border-[#3A255B] bg-[#F5F6F8] p-5"
    >
      <div>
        <h3 className="text-lg font-semibold text-[#3A255B]">Enviar foto</h3>
        <p className="mt-1 text-sm text-[#6B7280]">
          Escolha um arquivo e clique em Enviar foto. Upload local (sem S3), até 10 MB.
        </p>
      </div>

      <label htmlFor={inputId} className="block text-sm font-medium text-[#3C3F4F]">
        Arquivo da foto
      </label>
      <input
        id={inputId}
        type="file"
        name="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={isUploading}
        className="block w-full cursor-pointer rounded-lg border border-[#E5E7EB] bg-white px-3 py-3 text-sm text-[#3C3F4F] file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#3A255B] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#27AAE1]"
        onChange={(event) => {
          const file = event.target.files?.[0];
          setFileName(file ? file.name : '');
          setError('');
        }}
      />
      {fileName ? (
        <p className="text-sm text-[#11C76F]">Selecionado: {fileName}</p>
      ) : (
        <p className="text-sm text-[#6B7280]">Nenhum arquivo selecionado ainda.</p>
      )}

      <label className="block text-sm font-medium text-[#3C3F4F]" htmlFor={`${inputId}-caption`}>
        Legenda (opcional)
      </label>
      <input
        id={`${inputId}-caption`}
        type="text"
        name="caption"
        maxLength={200}
        placeholder="Ex.: Feira de ciências"
        className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm"
        disabled={isUploading}
      />

      {error ? <p className="text-sm font-medium text-[#DC4405]">{error}</p> : null}

      <button
        type="submit"
        disabled={isUploading}
        className="w-full rounded-lg bg-[#11C76F] px-4 py-3 text-base font-semibold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:self-start"
      >
        {isUploading ? 'Enviando...' : 'Enviar foto'}
      </button>
    </form>
  );
}
