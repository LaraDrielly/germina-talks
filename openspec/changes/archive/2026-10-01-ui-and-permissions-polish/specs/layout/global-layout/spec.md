# Spec Delta

## Purpose

Define a estrutura de layout global do sistema e a identidade da marca, garantindo responsividade, navegação unificada e clareza de marca (GerminaTalks).

## ADDED Requirements

### Requirement: Responsividade e largura
A aplicação SHALL utilizar 100% da largura da tela disponível, adaptando-se a diferentes tamanhos de dispositivo (responsividade), eliminando restrições artificiais de largura máxima no centro.

#### Scenario: Visualização em desktop
- **WHEN** o usuário acessa a plataforma em um monitor desktop
- **THEN** o conteúdo se expande para utilizar o espaço disponível de forma fluida

#### Scenario: Visualização em mobile
- **WHEN** o usuário acessa a plataforma em um celular
- **THEN** os elementos se reorganizam em coluna única, garantindo a legibilidade sem rolagem horizontal

### Requirement: Nomenclatura da marca
A plataforma SHALL ser sempre identificada como "GerminaTalks" na interface de usuário, sem espaços.

#### Scenario: Exibição da marca
- **WHEN** o logotipo ou o nome do sistema é renderizado
- **THEN** deve constar explicitamente como "GerminaTalks"

### Requirement: Barra de busca
A interface SHALL fornecer uma barra de busca funcional para os conteúdos da plataforma.

#### Scenario: Busca submetida
- **WHEN** o usuário digita um termo e submete
- **THEN** o sistema exibe os resultados correspondentes (ou uma indicação de em desenvolvimento/placeholder apropriado)

### Requirement: Indicação de escopo
O sistema SHALL exibir o escopo correto da sala atual na navegação ou header quando o usuário navegar para dentro de uma sala.

#### Scenario: Navegação de aba de sala
- **WHEN** o usuário entra na aba de uma sala
- **THEN** a label "Escopo" é atualizada para refletir a sala atual
