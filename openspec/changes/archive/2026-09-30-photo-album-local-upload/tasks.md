# Tasks

## 1. Configuração e Backend

- [x] 1.1 Garantir que o diretório `apps/web/public/uploads` exista (adicionar no `.gitignore` e colocar um `.keep` se necessário) e verificar se está acessível.
- [x] 1.2 Modificar a rota `POST /api/albums/[id]/photos/route.ts` para usar `await request.formData()`, ler o arquivo recebido (campo de imagem) e salvá-lo em `apps/web/public/uploads` usando a API `fs/promises`. Verificar executando um POST via Postman ou script e garantindo que o arquivo é gravado no disco e o caminho `/uploads/...` é salvo no banco.

## 2. Frontend UI

- [x] 2.1 Atualizar o componente de UI responsável pelo upload de fotos no álbum para enviar um objeto `FormData` via requisição POST contendo a imagem física, ao invés do atual payload JSON (`{ url: "..." }`). Verificar simulando um upload pela interface e observando a foto aparecer na listagem do álbum (bem como no sistema de arquivos local).
