export type Market = {
  id: string;
  country: string;
  currency: string;
};

export const markets: Market[] = [
  { id: "GB", country: "United Kingdom", currency: "GBP" },
  { id: "IE", country: "Ireland", currency: "EUR" },
  { id: "FR", country: "France", currency: "EUR" },
  { id: "DE", country: "Germany", currency: "EUR" },
  { id: "IT", country: "Italy", currency: "EUR" },
  { id: "ES", country: "Spain", currency: "EUR" },
  { id: "NL", country: "Netherlands", currency: "EUR" },
  { id: "US", country: "United States", currency: "USD" },
  { id: "CA", country: "Canada", currency: "CAD" },
  { id: "AU", country: "Australia", currency: "AUD" },
  { id: "NZ", country: "New Zealand", currency: "NZD" },
  { id: "CH", country: "Switzerland", currency: "CHF" },
  { id: "SE", country: "Sweden", currency: "SEK" },
  { id: "NO", country: "Norway", currency: "NOK" },
  { id: "DK", country: "Denmark", currency: "DKK" },
  { id: "JP", country: "Japan", currency: "JPY" },
  { id: "SG", country: "Singapore", currency: "SGD" },
  { id: "HK", country: "Hong Kong", currency: "HKD" },
  { id: "IN", country: "India", currency: "INR" },
];

export const marketCurrencies = [
  ...new Set(markets.map((market) => market.currency).filter((code) => code !== "GBP")),
];
