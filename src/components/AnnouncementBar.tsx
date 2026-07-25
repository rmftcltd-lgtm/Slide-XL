"use client";

import Link from "next/link";
import { COMPARE_AT, BUNDLE_PRICE } from "@/lib/products";

const save = Math.round(COMPARE_AT - BUNDLE_PRICE);

export function AnnouncementBar() {
  return (
    <div className="bg-[#c9a06a] text-center font-display text-[clamp(0.72rem,2.4vw,0.86rem)] font-bold uppercase tracking-[0.04em] text-ink">
      <Link
        href="/#bundle"
        className="block px-4 py-2.5 transition hover:brightness-95"
      >
        🇺🇸 Pre-Launch Bundle — Save ${save} + Free USA Shipping 🇺🇸
      </Link>
    </div>
  );
}
