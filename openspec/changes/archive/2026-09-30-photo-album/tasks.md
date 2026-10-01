# Tasks

## 1. Database & Schema

- [x] 1.1 Atualizar o `schema.prisma` adicionando o enum `ContentStatus` e os campos `status`, `moderatedById` e `moderatedAt` aos modelos `Album` e `Photo`. Verificar executando `npx prisma format` e gerando uma migração.
- [x] 1.2 Aplicar a migração no banco de dados local e verificar executando o comando do Prisma.

## 2. API Backend

- [x] 2.1 Modificar `POST /api/albums` para definir o status do álbum com base no papel do usuário (PENDING para aluno, APPROVED para prof/admin) e verificar através de testes manuais da rota.
- [x] 2.2 Modificar `POST /api/albums/:id/photos` para definir o status da foto conforme o papel do usuário e verificar o comportamento da inserção.
- [x] 2.3 Atualizar os endpoints `GET /api/albums` e `GET /api/albums/:id/photos` para filtrar por status e permissão, verificando se conteúdos PENDING são ocultados para quem não é autor/moderador.
- [x] 2.4 Criar endpoints `PATCH /api/moderation/albums/:id` e `PATCH /api/moderation/photos/:id` para aprovar/rejeitar e verificar se acesso de aluno retorna erro (403).

## 3. Frontend UI

- [x] 3.1 Atualizar componentes UI (`AlbumCard`, `PhotoTile`) para exibir o badge "Aguardando aprovação" quando status for PENDING para os próprios itens do usuário, verificando renderização.
- [x] 3.2 Criar a página de Inbox de Moderação (ex: `/moderation`) que busca e exibe apenas itens PENDING do escopo do professor/coordenação. Verificar se os itens carregam.
- [x] 3.3 Implementar integração dos botões Aprovar e Rejeitar da UI com os endpoints PATCH, verificando se o item sai da fila de moderação após a ação.
