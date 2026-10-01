type AlbumCardProps = {
  album: {
    id: string;
    title: string;
    status: string;
    createdBy: string;
    description?: string | null;
    photos?: { id: string }[];
  };
  viewerId: string;
};

export function AlbumCard({ album, viewerId }: AlbumCardProps) {
  const isPending = album.status === 'pending';
  const isMine = album.createdBy === viewerId;

  return (
    <article className="border border-[#E5E7EB] p-4 bg-white">
      <h3 className="text-lg text-[#3A255B] font-semibold">{album.title}</h3>
      {album.description ? <p className="mt-1 text-sm text-[#6B7280]">{album.description}</p> : null}
      <p className="mt-2 text-xs text-[#6B7280]">{album.photos?.length ?? 0} foto(s)</p>
      {isPending && isMine ? (
        <span className="inline-block mt-2 px-2 py-1 bg-[#DC4405] text-white text-xs">
          Aguardando aprovação
        </span>
      ) : null}
    </article>
  );
}
