# Proposal

## Why

A branch de salas (`feat/create-classrooms`) já entrega o core organizacional (salas, membros, escopo, auth e mock), mas o feed de publicações ainda é stub ou está em outra linha de evolução. Reimplementar o feed **sobre esse core** evita fork de navegação/membership e unifica a experiência da turma com o contrato já consolidado de posts. Consulte [docs/vision.md](../../../../docs/vision.md).

**Prioridade:** P1

## What Changes

- Adotar o core de classrooms como base (APIs de salas/membros, `checkUserAccessToClassroom`, mock+Prisma, rotas `/salas/[id]/…`).
- Reimplementar o feed completo (listagem cursor, criar, soft delete, UI `PostsFeed`) nesse core.
- **Contrato oficial do feed da sala:** `GET /api/v1/posts?classroomId=` (e create/delete em `/api/v1/posts` / `/api/v1/posts/:id`). O cliente do feed MUST NOT depender de `/api/v1/classrooms/:id/feed` como fonte principal.
- Garantir membership no list/create de posts de sala; feed global continua sem `classroomId`.
- Adaptar mock repository para upsert de usuário, include author/classroom, cursor e soft delete quando `DATABASE_PROVIDER=mock`.
- **BREAKING** (em relação ao stub da branch de classrooms): a UI do feed da sala deixa de ser placeholder e passa a consumir `/api/v1/posts`; o endpoint `classrooms/.../feed` deixa de ser o caminho feliz da UI (pode permanecer como wrapper opcional/legado nesta entrega ou ser alinhado depois).

## Capabilities

### New Capabilities

- Nenhuma.

### Modified Capabilities

- `communication/posts`: explicitar que o feed de sala é listado via `GET /api/v1/posts?classroomId=` com membership, paginação por cursor e UI compartilhada com o feed global.

## Impact

- `apps/web`: `PostsService`, rotas `/api/v1/posts`, componentes `features/posts`, páginas `/feed` e `/salas/[id]/feed`, layout (`QueryProvider`), mock repository, middleware (`/api/v1` fora do redirect HTML).
- `packages/shared`: schemas de posts.
- Docs: `docs/technical/api-contracts.md` (contrato `/posts` como fonte do feed).
- Sem mudança de schema de salas; modelo `Post` já existe no core.

## Non-goals

- Reimplementar álbum, mural ou chat nesta change.
- Substituir o mock por Postgres-only (manter o switch do core).
- Busca no feed (`add-feed-client-search`) e chat (`add-chat`).
- Tornar `/api/v1/classrooms/:id/feed` o contrato canônico (fica fora / legado).
