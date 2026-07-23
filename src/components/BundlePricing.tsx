import type { Product } from "@/lib/types";
import { formatMoney, savingsAmount } from "@/lib/products";

type Props = {
  product: Product;
  compact?: boolean;
};

export function BundlePricing({ product, compact = false }: Props) {
  const savings = savingsAmount(product);

  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      <div className="flex flex-wrap items-end gap-3">
        <p className="font-display text-4xl font-extrabold text-purple sm:text-5xl">
          {formatMoney(product.price.amount)}
        </p>
        <p className="pb-1 text-lg text-ink-muted line-through">
          {formatMoney(product.compareAtPrice.amount)} RRP
        </p>
        <span className="mb-1 rounded bg-ocean px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
          Save {formatMoney(savings)}
        </span>
      </div>
      <p className="text-sm font-semibold text-ocean">{product.shippingNote}</p>
      {!compact && (
        <ul className="divide-y divide-purple/10 rounded-lg border border-purple/15 bg-white/70">
          {product.components.map((c) => (
            <li
              key={c.id}
              className="flex items-start justify-between gap-4 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-semibold text-ink">
                  {c.quantity > 1 ? `${c.quantity}× ` : ""}
                  {c.name}
                </p>
                <p className="text-ink-muted">{c.description}</p>
              </div>
              <p className="shrink-0 font-medium text-ink-muted">
                {formatMoney(c.rrp.amount)}
                {c.quantity > 1 ? " ea" : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
