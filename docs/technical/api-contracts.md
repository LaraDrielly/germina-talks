# Contratos de API — Germina Talks

Convenções REST entre frontend e backend. Endpoints específicos de cada feature são detalhados no `design.md` da change.

## Base

| Item | Valor |
|------|-------|
| Base URL | `/api/v1` |
| Content-Type | `application/json` |
| Auth | Cookie de sessão (Auth.js) |
| Charset | UTF-8 |

## Formato de resposta (sucesso)

### Recurso único

```json
{
  "data": {
    "id": "uuid",
    "...": "..."
  }
}
```

### Listagem

```json
{
  "data": [ ... ],
  "meta": {
    "cursor": "next-cursor-or-null",
    "hasMore": true,
    "total": 42
  }
}
```

## Formato de erro

```json
{
  "error": {
    "code": "FORBIDDEN_SCOPE",
    "message": "Você não tem acesso a esta sala."
  }
}
```

### Códigos de erro de domínio

| Code | HTTP | Descrição |
|------|------|-----------|
| `VALIDATION_ERROR` | 400 | Entrada inválida |
| `UNAUTHORIZED` | 401 | Não autenticado |
| `FORBIDDEN` | 403 | Sem permissão |
| `FORBIDDEN_SCOPE` | 403 | Sem acesso ao escopo (sala) |
| `NOT_FOUND` | 404 | Recurso não existe |
| `CONFLICT` | 409 | Conflito de estado |
| `INTERNAL_ERROR` | 500 | Erro interno |

## Paginação

### Cursor (feeds)

```
GET /api/v1/posts?cursor=<id>&limit=20&classroomId=<uuid>
```

- `limit`: padrão 20, máximo 50
- `cursor`: ID do último item da página anterior
- `hasMore: false` quando não há mais itens

### Offset (admin, futuro)

```
GET /api/v1/admin/users?page=1&limit=20
```

## Índice de recursos

| Recurso | Métodos | Spec |
|---------|---------|------|
| `/auth/session` | GET | identity/auth |
| `/classrooms` | GET | organization/classrooms |
| `/classrooms/:id/members` | GET | organization/classrooms |
| `/posts` | GET, POST | communication/posts |
| `/posts/:id` | GET, DELETE | communication/posts |
| `/bulletin` | GET, POST | communication/bulletin-board |
| `/bulletin/:id` | GET, PATCH, DELETE | communication/bulletin-board |
| `/bulletin/:id/pin` | POST, DELETE | communication/bulletin-board |
| `/albums` | GET, POST | communication/photo-album |
| `/albums/:id` | GET, DELETE | communication/photo-album |
| `/albums/:id/photos` | GET, POST | communication/photo-album |
| `/photos/upload-url` | POST | communication/photo-album |

## Convenções de request body

### Criar publicação

```json
POST /api/v1/posts
{
  "content": "Texto da publicação",
  "scopeType": "classroom",
  "classroomId": "uuid-da-sala"
}
```

### Criar recado no mural

```json
POST /api/v1/bulletin
{
  "title": "Prova de matemática",
  "body": "A prova será na próxima terça, às 14h.",
  "scopeType": "classroom",
  "classroomId": "uuid-da-sala",
  "isPinned": true,
  "expiresAt": "2026-09-15T23:59:59Z"
}
```

### Criar álbum

```json
POST /api/v1/albums
{
  "title": "Feira de Ciências 2026",
  "description": "Fotos do evento",
  "scopeType": "global"
}
```

## Filtros comuns (query params)

| Param | Tipo | Uso |
|-------|------|-----|
| `scopeType` | `global` \| `classroom` | Filtrar por escopo |
| `classroomId` | UUID | Filtrar por sala |
| `cursor` | string | Paginação cursor |
| `limit` | number | Itens por página |

## Versionamento

- Versão atual: `v1` no path
- Breaking changes → `v2` com período de deprecação de `v1`
- Header opcional: `X-API-Version: 1`

## CORS (se necessário)

No MVP, frontend e API estão no mesmo domínio (Next.js). CORS só será necessário se houver app mobile separado.
