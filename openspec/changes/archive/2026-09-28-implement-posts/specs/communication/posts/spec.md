# Spec Delta

## ADDED Requirements

### Requirement: Somente o autor pode excluir uma publicação
O sistema MUST permitir a exclusão de uma publicação somente ao seu autor. A permissão de moderação de professores ou coordenação não autoriza excluir publicação de outra pessoa.

#### Scenario: Professor tenta excluir publicação de aluno
- **WHEN** um professor membro da sala tenta excluir uma publicação criada por um aluno
- **THEN** o sistema rejeita a operação com erro de permissão e mantém a publicação visível
