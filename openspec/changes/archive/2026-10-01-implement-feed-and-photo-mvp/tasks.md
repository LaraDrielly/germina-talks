# Tasks

## 1. Specs

- [x] 1.1 Add feed and photo-album behavior deltas and verify `openspec validate implement-feed-and-photo-mvp --strict` accepts both capability paths

## 2. Database

- [x] 2.1 Add Prisma post, album and photo models, constraints and indexes; verify Prisma schema validation and client generation
- [x] 2.2 Add and apply the additive migration against local PostgreSQL; verify the migration status is clean

## 3. Backend

- [x] 3.1 Add shared feed and album request schemas and API access helpers; verify typecheck and validation cases
- [x] 3.2 Implement scoped feed list/create/delete APIs with cursor pagination and author-only soft deletion; verify API tests for access, ordering and limits
- [x] 3.3 Implement album list/create and photo upload-url/confirm/list APIs with private presigned S3 URLs; verify API tests for roles, scope, content type, size and album cap
- [x] 3.4 Configure the server-only S3 client and local S3-compatible bucket setup; verify connectivity and signed upload/read URLs using Docker Compose

## 4. Frontend

- [x] 4.1 Replace feed placeholders with scoped posts, create/delete controls and cursor loading; verify UI behavior and mobile layout
- [x] 4.2 Replace photo placeholders with album list/create/detail and upload flow; verify responsive grid, progress, validation and error states
- [x] 4.3 Add classroom feed/photo routes and navigation; verify users cannot browse rooms they do not belong to

## 5. Docs

- [x] 5.1 Update README, environment examples and technical API/database/frontend docs; verify setup instructions match scripts and endpoints

## 6. Integration

- [x] 6.1 Run typecheck, lint, tests, production build and OpenSpec validation; record results and any environment-dependent checks
