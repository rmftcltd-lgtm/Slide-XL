# Slide-XL

Slide XL — the collaborative presentation studio website. A modern single-page
marketing site built with **Vite + React + TypeScript**, featuring an interactive
slide-deck demo and a waitlist signup flow.

## Tech stack

- [Vite](https://vite.dev/) (dev server + build)
- [React 19](https://react.dev/) + TypeScript
- [Vitest](https://vitest.dev/) + Testing Library (unit/component tests)
- [oxlint](https://oxc.rs/docs/guide/usage/linter) (linting)

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:5173
```

## Scripts

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `npm run dev`      | Start the Vite dev server (HMR)              |
| `npm run build`    | Type-check (`tsc -b`) and build for prod     |
| `npm run preview`  | Preview the production build locally         |
| `npm run lint`     | Run oxlint                                    |
| `npm test`         | Run the test suite once (Vitest)             |
| `npm run test:watch` | Run tests in watch mode                    |

## Project structure

```
src/
  App.tsx                 # Landing page layout
  components/
    SlideDeck.tsx         # Interactive slide carousel
    WaitlistForm.tsx      # Waitlist signup form
  data/slides.ts          # Demo slide content
  App.test.tsx            # Component tests
  test/setup.ts           # Testing Library setup
```
