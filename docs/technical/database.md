# Banco de dados — Germina Talks

Modelo de dados estável da plataforma. Alterações por feature são propostas no `design.md` da change e promovidas aqui após archive.

## Convenções

- **SGBD:** PostgreSQL 15+
- **IDs:** UUID v4 (`gen_random_uuid()`)
- **Timestamps:** `created_at`, `updated_at` em UTC (`timestamptz`)
- **Soft delete:** `deleted_at` em entidades de conteúdo
- **Nomes:** snake_case para tabelas e colunas
- **Migrations:** Prisma Migrate, uma por change quando possível

## Diagrama ER (conceitual)

```
┌──────────┐       ┌───────────────────┐       ┌─────────────┐
│   User   │──────<│ ClassroomMember   │>──────│  Classroom  │
└──────────┘       └───────────────────┘       └─────────────┘
     │                                                │
     │         ┌──────────────────────────────────────┤
     │         │                                      │
     ▼         ▼                                      ▼
┌──────────┐ ┌──────────────┐                  ┌──────────┐
│   Post   │ │ BulletinItem │                  │  Album   │
└──────────┘ └──────────────┘                  └──────────┘
                                                    │
                                                    ▼
                                               ┌──────────┐
                                               │  Photo   │
                                               └──────────┘
```

## Enumerações

```sql
-- Papéis globais do usuário
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');

-- Frente de ensino da sala
CREATE TYPE school_track AS ENUM ('business', 'tech', 'factory');

-- Escopo de conteúdo
CREATE TYPE scope_type AS ENUM ('global', 'classroom');

-- Papel do membro na sala
CREATE TYPE member_role AS ENUM ('student', 'teacher');
```

## Tabelas core

### users

| Coluna | Tipo | Notas |
|--------|------|-------|
| id | UUID PK | |
| email | VARCHAR UNIQUE | E-mail institucional |
| name | VARCHAR | Nome de exibição |
| role | user_role | Papel global |
| avatar_url | VARCHAR NULL | URL da foto de perfil |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### classrooms

| Coluna | Tipo | Notas |
|--------|------|-------|
| id | UUID PK | |
| name | VARCHAR | Ex: "3º ano ADS 2026" |
| slug | VARCHAR UNIQUE | URL-friendly |
| school_track | school_track | Frente de ensino |
| year | INT | Ano letivo |
| created_at | timestamptz | |

### classroom_members

| Coluna | Tipo | Notas |
|--------|------|-------|
| user_id | UUID FK → users | |
| classroom_id | UUID FK → classrooms | |
| role_in_class | member_role | Papel na sala |
| joined_at | timestamptz | |
| PK | (user_id, classroom_id) | |

## Tabelas de comunicação

### posts

| Coluna | Tipo | Notas |
|--------|------|-------|
| id | UUID PK | |
| author_id | UUID FK → users | |
| content | VARCHAR(280) | Texto da publicação |
| scope_type | scope_type | global ou classroom |
| classroom_id | UUID FK NULL | NULL se global |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz NULL | Soft delete |

**Índices:**
- `(classroom_id, created_at DESC)` — feed por sala
- `(scope_type, created_at DESC)` — feed global

### bulletin_items

| Coluna | Tipo | Notas |
|--------|------|-------|
| id | UUID PK | |
| author_id | UUID FK → users | |
| title | VARCHAR(120) | |
| body | TEXT | |
| is_pinned | BOOLEAN DEFAULT false | |
| scope_type | scope_type | |
| classroom_id | UUID FK NULL | |
| expires_at | timestamptz NULL | Expiração opcional |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz NULL | |

**Índices:**
- `(scope_type, classroom_id, is_pinned DESC, created_at DESC)`

### albums

| Coluna | Tipo | Notas |
|--------|------|-------|
| id | UUID PK | |
| title | VARCHAR(120) | |
| description | TEXT NULL | |
| scope_type | scope_type | |
| classroom_id | UUID FK NULL | |
| created_by | UUID FK → users | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### photos

| Coluna | Tipo | Notas |
|--------|------|-------|
| id | UUID PK | |
| album_id | UUID FK → albums | |
| storage_key | VARCHAR | Chave no S3/MinIO |
| uploaded_by | UUID FK → users | |
| caption | VARCHAR(200) NULL | |
| created_at | timestamptz | |

## Escopo transversal

Toda entidade de conteúdo (`posts`, `bulletin_items`, `albums`) possui:

- `scope_type`: `'global'` ou `'classroom'`
- `classroom_id`: `NULL` quando global, FK quando por sala

**Regra:** se `scope_type = 'classroom'`, então `classroom_id` é obrigatório.

## Migrations

```bash
# Criar migration
cd packages/db && npx prisma migrate dev --name add_posts

# Convenção de nome
YYYYMMDD_descricao_curta
```

## Seed de desenvolvimento

O seed cria:
- 3 salas (uma por frente de ensino)
- 5 usuários (2 alunos, 2 professores, 1 coordenação)
- Conteúdo de exemplo em cada módulo

Enquanto o Prisma não estiver no repositório, o equivalente mockado está em [`data/mock/`](../../data/mock/) (JSON por tabela, camelCase no formato da API). Há também a sala extra **Projeto Integrador 2026**, usada nos cenários de múltiplas salas.

## O que vai no design.md da feature

- Novas colunas ou tabelas específicas
- Índices adicionais
- Constraints de negócio novas

Após archive da change, este documento é atualizado.
