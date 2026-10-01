# Implementar o mural de recados

**Prioridade:** P1 | **Escopo:** global + sala

Visão do produto: [docs/vision.md](../../../docs/vision.md).

## Why

A rota do mural apresenta conteúdo fixo de demonstração e não permite que a comunidade consulte ou publique recados reais. O MVP precisa de um espaço institucional com escopo global ou por sala, destaque para avisos fixados e expiração.

## What Changes

- Persistir recados com título, corpo, autor, escopo, fixação e expiração.
- Disponibilizar leitura e criação de recados com controle de acesso por papel e vínculo com a sala.
- Permitir que professores fixem recados de suas salas e que a coordenação fixe recados globais.
- Substituir os exemplos estáticos da rota `/mural` por uma interface funcional e responsiva.
- Oferecer uma rota filtrada por sala e alinhar a interface às cores da frente de ensino.
- Validar entradas com schemas compartilhados e cobrir autorização, erros e credenciais em testes.
- Usar contas existentes com senhas protegidas por hash para que a autorização do mural se baseie no papel persistido.

## Capabilities

### New Capabilities
- Nenhuma. A capacidade `communication/bulletin-board` já existe e esta change implementa seu comportamento pendente.

### Modified Capabilities
- `communication/bulletin-board`: persistência, leitura, criação, fixação, expiração e apresentação do mural.

## Impact

- Banco Prisma: recados e vínculos de membros com salas necessários para autorização de escopo.
- API Next.js: endpoints de listagem, criação e fixação em `/api/v1/bulletin`.
- Frontend: rota `/mural` e componentes de formulário, recado e estados vazios.
- Auth: validação de e-mail/senha por conta provisionada; sem cadastro aberto no MVP.

## Non-goals

- Edição, exclusão e remoção de fixação de recados.
- Cadastro aberto, recuperação de senha, SSO e autenticação multifator.
- Implementação das features de feed e álbum de fotos.
