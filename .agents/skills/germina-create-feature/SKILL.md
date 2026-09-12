---
name: germina-create-feature
description: Scaffold a new Germina Talks feature with spec template, OpenSpec change, and technical impact sections. Use when adding a new capability to the platform.
allowed-tools: Bash(openspec:*)
---

Create a new feature in the Germina Talks SDD workflow.

**Planning boundary**: This skill creates planning artifacts only. Do not edit application code.

## Prerequisites

Read before starting:
- `docs/vision.md`
- `docs/design-system.md`
- `openspec/specs/_meta/conventions.md`

## Input

The user provides:
- **Domain**: `identity`, `organization`, or `communication`
- **Feature name**: kebab-case (e.g., `notifications`)
- **Description**: one sentence about what the feature does

Example: `communication/notifications — Notificações push para recados fixados`

## Steps

### 1. Validate input

- Domain must be one of: `identity`, `organization`, `communication` (or propose a new domain if justified)
- Feature name: kebab-case, no spaces
- Check if `openspec/specs/<domain>/<feature>/spec.md` already exists

### 2. Create spec scaffold

Create `openspec/specs/<domain>/<feature>/spec.md` using the template from `openspec/specs/_meta/conventions.md`:

- Overview with the user's description
- Personas (aluno, professor, coordenação as relevant)
- At least 2 placeholder Scenarios (GIVEN/WHEN/THEN)
- Requirements with MUST/SHOULD/WON'T sections
- Scope declaration (global | classroom | both)
- Dependencies on existing specs
- Design references to `docs/design-system.md`
- Open questions as checkboxes

### 3. Create OpenSpec change

```bash
openspec new change "add-<feature>"
```

### 4. Create change artifacts

Follow `openspec instructions` for each artifact:

**proposal.md** must include:
- Link to `docs/vision.md`
- Problem this feature solves
- Non-goals section
- Priority (P0/P1/P2)

**design.md** must include these sections:

```markdown
## API changes
- [ ] Endpoints (reference docs/technical/api-contracts.md)
- [ ] Zod schemas

## Database changes
- [ ] Tables/columns (reference docs/technical/database.md)
- [ ] Migration name

## Frontend changes
- [ ] Routes (reference docs/technical/frontend.md)
- [ ] Components (reference docs/design-system.md)
- [ ] Hooks/data fetching

## Design system
- [ ] New components or reuse existing (with links)
```

**tasks.md** must be grouped:

```markdown
## 1. Spec
- [ ] Review and finalize scenarios

## 2. Database
- [ ] Migration

## 3. Backend
- [ ] Service + Route Handlers
- [ ] Tests

## 4. Frontend
- [ ] Pages + components
- [ ] Integration

## 5. Docs
- [ ] Update api-contracts.md if new endpoints
- [ ] Update database.md if new tables
```

**specs/<domain>/<feature>/spec.md** (delta): initial scenarios and requirements.

### 5. Validate

```bash
openspec validate add-<feature> --json
```

### 6. Present summary

Show the user:
- Spec path created
- Change name and status
- Next step: review artifacts, then run `openspec-apply-change`

## Rules

- All UI references MUST use Instituto J&F colors from `docs/design-system.md`
- All content features MUST declare scope (global/classroom)
- Scenarios MUST be testable (GIVEN/WHEN/THEN)
- Do NOT implement code in this workflow
- Messages to user in Portuguese
