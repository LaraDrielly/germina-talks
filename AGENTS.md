# Germina Talks — Guia para Agentes

Instruções para agentes de IA (Cursor, Copilot, Gemini) que trabalham neste repositório.

## Antes de qualquer trabalho

1. Leia [docs/vision.md](docs/vision.md) — entenda o problema e o público
2. Leia [docs/design-system.md](docs/design-system.md) — cores e componentes do Instituto J&F
3. Consulte [docs/glossary.md](docs/glossary.md) — termos de domínio

## Documentação por tipo

| Tipo | Onde | Quando consultar |
|------|------|------------------|
| Produto | `docs/vision.md` | Entender o porquê |
| Design | `docs/design-system.md` | Implementar UI |
| Técnico | `docs/technical/` | Arquitetura, API, banco, frontend |
| Comportamento | `openspec/specs/` | O que o sistema deve fazer |
| Mudança ativa | `openspec/changes/` | Implementação em andamento |

## Fluxo de trabalho OpenSpec

```
explore → propose/create-feature → apply → archive
```

| Skill | Quando usar |
|-------|-------------|
| `openspec-explore` | Pensar, investigar, esclarecer requisitos |
| `openspec-propose` | Criar change completa (proposal + design + tasks + spec) |
| `germina-create-feature` | Scaffold padronizado de nova feature |
| `openspec-apply-change` | Implementar tasks de uma change |
| `openspec-update-change` | Revisar planejamento sem codar |
| `openspec-sync-specs` | Mesclar delta spec → spec principal |
| `openspec-archive-change` | Finalizar change após implementação |

## Regras

1. **Nunca editar `openspec/specs/*/spec.md` direto** — use changes + archive/sync
2. **Toda feature MUST declarar escopo** (global | classroom | ambos)
3. **UI MUST seguir** `docs/design-system.md` (cores do Instituto J&F)
4. **design.md MUST ter** seções: API changes, Database changes, Frontend changes
5. **Specs descrevem comportamento**, não implementação
6. **Código em português** para mensagens de UI; código/variáveis em inglês

## Identidade visual (referência rápida)

| Token | Valor |
|-------|-------|
| Primary | `#3A255B` |
| Accent | `#27AAE1` |
| Green | `#11C76F` |
| Orange | `#DC4405` |
| Text | `#3C3F4F` |
| Fonte | Inter |

## Stack

Next.js + TypeScript + Tailwind + Prisma + PostgreSQL + Auth.js

Detalhes: [docs/technical/overview.md](docs/technical/overview.md)

# Agentes e Skills do Projeto

## Git

Para operações relacionadas a Git, versionamento, criação de branches, commits, code review, push e Pull Requests, utilize a Skill:

- `.agents/skills/git-workflow/SKILL.md`

Essa Skill define o fluxo padrão de Git do projeto e deve ser seguida antes de realizar operações de versionamento.