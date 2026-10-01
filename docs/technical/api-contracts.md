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

- `limit`: padrão e máximo 20
- `cursor`: ID do último item da página anterior
- resposta: `{ data: [...], nextCursor: "uuid-ou-null" }`; `nextCursor: null` indica fim do feed

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
| `/posts/:id` | DELETE | communication/posts |
| `/bulletin` | GET, POST | communication/bulletin-board |
| `/bulletin/:id/pin` | POST | communication/bulletin-board |
| `/albums` | GET, POST | communication/photo-album |
| `/albums/:id/photos` | GET, POST | communication/photo-album |
| `/photos/upload-url` | POST | communication/photo-album |

### Feed e fotos (MVP)

- `GET /api/v1/posts` retorna até 20 publicações acessíveis em ordem cronológica decrescente. Sem filtro, reúne publicações globais e das salas vinculadas ao usuário. `scopeType`, `classroomId`, `cursor` e `limit` são opcionais.
- `POST /api/v1/posts` cria uma publicação de 1 a 280 caracteres no escopo global ou em sala acessível; `DELETE /api/v1/posts/:id` faz soft delete e somente o autor pode executar.
- `GET /api/v1/albums` lista álbuns globais e de salas acessíveis; `classroomId` opcional filtra por sala. Retorna contagem e URL de capa temporária quando há fotos.
- `POST /api/v1/albums` cria álbum. Apenas professor ou coordenação; professor precisa ser membro-professor da sala indicada.
- `POST /api/v1/photos/upload-url` recebe `albumId`, `fileName`, `contentType`, `sizeBytes` e legenda opcional; devolve URL temporária e chave de objeto. O cliente envia bytes com `PUT` direto ao storage.
- `GET /api/v1/albums/:id/photos` retorna álbum, metadados e URLs de leitura temporárias. `POST` na mesma rota confirma o upload com `objectKey`, `contentType`, `sizeBytes` e legenda. O servidor confere escopo, metadados, assinatura do arquivo, limite de 10 MB e máximo de 50 fotos.
- Fotos aceitas: `image/jpeg`, `image/png`, `image/webp`. Chaves de storage são privadas; URLs assinadas expiram em cinco minutos.

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

### Mural (MVP implementado)

- `GET /api/v1/bulletin` retorna `{ data: [...] }`, sem paginação no MVP. Aceita `scopeType` e `classroomId`; o servidor verifica o vínculo antes de retornar conteúdo da sala.
- `POST /api/v1/bulletin` cria recado; título, corpo e escopo são validados com Zod. Aluno/professor publicam em sala vinculada; coordenação também pode publicar globalmente.
- `POST /api/v1/bulletin/:id/pin` fixa um recado. Remover a fixação, editar e excluir recados ainda não fazem parte do MVP.
- Todas essas rotas devolvem erros JSON no formato deste documento; falta de sessão resulta em `401`, e falta de permissão resulta em `403`.

## Versionamento

- Versão atual: `v1` no path
- Breaking changes → `v2` com período de deprecação de `v1`
- Header opcional: `X-API-Version: 1`

## CORS (se necessário)

No MVP, frontend e API estão no mesmo domínio (Next.js). CORS só será necessário se houver app mobile separado.
