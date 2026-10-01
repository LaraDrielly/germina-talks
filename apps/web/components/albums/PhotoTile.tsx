import React from 'react';

type PhotoTileProps = {
  photo: {
    id: string;
    url: string;
    status: string;
    uploadedById: string;
  };
  currentUser: {
    id: string;
  };
};

export function PhotoTile({ photo, currentUser }: PhotoTileProps) {
  const isPending = photo.status === 'PENDING';
  const isMine = photo.uploadedById === currentUser.id;

  return (
    <div className="relative border border-gray-200 rounded-md overflow-hidden bg-[#F5F6F8]">
      <img src={photo.url} alt="Photo" className="w-full h-auto object-cover aspect-square" />
      {isPending && isMine && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-[#DC4405] text-white text-xs rounded-md shadow-sm">
          Aguardando aprovação
        </div>
      )}
    </div>
  );
}
