"use client";

import { useCurrency } from "@/components/currency/CurrencyProvider";

export function MarketPanel({
  open,
  panelId,
  onChoose,
}: {
  open: boolean;
  panelId: string;
  onChoose: () => void;
}) {
  const { markets, market, setMarket, converted, ratesStatus } = useCurrency();
  const waiting = market.currency !== "GBP" && !converted;

  return (
    <div
      id={panelId}
      className={`home-market-panel${open ? " is-open" : ""}`}
      aria-hidden={!open}
    >
      <div className="home-market-inner">
        <p className="home-search-heading">Country</p>
        <p className="home-market-note">
          {waiting && ratesStatus === "unavailable"
            ? "Exchange rates are unavailable, so prices stay in pounds."
            : "Prices follow the country you choose. Payment is taken in pounds."}
        </p>
        <div className="home-market-list">
          {markets.map((entry) => {
            const selected = entry.id === market.id;
            return (
              <button
                key={entry.id}
                type="button"
                className={`home-market-option${selected ? " is-active" : ""}`}
                aria-pressed={selected}
                tabIndex={open ? 0 : -1}
                onClick={() => {
                  setMarket(entry.id);
                  onChoose();
                }}
              >
                <span>{entry.country}</span>
                <span>{entry.currency}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
