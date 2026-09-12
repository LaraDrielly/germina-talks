# Papéis e permissões

**Prioridade:** P0 | **Escopo:** global + sala

## Overview

Define os papéis de usuário (aluno, professor, coordenação) e as permissões associadas a cada ação na plataforma, tanto em escopo global quanto por sala.

## Personas

- **Aluno** — publica e visualiza conteúdo
- **Professor** — publica, fixa recados e modera na sala
- **Coordenação** — comunicados globais e moderação ampla

## Scenarios

### Scenario: Aluno publica no feed da sala
- **GIVEN** um aluno membro da sala "3º ADS"
- **WHEN** ele cria uma publicação no feed da sala
- **THEN** a publicação é criada com sucesso

### Scenario: Aluno tenta fixar recado no mural
- **GIVEN** um aluno membro de uma sala
- **WHEN** ele tenta fixar um recado no mural
- **THEN** o sistema nega a ação com erro de permissão

### Scenario: Professor fixa recado no mural da sala
- **GIVEN** um professor membro da sala
- **WHEN** ele fixa um recado no mural da sala
- **THEN** o recado aparece no topo do mural

### Scenario: Coordenação publica comunicado global
- **GIVEN** um usuário com papel de coordenação
- **WHEN** ele cria um recado com escopo global
- **THEN** o recado é visível para toda a escola

### Scenario: Aluno tenta publicar comunicado global
- **GIVEN** um aluno autenticado
- **WHEN** ele tenta criar conteúdo com escopo global
- **THEN** o sistema nega a ação

## Requirements

### MUST
- Três papéis globais: `student`, `teacher`, `admin`
- Papel na sala: `student` ou `teacher` (via `classroom_members`)
- Aluno: criar/ver conteúdo em escopos permitidos (sala onde é membro)
- Professor: tudo do aluno + fixar mural + deletar conteúdo na sala
- Coordenação: tudo + criar conteúdo global + moderação global

### SHOULD
- Exibir papel do usuário no perfil
- Badge visual diferenciando professor de aluno

### WON'T
- Papéis customizáveis por escola no MVP
- Permissões granulares por feature (RBAC avançado)

## Scope

global + classroom

## Dependencies

- identity/auth

## Design references

- docs/design-system.md#ScopeBadge

## Open questions

- [ ] Professor pode deletar publicação de outro professor na mesma sala?
