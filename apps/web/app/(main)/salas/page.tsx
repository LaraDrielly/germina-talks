import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getBulletinClassrooms, getBulletinIdentity } from '@/lib/bulletin';

const trackLabels = {
  business: 'Escola de Negócios',
  tech: 'Escola de Tecnologia',
  factory: 'Escola da Fábrica',
};

const trackColors = {
  business: 'bg-school-business',
  tech: 'bg-school-tech',
  factory: 'bg-school-factory',
};

export default async function SalasPage() {
  const identity = await getBulletinIdentity();
  if (!identity) redirect('/login');
  const classrooms = await getBulletinClassrooms(identity);

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Organização</p>
        <h2 className="text-3xl font-semibold text-primary">Minhas salas</h2>
        <p className="mt-2 text-sm text-text-muted">Acesse os avisos das salas das quais você participa.</p>
      </div>

      {classrooms.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classrooms.map((classroom) => (
            <article
              key={classroom.id}
              className="rounded-2xl border border-border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`mb-4 h-2 w-16 rounded-full ${trackColors[classroom.schoolTrack]}`} />
              <p className="text-xs font-medium text-text-muted">{trackLabels[classroom.schoolTrack]} · {classroom.year}</p>
              <h3 className="mt-1 font-semibold text-primary">{classroom.name}</h3>
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium text-accent">
                <Link href={`/salas/${classroom.id}/feed`} className="hover:underline">Feed</Link>
                <Link href={`/salas/${classroom.id}/mural`} className="hover:underline">Mural</Link>
                <Link href={`/salas/${classroom.id}/fotos`} className="hover:underline">Fotos</Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center">
          <h3 className="font-semibold text-primary">Você ainda não participa de uma sala</h3>
          <p className="mt-1 text-sm text-text-muted">Quando sua turma estiver vinculada à conta, os avisos aparecerão aqui.</p>
        </div>
      )}
    </div>
  );
}
