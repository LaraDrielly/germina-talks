# Proposal

## Why

O feed de publicações é uma das funcionalidades centrais do MVP, mas hoje a página global apresenta conteúdo estático e o modelo de dados ainda não inclui publicações. Implementar o contrato já definido permitirá que alunos, professores e coordenação publiquem e consultem conteúdo nos escopos previstos pela visão do [Germina Talks](../../../../docs/vision.md).

**Prioridade:** P1

## What Changes

- Implementar persistência, criação, listagem cronológica paginada e exclusão lógica de publicações conforme a spec existente `communication/posts`.
- Aplicar as regras de autenticação, autorização de escopo global/sala e validação do limite de 280 caracteres.
- Substituir os dados estáticos do feed por dados reais e apresentar autoria, papel, horário e escopo, além dos estados vazio e de carregamento.
- Cobrir regras do serviço, endpoints e fluxo de interface com testes.

## Capabilities

### New Capabilities

- Nenhuma. A capability de publicações já existe.

### Modified Capabilities

- `communication/posts`: esclarecer que somente o autor pode excluir a própria publicação nesta entrega; professores não podem excluir publicações de outros usuários.

## Impact

- `packages/db/prisma/schema.prisma` e migration Prisma para a entidade de publicação e seus índices.
- `apps/web` para serviços, validação, Route Handlers da API v1 e interface do feed.
- Testes Vitest e documentação técnica dos contratos e do modelo de dados após a implementação.

## Non-goals

- Curtidas, comentários, mídia anexada, edição de publicação e funcionalidades de moderação por terceiros.
- Decidir o escopo de curtidas em versões futuras.
