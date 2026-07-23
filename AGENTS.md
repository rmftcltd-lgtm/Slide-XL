# AGENTS.md

## Cursor Cloud specific instructions

Slide XL is a Next.js (App Router) storefront with a lightweight admin backend.
There is one Node service.

### Commands
- `npm ci` — install deps (environment install script)
- `npm run dev` — Next.js dev server at http://localhost:3000
- `npm run build` / `npm start` — production build & serve
- `npm run lint` — TypeScript check (`tsc --noEmit`)

### Notes
- Cart is client-side (Zustand); orders persist under `/data` (gitignored JSON).
- Admin: `/admin` — default password `slidexl-admin` (override with `ADMIN_PASSWORD`).
- USA is the only enabled shipping market; others are stubbed in `src/lib/markets.ts`.
- Do not reference prior Aussie mop brand names on the storefront; Slide XL is V4.0.
