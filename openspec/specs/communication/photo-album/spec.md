# Álbum de fotos

**Prioridade:** P2 | **Escopo:** global + sala

## Overview

Permite criar álbuns de fotos para registrar eventos e momentos da vida escolar, organizados por escopo global (eventos da escola) ou por sala (eventos da turma).

## Personas

- **Aluno** — visualiza e contribui com fotos dos eventos da turma
- **Professor** — cria álbuns e organiza fotos de atividades
- **Coordenação** — cria álbuns de eventos institucionais

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

## Requirements

### MUST
- Álbum tem título, descrição opcional e escopo (global/sala)
- Upload de fotos: JPEG, PNG, WebP até 10 MB
- Grade de miniaturas (PhotoTile) responsiva
- Apenas membros do escopo podem ver e contribuir
- Storage externo (S3/MinIO) via presigned URL

### SHOULD
- Legenda opcional por foto (200 chars)
- Contagem de fotos no card do álbum
- Limite de 50 fotos por álbum no MVP

### WON'T
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

- [ ] Aluno pode criar álbum ou apenas professor?
- [ ] Moderação de fotos antes de publicar?
