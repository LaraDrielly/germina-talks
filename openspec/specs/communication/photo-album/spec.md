# Álbum de fotos

**Prioridade:** P2 | **Escopo:** global + sala

## Purpose

Permite criar álbuns de fotos para registrar eventos e momentos da vida escolar, organizados por escopo global (eventos da escola) ou por sala (eventos da turma).

## Personas

- **Aluno** — visualiza e contribui com fotos dos eventos da turma
- **Professor** — cria álbuns e organiza fotos de atividades
- **Coordenação** — cria álbuns de eventos institucionais e modera conteúdo pendente

## Scenarios

### Scenario: Professor cria álbum da turma
- **GIVEN** um professor da sala "3º ADS"
- **WHEN** ele cria o álbum "Feira de Ciências 2026" com escopo da sala
- **THEN** o álbum aparece em `/salas/<id>/fotos`

### Scenario: Upload de foto no álbum
- **GIVEN** um álbum existente e um membro da sala
- **WHEN** ele faz upload de uma foto JPEG (5 MB)
- **THEN** a foto aparece na grade do álbum com miniatura

### Scenario: Foto excede tamanho máximo
- **GIVEN** um usuário tentando upload de foto de 15 MB
- **WHEN** ele seleciona o arquivo
- **THEN** o sistema rejeita com mensagem de limite (10 MB)

### Scenario: Álbum global de evento escolar
- **GIVEN** um álbum com escopo global "Formatura 2026"
- **WHEN** qualquer aluno autenticado acessa `/fotos`
- **THEN** o álbum é visível na listagem

### Scenario: Grid de fotos responsivo
- **GIVEN** um álbum com 12 fotos
- **WHEN** um aluno visualiza no celular
- **THEN** as fotos aparecem em grid de 2 colunas

### Scenario: Membro lista álbuns da sala
- **WHEN** um membro autenticado solicita a listagem de álbuns daquela sala
- **THEN** o sistema retorna os álbuns visíveis dessa sala

### Scenario: Não membro não lista álbuns da sala
- **WHEN** um usuário autenticado que não é membro solicita álbuns de uma sala
- **THEN** o sistema rejeita o acesso com erro de permissão

### Scenario: UI de fotos da sala usa o contrato de álbuns
- **WHEN** um membro abre `/salas/<id>/fotos`
- **THEN** a listagem carrega álbuns pelo contrato de listagem de álbuns com identificação dessa sala

### Scenario: Aluno cria álbum pendente
- **WHEN** um aluno cria um álbum válido
- **THEN** o álbum fica com status pendente e não aparece na listagem pública até aprovação

### Scenario: Professor cria álbum aprovado
- **WHEN** um professor cria um álbum válido
- **THEN** o álbum fica aprovado e aparece imediatamente na listagem do escopo

### Scenario: Coordenação aprova foto pendente
- **WHEN** a coordenação aprova uma foto pendente
- **THEN** a foto passa a aparecer na grade do álbum para os membros do escopo

## Requirements

### Requirement: Álbuns listados e criados via API versionada com escopo
O sistema MUST listar e criar álbuns através de `GET`/`POST /api/v1/albums` com escopo global ou de sala. Para escopo de sala, a listagem MUST exigir que o usuário autenticado seja membro da sala (ou coordenação). A criação de álbuns MUST ser restrita exclusivamente a professores e coordenação. Alunos NÃO podem criar álbuns. O feed de fotos na interface MUST consumir esse contrato.

#### Scenario: Membro lista álbuns da sala
- **WHEN** um membro autenticado solicita `GET /api/v1/albums?classroomId=<id-da-sala>`
- **THEN** o sistema retorna os álbuns visíveis dessa sala

#### Scenario: Não membro não lista álbuns da sala
- **WHEN** um usuário autenticado que não é membro solicita álbuns de uma sala
- **THEN** o sistema rejeita o acesso com erro de permissão

#### Scenario: UI de fotos da sala usa o contrato de álbuns
- **WHEN** um membro abre `/salas/<id>/fotos`
- **THEN** a listagem carrega álbuns via `GET /api/v1/albums` com `classroomId` dessa sala

#### Scenario: Aluno tenta criar álbum
- **WHEN** um aluno solicita a criação de um álbum
- **THEN** o sistema rejeita com erro de permissão

#### Scenario: Professor ou Coordenação cria álbum
- **WHEN** um professor ou membro da coordenação cria um álbum válido
- **THEN** o álbum é criado e imediatamente aprovado

### Requirement: Upload de foto no álbum autenticado
O sistema MUST permitir que um membro do escopo envie fotos (JPEG, PNG ou WebP até 10 MB) para um álbum existente via `POST /api/v1/albums/:id/photos`. O sistema MUST rejeitar arquivos acima do limite. A identidade do autor MUST vir da sessão autenticada (não de campos enviados pelo cliente).

#### Scenario: Membro envia foto válida
- **WHEN** um membro do escopo envia uma foto JPEG de 5 MB para o álbum
- **THEN** a foto fica associada ao álbum e aparece na grade

#### Scenario: Foto excede tamanho máximo
- **WHEN** um usuário tenta enviar uma foto de 15 MB
- **THEN** o sistema rejeita o envio com mensagem de limite

#### Scenario: Identidade não pode ser forjada no body
- **WHEN** um cliente envia `createdById` ou `userRole` no body tentando se passar por outro usuário
- **THEN** o sistema ignora esses campos e usa apenas a sessão autenticada

### Requirement: Exibição da legenda
A interface de visualização do álbum SHALL exibir a legenda (caption) descritiva de cada foto imediatamente abaixo dela.

#### Scenario: Foto com legenda no álbum
- **WHEN** o usuário visualiza uma foto na grade
- **THEN** a sua descrição é renderizada debaixo da imagem

### Requirement: Moderação de álbuns e fotos por papel
O sistema MUST marcar fotos (conteúdo) enviadas por alunos como pendentes de moderação até aprovação. Conteúdo criado por professor ou coordenação MUST ficar aprovado automaticamente. Álbuns, por serem criados apenas por professores/coordenação, são sempre auto-aprovados. Professores (membros da sala) e a Coordenação MUST poder aprovar ou rejeitar itens pendentes na interface. Listagens públicas de fotos/álbuns MUST exibir apenas conteúdo aprovado para alunos; coordenação e professores MAY ver pendentes na área de moderação. A interface SHALL solicitar confirmação explícita através de um modal antes de efetivar as ações de aprovar ou rejeitar itens.

#### Scenario: Aluno envia foto pendente
- **WHEN** um aluno envia uma foto para um álbum existente
- **THEN** a foto fica com status pendente e não aparece na listagem pública

#### Scenario: Professor cria álbum aprovado
- **WHEN** um professor cria um álbum válido
- **THEN** o álbum fica aprovado e aparece imediatamente na listagem do escopo

#### Scenario: Coordenação aprova foto pendente via interface
- **WHEN** a coordenação clica para aprovar uma foto pendente e confirma a ação no modal
- **THEN** a foto passa a aparecer na grade do álbum para os membros do escopo

#### Scenario: Professor aprova foto pendente da sala
- **WHEN** um professor aprova uma foto pendente de uma sala da qual ele é membro após confirmar no modal
- **THEN** a foto passa a aparecer na grade do álbum para os membros da sala

#### Scenario: Coordenação rejeita foto pendente
- **WHEN** a coordenação clica para rejeitar uma foto pendente e confirma a ação no modal
- **THEN** a foto é descartada e removida da lista de pendências

## Constraints

**MUST**
- Álbum tem título, descrição opcional e escopo (global/sala)
- Upload de fotos: JPEG, PNG, WebP até 10 MB
- Grade de miniaturas (PhotoTile) responsiva
- Apenas membros do escopo podem ver e contribuir

**SHOULD**
- Legenda opcional por foto (200 chars)
- Contagem de fotos no card do álbum
- Limite de 50 fotos por álbum no MVP

**WON'T**
- Edição de imagem (crop, filtros) no MVP
- Vídeos no MVP
- Download em lote no MVP

## Scope

global + classroom

## Dependencies

- identity/auth
- identity/roles
- organization/classrooms
- organization/scopes

## Design references

- docs/design-system.md#PhotoTile

## Open questions

- [x] Aluno pode criar álbum ou apenas professor? — Aluno pode criar; conteúdo fica pendente até moderação
- [x] Moderação de fotos antes de publicar? — Sim; alunos pendentes, professor/coordenação aprovados automaticamente
