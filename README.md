# Germina Talks

Plataforma open source de **comunidade escolar** para o [Instituto J&F](https://institutojef.org.br/) — um espaço digital único para comunicação, interação e compartilhamento entre alunos, professores e coordenação.

## O problema

Informações da escola estão espalhadas em WhatsApp, Instagram, Classroom e e-mail. O Germina Talks centraliza:

- **Publicações** — feed estilo tweet (global ou por sala)
- **Mural de recados** — avisos fixáveis com expiração
- **Álbum de fotos** — galeria de eventos escolares

## Documentação

| Documento | Conteúdo |
|-----------|----------|
| [Visão](docs/vision.md) | Problema, público, proposta de valor |
| [Design System](docs/design-system.md) | Cores, tipografia e componentes (identidade Instituto J&F) |
| [Glossário](docs/glossary.md) | Termos de domínio |
| [Técnico](docs/technical/overview.md) | Stack, backend, banco, frontend, API |
| [Specs](openspec/specs/) | Comportamento por feature (SDD) |
| [Contribuir](CONTRIBUTING.md) | Como propor e implementar features |
| [Agentes](AGENTS.md) | Guia para agentes de IA |

## Stack

Next.js · TypeScript · Tailwind CSS · Prisma · PostgreSQL · Auth.js

## Desenvolvimento local

Pré-requisitos: Node.js 20+ e Docker Desktop.

Copie os exemplos de ambiente e configure os valores antes de rodar os comandos: `DEMO_USERS_PASSWORD` em `packages/db/.env` deve ter pelo menos 12 caracteres; substitua `NEXTAUTH_SECRET` em `apps/web/.env.local` por um segredo aleatório. Gere um com `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"`.

```powershell
npm install
Copy-Item apps/web/.env.example apps/web/.env.local
Copy-Item packages/db/.env.example packages/db/.env
# Edite os dois arquivos de ambiente conforme as instruções acima.
docker compose up -d
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

O app estará disponível em `http://localhost:3000`. O PostgreSQL usa a porta `5432`; o storage S3 compatível RustFS recebe uploads em `http://localhost:9000` e seu console fica em `http://localhost:9001`. As credenciais locais são `germina` / `germina_local`; o bucket `germina-talks-photos` é criado automaticamente no primeiro upload.

### Contas locais de demonstração

O seed cria estas contas; todas usam a senha definida em `DEMO_USERS_PASSWORD`:

| E-mail | Papel |
|--------|-------|
| `ana.aluna@institutojef.org.br` | Aluna |
| `bruno.aluno@institutojef.org.br` | Aluno |
| `carla.professora@institutojef.org.br` | Professora |
| `diego.professor@institutojef.org.br` | Professor |
| `elisa.coordenacao@institutojef.org.br` | Coordenação |

O seed é somente para desenvolvimento e recusa execução com `NODE_ENV=production`. Não há cadastro aberto nem recuperação de senha; contas e papéis precisam ser provisionados pela operação do sistema.

### Fluxo de autenticação e conteúdo

O login usa e-mail institucional e senha local. O servidor procura a conta previamente provisionada no PostgreSQL e compara a senha com um hash scrypt individual; não há login por Google, Auth0 ou outro provedor. Sessões Auth.js são assinadas com `NEXTAUTH_SECRET`. Cada API consulta a identidade e os vínculos de sala atuais antes de ler ou alterar conteúdo.

No feed, usuários autenticados publicam até 280 caracteres no escopo global ou em uma sala vinculada à conta; apenas o autor pode excluir a própria publicação. Membros veem o conteúdo global e as salas a que pertencem. Professores e coordenação criam álbuns; membros enviam fotos para álbuns acessíveis. O navegador envia cada arquivo diretamente ao storage S3 compatível por uma URL assinada de curta duração, e o backend confirma tipo, tamanho e assinatura da imagem antes de registrar a foto. As imagens ficam privadas e são servidas por URLs de leitura temporárias.

Para provisionar uma conta fora do seed, defina `ACCOUNT_INITIAL_PASSWORD` no ambiente seguro do operador e rode `npm run db:provision -- email nome student slug-da-sala`. Os papéis aceitos são `student`, `teacher` e `admin`; para coordenação, omita o slug. O comando exige domínio institucional, guarda apenas o hash da senha e pode ser usado também para redefinir a senha de uma conta existente.

Comandos de validação: `npm run typecheck`, `npm run lint` e `npm run build`.

## Desenvolvimento com OpenSpec

Este projeto usa [OpenSpec](https://github.com/Fission-AI/OpenSpec) para Spec-Driven Development:

```bash
# Explorar uma ideia
/openspec-explore

# Criar nova feature
/germina-create-feature communication/notifications — Notificações

# Implementar
/openspec-apply-change add-notifications
```

## Licença

Open source — contribuições bem-vindas da comunidade escolar.
