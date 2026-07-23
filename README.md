# Slide XL

Aussie-invented pet mop storefront for the USA pre-launch — built like a lightweight Shopify: storefront, cart, checkout, and admin.

## Product

**Pre-Launch Bundle — $149.95** (incl. shipping across the USA)

| Component | RRP |
| --- | --- |
| Slide XL mop with head | $89.95 |
| 4× mop head refills | $24.95 ea |
| Collapsible bucket | $29.95 |
| **Bundle compare-at** | **$219.70** |

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Zustand cart (persisted)
- File-backed order store in `/data` (Shopify-style admin without locking you into Shopify yet)
- Market registry (`US` live; `AU` / `CA` / `GB` / `NZ` stubbed for expansion)

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Admin

- URL: `/admin`
- Default password: `slidexl-admin`
- Override with env `ADMIN_PASSWORD`

## Scripts

- `npm run dev` — local storefront
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint

## Brand notes

- Inventor: Michael Clegg — **Mike the Mop King**
- Campaign co-star: **Tamanui**
- Look: royal purple + white product identity, Aussie adventure energy
- Positioning: pet owners first; also barbers, timber & tile homes
- Messaging inspired by the sweep/mop/dry + pet-hair release thinking of earlier Aussie PVA mops — Slide XL is positioned as V4.0 (larger head, longer mop) without referencing prior brand names on-site
