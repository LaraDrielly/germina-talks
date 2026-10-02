# Spec Delta

## ADDED Requirements

### Requirement: Exibição da legenda
A interface de visualização do álbum SHALL exibir a legenda (caption) descritiva de cada foto imediatamente abaixo dela.

#### Scenario: Foto com legenda no álbum
- **WHEN** o usuário visualiza uma foto na grade
- **THEN** a sua descrição é renderizada debaixo da imagem

## MODIFIED Requirements

### Requirement: Moderação de álbuns e fotos por papel
O sistema MUST marcar conteúdo criado por aluno como pendente de moderação até aprovação. Conteúdo criado por professor ou coordenação MUST ficar aprovado automaticamente. Professores (membros da sala) e a Coordenação MUST poder aprovar ou rejeitar itens pendentes na interface. Listagens públicas de fotos/álbuns MUST exibir apenas conteúdo aprovado para alunos; coordenação e professores MAY ver pendentes na área de moderação.

#### Scenario: Aluno cria álbum pendente
- **WHEN** um aluno cria um álbum válido
- **THEN** o álbum fica com status pendente e não aparece na listagem pública até aprovação

#### Scenario: Professor cria álbum aprovado
- **WHEN** um professor cria um álbum válido
- **THEN** o álbum fica aprovado e aparece imediatamente na listagem do escopo

#### Scenario: Coordenação aprova foto pendente
- **WHEN** a coordenação aprova uma foto pendente via interface
- **THEN** a foto passa a aparecer na grade do álbum para os membros do escopo

#### Scenario: Professor aprova foto pendente da sala
- **WHEN** um professor aprova uma foto pendente de uma sala da qual ele é membro
- **THEN** a foto passa a aparecer na grade do álbum para os membros da sala
