# Backend — Germina Talks

Padrões da camada de servidor. Detalhes específicos de cada feature ficam no `design.md` da change OpenSpec.

## Arquitetura em camadas

```
HTTP Request
  → Route Handler (app/api/v1/...)
    → Middleware (auth, scope)
      → Service (lógica de negócio)
        → Repository (Prisma)
          → PostgreSQL
```

## Módulos de domínio

| Módulo | Responsabilidade |
|--------|------------------|
| `identity` | Autenticação, sessão, papéis |
| `organization` | Salas, membros, frentes de ensino |
| `communication` | Posts, mural, álbuns/fotos |
| `moderation` | (futuro) Políticas de conteúdo |

## Autenticação e autorização

### Auth.js

- Provider: e-mail institucional (domínio `@institutojef.org.br` ou lista configurável)
- Sessão via cookie HTTP-only
- `getServerSession()` em Route Handlers e Server Components
- Login por credenciais consulta uma conta existente; não há cadastro aberto.
- A senha é armazenada como hash `scrypt` com salt individual. O papel usado para autorização é lido do banco, não inferido do e-mail ou confiado ao formulário.
- O seed cria contas de demonstração apenas fora de produção. Cada instalação define `DEMO_USERS_PASSWORD` e `NEXTAUTH_SECRET` no ambiente local.
- Em produção, contas e papéis devem ser provisionados pelo processo administrativo da escola; o app não oferece redefinição de senha no MVP.
- Operadores provisionam ou redefinem uma conta com `npm run db:provision -- <email> <nome> <student|teacher|admin> [slug-da-sala]`, fornecendo `ACCOUNT_INITIAL_PASSWORD` por um gerenciador de segredos. O seed local não deve ser usado em produção.

### Papéis globais

| Papel | Código | Permissões base |
|-------|--------|-----------------|
| Aluno | `student` | CRUD próprio em escopos permitidos |
| Professor | `teacher` | + fixar mural, moderar sala |
| Coordenação | `admin` | + comunicados globais, moderação ampla |

### Permissões por escopo

Toda operação de leitura/escrita em conteúdo verifica:

1. Usuário autenticado?
2. Conteúdo é `global` → qualquer membro da escola
3. Conteúdo é `classroom` → membro da sala?

### Middleware

```typescript
// Exemplo conceitual
requireAuth()           // 401 se não autenticado
requireRole('teacher')  // 403 se papel insuficiente
requireClassroomMember(classroomId)  // 403 se não é membro
```

O middleware de páginas redireciona visitantes para `/login`. As rotas `/api/*` não são redirecionadas pelo middleware: cada Route Handler deve validar a sessão e responder com JSON `401`/`403` conforme o contrato da API.

## Padrões de Service

- Um service por aggregate: `PostService`, `BulletinService`, `AlbumService`
- Entrada validada com Zod (`packages/shared/validators`)
- Services não conhecem HTTP — retornam dados ou lançam erros de domínio
- Repositories encapsulam queries Prisma

```typescript
// Exemplo
class PostService {
  async create(authorId: string, input: CreatePostInput): Promise<Post> {
    // valida escopo, permissão, persiste
  }
}
```

## Tratamento de erros

Erros de domínio mapeados para HTTP na borda (Route Handler):

| Código HTTP | Quando |
|-------------|--------|
| `400` | Validação de entrada (Zod) |
| `401` | Não autenticado |
| `403` | Sem permissão no escopo/papel |
| `404` | Recurso não encontrado |
| `409` | Conflito (ex: recado já fixado) |
| `500` | Erro interno (log + mensagem genérica) |

Formato de erro: ver [api-contracts.md](./api-contracts.md#error-format)

## Upload de arquivos (álbum)

Fluxo presigned URL:

1. Cliente solicita URL de upload (`POST /api/v1/photos/upload-url`)
2. Backend gera presigned URL do S3/MinIO
3. Cliente faz upload direto ao storage
4. Cliente confirma (`POST /api/v1/albums/:id/photos`) com chave, tipo e tamanho; o backend confere metadados e assinatura binária antes de registrar.

**Limites MVP:**
- Tamanho máximo: 10 MB por foto
- Tipos: `image/jpeg`, `image/png`, `image/webp`
- Quota: 50 fotos por álbum
- URL de upload e URLs de leitura expiram em cinco minutos; o bucket permanece privado

## Estrutura de pastas (apps/web)

```
apps/web/
├── app/api/v1/
│   ├── posts/
│   ├── bulletin/
│   ├── albums/
│   ├── photos/
│   └── classrooms/
├── lib/
│   ├── services/
│   ├── repositories/
│   ├── middleware/
│   └── errors/
└── ...
```

## Testes

- **Unitários:** services com repositories mockados
- **Integração:** Route Handlers com banco de teste (Docker)
- Framework: Vitest

## O que NÃO vai aqui

- Rotas específicas de uma feature → `openspec/changes/*/design.md`
- Schema de tabelas → [database.md](./database.md)
