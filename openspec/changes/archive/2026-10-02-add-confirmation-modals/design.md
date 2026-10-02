# Design

## Context

Ações destrutivas na plataforma (excluir recado, aprovar/rejeitar foto) acontecem sem nenhum obstáculo, o que pode levar a cliques acidentais. Em um ambiente escolar, desfazer essas ações (especialmente exclusão) costuma não ser trivial e gera frustração.

## Goals / Non-Goals

**Goals:**
- Implementar um modal genérico de confirmação reutilizável por todo o frontend.
- Proteger as ações de exclusão de recados (Mural).
- Proteger as ações de aprovação e rejeição de itens (Moderação de Fotos).

**Non-Goals:**
- Criar fluxos de lixeira (soft-delete UI para recuperação).
- Confirmar envio de formulários grandes (estes já são ações intencionais).

## Decisions

**1. Componente ConfirmModal**
- **Decisão:** Criar um componente isolado `<ConfirmModal />` que recebe propriedades `isOpen`, `onClose`, `onConfirm`, `title`, `description`, `confirmText` e `variant` (ex: `danger` ou `primary`).
- **Rationale:** Permite reutilização rápida em qualquer tabela ou lista sem recriar os elementos do Modal repetidas vezes. O componente envolverá ou será disparado por um estado local (`isConfirmOpen`, `confirmAction`).
- **Alternativa:** Usar o `window.confirm()` nativo. Rejeitado porque a experiência de usuário não é imersiva, quebra a identidade visual do Instituto J&F e em alguns navegadores móveis é bloqueado.

**2. Gerenciamento de Estado nas Listagens**
- **Decisão:** Nos componentes que renderizam listas (ex: lista de recados, lista de fotos pendentes), manteremos um estado indicando qual item está selecionado para a ação e qual ação está pendente.
- **Exemplo:** `const [actionPending, setActionPending] = useState<{ type: 'delete' | 'approve' | 'reject', item: string } | null>(null)`
- **Rationale:** Em vez de instanciar dezenas de modais (um para cada item da lista), instanciamos apenas um modal na raiz do componente de listagem e o abrimos apenas quando o estado `actionPending` for preenchido.

## Frontend changes
- **Novo componente**: `apps/web/components/ui/confirm-modal.tsx`.
- **Mural de Recados** (`apps/web/components/features/bulletin/bulletin-board.tsx`): 
  - Adicionar o estado de exclusão pendente.
  - O botão de excluir atualiza o estado em vez de chamar a API direto.
  - O modal chama a API e zera o estado.
- **Moderação** (`apps/web/app/(main)/moderation/page.tsx` ou componente de listagem correspondente):
  - Adicionar o estado de ação pendente (approve/reject).
  - Os botões atualizam o estado.
  - O modal chama a API correspondente e zera o estado.

## API changes
- Nenhuma. O contrato das APIs continua idêntico.

## Database changes
- Nenhuma.

## Risks / Trade-offs

- **[Risk] Aumento do atrito no uso da plataforma** → A confirmação adiciona um passo a mais. **Mitigação:** Vamos utilizar apenas para ações efetivamente destrutivas ou de publicação irreversível, mantendo o uso focado e rápido.
