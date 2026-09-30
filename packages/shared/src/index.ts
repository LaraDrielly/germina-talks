export const APP_NAME = 'Germina Talks';

export type ScopeType = 'global' | 'classroom';

export { createPostSchema, listPostsQuerySchema } from './posts';
export type { CreatePostInput, ListPostsQuery } from './posts';
