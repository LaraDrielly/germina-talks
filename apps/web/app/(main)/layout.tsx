import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { getClassroomsForUser } from '@/lib/services/classroom';
import { QueryProvider } from '@/components/providers/query-provider';
import { SchoolTrack } from '@prisma/client';

const navigation = [
  { href: '/feed', label: 'Feed' },
  { href: '/mural', label: 'Mural' },
  { href: '/fotos', label: 'Fotos' },
  { href: '/salas', label: 'Salas' },
  { href: '/perfil', label: 'Perfil' },
];

const trackColors: Record<SchoolTrack, string> = {
  business: 'bg-[#27AAE1]', // Accent color
  tech: 'bg-[#3A255B]', // Primary color
  factory: 'bg-[#F26522]', // Complementary color
};

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const classrooms = userId ? await getClassroomsForUser(userId) : [];

  const groupedClassrooms = classrooms.reduce(
    (acc, classroom) => {
      const track = classroom.schoolTrack as SchoolTrack;
      if (!acc[track]) {
        acc[track] = [];
      }
      acc[track].push(classroom);
      return acc;
    },
    {} as Record<SchoolTrack, typeof classrooms>,
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-4 md:px-6 lg:py-6">
        <aside className="hidden w-72 shrink-0 rounded-3xl bg-primary p-5 text-white shadow-lg lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold">
              GT
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">Instituto J&F</p>
              <h1 className="text-xl font-semibold">Germina Talks</h1>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-3 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 space-y-6">
            {Object.entries(groupedClassrooms).map(([track, rooms]) => (
              <div key={track}>
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">{track}</p>
                <ul className="mt-3 space-y-2 text-sm text-white/85">
                  {rooms.map((room) => (
                    <li key={room.id} className={`rounded-lg ${trackColors[room.schoolTrack as SchoolTrack]} px-3 py-2`}>
                      <Link href={`/salas/${room.id}/feed`}>{room.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          <header className="mb-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent">Escopo</p>
              <p className="text-sm font-semibold text-slate-700">Toda a escola</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="hidden rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 md:inline-flex">
                Buscar
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {session?.user.name?.split(' ').map((n: string) => n[0]).join('')}
              </div>
            </div>
          </header>

          <main className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <QueryProvider>{children}</QueryProvider>
          </main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-2 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-2 text-center text-[11px] font-medium text-slate-600">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-xl px-2 py-2 transition hover:bg-slate-100">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
