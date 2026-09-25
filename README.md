# Germina Talks

Plataforma open source de **comunidade escolar** para o [Instituto J&F](https://institutojef.org.br/) — um espaço digital único para comunicação, interação e compartilhamento entre alunos, professores e coordenação.

## O problema

Informações da escola estão espalhadas em WhatsApp, Instagram, Classroom e e-mail. O Germina Talks centraliza:

- **Publicações** — feed estilo tweet (global ou por sala)
- **Mural de recados** — avisos fixáveis com expiração
- **Álbum de fotos** — galeria de eventos escolares

## Documentação

| Documento | Conteúdo |
|-----------|----------|
| [Visão](docs/vision.md) | Problema, público, proposta de valor |
| [Design System](docs/design-system.md) | Cores, tipografia e componentes (identidade Instituto J&F) |
| [Glossário](docs/glossary.md) | Termos de domínio |
| [Técnico](docs/technical/overview.md) | Stack, backend, banco, frontend, API |
| [Specs](openspec/specs/) | Comportamento por feature (SDD) |
| [Contribuir](CONTRIBUTING.md) | Como propor e implementar features |
| [Agentes](AGENTS.md) | Guia para agentes de IA |

## Stack

Next.js · TypeScript · Tailwind CSS · Prisma · PostgreSQL · Auth.js

## Desenvolvimento local

Pré-requisitos: Node.js 20+ e Docker Desktop.

```bash
npm install
Copy-Item apps/web/.env.example apps/web/.env.local
Copy-Item packages/db/.env.example packages/db/.env
docker compose up -d
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

O app estará disponível em `http://localhost:3000`. O PostgreSQL usa a porta `5432` e o MinIO fica em `http://localhost:9001`.

Comandos de validação: `npm run typecheck`, `npm run lint` e `npm run build`.

## Desenvolvimento com OpenSpec

Este projeto usa [OpenSpec](https://github.com/Fission-AI/OpenSpec) para Spec-Driven Development:

```bash
# Explorar uma ideia
/openspec-explore

# Criar nova feature
/germina-create-feature communication/notifications — Notificações

# Implementar
/openspec-apply-change add-notifications
```

## Licença

Open source — contribuições bem-vindas da comunidade escolar.
