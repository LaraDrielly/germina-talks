# Spec Delta: Álbum de fotos

## MODIFIED Requirements

### Requirement: Criação e consulta de álbuns por escopo
O sistema MUST permitir que professores e administradores criem álbuns globais ou de salas que administram, com título, descrição opcional e contagem de fotos; membros podem consultar apenas os escopos aos quais têm acesso.

#### Scenario: Professor cria álbum da turma
- **WHEN** um professor membro cria um álbum para sua sala
- **THEN** o álbum fica disponível aos membros dessa sala

#### Scenario: Aluno tenta criar álbum
- **WHEN** um aluno solicita a criação de um álbum
- **THEN** o sistema rejeita a operação sem criar o álbum

#### Scenario: Consulta de álbuns
- **WHEN** um usuário autenticado consulta álbuns
- **THEN** recebe álbuns globais e somente os álbuns das salas às quais tem acesso

#### Scenario: Álbum global de evento escolar
- **WHEN** qualquer membro autenticado acessa a galeria global
- **THEN** o álbum global de evento escolar aparece na listagem

### Requirement: Upload seguro de fotos
O sistema MUST permitir que membros do escopo enviem fotos JPEG, PNG ou WebP de até 10 MB para álbuns com menos de 50 fotos, com legenda opcional de até 200 caracteres.

#### Scenario: Upload de foto no álbum
- **WHEN** um membro envia uma imagem permitida com tamanho válido
- **THEN** a foto é armazenada e aparece no álbum com legenda opcional de até 200 caracteres

#### Scenario: Foto excede tamanho máximo
- **WHEN** o arquivo não é JPEG, PNG ou WebP, excede 10 MB ou o álbum já contém 50 fotos
- **THEN** o sistema rejeita o upload e informa o motivo

#### Scenario: Usuário sem acesso envia foto
- **WHEN** uma pessoa fora do escopo solicita uma URL ou registra um upload
- **THEN** o sistema rejeita a operação e não publica a foto

#### Scenario: Arquivo não corresponde ao tipo declarado
- **WHEN** o conteúdo binário não corresponde ao tipo de imagem declarado
- **THEN** o sistema rejeita o arquivo antes de registrá-lo no álbum

### Requirement: Visualização responsiva das fotos
O sistema MUST apresentar miniaturas de fotos do álbum com URLs assinadas e grade responsiva.

#### Scenario: Grid de fotos responsivo
- **WHEN** um aluno visualiza fotos do álbum em um dispositivo móvel
- **THEN** vê suas fotos em grade responsiva de duas ou mais colunas com legendas e datas

#### Scenario: Álbum sem fotos
- **WHEN** um membro abre um álbum vazio
- **THEN** vê um estado vazio e instruções para enviar a primeira foto
