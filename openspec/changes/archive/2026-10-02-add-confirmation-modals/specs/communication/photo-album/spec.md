# Spec Delta

## MODIFIED Requirements

### Requirement: Moderação de álbuns e fotos por papel
O sistema MUST marcar fotos (conteúdo) enviadas por alunos como pendentes de moderação até aprovação. Conteúdo criado por professor ou coordenação MUST ficar aprovado automaticamente. Álbuns, por serem criados apenas por professores/coordenação, são sempre auto-aprovados. Professores (membros da sala) e a Coordenação MUST poder aprovar ou rejeitar itens pendentes na interface. Listagens públicas de fotos/álbuns MUST exibir apenas conteúdo aprovado para alunos; coordenação e professores MAY ver pendentes na área de moderação. A interface SHALL solicitar confirmação explícita através de um modal antes de efetivar as ações de aprovar ou rejeitar itens.

#### Scenario: Aluno envia foto pendente
- **WHEN** um aluno envia uma foto para um álbum existente
- **THEN** a foto fica com status pendente e não aparece na listagem pública

#### Scenario: Professor cria álbum aprovado
- **WHEN** um professor cria um álbum válido
- **THEN** o álbum fica aprovado e aparece imediatamente na listagem do escopo

#### Scenario: Coordenação aprova foto pendente via interface
- **WHEN** a coordenação clica para aprovar uma foto pendente e confirma a ação no modal
- **THEN** a foto passa a aparecer na grade do álbum para os membros do escopo

#### Scenario: Professor aprova foto pendente da sala
- **WHEN** um professor aprova uma foto pendente de uma sala da qual ele é membro após confirmar no modal
- **THEN** a foto passa a aparecer na grade do álbum para os membros da sala

#### Scenario: Coordenação rejeita foto pendente
- **WHEN** a coordenação clica para rejeitar uma foto pendente e confirma a ação no modal
- **THEN** a foto é descartada e removida da lista de pendências
