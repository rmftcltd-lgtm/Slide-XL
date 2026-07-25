"use client";

import { useEffect, useState } from "react";
import { OFFER_DURATION_MS, OFFER_ENDS_KEY } from "@/lib/offer";

type Theme = "hero" | "ink";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function readEndsAt(): number {
  try {
    const stored = sessionStorage.getItem(OFFER_ENDS_KEY);
    const ends = stored ? Number(stored) : NaN;
    if (!Number.isFinite(ends)) {
      const next = Date.now() + OFFER_DURATION_MS;
      sessionStorage.setItem(OFFER_ENDS_KEY, String(next));
      return next;
    }
    return ends;
  } catch {
    return Date.now() + OFFER_DURATION_MS;
  }
}

export function OfferCountdown({ theme = "ink" }: { theme?: Theme }) {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [srText, setSrText] = useState(
    "Special bundle price reserved for 6 minutes and 30 seconds.",
  );

  useEffect(() => {
    const endsAt = readEndsAt();
    let lastSpokenMinute: number | null = null;

    const tick = () => {
      const remaining = endsAt - Date.now();
      const totalSec = Math.max(0, Math.ceil(remaining / 1000));
      const mins = Math.floor(totalSec / 60);
      const secs = totalSec % 60;
      setRemainingMs(remaining);

      if (mins !== lastSpokenMinute) {
        lastSpokenMinute = mins;
        setSrText(
          totalSec === 0
            ? "Special bundle price timer ended. Checkout now to keep the deal."
            : `Special bundle price reserved for ${mins} minutes and ${secs} seconds.`,
        );
      }
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, []);

  const totalSec =
    remainingMs === null
      ? Math.ceil(OFFER_DURATION_MS / 1000)
      : Math.max(0, Math.ceil(remainingMs / 1000));
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  const urgent = remainingMs !== null && totalSec <= 60;
  const expired = remainingMs !== null && totalSec === 0;

  const labelClass = theme === "hero" ? "text-khaki" : "text-purple";
  const clockClass = urgent
    ? theme === "hero"
      ? "text-[#ffd7a8] animate-pulse"
      : "text-[#c45c26] animate-pulse"
    : theme === "hero"
      ? "text-white"
      : "text-ink";
  const hintClass = theme === "hero" ? "text-white/75" : "text-ink-muted";

  return (
    <div className="mt-5 max-w-sm sm:mt-6" data-offer-countdown>
      <p
        className={`font-display text-[0.72rem] font-semibold uppercase tracking-[0.14em] ${labelClass}`}
      >
        Special bundle price reserved for
      </p>
      <div
        className={`mt-2 flex items-end gap-1.5 font-display font-extrabold leading-none tabular-nums ${clockClass}`}
        aria-hidden
      >
        <span className="flex min-w-[2.6rem] flex-col items-center">
          <span className="text-[clamp(1.85rem,5vw,2.35rem)]">{pad(mins)}</span>
          <small className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] opacity-75">
            min
          </small>
        </span>
        <span className="pb-4 text-2xl opacity-65">:</span>
        <span className="flex min-w-[2.6rem] flex-col items-center">
          <span className="text-[clamp(1.85rem,5vw,2.35rem)]">{pad(secs)}</span>
          <small className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] opacity-75">
            sec
          </small>
        </span>
      </div>
      <p className={`mt-2 text-sm leading-snug ${hintClass}`}>
        {expired
          ? "Time's up — checkout now to keep the special bundle price."
          : "Checkout before the timer ends to lock in this deal."}
      </p>
      <p className="sr-only" aria-live="polite">
        {srText}
      </p>
    </div>
  );
}
