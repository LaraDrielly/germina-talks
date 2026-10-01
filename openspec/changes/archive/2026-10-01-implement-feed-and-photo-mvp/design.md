# Design

## Context

See [proposal.md](proposal.md) for motivation. Existing pages for feed and photos are static demonstrations; PostgreSQL, Prisma, Auth.js credentials and local MinIO already exist. The project uses Next.js route handlers and shared Zod schemas. Content visibility must follow global or classroom scope.

## Goals / Non-Goals

**Goals:** persist feed and photo content, enforce scope access in server handlers, and use MinIO/S3 presigned transfers for images.

**Non-Goals:** image processing, moderation queues, feed reactions, comments, edits, or replacing the existing login flow.

## Decisions

- Use PostgreSQL models for posts, albums and photo metadata; content rows carry scope type, optional classroom id, author and timestamps. Posts and albums use soft deletion where appropriate; uploaded objects use random keys unrelated to user filenames.
- Cursor pagination orders by `(createdAt DESC, id DESC)` with 20 rows. The API validates the cursor and access scope before querying.
- Upload flow is two phase: server checks membership, MIME, declared size, count and caption, then returns a short-lived presigned PUT URL; client uploads directly to MinIO; a confirmation endpoint checks object metadata before creating the photo row. Reads return short-lived presigned GET URLs. Configure an S3-compatible endpoint, region, bucket and credentials only on the server.
- Create albums for teachers/admins; permit photo contribution by any authorized classroom member. Global album creation is teacher/admin; a teacher must have at least one classroom membership for classroom albums and can create global albums. Administrators may access all scopes.
- Authorize against the current database identity and memberships in every API operation. Never trust session role claims or client-provided storage keys.
- Follow `docs/design-system.md` for PostCard, PhotoTile, empty states and Portuguese user messages.

Alternatives considered: proxying all image bytes through Next.js increases memory and request duration; public object URLs expose school media without scope checks. Presigned private transfers avoid both trade-offs.

## Risks / Trade-offs

- [Expired or orphaned uploads] → use short expiry, verify metadata at confirmation, and do not create a photo row until verification succeeds.
- [Local MinIO configuration differs from hosted S3] → centralize endpoint/path-style configuration and document both local and production environment variables.
- [Concurrent uploads can race the 50-photo cap] → enforce the count again in a database transaction at confirmation.

## Migration Plan

Add a forward-only Prisma migration for the three content tables and indexes, then generate the Prisma client. Existing demo data is not migrated. Deploy the schema before application code; rollback requires rolling back app code while retaining the additive tables. Local setup starts PostgreSQL and MinIO, applies migrations, and sets bucket configuration.

## API changes

- `GET/POST /api/v1/posts`, `DELETE /api/v1/posts/:id`; listing accepts global/classroom scope, cursor and page size, and returns page data plus the next cursor.
- `GET/POST /api/v1/albums`, `GET /api/v1/albums/:id/photos`, `POST /api/v1/photos/upload-url`, and `POST /api/v1/albums/:id/photos` to confirm an upload.
- Responses use JSON, Portuguese validation/auth errors, `401` for missing session, `403` for scope/role denial, `404` for inaccessible resources and `400` for invalid input.

## Database changes

- Add `Post`, `PhotoAlbum` and `Photo` models linked to users and optional classrooms, with scope constraints, timestamps, indexes for chronological feed and album listing, and unique object keys.
- Make album classroom relation and scope consistent in validation and database constraints where supported. Preserve photo object keys as private metadata.

## Frontend changes

- Replace feed demo with scope selector, 280-character counter, chronological cards, own-post delete action, load-more control and an empty state.
- Replace photo demo with album listing/create form and album detail with upload, caption, responsive thumbnails and progress/error feedback.
- Add classroom feed and photo links while retaining the global navigation. All interface copy is Portuguese and uses the design system tokens.
