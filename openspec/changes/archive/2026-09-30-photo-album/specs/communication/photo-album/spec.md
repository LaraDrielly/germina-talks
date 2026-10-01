# Spec Delta

## ADDED Requirements

### Requirement: Fluxo de aprovação de álbum criado por aluno
Quando um aluno cria um álbum de fotos para a sua sala, este álbum SHALL ser criado com status "PENDING" e só se torna visível para outros alunos após a aprovação da coordenação.

#### Scenario: Aluno cria álbum e coordenação aprova
- **WHEN** um aluno cria um álbum na sua sala
- **THEN** o álbum fica com status "PENDING" e a coordenação pode aprová-lo para que mude para "APPROVED"

#### Scenario: Álbum não aprovado não aparece na listagem
- **WHEN** um aluno tenta visualizar a listagem de álbuns da sala
- **THEN** álbuns com status "PENDING" ou "REJECTED" não são retornados (exceto para o próprio criador ou para professores/coordenação)

### Requirement: Fluxo de aprovação de fotos
Quando um aluno envia uma foto para um álbum, a foto SHALL ser submetida com status "PENDING" e só ficará visível no álbum após aprovação por um professor ou pela coordenação.

#### Scenario: Aluno envia foto
- **WHEN** um aluno envia uma foto para um álbum
- **THEN** a foto entra com status "PENDING" e requer aprovação

#### Scenario: Professor aprova foto
- **WHEN** um professor aprova a foto "PENDING" de um aluno
- **THEN** o status da foto muda para "APPROVED" e ela aparece na grade do álbum

#### Scenario: Foto pendente recebe aviso visual
- **WHEN** o aluno que enviou a foto acessa o álbum
- **THEN** ele visualiza a sua foto com uma indicação "Aguardando aprovação"
