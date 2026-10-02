import { PGlite } from "@electric-sql/pglite";
import type { Queryable } from "../src/lib/db";
import { getPaidOrder, orderFromSession, savePaidOrder } from "../src/lib/orders";
import { assertInStock, OPENING_QUANTITY } from "../src/lib/stock";
import type Stripe from "stripe";

function memoryDb(pg: PGlite): Queryable {
  const db: Queryable = {
    async rows<T extends Record<string, unknown>>(
      statement: string,
      params: unknown[] = [],
    ): Promise<T[]> {
      const result = await pg.query(statement, params);
      return result.rows as T[];
    },
    async tx(fn) {
      await pg.exec("BEGIN");
      try {
        const value = await fn(db);
        await pg.exec("COMMIT");
        return value;
      } catch (error) {
        await pg.exec("ROLLBACK");
        throw error;
      }
    },
  };
  return db;
}

function session(): Stripe.Checkout.Session {
  return {
    id: "cs_test_order_1",
    currency: "gbp",
    amount_total: 9500,
    payment_intent: "pi_test_1",
    customer_details: { email: "buyer@example.com", name: "A Customer" },
    collected_information: {
      shipping_details: {
        name: "A Customer",
        address: {
          line1: "62 Washway Road",
          line2: null,
          city: "Sale",
          postal_code: "M33 7RE",
          country: "GB",
        },
      },
    },
    line_items: {
      data: [
        {
          quantity: 1,
          amount_total: 9500,
          description: "Washed Charcoal · Size L",
          price: {
            unit_amount: 9500,
            product: {
              name: "Hoodie",
              description: "Washed Charcoal · Size L",
              metadata: {
                productId: "hoodie-washed-charcoal",
                colour: "Washed Charcoal",
                size: "L",
              },
            },
          },
        },
      ],
    },
  } as unknown as Stripe.Checkout.Session;
}

async function main() {
  const pg = new PGlite();
  const db = memoryDb(pg);
  const order = orderFromSession(session());

  if (order.email !== "buyer@example.com") throw new Error("Email was not read.");
  if (order.lines[0]?.productId !== "hoodie-washed-charcoal") {
    throw new Error("Piece id was not read.");
  }
  if (order.shippingPostalCode !== "M33 7RE") throw new Error("Address was not read.");
  if (order.amountTotal !== 9500) throw new Error("Total was not read in pence.");

  const first = await savePaidOrder(db, order);
  const second = await savePaidOrder(db, order);
  const stored = await getPaidOrder(db, order.id);
  const count = await db.rows<{ count: string }>("SELECT count(*)::text AS count FROM orders");

  if (first !== "created") throw new Error(`First save returned ${first}.`);
  if (second !== "exists") throw new Error(`Repeat save returned ${second}.`);
  if (count[0]?.count !== "1") throw new Error("A repeat notice created another order.");
  if (stored?.lines.length !== 1) throw new Error("The piece was not stored.");
  if (stored.lines[0]?.size !== "L" || stored.lines[0]?.colour !== "Washed Charcoal") {
    throw new Error("Size or colour was not stored.");
  }
  if (stored.amountTotal !== 9500) throw new Error("The stored total is not the charged pence.");

  const piece = {
    productId: "hoodie-washed-charcoal",
    name: "Hoodie",
    colour: "Washed Charcoal",
    size: "L",
  };
  const remaining = await onHand(db, piece);
  if (remaining !== OPENING_QUANTITY - 1) {
    throw new Error(`Payment left ${remaining} in stock.`);
  }
  const repeat = await savePaidOrder(db, order);
  if (repeat !== "exists") throw new Error("Repeat save did not recognise the order.");
  if ((await onHand(db, piece)) !== remaining) {
    throw new Error("A repeat notice reduced stock again.");
  }

  await setOnHand(db, piece, 0);
  const soldOut = await assertInStock(db, [{ ...piece, quantity: 1 }]);
  if (soldOut.ok) throw new Error("Checkout allowed a size at zero.");

  await setOnHand(db, piece, 2);
  const tooMany = await assertInStock(db, [{ ...piece, quantity: 3 }]);
  if (tooMany.ok) throw new Error("Checkout allowed more than the remaining quantity.");
  const enough = await assertInStock(db, [{ ...piece, quantity: 2 }]);
  if (!enough.ok) throw new Error("Checkout refused a quantity that is in stock.");

  const another = structuredClone(session());
  another.id = "cs_test_order_2";
  const anotherLine = another.line_items?.data[0];
  if (!anotherLine) throw new Error("The second payment has no piece.");
  anotherLine.quantity = 2;
  const sold = await savePaidOrder(db, orderFromSession(another));
  if (sold !== "created") throw new Error("The second payment was not stored.");
  if ((await onHand(db, piece)) !== 0) throw new Error("Payment did not reduce stock to zero.");

  console.log("Paid order stored once, and stock fell only after that payment.");
}

async function onHand(
  db: Queryable,
  piece: { productId: string; colour: string; size: string },
) {
  const rows = await db.rows<{ quantity: number }>(
    "SELECT quantity FROM stock WHERE product_id = $1 AND colour = $2 AND size = $3",
    [piece.productId, piece.colour, piece.size],
  );
  return Number(rows[0]?.quantity ?? 0);
}

async function setOnHand(
  db: Queryable,
  piece: { productId: string; colour: string; size: string },
  quantity: number,
) {
  await db.rows(
    "UPDATE stock SET quantity = $4 WHERE product_id = $1 AND colour = $2 AND size = $3",
    [piece.productId, piece.colour, piece.size, quantity],
  );
}

main();
