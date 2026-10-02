# Proposal

## Why

A navegação para a coordenação (admin) está poluída, listando todas as salas na sidebar. Além disso, o fluxo de moderação de álbuns está confuso, pois alunos podem criar álbuns que ficam pendentes, gerando retrabalho na moderação (aprovar álbum e depois foto). No mural, a coordenação não tem como excluir recados postados, tornando a manutenção do painel difícil. Precisamos limpar a interface administrativa e simplificar o fluxo de moderação para que os alunos apenas postem fotos em álbuns criados por coordenadores e professores.

## What Changes

- Adicionar funcionalidade de exclusão lógica (soft delete) para recados (`BulletinItem`) na interface do painel e na API para usuários `admin`.
- Esconder a lista de salas na barra lateral (sidebar) apenas para a role `admin`, garantindo uma navegação mais limpa e focada nas abas principais.
- Restringir a criação de álbuns (`Album`) para que apenas `admin` e `teacher` possam criar, garantindo auto-aprovação na criação.
- Atualizar a UI do mural para ocultar a criação de álbum para `student`.
- Otimizar o fluxo de moderação (tanto a API quanto a interface) focando **apenas** na aprovação/rejeição de fotos, já que os álbuns estarão sempre previamente aprovados ao serem criados.

## Capabilities

### Modified Capabilities
- `communication/bulletin-board`: Adicionar a restrição de que admins podem deletar recados.
- `communication/photo-album`: Mudar as restrições para não permitir mais que alunos criem álbuns e auto-aprovar todos os álbuns novos (criados por admins/professores). Moderação foca apenas nas fotos.

## Impact

- `apps/web/app/(main)/layout.tsx`: Sidebar será ajustada para ocultar listagem de turmas para `admin`.
- `apps/web/components/features/bulletin/bulletin-board.tsx`: Receberá o botão e integração da action de exclusão.
- `apps/web/lib/services/bulletin.ts`: Atualizado para receber requisição de `DELETE` em um recado por um `admin`.
- `apps/web/app/api/v1/bulletin/[id]/route.ts`: Criação do endpoint de `DELETE`.
- `apps/web/lib/services/albums.ts`: Impedir a role `student` de criar álbuns.
- `apps/web/components/albums/AlbumsList.tsx` (ou componente similar): Esconder botão de criação de álbum para `student`.
- Fluxo na UI `apps/web/app/(main)/moderation/page.tsx`: Limpar código relacionado a álbuns na moderação (pois só teremos fotos).

## Prioridade
P1

## Non-goals
- Não faremos exclusão definitiva (hard delete) em cascata no banco de dados. Os itens apenas receberão `deletedAt`.
- Não mudaremos outras permissões de curtir ou comentar nessas páginas no momento.

## Visão
Alinha-se a [docs/vision.md](file:///c:/Users/cintyachristovam-ieg/OneDrive - Instituto Germinare/Documentos/trabalhodaniel3/germina-talks/docs/vision.md) por simplificar e organizar o espaço de comunicação da escola, dando mais poder aos professores e coordenação.
