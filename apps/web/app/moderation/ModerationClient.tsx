'use client';

import React, { useState } from 'react';

type Album = any; // simplified for this task
type Photo = any; // simplified for this task

export default function ModerationClient({ initialAlbums, initialPhotos }: { initialAlbums: Album[], initialPhotos: Photo[] }) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [photos, setPhotos] = useState(initialPhotos);

  const handleModerate = async (type: 'albums' | 'photos', id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/moderation/${type}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          userRole: 'admin', // mocked
          moderatedById: 'admin-id', // mocked
        }),
      });

      if (response.ok) {
        if (type === 'albums') {
          setAlbums(prev => prev.filter(a => a.id !== id));
        } else {
          setPhotos(prev => prev.filter(p => p.id !== id));
        }
      } else {
        alert('Falha ao moderar ' + type);
      }
    } catch (error) {
      console.error(error);
      alert('Erro interno');
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl text-[#3A255B] font-semibold mb-4">Álbuns Pendentes ({albums.length})</h2>
        {albums.length === 0 && <p className="text-[#6B7280]">Nenhum álbum pendente.</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {albums.map((album: any) => (
            <div key={album.id} className="border border-gray-200 p-4 rounded-md bg-white shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg">{album.title}</h3>
                <p className="text-sm text-gray-500">Por: {album.createdBy?.name || 'Desconhecido'}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => handleModerate('albums', album.id, 'APPROVED')}
                  className="bg-[#11C76F] text-white px-3 py-1 rounded-md"
                >Aprovar</button>
                <button 
                  onClick={() => handleModerate('albums', album.id, 'REJECTED')}
                  className="bg-[#DC4405] text-white px-3 py-1 rounded-md"
                >Rejeitar</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl text-[#3A255B] font-semibold mb-4">Fotos Pendentes ({photos.length})</h2>
        {photos.length === 0 && <p className="text-[#6B7280]">Nenhuma foto pendente.</p>}
        <div className="grid gap-4 md:grid-cols-3">
          {photos.map((photo: any) => (
            <div key={photo.id} className="border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm flex flex-col">
              <img src={photo.url} alt="Pendente" className="w-full aspect-square object-cover" />
              <div className="p-3">
                <p className="text-sm text-gray-500">Álbum: {photo.album?.title}</p>
                <div className="mt-3 flex gap-2">
                  <button 
                    onClick={() => handleModerate('photos', photo.id, 'APPROVED')}
                    className="flex-1 bg-[#11C76F] text-white py-1 rounded-md text-sm"
                  >Aprovar</button>
                  <button 
                    onClick={() => handleModerate('photos', photo.id, 'REJECTED')}
                    className="flex-1 bg-[#DC4405] text-white py-1 rounded-md text-sm"
                  >Rejeitar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
