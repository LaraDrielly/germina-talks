# Lista de Tarefas do Projeto (Germina Talks)

Este arquivo registra as tarefas a serem executadas.
Cada tarefa listada deve ser implementada em um commit separado, seguindo o padrão de fluxo de trabalho do projeto (via `git-workflow` ou comandos manuais).

Formato:
- [ ] Título da Tarefa
  - Descrição: Breve descrição.
  - Prioridade: P0/P1/P2.

---

### Tarefas Pendentes

- [ ] Criar estrutura base do monorepo (diretórios apps e packages)
  - Descrição: Criar diretórios `apps/web`, `packages/db`, `packages/shared`.
  - Prioridade: P0

- [ ] Configurar Next.js 15 (App Router) em `apps/web`
  - Descrição: Inicializar projeto Next.js com TS e Tailwind CSS.
  - Prioridade: P0

- [ ] Configurar Prisma em `packages/db`
  - Descrição: Inicializar Prisma, configurar conexão Postgres.
  - Prioridade: P0

- [ ] Configurar estrutura de pacotes compartilhados em `packages/shared`
  - Descrição: Definir tipos e esquemas Zod base.
  - Prioridade: P0

- [ ] Configurar Docker Compose para ambiente de desenvolvimento
  - Descrição: Adicionar `docker-compose.yml` com Postgres e MinIO.
  - Prioridade: P0
