# Autenticação

**Prioridade:** P0 | **Escopo:** global

## Overview

Permite que membros da comunidade escolar do Instituto J&F façam login na plataforma usando e-mail institucional, garantindo que apenas pessoas autorizadas acessam o Germina Talks.

## Personas

- **Aluno** — faz login para ver conteúdo da escola e das suas salas
- **Professor** — faz login para publicar recados e moderar
- **Coordenação** — faz login para comunicados globais

## Scenarios

### Scenario: Aluno faz login com e-mail institucional
- **GIVEN** um aluno com e-mail `@institutojef.org.br` cadastrado
- **WHEN** ele insere e-mail e senha na tela de login
- **THEN** ele é autenticado e redirecionado para o feed

### Scenario: Usuário com e-mail não autorizado tenta login
- **GIVEN** um e-mail que não pertence ao domínio permitido
- **WHEN** ele tenta fazer login
- **THEN** o sistema exibe mensagem de erro e não autentica

### Scenario: Usuário não autenticado acessa rota protegida
- **GIVEN** um visitante sem sessão
- **WHEN** ele tenta acessar `/feed`
- **THEN** é redirecionado para `/login`

### Scenario: Usuário faz logout
- **GIVEN** um usuário autenticado
- **WHEN** ele clica em "Sair"
- **THEN** a sessão é encerrada e ele volta para `/login`

## Requirements

### MUST
- Autenticar via e-mail e senha
- Restringir cadastro/login a domínios de e-mail configurados
- Manter sessão via cookie seguro (HTTP-only)
- Redirecionar rotas protegidas para login quando não autenticado
- Permitir logout

### SHOULD
- Exibir nome e avatar do usuário no header após login
- Mensagem de erro amigável em credenciais inválidas

### WON'T
- Login social (Google, Facebook) no MVP
- Autenticação de dois fatores no MVP
- Cadastro self-service (usuários criados por admin)

## Scope

global

## Dependencies

Nenhuma (feature fundacional).

## Design references

- docs/design-system.md#Button (botão de login primary `#3A255B`)

## Open questions

- [ ] Lista de domínios permitidos além de `@institutojef.org.br`?
- [ ] Integração futura com SSO do Grupo J&F?
