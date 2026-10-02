# Proposal

**Prioridade**: P2
**Referência**: [docs/vision.md](docs/vision.md)

## Why

Atualmente, ações destrutivas ou definitivas como excluir um recado do mural ou moderar (aprovar/rejeitar) uma foto acontecem imediatamente após um único clique. Isso aumenta a chance de erros operacionais por cliques acidentais, causando perda de informações ou publicação indevida. Um modal de confirmação previne esses acidentes e melhora a segurança e confiabilidade do uso da plataforma por coordenadores e professores.

## What Changes

- Introdução de um componente reutilizável `ConfirmModal` baseado na estrutura visual já existente no Design System.
- O botão de excluir recado passará a abrir esse modal antes de executar a exclusão.
- Os botões de aprovação e rejeição de fotos na aba de moderação passarão a abrir esse modal antes de processar a ação correspondente.

## Capabilities

### New Capabilities
Nenhuma.

### Modified Capabilities
- `communication/bulletin-board`: A exclusão de recados passa a exigir um passo extra de confirmação na interface do usuário.
- `communication/photo-album`: A moderação (aprovar/rejeitar) de itens pendentes passa a exigir um passo extra de confirmação na interface do usuário.

## Impact

- Frontend: novos componentes de modal e alteração nos handlers dos botões nas listagens de moderação e mural.
- Sem impacto em bancos de dados ou APIs, a mudança é estritamente de User Experience (UX) no lado cliente.

## Non-goals

- Implementar confirmação para ações longas como formulários complexos (estas já têm um contexto de "Salvar" e não são ações de 1-clique).
- Refatorar todas as notificações ou modais da aplicação, apenas adicionar a confirmação para as três ações destrutivas citadas.
