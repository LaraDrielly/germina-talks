# Proposal: Photo Album Moderation

**Priority**: P2

## Why

Atualmente a especificação do Álbum de Fotos (alinhada à [Visão](docs/vision.md) do projeto) não cobria o fluxo de moderação de álbuns criados por alunos ou fotos submetidas. Para garantir a segurança e controle do ambiente escolar, precisamos de um fluxo de moderação em dois níveis: aprovação de álbuns e aprovação de fotos.

## What Changes

- Adição de fluxo de moderação para álbuns criados por alunos (pendente aprovação da coordenação).
- Adição de fluxo de moderação para fotos enviadas por alunos (pendente aprovação de professor/coordenação).
- Criação de interface para os moderadores (caixa de entrada de moderação) visualizarem itens pendentes.
- Status e feedback visual ("Aguardando aprovação") para alunos.

## Capabilities

### New Capabilities

(None)

### Modified Capabilities

- `communication/photo-album`: Adição das regras de status de aprovação (PENDING, APPROVED, REJECTED) para álbuns e fotos.

## Non-goals

- Automação de moderação por IA (neste momento será 100% manual).
- Implementação de denúncias pós-publicação (fora do escopo deste change inicial, será feito depois caso necessário).

## Impact

- **Database**: Novos campos de `status` e `moderatedBy` nos modelos de Album e Photo.
- **API/Frontend**: Nova rota/tela de moderação e adequação das queries para omitir conteúdos pendentes de usuários sem permissão.
