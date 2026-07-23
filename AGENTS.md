# AGENTS.md

## Cursor Cloud specific instructions

Slide XL is a single web app (Vite + React + TypeScript). There is only one
service to run.

- Standard commands live in `package.json` scripts and are documented in
  `README.md` (`dev`, `build`, `preview`, `lint`, `test`, `test:watch`). Prefer
  those over ad-hoc invocations.
- The Vite dev server runs on `http://localhost:5173` (`npm run dev`). Start it
  in a long-lived session (e.g. tmux) since it is a foreground watcher.
- Test/lint config split (non-obvious): this project uses **Vite 8
  (rolldown-based)**. Vitest bundles a different Vite version, which causes a
  TypeScript plugin-type conflict if the `test` field is placed in
  `vite.config.ts`. Vitest config therefore lives in a **separate
  `vitest.config.ts`**; keep `vite.config.ts` free of any `test` field so
  `npm run build` (`tsc -b`) stays green.
- Linting uses **oxlint** (not ESLint), configured via `.oxlintrc.json`.
