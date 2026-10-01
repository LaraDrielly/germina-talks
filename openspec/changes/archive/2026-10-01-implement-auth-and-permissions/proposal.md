## Why

Para consolidar o sistema de autenticação institucional do Instituto J&F e o controle de permissões (RBAC e escopos) especificados em `openspec/specs/identity/auth/spec.md` e `openspec/specs/identity/roles/spec.md`. Consulte [docs/vision.md](../../../docs/vision.md).

**Prioridade:** P0.

## What Changes

- Consolidar NextAuth.js com validação estrita de domínios institucionais (`@institutojef.org.br` e `@jef.org.br`).
- Implementar atribuição de papéis (`student`, `teacher`, `admin`).
- Implementar middleware de proteção de rotas e verificação de associação de salas (`classroom_members`).
- Validar escopos (`global` vs `classroom`) nas operações de conteúdo.

## Capabilities

### New Capabilities

- Nenhuma.

### Modified Capabilities

- `identity/auth`: autenticação institucional e sessões seguras.
- `organization/scopes`: controle de visibilidade e permissões por escopo.

## Non-goals

- Login social externo no MVP.
- 2FA.

## Impact

- Backend/API: NextAuth configurado, validação de papéis e restrição de rotas/serviços.
- Frontend: tela de login institucional, redirecionamentos e badges de papéis/escopo.
