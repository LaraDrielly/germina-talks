# Tasks

## 1. Spec

- [x] 1.1 Keep the posts and auth delta scenarios aligned with the API/page response distinction; verify with `openspec validate corrigir-publicacao-no-feed`

## 2. Database

- [x] 2.1 Confirm this fix requires no schema or migration changes; verify `npx prisma validate --schema packages/db/prisma/schema.prisma` and ensure no migration is added

## 3. Backend

- [x] 3.1 Exclude only `/api/v1/posts` and `/api/v1/posts/:id` from page-redirect middleware handling; add a regression test proving protected pages still redirect and post API handlers receive unauthenticated requests
- [x] 3.2 Add Route Handler tests for missing session on `GET`, `POST`, and `DELETE`; verify each returns `401`, JSON content type, and `UNAUTHORIZED` without a login redirect
- [x] 3.3 Verify post API validation and authorization failures retain their existing JSON error envelopes; run the focused posts Route Handler suite

## 4. Frontend

- [x] 4.1 Validate response status and content type before parsing; handle JSON errors, HTML redirects, malformed bodies, and network failures with focused client tests
- [x] 4.2 Keep the draft after every failed submission and prevent unhandled mutation rejection; verify draft retention and accessible Portuguese error feedback in component tests
- [x] 4.3 On valid `201` with a post resource, show the post in the active scope feed, reconcile that query, and clear the draft; verify global and classroom scope isolation in component tests

## 5. Docs

- [x] 5.1 Document JSON `401` behavior for posts API separately from page redirects and describe client-visible submission failures; verify examples against handler tests

## 6. Integration

- [ ] 6.1 Run the complete Vitest suite, web typecheck, OpenSpec validation, and production build; verify post success and error paths remain consistent end to end
