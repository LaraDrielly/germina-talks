## Context

Consulte [proposal.md](proposal.md) para a motivação. O Prisma já possui `User`, `Classroom`, `SchoolTrack` e `ScopeType`, mas não tem relação de membros nem entidades de conteúdo. A navegação atual usa salas fixas; os contratos e as rotas desejados estão descritos em `docs/technical/api-contracts.md` e `docs/technical/frontend.md`.

## Goals / Non-Goals

**Goals:**
- Implementar as salas e os escopos descritos nas specs existentes, incluindo as rotas e o controle de acesso.
- Permitir que somente a coordenação gerencie associações de membros, conforme o delta desta change.
- Preservar a separação entre regras de domínio, handlers HTTP e persistência Prisma.

**Non-Goals:**
- Criar papéis customizados ou autorização por frente de ensino.
- Alterar os requisitos existentes de posts, mural e álbuns além de aplicar seus escopos.
- Implementar preview de conteúdo de salas sem associação do usuário.

## Decisions

### Database changes

- Adicionar `MemberRole` (`student`, `teacher`) e `ClassroomMember`, com chaves estrangeiras para `User` e `Classroom`, chave primária composta `(userId, classroomId)` e `joinedAt`. O papel global `admin` continua sendo a autoridade de coordenação; ele não é um papel de membro da sala.
- Relacionar usuários e salas pelo modelo de associação, permitindo listagem por membro e gerenciamento administrativo. A remoção de uma associação remove apenas o vínculo, não o usuário nem a sala.
- Adicionar `Post`, `BulletinItem` e `Album` com `scopeType` obrigatório e `classroomId` opcional. Uma migration SQL deve impor a invariável: `global` exige `classroomId IS NULL`; `classroom` exige `classroomId IS NOT NULL`. Criar índices de leitura por escopo/sala e data conforme `docs/technical/database.md`.
- Manter IDs UUID, nomes Prisma em camelCase mapeados para snake_case no PostgreSQL e migrations geradas por Prisma Migrate.

### API changes

- `GET /api/v1/classrooms`: retornar salas do usuário; para `admin`, retornar todas. `POST /api/v1/classrooms`: criar sala, restrito a `admin`.
- `GET /api/v1/classrooms/:id/members`: listar membros para usuários autorizados a acessar a sala.
- `POST /api/v1/classrooms/:id/members` e `DELETE /api/v1/classrooms/:id/members/:userId`: incluir e remover membros, ambos restritos a `admin`. A inclusão recebe `userId` e papel `student` ou `teacher`; associação duplicada retorna conflito.
- Leituras de posts, mural e álbuns filtram conteúdo global e conteúdo das salas do usuário autenticado. A criação valida o par `scopeType`/`classroomId` e exige associação do autor quando o escopo for de sala. Respostas seguem os envelopes e códigos definidos em `docs/technical/api-contracts.md`.
- Aplicar autenticação na borda HTTP e manter autorização por sala em serviços reutilizáveis, sem confiar apenas no filtro da interface.

### Frontend changes

- Carregar as salas do usuário no layout principal; remover a lista estática. Agrupar por frente de ensino e usar cores de `docs/design-system.md`.
- Expor as rotas `/salas/[id]/feed`, `/mural` e `/fotos`, reutilizando o mesmo modelo de escopo em páginas globais e de sala. Rejeitar acesso a uma sala sem associação (exceto `admin`).
- Exibir `ScopeBadge` em conteúdo e contexto da página. Formulários exigem seleção de escopo; em uma rota de sala, pré-selecionam essa sala.
- Manter textos da interface em português e usar os componentes/tokens existentes do design system.

### Alternatives considered

- Guardar listas de membros diretamente em `Classroom` foi descartado: impede papel por associação e consultas relacionais eficientes.
- Aplicar a proteção apenas no frontend foi descartado: não protege chamadas diretas à API nem evita vazamento de conteúdo.
- Deixar a consistência de escopo somente para validação TypeScript foi descartado: migrations e constraints também protegem gravações fora dos formulários.

## Risks / Trade-offs

- [Consultas de escopo podem vazar conteúdo entre salas] → aplicar o mesmo serviço de autorização nas leituras e escritas e testar usuário membro, não membro e admin.
- [A constraint SQL pode divergir do schema Prisma] → manter ambos na mesma migration e validar schema/migration no CI.
- [Salas sem membros podem ficar inacessíveis a alunos e professores] → permitir gerenciamento somente por admin e criar associação administrativa antes de conceder acesso.

## Migration Plan

1. Adicionar enum, relação de membros, entidades de conteúdo, índices e constraint; gerar e revisar migration Prisma.
2. Criar serviços e endpoints, depois páginas e navegação que dependem deles.
3. Validar migrations em banco limpo e executar testes de domínio, integração e interface.

Não há conteúdo persistido a converter no schema atual. Em caso de rollback antes de publicar conteúdo, reverter a migration e o deploy juntos; depois que houver conteúdo, não remover tabelas ou associações sem exportação/backfill explícito.