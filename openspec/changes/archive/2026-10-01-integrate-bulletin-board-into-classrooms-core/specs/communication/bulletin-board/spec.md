# Delta: Mural de recados

## MODIFIED Requirements

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

### Requirement: Criação autorizada de recados
O sistema SHALL permitir que usuários autenticados criem recados com escopo explícito. Alunos e professores SHALL criar recados somente em salas às quais pertencem. A coordenação SHALL criar recados globais ou de sala. O título SHALL ter no máximo 120 caracteres e título/corpo SHALL ser obrigatórios.

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
