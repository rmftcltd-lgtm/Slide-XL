export const OFFER_UNLOCKED_KEY = "slidexl_offer_unlocked";
export const OFFER_EMAIL_KEY = "slidexl_offer_email";
export const OFFER_ENDS_KEY = "slidexl_offer_ends_at";
export const OFFER_DISMISSED_KEY = "slidexl_popup_dismissed";
export const OFFER_DURATION_MS = 390_000; // 6.5 minutes
export const OFFER_UNLOCKED_EVENT = "slidexl:offer-unlocked";

export function isOfferUnlocked(): boolean {
  try {
    return sessionStorage.getItem(OFFER_UNLOCKED_KEY) === "1";
  } catch {
    return false;
  }
}

export function unlockOffer(email?: string) {
  try {
    sessionStorage.setItem(OFFER_UNLOCKED_KEY, "1");
    if (email) sessionStorage.setItem(OFFER_EMAIL_KEY, email);
    if (!sessionStorage.getItem(OFFER_ENDS_KEY)) {
      sessionStorage.setItem(
        OFFER_ENDS_KEY,
        String(Date.now() + OFFER_DURATION_MS),
      );
    }
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(OFFER_UNLOCKED_EVENT));
  }
}
