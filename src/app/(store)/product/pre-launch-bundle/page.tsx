import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { BundlePricing } from "@/components/BundlePricing";
import { getProductByHandle } from "@/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pre-Launch Bundle",
  description:
    "Slide XL mop, 4 refills, and collapsible bucket for $149.95 including shipping across the USA.",
};

export default function ProductPage() {
  const product = getProductByHandle("pre-launch-bundle");
  if (!product) notFound();

  return (
    <div className="bg-aussie-wash pb-20">
      <div className="mx-auto grid max-w-content gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-16">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl bg-white shadow-brand">
            <Image
              src={product.images[0]}
              alt={product.title}
              width={1536}
              height={1024}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {product.images.slice(1).map((src) => (
              <div key={src} className="overflow-hidden rounded-lg bg-white">
                <Image
                  src={src}
                  alt=""
                  width={400}
                  height={300}
                  className="aspect-[4/3] h-auto w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-purple">
            USA Pre-Launch · Limited offer
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink">
            {product.title}
          </h1>
          <p className="mt-3 text-lg text-ink-muted">{product.subtitle}</p>
          <div className="mt-8">
            <BundlePricing product={product} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <AddToCartButton
              productId={product.id}
              label="Add to cart — $149.95"
            />
            <AddToCartButton
              productId={product.id}
              label="Buy now"
              redirectToCart
              className="bg-ink hover:bg-ink/90"
            />
          </div>
          <div className="mt-10 space-y-4 text-ink-muted leading-relaxed">
            <p>{product.description}</p>
            <p>
              Ideal for pet owners, barbers, and anyone with timber or tile who
              wants floors done without the vacuum-then-mop two-step.
            </p>
          </div>
          <dl className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              ["Handle", "Longer XL reach"],
              ["Head", "Larger ridged pad"],
              ["Finish", "Purple & white"],
              ["Shipping", "Included (USA)"],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-purple/15 pt-3">
                <dt className="text-xs font-bold uppercase tracking-wide text-purple">
                  {k}
                </dt>
                <dd className="mt-1 font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
