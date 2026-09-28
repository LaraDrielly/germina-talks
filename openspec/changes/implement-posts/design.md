# Design

## Context

Ver [proposal.md - Why](./proposal.md#why). O Prisma já tem `User` e `Classroom`, mas não tem `Post`, avatar ou associação de membros a salas. Auth.js usa sessão JWT e o provider atual deriva o papel do e-mail sem persistir usuários. A página `/feed` contém dados estáticos; não há handlers `/api/v1/posts`, validadores compartilhados ou TanStack Query instalado. As decisões seguem [backend.md](../../../../docs/technical/backend.md), [database.md](../../../../docs/technical/database.md), [frontend.md](../../../../docs/technical/frontend.md), [api-contracts.md](../../../../docs/technical/api-contracts.md) e [design-system.md](../../../../docs/design-system.md).

## Goals / Non-Goals

**Goals:**
- Entregar o contrato da spec `communication/posts` nos escopos global e sala, com autorização no servidor.
- Manter um caminho determinístico de cursor para feeds com timestamps iguais.
- Preservar autoria e dados suficientes para exibir o PostCard após o envio.

**Non-Goals:**
- Implementar gestão de salas/membros, perfil completo ou autenticação institucional de produção.
- Permitir que professores ou coordenação excluam publicações de outras pessoas nesta capability.

## Decisions

### Modelo e identidade

Adicionar `Post` com UUID, `authorId`, conteúdo limitado a 280 caracteres, `scopeType`, `classroomId` opcional, timestamps e `deletedAt`. Relacionar com `User` e `Classroom`; adicionar `avatarUrl` opcional a `User` e a relação `ClassroomMember` (chave composta por usuário e sala, com papel local) para que as verificações de acesso à sala tenham dados persistidos. Uma restrição na migration e validação no service garantem `classroomId = null` para escopo global e obrigatório para escopo de sala.

Como o provider atual não persiste contas e a sessão contém e-mail, o service resolve/cria o autor por e-mail institucional usando dados confiáveis da sessão, nunca do body. O papel usado nas permissões vem da sessão validada; a associação à sala vem de `ClassroomMember`. Quando a autenticação real substituir o provider de demonstração, o mapeamento deverá usar o identificador estável do provedor.

Alternativa considerada: usar o ID JWT como FK. Rejeitada porque o provider atual usa o e-mail como ID, enquanto o Prisma gera UUID para `User`.

### API changes

Criar Route Handlers em `/api/v1/posts` para `GET` e `POST`, e `/api/v1/posts/[id]` para `DELETE`, delegando a validação e regras de negócio a service/repository conforme o padrão do backend. Usar envelope `data`/`meta` e formato de erro já documentados.

- `GET` exige sessão, exclui soft-deleted e filtra pelo escopo solicitado. Conteúdo de sala só é retornado a membros; sem `classroomId`, lista apenas o feed global. Ordenar por `createdAt DESC, id DESC` e usar cursor opaco ancorado no último item; o feed solicita 20 itens por página.
- `POST` exige `content` e `scopeType` explícitos. Rejeitar texto vazio após trim ou acima de 280 caracteres; escopo classroom exige membership. Aluno não cria conteúdo global; criação global fica restrita à coordenação, conforme `identity/roles`.
- `DELETE` exige sessão e marca `deletedAt` somente se o usuário da sessão for o autor. Professor/admin que não seja autor recebe `403`, preservando a publicação.

Usar Zod para request/query validation nos validadores compartilhados. As respostas incluem autor (nome, papel e avatar), timestamp e informações de escopo necessárias ao ScopeBadge; não expor e-mail.

### Database changes

Adicionar migration Prisma para `Post`, relações inversas, `ClassroomMember` e `User.avatarUrl`. Criar índices compostos para feed global e por sala com ordenação temporal e cursor, além de FKs. A migration deve impedir associação de sala em post global e exigir sala em post classroom; manter `deletedAt` para soft delete. Ajustar seed com membros e posts mínimos para desenvolvimento/testes, sem criar uma interface de administração de salas.

### Frontend changes

Substituir dados locais em `/feed` pela primeira página do endpoint e criar feed em `/salas/[classroomId]/feed`, protegido pela checagem de membership no servidor. Usar TanStack Query (`useInfiniteQuery`) para carregar páginas de 20 itens ao chegar ao fim da lista; a dependência ainda não está instalada, então adicioná-la e prover o QueryClient no layout apropriado.

Criar `PostForm`, `PostList` e `PostCard`, com formulário validado, contador até 280 caracteres, seleção de escopo coerente com a rota e botão de exclusão somente para o autor. Renderizar estados loading, erro e vazio; o card mostra avatar, nome, papel, timestamp e ScopeBadge. Seguir `PostCard`, `ScopeBadge` e `EmptyState` de `docs/design-system.md`, com microcopy em português e layout mobile-first. Após criar ou excluir, atualizar/invalidate as queries do feed. Adicionar TanStack Query como dependência de runtime e React Testing Library como dependência de desenvolvimento para testar interações dos componentes.

Alternativa considerada: implementar paginação manual sem biblioteca. Rejeitada por divergir do padrão documentado para feed infinito.

### Test strategy

Cobrir service e autorização com Vitest: validação de conteúdo/escopo, membro vs não membro, cursor/ordenação, soft delete do autor e tentativa de exclusão por professor não autor. Testar os handlers para status/envelopes e os componentes/formulário para contador, envio, estado vazio e carregamento da próxima página.

## Risks / Trade-offs

- [Sessão de demonstração e usuários persistidos podem divergir] → Resolver usuário por e-mail no servidor e sincronizar seu papel a partir da sessão validada; manter o provider demo explicitamente fora de produção.
- [Membership ainda não tem fluxo de gestão] → Criar somente o modelo e seed mínimos; acesso sem registro de membership deve ser negado.
- [Curso/role global e papel local podem divergir] → Exigir membership para ações de sala e aplicar o papel global apenas às permissões globais definidas pela spec de roles.
- [Cursor por timestamp pode duplicar/omitir itens simultâneos] → Usar ID como desempate estável junto de `createdAt`.
- [Usuários podem tentar enviar conteúdo whitespace] → Normalizar com trim e rejeitar conteúdo vazio no service e no formulário.

## Migration Plan

1. Gerar e revisar migration aditiva para posts, relações de membership, avatar e índices; aplicar e gerar o Prisma Client.
2. Atualizar seed de desenvolvimento para criar usuários, associações e publicações de exemplo compatíveis.
3. Publicar API e interface após a migration; a rota não deve habilitar escrita se o banco não estiver migrado.
4. Rollback: desabilitar as rotas/UI de posts e reverter a migration somente se não houver dados de posts a preservar; caso contrário, manter tabelas e desabilitar a feature até correção.

## Open Questions

Nenhuma decisão que altere o contrato foi deixada em aberto. O escopo futuro de curtidas permanece fora desta change.
