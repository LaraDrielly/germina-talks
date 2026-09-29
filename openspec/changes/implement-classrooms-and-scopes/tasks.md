## 1. Spec

- [x] 1.1 Validar `implement-classrooms-and-scopes` com `openspec validate implement-classrooms-and-scopes --strict` e corrigir qualquer erro nos artefatos.

## 2. Database

- [x] 2.1 Adicionar `MemberRole`, `ClassroomMember` e relações inversas em `User` e `Classroom`; verificar com `prisma validate`.
- [x] 2.2 Modelar posts, recados e álbuns com `scopeType` e `classroomId`; criar índices e constraint SQL da regra global/sala e validar schema e migration.
- [x] 2.3 Gerar e aplicar a migration em PostgreSQL limpo; verificar criação de tabelas, chaves, índices e constraint.
- [x] 2.4 Atualizar seed com salas das três frentes e associações aluno/professor; verificar execução repetida de `db:seed` sem duplicatas.

## 3. Backend

- [x] 3.1 Implementar serviços de listagem e criação de salas com regras de membro/admin; cobrir os casos com testes unitários.
- [x] 3.2 Implementar `GET/POST /api/v1/classrooms` e testar listagem por membro, listagem global e criação restrita a admin.
- [x] 3.3 Implementar leitura e gerenciamento administrativo de membros; testar inclusão, remoção, duplicidade e negação para não-admin.
- [x] 3.4 Implementar validação e filtros reutilizáveis de escopo; testar conteúdo global, conteúdo da sala para membro e bloqueio de não-membro.
- [x] 3.5 Implementar listagem e criação de posts com escopo; testar validação de `scopeType`/`classroomId` e autorização.
- [x] 3.6 Implementar listagem e criação de recados com escopo; testar validação de `scopeType`/`classroomId` e autorização.
- [x] 3.7 Implementar listagem e criação de álbuns com escopo; testar validação de `scopeType`/`classroomId` e autorização.
- [ ] 3.8 Garantir que handlers das rotas de sala neguem acesso a não-membros e permitam coordenação; cobrir feed, mural e fotos com testes.

## 4. Frontend

- [ ] 4.1 Trocar salas fixas por dados do usuário, agrupados por frente e com cores do design system; verificar estados com e sem salas.
- [ ] 4.2 Implementar páginas `/salas/[id]/feed`, `/mural` e `/fotos` com checagem de associação; verificar navegação e acesso negado.
- [ ] 4.3 Implementar `ScopeBadge` global e por sala com cores corretas; cobrir os estados com teste de componente.
- [ ] 4.4 Incluir seleção explícita de escopo nos formulários de post, recado e álbum, usando a sala atual como padrão; testar seleção e validação.

## 5. Docs

- [ ] 5.1 Atualizar `docs/technical/database.md` e `docs/technical/api-contracts.md` para refletir o schema e endpoints implementados; conferir nomes e contratos contra o código.
- [ ] 5.2 Executar lint, typecheck, testes e build do workspace; registrar os comandos aprovados e corrigir regressões desta change.