import React from 'react';

type AlbumCardProps = {
  album: {
    id: string;
    title: string;
    status: string;
    createdById: string;
  };
  currentUser: {
    id: string;
  };
};

export function AlbumCard({ album, currentUser }: AlbumCardProps) {
  const isPending = album.status === 'PENDING';
  const isMine = album.createdById === currentUser.id;

  return (
    <div className="border border-gray-200 p-4 rounded-md bg-white shadow-sm">
      <h3 className="text-xl text-[#3A255B] font-semibold">{album.title}</h3>
      {isPending && isMine && (
        <span className="inline-block mt-2 px-2 py-1 bg-[#DC4405] text-white text-xs rounded-md">
          Aguardando aprovação
        </span>
      )}
    </div>
  );
}
