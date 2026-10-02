# Proposal

## Why

Atualmente o Germina Talks possui alguns débitos de UI (como layout restrito ao centro, falta de responsividade, label de escopo não atualizando) e falhas nas regras de permissão (alunos postando no mural, fotos sem aprovação funcional, coordenação não vendo todas as salas). Esse conjunto de ajustes (polimento e permissões) é essencial para garantir a usabilidade, segurança e o controle adequado do conteúdo pela coordenação e pelos professores, além de reforçar a marca "GerminaTalks".

## What Changes

- **Layout & UI**:
  - Tornar o design responsivo e remover a limitação de largura (ocupar tela inteira).
  - Implementar a funcionalidade do input de busca.
  - Renomear todos os textos "Germina Talks" para "GerminaTalks" (sem espaço).
  - Corrigir a label "Escopo" para atualizar corretamente na aba de sala.
- **Mural de Recados**:
  - Modificar a criação de recados para abrir em um modal.
  - Bloquear alunos de criarem recados (permissão exclusiva para professores e coordenação).
- **Álbum de Fotos**:
  - Exibir a legenda/descrição logo abaixo das fotos.
  - Implementar o fluxo de aprovação de fotos para coordenação e professores (atualmente preso como pendente).
- **Navegação & Auth**:
  - Adicionar um botão de Logout no perfil do usuário, removendo a dependência de deslogar via URL.
  - Ajustar as regras para que a Coordenação tenha acesso de visualização a todas as salas.

## Capabilities

### New Capabilities
- `layout/global-layout`: Define requirements for responsive design, full-screen layout usage, search bar functionality, and brand naming (GerminaTalks).

### Modified Capabilities
- `identity/auth`: Add requirement for explicit logout action in the UI (profile).
- `communication/bulletin-board`: Add role-based restrictions (students cannot post) and specify modal interaction for creation.
- `communication/photo-album`: Specify that photos require descriptions visible in the UI and that teachers/coordinators can approve pending photos.
- `organization/classrooms`: Add permission requirement allowing coordination to view all classrooms.

## Impact

- **UI Components**: Layout principal, Modal de criação de recados, Galeria de fotos, Perfil de usuário.
- **Backend/API**: Endpoints de criação de mural (validação de role), Endpoints de listagem de salas para coordenação, Endpoints de aprovação de fotos.
- **Database**: Nenhuma alteração estrutural prevista (roles e status já existem, precisam ser aplicados na lógica de API e Frontend).

## Non-goals
- Não alterar a estrutura do banco de dados existente ou adicionar novas tabelas.
- Não modificar os perfis de acesso existentes (student, teacher, admin), apenas aplicar regras sobre eles.

## Priority
P1

## References
- [Visão do Projeto](../../../docs/vision.md)
