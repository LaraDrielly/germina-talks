# Escopos (global vs sala)

**Prioridade:** P0 | **Escopo:** transversal

## Purpose

Define o modelo de escopo que permeia todo conteúdo da plataforma: conteúdo pode ser **global** (toda a escola) ou **por sala** (apenas membros da turma).

## Personas

- Todos os usuários interagem com conteúdo em um dos dois escopos

## Requirements

### Requirement: Regras de escopo
- Todo conteúdo (post, recado, álbum) tem `scope_type`: `global` ou `classroom`
- Se `classroom`, `classroom_id` é obrigatório
- Conteúdo global visível para qualquer usuário autenticado
- Conteúdo de sala visível apenas para membros da sala
- UI sempre exibe o escopo via ScopeBadge

#### Scenario: Conteúdo global visível para todos
- **GIVEN** um recado com escopo global publicado pela coordenação
- **WHEN** qualquer aluno autenticado acessa o mural global
- **THEN** o recado é exibido

#### Scenario: Conteúdo de sala visível apenas para membros
- **GIVEN** uma publicação na sala "3º ADS"
- **WHEN** um aluno que NÃO é membro dessa sala tenta ver o feed
- **THEN** a publicação não é exibida

#### Scenario: ScopeBadge indica escopo na UI
- **GIVEN** uma publicação no feed
- **WHEN** o usuário visualiza o PostCard
- **THEN** um badge indica "Toda a escola" ou o nome da sala

#### Scenario: Criar conteúdo exige escopo explícito
- **GIVEN** um professor criando um recado
- **WHEN** ele submete o formulário sem selecionar escopo
- **THEN** o sistema exige seleção de global ou sala

### Requirement: Funcionalidades desejáveis
- Formulário de criação permite alternar entre global e sala
- Default: escopo da sala atual quando navegando em `/salas/[id]`

#### Scenario: Funcionalidades desejáveis aplicadas
- **WHEN** exibe form
- **THEN** preenche default

### Requirement: Fora do escopo
- Escopos customizados (ex: "apenas professores") no MVP
- Escopo por frente de ensino (sem ser sala específica)

#### Scenario: Funcionalidades ausentes
- **WHEN** tenta usar escopo custom
- **THEN** falha

## Scope

transversal (aplica-se a posts, mural, álbuns)

## Dependencies

- organization/classrooms
- identity/roles

## Design references

- docs/design-system.md#ScopeBadge

## Open questions

- [ ] Aluno pode ver feed global de outras salas em modo "preview"?
