# Frontend — Germina Talks

Arquitetura da interface. Componentes visuais seguem [design-system.md](../design-system.md).

## Stack UI

| Tecnologia | Uso |
|------------|-----|
| Next.js App Router | Rotas, layouts, Server Components |
| TypeScript | Tipagem em todo o app |
| Tailwind CSS | Estilos com tokens do design system |
| shadcn/ui | Componentes base (Button, Card, Dialog…) |
| React Query (TanStack) | Cache e mutations no client |
| Auth.js | `useSession()` para estado de auth |

## Estrutura de pastas

```
apps/web/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (main)/
│   │   ├── layout.tsx          # Sidebar + header
│   │   ├── feed/
│   │   ├── mural/
│   │   ├── fotos/
│   │   ├── salas/
│   │   │   └── [classroomId]/
│   │   │       ├── feed/
│   │   │       ├── mural/
│   │   │       └── fotos/
│   │   └── perfil/
│   └── api/v1/                 # Route Handlers
├── components/
│   ├── ui/                     # Primitivos (shadcn)
│   └── features/
│       ├── posts/
│       ├── bulletin/
│       ├── photos/
│       └── classrooms/
└── lib/
    ├── api-client.ts
    ├── hooks/
    └── validators/
```

## Roteamento

### Rotas globais

| Rota | Página | Descrição |
|------|--------|-----------|
| `/feed` | Feed global | Publicações de toda a escola |
| `/mural` | Mural global | Recados institucionais |
| `/fotos` | Álbuns globais | Fotos de eventos escolares |

### Rotas por sala

| Rota | Página | Descrição |
|------|--------|-----------|
| `/salas/[id]/feed` | Feed da sala | Publicações da turma |
| `/salas/[id]/mural` | Mural da sala | Recados da turma |
| `/salas/[id]/fotos` | Fotos da sala | Álbuns da turma |

### Layout

```
┌─────────────────────────────────────────────┐
│ Header: logo + ScopeBadge + perfil          │
├──────────┬──────────────────────────────────┤
│ Sidebar  │ Conteúdo principal               │
│          │                                  │
│ Feed     │  [Lista de posts / mural / fotos]│
│ Mural    │                                  │
│ Fotos    │                                  │
│ ─────    │                                  │
│ Salas ▼  │                                  │
│  ADS     │                                  │
│  VET     │                                  │
└──────────┴──────────────────────────────────┘
```

Mobile: sidebar colapsa em bottom navigation.

## Data fetching

| Padrão | Quando |
|--------|--------|
| Server Component + fetch | Listagem inicial (SEO, performance) |
| React Query `useInfiniteQuery` | Feed infinito (posts) |
| React Query `useMutation` | Criar/editar/deletar |
| Optimistic update | Curtir post (futuro) |

```typescript
// Exemplo: feed de posts
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ['posts', { classroomId }],
  queryFn: ({ pageParam }) => api.posts.list({ cursor: pageParam, classroomId }),
});
```

## Estado

| Tipo | Solução |
|------|---------|
| Server state (API) | React Query |
| Auth session | Auth.js `useSession()` |
| UI local (modal, form) | `useState` / `useReducer` |
| Escopo atual (global/sala) | URL params + context |

Sem Redux no MVP.

## Componentes de feature

Cada feature em `components/features/<nome>/`:

| Feature | Componentes principais |
|---------|------------------------|
| posts | `PostCard`, `PostForm`, `PostList` |
| bulletin | `BulletinPin`, `BulletinForm`, `BulletinList` |
| photos | `PhotoTile`, `AlbumGrid`, `PhotoUpload` |
| classrooms | `ClassroomSidebar`, `ScopeBadge` |

Todos usam tokens de [design-system.md](../design-system.md).

## Padrão de página

1. **Header de contexto** — título + ScopeBadge + ação (ex: "Nova publicação")
2. **Lista** — cards com loading skeleton
3. **Empty state** — quando não há conteúdo
4. **Paginação** — infinite scroll ou "carregar mais"

## Formulários

- Validação client-side com Zod (schemas de `packages/shared`)
- Feedback de erro inline
- Loading no botão de submit
- Toast de sucesso/erro

## Acessibilidade

- WCAG 2.1 AA
- Mobile-first (breakpoints: sm 640, md 768, lg 1024)
- `prefers-reduced-motion` respeitado
- Foco visível (`outline` em `#27AAE1`)

## O que vai no design.md da feature

- Novas rotas e páginas
- Componentes específicos
- Hooks e integrações API
- Wireframe textual
