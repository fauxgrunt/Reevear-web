import { getProductById } from "@/data/products";

export type CheckoutRequestLine = {
  productId: string;
  size: string;
  colour: string;
  quantity: number;
};

export type PricedCheckoutLine = {
  productId: string;
  name: string;
  colour: string;
  size: string;
  description: string;
  quantity: number;
  unitAmount: number;
};

const MAX_LINES = 20;
const MAX_QUANTITY = 5;

export function priceCheckout(
  input: unknown,
): { ok: true; lines: PricedCheckoutLine[] } | { ok: false; error: string } {
  if (!input || typeof input !== "object" || !("items" in input)) {
    return { ok: false, error: "The bag could not be read." };
  }

  const items = (input as { items?: unknown }).items;
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: "Your bag is empty." };
  }
  if (items.length > MAX_LINES) {
    return { ok: false, error: "The bag has too many pieces for one payment." };
  }

  const lines: PricedCheckoutLine[] = [];

  for (const entry of items) {
    if (!entry || typeof entry !== "object") {
      return { ok: false, error: "A piece in the bag could not be read." };
    }

    const productId = stringField(entry, "productId");
    const size = stringField(entry, "size");
    const colour = stringField(entry, "colour");
    const quantity = numberField(entry, "quantity");

    if (!productId || !size || !colour || quantity == null) {
      return { ok: false, error: "A piece in the bag is missing a detail." };
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return { ok: false, error: "Choose between 1 and 5 of each piece." };
    }

    const product = getProductById(productId);
    if (!product || product.status !== "active") {
      return { ok: false, error: "A piece in the bag is no longer available." };
    }

    const sizeOk = product.sizes.some(
      (option) =>
        option.available && (option.label === size || option.id === size),
    );
    if (!sizeOk) {
      return { ok: false, error: `${product.name} is not available in ${size}.` };
    }

    const colourOk =
      product.colour === colour ||
      product.colourVariants.some((option) => option.name === colour);
    if (!colourOk) {
      return { ok: false, error: `${product.name} is not available in ${colour}.` };
    }

    const unitAmount = Math.round(product.priceValue * 100);
    if (!Number.isFinite(unitAmount) || unitAmount < 50) {
      return { ok: false, error: `${product.name} cannot be charged yet.` };
    }

    lines.push({
      productId: product.id,
      name: product.name,
      colour,
      size,
      description: `${colour} · Size ${size}`,
      quantity,
      unitAmount,
    });
  }

  return { ok: true, lines };
}

function stringField(entry: object, key: string) {
  const value = (entry as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function numberField(entry: object, key: string) {
  const value = (entry as Record<string, unknown>)[key];
  return typeof value === "number" ? value : null;
}
