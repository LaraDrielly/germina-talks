import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { getClassroomsForUser } from '@/lib/services/classroom';

const roleLabels: Record<string, string> = {
  student: 'Aluno',
  teacher: 'Professor',
  admin: 'Coordenação',
};

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  const name = session?.user?.name ?? 'Usuário';
  const email = session?.user?.email ?? '';
  const role = session?.user?.role ?? 'student';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const classrooms = session?.user?.id ? await getClassroomsForUser(session.user.id) : [];
  const activeClassroom = classrooms[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Conta</p>
        <h2 className="text-3xl font-semibold text-primary">Perfil</h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
            {initials || 'GT'}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800">{name}</h3>
            <p className="text-sm text-slate-500">{email}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Papel</p>
          <p className="mt-2 text-lg font-semibold text-slate-800">{roleLabels[role] ?? role}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Sala</p>
          <p className="mt-2 text-lg font-semibold text-slate-800">
            {activeClassroom?.name ?? 'Nenhuma sala vinculada'}
          </p>
        </div>
      </div>
    </div>
  );
}
