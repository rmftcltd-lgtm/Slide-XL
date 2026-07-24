#!/usr/bin/env bash
# Deploy Slide XL theme + create Pre-Launch Bundle on Shopify.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
THEME_DIR="$ROOT/theme"

if [[ -z "${SHOPIFY_STORE:-}" ]]; then
  echo "Set SHOPIFY_STORE (e.g. your-store.myshopify.com)"
  exit 1
fi

STORE="${SHOPIFY_STORE#https://}"
STORE="${STORE%/}"

echo "==> Pushing theme to $STORE"
cd "$THEME_DIR"

PUSH_ARGS=(theme push --path . --store "$STORE" --unpublished --theme "Slide XL" --json --allow-live)
if [[ -n "${SHOPIFY_CLI_THEME_TOKEN:-}" ]]; then
  PUSH_ARGS+=(--password "$SHOPIFY_CLI_THEME_TOKEN")
fi

npx --yes @shopify/cli@latest "${PUSH_ARGS[@]}" | tee /tmp/shopify-theme-push.json

echo
echo "==> Creating / updating Pre-Launch Bundle product"
if [[ -n "${SHOPIFY_ADMIN_TOKEN:-}" ]]; then
  node "$ROOT/scripts/create-product.mjs"
else
  echo "SHOPIFY_ADMIN_TOKEN not set — skipping product API create."
  echo "Create the product manually or re-run with an Admin API token (write_products)."
fi

echo
echo "Next in Shopify Admin:"
echo "  1. Online Store → Themes → publish 'Slide XL'"
echo "  2. Settings → Shipping → free shipping rate for United States"
echo "  3. Settings → Payments → enable Shopify Payments / test provider"
echo "  4. In the theme editor, assign the Pre-Launch Bundle product to Hero + Bundle sections"
