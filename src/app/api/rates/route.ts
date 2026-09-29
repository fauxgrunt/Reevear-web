import { marketCurrencies } from "@/data/markets";

type RatePayload = {
  date: string | null;
  rates: Record<string, number>;
};

let cached: { at: number; payload: RatePayload } | null = null;
const FRESH_FOR = 12 * 60 * 60 * 1000;

export async function GET() {
  if (cached && Date.now() - cached.at < FRESH_FOR) {
    return Response.json(cached.payload);
  }

  try {
    const response = await fetch(
      `https://api.frankfurter.app/latest?from=GBP&to=${marketCurrencies.join(",")}`,
      { cache: "no-store" },
    );
    if (!response.ok) throw new Error("rates");
    const data = (await response.json()) as {
      date?: string;
      rates?: Record<string, number>;
    };
    const payload: RatePayload = {
      date: data.date ?? null,
      rates: data.rates ?? {},
    };
    cached = { at: Date.now(), payload };
    return Response.json(payload);
  } catch {
    if (cached) return Response.json(cached.payload);
    return Response.json({ date: null, rates: {} } satisfies RatePayload);
  }
}
