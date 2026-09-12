# Convenções de escrita de specs

Regras para criar e manter arquivos em `openspec/specs/`.

## Estrutura de pastas

```
openspec/specs/
├── _meta/                  # Convenções e metadados
├── <domínio>/
│   └── <feature>/
│       └── spec.md
```

**Domínios atuais:** `identity`, `organization`, `communication`

## Template de spec

Todo `spec.md` deve seguir esta estrutura:

```markdown
# [Feature] Nome

## Overview
Uma frase descrevendo o que a feature faz e por quê.

## Personas
Quem usa e em qual contexto.

## Scenarios

### Scenario: Nome descritivo
- **GIVEN** contexto inicial
- **WHEN** ação do usuário
- **THEN** resultado esperado

## Requirements

### MUST
- Comportamento obrigatório

### SHOULD
- Comportamento desejável

### WON'T (fora do escopo)
- O que esta feature explicitamente não faz

## Scope
- global | classroom | ambos

## Dependencies
- Links para outras specs (ex: identity/auth)

## Design references
- docs/design-system.md#Componente

## Open questions
- [ ] Perguntas pendentes
```

## Regras

1. **Cenários testáveis** — todo MUST deve ter pelo menos um Scenario
2. **Escopo explícito** — declarar se é global, por sala ou ambos
3. **Sem detalhe de implementação** — rotas, tabelas e componentes vão no `design.md` da change
4. **Linguagem de negócio** — escrever do ponto de vista do usuário escolar
5. **Delta em changes** — editar spec principal apenas via archive/sync

## Nomenclatura

| Item | Convenção | Exemplo |
|------|-----------|---------|
| Pasta de feature | kebab-case | `bulletin-board` |
| Change | `add-<feature>` ou `update-<feature>` | `add-posts` |
| Cenário | Verbo no infinitivo | "Aluno publica na sala" |

## Prioridades

| Prioridade | Significado |
|------------|-------------|
| P0 | Bloqueante para MVP |
| P1 | MVP |
| P2 | Pós-MVP |

## Checklist antes de arquivar uma change

- [ ] Todos os cenários da delta spec estão na spec principal
- [ ] `docs/technical/database.md` atualizado (se novas tabelas)
- [ ] `docs/technical/api-contracts.md` atualizado (se novos endpoints)
- [ ] `openspec validate` passa sem erros
