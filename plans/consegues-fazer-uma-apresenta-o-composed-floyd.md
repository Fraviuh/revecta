# Plan: MobilityService Pitch Deck (12 slides, animated)

## Context
Build a full animated pitch deck for **MobilityService** — a B2B/B2C electric vehicle mobility platform with a driver mode and a fleet/company mode. The deck will be used for an incubator pitch. The existing app is a blank canvas (App.tsx placeholder, only Tailwind wired).

## Aesthetic
- **Stance:** Kinetic — dark ground, light motion highlights, motion is primary
- **Background:** Animated canvas with floating EV-network nodes and glowing connection lines (pure CSS + requestAnimationFrame on a `<canvas>`)  
- **Palette:** Near-black `#080C14`, electric blue `#3B9EFF`, teal accent `#00D4AA`, white text, subtle dark card surfaces `rgba(255,255,255,0.05)`
- **Fonts (Google Fonts via CSS @import):**
  - Display: **Plus Jakarta Sans** (weights 600, 700, 800)
  - Body: **Inter** (weights 400, 500)
- **Slide transitions:** Fade + slight upward translate via CSS transitions on slide index change

## Slide Structure (12 slides)

| # | Title | Key Content |
|---|-------|-------------|
| 1 | **Capa** | Logo (⚡ icon), MobilityService, "Plataforma de Mobilidade Eléctrica Empresarial", tagline |
| 2 | **Problema** | 3 pain-point cards: fuel cost management chaos, no EV adoption tools for SMEs, manual reimbursement processes |
| 3 | **A Solução** | App mockup description + 2 modes (Condutor / Empresa), key feature bullets |
| 4 | **Tamanho de Mercado** | TAM €42B EU EV market, SAM €3.8B fleet management PT+ES, SOM €120M year 3 target |
| 5 | **Validação de Conceito / Tecnologia** | MVP built, tech stack (React, real-time mapping, charge network API), early user interest |
| 6 | **Modelo de Negócio** | SaaS subscription tiers (Driver free / Company €29/mo / Enterprise custom), revenue projections |
| 7 | **Paisagem Competitiva** | 2×2 matrix: price vs. feature depth; position MobilityService top-right vs. Fleetio, Mileiq, Kinto |
| 8 | **Estratégia de Entrada no Mercado** | 3-phase GTM: phase 1 direct B2B outreach PT, phase 2 channel partners, phase 3 EU expansion |
| 9 | **Solo Founder e Equipa** | Founder card + 3 advisor/contractor roles; "Building with lean team, advising with experts" |
| 10 | **Cronograma de Desenvolvimento** | Horizontal timeline: Q1 MVP → Q2 Beta → Q3 Launch → Q4 Scale, with milestone markers |
| 11 | **Necessidades de Incubação** | Ask: €150K seed, breakdown (dev 40%, GTM 30%, ops 20%, reserve 10%), what incubator support needed |
| 12 | **Contacto e Encerramento** | Email, LinkedIn, website; QR placeholder; closing quote about EV future |

## File Changes

### `src/index.css`
- Add `@import` for Plus Jakarta Sans and Inter (Google Fonts CSS2) at top
- Add Tailwind import after fonts
- Add custom CSS for slide transitions and scrollbar hiding

### `src/App.tsx`
Replace placeholder with full pitch deck app:
- `AnimatedBackground` component: `<canvas>` with node/line particle network animated via `requestAnimationFrame`
- `PitchDeck` component: manages `currentSlide` state (0–11), keyboard arrow navigation + click/touch nav
- `SlideNav`: dot indicators bottom-center, prev/next chevron buttons
- 12 slide components (inline, not separate files — deck is self-contained):
  - Each slide: `position: fixed` or `absolute` full-screen, z-index over canvas, fade/translate transition
  - Uses `bg-card` surface cards with `backdrop-blur-sm` for glass effect

## Key Implementation Notes
- Canvas animation: draw ~40 nodes at random positions, animate slow drift, draw lines between nodes within 200px radius, pulse opacity on nearest nodes to cursor
- Slide transition: CSS `transition-opacity duration-500` + `translate-y-2` entering → `translate-y-0`; exit opposite direction
- Keyboard: `ArrowRight`/`ArrowLeft` and `Space` to advance
- All content in Portuguese (PT)
- No external chart library needed — competitive matrix is pure CSS grid; timeline is CSS flexbox with styled markers

## Verification
1. Open preview → slides render with animated background
2. Arrow keys / clicks navigate all 12 slides
3. Background canvas animates continuously behind all slides
4. Text is readable (white on dark, sufficient contrast)
5. No build errors
