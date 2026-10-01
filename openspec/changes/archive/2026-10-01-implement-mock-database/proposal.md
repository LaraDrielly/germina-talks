## Why

Para permitir que desenvolvedores, avaliadores e testes rodem a aplicação Germina Talks de forma imediata e autônoma, sem dependência rígida de infraestrutura externa (PostgreSQL/MinIO via Docker), precisamos implementar uma camada de dados mock em memória. Consulte [docs/vision.md](../../../docs/vision.md).

**Prioridade:** P0.

## What Changes

- Criar massa de dados mock realista (usuários, salas, membros, posts, murais, álbuns).
- Implementar o repositório em memória simulando queries do Prisma.
- Criar camada de abstração/factory para alternar entre Prisma e Mock Store via variável de ambiente.

## Capabilities

### New Capabilities

- `identity/mock-db`: suporte a banco de dados em memória/mock para desenvolvimento offline e testes.

### Modified Capabilities

- Nenhuma.

## Non-goals

- Persistência permanente em disco no MVP.
- Substituição definitiva do PostgreSQL em ambiente de produção.

## Impact

- Banco/Mock: camada de repositório em memória transparente.
- Testes: capacidade de rodar testes unitários e de integração sem banco externo.
