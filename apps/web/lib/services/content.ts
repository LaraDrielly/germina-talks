import { prisma } from '@/lib/db/prisma';
import { checkUserAccessToClassroom, getScopeFilter } from './scope';
import { ScopeType } from '@prisma/client';

// Posts
export async function getPosts(userId: string, scopeType: ScopeType, classroomId?: string | null) {
  if (scopeType === 'classroom' && classroomId) {
    const hasAccess = await checkUserAccessToClassroom(userId, classroomId);
    if (!hasAccess) throw new Error('Acesso negado à sala');
  }
  
  const filter = getScopeFilter(scopeType, classroomId);
  return await prisma.post.findMany({
    where: filter,
    orderBy: { createdAt: 'desc' },
  });
}

export async function createPost(
  userId: string,
  data: { content: string; scopeType: ScopeType; classroomId?: string | null },
) {
  if (data.scopeType === 'classroom' && data.classroomId) {
    const hasAccess = await checkUserAccessToClassroom(userId, data.classroomId);
    if (!hasAccess) throw new Error('Acesso negado à sala');
  }

  return await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
}

// Bulletins
export async function getBulletins(userId: string, scopeType: ScopeType, classroomId?: string | null) {
  if (scopeType === 'classroom' && classroomId) {
    const hasAccess = await checkUserAccessToClassroom(userId, classroomId);
    if (!hasAccess) throw new Error('Acesso negado à sala');
  }
  
  const filter = getScopeFilter(scopeType, classroomId);
  return await prisma.bulletinItem.findMany({
    where: filter,
    orderBy: { createdAt: 'desc' },
  });
}

export async function createBulletin(
  userId: string,
  data: { title: string; body: string; scopeType: ScopeType; classroomId?: string | null },
) {
  if (data.scopeType === 'classroom' && data.classroomId) {
    const hasAccess = await checkUserAccessToClassroom(userId, data.classroomId);
    if (!hasAccess) throw new Error('Acesso negado à sala');
  }

  return await prisma.bulletinItem.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
}

// Albums
export async function getAlbums(userId: string, scopeType: ScopeType, classroomId?: string | null) {
  if (scopeType === 'classroom' && classroomId) {
    const hasAccess = await checkUserAccessToClassroom(userId, classroomId);
    if (!hasAccess) throw new Error('Acesso negado à sala');
  }
  
  const filter = getScopeFilter(scopeType, classroomId);
  return await prisma.album.findMany({
    where: filter,
    orderBy: { createdAt: 'desc' },
  });
}

export async function createAlbum(
  userId: string,
  data: { title: string; description?: string; scopeType: ScopeType; classroomId?: string | null },
) {
  if (data.scopeType === 'classroom' && data.classroomId) {
    const hasAccess = await checkUserAccessToClassroom(userId, data.classroomId);
    if (!hasAccess) throw new Error('Acesso negado à sala');
  }

  return await prisma.album.create({
    data: {
      ...data,
      createdBy: userId,
    },
  });
}
