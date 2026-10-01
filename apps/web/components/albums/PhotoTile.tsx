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
    <figure className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.url}
        alt={photo.caption || 'Foto do álbum'}
        className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.02]"
      />
      {isPending && isMine ? (
        <span className="absolute left-1.5 top-1.5 rounded-full bg-[#DC4405] px-1.5 py-0.5 text-[9px] font-semibold text-white sm:left-2 sm:top-2 sm:px-2 sm:text-[10px]">
          Pendente
        </span>
      ) : null}
      {photo.caption ? (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-6 text-[10px] leading-tight text-white opacity-100 sm:px-2.5 sm:text-xs sm:opacity-0 sm:transition sm:group-hover:opacity-100">
          {photo.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
