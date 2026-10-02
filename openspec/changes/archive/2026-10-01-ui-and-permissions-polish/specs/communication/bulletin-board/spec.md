# Spec Delta

## MODIFIED Requirements

### Requirement: Criação autorizada de recados
O sistema SHALL permitir que usuários com perfil de professor ou coordenação criem recados com escopo explícito através de um componente do tipo Modal (apresentado após o clique em "Adicionar recado"). Professores SHALL criar recados somente em salas às quais pertencem. A coordenação SHALL criar recados globais ou de sala. Alunos SHALL NÃO ter permissão para criar recados no mural. O título SHALL ter no máximo 120 caracteres e título/corpo SHALL ser obrigatórios.

#### Scenario: Professor cria recado de sala
- **GIVEN** um professor membro de uma sala
- **WHEN** cria um recado não fixado via modal nessa sala
- **THEN** o recado é salvo e fica visível aos membros da sala

#### Scenario: Aluno tenta criar recado de sala
- **GIVEN** um aluno membro de uma sala
- **WHEN** tenta criar um recado
- **THEN** a ação é negada (o botão nem deve estar disponível na interface)

#### Scenario: Criação sem escopo ou sala
- **GIVEN** um usuário autorizado
- **WHEN** envia um recado com escopo de sala sem identificar uma sala
- **THEN** a entrada é rejeitada

#### Scenario: Coordenação cria recado
- **GIVEN** um usuário da coordenação
- **WHEN** submete o modal de novo recado
- **THEN** o recado é publicado no escopo correspondente
