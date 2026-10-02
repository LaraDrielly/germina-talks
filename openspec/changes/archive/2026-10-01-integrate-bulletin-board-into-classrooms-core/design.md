# Design: integrar mural no classrooms core

## API changes

- `GET /api/v1/bulletin`: lista recados acessíveis; aceita `scopeType` e `classroomId`; exclui expirados/`deletedAt`; ordena fixados primeiro.
- `POST /api/v1/bulletin`: cria recado com título, corpo, escopo, sala, pin e expiração; autorização por papel e membership.
- `POST /api/v1/bulletin/:id/pin`: fixa recado; alunos são bloqueados; professor só na própria sala; coordenação em qualquer escopo.
- Erros padronizados via `postApiErrorResponse` (`BulletinServiceError`).

## Database changes

- Model `BulletinItem` já existe no schema do core — sem migration nova nesta integração.
- Mock repository passa a cobrir `findMany` (AND/OR, expiração, pin), `findUnique`, `create`/`update` com include de autor/sala.

## Frontend changes

- `/mural` e `/salas/[id]/mural` usam `BulletinBoard` + `BulletinService`.
- Listagem `/salas` ganha links para feed, mural e fotos da sala.
- Tokens `school-*` no Tailwind para badges de frente de ensino.

## Assumptions

- Alunos podem criar recados não fixados em salas das quais são membros.
- Coordenação (`admin`) publica globalmente e fixa em qualquer escopo.
- Desenvolvimento local continua com `DATABASE_PROVIDER=mock` quando aplicável.
