# Spec Delta

## ADDED Requirements

### Requirement: API de publicações retorna erro JSON quando não há sessão
Uma chamada não autenticada aos endpoints de publicações MUST receber status `401` e corpo JSON no envelope de erro, sem redirecionamento HTML para `/login`. O redirecionamento de páginas protegidas para `/login` MUST permanecer inalterado.

#### Scenario: Usuário sem sessão envia publicação
- **WHEN** um visitante envia `POST /api/v1/posts` sem sessão válida
- **THEN** a API responde `401` com `Content-Type: application/json` e código `UNAUTHORIZED`, sem redirecionar para `/login`

#### Scenario: Usuário sem sessão acessa uma página protegida
- **WHEN** um visitante sem sessão acessa `/feed`
- **THEN** o sistema continua redirecionando o navegador para `/login`
