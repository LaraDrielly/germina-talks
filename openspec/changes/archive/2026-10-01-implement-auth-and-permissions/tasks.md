## 1. Spec
- [x] 1.1 Validar change `implement-auth-and-permissions` com sucesso.

## 2. Auth & Middleware
- [x] 2.1 Configurar NextAuth em `apps/web/auth.ts` com validação institucional e papéis.
- [x] 2.2 Implementar middleware de rotas em `apps/web/middleware.ts`.

## 3. Permissions & Scopes
- [x] 3.1 Implementar verificação de associação de sala (`classroom_members`) e regras de escopo (`global`/`classroom`).
- [x] 3.2 Proteger services e endpoints de conteúdo e salas contra acesso indevido.

## 4. Frontend & Tests
- [x] 4.1 Atualizar página de login e componentes de UI para refletir papéis e escopo.
- [x] 4.2 Adicionar testes unitários de auth e permissões (`auth-permissions.test.ts`).
