## Why

O Germina Talks já define salas e escopos como capacidades centrais do MVP, mas a aplicação ainda tem apenas o modelo básico de sala e uma navegação com salas fixas. Implementar os comportamentos já especificados torna possível organizar conteúdo por turma e restringir sua visibilidade corretamente. Consulte [docs/vision.md](../../../docs/vision.md).

**Prioridade:** P0.

## What Changes

- Implementar associação de usuários às salas com papel por sala, listagem e controle de acesso.
- Permitir que a coordenação inclua e remova membros de uma sala.
- Substituir dados fixos da navegação por salas reais e disponibilizar as rotas definidas para cada sala.
- Adicionar escopo global ou de sala aos conteúdos, validar a associação entre escopo e sala e aplicar as regras de visibilidade.
- Exibir o escopo na interface e oferecer seleção explícita ao criar conteúdo.
- Adicionar testes focados para permissões, listagem, validação e visibilidade.

## Capabilities

### New Capabilities

- Nenhuma.

### Modified Capabilities

- `organization/classrooms`: explicitar gerenciamento de membros pela coordenação.

## Non-goals

- Criar escopos customizados ou por frente de ensino.
- Permitir que alunos criem salas ou criar salas aninhadas.
- Permitir que professores gerenciem associações de membros.
- Implementar preview de conteúdo de salas das quais o usuário não é membro.

## Impact

- Banco: relação de membros por sala e associação de escopo nas entidades de conteúdo.
- Backend/API: consultas de salas e membros, validações de escopo e autorização por associação.
- Frontend: navegação dinâmica, rotas de sala, seleção de escopo e identificação visual do escopo.
- Testes e documentação técnica de banco e contratos de API.