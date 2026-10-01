# Spec Delta: Publicações

## MODIFIED Requirements

### Requirement: Publicação no escopo permitido
O sistema MUST permitir que usuários autenticados publiquem mensagens de 1 a 280 caracteres no escopo global ou em uma sala à qual tenham acesso.

#### Scenario: Aluno publica em sala
- **WHEN** um aluno membro publica uma mensagem válida na sala
- **THEN** ela aparece no feed dessa sala com autor, papel e horário

#### Scenario: Usuário sem vínculo tenta publicar em sala
- **WHEN** um usuário autenticado sem vínculo envia uma publicação para uma sala
- **THEN** o sistema rejeita a operação sem persistir a publicação

#### Scenario: Texto fora do limite
- **WHEN** o texto está vazio ou excede 280 caracteres
- **THEN** o sistema rejeita a publicação e informa a validação

### Requirement: Leitura cronológica e paginada do feed
O sistema MUST listar publicações acessíveis em ordem decrescente de criação com paginação por cursor de até 20 itens.

#### Scenario: Feed global
- **WHEN** um usuário autenticado acessa o feed global
- **THEN** vê publicações globais recentes sem publicações de salas às quais não pertence

#### Scenario: Feed da sala
- **WHEN** um membro acessa o feed de uma sala
- **THEN** vê somente publicações dessa sala em ordem da mais recente para a mais antiga

#### Scenario: Próxima página
- **WHEN** o cliente envia o cursor da página anterior
- **THEN** o sistema retorna até 20 itens seguintes sem repetir publicações

#### Scenario: Carregamento ao chegar ao fim
- **WHEN** o usuário chega ao final de uma página do feed
- **THEN** a interface carrega automaticamente a próxima página disponível

### Requirement: Exclusão pelo autor
O sistema MUST permitir que somente o autor remova sua publicação, preservando o registro por exclusão lógica.

#### Scenario: Autor remove publicação
- **WHEN** o autor solicita a exclusão de sua publicação
- **THEN** ela deixa de aparecer nos feeds e recebe estado de exclusão lógica

#### Scenario: Outro usuário tenta remover publicação
- **WHEN** alguém que não é o autor solicita a exclusão
- **THEN** o sistema rejeita a operação e mantém a publicação visível

### Requirement: Apresentação do feed
O sistema MUST exibir autoria, papel, horário e escopo de cada publicação, um contador de caracteres no formulário e um estado vazio amigável quando não houver publicações acessíveis.

#### Scenario: Publicação com contexto de autoria
- **WHEN** uma publicação aparece no feed
- **THEN** a interface mostra avatar com iniciais, nome, papel, horário e badge de escopo

#### Scenario: Feed vazio
- **WHEN** não há publicações acessíveis
- **THEN** a interface explica em português que ainda não há publicações
