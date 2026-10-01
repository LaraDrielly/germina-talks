# Spec Delta

## ADDED Requirements

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
