import type { Market, MarketCode } from "./types";

/**
 * Market registry — US is live now; others are structured for future expansion
 * without a redesign of pricing, checkout, or admin.
 */
export const markets: Market[] = [
  {
    code: "US",
    name: "United States",
    currency: "USD",
    locale: "en-US",
    flag: "🇺🇸",
    shippingLabel: "Free shipping across the USA",
    enabled: true,
    default: true,
  },
  {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    locale: "en-AU",
    flag: "🇦🇺",
    shippingLabel: "Coming soon",
    enabled: false,
  },
  {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    locale: "en-CA",
    flag: "🇨🇦",
    shippingLabel: "Coming soon",
    enabled: false,
  },
  {
    code: "GB",
    name: "United Kingdom",
    currency: "GBP",
    locale: "en-GB",
    flag: "🇬🇧",
    shippingLabel: "Coming soon",
    enabled: false,
  },
  {
    code: "NZ",
    name: "New Zealand",
    currency: "NZD",
    locale: "en-NZ",
    flag: "🇳🇿",
    shippingLabel: "Coming soon",
    enabled: false,
  },
];

export function getDefaultMarket(): Market {
  return markets.find((m) => m.default) ?? markets[0];
}

export function getMarket(code: MarketCode): Market | undefined {
  return markets.find((m) => m.code === code);
}

export function getEnabledMarkets(): Market[] {
  return markets.filter((m) => m.enabled);
}
