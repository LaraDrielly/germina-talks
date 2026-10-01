'use client';

import { useState } from 'react';

type PhotoUploadFormProps = {
  albumId: string;
  onSuccess?: () => void;
};

export function PhotoUploadForm({ albumId, onSuccess }: PhotoUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);
    setError('');

    const form = event.currentTarget;
    const fileInput = form.elements.namedItem('file') as HTMLInputElement;
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
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar foto.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border border-[#E5E7EB] bg-[#F5F6F8]">
      <h3 className="font-semibold text-[#3C3F4F]">Adicionar foto</h3>
      <input
        type="file"
        name="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={isUploading}
        className="file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-[#3A255B] file:text-white"
      />
      <input
        type="text"
        name="caption"
        maxLength={200}
        placeholder="Legenda (opcional)"
        className="border border-[#E5E7EB] px-3 py-2 text-sm"
        disabled={isUploading}
      />
      {error ? <p className="text-sm text-[#DC4405]">{error}</p> : null}
      <button
        type="submit"
        disabled={isUploading}
        className="self-start px-4 py-2 bg-[#11C76F] text-white disabled:opacity-50"
      >
        {isUploading ? 'Enviando...' : 'Enviar foto'}
      </button>
    </form>
  );
}
