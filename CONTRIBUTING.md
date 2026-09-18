# Como contribuir — Germina Talks

O Germina Talks é um projeto **open source** da comunidade do Instituto J&F. Este guia explica como propor e implementar features.

## Pré-requisitos

- [OpenSpec CLI](https://github.com/Fission-AI/OpenSpec): `npm install -g @fission-ai/openspec`
- Node.js 20+
- Git

## Fluxo de contribuição

### 1. Planejamento (Novo Passo Obrigatório)
Antes de qualquer implementação ou change OpenSpec, **liste as tarefas técnicas** no arquivo [`.agents/TASKS.md`](.agents/TASKS.md).
- O agente irá revisar a lista, aguardar sua confirmação e só então prosseguirá com a execução.
- Cada tarefa listada no arquivo corresponde a um commit atômico.

### 2. Explore a ideia

Use a skill `openspec-explore` ou discuta no chat antes de criar uma feature:

```
/openspec-explore Quero adicionar curtidas nos posts
```

### 3. Crie a feature

Use `germina-create-feature` para scaffold padronizado:

```
/germina-create-feature communication/reactions — Curtidas em publicações
```

Ou use `openspec-propose` para uma change completa:

```
/openspec-propose add-reactions
```

### 4. Revise os artefatos e Tarefas

A change terá:
- `proposal.md` — o quê e por quê
- `design.md` — impacto em API, banco e frontend
- `tasks.md` — checklist de implementação
- `specs/.../spec.md` — delta de comportamento
- **Reforço**: Garanta que as tarefas de implementação estejam refletidas em `[`.agents/TASKS.md`](.agents/TASKS.md).

### 5. Implemente

```
/openspec-apply-change add-reactions
```
(Siga o protocolo de confirmação de tarefas antes de cada bloco de execução).

### 6. Finalize

Após PR aprovado e tasks completas:

```
/openspec-archive-change add-reactions
```

## Estrutura de documentação

```
docs/
├── vision.md              # Problema e proposta de valor
├── design-system.md       # Cores, tipografia, componentes
├── glossary.md            # Termos de domínio
└── technical/
    ├── overview.md        # Stack e arquitetura
    ├── backend.md         # Padrões de servidor
    ├── database.md        # Modelo de dados
    ├── frontend.md        # Padrões de UI
    └── api-contracts.md   # Convenções REST

openspec/
├── specs/                 # Specs estáveis (1 MD por feature)
└── changes/               # Mudanças ativas
```

## Convenções

- **Commits:** conventional commits (`feat:`, `fix:`, `docs:`)
- **Branches:** `feat/nome-da-feature`
- **Specs:** seguir template em `openspec/specs/_meta/conventions.md`
- **UI:** seguir `docs/design-system.md` (cores do Instituto J&F)
- **Código:** TypeScript, variáveis em inglês, mensagens de UI em português

## O que NÃO fazer

- Editar specs em `openspec/specs/` direto na main
- Implementar sem change OpenSpec
- Ignorar escopo (global vs sala) em features de conteúdo
- Usar cores fora da paleta do design system

## Dúvidas

- Leia [AGENTS.md](AGENTS.md) para instruções detalhadas a agentes
- Consulte [docs/glossary.md](docs/glossary.md) para termos
- Abra uma issue para discutir features grandes antes de implementar
