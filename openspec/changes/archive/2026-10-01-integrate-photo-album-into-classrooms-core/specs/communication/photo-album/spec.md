# Spec Delta

## ADDED Requirements

### Requirement: Álbuns listados e criados via API versionada com escopo
O sistema MUST listar e criar álbuns através de `GET`/`POST /api/v1/albums` com escopo global ou de sala. Para escopo de sala, a listagem e a criação MUST exigir que o usuário autenticado seja membro da sala (ou coordenação). O feed de fotos na interface MUST consumir esse contrato.

#### Scenario: Membro lista álbuns da sala
- **WHEN** um membro autenticado solicita `GET /api/v1/albums?classroomId=<id-da-sala>`
- **THEN** o sistema retorna os álbuns visíveis dessa sala

#### Scenario: Não membro não lista álbuns da sala
- **WHEN** um usuário autenticado que não é membro solicita álbuns de uma sala
- **THEN** o sistema rejeita o acesso com erro de permissão

#### Scenario: UI de fotos da sala usa o contrato de álbuns
- **WHEN** um membro abre `/salas/<id>/fotos`
- **THEN** a listagem carrega álbuns via `GET /api/v1/albums` com `classroomId` dessa sala

### Requirement: Upload de foto no álbum autenticado
O sistema MUST permitir que um membro do escopo envie fotos (JPEG, PNG ou WebP até 10 MB) para um álbum existente via `POST /api/v1/albums/:id/photos`. O sistema MUST rejeitar arquivos acima do limite. A identidade do autor MUST vir da sessão autenticada (não de campos enviados pelo cliente).

#### Scenario: Membro envia foto válida
- **WHEN** um membro do escopo envia uma foto JPEG de 5 MB para o álbum
- **THEN** a foto fica associada ao álbum e aparece na grade

#### Scenario: Foto excede tamanho máximo
- **WHEN** um usuário tenta enviar uma foto de 15 MB
- **THEN** o sistema rejeita o envio com mensagem de limite

#### Scenario: Identidade não pode ser forjada no body
- **WHEN** um cliente envia `createdById` ou `userRole` no body tentando se passar por outro usuário
- **THEN** o sistema ignora esses campos e usa apenas a sessão autenticada

### Requirement: Moderação de álbuns e fotos por papel
O sistema MUST marcar conteúdo criado por aluno como pendente de moderação até aprovação. Conteúdo criado por professor ou coordenação MUST ficar aprovado automaticamente. Apenas coordenação MUST poder aprovar ou rejeitar itens pendentes. Listagens públicas de fotos/álbuns MUST exibir apenas conteúdo aprovado para alunos; coordenação MAY ver pendentes na área de moderação.

#### Scenario: Aluno cria álbum pendente
- **WHEN** um aluno cria um álbum válido
- **THEN** o álbum fica com status pendente e não aparece na listagem pública até aprovação

#### Scenario: Professor cria álbum aprovado
- **WHEN** um professor cria um álbum válido
- **THEN** o álbum fica aprovado e aparece imediatamente na listagem do escopo

#### Scenario: Coordenação aprova foto pendente
- **WHEN** a coordenação aprova uma foto pendente
- **THEN** a foto passa a aparecer na grade do álbum para os membros do escopo
