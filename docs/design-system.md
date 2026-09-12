# Design System — Germina Talks

Identidade visual derivada do [Instituto J&F](https://institutojef.org.br/), adaptada para uma plataforma de comunidade escolar. O objetivo é transmitir **acolhimento, organização e pertencimento** — alinhado aos valores de Conhecimento, Trabalho, Prosperidade e Felicidade.

---

## Princípios de design

1. **Escolar, não corporativo** — acolhedor e acessível, não frio como um ERP
2. **Mobile-first** — alunos usam celular; toda interface deve funcionar bem em telas pequenas
3. **Hierarquia clara** — comunicado fixado > publicação > comentário
4. **Escopo visível** — o usuário sempre sabe se está vendo conteúdo global ou da sua sala
5. **Legível e inclusivo** — contraste WCAG 2.1 AA, tipografia confortável

---

## Paleta de cores

Extraída do site institucional e das frentes de ensino do Instituto J&F.

### Cores principais (Germina Talks)

| Token | Hex | Uso |
|-------|-----|-----|
| `primary` | `#3A255B` | Títulos, navegação principal, botões primários |
| `primary-foreground` | `#FFFFFF` | Texto sobre primary |
| `accent` | `#27AAE1` | Destaques, links, badges de metodologia/números |
| `accent-green` | `#11C76F` | Sucesso, confirmações, indicadores positivos |
| `accent-orange` | `#DC4405` | Alertas, destaques de atenção |
| `background` | `#FFFFFF` | Fundo principal |
| `surface` | `#F5F6F8` | Cards, painéis, áreas secundárias |
| `text` | `#3C3F4F` | Corpo de texto (padrão do site) |
| `text-muted` | `#6B7280` | Texto secundário, timestamps |
| `border` | `#E5E7EB` | Divisores, bordas de cards |

### Cores por frente de ensino (escopo visual)

Usadas em badges, headers de sala e identificação de turma:

| Frente | Token | Hex | Uso |
|--------|-------|-----|-----|
| Instituto (geral) | `school-general` | `#3A255B` | Conteúdo global da escola |
| Escola de Negócios | `school-business` | `#3A255B` | Turmas de negócios |
| Escola de Tecnologia | `school-tech` | `#1A1E20` | Turmas de tecnologia |
| Escola da Fábrica | `school-factory` | `#186B89` | Turmas VET / fábrica |
| Comunidade | `school-community` | `#001489` | Comunicados institucionais amplos |

### Cores semânticas

| Token | Hex | Uso |
|-------|-----|-----|
| `success` | `#11C76F` | Ação concluída, upload ok |
| `warning` | `#DC4405` | Avisos, conteúdo expirando |
| `error` | `#CF2E2E` | Erros de formulário, falhas |
| `info` | `#27AAE1` | Informações neutras |

### CSS custom properties (referência)

```css
:root {
  --color-primary: #3A255B;
  --color-accent: #27AAE1;
  --color-accent-green: #11C76F;
  --color-accent-orange: #DC4405;
  --color-text: #3C3F4F;
  --color-text-muted: #6B7280;
  --color-background: #FFFFFF;
  --color-surface: #F5F6F8;
  --color-border: #E5E7EB;

  --color-school-business: #3A255B;
  --color-school-tech: #1A1E20;
  --color-school-factory: #186B89;
  --color-school-community: #001489;
}
```

---

## Tipografia

Baseada no site institucional (tema 2026): **Inter** como fonte principal.

| Elemento | Fonte | Peso | Tamanho | Cor |
|----------|-------|------|---------|-----|
| H1 | Inter | 600 | 2.1875rem (35px) | `#3A255B` |
| H2 | Inter | 600 | 1.625rem (26px) | `#3A255B` |
| H3 | Inter | 700 | 1.25rem (20px) | `#3A255B` |
| Body | Inter | 400 | 1.125rem (18px) | `#3C3F4F` |
| Small / meta | Inter | 400 | 0.875rem (14px) | `#6B7280` |
| Label / nav | Inter | 500 | 0.8125rem (13px) | uppercase para nav institucional |

**Line-height:** 150% (padrão do site)

**Fallback stack:** `"Inter", "Roboto", system-ui, sans-serif`

---

## Espaçamento

Escala base 4px:

| Token | Valor |
|-------|-------|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-12` | 48px |

---

## Bordas e sombras

| Token | Valor |
|-------|-------|
| `radius-sm` | 4px |
| `radius-md` | 8px |
| `radius-lg` | 16px |
| `radius-full` | 9999px (avatars, pills) |
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| `shadow-md` | `0 4px 12px rgba(58,37,91,0.08)` |

---

## Componentes base

### ScopeBadge

Indica se o conteúdo é **global** ou de uma **sala** específica.

- Global: fundo `school-community` (`#001489`), texto branco
- Sala: cor da frente de ensino da turma
- Texto: nome da sala ou "Toda a escola"

### PostCard

Card de publicação estilo feed.

- Avatar do autor (círculo, `radius-full`)
- Nome + papel + timestamp (`text-muted`)
- Conteúdo (máx. 280 caracteres no MVP)
- ScopeBadge no canto superior
- Ações: curtir, comentar (futuro)

### BulletinPin

Recado do mural — visualmente mais destacado que um post.

- Borda esquerda 4px `accent` (`#27AAE1`)
- Ícone de pin quando fixado
- Título em negrito + corpo
- Data de expiração visível se houver
- Fundo `surface` quando fixado

### PhotoTile

Miniatura de foto no álbum.

- Aspect ratio 1:1 ou 4:3
- Overlay com nome do álbum ao hover
- Grid responsivo (2 colunas mobile, 4+ desktop)

### EmptyState

Estado vazio amigável.

- Ilustração ou ícone em `accent`
- Título em `primary`
- Texto explicativo + CTA quando aplicável
- Exemplo: *"Nenhum recado na sua sala ainda. Que tal publicar o primeiro?"*

### Button

| Variante | Fundo | Texto | Uso |
|----------|-------|-------|-----|
| Primary | `#3A255B` | branco | Ação principal |
| Accent | `#27AAE1` | branco | Ações secundárias destacadas |
| Outline | transparente | `#3A255B` | Cancelar, voltar |
| Ghost | transparente | `#3C3F4F` | Ações terciárias |

`border-radius`: 8px (botões md), padding `12px 24px`

---

## Padrões de UX

### Navegação

```
Sidebar (desktop) / Bottom nav (mobile)
├── Feed (publicações)
├── Mural
├── Fotos
├── Minhas salas
│   └── [Sala X]
│       ├── Feed
│       ├── Mural
│       └── Fotos
└── Perfil
```

### Hierarquia de conteúdo

1. **Comunicado fixado no mural** — topo, destaque visual
2. **Publicação recente no feed** — ordem cronológica
3. **Foto em álbum** — agrupada por evento/data

### Feed vs Mural

| | Feed (posts) | Mural (bulletin) |
|---|-------------|------------------|
| Tom | Social, conversacional | Institucional, informativo |
| Tamanho | Curto (tweet) | Título + corpo |
| Fixação | Não | Sim (professor/coordenação) |
| Expiração | Não | Opcional |

### Tom de voz (microcopy)

Inspirado no Instituto J&F — direto, acolhedor, focado em aprendizagem:

- ✅ *"Publique na sua sala"*
- ✅ *"Compartilhe com a escola"*
- ✅ *"Nenhum recado por aqui — seja o primeiro a avisar a turma"*
- ❌ *"Postar"* (muito genérico de rede social)
- ❌ *"Deploy realizado"* (jargão técnico)

---

## Acessibilidade

- Contraste mínimo 4.5:1 para texto normal
- Foco visível em todos os elementos interativos (outline `accent`)
- Labels em todos os inputs
- Imagens com `alt` descritivo
- Suporte a `prefers-reduced-motion`

---

## Referências

- Site institucional: https://institutojef.org.br/
- Fonte: Inter (Google Fonts)
- Tema WordPress: `2026-instituto-jef`
