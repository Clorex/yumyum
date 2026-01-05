import type { OrderStatus } from "@/store/orders";

export function statusLabel(s: OrderStatus) {
  switch (s) {
    case "confirmed":
      return "Confirmed";
    case "preparing":
      return "Preparing";
    case "ready":
      return "Ready";
    case "on_the_way":
      return "On the way";
    case "delivered":
      return "Delivered";
    case "canceled":
      return "Canceled";
    default:
      return s;
  }
}

export function statusPillClass(s: OrderStatus) {
  // Warm palette + soft rings (no black borders)
  switch (s) {
    case "confirmed":
      return "bg-brand-sun/25 text-brand-black ring-1 ring-black/10";
    case "preparing":
      return "bg-brand-primary/15 text-brand-pressed ring-1 ring-black/10";
    case "ready":
      return "bg-brand-sun/30 text-brand-pressed ring-1 ring-black/10";
    case "on_the_way":
      return "bg-brand-primary/20 text-brand-pressed ring-1 ring-black/10";
    case "delivered":
      return "bg-brand-sun/35 text-brand-black ring-1 ring-black/10";
    case "canceled":
      return "bg-brand-deep/15 text-brand-deep ring-1 ring-black/10";
    default:
      return "bg-white/70 text-yum-text-secondary ring-1 ring-black/10";
  }
}