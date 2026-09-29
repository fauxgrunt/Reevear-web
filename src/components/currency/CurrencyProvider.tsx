"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { markets, type Market } from "@/data/markets";
import { formatMoney } from "@/lib/money";

type RatesStatus = "loading" | "ready" | "unavailable";

type CurrencyContextValue = {
  markets: Market[];
  market: Market;
  setMarket: (id: string) => void;
  format: (pounds: number, options?: { whole?: boolean }) => string;
  converted: boolean;
  ratesStatus: RatesStatus;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);
const STORAGE_KEY = "reevear-market";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [marketId, setMarketId] = useState("GB");
  const [ready, setReady] = useState(false);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [ratesStatus, setRatesStatus] = useState<RatesStatus>("loading");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && markets.some((market) => market.id === stored)) {
        setMarketId(stored);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, marketId);
  }, [marketId, ready]);

  useEffect(() => {
    let active = true;
    fetch("/api/rates")
      .then((response) => response.json())
      .then((data: { rates?: Record<string, number> }) => {
        if (!active) return;
        const next = data.rates ?? {};
        setRates(next);
        setRatesStatus(Object.keys(next).length > 0 ? "ready" : "unavailable");
      })
      .catch(() => {
        if (active) setRatesStatus("unavailable");
      });
    return () => {
      active = false;
    };
  }, []);

  const market = markets.find((entry) => entry.id === marketId) ?? markets[0];
  const rate = market.currency === "GBP" ? 1 : rates[market.currency];
  const converted = market.currency !== "GBP" && typeof rate === "number";

  const setMarket = useCallback((id: string) => {
    if (markets.some((entry) => entry.id === id)) setMarketId(id);
  }, []);

  const format = useCallback(
    (pounds: number, options?: { whole?: boolean }) =>
      formatMoney(pounds, converted ? market.currency : "GBP", rate ?? 1, options),
    [converted, market.currency, rate],
  );

  const value = useMemo(
    () => ({ markets, market, setMarket, format, converted, ratesStatus }),
    [converted, format, market, ratesStatus, setMarket],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}
