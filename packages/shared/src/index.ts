export const APP_NAME = 'Germina Talks';

export type ScopeType = 'global' | 'classroom';

export { createPostSchema, listPostsQuerySchema } from './posts';
export type { CreatePostInput, ListPostsQuery } from './posts';
export {
  createAlbumSchema,
  listAlbumsQuerySchema,
  moderationActionSchema,
} from './albums';
export type {
  CreateAlbumInput,
  ListAlbumsQuery,
  ModerationActionInput,
} from './albums';
export {
  createBulletinSchema,
  listBulletinsQuerySchema,
  bulletinScopeSchema,
} from './bulletin';
export type { CreateBulletinInput, ListBulletinsQuery } from './bulletin';
