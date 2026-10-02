# Spec Delta

## MODIFIED Requirements

### Requirement: Membros vinculados às salas
O sistema MUST vincular usuários às salas como membros e MUST restringir a listagem: alunos e professores veem apenas salas das quais são membros; coordenação vê todas as salas independentemente de associação explícita.

#### Scenario: Listagem de salas
- **WHEN** um usuário autenticado acessa a listagem de salas
- **THEN** vê apenas salas das quais é membro (aluno/professor) ou todas (coordenação)

#### Scenario: Coordenação acessa qualquer sala
- **WHEN** a coordenação tenta acessar os detalhes ou rotas de uma sala
- **THEN** o sistema concede o acesso mesmo que o usuário não seja explicitamente membro da sala

#### Scenario: Aluno vê suas salas na sidebar
- **WHEN** um aluno membro de duas salas acessa a plataforma
- **THEN** ambas as salas aparecem na navegação lateral
