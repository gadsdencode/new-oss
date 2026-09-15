/**
 * Integer monetary units for assistant spend accounting.
 * 1 USD = 1_000_000_000 nanos. Token prices from Google are integer nanos/token.
 */
export const NANOS_PER_USD = BigInt(1_000_000_000);
export const ZERO_NANOS = BigInt(0);

export type NanoDollars = bigint;

export function usdToNanos(usd: number): NanoDollars {
  if (!Number.isFinite(usd) || usd < 0) {
    throw new Error("USD amount must be a finite non-negative number");
  }
  return BigInt(Math.round(usd * Number(NANOS_PER_USD)));
}

export function nanosToUsdString(nanos: NanoDollars): string {
  const negative = nanos < ZERO_NANOS;
  const abs = negative ? -nanos : nanos;
  const whole = abs / NANOS_PER_USD;
  const fraction = abs % NANOS_PER_USD;
  const fractionStr = fraction.toString().padStart(9, "0").replace(/0+$/, "") || "0";
  return `${negative ? "-" : ""}${whole.toString()}.${fractionStr}`;
}

export function parseUsdToNanos(raw: string | undefined, fallbackUsd: number): {
  value: NanoDollars;
  issue?: string;
} {
  if (raw == null || raw.trim() === "") {
    return { value: usdToNanos(fallbackUsd) };
  }
  const trimmed = raw.trim();
  if (!/^\d+(\.\d{1,9})?$/.test(trimmed)) {
    return { value: usdToNanos(fallbackUsd), issue: "Budget must be a non-negative USD amount" };
  }
  const [whole, fraction = ""] = trimmed.split(".");
  const nanos = BigInt(whole) * NANOS_PER_USD + BigInt(fraction.padEnd(9, "0"));
  return { value: nanos };
}

export function tokenChargeNanos(tokens: number, nanosPerToken: NanoDollars): NanoDollars {
  const safe = Number.isFinite(tokens) && tokens > 0 ? Math.ceil(tokens) : 0;
  return BigInt(safe) * nanosPerToken;
}
