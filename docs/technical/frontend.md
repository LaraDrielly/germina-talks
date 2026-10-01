# Frontend — Germina Talks

Arquitetura da interface. Componentes visuais seguem [design-system.md](../design-system.md).

## Stack UI

| Tecnologia | Uso |
|------------|-----|
| Next.js App Router | Rotas, layouts, Server Components |
| TypeScript | Tipagem em todo o app |
| Tailwind CSS | Estilos com tokens do design system |
| shadcn/ui | Componentes base (Button, Card, Dialog…) |
| Fetch + estado React | Consultas, formulários e mutations no MVP |
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

O mural global reúne os recados globais e os recados das salas acessíveis ao usuário. `/salas/[id]/mural` abre o mural filtrado da sala e retorna 404 para quem não tem vínculo com ela (exceto coordenação).

O feed global reúne publicações globais e das salas acessíveis ao usuário. Usa cursor de 20 itens e carrega a página seguinte ao chegar ao fim da lista; `/salas/[id]/feed` é restrita aos membros da sala. `/fotos` lista álbuns acessíveis; `/salas/[id]/fotos` filtra pela sala e `/fotos/[id]` mostra o álbum com upload e miniaturas responsivas.

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
| Estado React + `fetch` | Feed, formulários e mutations do MVP |
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
| Server state (API) | `fetch` em componentes client com estados de carregamento e erro |
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
