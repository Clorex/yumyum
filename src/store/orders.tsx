"use client";

import * as React from "react";
import type { CartLine } from "@/store/cart";

export type OrderType = "delivery" | "pickup";
export type OrderStatus =
  | "confirmed"
  | "preparing"
  | "ready"
  | "on_the_way"
  | "delivered"
  | "canceled";

export type OrderEvent = {
  type: OrderStatus;
  at: string; // ISO
};

export type OrderAddress = {
  fullName: string;
  phone: string;
  line1: string;
  area?: string;
  note?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  placedAt: string; // ISO
  lines: CartLine[];
  address?: OrderAddress;
  subtotalNaira: number;
  deliveryFeeNaira: number;
  discountNaira: number;
  tipNaira: number;
  totalNaira: number;
  promoCode?: string;
  events: OrderEvent[];
};

type OrdersContextValue = {
  orders: Order[];
  getById: (id: string) => Order | null;

  create: (input: {
    type: OrderType;
    lines: CartLine[];
    address?: OrderAddress;
    subtotalNaira: number;
    deliveryFeeNaira: number;
    discountNaira: number;
    tipNaira: number;
    totalNaira: number;
    promoCode?: string;
  }) => Order;

  updateStatus: (orderId: string, status: OrderStatus) => void;
  advanceDemo: (orderId: string) => void;
  cancel: (orderId: string) => void;
};

const OrdersContext = React.createContext<OrdersContextValue | null>(null);
const STORAGE_KEY = "yumyum_orders_v1";

const flow: OrderStatus[] = ["confirmed", "preparing", "ready", "on_the_way", "delivered"];

function safeUUID() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function makeOrderNumber() {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `YY-${n}`;
}

function sanitize(orders: unknown): Order[] {
  if (!Array.isArray(orders)) return [];
  return orders.filter(Boolean) as Order[];
}

function ensureEvent(events: OrderEvent[], status: OrderStatus, atISO: string) {
  // Keep the first time each status happened (don’t duplicate)
  if (events.some((e) => e.type === status)) return events;
  return [...events, { type: status, at: atISO }];
}

function nextStatus(current: OrderStatus): OrderStatus {
  if (current === "canceled" || current === "delivered") return current;
  const idx = flow.indexOf(current);
  if (idx < 0) return "confirmed";
  return flow[Math.min(flow.length - 1, idx + 1)];
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = React.useState<Order[]>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setOrders(sanitize(parsed));
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const value = React.useMemo<OrdersContextValue>(() => {
    return {
      orders,
      getById: (id) => orders.find((o) => o.id === id) ?? null,

      create: (input) => {
        const now = new Date().toISOString();
        const order: Order = {
          id: safeUUID(),
          orderNumber: makeOrderNumber(),
          type: input.type,
          status: "confirmed",
          placedAt: now,
          lines: input.lines,
          address: input.address,
          subtotalNaira: input.subtotalNaira,
          deliveryFeeNaira: input.deliveryFeeNaira,
          discountNaira: input.discountNaira,
          tipNaira: input.tipNaira,
          totalNaira: input.totalNaira,
          promoCode: input.promoCode,
          events: [{ type: "confirmed", at: now }],
        };

        setOrders((prev) => [order, ...prev]);
        return order;
      },

      updateStatus: (orderId, status) => {
        const now = new Date().toISOString();
        setOrders((prev) =>
          prev.map((o) => {
            if (o.id !== orderId) return o;
            const events = ensureEvent(o.events ?? [], status, now);
            return { ...o, status, events };
          })
        );
      },

      advanceDemo: (orderId) => {
        const now = new Date().toISOString();
        setOrders((prev) =>
          prev.map((o) => {
            if (o.id !== orderId) return o;
            const ns = nextStatus(o.status);
            const events = ensureEvent(o.events ?? [], ns, now);
            return { ...o, status: ns, events };
          })
        );
      },

      cancel: (orderId) => {
        const now = new Date().toISOString();
        setOrders((prev) =>
          prev.map((o) => {
            if (o.id !== orderId) return o;
            const events = ensureEvent(o.events ?? [], "canceled", now);
            return { ...o, status: "canceled", events };
          })
        );
      },
    };
  }, [orders]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = React.useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used inside <OrdersProvider>");
  return ctx;
}