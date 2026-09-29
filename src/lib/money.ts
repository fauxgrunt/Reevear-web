const ZERO_DECIMAL = new Set(["JPY"]);

export function formatMoney(
  pounds: number,
  currency: string,
  rate: number,
  options?: { whole?: boolean },
) {
  const code =
    currency === "GBP" || !Number.isFinite(rate) || rate <= 0 ? "GBP" : currency;
  const amount = code === "GBP" ? pounds : pounds * rate;
  const digits = options?.whole || code === "GBP" || ZERO_DECIMAL.has(code) ? 0 : 2;
  const rounded = digits === 0 ? Math.round(amount) : amount;

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: code,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(rounded);
}

export function poundsFromLabel(label: string) {
  const value = Number(label.replace(/[^\d.]/g, ""));
  return Number.isFinite(value) && value > 0 ? value : null;
}
