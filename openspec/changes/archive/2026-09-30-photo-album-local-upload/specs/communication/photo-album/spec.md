# Spec Delta

## MODIFIED Requirements

### Requirement: Upload de Fotos e Álbum
- Álbum tem título, descrição opcional e escopo (global/sala)
- Upload de fotos: JPEG, PNG, WebP até 10 MB
- Grade de miniaturas (PhotoTile) responsiva
- Apenas membros do escopo podem ver e contribuir
- Storage local (Filesystem) via multipart/form-data no endpoint de upload

#### Scenario: Professor cria álbum da turma
- **WHEN** um professor da sala "3º ADS" cria o álbum "Feira de Ciências 2026" com escopo da sala
- **THEN** o álbum aparece em `/salas/<id>/fotos`

#### Scenario: Upload de foto no álbum
- **WHEN** um membro da sala faz upload de uma foto JPEG (5 MB) em um álbum existente
- **THEN** a foto aparece na grade do álbum com miniatura

#### Scenario: Foto excede tamanho máximo
- **WHEN** um usuário tenta upload de foto de 15 MB
- **THEN** o sistema rejeita com mensagem de limite (10 MB)

#### Scenario: Álbum global de evento escolar
- **WHEN** qualquer aluno autenticado acessa `/fotos`
- **THEN** o álbum global "Formatura 2026" é visível na listagem

#### Scenario: Grid de fotos responsivo
- **WHEN** um aluno visualiza no celular um álbum com 12 fotos
- **THEN** as fotos aparecem em grid de 2 colunas
