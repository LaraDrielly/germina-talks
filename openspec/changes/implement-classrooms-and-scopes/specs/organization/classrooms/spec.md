## ADDED Requirements

### Requirement: Coordenação gerencia membros das salas
A coordenação MUST conseguir associar alunos e professores a uma sala e remover membros existentes. Cada associação MUST registrar se o membro participa como aluno ou professor. Usuários sem papel global de coordenação MUST ser impedidos de alterar essas associações.

#### Scenario: Coordenação adiciona membro à sala
- **WHEN** um usuário de coordenação associa um aluno ou professor a uma sala com seu papel na sala
- **THEN** o usuário passa a integrar a sala com o papel informado

#### Scenario: Coordenação remove membro da sala
- **WHEN** um usuário de coordenação remove um membro de uma sala
- **THEN** a associação do usuário com a sala deixa de existir

#### Scenario: Usuário sem papel de coordenação tenta alterar membros
- **WHEN** um aluno ou professor tenta adicionar ou remover um membro de uma sala
- **THEN** a alteração é negada e as associações permanecem inalteradas