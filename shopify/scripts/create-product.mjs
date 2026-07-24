#!/usr/bin/env node
/**
 * Create / update the Slide XL Pre-Launch Bundle via Admin API.
 *
 * Auth (either):
 *   SHOPIFY_ADMIN_TOKEN=shpat_...
 * or client credentials (Dev Dashboard apps):
 *   SHOPIFY_CLIENT_ID=...
 *   SHOPIFY_CLIENT_SECRET=shpss_...
 *   SHOPIFY_STORE=your-store.myshopify.com
 */
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const THEME_ASSETS = path.join(ROOT, "theme", "assets");

const STORE = (process.env.SHOPIFY_STORE || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
const API = "2025-01";

const HANDLE = "pre-launch-bundle";
const PRICE = "149.95";
const COMPARE = "219.70";

const DESCRIPTION = `
<p>The all-in-one Pre-Launch Bundle built for pet parents who are done vacuuming before every mop. Sweep, mop, and dry in one pass. Pet hair grabs onto the XL head — then drops off the moment it hits water.</p>
<ul>
  <li>Slide XL mop with head — RRP $89.95</li>
  <li>4× mop head refills — RRP $24.95 each</li>
  <li>Collapsible wheeled bucket — RRP $29.95</li>
</ul>
<p><strong>Bundle $149.95 including shipping right across the USA.</strong></p>
<p>Invented by Mike the Mop King. Stress-tested by Tamanui. Longer handle, larger head, purple-and-white finish.</p>
`.trim();

const IMAGE_FILES = [
  "bundle-flatlay.png",
  "mop-action-wood.png",
  "mop-action-tile.png",
  "mike-tamanui-coast.png",
  "before-after-tamanui.png",
];

async function getAdminToken() {
  if (process.env.SHOPIFY_ADMIN_TOKEN) return process.env.SHOPIFY_ADMIN_TOKEN;
  const id = process.env.SHOPIFY_CLIENT_ID;
  const secret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!id || !secret || !STORE) {
    throw new Error(
      "Set SHOPIFY_ADMIN_TOKEN or SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET + SHOPIFY_STORE",
    );
  }
  const res = await fetch(`https://${STORE}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: id,
      client_secret: secret,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(`Token exchange failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function shopify(token, method, route, body) {
  const res = await fetch(`https://${STORE}/admin/api/${API}${route}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`${method} ${route} → ${res.status}: ${text.slice(0, 500)}`);
  }
  return data;
}

async function graphql(token, query, variables) {
  return shopify(token, "POST", "/graphql.json", { query, variables });
}

/**
 * Shop currency may be NZD while the USA market sells in USD.
 * Without a market price list, Shopify converts 149.95 NZD → ~$88 USD.
 * Pin the USA market catalog to the intended USD amounts.
 */
async function ensureUsdMarketPrices(token, productGid, variantGid) {
  const CATALOG_TITLE = "United States USD";
  const PRICE_LIST_NAME = "US Dollar prices";

  const marketsRes = await graphql(
    token,
    `{ markets(first: 20) { nodes { id name handle primary currencySettings { baseCurrency { currencyCode } } catalogs(first: 10) { nodes { id title status priceList { id name currency } } } } } }`,
  );
  const markets = marketsRes?.data?.markets?.nodes || [];
  const usMarket =
    markets.find((m) => m.handle === "united-states" || m.name === "United States") ||
    markets.find((m) => m.primary);
  if (!usMarket) {
    console.warn("No United States market found — skipping USD price list.");
    return;
  }

  let catalog = (usMarket.catalogs?.nodes || []).find((c) => c.title === CATALOG_TITLE);
  if (!catalog) {
    const created = await graphql(
      token,
      `mutation($input: CatalogCreateInput!) {
        catalogCreate(input: $input) {
          catalog { id title }
          userErrors { message }
        }
      }`,
      {
        input: {
          title: CATALOG_TITLE,
          status: "ACTIVE",
          context: { marketIds: [usMarket.id] },
        },
      },
    );
    const errs = created?.data?.catalogCreate?.userErrors || [];
    if (errs.length) throw new Error(`catalogCreate: ${JSON.stringify(errs)}`);
    catalog = created.data.catalogCreate.catalog;
    console.log(`Created market catalog ${catalog.id}`);
  }

  let priceListId = catalog.priceList?.id;
  if (!priceListId) {
    const created = await graphql(
      token,
      `mutation($input: PriceListCreateInput!) {
        priceListCreate(input: $input) {
          priceList { id name currency }
          userErrors { message }
        }
      }`,
      {
        input: {
          name: PRICE_LIST_NAME,
          currency: "USD",
          catalogId: catalog.id,
          parent: {
            adjustment: { type: "PERCENTAGE_INCREASE", value: 0 },
            settings: { compareAtMode: "ADJUSTED" },
          },
        },
      },
    );
    const errs = created?.data?.priceListCreate?.userErrors || [];
    if (errs.length) throw new Error(`priceListCreate: ${JSON.stringify(errs)}`);
    priceListId = created.data.priceListCreate.priceList.id;
    console.log(`Created USD price list ${priceListId}`);
  }

  // Ensure catalog has a publication and the product is published to it
  const catNode = await graphql(
    token,
    `query($id: ID!) {
      node(id: $id) {
        ... on MarketCatalog {
          id
          publication { id }
        }
      }
    }`,
    { id: catalog.id },
  );
  let publicationId = catNode?.data?.node?.publication?.id;
  if (!publicationId) {
    const pub = await graphql(
      token,
      `mutation($input: PublicationCreateInput!) {
        publicationCreate(input: $input) {
          publication { id }
          userErrors { message }
        }
      }`,
      { input: { catalogId: catalog.id, defaultState: "ALL_PRODUCTS", autoPublish: true } },
    );
    const errs = pub?.data?.publicationCreate?.userErrors || [];
    if (errs.length) throw new Error(`publicationCreate: ${JSON.stringify(errs)}`);
    publicationId = pub.data.publicationCreate.publication.id;
  }

  await graphql(
    token,
    `mutation($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) {
        userErrors { message }
      }
    }`,
    { id: productGid, input: [{ publicationId }] },
  );

  const fixed = await graphql(
    token,
    `mutation($priceListId: ID!, $prices: [PriceListPriceInput!]!) {
      priceListFixedPricesAdd(priceListId: $priceListId, prices: $prices) {
        prices { price { amount currencyCode } compareAtPrice { amount currencyCode } }
        userErrors { message }
      }
    }`,
    {
      priceListId,
      prices: [
        {
          variantId: variantGid,
          price: { amount: PRICE, currencyCode: "USD" },
          compareAtPrice: { amount: COMPARE, currencyCode: "USD" },
        },
      ],
    },
  );
  const fixedErrs = fixed?.data?.priceListFixedPricesAdd?.userErrors || [];
  if (fixedErrs.length) throw new Error(`priceListFixedPricesAdd: ${JSON.stringify(fixedErrs)}`);

  const check = await graphql(
    token,
    `query($id: ID!) {
      product(id: $id) {
        variants(first: 1) {
          nodes {
            contextualPricing(context: { country: US }) {
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
            }
          }
        }
      }
    }`,
    { id: productGid },
  );
  const us = check?.data?.product?.variants?.nodes?.[0]?.contextualPricing;
  console.log(
    `USA storefront price: $${us?.price?.amount} ${us?.price?.currencyCode}` +
      (us?.compareAtPrice ? ` (RRP $${us.compareAtPrice.amount})` : ""),
  );
}

async function stagedUpload(token, filePath) {
  const filename = path.basename(filePath);
  const bytes = readFileSync(filePath);
  const staging = await shopify(token, "POST", "/graphql.json", {
    query: `mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets { url resourceUrl parameters { name value } }
        userErrors { field message }
      }
    }`,
    variables: {
      input: [
        {
          filename,
          mimeType: "image/png",
          httpMethod: "POST",
          resource: "PRODUCT_IMAGE",
          fileSize: String(bytes.length),
        },
      ],
    },
  });

  const target = staging?.data?.stagedUploadsCreate?.stagedTargets?.[0];
  if (!target) throw new Error(`Staged upload failed for ${filename}: ${JSON.stringify(staging)}`);

  const form = new FormData();
  for (const p of target.parameters) form.append(p.name, p.value);
  form.append("file", new Blob([bytes], { type: "image/png" }), filename);
  const up = await fetch(target.url, { method: "POST", body: form });
  if (!up.ok && up.status !== 201) {
    throw new Error(`Upload ${filename} failed: ${up.status}`);
  }
  return target.resourceUrl;
}

async function main() {
  if (!STORE) throw new Error("SHOPIFY_STORE is required");
  console.log(`Connecting to ${STORE}…`);
  const token = await getAdminToken();

  const existing = await shopify(token, "GET", `/products.json?handle=${HANDLE}&limit=1`);
  let product = existing.products?.[0];

  const payload = {
    product: {
      title: "Slide XL Pre-Launch Bundle",
      handle: HANDLE,
      body_html: DESCRIPTION,
      vendor: "Slide XL",
      product_type: "Mop Bundle",
      tags: "pre-launch,bundle,pet,usa",
      status: "active",
      variants: [
        {
          price: PRICE,
          compare_at_price: COMPARE,
          sku: "SXL-PRELAUNCH-BUNDLE",
          inventory_management: null,
          requires_shipping: true,
          taxable: true,
        },
      ],
    },
  };

  if (product) {
    payload.product.id = product.id;
    payload.product.variants[0].id = product.variants[0].id;
    console.log(`Updating product #${product.id}…`);
    const updated = await shopify(token, "PUT", `/products/${product.id}.json`, payload);
    product = updated.product;
  } else {
    console.log("Creating Pre-Launch Bundle product…");
    const created = await shopify(token, "POST", "/products.json", payload);
    product = created.product;
  }

  if ((product.images?.length || 0) < IMAGE_FILES.length) {
    console.log("Uploading product images…");
    for (const file of IMAGE_FILES) {
      const full = path.join(THEME_ASSETS, file);
      if (!existsSync(full)) {
        console.warn(`Missing asset ${file}, skipping`);
        continue;
      }
      try {
        const resourceUrl = await stagedUpload(token, full);
        await shopify(token, "POST", `/products/${product.id}/images.json`, {
          image: { src: resourceUrl },
        });
        console.log(`  + ${file}`);
      } catch (err) {
        console.warn(`  ! ${file}: ${err.message}`);
      }
    }
  }

  console.log("Pinning USA market prices in USD…");
  await ensureUsdMarketPrices(
    token,
    `gid://shopify/Product/${product.id}`,
    `gid://shopify/ProductVariant/${product.variants[0].id}`,
  );

  console.log("\nDone.");
  console.log(`Product: ${product.title}`);
  console.log(`Handle:  ${product.handle}`);
  console.log(`Price:   $${PRICE} USD (compare-at $${COMPARE} USD)`);
  console.log(`Admin:   https://${STORE}/admin/products/${product.id}`);
  console.log(`Storefront: https://${STORE}/products/${product.handle}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
