# Design

## Context

Ver proposal.md — Why. O core em `feat/classrooms-core-with-feed` já tem `Album` (sem `Photo`), Auth.js, membership e padrão `/api/v1`. A PR `feat/photo-album-and-moderation` (`a401c4b`) tem UI, upload local, `Photo`, `ContentStatus` e rotas `/api/albums` com auth stub. Esta change reconcilia os dois.

## Goals / Non-Goals

**Goals:**
- Preservar histórico OpenSpec da PR (archives `2026-09-30-*`) nesta branch
- Schema unificado + migration
- Serviços e rotas `/api/v1` com sessão e membership
- UI `/fotos` e `/salas/[id]/fotos` funcionais
- Moderação admin alinhada à PR
- Mock repository cobrindo álbum/foto
- Commits granulares por task/grupo (git-workflow)

**Non-Goals:**
- Presigned S3/MinIO nesta change
- Rebase da branch remota da PR
- Editar o conteúdo interno dos archives copiados

## Decisions

1. **Copiar archives intactos** de `origin/feat/photo-album-and-moderation`:
   - `openspec/changes/archive/2026-09-30-photo-album/`
   - `openspec/changes/archive/2026-09-30-photo-album-local-upload/`
   - Mesmos nomes de pasta; sem rewrite. A change ativa de integração continua separada.  
   - Alternativa: só linkar no proposal sem copiar → perde histórico no core. Rejeitada.

2. **Manter naming do core no Album** (`scopeType`, `createdBy`) e acrescentar `Photo` + `ContentStatus` + campos de moderação da PR.  
   - Alternativa: renomear para `scope`/`createdById` da PR → quebraria seed/core. Rejeitada.

3. **API sob `/api/v1/albums` e `/api/v1/albums/:id/photos`**; moderação em `/api/v1/moderation/albums/:id` e `/photos/:id`.  
   - Alternativa: manter `/api/albums` da PR → inconsistente com posts. Rejeitada.

4. **Upload local MVP** em `apps/web/public/uploads` (como a PR); URL pública relativa persistida em `Photo.url`.  
   - Alternativa: implementar `POST /photos/upload-url` + S3 agora → fora do escopo; fica follow-up.

5. **Status automático por papel**: aluno → `PENDING`; professor/admin → `APPROVED`. Sessão Auth.js é a única fonte de `userId`/`role`.

6. **Portar componentes** `AlbumCard`, `PhotoTile`, `PhotoUploadForm`, `ModerationClient` da PR, adaptando fetch para `/api/v1` e design system J&F.

7. **Git**: um commit conventional por task (ou grupo coeso) via `.agents/skills/git-workflow`; push e template de PR ao concluir a change (não a cada micro-commit, salvo pedido explícito).

## API changes

- [x] `GET/POST /api/v1/albums` — list/create com `classroomId?` e membership
- [x] `GET /api/v1/albums/:id` — detalhe + fotos aprovadas (membro do escopo)
- [x] `POST /api/v1/albums/:id/photos` — multipart upload (limites MIME/size)
- [x] `POST /api/v1/moderation/albums/:id` e `/photos/:id` — approve/reject (admin)
- [x] Zod schemas em `packages/shared` (create album, list query, moderation action)
- [ ] `POST /api/v1/photos/upload-url` — **adiado** (S3)

Referência: `docs/technical/api-contracts.md`

## Database changes

- [x] Enum `ContentStatus` (`PENDING`, `APPROVED`, `REJECTED`)
- [x] Model `Photo` (`url`, `caption?`, `albumId`, `uploadedBy`, `status`, moderação)
- [x] Campos em `Album`: `status`, `moderatedBy`, `moderatedAt`; relação `photos`
- [x] Migration: `add_album_photos_and_moderation`
- [x] Seed: 1–2 álbuns + fotos de exemplo (aprovadas)

Referência: `docs/technical/database.md`

## Frontend changes

- [x] Rotas: `/fotos`, `/salas/[id]/fotos` (+ detalhe de álbum se necessário)
- [x] Componentes: `AlbumCard`, `PhotoTile`, `PhotoUploadForm` (`docs/design-system.md#PhotoTile`)
- [x] Página `/moderation` (admin) para fila pendente
- [x] Data fetching alinhado ao padrão do feed (React Query quando já usado no layout)

Referência: `docs/technical/frontend.md`

## Design system

- Cores Instituto J&F; `PhotoTile` / empty states em português
- Sem cards decorativos desnecessários nas listagens além do necessário para interação

## Risks / Trade-offs

- [Upload local] → Adequado só para MVP/dev; documentar follow-up S3  
- [Conflito de schema com PR remota] → Core é a fonte da verdade; PR não é mergeada cega  
- [Listagens misturando PENDING] → Filtrar `APPROVED` para não-admin; admin vê fila separada

## Migration Plan

1. Aplicar migration no Postgres local  
2. `db:seed` com álbuns/fotos  
3. Subir app; smoke em `/fotos` e `/salas/[id]/fotos`  
4. Rollback: reverter migration e rotas se necessário

## Open Questions

- Limite de quem cria álbum: manter aluno (com PENDING) como na PR, ou só professor+admin? (assumido: aluno pode criar, pendente)
