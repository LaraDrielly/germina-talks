type PhotoTileProps = {
  photo: {
    id: string;
    url: string;
    status: string;
    uploadedBy: string;
    caption?: string | null;
  };
  viewerId: string;
};

export function PhotoTile({ photo, viewerId }: PhotoTileProps) {
  const isPending = photo.status === 'pending';
  const isMine = photo.uploadedBy === viewerId;

  return (
    <figure className="relative overflow-hidden bg-[#F5F6F8]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.url} alt={photo.caption || 'Foto do álbum'} className="w-full aspect-square object-cover" />
      {isPending && isMine ? (
        <span className="absolute top-2 right-2 px-2 py-1 bg-[#DC4405] text-white text-xs">
          Aguardando aprovação
        </span>
      ) : null}
      {photo.caption ? (
        <figcaption className="p-2 text-xs text-[#6B7280]">{photo.caption}</figcaption>
      ) : null}
    </figure>
  );
}
