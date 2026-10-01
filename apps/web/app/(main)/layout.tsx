import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ScopeHeader } from '@/components/scope-header';
import { getBulletinClassrooms, getBulletinIdentity } from '@/lib/bulletin';

const navigation = [
  { href: '/feed', label: 'Feed' },
  { href: '/mural', label: 'Mural' },
  { href: '/fotos', label: 'Fotos' },
  { href: '/salas', label: 'Salas' },
  { href: '/perfil', label: 'Perfil' },
];

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const identity = await getBulletinIdentity();
  if (!identity) redirect('/login');
  const classrooms = await getBulletinClassrooms(identity);
  const classroomLinks = classrooms.map(({ id, name }) => ({ id, name }));

  return (
    <div className="min-h-screen bg-slate-100 text-ink">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-4 pb-24 md:px-6 lg:py-6 lg:pb-6">
        <aside className="hidden w-72 shrink-0 rounded-3xl bg-primary p-5 text-white shadow-lg lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold">GT</div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">Instituto J&F</p>
              <h1 className="text-xl font-semibold">Germina Talks</h1>
            </div>
          </div>

          <nav aria-label="Navegação principal" className="mt-8 space-y-2">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 rounded-2xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Salas</p>
            {classrooms.length ? (
              <ul className="mt-3 space-y-2 text-sm">
                {classrooms.map((classroom) => (
                  <li key={classroom.id}>
                    <Link href={`/salas/${classroom.id}/mural`} className="block rounded-lg bg-white/5 px-3 py-2 text-white/85 transition hover:bg-white/10 hover:text-white">
                      {classroom.name}
                    </Link>
                    <div className="ml-3 mt-1 flex gap-3 text-xs text-white/65">
                      <Link href={`/salas/${classroom.id}/feed`} className="hover:text-white">Feed</Link>
                      <Link href={`/salas/${classroom.id}/fotos`} className="hover:text-white">Fotos</Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-white/70">Nenhuma sala vinculada.</p>
            )}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <ScopeHeader classrooms={classroomLinks} name={identity.name} />
          <main className="rounded-2xl border border-border bg-white p-4 shadow-sm md:p-6">{children}</main>
        </div>
      </div>

      <nav aria-label="Navegação móvel" className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-white/95 px-4 py-2 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-2 text-center text-[11px] font-medium text-text-muted">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-xl px-2 py-2 transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
