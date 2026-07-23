import Link from "next/link";
import { Logo } from "./Logo";
import { markets } from "@/lib/markets";

export function SiteFooter() {
  return (
    <footer className="border-t border-purple/10 bg-ink text-white">
      <div className="mx-auto grid max-w-content gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="text-white">
            <Logo className="text-white" />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            Aussie-invented. USA-bound. Built for pet hair, timber, tile, and
            the kind of mess Tamanui leaves behind. Invented by Mike the Mop
            King — Slide XL V4.0.
          </p>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-khaki">
            Shop
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>
              <Link href="/product/pre-launch-bundle" className="hover:text-white">
                Pre-Launch Bundle
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-white">
                Admin
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-khaki">
            Markets
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            {markets.map((m) => (
              <li key={m.code} className="flex items-center gap-2">
                <span>{m.flag}</span>
                <span>{m.name}</span>
                <span
                  className={`text-xs ${m.enabled ? "text-emerald-300" : "text-white/40"}`}
                >
                  {m.enabled ? "Live" : "Soon"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/45 sm:px-6">
        © {new Date().getFullYear()} Slide XL · Crikey, it&apos;s clean · Shipping
        currently available across the United States
      </div>
    </footer>
  );
}
