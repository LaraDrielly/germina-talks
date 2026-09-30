## 1. Spec
- [ ] 1.1 Validar change `implement-auth-and-permissions` com `openspec validate implement-auth-and-permissions --strict`.

## 2. Auth & Middleware
- [ ] 2.1 Configurar NextAuth em `apps/web/auth.ts` com validação institucional e papéis.
- [ ] 2.2 Implementar middleware de rotas em `apps/web/middleware.ts`.

## 3. Permissions & Scopes
- [ ] 3.1 Implementar verificação de associação de sala (`classroom_members`) e regras de escopo (`global`/`classroom`).
- [ ] 3.2 Proteger services e endpoints de conteúdo e salas contra acesso indevido.

## 4. Frontend & Tests
- [ ] 4.1 Atualizar página de login e componentes de UI para refletir papéis e escopo.
- [ ] 4.2 Adicionar testes unitários de auth e permissões.
