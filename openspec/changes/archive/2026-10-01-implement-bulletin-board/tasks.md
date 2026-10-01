## Spec

- [x] Definir os cenários obrigatórios de leitura/criação/fixação por papel e escopo.
- [x] Adicionar cenário de consulta isolada do mural por sala.
- [x] Sincronizar a delta spec com `openspec/specs/communication/bulletin-board/spec.md` e validar a spec do mural.

## Database

- [x] Modelar `BulletinItem`, `ClassroomMember`, soft delete e timestamps UTC.
- [x] Adicionar migration complementar compatível com a migration inicial já aplicada.
- [x] Atualizar seed de vínculos e contas locais com hashes de senha.
- [x] Adicionar comando administrativo para provisionar conta, papel e vínculo opcional de sala.

## Backend

- [x] Validar sessão e obter identidade/papel do registro persistido.
- [x] Implementar leitura e criação com autorização por sala, exclusão de expirados/removidos e ordenação estável.
- [x] Implementar fixação autorizada e respostas JSON padronizadas.
- [x] Validar filtros e payloads com Zod compartilhado.
- [x] Cobrir hash de senha e autorização das rotas com testes.

## Frontend

- [x] Exibir o mural global e adicionar mural filtrado por sala.
- [x] Tornar a listagem de salas dinâmica e vinculá-la às respectivas páginas do mural.
- [x] Aplicar cores da frente de ensino e estados de carregamento/erro acessíveis.

## Docs

- [x] Alinhar contrato da API, documentação de banco, autenticação e execução local.
