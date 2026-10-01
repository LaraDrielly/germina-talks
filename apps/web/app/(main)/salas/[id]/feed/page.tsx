import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { checkUserAccessToClassroom } from '@/lib/services/scope';
import { notFound, redirect } from 'next/navigation';

export default async function ClassroomFeedPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const hasAccess = await checkUserAccessToClassroom(session.user.id, params.id);
  if (!hasAccess) notFound();

  return (
    <div>
      <h2 className="text-3xl font-semibold text-primary">Feed da Sala</h2>
      {/* Implementar listagem de posts usando o endpoint de API /api/v1/classrooms/[id]/feed */}
    </div>
  );
}
