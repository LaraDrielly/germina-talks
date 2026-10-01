import React from 'react';
import { prisma } from '@germina-talks/db';
import ModerationClient from './ModerationClient';

export default async function ModerationPage() {
  // In a real app, check user role first.
  const pendingAlbums = await prisma.album.findMany({
    where: { status: 'PENDING' },
    include: { createdBy: true },
  });

  const pendingPhotos = await prisma.photo.findMany({
    where: { status: 'PENDING' },
    include: { uploadedBy: true, album: true },
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl text-[#3A255B] font-bold mb-8">Fila de Moderação</h1>
      
      <ModerationClient 
        initialAlbums={pendingAlbums} 
        initialPhotos={pendingPhotos} 
      />
    </div>
  );
}
