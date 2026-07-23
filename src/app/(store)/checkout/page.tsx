"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatMoney, getProductById } from "@/lib/products";
import { getEnabledMarkets } from "@/lib/markets";
import type { MarketCode } from "@/lib/types";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markets = getEnabledMarkets();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-content px-4 py-20">
        <p className="text-ink-muted">Loading checkout…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-content px-4 py-20 text-center">
        <p className="text-ink-muted">Nothing to check out yet.</p>
        <Link href="/product/pre-launch-bundle" className="mt-4 inline-block text-purple font-semibold">
          Shop the bundle
        </Link>
      </div>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    // One-product checkout for now — expand when catalog grows
    const primary = items[0];
    const product = getProductById(primary.productId);
    if (!product) {
      setError("Product missing from cart");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: primary.productId,
          quantity: items.reduce((n, i) => n + i.quantity, 0),
          shippingAddress: {
            firstName: String(form.get("firstName") || ""),
            lastName: String(form.get("lastName") || ""),
            email: String(form.get("email") || ""),
            phone: String(form.get("phone") || ""),
            line1: String(form.get("line1") || ""),
            line2: String(form.get("line2") || ""),
            city: String(form.get("city") || ""),
            state: String(form.get("state") || ""),
            postalCode: String(form.get("postalCode") || ""),
            country: String(form.get("country") || "US") as MarketCode,
          },
          notes: String(form.get("notes") || ""),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      clear();
      router.push(`/order-confirmation/${data.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-aussie-wash min-h-[70vh] py-12 sm:py-16">
      <div className="mx-auto grid max-w-content gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={onSubmit} className="rounded-2xl border border-purple/15 bg-white p-6 sm:p-8">
          <h1 className="font-display text-3xl font-bold text-ink">Checkout</h1>
          <p className="mt-2 text-sm text-ink-muted">
            USA shipping included. Payment is simulated for this pre-launch storefront — swap in Stripe when you&apos;re ready.
          </p>

          <fieldset className="mt-8 space-y-4">
            <legend className="font-display text-sm font-bold uppercase tracking-wide text-purple">
              Contact
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="firstName" label="First name" required />
              <Field name="lastName" label="Last name" required />
            </div>
            <Field name="email" label="Email" type="email" required />
            <Field name="phone" label="Phone" type="tel" />
          </fieldset>

          <fieldset className="mt-8 space-y-4">
            <legend className="font-display text-sm font-bold uppercase tracking-wide text-purple">
              Shipping
            </legend>
            <Field name="line1" label="Address" required />
            <Field name="line2" label="Apartment, suite, etc." />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="city" label="City" required />
              <label className="block text-sm">
                <span className="font-semibold text-ink">State</span>
                <select
                  name="state"
                  required
                  className="mt-1 w-full rounded-md border border-purple/20 bg-white px-3 py-2.5"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="postalCode" label="ZIP code" required />
              <label className="block text-sm">
                <span className="font-semibold text-ink">Country</span>
                <select
                  name="country"
                  className="mt-1 w-full rounded-md border border-purple/20 bg-white px-3 py-2.5"
                  defaultValue="US"
                >
                  {markets.map((m) => (
                    <option key={m.code} value={m.code}>
                      {m.flag} {m.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block text-sm">
              <span className="font-semibold text-ink">Order notes</span>
              <textarea
                name="notes"
                rows={3}
                className="mt-1 w-full rounded-md border border-purple/20 px-3 py-2.5"
                placeholder="Gate code, dogs on premises, etc."
              />
            </label>
          </fieldset>

          {error && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full rounded-md bg-purple px-5 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-white hover:bg-purple-deep disabled:opacity-60"
          >
            {submitting ? "Placing order…" : `Place order — ${formatMoney(subtotal())}`}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-purple/15 bg-white p-6">
          <h2 className="font-display text-lg font-bold text-ink">Order summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((item) => {
              const p = getProductById(item.productId);
              if (!p) return null;
              return (
                <li key={item.productId} className="flex justify-between gap-4">
                  <span>
                    {p.title} × {item.quantity}
                  </span>
                  <span className="font-semibold">
                    {formatMoney(p.price.amount * item.quantity)}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex justify-between border-t border-purple/10 pt-4 font-display text-xl font-bold text-purple">
            <span>Total</span>
            <span>{formatMoney(subtotal())}</span>
          </div>
          <p className="mt-2 text-xs text-ocean font-semibold">
            Shipping included across the USA
          </p>
        </aside>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="font-semibold text-ink">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-md border border-purple/20 px-3 py-2.5"
      />
    </label>
  );
}
