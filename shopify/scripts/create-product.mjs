#!/usr/bin/env node
/**
 * Create / update the Slide XL Pre-Launch Bundle on a Shopify store via Admin API.
 *
 * Required env:
 *   SHOPIFY_STORE=your-store.myshopify.com
 *   SHOPIFY_ADMIN_TOKEN=shpat_...   (Admin API access token with write_products, write_files, read_products)
 */
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const THEME_ASSETS = path.join(ROOT, "theme", "assets");

const STORE = (process.env.SHOPIFY_STORE || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN || process.env.SHOPIFY_CLI_THEME_TOKEN || "";
const API = "2025-01";

if (!STORE || !TOKEN) {
  console.error("Missing SHOPIFY_STORE or SHOPIFY_ADMIN_TOKEN");
  process.exit(1);
}

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

async function shopify(method, route, body) {
  const res = await fetch(`https://${STORE}/admin/api/${API}${route}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN,
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

async function stagedUpload(filePath) {
  const filename = path.basename(filePath);
  const bytes = readFileSync(filePath);
  const staging = await shopify("POST", "/graphql.json", {
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
  console.log(`Connecting to ${STORE}…`);

  const existing = await shopify("GET", `/products.json?handle=${HANDLE}&limit=1`);
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
    const updated = await shopify("PUT", `/products/${product.id}.json`, payload);
    product = updated.product;
  } else {
    console.log("Creating Pre-Launch Bundle product…");
    const created = await shopify("POST", "/products.json", payload);
    product = created.product;
  }

  // Attach images if product has none (or fewer than expected)
  if ((product.images?.length || 0) < IMAGE_FILES.length) {
    console.log("Uploading product images…");
    for (const file of IMAGE_FILES) {
      const full = path.join(THEME_ASSETS, file);
      if (!existsSync(full)) {
        console.warn(`Missing asset ${file}, skipping`);
        continue;
      }
      try {
        const resourceUrl = await stagedUpload(full);
        await shopify("POST", `/products/${product.id}/images.json`, {
          image: { src: resourceUrl },
        });
        console.log(`  + ${file}`);
      } catch (err) {
        // Fallback: skip staged upload errors; theme assets still ship with the theme
        console.warn(`  ! ${file}: ${err.message}`);
      }
    }
  }

  console.log("\nDone.");
  console.log(`Product: ${product.title}`);
  console.log(`Handle:  ${product.handle}`);
  console.log(`Admin:   https://${STORE}/admin/products/${product.id}`);
  console.log(`Storefront: https://${STORE}/products/${product.handle}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
