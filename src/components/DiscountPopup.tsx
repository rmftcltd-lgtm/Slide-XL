"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { AddToCartButton } from "./AddToCartButton";
import { OfferCountdown } from "./OfferCountdown";
import {
  isOfferUnlocked,
  OFFER_DISMISSED_KEY,
  unlockOffer,
} from "@/lib/offer";
import { getProductByHandle } from "@/lib/products";

type Step = "pick" | "email" | "reveal";

export function DiscountPopup() {
  const product = getProductByHandle("pre-launch-bundle")!;
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("pick");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);

  useEffect(() => {
    if (isOfferUnlocked()) return;
    try {
      if (sessionStorage.getItem(OFFER_DISMISSED_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    const id = window.setTimeout(() => setOpen(true), 1500);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  function close(dismiss: boolean) {
    setOpen(false);
    if (dismiss) {
      try {
        sessionStorage.setItem(OFFER_DISMISSED_KEY, "1");
      } catch {
        /* ignore */
      }
    }
  }

  function onPick(index: number) {
    setSelectedBox(index);
    window.setTimeout(() => setStep("email"), 420);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter a valid email address to unlock your deal.");
      return;
    }
    setSubmitting(true);
    setError("");
    unlockOffer(value);
    setStep("reveal");
    setSubmitting(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={() => close(true)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="deal-popup-title"
        className="relative z-10 max-h-[min(92vh,46rem)] w-full max-w-md overflow-auto rounded-2xl bg-[linear-gradient(180deg,#7a3aa8_0%,#5a2480_38%,#f4eef8_72%,#faf7fc_100%)] px-5 pt-5 text-center shadow-[0_28px_80px_-28px_rgba(26,18,37,0.65)]"
      >
        <button
          type="button"
          onClick={() => close(true)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md bg-white/20 text-2xl leading-none text-white"
          aria-label="Close"
        >
          ×
        </button>

        <div className="mb-3 flex flex-col items-center gap-1 text-white">
          <Image
            src="/images/slide-xl-logo.png"
            alt="Slide XL"
            width={64}
            height={64}
            className="h-14 w-14 object-contain"
          />
          <span className="font-display text-sm font-bold uppercase tracking-[0.08em]">
            Slide <span className="text-khaki">XL</span>
          </span>
        </div>

        {step === "pick" && (
          <div>
            <h2
              id="deal-popup-title"
              className="mx-2 mb-4 font-display text-[clamp(1.35rem,5vw,1.7rem)] font-extrabold uppercase tracking-tight text-white"
            >
              Pick one to reveal your discount
            </h2>
            <div className="mb-4 grid grid-cols-3 gap-3 px-1">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  type="button"
                  disabled={selectedBox !== null}
                  onClick={() => onPick(i)}
                  aria-label={`Mystery box ${i + 1}`}
                  className={`aspect-square rounded-xl bg-[linear-gradient(160deg,#9b5ec4_0%,#6b2d91_55%,#4a1d68_100%)] font-display text-[clamp(2rem,8vw,2.6rem)] font-extrabold text-white shadow-[0_14px_30px_-16px_rgba(26,18,37,0.55)] transition hover:-translate-y-0.5 ${
                    selectedBox === i ? "outline outline-2 outline-offset-2 outline-white" : ""
                  } ${selectedBox === i ? "animate-pulse" : ""}`}
                >
                  ?
                </button>
              ))}
            </div>
            <div className="-mx-5 overflow-hidden rounded-b-2xl">
              <Image
                src="/images/bundle-flatlay.png"
                alt="Slide XL Pre-Launch Bundle"
                width={900}
                height={600}
                className="h-auto max-h-56 w-full object-cover"
                priority
              />
            </div>
          </div>
        )}

        {step === "email" && (
          <div>
            <p className="font-display text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white/90">
              Nice pick
            </p>
            <h2
              id="deal-popup-title"
              className="mb-4 mt-1 font-display font-extrabold uppercase tracking-tight"
            >
              <span className="block text-base text-white/90">You&apos;ve got a</span>
              <span className="mt-1 block text-[clamp(1.6rem,6vw,2rem)] text-white">
                Special discount
              </span>
            </h2>
            <form onSubmit={onSubmit} className="mb-4 grid gap-3 text-left">
              <label className="sr-only" htmlFor="deal-popup-email">
                Email address
              </label>
              <input
                id="deal-popup-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-purple/20 bg-white px-4 py-3.5 text-ink outline-none focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-purple/40"
              />
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-md bg-purple px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-white shadow-brand transition hover:bg-purple-deep disabled:opacity-70"
              >
                {submitting ? "Unlocking…" : "Continue"}
              </button>
              <p className="text-center text-xs leading-snug text-ink-muted">
                Enter your email to unlock the Pre-Launch Bundle deal. Unsubscribe
                anytime.
              </p>
              {error ? (
                <p className="text-center text-sm text-red-700">{error}</p>
              ) : null}
            </form>
            <div className="-mx-5 overflow-hidden rounded-b-2xl">
              <Image
                src="/images/bundle-flatlay.png"
                alt=""
                width={900}
                height={600}
                className="h-auto max-h-40 w-full object-cover"
              />
            </div>
          </div>
        )}

        {step === "reveal" && (
          <div className="-mx-5 rounded-b-2xl bg-[linear-gradient(180deg,transparent_0%,rgba(250,247,252,0.92)_18%,#faf7fc_100%)] px-5 pb-4 pt-1">
            <p className="font-display text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-purple">
              Unlocked
            </p>
            <h2
              id="deal-popup-title"
              className="mt-1 font-display text-[clamp(1.4rem,4.5vw,1.75rem)] font-extrabold tracking-tight text-ink"
            >
              Your Pre-Launch Bundle deal
            </h2>
            <p className="mt-2 text-ink-muted">{product.subtitle}</p>
            <div className="mt-3 flex flex-wrap items-baseline justify-center gap-2">
              <span className="font-display text-3xl font-extrabold text-purple">
                ${product.price.amount.toFixed(2)} USD
              </span>
              <span className="text-sm text-ink-muted line-through">
                ${product.compareAtPrice.amount.toFixed(2)} USD RRP
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-ocean">
              Including shipping right across the USA
            </p>
            <div className="flex justify-center">
              <OfferCountdown theme="ink" />
            </div>
            <div className="mt-4">
              <AddToCartButton
                productId={product.id}
                label={`Grab the Bundle — $${product.price.amount}`}
                redirectToCheckout
                className="w-full"
              />
            </div>
            <button
              type="button"
              onClick={() => close(false)}
              className="mt-3 w-full bg-transparent text-sm text-ink-muted underline"
            >
              Keep browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
