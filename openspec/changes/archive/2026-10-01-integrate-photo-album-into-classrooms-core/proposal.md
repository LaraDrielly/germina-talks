# Proposal

## Why

A feature de álbum de fotos já existe na branch `feat/photo-album-and-moderation`, mas está desconectada do core de salas, Auth.js e feed (`feat/classrooms-core-with-feed`). Sem integração, o schema, as rotas e a autorização divergem e o produto não entrega fotos no mesmo modelo de escopo/membership. Ver [docs/vision.md](../../../docs/vision.md).

**Prioridade:** P2

## What Changes

- Trazer álbum + fotos + moderação para a base do core (classrooms + auth + feed)
- Trazer intactos os OpenSpec archives da PR: `2026-09-30-photo-album` e `2026-09-30-photo-album-local-upload` → `openspec/changes/archive/`
- Unificar o model `Album` do core (`scopeType`, `createdBy`) com `Photo` e status de moderação vindos da PR
- Expor contratos sob `/api/v1/albums` (e fotos) com sessão Auth.js e checagem de membership
- Ligar UI em `/fotos` e `/salas/[id]/fotos` aos serviços reais (não stubs)
- Estender mock repository para desenvolvimento sem Postgres
- Atualizar docs técnicas (`database.md`, `api-contracts.md`)
- Entregar com **1 commit por task/grupo** seguindo `.agents/skills/git-workflow` (conventional commits; push ao final)

## Non-goals

- Migrar storage para S3/MinIO/presigned nesta change (MVP local em `public/uploads`, alinhado à PR)
- Edição de imagem, vídeos, download em lote
- Reescrever ou rebasear a branch remota `feat/photo-album-and-moderation` (o trabalho fica nesta branch/core)
- Reescrever o conteúdo dos archives copiados (histórico preservado)
- Chat, busca no feed ou outras features paralelas

## Capabilities

### New Capabilities

- (nenhuma — capability já existe)

### Modified Capabilities

- `communication/photo-album`: listagem/criação de álbuns e fotos no core com escopo global/sala, membership, moderação por papel, e consumo via `/api/v1`

## Impact

- `packages/db/prisma/schema.prisma` + migration + seed
- `apps/web` — services, rotas `/api/v1/albums*`, `/api/v1/moderation*`, páginas fotos, componentes de álbum
- `apps/web/lib/db/mock-repository.ts` (+ testes)
- Middleware/Auth.js (proteger novas rotas)
- Docs: `docs/technical/database.md`, `docs/technical/api-contracts.md`
- Fonte de referência: commit `a401c4b` em `origin/feat/photo-album-and-moderation`
