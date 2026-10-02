# Design

## Context

See proposal.md. O layout atual mostra as salas na sidebar esquerda, poluindo a visualização para os admins que têm acesso a todas. No mural, faltam ações de deleção para os admins. No álbum de fotos, o fluxo está confuso pois os alunos podem criar álbuns, gerando duplicação na moderação (álbum + fotos). Vamos remover a capacidade de criação de álbuns para os alunos e simplificar a moderação apenas para fotos, enquanto melhoramos a UX administrativa.

## Goals / Non-Goals

**Goals:**
- Implementar soft delete para `BulletinItem`.
- Esconder a renderização da lista de salas na barra lateral do `apps/web/app/(main)/layout.tsx` para a role `admin`.
- Proibir criação de álbuns no backend (`POST /api/v1/albums`) para a role `student` e ocultar o botão no frontend.
- Omitir o estado e aprovação de "álbuns pendentes" na view de moderação, pois eles deixarão de existir.

**Non-Goals:**
- Hard delete de recados no banco.
- Alterar as permissões de moderar fotos.

## API changes

- **DELETE /api/v1/bulletin/[id]**:
  - Exige `session.user.role === 'admin'`.
  - Executa um `update` no Prisma definindo `deletedAt = new Date()`.

- **POST /api/v1/albums**:
  - Lançará erro `403 FORBIDDEN` se `actor.role === 'student'`, independente do escopo.

## Database changes

- Nenhuma alteração estrutural no banco de dados (schema). O campo `deletedAt` já existe em `BulletinItem`. O filtro nas consultas do Prisma deve checar `deletedAt: null`. (Nota: O código base geralmente não exibe itens onde `deletedAt` está preenchido se ele tiver a cláusula ativa no list, garantir que o Service aplique `deletedAt: null` no `where`).

## Frontend changes

- **apps/web/app/(main)/layout.tsx**: Envolver o loop de `groupedClassrooms` na sidebar em `if (session.user.role !== 'admin')`.
- **apps/web/components/features/bulletin/bulletin-board.tsx**: Adicionar botão de "Excluir" no recado apenas se `role === 'admin'`. Ao clicar, disparar requisição DELETE e atualizar o estado/lista.
- **apps/web/components/albums/AlbumsList.tsx** (ou similar): Adicionar checagem `role !== 'student'` em volta do botão "Criar Álbum".
- **apps/web/app/(main)/moderation/page.tsx**: Remover ou esconder a renderização da seção de álbuns pendentes (`albums`), passando a exibir exclusivamente a grade de `photos`.

## Risks / Trade-offs

- [Risk] Exclusão acidental de recado importante -> [Mitigation] Soft delete permite recuperação via banco de dados caso haja engano severo, e podemos colocar um `confirm` no frontend antes de disparar a deleção.
- [Risk] Ao bloquear alunos de criarem álbuns, eles não terão onde postar fotos se o professor não tiver criado um álbum antes -> [Mitigation] A educação dos professores para criarem álbuns antecipadamente torna a plataforma mais organizada. Em contrapartida, evita o caos de milhares de álbuns por alunos.

## Open Questions

- Nenhuma pendente que impacte a implementação.
