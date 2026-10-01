# Salas (turmas)

**Prioridade:** P0 | **Escopo:** organizacional

## Purpose

Salas representam turmas ou grupos dentro do Instituto J&F, vinculados a uma frente de ensino. São a unidade organizacional para conteúdo com escopo de sala.

## Personas

- **Aluno** — vê e participa das salas em que é membro
- **Professor** — gerencia conteúdo das salas em que leciona
- **Coordenação** — visualiza todas as salas e gerencia membros

## Scenarios

### Scenario: Aluno vê suas salas na sidebar
- **GIVEN** um aluno membro de "3º ADS" e "Projeto Integrador"
- **WHEN** ele acessa a plataforma
- **THEN** ambas as salas aparecem na navegação lateral

### Scenario: Aluno acessa sala da qual não é membro
- **GIVEN** um aluno que não é membro da sala "1º VET"
- **WHEN** ele tenta acessar `/salas/<id-vet>/feed`
- **THEN** o sistema exibe erro de acesso negado

### Scenario: Sala exibe frente de ensino visualmente
- **GIVEN** a sala "3º ADS" da Escola de Tecnologia
- **WHEN** o aluno navega para essa sala
- **THEN** a interface usa a cor da frente (`#1A1E20` — tech)

### Scenario: Listagem de salas
- **GIVEN** um usuário autenticado
- **WHEN** ele acessa a listagem de salas
- **THEN** vê apenas salas das quais é membro (aluno/professor) ou todas (coordenação)

## Requirements

### Requirement: Sala tem identidade e frente de ensino
O sistema MUST associar a cada sala nome, slug, frente de ensino (`business`, `tech`, `factory`) e ano letivo. A UI da sala MUST aplicar a cor visual da frente.

#### Scenario: Sala exibe frente de ensino visualmente
- **WHEN** o aluno navega para uma sala da Escola de Tecnologia
- **THEN** a interface usa a cor da frente correspondente

### Requirement: Membros vinculados às salas
O sistema MUST vincular usuários às salas como membros e MUST restringir a listagem: alunos e professores veem apenas salas das quais são membros; coordenação vê todas.

#### Scenario: Listagem de salas
- **WHEN** um usuário autenticado acessa a listagem de salas
- **THEN** vê apenas salas das quais é membro (aluno/professor) ou todas (coordenação)

#### Scenario: Aluno vê suas salas na sidebar
- **WHEN** um aluno membro de duas salas acessa a plataforma
- **THEN** ambas as salas aparecem na navegação lateral

### Requirement: Acesso a rotas da sala exige associação
O sistema MUST restringir rotas da sala (`/salas/[id]/feed`, `/mural`, `/fotos`) a membros (ou coordenação).

#### Scenario: Aluno acessa sala da qual não é membro
- **WHEN** um aluno que não é membro tenta acessar o feed da sala
- **THEN** o sistema exibe erro de acesso negado

### Requirement: Coordenação gerencia membros das salas
A coordenação MUST conseguir associar alunos e professores a uma sala e remover membros existentes. Cada associação MUST registrar se o membro participa como aluno ou professor. Usuários sem papel global de coordenação MUST ser impedidos de alterar essas associações.

#### Scenario: Coordenação adiciona membro à sala
- **WHEN** um usuário de coordenação associa um aluno ou professor a uma sala com seu papel na sala
- **THEN** o usuário passa a integrar a sala com o papel informado

#### Scenario: Coordenação remove membro da sala
- **WHEN** um usuário de coordenação remove um membro de uma sala
- **THEN** a associação do usuário com a sala deixa de existir

#### Scenario: Usuário sem papel de coordenação tenta alterar membros
- **WHEN** um aluno ou professor tenta adicionar ou remover um membro de uma sala
- **THEN** a alteração é negada e as associações permanecem inalteradas

### Requirement: Convenções de slug e agrupamento
O sistema SHOULD usar slug amigável para URL e SHOULD agrupar salas por frente de ensino na sidebar. O sistema MUST NOT permitir criação de salas por alunos nem salas aninhadas no MVP.

#### Scenario: Slug amigável na listagem
- **WHEN** uma sala é criada com nome descritivo
- **THEN** o slug permanece adequado para uso em URL

## Scope

organizacional (não é conteúdo, mas estrutura)

## Dependencies

- identity/auth
- identity/roles

## Design references

- docs/design-system.md — cores por frente de ensino

## Open questions

- [ ] Quantas salas um aluno pode pertencer simultaneamente?
- [ ] Salas de projetos extras (fora da turma regular)?
