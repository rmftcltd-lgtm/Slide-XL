"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";

type Props = {
  productId: string;
  label?: string;
  className?: string;
  redirectToCart?: boolean;
  redirectToCheckout?: boolean;
};

export function AddToCartButton({
  productId,
  label = "Add Pre-Launch Bundle",
  className = "",
  redirectToCart = false,
  redirectToCheckout = false,
}: Props) {
  const addItem = useCart((s) => s.addItem);
  const router = useRouter();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        addItem(productId, 1);
        setAdded(true);
        if (redirectToCheckout) {
          router.push("/checkout");
          return;
        }
        if (redirectToCart) {
          router.push("/cart");
          return;
        }
        window.setTimeout(() => setAdded(false), 1800);
      }}
      className={`inline-flex items-center justify-center rounded-md bg-purple px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-white shadow-brand transition hover:bg-purple-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple ${className}`}
    >
      {added ? "Added — crikey!" : label}
    </button>
  );
}
