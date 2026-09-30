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
    upsert: async (args: {
      where: { email: string };
      update: Partial<MockUser>;
      create: Omit<MockUser, 'createdAt' | 'updatedAt' | 'id'> & { id?: string };
    }) => {
      const existing = this.users.find((u) => u.email === args.where.email);
      if (existing) {
        Object.assign(existing, args.update, { updatedAt: new Date() });
        return existing;
      }
      const created: MockUser = {
        id: args.create.id || `user-${Date.now()}`,
        email: args.create.email,
        name: args.create.name,
        role: args.create.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.push(created);
      return created;
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

      if (args?.include?.classroom) {
        const select = args.include.classroom.select as
          | { id?: boolean; name?: boolean; schoolTrack?: boolean }
          | undefined;
        return result.map((m) => {
          const classroom = this.classrooms.find((c) => c.id === m.classroomId) || null;
          if (!classroom) return { ...m, classroom: null };
          if (!select) return { ...m, classroom };
          return {
            ...m,
            classroom: {
              ...(select.id ? { id: classroom.id } : {}),
              ...(select.name ? { name: classroom.name } : {}),
              ...(select.schoolTrack ? { schoolTrack: classroom.schoolTrack } : {}),
            },
          };
        });
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
    findMany: async (args?: {
      where?: any;
      orderBy?: any;
      include?: any;
      cursor?: { id: string };
      skip?: number;
      take?: number;
    }) => {
      let result = [...this.posts];

      if (args?.where) {
        if (args.where.scopeType) {
          result = result.filter((p) => p.scopeType === args.where.scopeType);
        }
        if (args.where.classroomId !== undefined) {
          result = result.filter((p) => p.classroomId === args.where.classroomId);
        }
        if (args.where.deletedAt === null) {
          result = result.filter((p) => p.deletedAt === null);
        }
      }

      const orderBy = Array.isArray(args?.orderBy) ? args?.orderBy : args?.orderBy ? [args.orderBy] : [];
      result.sort((a, b) => {
        for (const order of orderBy) {
          if (order.createdAt === 'desc') {
            const diff = b.createdAt.getTime() - a.createdAt.getTime();
            if (diff !== 0) return diff;
          }
          if (order.id === 'desc') {
            if (a.id < b.id) return 1;
            if (a.id > b.id) return -1;
          }
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      });

      if (args?.cursor?.id) {
        const index = result.findIndex((p) => p.id === args.cursor!.id);
        if (index >= 0) {
          result = result.slice(index + (args.skip ?? 0));
        } else {
          result = [];
        }
      }

      if (typeof args?.take === 'number') {
        result = result.slice(0, args.take);
      }

      if (args?.include) {
        return result.map((p) => this.enrichPost(p, args.include));
      }

      return result;
    },
    findUnique: async (args: { where: { id: string }; include?: any }) => {
      const post = this.posts.find((p) => p.id === args.where.id) || null;
      if (!post) return null;
      if (args.include) return this.enrichPost(post, args.include);
      return post;
    },
    create: async (args: {
      data: Omit<MockPost, 'createdAt' | 'updatedAt' | 'id' | 'deletedAt'> & { id?: string };
      include?: any;
    }) => {
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
      if (args.include) return this.enrichPost(newPost, args.include);
      return newPost;
    },
    update: async (args: { where: { id: string }; data: Partial<MockPost> }) => {
      const index = this.posts.findIndex((p) => p.id === args.where.id);
      if (index < 0) throw new Error('Post not found');
      this.posts[index] = {
        ...this.posts[index],
        ...args.data,
        updatedAt: new Date(),
      };
      return this.posts[index];
    },
  };

  private enrichPost(post: MockPost, include: any) {
    const item: any = { ...post };
    if (include.author) {
      const author = this.users.find((u) => u.id === post.authorId);
      if (author && include.author.select) {
        item.author = {
          ...(include.author.select.id ? { id: author.id } : {}),
          ...(include.author.select.name ? { name: author.name } : {}),
          ...(include.author.select.role ? { role: author.role } : {}),
        };
      } else {
        item.author = author || null;
      }
    }
    if (include.classroom) {
      const classroom = post.classroomId
        ? this.classrooms.find((c) => c.id === post.classroomId) || null
        : null;
      if (classroom && include.classroom.select) {
        item.classroom = {
          ...(include.classroom.select.id ? { id: classroom.id } : {}),
          ...(include.classroom.select.name ? { name: classroom.name } : {}),
          ...(include.classroom.select.schoolTrack ? { schoolTrack: classroom.schoolTrack } : {}),
        };
      } else {
        item.classroom = classroom;
      }
    }
    return item;
  }

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
