import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/auth/logout-button';
import { getBulletinClassrooms, getBulletinIdentity } from '@/lib/bulletin';

const roleLabels = { student: 'Aluno', teacher: 'Professor', admin: 'Coordenação' };

export default async function PerfilPage() {
  const identity = await getBulletinIdentity();
  if (!identity) redirect('/login');
  const classrooms = await getBulletinClassrooms(identity);
  const initials = identity.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase('pt-BR'))
    .join('');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Conta</p>
          <h2 className="text-3xl font-semibold text-primary">Perfil</h2>
        </div>
        <LogoutButton />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white" aria-hidden="true">
            {initials || 'GT'}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-primary">{identity.name}</h3>
            <p className="text-sm text-text-muted">{identity.email}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-sm text-text-muted">Papel</p>
          <p className="mt-2 text-lg font-semibold text-ink">{roleLabels[identity.role]}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-sm text-text-muted">Salas vinculadas</p>
          <p className="mt-2 text-lg font-semibold text-ink">{identity.role === 'admin' ? 'Todas as salas' : classrooms.length || 'Nenhuma'}</p>
        </div>
      </div>

      {classrooms.length ? (
        <section aria-labelledby="profile-classrooms-title" className="rounded-2xl border border-border bg-white p-5">
          <h3 id="profile-classrooms-title" className="font-semibold text-primary">Minhas salas</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {classrooms.map((classroom) => (
              <li key={classroom.id} className="rounded-full bg-surface px-3 py-1.5 text-sm text-ink">{classroom.name}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
