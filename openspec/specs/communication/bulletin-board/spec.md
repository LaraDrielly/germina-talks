# Mural de recados

**Prioridade:** P1 | **Escopo:** global + sala

## Overview

Mural de avisos informativos onde professores e coordenação publicam recados que podem ser fixados no topo, com opção de data de expiração. Diferente do feed, o mural tem tom institucional.

## Personas

- **Professor** — publica e fixa recados para a turma
- **Coordenação** — publica comunicados globais para toda a escola
- **Aluno** — lê recados da escola e das suas salas

## Scenarios

### Scenario: Professor fixa recado na sala
- **GIVEN** um professor da sala "3º ADS"
- **WHEN** ele cria um recado "Prova dia 10/09" e marca como fixado
- **THEN** o recado aparece no topo do mural da sala com destaque visual

### Scenario: Recado expirado some do mural
- **GIVEN** um recado com `expires_at` no passado
- **WHEN** um aluno acessa o mural
- **THEN** o recado expirado não é exibido

### Scenario: Aluno lê mural global
- **GIVEN** um comunicado global da coordenação
- **WHEN** qualquer aluno autenticado acessa `/mural`
- **THEN** o comunicado é exibido com badge "Toda a escola"

### Scenario: Aluno não pode fixar recado
- **GIVEN** um aluno autenticado
- **WHEN** ele tenta fixar um recado
- **THEN** a opção de fixar não está disponível

### Scenario: Recados fixados aparecem antes dos demais
- **GIVEN** 2 recados fixados e 3 não fixados na sala
- **WHEN** um membro acessa o mural
- **THEN** os fixados aparecem primeiro, depois os demais por data

## Requirements

### MUST
- Recado tem título (120 chars) e corpo (texto livre)
- Escopo global ou por sala
- Apenas professor/coordenação pode fixar (`is_pinned`)
- Recados fixados aparecem no topo
- Expiração opcional (`expires_at`)
- Recados expirados não são exibidos
- Visual diferenciado de posts (BulletinPin)

### SHOULD
- Indicador visual de recado fixado (ícone pin)
- Data de expiração visível no card

### WON'T
- Comentários em recados no MVP
- Anexos de arquivo no MVP
- Notificação push ao publicar recado no MVP

## Scope

global + classroom

## Dependencies

- identity/auth
- identity/roles
- organization/classrooms
- organization/scopes

## Design references

- docs/design-system.md#BulletinPin
- docs/design-system.md — hierarquia: comunicado fixado > publicação

## Open questions

- [ ] Aluno pode criar recado não fixado na sala?
- [ ] Limite de recados fixados simultâneos por sala?
