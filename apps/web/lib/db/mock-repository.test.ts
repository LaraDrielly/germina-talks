import { describe, it, expect } from 'vitest';
import { mockRepository } from './mock-repository';
import { ScopeType, MemberRole, UserRole } from '@prisma/client';

describe('MockRepository', () => {
  it('should find user by unique email', async () => {
    const user = await mockRepository.user.findUnique({
      where: { email: 'aluno.joao@institutojef.org.br' },
    });
    expect(user).not.toBeNull();
    expect(user?.name).toBe('João Pedro Aluno');
    expect(user?.role).toBe(UserRole.student);
  });

  it('should list classrooms for user', async () => {
    const classrooms = await mockRepository.classroom.findMany({
      where: {
        memberships: {
          some: {
            userId: 'user-student-1',
          },
        },
      },
    });
    expect(classrooms.length).toBeGreaterThan(0);
    expect(classrooms[0].slug).toBe('3o-ads');
  });

  it('should create and retrieve posts with scope', async () => {
    const post = await mockRepository.post.create({
      data: {
        authorId: 'user-student-1',
        content: 'Teste post mock',
        scopeType: ScopeType.global,
        classroomId: null,
      },
    });
    expect(post).toBeDefined();
    expect(post.content).toBe('Teste post mock');

    const posts = await mockRepository.post.findMany({
      where: { scopeType: ScopeType.global },
      orderBy: { createdAt: 'desc' },
    });
    expect(posts.some((p) => p.content === 'Teste post mock')).toBe(true);
  });

  it('should manage classroom members (upsert and delete)', async () => {
    const member = await mockRepository.classroomMember.upsert({
      where: {
        userId_classroomId: {
          userId: 'user-teacher-1',
          classroomId: 'class-log-2',
        },
      },
      update: { role: MemberRole.teacher },
      create: {
        userId: 'user-teacher-1',
        classroomId: 'class-log-2',
        role: MemberRole.teacher,
        joinedAt: new Date(),
      },
    });
    expect(member).toBeDefined();
    expect(member.classroomId).toBe('class-log-2');

    const deleted = await mockRepository.classroomMember.delete({
      where: {
        userId_classroomId: {
          userId: 'user-teacher-1',
          classroomId: 'class-log-2',
        },
      },
    });
    expect(deleted).toBeDefined();
  });
});
