# Spec Delta

## MODIFIED Requirements

### Requirement: Criação autorizada de recados e exclusão
O sistema SHALL permitir que usuários autenticados criem recados com escopo explícito. Alunos e professores SHALL criar recados somente em salas às quais pertencem. A coordenação SHALL criar recados globais ou de sala. O título SHALL ter no máximo 120 caracteres e título/corpo SHALL ser obrigatórios. A coordenação (admin) SHALL ter o poder de excluir logicamente (soft delete) qualquer recado, removendo-o da listagem de todos os usuários.

#### Scenario: Aluno cria recado de sala
- **GIVEN** um aluno membro de uma sala
- **WHEN** cria um recado não fixado nessa sala
- **THEN** o recado é salvo e fica visível aos membros da sala

#### Scenario: Aluno tenta criar recado global
- **GIVEN** um aluno autenticado
- **WHEN** tenta criar recado global
- **THEN** a ação é negada

#### Scenario: Criação sem escopo ou sala
- **GIVEN** um usuário autenticado
- **WHEN** envia um recado com escopo de sala sem identificar uma sala
- **THEN** a entrada é rejeitada

#### Scenario: Admin exclui um recado
- **GIVEN** um usuário da coordenação e um recado existente
- **WHEN** exclui o recado do mural
- **THEN** o recado é marcado como deletado e não é mais retornado nas listagens do mural
