"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#nano-slide", label: "Nano Slide" },
  { href: "/#for-who", label: "Who it's for" },
  { href: "/#mike", label: "Mike & Tamanui" },
  { href: "/#bundle", label: "Bundle" },
];

export function SiteHeader() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 border-b border-purple/10 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-ink-muted transition hover:text-purple"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-ocean/10 px-3 py-1 text-xs font-semibold text-ocean sm:inline">
            🇺🇸 USA launch
          </span>
          <Link
            href="/cart"
            className="relative inline-flex items-center justify-center rounded-full bg-purple p-2.5 text-white shadow-brand transition hover:bg-purple-deep"
            aria-label={`Cart${mounted && count ? `, ${count} items` : ""}`}
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-khaki px-1 text-[11px] font-bold text-ink">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
