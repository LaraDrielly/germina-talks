---
name: git-workflow
description: Padroniza e executa o fluxo completo de Git do projeto (branch, self-review, commit, push, pull request).
---

# Fluxo de Git

Esta Skill conduz o fluxo completo de uma alteração de código, desde a criação da branch até o push e preenchimento do Pull Request Template. Siga os passos rigorosamente.

## 1. Criação da branch

Antes de realizar alterações relacionadas ao Git, identifique o tipo da modificação e crie uma branch com o padrão: `tipoModificacao/descricao-modificacao`

Exemplos:
* `feat/sidebar`
* `fix/login-error`
* `refactor/auth-service`
* `docs/readme`
* `test/login`
* `chore/update-dependencies`

A descrição deve:
* estar em minúsculas;
* utilizar `-` para separar palavras;
* ser curta e objetiva;
* representar claramente a alteração realizada.

Tipos de branch permitidos (não inventar novos):
* `feat`
* `fix`
* `docs`
* `style`
* `refactor`
* `test`
* `chore`

**Importante:** Se já existir uma branch adequada para a alteração, NÃO crie outra automaticamente. Informe a situação ao usuário e siga nela somente se fizer sentido. Verifique `git branch` e `git status`.

## 2. Code Review próprio

Antes de executar `git add` e `git commit`, realize OBRIGATORIAMENTE um code review da própria alteração lendo o `git diff` real.

Verifique:
* se a implementação atende ao objetivo da tarefa;
* se existem erros óbvios ou possíveis bugs;
* código duplicado ou desnecessário;
* violações dos padrões existentes no projeto;
* nomes de variáveis, funções e componentes;
* tratamento de erros e impactos em outras partes;
* se testes precisam ser atualizados/criados;
* se a documentação precisa ser atualizada;
* se há arquivos acidentais/gerados (como .env) ou que não deveriam ser commitados.

Corrija quaisquer problemas encontrados antes de continuar. Revise novamente após a correção. Não considere a alteração pronta apenas porque compila.

## 3. Git Add

Após concluir e aprovar o code review:
1. Execute `git status`.
2. Adicione ao stage SOMENTE os arquivos pertencentes à alteração (`git add <arquivos>`).
3. EVITE `git add .` ou `git add -A` para não incluir lixo.
4. Antes de commitar, execute `git diff --staged` e garanta que não haja secrets, credenciais ou arquivos não relacionados.

## 4. Commit

O commit deve seguir **Conventional Commits** (`tipo: descrição`).

Tipos permitidos:
* `feat`: Adiciona uma nova funcionalidade.
* `fix`: Corrige erro/bug.
* `docs`: Altera documentação.
* `style`: Modifica formatação.
* `refactor`: Reorganiza código sem corrigir bugs/adicionar features.
* `test`: Testes automatizados.
* `chore`: Build, configurações, dependências.

Exemplo: `feat: adiciona sidebar ao sistema`

A descrição deve ser objetiva, indicar a alteração, começar com verbo no presente e não terminar com ponto. Não invente informações.

## 5. Preencher PR e Push

Após concluir todos os passos (implementação, review, add, commit):
* Faça o push da branch atual: `git push -u origin <branch>`
* Informe ao usuário a branch, o commit e o resultado do push.
* Imprima no chat o conteúdo completo do template de Pull Request (localizado em `.github/pull_request_template.md`), já preenchido com base EXCLUSIVAMENTE nas alterações feitas.
* **MUITO IMPORTANTE:** Ao enviar o template preenchido, envie-o de forma isolada, como um bloco de código markdown puro, sem adicionar NENHUMA mensagem conversacional extra (como "Aqui está", "Pronto", etc) junto do texto. Isso permite que o usuário copie e cole o conteúdo diretamente sem precisar apagar partes desnecessárias. Qualquer comunicação extra deve ser enviada em uma mensagem separada.

## ⚠️ Segurança e Comportamento

Você NÃO deve:
* Fazer `git push --force` automaticamente.
* Usar `git reset --hard` automaticamente.
* Apagar alterações do usuário ou sobrescrever itens não relacionados.
* Commitar segredos/credenciais.
* Alterar configs globais de git.

Em caso de dúvidas, conflitos, arquivos não previstos, problemas de autenticação ou ausência de informações essenciais, PARE e peça orientação ao usuário.

SEJA CONSERVADOR. Não invente, não assuma, não destrua.
