import {
  initialMockUsers,
  initialMockClassrooms,
  initialMockClassroomMembers,
  initialMockPosts,
  initialMockBulletinItems,
  initialMockAlbums,
  MockUser,
  MockClassroom,
  MockClassroomMember,
  MockPost,
  MockBulletinItem,
  MockAlbum,
} from './mock-data';

class MockRepository {
  private users: MockUser[] = [...initialMockUsers];
  private classrooms: MockClassroom[] = [...initialMockClassrooms];
  private classroomMembers: MockClassroomMember[] = [...initialMockClassroomMembers];
  private posts: MockPost[] = [...initialMockPosts];
  private bulletinItems: MockBulletinItem[] = [...initialMockBulletinItems];
  private albums: MockAlbum[] = [...initialMockAlbums];

  // User
  user = {
    findUnique: async (args: { where: { id?: string; email?: string } }) => {
      return (
        this.users.find(
          (u) =>
            (args.where.id && u.id === args.where.id) ||
            (args.where.email && u.email === args.where.email)
        ) || null
      );
    },
    create: async (args: { data: Omit<MockUser, 'createdAt' | 'updatedAt' | 'id'> & { id?: string } }) => {
      const newUser: MockUser = {
        id: args.data.id || `user-${Date.now()}`,
        email: args.data.email,
        name: args.data.name,
        role: args.data.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.push(newUser);
      return newUser;
    },
    findMany: async () => [...this.users],
  };

  // Classroom
  classroom = {
    findMany: async (args?: { where?: any; include?: any }) => {
      let result = [...this.classrooms];

      if (args?.where?.members?.some?.userId) {
        const targetUserId = args.where.members.some.userId;
        const userClassroomIds = this.classroomMembers
          .filter((m) => m.userId === targetUserId)
          .map((m) => m.classroomId);
        result = result.filter((c) => userClassroomIds.includes(c.id));
      }

      if (args?.include) {
        return result.map((c) => {
          const item: any = { ...c };
          if (args.include.members) {
            const memberWhere = args.include.members.where || {};
            item.members = this.classroomMembers.filter((m) => {
              if (m.classroomId !== c.id) return false;
              if (memberWhere.userId && m.userId !== memberWhere.userId) return false;
              return true;
            });
          }
          return item;
        });
      }

      return result;
    },
    findUnique: async (args: { where: { id?: string; slug?: string } }) => {
      return (
        this.classrooms.find(
          (c) =>
            (args.where.id && c.id === args.where.id) ||
            (args.where.slug && c.slug === args.where.slug)
        ) || null
      );
    },
    create: async (args: { data: Omit<MockClassroom, 'createdAt' | 'id'> & { id?: string } }) => {
      const newClassroom: MockClassroom = {
        id: args.data.id || `class-${Date.now()}`,
        name: args.data.name,
        slug: args.data.slug,
        schoolTrack: args.data.schoolTrack,
        year: args.data.year,
        createdAt: new Date(),
      };
      this.classrooms.push(newClassroom);
      return newClassroom;
    },
  };

  // ClassroomMember
  classroomMember = {
    findMany: async (args?: { where?: any; include?: any }) => {
      let result = [...this.classroomMembers];

      if (args?.where?.classroomId) {
        result = result.filter((m) => m.classroomId === args.where.classroomId);
      }
      if (args?.where?.userId) {
        result = result.filter((m) => m.userId === args.where.userId);
      }

      if (args?.include?.user) {
        return result.map((m) => ({
          ...m,
          user: this.users.find((u) => u.id === m.userId) || null,
        }));
      }

      return result;
    },
    findUnique: async (args: { where: { userId_classroomId: { userId: string; classroomId: string } } }) => {
      const { userId, classroomId } = args.where.userId_classroomId;
      return (
        this.classroomMembers.find(
          (m) => m.userId === userId && m.classroomId === classroomId
        ) || null
      );
    },
    upsert: async (args: {
      where: { userId_classroomId: { userId: string; classroomId: string } };
      update: { role?: any };
      create: MockClassroomMember;
    }) => {
      const { userId, classroomId } = args.where.userId_classroomId;
      const index = this.classroomMembers.findIndex(
        (m) => m.userId === userId && m.classroomId === classroomId
      );

      if (index >= 0) {
        if (args.update.role) {
          this.classroomMembers[index].role = args.update.role;
        }
        return this.classroomMembers[index];
      } else {
        const newMember: MockClassroomMember = {
          userId: args.create.userId || userId,
          classroomId: args.create.classroomId || classroomId,
          role: args.create.role,
          joinedAt: new Date(),
        };
        this.classroomMembers.push(newMember);
        return newMember;
      }
    },
    delete: async (args: { where: { userId_classroomId: { userId: string; classroomId: string } } }) => {
      const { userId, classroomId } = args.where.userId_classroomId;
      const index = this.classroomMembers.findIndex(
        (m) => m.userId === userId && m.classroomId === classroomId
      );
      if (index >= 0) {
        const removed = this.classroomMembers[index];
        this.classroomMembers.splice(index, 1);
        return removed;
      }
      throw new Error('Member not found');
    },
  };

  // Post
  post = {
    findMany: async (args?: { where?: any; orderBy?: any }) => {
      let result = [...this.posts];

      if (args?.where) {
        if (args.where.scopeType) {
          result = result.filter((p) => p.scopeType === args.where.scopeType);
        }
        if (args.where.classroomId !== undefined) {
          result = result.filter((p) => p.classroomId === args.where.classroomId);
        }
      }

      if (args?.orderBy?.createdAt === 'desc') {
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }

      return result;
    },
    create: async (args: { data: Omit<MockPost, 'createdAt' | 'updatedAt' | 'id' | 'deletedAt'> & { id?: string } }) => {
      const newPost: MockPost = {
        id: args.data.id || `post-${Date.now()}`,
        authorId: args.data.authorId,
        content: args.data.content,
        scopeType: args.data.scopeType,
        classroomId: args.data.classroomId ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      this.posts.push(newPost);
      return newPost;
    },
  };

  // BulletinItem
  bulletinItem = {
    findMany: async (args?: { where?: any; orderBy?: any }) => {
      let result = [...this.bulletinItems];

      if (args?.where) {
        if (args.where.scopeType) {
          result = result.filter((b) => b.scopeType === args.where.scopeType);
        }
        if (args.where.classroomId !== undefined) {
          result = result.filter((b) => b.classroomId === args.where.classroomId);
        }
      }

      if (args?.orderBy?.createdAt === 'desc') {
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }

      return result;
    },
    create: async (args: { data: Omit<MockBulletinItem, 'createdAt' | 'updatedAt' | 'id' | 'deletedAt'> & { id?: string } }) => {
      const newItem: MockBulletinItem = {
        id: args.data.id || `bulletin-${Date.now()}`,
        authorId: args.data.authorId,
        title: args.data.title,
        body: args.data.body,
        isPinned: args.data.isPinned ?? false,
        scopeType: args.data.scopeType,
        classroomId: args.data.classroomId ?? null,
        expiresAt: args.data.expiresAt ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      this.bulletinItems.push(newItem);
      return newItem;
    },
  };

  // Album
  album = {
    findMany: async (args?: { where?: any; orderBy?: any }) => {
      let result = [...this.albums];

      if (args?.where) {
        if (args.where.scopeType) {
          result = result.filter((a) => a.scopeType === args.where.scopeType);
        }
        if (args.where.classroomId !== undefined) {
          result = result.filter((a) => a.classroomId === args.where.classroomId);
        }
      }

      if (args?.orderBy?.createdAt === 'desc') {
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }

      return result;
    },
    create: async (args: { data: Omit<MockAlbum, 'createdAt' | 'updatedAt' | 'id'> & { id?: string } }) => {
      const newAlbum: MockAlbum = {
        id: args.data.id || `album-${Date.now()}`,
        title: args.data.title,
        description: args.data.description ?? null,
        scopeType: args.data.scopeType,
        classroomId: args.data.classroomId ?? null,
        createdBy: args.data.createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.albums.push(newAlbum);
      return newAlbum;
    },
  };
}

export const mockRepository = new MockRepository();
