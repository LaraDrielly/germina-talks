import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { getClassroomsForUser } from '@/lib/services/classroom';
import { SchoolTrack } from '@prisma/client';

const trackStyles: Record<SchoolTrack, { label: string; color: string }> = {
  business: { label: 'Escola de Negócios', color: 'bg-school-business' },
  tech: { label: 'Escola de Tecnologia', color: 'bg-school-tech' },
  factory: { label: 'Escola da Fábrica', color: 'bg-school-factory' },
};

export default async function SalasPage() {
  const session = await getServerSession(authOptions);
  const classrooms = session?.user?.id ? await getClassroomsForUser(session.user.id) : [];

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Organização</p>
        <h2 className="text-3xl font-semibold text-primary">Minhas salas</h2>
      </div>

      {classrooms.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          Você ainda não participa de uma sala.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {classrooms.map((classroom) => {
            const track = trackStyles[classroom.schoolTrack];

            return (
              <Link
                key={classroom.id}
                href={`/salas/${classroom.id}/feed`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-accent hover:bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <div className={`mb-4 h-2 w-16 rounded-full ${track.color}`} />
                <h3 className="font-semibold text-slate-800">{classroom.name}</h3>
                <p className="mt-2 text-sm text-slate-500">{track.label}</p>
                <p className="mt-3 text-sm font-medium text-primary">Ver feed da sala</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
