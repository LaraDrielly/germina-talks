# Publicações (feed)

**Prioridade:** P1 | **Escopo:** global + sala

## Overview

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

## Requirements

### MUST
- Texto limitado a 280 caracteres
- Escopo global ou por sala (ver organization/scopes)
- Feed cronológico decrescente
- Autor pode deletar própria publicação
- Exibir: avatar, nome, papel, timestamp, ScopeBadge
- Paginação por cursor (20 itens por página)

### SHOULD
- Contador de caracteres no formulário
- Empty state amigável quando feed vazio

### WON'T
- Curtidas e comentários no MVP
- Mídia anexa (imagens/vídeos) em posts no MVP
- Edição de publicação após envio no MVP

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
