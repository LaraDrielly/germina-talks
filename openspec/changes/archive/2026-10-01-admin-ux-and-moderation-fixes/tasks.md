# Tasks

## 1. Exclusão de Recados (Bulletin)

- [x] 1.1 Criar a rota da API `DELETE /api/v1/bulletin/[id]/route.ts` que valide o papel do usuário (somente `admin`) e chame o serviço para exclusão, verificando seu funcionamento via Postman ou chamada direta.
- [x] 1.2 Atualizar o serviço de recados (`apps/web/lib/services/bulletin.ts`) para incluir o método `delete` e aplicar o filtro `deletedAt: null` nas listagens (se ainda não existir), verificando a correta resposta da listagem.
- [x] 1.3 Modificar a UI do mural (`apps/web/components/features/bulletin/bulletin-board.tsx`) para renderizar um botão de "Excluir" nos recados para administradores, chamando a API de exclusão e atualizando a tela sem a necessidade de recarregar a página (verificando no navegador se o recado some).

## 2. Refinamento de Navegação (Sidebar)

- [x] 2.1 Alterar o arquivo de layout principal (`apps/web/app/(main)/layout.tsx`) para envolver a listagem de turmas (`groupedClassrooms`) na barra lateral com uma verificação que a oculta se `session.user.role === 'admin'`, verificando visualmente no navegador ao logar como coordenação.

## 3. Moderação de Álbuns e Fotos

- [x] 3.1 Atualizar o serviço de álbuns (`apps/web/lib/services/albums.ts`) para bloquear a criação de álbuns para a role `student` e forçar a auto-aprovação de álbuns recém-criados, verificando unitariamente ou via API se os álbuns nascem com status `approved`.
- [x] 3.2 Atualizar as interfaces (ex: `apps/web/components/albums/AlbumsList.tsx` ou equivalentes) para não exibir o botão "Criar Álbum" caso o usuário seja `student`, verificando no navegador com uma conta de aluno.
- [x] 3.3 Atualizar a página de Moderação (`apps/web/app/(main)/moderation/page.tsx`) removendo toda a lógica, busca e exibição de "álbuns pendentes", mantendo a visualização e controle de "fotos pendentes" como a única entidade aprovável, verificando a renderização da tela de moderação.
