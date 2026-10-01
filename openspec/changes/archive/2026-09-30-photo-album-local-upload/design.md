# Design

## Context
A infraestrutura não inclui um Bucket S3 no momento, então decidimos armazenar os uploads localmente, na pasta `public/uploads` da aplicação Next.js.

## Goals / Non-Goals
**Goals:**
- Permitir upload via formulário (multipart/form-data).
- Salvar imagens diretamente no File System do servidor.

**Non-Goals:**
- Resize / otimização de imagem avançada (ficam fora do escopo).
- Migração dos arquivos locais para S3 no futuro (se for feito, será manual).

## API changes
- `POST /api/albums/:id/photos`: passará a consumir o Request usando `request.formData()`.
- Lemos o `File` recebido e usamos `fs.promises.writeFile` (ou a stream do buffer) para salvar o arquivo em `apps/web/public/uploads`.
- A API retorna o caminho gravado (`/uploads/nome-do-arquivo.jpg`).

## Database changes
- Nenhuma alteração de schema, pois o campo `url` String é perfeitamente apto para armazenar caminhos locais como `/uploads/...`.

## Frontend changes
- O componente de UI / form de envio (provavelmente dentro do `/albums/[id]`) deve usar um `<input type="file" accept="image/*" />` e submeter via `FormData` ao invés de enviar `application/json`.

## Decisions
- **Uso do File System Nativo (fs)**: Sem dependências extras para parse de forms, o Next.js lida bem com `request.formData()`. Usaremos Node.js `fs` e `buffer` para salvar a imagem local.

## Risks / Trade-offs
- **Disco:** Arquivos grandes podem encher o disco da VPS/Host.
- **Deploy:** Em plataformas Serverless com Read-only file system (Vercel), uploads para `public/uploads` não funcionam ou se perdem. (Esse risco foi aceito pela preferência atual do host/servidor próprio).
