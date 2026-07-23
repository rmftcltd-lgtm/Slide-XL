"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatMoney, getProductById } from "@/lib/products";

export default function CartPage() {
  const { items, setQuantity, removeItem, clear, subtotal } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-content px-4 py-20 sm:px-6">
        <p className="text-ink-muted">Loading cart…</p>
      </div>
    );
  }

  const total = subtotal();

  return (
    <div className="bg-aussie-wash min-h-[70vh] py-12 sm:py-16">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          Your cart
        </h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-purple/15 bg-white p-10 text-center">
            <p className="text-ink-muted">Cart&apos;s emptier than a floor after Slide XL.</p>
            <Link
              href="/product/pre-launch-bundle"
              className="mt-6 inline-flex rounded-md bg-purple px-5 py-3 text-sm font-bold uppercase tracking-wide text-white"
            >
              Shop the Pre-Launch Bundle
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
            <ul className="space-y-4">
              {items.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;
                return (
                  <li
                    key={item.productId}
                    className="flex flex-col gap-4 rounded-2xl border border-purple/15 bg-white p-4 sm:flex-row sm:items-center"
                  >
                    <Image
                      src={product.images[0]}
                      alt=""
                      width={160}
                      height={120}
                      className="h-28 w-full rounded-lg object-cover sm:w-40"
                    />
                    <div className="flex-1">
                      <h2 className="font-display text-lg font-bold text-ink">
                        {product.title}
                      </h2>
                      <p className="text-sm text-ink-muted">
                        {formatMoney(product.price.amount)} · shipping included (USA)
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <label className="text-sm font-semibold text-ink">
                          Qty{" "}
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={item.quantity}
                            onChange={(e) =>
                              setQuantity(
                                item.productId,
                                Number(e.target.value) || 1,
                              )
                            }
                            className="ml-2 w-16 rounded border border-purple/20 px-2 py-1"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-sm font-semibold text-purple underline-offset-2 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="font-display text-xl font-bold text-ink">
                      {formatMoney(product.price.amount * item.quantity)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <aside className="h-fit rounded-2xl border border-purple/15 bg-white p-6 shadow-brand">
              <h2 className="font-display text-lg font-bold text-ink">Summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Subtotal</dt>
                  <dd className="font-semibold">{formatMoney(total)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Shipping (USA)</dt>
                  <dd className="font-semibold text-ocean">Included</dd>
                </div>
                <div className="flex justify-between border-t border-purple/10 pt-3 text-base">
                  <dt className="font-bold">Total</dt>
                  <dd className="font-display text-2xl font-bold text-purple">
                    {formatMoney(total)}
                  </dd>
                </div>
              </dl>
              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center rounded-md bg-purple px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-purple-deep"
              >
                Checkout
              </Link>
              <button
                type="button"
                onClick={() => clear()}
                className="mt-3 w-full text-center text-sm text-ink-muted hover:text-purple"
              >
                Clear cart
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
