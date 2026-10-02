# Proposal

## Why

A capability `communication/bulletin-board` já está especificada e a rota `/mural` existe no core, mas a UI ainda é stub estático. O mural funcional da branch `feat/mural` precisa entrar no core de classrooms/auth/feed com o mesmo padrão de services, mock repository e contratos `/api/v1`.

**Prioridade:** P1

## What Changes

- Implementar `BulletinService` + rotas `/api/v1/bulletin` e `/api/v1/bulletin/:id/pin` no padrão do core
- Exportar schemas Zod compartilhados em `@germina-talks/shared`
- Estender o mock repository para listagem com expiração, pin, include e update
- Ligar `/mural` e `/salas/[id]/mural` à UI funcional
- Arquivar a change de integração e manter a spec principal sincronizada
- Atualizar `docs/technical/api-contracts.md` para o contrato canônico do mural

## Non-goals

- Trazer a reimplementação de feed/fotos/auth da `feat/mural`
- Edição, exclusão ou remoção de fixação de recados
- Notificações push e anexos

## Capabilities

### New Capabilities

- (nenhuma — capability já existe)

### Modified Capabilities

- `communication/bulletin-board`: leitura, criação, fixação e expiração no core com membership e mock

## Impact

- `packages/shared`, `apps/web/lib/services`, rotas API, UI do mural, mock repository, docs técnicas, OpenSpec archive
