import { notFound, redirect } from 'next/navigation';
import { BulletinBoard } from '@/components/bulletin-board';
import {
  findAccessibleBulletins,
  getBulletinClassrooms,
  getBulletinIdentity,
} from '@/lib/bulletin';

type PageProps = { params: Promise<{ id: string }> };

export default async function ClassroomMuralPage({ params }: PageProps) {
  const identity = await getBulletinIdentity();
  if (!identity) redirect('/login');

  const { id } = await params;
  const classrooms = await getBulletinClassrooms(identity);
  const classroom = classrooms.find((item) => item.id === id);
  if (!classroom) notFound();

  let items: Awaited<ReturnType<typeof findAccessibleBulletins>> = [];
  let loadError = false;
  try {
    items = await findAccessibleBulletins(identity, { classroomId: id });
  } catch {
    loadError = true;
  }

  return (
    <BulletinBoard
      items={items.map((item) => ({
        id: item.id,
        title: item.title,
        body: item.body,
        isPinned: item.isPinned,
        scopeType: item.scopeType,
        expiresAt: item.expiresAt?.toISOString() ?? null,
        createdAt: item.createdAt.toISOString(),
        canPin: identity.role === 'admin' || (
          identity.role === 'teacher' && classroom.roleInClass === 'teacher'
        ),
        author: item.author,
        classroom: item.classroom,
      }))}
      classrooms={classrooms.map(({ id: classroomId, name, schoolTrack, roleInClass }) => ({ id: classroomId, name, schoolTrack, roleInClass }))}
      role={identity.role}
      loadError={loadError}
      targetClassroom={{ id: classroom.id, name: classroom.name, schoolTrack: classroom.schoolTrack, roleInClass: classroom.roleInClass }}
    />
  );
}
