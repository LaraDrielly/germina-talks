# Spec Delta

## ADDED Requirements

### Requirement: Ação explícita de Logout no perfil
O sistema SHALL fornecer um botão ou ação clara na interface do usuário (especificamente no Perfil) para realizar o logout, não exigindo navegação manual por URL.

#### Scenario: Logout via interface do Perfil
- **WHEN** o usuário clica em "Sair" na sua página de perfil
- **THEN** a sessão é invalidada e ele retorna para a página de login
