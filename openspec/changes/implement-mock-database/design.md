## Context

Consulte [proposal.md](proposal.md). A aplicação precisa rodar offline e em testes sem Docker.

## Goals / Non-Goals

**Goals:**
- Fornecer driver de mock database espelhando Prisma (`User`, `Classroom`, `ClassroomMember`, `Post`, `BulletinItem`, `Album`).
- Alternância transparente via variável de ambiente.

**Non-Goals:**
- Migrations SQL no modo mock.

## Decisions

- Módulo `apps/web/lib/db/mock-repository.ts` com estado em `Map` e dados iniciais em `mock-data.ts`.
- Factory de cliente em `apps/web/lib/db/client.ts`.
