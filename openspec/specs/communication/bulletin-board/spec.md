# Mural de recados

**Prioridade:** P1 | **Escopo:** global + sala

## Purpose

O mural reúne avisos institucionais e recados das turmas em um espaço organizado, com destaque para informações importantes e prazo de validade quando necessário.

## Personas

- **Professor** — publica e fixa recados nas salas em que leciona.
- **Coordenação** — publica comunicados globais ou por sala e pode fixá-los.
- **Aluno** — lê recados globais e das salas de que participa e pode publicar recados não fixados nessas salas.

## Scope

global + classroom

## Requirements

### Requirement: Persistência e leitura por escopo
O sistema SHALL persistir cada recado com título de até 120 caracteres, corpo, autor, escopo global ou de sala, estado de fixação e data de expiração opcional. Recados de sala SHALL estar acessíveis apenas a membros daquela sala. Recados globais SHALL estar acessíveis a qualquer usuário autenticado.

#### Scenario: Membro consulta mural
- **GIVEN** um usuário autenticado e recados globais e das salas em que participa
- **WHEN** acessa o mural
- **THEN** vê recados não expirados dos escopos aos quais tem acesso

#### Scenario: Usuário sem vínculo consulta sala
- **GIVEN** um usuário autenticado sem vínculo com uma sala
- **WHEN** consulta recados daquela sala
- **THEN** não recebe os recados da sala

#### Scenario: Recado expirado ou removido
- **GIVEN** um recado com expiração anterior ao momento atual
- **WHEN** um usuário consulta o mural
- **THEN** o recado não é exibido

### Requirement: Criação e exclusão autorizada de recados
O sistema SHALL permitir que usuários com perfil de professor ou coordenação criem recados com escopo explícito através de um componente do tipo Modal (apresentado após o clique em "Adicionar recado"). Professores SHALL criar recados somente em salas às quais pertencem. A coordenação SHALL criar recados globais ou de sala. Alunos SHALL NÃO ter permissão para criar recados no mural. O título SHALL ter no máximo 120 caracteres e título/corpo SHALL ser obrigatórios. A coordenação (admin) SHALL ter o poder de excluir logicamente (soft delete) qualquer recado, removendo-o da listagem de todos os usuários. A interface SHALL solicitar confirmação explícita através de um modal antes de efetivar a exclusão.

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

#### Scenario: Admin exclui um recado
- **GIVEN** um usuário da coordenação e um recado existente
- **WHEN** clica para excluir o recado e confirma a ação no modal
- **THEN** o recado é marcado como deletado e não é mais retornado nas listagens do mural

### Requirement: Fixação autorizada
O sistema SHALL permitir que professores fixem recados em salas das quais são membros e que a coordenação fixe recados em qualquer escopo. Alunos SHALL não ter a ação de fixar disponível. Recados fixados SHALL aparecer antes dos demais.

#### Scenario: Professor fixa recado da sala
- **GIVEN** um professor membro de uma sala e um recado dessa sala
- **WHEN** fixa o recado
- **THEN** o recado passa a aparecer no topo do mural da sala

#### Scenario: Aluno tenta fixar recado
- **GIVEN** um aluno autenticado
- **WHEN** tenta fixar um recado
- **THEN** o sistema nega a ação

#### Scenario: Coordenação fixa recado global ou de sala
- **GIVEN** um usuário da coordenação e um recado válido
- **WHEN** fixa o recado em qualquer escopo
- **THEN** o recado aparece no topo do mural correspondente

#### Scenario: Ordenação do mural
- **GIVEN** recados fixados e não fixados não expirados
- **WHEN** um membro consulta o mural
- **THEN** os fixados aparecem primeiro e cada grupo é ordenado do mais recente para o mais antigo

### Requirement: Apresentação do mural
A interface SHALL diferenciar recados de publicações, identificar o escopo, indicar visualmente recados fixados e exibir a data de expiração quando existir. Quando não houver recados acessíveis, SHALL apresentar um estado vazio amigável em português.

#### Scenario: Recado global identificado
- **GIVEN** um recado global
- **WHEN** é exibido no mural
- **THEN** mostra o badge "Toda a escola"

#### Scenario: Mural sem recados
- **GIVEN** que não existem recados acessíveis e válidos
- **WHEN** o usuário abre o mural
- **THEN** vê uma mensagem acolhedora explicando que ainda não há recados

### Requirement: Consulta isolada do mural por sala
O sistema SHALL permitir que um membro consulte o mural de uma sala específica sem misturar recados de outras salas ou do escopo global. A coordenação SHALL poder consultar qualquer sala.

#### Scenario: Membro abre mural da própria sala
- **GIVEN** um usuário vinculado a uma sala com recados
- **WHEN** abre o mural daquela sala
- **THEN** vê apenas os recados acessíveis daquela sala

#### Scenario: Usuário sem vínculo tenta abrir mural de sala
- **GIVEN** um usuário sem vínculo com uma sala
- **WHEN** tenta abrir o mural específico da sala
- **THEN** não recebe acesso aos recados daquela sala

## Design references

- [docs/design-system.md#BulletinPin](../../../../docs/design-system.md)
- [docs/design-system.md#EmptyState](../../../../docs/design-system.md)
