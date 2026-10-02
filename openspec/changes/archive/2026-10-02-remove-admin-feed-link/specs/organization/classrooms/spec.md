# Spec Delta

## ADDED Requirements

### Requirement: Ocultar Feed para Admin
A interface de listagem de salas MUST omitir o link de navegação para o Feed da sala quando o usuário autenticado possuir o papel de admin (coordenação).

#### Scenario: Admin acessando a listagem de salas
- **WHEN** um usuário com papel de `admin` visualiza a listagem em `/salas`
- **THEN** o card da sala não exibe o link para "Feed"
