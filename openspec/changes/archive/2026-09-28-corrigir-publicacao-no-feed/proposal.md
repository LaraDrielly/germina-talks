# Proposal

## Why

Hoje o envio de uma publicação pode falhar sem uma resposta útil quando a API de posts redireciona uma sessão inválida para uma página HTML, enquanto o formulário tenta interpretar toda resposta como JSON. O fluxo precisa distinguir sucesso de falha, informar o usuário em português e manter o texto para que uma falha recuperável não apague o rascunho; isso conclui o comportamento de publicação definido na visão do [Germina Talks](../../../../docs/vision.md).

**Prioridade:** P1

## What Changes

- Garantir que endpoints de posts respondam com envelopes JSON consistentes, incluindo `401 UNAUTHORIZED` quando a sessão não for válida, sem alterar o redirecionamento de páginas protegidas para `/login`.
- Tornar o formulário de publicação resiliente a respostas não-JSON, redirecionamentos e erros de rede/servidor; exibir mensagem acessível em português e preservar o texto quando falhar.
- Em sucesso HTTP, limpar o rascunho e atualizar o feed correspondente para que a nova publicação apareça no escopo escolhido.
- Adicionar testes de integração entre middleware/API/formulário para sucesso, sessão ausente, resposta inesperada e indisponibilidade do servidor.

## Capabilities

### New Capabilities

- Nenhuma. O fluxo de publicação pertence à capability existente.

### Modified Capabilities

- `communication/posts`: especificar que sucesso só é confirmado quando a publicação aparece no feed do escopo selecionado e que falhas preservam o rascunho com feedback acessível.
- `identity/auth`: distinguir respostas JSON `401` para chamadas autenticadas da API de redirecionamentos para `/login` em páginas HTML protegidas.

## Impact

- `apps/web/middleware.ts` e handlers de `apps/web/app/api/v1/posts` para manter semântica JSON na API.
- `apps/web/components/features/posts/post-form.tsx` e integração do feed para tratar respostas, feedback e atualização de dados.
- Testes de middleware, Route Handlers e interação do formulário.

## Non-goals

- Alterar o fluxo de login/logout ou os redirects de páginas HTML protegidas.
- Alterar schema do banco, migrations, permissões de criação/exclusão, regras de escopo ou modelo de paginação.
- Resolver indisponibilidade do servidor de desenvolvimento, configuração local de ambiente ou falhas de rede fora do tratamento visível da interface.
