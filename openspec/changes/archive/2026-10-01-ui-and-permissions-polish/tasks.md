# Tasks

## 1. Ajustes Globais de Layout e Busca

- [x] 1.1 Remover limitação de largura (max-width) em `apps/web/app/layout.tsx` e `apps/web/app/(main)/layout.tsx` para ocupar tela inteira, verificando no navegador se o conteúdo se expande fluidamente.
- [x] 1.2 Implementar breakpoints do Tailwind (`md:`, `lg:`) para garantir responsividade no feed e nos murais, verificando layout simulado em dispositivo móvel.
- [x] 1.3 Renomear todos os textos "Germina Talks" para "GerminaTalks" na interface (header, titles, modais), verificando a ausência do termo antigo no UI.
- [x] 1.4 Adicionar funcionalidade simulada ou real ao componente de Busca (`SearchInput`), verificando se submeter o form altera a URL ou filtra itens na tela.

## 2. Ajustes de Autenticação e Navegação (Coordenação)

- [x] 2.1 Criar botão ou ação de Logout (Sair) no painel de Perfil, verificando se aciona `signOut` do Auth.js e retorna para o `/login`.
- [x] 2.2 Corrigir o endpoint e o repository (`GET /api/v1/classrooms`) para retornar todas as salas quando o `session.user.role === 'admin'`, verificando a resposta da API com um usuário logado como coordenação.
- [x] 2.3 Corrigir a label "Escopo" no frontend ao navegar entre abas de sala, verificando se ela muda conforme a sala ativa.

## 3. Mural de Recados: Modal e Roles

- [x] 3.1 Validar a role no endpoint `POST /api/v1/bulletin` para rejeitar alunos (`403 Forbidden`), verificando com testes via postman ou unitários.
- [x] 3.2 Ocultar o botão "Adicionar recado" na interface do mural para usuários com role `student`, verificando no navegador logado como aluno.
- [x] 3.3 Converter o formulário in-line de criação de recado no mural para um Modal (`docs/design-system.md#Modal`), verificando a abertura correta do popup ao clicar no botão de criar.

## 4. Álbum de Fotos: Legendas e Moderação

- [x] 4.1 Modificar o frontend (no componente que consome `PhotoTile`) para renderizar a `caption` (legenda) imediatamente abaixo de cada foto na grade, verificando visualmente no navegador se a descrição aparece.
- [x] 4.2 Criar endpoint/action de aprovação (ex: `PUT /api/v1/moderation/photos/[id]`) que aceite mudança de `status` para `approved` se o autor da requisição for `admin` ou professor da sala, verificando a validação via teste ou chamada de rede.
- [x] 4.3 Exibir botões de aprovação/rejeição nas fotos pendentes listadas na UI caso o usuário seja da moderação, verificando o fluxo ponta a ponta (ver pendente -> aprovar -> aparece na lista pública).
