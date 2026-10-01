# Spec Delta

## ADDED Requirements

### Requirement: Publicação confirmada aparece no feed selecionado
Depois que a criação de uma publicação for confirmada com sucesso, o sistema MUST exibi-la no feed do escopo selecionado e limpar o formulário. A atualização do feed MUST preservar a ordenação cronológica definida pela capability.

#### Scenario: Publicação em sala aparece após sucesso
- **WHEN** um membro envia uma publicação válida para uma sala e a criação é confirmada
- **THEN** o formulário é limpo e a publicação aparece no feed dessa sala

### Requirement: Falha ao publicar preserva o rascunho e informa o usuário
Quando a publicação não puder ser confirmada, o sistema MUST manter o texto digitado e exibir uma mensagem de erro acessível em português. O sistema MUST NOT apresentar a operação como concluída nem limpar o formulário.

#### Scenario: Erro da API ao publicar
- **WHEN** a API rejeita ou não consegue concluir a criação da publicação
- **THEN** o texto permanece no formulário e uma mensagem de erro é anunciada ao usuário
