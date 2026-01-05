"use client";

import * as React from "react";

export type CartLine = { itemId: string; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  add: (itemId: string, qty?: number) => void;
  setQty: (itemId: string, qty: number) => void;
  remove: (itemId: string) => void;
  clear: () => void;
  replace: (lines: CartLine[]) => void;
  itemsCount: number;
};

const CartContext = React.createContext<CartContextValue | null>(null);

const STORAGE_KEY = "yumyum_cart_v1";

type Action =
  | { type: "HYDRATE"; lines: CartLine[] }
  | { type: "ADD"; itemId: string; qty: number }
  | { type: "SET_QTY"; itemId: string; qty: number }
  | { type: "REMOVE"; itemId: string }
  | { type: "CLEAR" }
  | { type: "REPLACE"; lines: CartLine[] };

function clampQty(qty: number) {
  if (Number.isNaN(qty)) return 1;
  if (qty < 1) return 1;
  if (qty > 20) return 20;
  return Math.floor(qty);
}

function sanitizeLines(lines: CartLine[]) {
  if (!Array.isArray(lines)) return [];
  const clean: CartLine[] = [];
  for (const l of lines) {
    if (!l?.itemId) continue;
    clean.push({ itemId: String(l.itemId), quantity: clampQty(Number(l.quantity)) });
  }
  // merge duplicates
  const map = new Map<string, number>();
  for (const l of clean) map.set(l.itemId, (map.get(l.itemId) ?? 0) + l.quantity);
  return Array.from(map.entries()).map(([itemId, quantity]) => ({
    itemId,
    quantity: clampQty(quantity),
  }));
}

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "HYDRATE":
      return sanitizeLines(action.lines);

    case "ADD": {
      const qty = clampQty(action.qty);
      const existing = state.find((l) => l.itemId === action.itemId);
      if (existing) {
        return state.map((l) =>
          l.itemId === action.itemId
            ? { ...l, quantity: clampQty(l.quantity + qty) }
            : l
        );
      }
      return [...state, { itemId: action.itemId, quantity: qty }];
    }

    case "SET_QTY": {
      const qty = clampQty(action.qty);
      return state.map((l) => (l.itemId === action.itemId ? { ...l, quantity: qty } : l));
    }

    case "REMOVE":
      return state.filter((l) => l.itemId !== action.itemId);

    case "CLEAR":
      return [];

    case "REPLACE":
      return sanitizeLines(action.lines);

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, dispatch] = React.useReducer(reducer, []);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartLine[];
      dispatch({ type: "HYDRATE", lines: parsed });
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore
    }
  }, [lines]);

  const value = React.useMemo<CartContextValue>(() => {
    const itemsCount = lines.reduce((sum, l) => sum + l.quantity, 0);

    return {
      lines,
      add: (itemId, qty = 1) => dispatch({ type: "ADD", itemId, qty }),
      setQty: (itemId, qty) => dispatch({ type: "SET_QTY", itemId, qty }),
      remove: (itemId) => dispatch({ type: "REMOVE", itemId }),
      clear: () => dispatch({ type: "CLEAR" }),
      replace: (newLines) => dispatch({ type: "REPLACE", lines: newLines }),
      itemsCount,
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}