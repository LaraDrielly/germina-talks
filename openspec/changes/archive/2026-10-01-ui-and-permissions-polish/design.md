# Design

## Context

A implementação atual da plataforma possui algumas limitações de interface de usuário, especialmente com o container de layout restrito, e falhas de verificação de permissão/roles para ações críticas, como postagem no mural e aprovação de fotos. Este design detalha as mudanças necessárias para aplicar as correções e polimentos levantados. (Consulte o `proposal.md` para as motivações).

## Goals / Non-Goals

**Goals:**
- Resolver as restrições de layout principal.
- Implementar as validações de `role` nos componentes de UI (ex: esconder botão de criar recado para alunos) e nas APIs.
- Ajustar os endpoints de listagem de salas para permitir acesso irrestrito pela coordenação.

**Non-Goals:**
- Criar novos perfis de acesso no banco de dados.
- Mudar o provedor de autenticação existente.

## Decisions

- **Criação de Mural em Modal**: Em vez de navegar para outra página ou criar in-line, a criação de mural utilizará um componente de `<Dialog>` (Modal) para melhorar a experiência e evitar saída do feed.
- **Validação de Role no Backend**: A camada de serviços (`lib/services`) deverá conferir `session.user.role` e negar operações proibidas, não dependendo apenas do Frontend.
- **Fluxo de Moderação de Fotos**: A UI de listagem passará a expor os botões de aprovar/rejeitar fotos caso o usuário logado seja `admin` ou um `teacher` membro daquela sala. O status já existe (`pending`, `approved`, `rejected`), apenas o fluxo precisa ser devidamente integrado à API e interface.

## API changes

- **`GET /api/v1/classrooms`**: Modificar o filtro. Se `role === 'admin'`, retornar todas as salas, sem cruzar obrigatoriamente com `ClassroomMember`.
- **`POST /api/v1/bulletin`**: Validar se o autor possui `role === 'admin'` ou `role === 'teacher'`. Retornar `403 Forbidden` se for aluno.
- **`PUT /api/v1/moderation/photos/[id]`**: Endpoint ou Service interno para alterar o `status` de uma foto de `pending` para `approved`. Deve verificar permissões do aprovador.

## Database changes

- **Nenhuma alteração de schema necessária**. O schema atual com os enums de `UserRole` e `ContentStatus` já suportam todas as lógicas propostas. Apenas a persistência e filtragem nas consultas do Prisma serão alteradas (ex: cláusulas `where` ajustadas nas rotas de API).

## Frontend changes

- **`apps/web/app/layout.tsx` / `(main)/layout.tsx`**:
  - Remover max-width (ex: `max-w-4xl`, `container mx-auto`) para permitir que o layout ocupe a tela inteira.
  - Implementar classes Tailwind responsivas (`md:`, `lg:`).
  - Renomear textos estáticos de "Germina Talks" para "GerminaTalks".
- **Busca (`SearchInput`)**:
  - Implementar lógica (ex: redirecionamento para página `/search?q=...` ou filtragem in-memory dependendo do contexto).
- **Mural (`BulletinBoard`)**:
  - Adicionar condicional: `if (session.user.role === 'student') return null;` para o botão "Adicionar recado".
  - Criar/adaptar componente `BulletinModal` referenciando `docs/design-system.md#Modal`.
- **Álbum de Fotos**:
  - Incluir `caption` no renderizador `docs/design-system.md#PhotoTile`.
- **Perfil de Usuário**:
  - Criar botão "Sair" na página de perfil que executa `signOut()` (referência `docs/design-system.md#Button`).

## Risks / Trade-offs

- **[Risk] Coordenação ver todas as salas pode poluir a barra lateral** → Mitigation: Exibir uma lista simplificada ou um dropdown agrupado, em vez de expandir todas de uma vez na UI.
