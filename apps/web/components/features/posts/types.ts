export type PostAuthor = {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  avatarUrl: string | null;
};

export type PostClassroom = {
  id: string;
  name: string;
  schoolTrack: 'business' | 'tech' | 'factory';
};

export type FeedPost = {
  id: string;
  content: string;
  scopeType: 'global' | 'classroom';
  createdAt: string | Date;
  author: PostAuthor;
  classroom: PostClassroom | null;
};

export type PostsPage = {
  data: FeedPost[];
  meta: { cursor: string | null; hasMore: boolean; viewerId: string };
};

export type ClassroomOption = Pick<PostClassroom, 'id' | 'name'>;