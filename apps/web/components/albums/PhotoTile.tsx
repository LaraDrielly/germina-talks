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
    <figure className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.url}
        alt={photo.caption || 'Foto do álbum'}
        className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.02]"
      />
      {isPending && isMine ? (
        <span className="absolute left-2 top-2 rounded-full bg-[#DC4405] px-2 py-1 text-[10px] font-semibold text-white sm:text-[11px]">
          Pendente
        </span>
      ) : null}
      {photo.caption ? (
        <figcaption className="border-t border-slate-100 bg-white p-3 text-sm text-slate-700">
          {photo.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
