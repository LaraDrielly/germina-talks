# Proposal

## Why

Atualmente, na listagem de salas (`/salas`), o link para o "Feed" de cada sala é exibido para todos os usuários, incluindo administradores (coordenação). No entanto, quando um administrador clica no link de Feed de uma sala, o sistema retorna um erro 404 (Página não encontrada). O objetivo desta mudança é ocultar o link do "Feed" especificamente para usuários com papel de `admin`, melhorando a experiência e evitando navegação para rotas indisponíveis.

Este trabalho atende à necessidade de comunicação fluida da [Visão do Projeto](../../../docs/vision.md) e é classificado com prioridade **P2**.

## What Changes

- Ocultar condicionalmente o link "Feed" na página de listagem de salas (`/salas`).
- Apenas renderizar o link se a variável `session?.user?.role` for diferente de `'admin'`.

## Non-goals

- Não alterar a permissão de acesso via API ou outras páginas do feed (já está protegido).
- Não criar feeds globais alternativos para a coordenação nesta tarefa.

## Capabilities

### New Capabilities
*(Nenhuma)*

### Modified Capabilities
- `organization/classrooms`: A UI de listagem de salas MUST ocultar o link de acesso ao Feed se o usuário logado tiver o papel de admin (coordenação).

## Impact

- **Frontend**: O arquivo `apps/web/app/(main)/salas/page.tsx` será alterado.
- **Usuários**: Administradores não verão mais o link enganoso, reduzindo frustrações. Alunos e professores não sofrerão impacto.
