# Design: mural de recados

## API changes

- `GET /api/v1/bulletin`: lista recados globais e recados de salas acessíveis; aceita `scopeType` e `classroomId`, valida filtros com Zod, exclui recados expirados ou removidos e ordena fixados primeiro, depois por criação decrescente.
- `POST /api/v1/bulletin`: valida título (até 120 caracteres), corpo, escopo, sala e expiração com Zod. Aluno e professor publicam em salas de que são membros; coordenação pode publicar globalmente ou em uma sala. Apenas professor da sala e coordenação podem solicitar fixação.
- `POST /api/v1/bulletin/:id/pin`: fixa um recado. Professores só podem fixar recados de salas em que possuem papel de professor; coordenação pode fixar em qualquer escopo.
- Rotas respondem `{ data }` ou `{ error: { code, message } }`; ausência de sessão é `401`, falta de permissão `403`, entrada inválida `400` e falha inesperada `500`.
- APIs ficam fora do redirecionamento do middleware de páginas. Cada Route Handler valida a sessão e retorna JSON.

## Database changes

- `BulletinItem` persiste autor, título, corpo, escopo, sala, fixação, expiração, timestamps com fuso UTC e `deletedAt` para soft delete.
- `ClassroomMember` guarda vínculo e papel na sala. O vínculo autoriza leitura, criação e fixação.
- `User.passwordHash` guarda hashes `scrypt` com salt individual; papel e nome vêm da conta persistida.
- Migration complementar adiciona os novos campos e converte timestamps existentes assumindo que os valores sem fuso foram gravados como UTC. Seed de demo exige senha local e recusa produção.

## Frontend changes

- `/mural` é autenticada e exibe recados globais e de todas as salas acessíveis.
- `/salas/[id]/mural` mostra apenas os recados daquela sala e retorna 404 para usuários sem vínculo, exceto coordenação.
- A listagem de salas exibe dados reais e link para o mural específico.
- Badges usam tokens do design system e identificam a frente de ensino; fixação, autor/papel, criação, expiração, vazio e falhas são comunicados em português.
- Formulário mantém a sala atual na rota específica. Erros de rede não deixam o botão preso em carregamento.

## Authentication

- Auth.js Credentials valida domínio institucional, conta existente e senha pelo hash armazenado.
- A sessão recebe o ID da conta. A autorização consulta papel e vínculos no banco; nunca deriva o papel do e-mail.
- Não há auto cadastro nem recuperação de senha no MVP. Contas precisam ser provisionadas.
- A operação provisiona ou redefine contas por comando administrativo, com senha inicial fornecida via gerenciador de segredos.

## Assumptions

- O papel global de coordenação é `admin`.
- Alunos podem criar recados não fixados em salas das quais são membros, conforme `identity/roles`.
- Coordenação pode publicar globalmente ou por sala e fixar em qualquer escopo.
- Não serão adicionadas edição, exclusão, remoção de fixação, comentários, anexos ou notificações neste MVP.
- O login com credenciais é mantido por escolha do produto; não se integra SSO nesta mudança.
