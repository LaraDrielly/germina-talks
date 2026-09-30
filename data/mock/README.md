# Dados mockados — Germina Talks

Arquivos JSON que simulam o banco até o Prisma + PostgreSQL existirem. Cada arquivo corresponde a uma tabela em `docs/technical/database.md`.

Campos em **camelCase**, no formato da API (`docs/technical/api-contracts.md`), para o frontend importar direto.

## Como usar

```ts
import users from "@/data/mock/users.json";
import posts from "@/data/mock/posts.json";

const feed = posts
  .filter((p) => p.deletedAt === null)
  .filter((p) => p.scopeType === "global")
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
```

Relacionamentos por UUID. Exemplo: `posts[].authorId` → `users[].id`.

## Sessão de desenvolvimento

Trate **Lara Silva** (`7c8a1e2f-4b3d-4a91-9c12-0f1e2d3c4b5a`) como usuário logado:

- papel global `student`
- membro de `3-ads-2026` e `projeto-integrador-2026`
- vê feed/mural/fotos globais + conteúdo dessas duas salas
- **não** vê conteúdo de `1-vet-2026` nem `2-adm-2026`

## Regras de filtro (espelham as specs)

| Recurso | Visível se |
|---------|------------|
| Conteúdo `global` | usuário autenticado |
| Conteúdo `classroom` | membro da sala **ou** `role === "admin"` |
| Posts | `deletedAt === null` |
| Mural | `deletedAt === null` e (`expiresAt === null` ou data no futuro) |
| Mural ordenação | `isPinned` primeiro, depois `createdAt` desc |

## Arquivos

| Arquivo | Tabela |
|---------|--------|
| `users.json` | users |
| `classrooms.json` | classrooms |
| `classroom-members.json` | classroom_members |
| `posts.json` | posts |
| `bulletin-items.json` | bulletin_items |
| `albums.json` | albums |
| `photos.json` | photos (`url` extra para exibir sem S3) |
