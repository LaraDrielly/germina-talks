# Spec Delta

## MODIFIED Requirements

### Requirement: Álbuns listados e criados via API versionada com escopo
O sistema MUST listar e criar álbuns através de `GET`/`POST /api/v1/albums` com escopo global ou de sala. Para escopo de sala, a listagem MUST exigir que o usuário autenticado seja membro da sala (ou coordenação). A criação de álbuns MUST ser restrita exclusivamente a professores e coordenação. Alunos NÃO podem criar álbuns. O feed de fotos na interface MUST consumir esse contrato.

#### Scenario: Membro lista álbuns da sala
- **WHEN** um membro autenticado solicita `GET /api/v1/albums?classroomId=<id-da-sala>`
- **THEN** o sistema retorna os álbuns visíveis dessa sala

#### Scenario: Não membro não lista álbuns da sala
- **WHEN** um usuário autenticado que não é membro solicita álbuns de uma sala
- **THEN** o sistema rejeita o acesso com erro de permissão

#### Scenario: UI de fotos da sala usa o contrato de álbuns
- **WHEN** um membro abre `/salas/<id>/fotos`
- **THEN** a listagem carrega álbuns via `GET /api/v1/albums` com `classroomId` dessa sala

#### Scenario: Aluno tenta criar álbum
- **WHEN** um aluno solicita a criação de um álbum
- **THEN** o sistema rejeita com erro de permissão

#### Scenario: Professor ou Coordenação cria álbum
- **WHEN** um professor ou membro da coordenação cria um álbum válido
- **THEN** o álbum é criado e imediatamente aprovado

### Requirement: Moderação de álbuns e fotos por papel
O sistema MUST marcar fotos (conteúdo) criado por aluno como pendente de moderação até aprovação. Conteúdo criado por professor ou coordenação MUST ficar aprovado automaticamente. Apenas coordenação (ou professores responsáveis pela sala) MUST poder aprovar ou rejeitar fotos pendentes. Álbuns, por serem criados apenas por professores/coordenação, são sempre auto-aprovados. Listagens públicas de fotos MUST exibir apenas conteúdo aprovado.

#### Scenario: Professor cria álbum aprovado
- **WHEN** um professor cria um álbum válido
- **THEN** o álbum fica aprovado e aparece imediatamente na listagem do escopo

#### Scenario: Aluno envia foto pendente
- **WHEN** um aluno envia uma foto para um álbum existente
- **THEN** a foto fica com status pendente e não aparece na listagem pública

#### Scenario: Coordenação aprova foto pendente
- **WHEN** a coordenação aprova uma foto pendente
- **THEN** a foto passa a aparecer na grade do álbum para os membros do escopo
