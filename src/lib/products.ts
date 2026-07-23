import type { Product } from "./types";

const MOP_RRP = 89.95;
const REFILL_RRP = 24.95;
const BUCKET_RRP = 29.95;
const REFILL_QTY = 4;

export const COMPARE_AT =
  MOP_RRP + REFILL_RRP * REFILL_QTY + BUCKET_RRP; /* 219.70 */

export const BUNDLE_PRICE = 149.95;

export const products: Product[] = [
  {
    id: "prod_prelaunch_bundle",
    handle: "pre-launch-bundle",
    title: "Slide XL Pre-Launch Bundle",
    subtitle: "Mop + 4 refills + collapsible bucket — shipped free across the USA",
    description:
      "The all-in-one Pre-Launch Bundle built for pet parents who are done vacuuming before every mop. Sweep, mop, and dry in one pass. Pet hair grabs onto the XL head — then drops off the moment it hits water. Longer handle, larger head, purple-and-white finish. Invented by Mike the Mop King. Stress-tested by Tamanui.",
    images: [
      "/images/bundle-flatlay.png",
      "/images/mop-action-wood.png",
      "/images/mop-action-tile.png",
      "/images/mike-tamanui-coast.png",
      "/images/before-after-tamanui.png",
    ],
    components: [
      {
        id: "comp_mop",
        name: "Slide XL Mop with head",
        rrp: { amount: MOP_RRP, currency: "USD" },
        quantity: 1,
        description: "XL head, longer pole, slide-wringer, purple & white.",
      },
      {
        id: "comp_refills",
        name: "Mop head refills",
        rrp: { amount: REFILL_RRP, currency: "USD" },
        quantity: REFILL_QTY,
        description: "Extra ridged heads ready for heavy shedding seasons.",
      },
      {
        id: "comp_bucket",
        name: "Collapsible bucket",
        rrp: { amount: BUCKET_RRP, currency: "USD" },
        quantity: 1,
        description: "Purple & white wheeled bucket that folds flat for storage.",
      },
    ],
    price: { amount: BUNDLE_PRICE, currency: "USD" },
    compareAtPrice: { amount: COMPARE_AT, currency: "USD" },
    shippingIncluded: true,
    shippingNote: "Including shipping right across the USA",
    tags: ["pre-launch", "bundle", "pet", "usa"],
    status: "active",
    inventory: 500,
  },
];

export function getProductByHandle(handle: string): Product | undefined {
  return products.find((p) => p.handle === handle);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getActiveProducts(): Product[] {
  return products.filter((p) => p.status === "active");
}

export function formatMoney(
  amount: number,
  currency = "USD",
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

export function savingsAmount(product: Product): number {
  return Math.max(0, product.compareAtPrice.amount - product.price.amount);
}
