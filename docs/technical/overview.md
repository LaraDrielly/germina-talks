## Visão técnica — Germina Talks

Ponto de entrada para desenvolvedores e agentes. Leia este documento antes de implementar qualquer feature.

## Planejamento e Execução

Para garantir rastreabilidade, todo planejamento técnico de implementação de features deve ser registrado em [`.agents/TASKS.md`](../../.agents/TASKS.md).
- O fluxo de trabalho exige: **Planejamento no TASKS.md** -> **Aprovação do Usuário** -> **Implementação**.
- Cada tarefa listada resulta em um commit atômico seguindo as convenções.

## Stack proposta (MVP)


| Camada | Tecnologia | Motivo |
|--------|------------|--------|
| Frontend | Next.js 15 (App Router) + TypeScript | SSR, rotas por sala, DX familiar para contribuidores |
| Estilo | Tailwind CSS + tokens do design system | Consistência visual com `docs/design-system.md` |
| Componentes | shadcn/ui (customizado) | Base acessível, fácil de contribuir |
| Backend | Next.js Route Handlers | Monorepo simples, sem serviço separado no MVP |
| Banco | PostgreSQL | Relacional, adequado para escopos e permissões |
| ORM | Prisma | Migrations, tipos gerados, DX para open source |
| Auth | Auth.js (NextAuth v5) | Login com e-mail institucional |
| Storage | S3-compatible (AWS S3 / MinIO) | Fotos do álbum |
| Validação | Zod | Schemas compartilhados front/back |
| Deploy | Vercel + Neon (ou Docker self-hosted) | Simples para MVP; Docker para escola |

## Estrutura do repositório

```
germina-talks/
├── apps/
│   └── web/                 # Next.js (frontend + API)
│       ├── app/             # App Router
│       ├── components/
│       └── lib/
├── packages/
│   ├── db/                  # Prisma schema + migrations
│   └── shared/              # Tipos, validações Zod, constantes
├── docs/                    # Documentação humana
├── openspec/                # SDD (specs + changes)
└── .agents/skills/          # Skills para agentes
```

## Ambientes

| Ambiente | Uso |
|----------|-----|
| `local` | Desenvolvimento com Docker Compose (Postgres + MinIO) |
| `staging` | Preview de PRs / testes integrados |
| `production` | Ambiente da escola |

## Decisões arquiteturais (ADR resumido)

| # | Decisão | Justificativa |
|---|---------|---------------|
| 1 | Monorepo | Facilita contribuição estudantil; tipos compartilhados |
| 2 | Escopo em todas as entidades de conteúdo | `scope_type` + `classroom_id` desde o início |
| 3 | API REST JSON | Simples para contribuidores e documentação |
| 4 | Sem chat em tempo real no MVP | Reduz complexidade; foco em feed/mural |
| 5 | Soft delete em conteúdo | Moderação e recuperação |

## Documentação técnica

| Documento | Conteúdo |
|-----------|----------|
| [backend.md](./backend.md) | Camadas, auth, serviços, erros |
| [database.md](./database.md) | Modelo de dados, ERD, migrations |
| [frontend.md](./frontend.md) | Rotas, estado, componentes |
| [api-contracts.md](./api-contracts.md) | Convenções REST, formatos |

## Links relacionados

- [Visão do produto](../vision.md)
- [Design System](../design-system.md)
- [Glossário](../glossary.md)
- [Convenções de specs](../../openspec/specs/_meta/conventions.md)
