import { ensureOrdersSchema, getDb, type Queryable } from "@/lib/db";
import type Stripe from "stripe";

export type PaidOrderLine = {
  productId: string;
  name: string;
  colour: string;
  size: string;
  quantity: number;
  unitAmount: number;
  amountTotal: number;
};

export type PaidOrder = {
  id: string;
  email: string;
  customerName: string;
  amountTotal: number;
  currency: string;
  paymentIntent: string | null;
  shippingName: string;
  shippingLine1: string;
  shippingLine2: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  lines: PaidOrderLine[];
};

export function orderFromSession(session: Stripe.Checkout.Session): PaidOrder {
  const lines = (session.line_items?.data ?? []).map(lineFromItem);
  if (lines.length === 0) {
    throw new Error("Paid session has no line items.");
  }

  const shipping = session.collected_information?.shipping_details;
  const address = shipping?.address;
  const paymentIntent = session.payment_intent;
  const amountTotal =
    session.amount_total ??
    lines.reduce((sum, line) => sum + line.amountTotal, 0);

  return {
    id: session.id,
    email: session.customer_details?.email?.trim() ?? "",
    customerName: session.customer_details?.name ?? shipping?.name ?? "",
    amountTotal,
    currency: session.currency ?? "gbp",
    paymentIntent:
      typeof paymentIntent === "string" ? paymentIntent : paymentIntent?.id ?? null,
    shippingName: shipping?.name ?? "",
    shippingLine1: address?.line1 ?? "",
    shippingLine2: address?.line2 ?? "",
    shippingCity: address?.city ?? "",
    shippingPostalCode: address?.postal_code ?? "",
    shippingCountry: address?.country ?? "",
    lines,
  };
}

export async function persistPaidOrder(
  order: PaidOrder,
): Promise<"created" | "exists" | "unconfigured"> {
  const db = getDb();
  if (!db) return "unconfigured";
  return savePaidOrder(db, order);
}

export async function savePaidOrder(
  db: Queryable,
  order: PaidOrder,
): Promise<"created" | "exists"> {
  await ensureOrdersSchema(db);
  return db.tx(async (tx) => {
    const inserted = await tx.rows<{ id: string }>(
      `INSERT INTO orders (
        id, email, customer_name, amount_total, currency, payment_intent,
        shipping_name, shipping_line1, shipping_line2, shipping_city,
        shipping_postal_code, shipping_country
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (id) DO NOTHING
      RETURNING id`,
      [
        order.id,
        order.email,
        order.customerName,
        order.amountTotal,
        order.currency,
        order.paymentIntent,
        order.shippingName,
        order.shippingLine1,
        order.shippingLine2,
        order.shippingCity,
        order.shippingPostalCode,
        order.shippingCountry,
      ],
    );
    if (inserted.length === 0) return "exists";

    for (const line of order.lines) {
      await tx.rows(
        `INSERT INTO order_lines (
          order_id, product_id, name, colour, size, quantity, unit_amount, amount_total
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          order.id,
          line.productId,
          line.name,
          line.colour,
          line.size,
          line.quantity,
          line.unitAmount,
          line.amountTotal,
        ],
      );
    }
    return "created";
  });
}

export async function getPaidOrder(db: Queryable, id: string): Promise<PaidOrder | null> {
  await ensureOrdersSchema(db);
  const rows = await db.rows<{
    id: string;
    email: string;
    customer_name: string | null;
    amount_total: number;
    currency: string;
    payment_intent: string | null;
    shipping_name: string | null;
    shipping_line1: string | null;
    shipping_line2: string | null;
    shipping_city: string | null;
    shipping_postal_code: string | null;
    shipping_country: string | null;
  }>("SELECT * FROM orders WHERE id = $1", [id]);
  const order = rows[0];
  if (!order) return null;

  const lines = await db.rows<{
    product_id: string;
    name: string;
    colour: string;
    size: string;
    quantity: number;
    unit_amount: number;
    amount_total: number;
  }>("SELECT * FROM order_lines WHERE order_id = $1 ORDER BY id", [id]);

  return {
    id: order.id,
    email: order.email,
    customerName: order.customer_name ?? "",
    amountTotal: order.amount_total,
    currency: order.currency,
    paymentIntent: order.payment_intent,
    shippingName: order.shipping_name ?? "",
    shippingLine1: order.shipping_line1 ?? "",
    shippingLine2: order.shipping_line2 ?? "",
    shippingCity: order.shipping_city ?? "",
    shippingPostalCode: order.shipping_postal_code ?? "",
    shippingCountry: order.shipping_country ?? "",
    lines: lines.map((line) => ({
      productId: line.product_id,
      name: line.name,
      colour: line.colour,
      size: line.size,
      quantity: line.quantity,
      unitAmount: line.unit_amount,
      amountTotal: line.amount_total,
    })),
  };
}

function lineFromItem(line: Stripe.LineItem): PaidOrderLine {
  const product = line.price?.product;
  const record =
    product && typeof product !== "string" && !product.deleted ? product : null;
  const described =
    parsePiece(record?.description ?? "") ?? parsePiece(line.description ?? "");
  const quantity = line.quantity ?? 1;
  const unitAmount =
    line.price?.unit_amount ??
    (line.amount_total != null ? Math.round(line.amount_total / quantity) : 0);

  return {
    productId: record?.metadata?.productId ?? "",
    name: record?.name || line.description || "Piece",
    colour: record?.metadata?.colour ?? described?.colour ?? "",
    size: record?.metadata?.size ?? described?.size ?? "",
    quantity,
    unitAmount,
    amountTotal: line.amount_total ?? unitAmount * quantity,
  };
}

function parsePiece(text: string) {
  const match = text.match(/^(.*) · Size (.+)$/);
  if (!match) return null;
  return { colour: match[1], size: match[2] };
}
