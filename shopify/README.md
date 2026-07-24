# Shopify deployment (Slide XL)

Deploy the branded Online Store 2.0 theme and Pre-Launch Bundle product to your Shopify store.

## What's included

- `shopify/theme` — Slide XL Liquid theme (Mike & Tamanui campaign, purple/white brand)
- `shopify/scripts/create-product.mjs` — creates/updates the **Pre-Launch Bundle** ($149.95 / compare-at $219.70)
- `shopify/scripts/deploy.sh` — pushes theme + runs product script

Bundle contents (single Shopify product):
| Item | RRP |
| --- | --- |
| Slide XL mop with head | $89.95 |
| 4× mop head refills | $24.95 ea |
| Collapsible bucket | $29.95 |
| **Live price** | **$149.95 USD** (shipping included USA) |

> Note: if the Shopify shop currency is still NZD, the deploy script pins a **United States** market price list so customers see **$149.95 USD** (not an NZD→USD conversion).

## One-time Shopify setup

1. Create / open your Shopify store (USA market).
2. Create a **custom app** (Settings → Apps → Develop apps):
   - Admin API scopes: `read_products`, `write_products`, `read_themes`, `write_themes`, `write_files`
   - Install the app → copy the **Admin API access token** (`shpat_…`)
3. Optional Theme Access app password can also be used for `shopify theme push` as `SHOPIFY_CLI_THEME_TOKEN`.

## Deploy

```bash
export SHOPIFY_STORE="your-store.myshopify.com"
export SHOPIFY_ADMIN_TOKEN="shpat_xxxxxxxx"
# optional if using Theme Access password instead of browser login:
# export SHOPIFY_CLI_THEME_TOKEN="shptka_xxxxxxxx"

chmod +x shopify/scripts/deploy.sh
./shopify/scripts/deploy.sh
```

Or stepwise:

```bash
# Theme
cd shopify/theme
npx shopify theme push --unpublished --theme "Slide XL" --store "$SHOPIFY_STORE"

# Product
SHOPIFY_STORE=... SHOPIFY_ADMIN_TOKEN=... node ../scripts/create-product.mjs
```

## After push

1. **Publish** the `Slide XL` theme in Admin → Online Store → Themes
2. Theme editor → assign **Pre-Launch Bundle** to Hero + Bundle offer sections
3. **Shipping**: Settings → Shipping and delivery → create a free shipping rate for United States (match the $149.95 incl. shipping promise)
4. **Payments**: enable Shopify Payments (or Bogus Gateway for testing)
5. Store name / domain: set brand to **Slide XL**

## Local theme preview

```bash
cd shopify/theme
npx shopify theme dev --store "$SHOPIFY_STORE"
```
