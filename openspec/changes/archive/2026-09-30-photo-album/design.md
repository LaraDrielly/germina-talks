# Design

## Context

O sistema de álbum de fotos permite que alunos enviem fotos e criem álbuns. Para garantir um ambiente escolar seguro e alinhado com o Instituto J&F, introduzimos um fluxo de moderação. Este documento detalha as mudanças técnicas para suportar esse fluxo manual.

## Goals / Non-Goals

**Goals:**
- Implementar campos de status e moderação no banco de dados.
- Modificar queries de API para omitir itens pendentes/rejeitados do público geral.
- Criar interface para moderadores (professores/coordenação) revisarem e aprovarem/rejeitarem itens.
- Exibir feedback visual de estado pendente para o autor do conteúdo.

**Non-Goals:**
- Moderação automatizada baseada em IA ou filtros de imagem.

## API changes

- `POST /api/albums`: Modificar para definir `status = PENDING` se criado por aluno; `APPROVED` se por professor/coordenação.
- `POST /api/albums/:id/photos`: Definir `status = PENDING` para fotos de alunos; `APPROVED` para staff.
- `GET /api/albums` e `GET /api/albums/:id/photos`: Ajustar query para retornar apenas `APPROVED`, exceto para os próprios autores (que veem seus itens `PENDING`/`REJECTED`) e moderadores.
- `PATCH /api/moderation/albums/:id` e `PATCH /api/moderation/photos/:id`: Novos endpoints para moderadores (role de Professor ou Coordenação) definirem o `status` (APPROVED ou REJECTED) e registrarem `moderatedBy` e `moderatedAt`.

## Database changes

Adicionar ao modelo `Album` no Prisma:
- `status`: Enum `ContentStatus` (PENDING, APPROVED, REJECTED)
- `moderatedById`: String? (relation to User)
- `moderatedAt`: DateTime?

Adicionar ao modelo `Photo` no Prisma:
- `status`: Enum `ContentStatus` (PENDING, APPROVED, REJECTED)
- `moderatedById`: String? (relation to User)
- `moderatedAt`: DateTime?

## Frontend changes

- **PhotoTile / AlbumCard**: Adicionar badge visual (cor secundária ou de warning) indicando "Aguardando aprovação" se o item pertencer ao usuário logado e estiver PENDING.
- **Painel de Moderação**: Criar página ou aba para professores/coordenação listando todos os itens PENDING do seu escopo, com botões para Aprovar e Rejeitar (usando cores do Design System, ex: Green para aprovar).

## Decisions

- **Status Enum**: Optou-se por um Enum em vez de booleanos para permitir evolução futura (ex: arquivado).
- **Caixa de Entrada Unificada**: Para evitar atrito, a moderação deve centralizar tanto álbuns quanto fotos em uma mesma área para o professor/coordenação.

## Risks / Trade-offs

- Carga de trabalho de moderação manual pode ser alta após grandes eventos; talvez seja necessário implementar "aprovar todos" no frontend num segundo momento se isso se provar um gargalo.
