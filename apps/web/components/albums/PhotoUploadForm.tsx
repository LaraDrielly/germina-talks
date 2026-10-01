"use client";

import React, { useState } from 'react';

type PhotoUploadFormProps = {
  albumId: string;
  userId: string;
  userRole?: string;
  onSuccess?: (photo: any) => void;
};

export function PhotoUploadForm({ albumId, userId, userRole = 'student', onSuccess }: PhotoUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setError('');

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem('file') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      setError('Selecione uma foto para enviar.');
      setIsUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadedById', userId);
      formData.append('userRole', userRole);

      const response = await fetch(`/api/albums/${albumId}/photos`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Falha no upload da foto.');
      }

      const newPhoto = await response.json();
      form.reset();
      if (onSuccess) {
        onSuccess(newPhoto);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded-md bg-[#F5F6F8]">
      <h3 className="font-semibold text-[#3C3F4F]">Adicionar Foto</h3>
      
      <div className="flex flex-col gap-2">
        <input 
          type="file" 
          name="file" 
          accept="image/jpeg, image/png, image/webp"
          disabled={isUploading}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#3A255B] file:text-white hover:file:bg-[#27AAE1] cursor-pointer"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <button 
        type="submit" 
        disabled={isUploading}
        className="self-start px-4 py-2 bg-[#11C76F] text-white rounded-md shadow-sm disabled:opacity-50"
      >
        {isUploading ? 'Enviando...' : 'Enviar Foto'}
      </button>
    </form>
  );
}
