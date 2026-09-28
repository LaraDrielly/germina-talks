# Design

## Context

Ver [proposal.md - Why](./proposal.md#why). O middleware atual protege as páginas e também `/api/v1/posts`, redirecionando requests sem sessão para `/login`. Os handlers já consultam Auth.js e o service já mapeia sessão ausente para `401 UNAUTHORIZED`; entretanto, o formulário chama `response.json()` antes de verificar status ou `Content-Type`. A mutação limpa o campo somente em `onSuccess`, mas `mutateAsync()` rejeitado no handler do formulário pode produzir uma rejection não tratada. A interface usa TanStack Query e os feeds têm chaves por escopo (`['posts', 'global']` ou `['posts', classroomId]`).

Ver [specs/communication/posts/spec.md](./specs/communication/posts/spec.md) e [specs/identity/auth/spec.md](./specs/identity/auth/spec.md) para os contratos de comportamento. Seguir o tratamento HTTP em [backend.md](../../../../docs/technical/backend.md), envelopes de [api-contracts.md](../../../../docs/technical/api-contracts.md), padrões de dados em [frontend.md](../../../../docs/technical/frontend.md) e mensagens/acessibilidade do [design-system.md](../../../../docs/design-system.md).

## Goals / Non-Goals

**Goals:**
- Manter respostas API distintas de navegação HTML: `401` JSON para API sem sessão e redirect para páginas protegidas.
- Fazer o formulário distinguir sucesso confirmado de falha HTTP, rede, redirect inesperado ou corpo inválido.
- Tornar a confirmação visível imediatamente no feed correto, sem perder texto em falhas.

**Non-Goals:**
- Alterar autenticação, papéis, política de publicação global/sala, esquema do banco ou ordenação/paginação.
- Tratar servidor local parado, credenciais inválidas de banco ou falhas de infraestrutura como sucesso ou como correção de aplicação.

## Decisions

### API protegida sem redirect de página

Excluir apenas `/api/v1/posts` e `/api/v1/posts/:id` do matcher do middleware de páginas. Os Route Handlers já chamam `getServerSession` e `PostsService` já rejeita sessão ausente; essa validação continua sendo a autoridade, retornando o envelope `{ error: { code: 'UNAUTHORIZED', ... } }` com status `401`. As demais páginas HTML continuam sob o middleware e mantêm o redirect para `/login`.

Alternativa considerada: configurar uma resposta JSON no middleware para requests API. Preferimos deixar os handlers controlarem autenticação e erros, porque centralizar o mesmo mapeamento no middleware e no service duplicaria semântica e poderia ocultar validações específicas de cada endpoint.

### Tratamento de resposta do formulário

A mutation verificará status HTTP e `Content-Type` antes de interpretar o corpo. Respostas JSON de erro usarão `error.message`; redirecionamento HTML, corpo inesperado e falha de rede resultarão em mensagem local genérica em português. O submit usará callback de mutation ou captura explícita de rejeição para impedir promise não tratada. O campo só será limpo após resposta de sucesso válida; em qualquer falha, mantém o texto e anuncia o erro por `role="alert"`.

### Feed após criação confirmada

O `201` já retorna o post completo, incluindo autoria e escopo. Após validação do envelope, inserir o recurso no início da primeira página da query key correspondente ao escopo atual (`global` ou ID da sala) e invalidar essa query para reconciliar com o servidor. Não inserir o post em outro feed. A interface só apresenta sucesso/limpa o draft após a confirmação HTTP; erros posteriores de reconciliação não devem reclassificar uma criação já confirmada como falha.

## API changes

- `POST /api/v1/posts` mantém `201 { data: post }` no sucesso.
- Sem sessão, a resposta deve ser `401` com `Content-Type: application/json` e o envelope `UNAUTHORIZED`; não deve resultar em página HTML/login redirect.
- Formatos de validação e erro de domínio existentes permanecem inalterados.

## Database changes

Nenhuma. A correção não altera modelos, migrations, índices nem dados persistidos.

## Frontend changes

Atualizar `PostForm` para validar a resposta antes de parsear, transformar falhas de rede ou resposta não-JSON em mensagens acessíveis em português, preservar o rascunho no erro e não deixar rejeição sem tratamento. Em sucesso, integrar o post retornado no cache do feed atual e reconciliar com a query existente. Componentes e estilos continuam seguindo os tokens e padrões do design system.

## Risks / Trade-offs

- [Uma rota nova de API pode não estar excluída do middleware] → Testar explicitamente o matcher e uma chamada sem sessão; manter autenticação repetida no handler/service.
- [Resposta 2xx sem envelope esperado poderia limpar o rascunho] → Validar status, tipo de conteúdo e presença de `data` antes de limpar ou alterar o cache.
- [Falha na refetch depois de 201 pode ser confundida com falha de criação] → Tratar a resposta 201 como confirmação de criação e a reconciliação do feed como etapa separada.

## Migration Plan

1. Ajustar middleware e handlers sem mudança de dados; nenhum migration é necessário.
2. Atualizar formulário e testes; publicar frontend e API juntos para que a UI dependa do contrato `401` JSON.
3. Rollback: reverter a exclusão das rotas API do middleware e o tratamento novo do formulário em uma única release; não há rollback de banco.

## Open Questions

Nenhuma decisão bloqueadora foi deixada em aberto.
