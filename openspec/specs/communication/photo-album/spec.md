# Álbum de fotos

**Prioridade:** P2 | **Escopo:** global + sala

## Purpose

Permite criar álbuns de fotos para registrar eventos e momentos da vida escolar, organizados por escopo global (eventos da escola) ou por sala (eventos da turma).

## Personas

- **Aluno** — visualiza e contribui com fotos dos eventos da turma
- **Professor** — cria álbuns e organiza fotos de atividades
- **Coordenação** — cria álbuns de eventos institucionais

## Requirements

### Requirement: Upload de Fotos e Álbum
- Álbum tem título, descrição opcional e escopo (global/sala)
- Upload de fotos: JPEG, PNG, WebP até 10 MB
- Grade de miniaturas (PhotoTile) responsiva
- Apenas membros do escopo podem ver e contribuir
- Storage local (Filesystem) via multipart/form-data no endpoint de upload

#### Scenario: Professor cria álbum da turma
- **WHEN** um professor da sala "3º ADS" cria o álbum "Feira de Ciências 2026" com escopo da sala
- **THEN** o álbum aparece em `/salas/<id>/fotos`

#### Scenario: Upload de foto no álbum
- **WHEN** um membro da sala faz upload de uma foto JPEG (5 MB) em um álbum existente
- **THEN** a foto aparece na grade do álbum com miniatura

#### Scenario: Foto excede tamanho máximo
- **WHEN** um usuário tenta upload de foto de 15 MB
- **THEN** o sistema rejeita com mensagem de limite (10 MB)

#### Scenario: Álbum global de evento escolar
- **WHEN** qualquer aluno autenticado acessa `/fotos`
- **THEN** o álbum global "Formatura 2026" é visível na listagem

#### Scenario: Grid de fotos responsivo
- **WHEN** um aluno visualiza no celular um álbum com 12 fotos
- **THEN** as fotos aparecem em grid de 2 colunas

### Requirement: Fluxo de aprovação de álbum criado por aluno
Quando um aluno cria um álbum de fotos para a sua sala, este álbum SHALL ser criado com status "PENDING" e só se torna visível para outros alunos após a aprovação da coordenação.

#### Scenario: Aluno cria álbum e coordenação aprova
- **WHEN** um aluno cria um álbum na sua sala
- **THEN** o álbum fica com status "PENDING" e a coordenação pode aprová-lo para que mude para "APPROVED"

#### Scenario: Álbum não aprovado não aparece na listagem
- **WHEN** um aluno tenta visualizar a listagem de álbuns da sala
- **THEN** álbuns com status "PENDING" ou "REJECTED" não são retornados (exceto para o próprio criador ou para professores/coordenação)

### Requirement: Fluxo de aprovação de fotos
Quando um aluno envia uma foto para um álbum, a foto SHALL ser submetida com status "PENDING" e só ficará visível no álbum após aprovação por um professor ou pela coordenação.

#### Scenario: Aluno envia foto
- **WHEN** um aluno envia uma foto para um álbum
- **THEN** a foto entra com status "PENDING" e requer aprovação

#### Scenario: Professor aprova foto
- **WHEN** um professor aprova a foto "PENDING" de um aluno
- **THEN** o status da foto muda para "APPROVED" e ela aparece na grade do álbum

#### Scenario: Foto pendente recebe aviso visual
- **WHEN** o aluno que enviou a foto acessa o álbum
- **THEN** ele visualiza a sua foto com uma indicação "Aguardando aprovação"

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

- [x] Aluno pode criar álbum ou apenas professor?
- [x] Moderação de fotos antes de publicar?
