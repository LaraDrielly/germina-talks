# Tasks

## 1. Componente Base

- [x] 1.1 Criar o componente genérico `<ConfirmModal />` em `apps/web/components/ui/confirm-modal.tsx` que suporte as props de título, descrição, ação, variante (ex: danger) e renderize os botões de Cancelar/Confirmar, verificando a sua renderização visual em uma página de testes ou via Storybook.

## 2. Mural de Recados

- [x] 2.1 Atualizar `apps/web/components/features/bulletin/bulletin-board.tsx` adicionando o estado local para controle do modal e o componente `<ConfirmModal />`.
- [x] 2.2 Modificar o handler do botão de lixeira no mural para apenas abrir o modal com o ID do recado selecionado, garantindo que a chamada de API de deleção só ocorra no clique de confirmação do modal, verificando a exclusão bem-sucedida pelo navegador.

## 3. Moderação de Fotos

- [x] 3.1 Atualizar `apps/web/app/(main)/moderation/page.tsx` (ou o componente específico de listagem de aprovação caso exista em `components/`) adicionando o estado local e o componente `<ConfirmModal />`.
- [x] 3.2 Modificar os botões de Aprovar e Rejeitar para abrir o modal com mensagens distintas (aprovação vs exclusão) e condicionar a chamada à API apenas após a confirmação no modal, verificando o fluxo completo pelo navegador com uma conta da coordenação.
