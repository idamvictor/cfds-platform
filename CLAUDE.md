# CLAUDE.md

## Required Skills

**MUST invoke these skills before writing or modifying React components:**

1. **`vercel-react-best-practices`** — Use when writing, reviewing, or refactoring any React component. Ensures optimal performance patterns (memoization, render efficiency, state management).
2. **`vercel-composition-patterns`** — Use when building reusable components, refactoring prop-heavy components, or designing component APIs. Ensures scalable composition patterns.

> If a task involves React components, invoke the relevant skill FIRST before generating code.

---

## Commands

- `npm run dev` — Start dev server (Vite)
- `npm run build` — TypeScript check + Vite production build
- `npm run lint` — ESLint
- `npm run preview` — Preview production build

## Stack

- **React 19** + TypeScript + Vite
- **Zustand** (state) — stores in `src/store/`
- **Radix UI** + shadcn/ui (components) — `src/components/ui/`
- **Tailwind CSS v4** with CSS variables
- **React Router DOM v7** — routing
- **React Hook Form** + Zod — form validation
- **TanStack React Query** — server state
- **Axios** — HTTP client
- **WebSocket + Pusher + Laravel Echo** — real-time data
- **Recharts + TradingView** — charts
- **Framer Motion** — animations
- Path alias: `@/` → `src/`

## Project Structure

```
src/
├── components/ui/       # shadcn/ui primitives
├── components/trading/  # Trading interface
├── components/mt4/      # MT4 interface
├── layouts/             # MainLayout, MT4Layout, DepositLayout
├── pages/               # Route pages by feature
├── hooks/               # Custom hooks (WebSocket, mobile, currency)
├── store/               # Zustand stores
├── services/            # API services
├── config/              # App configuration
├── types/               # TypeScript types
└── lib/                 # Utilities
```

## Key Stores

- `assetStore` — Assets, active pairs, WebSocket price updates, leverage
- `siteSettingsStore` — Branding, feature flags, MT4 mode, maintenance
- `userStore` — Auth and profile
- `tradeStore` — Positions and orders
- `dataStore` — Market data and categories

## Testing Guidelines

This project currently has no tests. When adding tests:

- Use **Vitest** + **React Testing Library** (aligned with Vite)
- Place test files next to the component: `Component.test.tsx`
- **Test behavior, not implementation** — test what the user sees and does, not internal state
- For stores: test actions and derived state, not internal structure
- For hooks: use `renderHook` from React Testing Library
- Mock WebSocket/API calls at the service layer, never mock Zustand stores directly
- Minimum for new features: test the happy path + one error state
- Run tests with `npm test` (add script: `"test": "vitest"`)

## UI Guidelines

- **Use existing shadcn/ui components** from `components/ui/` — don't create custom primitives that duplicate them
- **Mobile-first**: all new UI must be responsive. Use Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- **Dark mode**: respect the theme system (`next-themes`). Use CSS variables and Tailwind's dark mode utilities — never hardcode colors
- **Consistency**: use `cn()` from `lib/utils` for conditional classes. Use `cva` for variant-based styling
- **Animations**: use Framer Motion for transitions. Keep animations subtle (200-300ms)
- **Loading states**: always handle loading/error/empty states in data-driven components
- **Accessibility**: use Radix UI primitives for interactive elements (dialogs, dropdowns, tooltips). Ensure keyboard navigation and ARIA labels
- **Icons**: use Lucide React (`lucide-react`) — don't mix icon libraries
