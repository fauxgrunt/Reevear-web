import { products, type ShopProduct } from "@/data/products";
import { ensureOrdersSchema, getDb, type Queryable } from "@/lib/db";

export const OPENING_QUANTITY = 5;

export type StockRow = {
  productId: string;
  colour: string;
  size: string;
  quantity: number;
};

type StockLine = {
  productId: string;
  name: string;
  colour: string;
  size: string;
  quantity: number;
};

let stockReady: Promise<void> | null = null;

export function offeredSkus(catalog: readonly ShopProduct[] = products) {
  const skus: { productId: string; colour: string; size: string }[] = [];
  for (const product of catalog) {
    if (product.status !== "active") continue;
    const colours = product.group
      ? [product.colour]
      : product.colourVariants.length > 0
        ? product.colourVariants.map((entry) => entry.name)
        : [product.colour];
    for (const colourName of colours) {
      for (const size of product.sizes) {
        if (!size.available) continue;
        skus.push({ productId: product.id, colour: colourName, size: size.label });
      }
    }
  }
  return skus;
}

export async function ensureStock(db: Queryable) {
  if (!stockReady) {
    stockReady = seedStock(db).catch((error) => {
      stockReady = null;
      throw error;
    });
  }
  await stockReady;
}

export async function readProductStock(productId: string): Promise<StockRow[] | null> {
  const db = getDb();
  if (!db) return null;
  await ensureStock(db);
  const rows = await db.rows<{ colour: string; size: string; quantity: number }>(
    "SELECT colour, size, quantity FROM stock WHERE product_id = $1",
    [productId],
  );
  return rows.map((row) => ({
    productId,
    colour: row.colour,
    size: row.size,
    quantity: Number(row.quantity),
  }));
}

export async function assertInStock(
  db: Queryable,
  lines: StockLine[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  await ensureStock(db);
  for (const line of mergeLines(lines)) {
    const onHand = await quantityOnHand(db, line);
    if (onHand < 1) {
      return {
        ok: false,
        error: `${line.name} in ${line.colour}, size ${line.size}, is unavailable.`,
      };
    }
    if (onHand < line.quantity) {
      const verb = onHand === 1 ? "is" : "are";
      return {
        ok: false,
        error: `Only ${onHand} of the ${line.name} in ${line.colour}, size ${line.size}, ${verb} left.`,
      };
    }
  }
  return { ok: true };
}

export async function takePaidStock(db: Queryable, lines: StockLine[]) {
  for (const line of mergeLines(lines)) {
    const locked = await db.rows<{ quantity: number }>(
      `SELECT quantity FROM stock
       WHERE product_id = $1 AND colour = $2 AND size = $3
       FOR UPDATE`,
      [line.productId, line.colour, line.size],
    );
    const before = Number(locked[0]?.quantity ?? 0);
    if (before > 0) {
      await db.rows(
        `UPDATE stock
         SET quantity = GREATEST(quantity - $4, 0)
         WHERE product_id = $1 AND colour = $2 AND size = $3`,
        [line.productId, line.colour, line.size, line.quantity],
      );
    }
    if (before < line.quantity) {
      console.error(
        `Stock short for ${line.productId} ${line.colour} ${line.size}: asked ${line.quantity}, had ${before}.`,
      );
    }
  }
}

async function seedStock(db: Queryable) {
  await ensureOrdersSchema(db);
  await db.rows(
    `CREATE TABLE IF NOT EXISTS stock (
      product_id text NOT NULL,
      colour text NOT NULL,
      size text NOT NULL,
      quantity integer NOT NULL CHECK (quantity >= 0),
      PRIMARY KEY (product_id, colour, size)
    )`,
  );
  const skus = offeredSkus();
  if (skus.length === 0) return;
  await db.rows(
    `INSERT INTO stock (product_id, colour, size, quantity)
     SELECT product_id, colour, size, $4::int
     FROM unnest($1::text[], $2::text[], $3::text[]) AS piece(product_id, colour, size)
     ON CONFLICT (product_id, colour, size) DO NOTHING`,
    [
      textArray(skus.map((sku) => sku.productId)),
      textArray(skus.map((sku) => sku.colour)),
      textArray(skus.map((sku) => sku.size)),
      OPENING_QUANTITY,
    ],
  );
}

async function quantityOnHand(
  db: Queryable,
  line: { productId: string; colour: string; size: string },
) {
  const rows = await db.rows<{ quantity: number }>(
    "SELECT quantity FROM stock WHERE product_id = $1 AND colour = $2 AND size = $3",
    [line.productId, line.colour, line.size],
  );
  return Number(rows[0]?.quantity ?? 0);
}

function textArray(values: string[]) {
  return `{${values
    .map((value) => `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`)
    .join(",")}}`;
}

function mergeLines(lines: StockLine[]) {
  const merged = new Map<string, StockLine>();
  for (const line of lines) {
    const key = `${line.productId}\0${line.colour}\0${line.size}`;
    const existing = merged.get(key);
    if (existing) existing.quantity += line.quantity;
    else merged.set(key, { ...line });
  }
  return [...merged.values()];
}
