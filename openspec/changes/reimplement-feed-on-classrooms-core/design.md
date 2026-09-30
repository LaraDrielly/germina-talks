# Design

## Context

Ver [proposal.md - Why](./proposal.md#why). O core em `feat/create-classrooms` (branch de trabalho `feat/classrooms-core-with-feed`) já tem salas, membros, scope utils, auth com `session.user.id` e mock JSON opcional. O feed stub usa `/salas/[id]/feed` e um `content.getPosts` simples; a implementação rica de posts viveu em outra linha (`PostsService` + `/api/v1/posts`).

**Decisão de contrato (exploração):** fonte oficial do feed da sala = `GET /api/v1/posts?classroomId=`.

## Goals / Non-Goals

**Goals:**
- Feed global e da sala funcionais sobre o core de classrooms.
- Um contrato HTTP para listagem de posts (com e sem `classroomId`).
- Mock compatível com list/create/delete usados pelo feed.
- UI alinhada a [docs/design-system.md](../../../../docs/design-system.md) (`PostCard`, EmptyState, primary `#3A255B`, accent `#27AAE1`).

**Non-Goals:**
- Álbum, mural, chat, busca no feed.
- Trocar mock por Postgres obrigatório.
- Canonicalizar `/api/v1/classrooms/:id/feed`.

## Decisions

### Base e rotas

Manter param de sala `[id]` do core. Páginas:
- `/feed` → `PostsFeed` sem `classroomId`
- `/salas/[id]/feed` → membership via `checkUserAccessToClassroom` + `PostsFeed` com `classroomId`

### API changes

Referência: [docs/technical/api-contracts.md](../../../../docs/technical/api-contracts.md)

| Método | Rota | Papel |
|--------|------|--------|
| `GET` | `/api/v1/posts?classroomId=&cursor=&limit=` | **Canônico** — feed global ou da sala |
| `POST` | `/api/v1/posts` | Criar (global=admin; sala=membro) |
| `DELETE` | `/api/v1/posts/:id` | Soft delete (só autor) |
| `GET/POST` | `/api/v1/classrooms/:id/feed` | **Não canônico** — não usar na UI; opcional manter stub/legado |

Shared Zod: `listPostsQuerySchema`, `createPostSchema` em `@germina-talks/shared`.

- [x] Endpoints (acima)
- [x] Zod schemas (shared posts)

### Database changes

- [x] Nenhuma tabela nova — modelo `Post` já no core
- [x] Migration name: N/A

Mock (`mock-repository`): `user.upsert`, `post.findMany` (where/orderBy/cursor/take/include/deletedAt), `post.findUnique`, `post.update`, `classroomMember` com `include.classroom`.

### Frontend changes

Referência: [docs/technical/frontend.md](../../../../docs/technical/frontend.md)

- [x] Routes: `/feed`, `/salas/[id]/feed`
- [x] Components: `PostsFeed`, `PostForm`, `PostList`, `PostCard` em `features/posts`
- [x] Hooks: React Query (`useInfiniteQuery` → `/api/v1/posts?...`)
- Layout: `QueryProvider`; nav de salas do core permanece
- Salas page: listagem via `getClassroomsForUser` com link para `/salas/{id}/feed`

### Design system

- [x] Reuse PostCard patterns / EmptyState / Button (cores J&F)
- [x] Sem componente novo obrigatório no design-system.md

### Tipagem author sem avatarUrl

Schema `User` do core não tem `avatarUrl`. Serviço mapeia `author.avatarUrl: null` no DTO do feed para a UI existente.

## Risks / Trade-offs

- [Duas APIs de listagem] → Mitigação: UI só `/posts`; documentar classrooms/feed como não canônico.
- [Mock incompleto] → Mitigação: estender mock + testes de serviço/rota.
- [WIP parcial na branch] → Apply completa typecheck (mapper tipado) e remove stub da página de feed.

## Migration Plan

1. Consolidar PostsService + rotas posts no core.
2. Ligar páginas e middleware.
3. Atualizar api-contracts.
4. Smoke: login → salas → feed da sala → publicar → scroll → excluir.

Rollback: reverter PR; core de classrooms permanece.

## Open Questions

Nenhuma bloqueante — contrato `/api/v1/posts?classroomId=` fechado.
