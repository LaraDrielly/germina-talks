# Proposal

**Prioridade:** P1 (feed) + P2 (álbuns) | **Escopo:** global + sala

Visão do produto: [docs/vision.md](../../../docs/vision.md).

## Why

Feed e fotos ainda exibem dados de demonstração, então alunos não conseguem compartilhar publicações reais nem consultar momentos da comunidade. Implementar os comportamentos MVP restantes fecha o fluxo de conteúdo que a visão do Germina Talks descreve.

## What Changes

- Persistir publicações curtas, consultar por escopo, paginar e permitir exclusão pelo autor.
- Persistir álbuns e fotos, fazer upload seguro para storage compatível com S3/MinIO e exibir miniaturas responsivas.
- Aplicar autorização por sessão, papel e vínculo de sala em todas as operações.
- Substituir telas estáticas de feed, fotos e salas por conteúdo persistido e navegável.
- Resolver as perguntas da spec: exclusão de post é limitada ao autor; criar álbum é permitido a professor/coordenação; fotos ficam visíveis após upload no MVP.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `communication/posts`: implementar publicação, leitura por escopo, paginação e exclusão própria.
- `communication/photo-album`: implementar criação/listagem de álbuns e upload/listagem de fotos com autorização.

## Impact

- Prisma/PostgreSQL: modelos `Post`, `Album` e `Photo` com relações, escopo e soft delete.
- API Next.js: rotas de feed, posts, álbuns, upload de URL assinada e fotos.
- Frontend: páginas `/feed`, `/fotos`, detalhe do álbum e lista dinâmica de salas.
- Storage S3 compatível: configuração de MinIO local e variáveis de ambiente para storage remoto.
- Dependências: cliente AWS S3 e geração de URLs pré-assinadas.

## Non-goals

- Curtidas, comentários, edição de publicações, vídeo, moderação prévia e notificações.
- Substituir o Classroom ou criar um aplicativo mobile.
