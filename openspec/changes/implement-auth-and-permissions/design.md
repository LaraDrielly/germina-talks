## Context

Consulte [proposal.md](proposal.md) e as specs em `openspec/specs/identity/`.

## Goals / Non-Goals

**Goals:**
- Garantir segurança e restrição de acesso por e-mail institucional e papéis.
- Proteger rotas com NextAuth e middleware.

**Non-Goals:**
- Permissões granulares customizáveis por escola.

## Decisions

- NextAuth Credentials Provider com checagem de domínio.
- Callbacks JWT e Session para propagação de `role`.
- Middleware Next.js para redirecionamento de rotas protegidas.
