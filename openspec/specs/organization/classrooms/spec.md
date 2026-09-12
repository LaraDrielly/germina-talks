# Salas (turmas)

**Prioridade:** P0 | **Escopo:** organizacional

## Overview

Salas representam turmas ou grupos dentro do Instituto J&F, vinculados a uma frente de ensino. São a unidade organizacional para conteúdo com escopo de sala.

## Personas

- **Aluno** — vê e participa das salas em que é membro
- **Professor** — gerencia conteúdo das salas em que leciona
- **Coordenação** — visualiza todas as salas

## Scenarios

### Scenario: Aluno vê suas salas na sidebar
- **GIVEN** um aluno membro de "3º ADS" e "Projeto Integrador"
- **WHEN** ele acessa a plataforma
- **THEN** ambas as salas aparecem na navegação lateral

### Scenario: Aluno acessa sala da qual não é membro
- **GIVEN** um aluno que não é membro da sala "1º VET"
- **WHEN** ele tenta acessar `/salas/<id-vet>/feed`
- **THEN** o sistema exibe erro de acesso negado

### Scenario: Sala exibe frente de ensino visualmente
- **GIVEN** a sala "3º ADS" da Escola de Tecnologia
- **WHEN** o aluno navega para essa sala
- **THEN** a interface usa a cor da frente (`#1A1E20` — tech)

### Scenario: Listagem de salas
- **GIVEN** um usuário autenticado
- **WHEN** ele acessa a listagem de salas
- **THEN** vê apenas salas das quais é membro (aluno/professor) ou todas (coordenação)

## Requirements

### MUST
- Cada sala tem: nome, slug, frente de ensino, ano letivo
- Frentes de ensino: `business`, `tech`, `factory`
- Membros vinculados via tabela `classroom_members`
- Rotas por sala: `/salas/[id]/feed`, `/mural`, `/fotos`
- Cor visual da frente aplicada na UI da sala

### SHOULD
- Slug amigável para URL (ex: `3-ads-2026`)
- Agrupar salas por frente de ensino na sidebar

### WON'T
- Criação de salas por alunos no MVP (admin cria)
- Salas aninhadas (sub-salas)

## Scope

organizacional (não é conteúdo, mas estrutura)

## Dependencies

- identity/auth
- identity/roles

## Design references

- docs/design-system.md — cores por frente de ensino

## Open questions

- [ ] Quantas salas um aluno pode pertencer simultaneamente?
- [ ] Salas de projetos extras (fora da turma regular)?
