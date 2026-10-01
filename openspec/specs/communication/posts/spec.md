# Publicações (feed)

**Prioridade:** P1 | **Escopo:** global + sala

## Purpose

Permite que membros da comunidade escolar publiquem mensagens curtas em um feed cronológico, semelhante a um tweet, visíveis no escopo global ou de uma sala específica.

## Personas

- **Aluno** — compartilha dúvidas, comentários e novidades com colegas
- **Professor** — compartilha lembretes rápidos com a turma
- **Coordenação** — publica avisos rápidos para toda a escola

## Scenarios

### Scenario: Aluno publica na sala
- **GIVEN** um aluno membro da sala "3º ADS"
- **WHEN** ele escreve "Alguém tem o material da aula de hoje?" e publica
- **THEN** a publicação aparece no feed da sala com seu nome e horário

### Scenario: Publicação respeita limite de caracteres
- **GIVEN** um usuário criando uma publicação
- **WHEN** o texto excede 280 caracteres
- **THEN** o sistema impede o envio e exibe contador de caracteres

### Scenario: Feed ordenado cronologicamente
- **GIVEN** 3 publicações na sala com horários diferentes
- **WHEN** um membro acessa o feed
- **THEN** as publicações aparecem da mais recente para a mais antiga

### Scenario: Autor deleta própria publicação
- **GIVEN** um aluno que publicou uma mensagem
- **WHEN** ele clica em "Excluir" na sua publicação
- **THEN** a publicação é removida do feed (soft delete)

### Scenario: Feed com paginação infinita
- **GIVEN** mais de 20 publicações na sala
- **WHEN** o aluno rola até o final do feed
- **THEN** as publicações seguintes são carregadas automaticamente

### Scenario: Membro lista o feed da sala
- **WHEN** um membro autenticado da sala solicita a listagem de publicações daquela sala
- **THEN** o sistema retorna as publicações ativas dessa sala em ordem cronológica decrescente

### Scenario: Não membro não lista o feed da sala
- **WHEN** um usuário autenticado que não é membro da sala solicita a listagem de publicações daquela sala
- **THEN** o sistema rejeita o acesso com erro de permissão

### Scenario: UI do feed da sala usa o contrato de posts
- **WHEN** um membro abre o feed da sala na aplicação
- **THEN** a listagem e o scroll infinito carregam publicações daquela sala pelo mesmo contrato de listagem de publicações (com identificação da sala)

### Scenario: Aluno publica na sala a partir do feed da sala
- **WHEN** um aluno membro da sala publica uma mensagem válida no feed dessa sala
- **THEN** a publicação aparece no feed da sala com seu nome e horário

### Scenario: Feed global lista apenas publicações globais
- **WHEN** um usuário autenticado acessa o feed global
- **THEN** apenas publicações com escopo global aparecem na listagem

## Requirements

### Requirement: Publicação com texto limitado e escopo
O sistema MUST limitar o texto da publicação a 280 caracteres e MUST associar cada publicação a um escopo global ou por sala.

#### Scenario: Publicação respeita limite de caracteres
- **WHEN** o texto excede 280 caracteres
- **THEN** o sistema impede o envio e exibe contador de caracteres

### Requirement: Feed cronológico com paginação
O sistema MUST exibir o feed em ordem cronológica decrescente e MUST paginar por cursor (20 itens por página).

#### Scenario: Feed ordenado cronologicamente
- **WHEN** um membro acessa o feed com várias publicações
- **THEN** as publicações aparecem da mais recente para a mais antiga

#### Scenario: Feed com paginação infinita
- **WHEN** o aluno rola até o final do feed com mais de 20 publicações
- **THEN** as publicações seguintes são carregadas automaticamente

### Requirement: Autor pode excluir a própria publicação
O sistema MUST permitir que o autor exclua a própria publicação (soft delete).

#### Scenario: Autor deleta própria publicação
- **WHEN** o autor clica em "Excluir" na sua publicação
- **THEN** a publicação é removida do feed

### Requirement: Card de publicação exibe identidade e escopo
O sistema MUST exibir avatar, nome, papel, timestamp e indicador de escopo em cada publicação.

#### Scenario: Publicação aparece no feed da sala
- **WHEN** um aluno membro publica na sala
- **THEN** a publicação aparece no feed da sala com seu nome e horário

### Requirement: Feed da sala é listado via posts com classroomId
O sistema MUST listar publicações do feed de uma sala através de `GET /api/v1/posts` com o parâmetro de consulta `classroomId` correspondente a essa sala. A listagem MUST exigir que o usuário autenticado seja membro da sala. O sistema MUST retornar as publicações ativas em ordem cronológica decrescente, com paginação por cursor. O feed da sala na interface MUST consumir esse contrato (não um endpoint de feed sob `/classrooms/:id/feed` como fonte principal).

#### Scenario: Membro lista o feed da sala
- **WHEN** um membro autenticado da sala solicita `GET /api/v1/posts?classroomId=<id-da-sala>`
- **THEN** o sistema retorna as publicações ativas dessa sala em ordem cronológica decrescente

#### Scenario: Não membro não lista o feed da sala
- **WHEN** um usuário autenticado que não é membro da sala solicita `GET /api/v1/posts?classroomId=<id-da-sala>`
- **THEN** o sistema rejeita o acesso com erro de permissão

#### Scenario: UI do feed da sala usa o contrato de posts
- **WHEN** um membro abre o feed da sala na aplicação
- **THEN** a listagem e o scroll infinito carregam publicações via `GET /api/v1/posts` com `classroomId` dessa sala

### Requirement: Feed global e da sala compartilham a mesma UI de publicações
O sistema MUST apresentar o feed global (`GET /api/v1/posts` sem `classroomId`) e o feed da sala com a mesma experiência de listagem, criação (quando permitido) e exclusão pelo autor, respeitando o escopo ativo.

#### Scenario: Aluno publica na sala a partir do feed da sala
- **WHEN** um aluno membro da sala publica uma mensagem válida no feed dessa sala
- **THEN** a publicação aparece no feed da sala com seu nome e horário

#### Scenario: Feed global lista apenas publicações globais
- **WHEN** um usuário autenticado acessa o feed global
- **THEN** apenas publicações com escopo global aparecem na listagem

### Requirement: Experiência auxiliar do formulário e empty state
O sistema SHOULD exibir contador de caracteres no formulário e empty state amigável quando o feed estiver vazio. O sistema MUST NOT incluir curtidas, comentários, mídia anexa nem edição pós-envio no MVP.

#### Scenario: Empty state quando feed vazio
- **WHEN** um membro acessa um feed sem publicações ativas
- **THEN** o sistema exibe um empty state amigável

## Scope

global + classroom

## Dependencies

- identity/auth
- identity/roles
- organization/classrooms
- organization/scopes

## Design references

- docs/design-system.md#PostCard
- docs/design-system.md#EmptyState

## Open questions

- [ ] Professor pode deletar post de aluno na sala?
- [ ] Curtidas entram em v1 ou v2?
