# Tasks

## 1. Spec

- [x] 1.1 Revisar delta de `communication/posts` (contrato `GET /api/v1/posts?classroomId=`, UI compartilhada) e verificar coerência com a página `/salas/[id]/feed`

## 2. Database

- [x] 2.1 Confirmar que o model `Post` do core atende list/create/soft-delete sem migration nova
- [x] 2.2 Completar mock repository (user.upsert, post findMany/include/cursor/update, membership include classroom) e verificar testes de serviço com `DATABASE_PROVIDER=mock`

## 3. Backend

- [x] 3.1 Garantir `PostsService` + rotas `/api/v1/posts` (list/create/delete) com membership e DTO sem `avatarUrl` no User; verificar testes de serviço e rota
- [x] 3.2 Documentar/deixar `/api/v1/classrooms/:id/feed` como não canônico (UI não consome); verificar que o cliente do feed só chama `/api/v1/posts`

## 4. Frontend

- [x] 4.1 Ligar `/feed` e `/salas/[id]/feed` ao `PostsFeed` + `QueryProvider` no layout; verificar membership → 404/deny para não membro
- [x] 4.2 Garantir `PostsFeed` usa `GET /api/v1/posts?classroomId=` (e create/delete em `/posts`); verificar testes de componente ou smoke manual
- [x] 4.3 Atualizar listagem `/salas` com salas reais do core e links para o feed; verificar typecheck limpo

## 5. Docs

- [x] 5.1 Atualizar `docs/technical/api-contracts.md` deixando `/api/v1/posts` como contrato do feed (global e sala via `classroomId`)
