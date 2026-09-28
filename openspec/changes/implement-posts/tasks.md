# Tasks

## 1. Spec

- [x] 1.1 Keep the author-only deletion delta aligned with the user decision and verify the change with `openspec validate implement-posts`

## 2. Database

- [x] 2.1 Add `ClassroomMember`, user/classroom relations, and nullable `User.avatarUrl`; verify the Prisma schema with `npm run db:generate`
- [x] 2.2 Add the `Post` model, scope invariant, cursor indexes, and Prisma migration; verify with `prisma validate` and a successful test-database migration
- [x] 2.3 Seed demo users, classroom memberships, and sample posts; verify `npm run db:seed` and query the seeded posts with Prisma

## 3. Backend

- [x] 3.1 Add Zod request/query schemas for create and list operations in the shared package; verify valid, empty, over-limit, and invalid-scope cases with unit tests
- [x] 3.2 Implement server-side session-to-user resolution and classroom membership authorization; verify authenticated, non-member, and missing-session cases with service tests
- [x] 3.3 Implement post creation and cursor-paginated listing with scope filters and stable ordering; verify 280-character validation, visibility, and pagination with repository/service tests
- [x] 3.4 Implement author-only soft deletion; verify the author succeeds, a teacher who is not the author receives `403`, and the post remains stored with `deletedAt`
- [x] 3.5 Add `GET` and `POST /api/v1/posts` handlers with documented response/error envelopes; verify status codes and payloads with Route Handler tests
- [x] 3.6 Add `DELETE /api/v1/posts/[id]` handler; verify successful author deletion and forbidden non-author deletion with Route Handler tests

## 4. Frontend

- [x] 4.1 Install TanStack Query and React Testing Library and configure the query provider; verify dependency resolution and web typecheck
- [x] 4.2 Build `PostForm` with scope selection, Portuguese validation feedback, and 280-character counter; verify submit and boundary states with component tests
- [x] 4.3 Build `PostCard` and `PostList` with author-only delete control, ScopeBadge, loading, error, and empty states; verify rendering and permissions with component tests
- [x] 4.4 Replace mock data on `/feed` and connect infinite cursor loading in 20-item pages; verify the next page loads and create/delete refreshes the feed in component tests
- [x] 4.5 Add `/salas/[classroomId]/feed` with server-side membership checks and classroom scope defaults; verify member access and denied non-member behavior

## 5. Docs

- [x] 5.1 Update `docs/technical/api-contracts.md` with implemented post requests, cursor behavior, envelopes, and permission errors; verify documented examples match Route Handler tests
- [x] 5.2 Update `docs/technical/database.md` with post, membership, avatar fields, indexes, and scope constraints; verify the documented schema matches the Prisma migration

## 6. Integration

- [x] 6.1 Run Prisma generation, web typecheck, Vitest suite, and production build; verify global and classroom create/list/delete flows against the test database
