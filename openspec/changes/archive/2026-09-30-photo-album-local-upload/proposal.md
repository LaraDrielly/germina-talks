# Proposal

Prioridade: P2

## Why

Atualmente, o sistema espera utilizar um storage externo (como um Bucket S3 ou MinIO) para o upload de fotos (conforme definido na visão original em [docs/vision.md](file:///C:/Users/cintyachristovam-ieg/OneDrive%20-%20Instituto%20Germinare/Documentos/trabalhodaniel/germina-talks/docs/vision.md)). No entanto, para simplificar a implantação inicial e permitir rodar o sistema em um servidor próprio sem depender de serviços externos (e seus custos/setups associados), precisamos de uma alternativa local. Essa mudança adapta a arquitetura para aceitar o upload de arquivos diretamente no servidor, salvando-os na pasta local do Next.js.

## What Changes

- Modificar a rota `POST /api/albums/:id/photos` para aceitar `multipart/form-data` contendo a imagem física, ao invés de apenas receber a URL no corpo em JSON.
- A API irá ler o arquivo recebido, salvá-lo no sistema de arquivos em `apps/web/public/uploads`, e registrar no banco de dados o caminho relativo (`/uploads/arquivo.jpg`).
- Alterar o componente de UI de formulário de upload de fotos para enviar `FormData` através de uma tag `<input type="file" />`.
- A estrutura do banco de dados (Prisma) permanece a mesma, pois a coluna `url` já é capaz de armazenar caminhos relativos.

## Capabilities

### New Capabilities
Nenhuma.

### Modified Capabilities
- `communication/photo-album`: Modificar o requisito de "Storage externo via presigned URL" para upload local de arquivo via `multipart/form-data`.

## Impact

- **API:** O endpoint de upload muda o contrato para aceitar multipart/form-data e processar binários.
- **Frontend:** Formulário de envio de foto alterado.
- **Servidor:** Necessidade de garantir permissão de escrita e persistência na pasta `public/uploads` do container/servidor (incompatível com deployments read-only como Vercel caso o armazenamento precise ser durável).

## Non-goals

- Não é objetivo desta change criar um sistema completo de gerenciamento de disco, limpeza automática ou redimensionamento de imagens pesadas no backend (ainda). O foco é habilitar o upload local simples como MVP.
- Não vamos alterar o banco de dados (o campo `url` String é suficiente).
