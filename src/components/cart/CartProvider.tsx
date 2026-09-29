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

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: string;
  colour: string;
  size: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  setQuantity: (item: Pick<CartItem, "productId" | "size" | "colour">, quantity: number) => void;
  removeItem: (item: Pick<CartItem, "productId" | "size" | "colour">) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "reevear-bag";

function samePiece(
  entry: Pick<CartItem, "productId" | "size" | "colour">,
  item: Pick<CartItem, "productId" | "size" | "colour">,
) {
  return (
    entry.productId === item.productId &&
    entry.size === item.size &&
    entry.colour === item.colour
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((current) => {
        const quantity = item.quantity ?? 1;
        const match = current.find((entry) => samePiece(entry, item));
        if (!match) {
          return [...current, { ...item, quantity }];
        }
        return current.map((entry) =>
          samePiece(entry, item)
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry,
        );
      });
    },
    [],
  );

  const setQuantity = useCallback(
    (item: Pick<CartItem, "productId" | "size" | "colour">, quantity: number) => {
      setItems((current) => {
        if (quantity < 1) return current.filter((entry) => !samePiece(entry, item));
        return current.map((entry) =>
          samePiece(entry, item) ? { ...entry, quantity } : entry,
        );
      });
    },
    [],
  );

  const removeItem = useCallback(
    (item: Pick<CartItem, "productId" | "size" | "colour">) => {
      setItems((current) => current.filter((entry) => !samePiece(entry, item)));
    },
    [],
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [addItem, clear, items, removeItem, setQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
