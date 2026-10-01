# Tasks

> **Git:** ao concluir cada task (ou grupo coeso), fazer 1 commit conventional seguindo `.agents/skills/git-workflow` (self-review → `git add` seletivo → commit). Push + template de PR ao final da change.

## 1. Spec, archives e baseline

- [x] 1.1 Confirmar delta de `communication/photo-album` contra o design (API `/api/v1`, membership, moderação, sem forjar identidade) e marcar inconsistências se houver
- [x] 1.2 Copiar intactos de `origin/feat/photo-album-and-moderation` os archives `2026-09-30-photo-album` e `2026-09-30-photo-album-local-upload` para `openspec/changes/archive/`; verificar que as pastas e `.openspec.yaml` existem e batem com a origem

## 2. Database

- [x] 2.1 Estender schema Prisma: enum `ContentStatus`, model `Photo`, campos de moderação em `Album`, relação `photos`; verificar com `prisma validate`
- [x] 2.2 Criar e aplicar migration `add_album_photos_and_moderation`; verificar tabelas/colunas no Postgres
- [x] 2.3 Atualizar seed com álbuns/fotos de exemplo aprovadas; verificar `db:seed` idempotente
- [x] 2.4 Estender mock repository (album/photo CRUD + filtros de status/membership) e testes; verificar suite mock passando

## 3. Backend

- [x] 3.1 Adicionar schemas Zod compartilhados (create/list album, upload metadata, moderation action) e verificar typecheck do shared
- [x] 3.2 Implementar `AlbumsService` (list/create/get + membership + status por papel) com testes unitários
- [x] 3.3 Implementar rotas `GET/POST /api/v1/albums` e `GET /api/v1/albums/:id`; verificar testes de rota ou smoke autenticado
- [x] 3.4 Implementar `POST /api/v1/albums/:id/photos` (multipart, MIME/size, sessão) e verificar rejeição >10 MB e associação ao álbum
- [x] 3.5 Implementar rotas de moderação admin e verificar approve/reject atualiza status e listagens públicas

## 4. Frontend

- [x] 4.1 Portar/adaptar `AlbumCard`, `PhotoTile`, `PhotoUploadForm` ao design system e `/api/v1`; verificar render básico
- [x] 4.2 Ligar `/fotos` e `/salas/[id]/fotos` à API real com membership → 404/deny; verificar listagem e empty state
- [x] 4.3 Adicionar fluxo de upload na UI do álbum e verificar foto aprovada/pending conforme papel
- [x] 4.4 Implementar `/moderation` (admin) e verificar fila pendente + ações

## 5. Docs e integração

- [x] 5.1 Atualizar `docs/technical/database.md` e `docs/technical/api-contracts.md` (local upload MVP, endpoints `/api/v1`); conferir contra o código
- [ ] 5.2 Smoke manual: aluno/professor/admin em global e sala; registrar resultado e corrigir regressões desta change
