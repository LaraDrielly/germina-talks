import Link from 'next/link';

type AlbumCardProps = {
  album: {
    id: string;
    title: string;
    status: string;
    createdBy: string;
    description?: string | null;
    photos?: Array<{ id: string; url?: string }>;
  };
  viewerId: string;
};

export function AlbumCard({ album, viewerId }: AlbumCardProps) {
  const isPending = album.status === 'pending';
  const isMine = album.createdBy === viewerId;
  const cover = album.photos?.find((photo) => photo.url)?.url;
  const count = album.photos?.length ?? 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-primary/30 hover:shadow-md">
      <div className="relative h-36 w-full shrink-0 overflow-hidden bg-gradient-to-br from-primary/15 via-accent/10 to-slate-100">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-primary/70">
            Sem capa ainda
          </div>
        )}
        {isPending && isMine ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#DC4405] px-2.5 py-1 text-[11px] font-semibold text-white">
            Aguardando aprovação
          </span>
        ) : null}
      </div>
      <div className="space-y-1 p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-primary">{album.title}</h3>
        {album.description ? (
          <p className="line-clamp-2 text-sm text-slate-500">{album.description}</p>
        ) : null}
        <p className="pt-1 text-xs font-medium text-slate-400">
          {count} {count === 1 ? 'foto' : 'fotos'}
        </p>
      </div>
    </article>
  );
}

export function AlbumCardLink({
  album,
  viewerId,
}: AlbumCardProps) {
  return (
    <Link href={`/fotos/${album.id}`} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-2xl">
      <AlbumCard album={album} viewerId={viewerId} />
    </Link>
  );
}
