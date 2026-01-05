"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCart } from "@/store/cart";
import { useOrders } from "@/store/orders";
import { useMenu } from "@/store/menu";
import { formatNaira } from "@/lib/money";

type OrderType = "delivery" | "pickup";
const LAST_ADDRESS_KEY = "yumyum_last_address_v1";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, clear } = useCart();
  const { create } = useOrders();
  const { getItemById } = useMenu();

  const [type, setType] = React.useState<OrderType>("delivery");

  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [line1, setLine1] = React.useState("");
  const [area, setArea] = React.useState("");
  const [note, setNote] = React.useState("");

  const [promo, setPromo] = React.useState("");
  const [promoApplied, setPromoApplied] = React.useState<string | null>(null);
  const [promoError, setPromoError] = React.useState<string | null>(null);
  const [tip, setTip] = React.useState<number>(0);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(LAST_ADDRESS_KEY);
      if (!raw) return;
      const a = JSON.parse(raw) as any;
      setFullName(a?.fullName ?? "");
      setPhone(a?.phone ?? "");
      setLine1(a?.line1 ?? "");
      setArea(a?.area ?? "");
      setNote(a?.note ?? "");
    } catch {
      // ignore
    }
  }, []);

  const detailed = lines.map((l) => ({
    line: l,
    item: getItemById(l.itemId),
  }));

  const subtotal = detailed.reduce((sum, row) => {
    if (!row.item) return sum;
    return sum + row.item.priceNaira * row.line.quantity;
  }, 0);

  const baseDeliveryFee = type === "delivery" ? 700 : 0;

  let discount = 0;
  let deliveryFee = baseDeliveryFee;

  if (promoApplied === "YUM10") discount = Math.floor(subtotal * 0.1);
  if (promoApplied === "FREEDEL") deliveryFee = 0;

  const total = Math.max(0, subtotal + deliveryFee + tip - discount);

  const cartHasMissingItems = detailed.some((r) => !r.item);

  const canPlace =
    lines.length > 0 &&
    !cartHasMissingItems &&
    (type === "pickup" || (fullName.trim() && phone.trim() && line1.trim()));

  function applyPromo() {
    const code = promo.trim().toUpperCase();
    setPromoError(null);

    if (!code) {
      setPromoApplied(null);
      return;
    }

    if (code === "YUM10" || code === "FREEDEL") {
      setPromoApplied(code);
      setPromo(code);
      return;
    }

    setPromoApplied(null);
    setPromoError("Invalid promo code.");
  }

  function placeOrder() {
    if (!canPlace) return;

    const address =
      type === "delivery"
        ? {
            fullName: fullName.trim(),
            phone: phone.trim(),
            line1: line1.trim(),
            area: area.trim(),
            note: note.trim(),
          }
        : undefined;

    if (address) {
      try {
        localStorage.setItem(LAST_ADDRESS_KEY, JSON.stringify(address));
      } catch {
        // ignore
      }
    }

    const order = create({
      type,
      lines,
      address,
      subtotalNaira: subtotal,
      deliveryFeeNaira: deliveryFee,
      discountNaira: discount,
      tipNaira: tip,
      totalNaira: total,
      promoCode: promoApplied ?? undefined,
    });

    clear();
    router.push(`/orders/${order.id}`);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <Link className="text-sm font-semibold text-brand-deep" href="/cart">
          ← Back to cart
        </Link>
      </div>

      {lines.length === 0 ? (
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Your cart is empty</h2>
          <p className="mt-1 text-yum-text-secondary">Add items before checkout.</p>
          <div className="mt-4">
            <Link href="/menu">
              <Button>Browse menu</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <Card className="p-5 space-y-4">
              <h2 className="text-lg font-semibold">Order type</h2>

              <div className="grid grid-cols-2 gap-2">
                <button
                  className={
                    type === "delivery"
                      ? "h-12 rounded-lg bg-brand-primary text-white font-semibold ring-1 ring-black/10"
                      : "h-12 rounded-lg bg-white/70 font-semibold text-yum-text-primary ring-1 ring-black/10 hover:bg-white"
                  }
                  onClick={() => setType("delivery")}
                  type="button"
                >
                  Delivery
                </button>
                <button
                  className={
                    type === "pickup"
                      ? "h-12 rounded-lg bg-brand-primary text-white font-semibold ring-1 ring-black/10"
                      : "h-12 rounded-lg bg-white/70 font-semibold text-yum-text-primary ring-1 ring-black/10 hover:bg-white"
                  }
                  onClick={() => setType("pickup")}
                  type="button"
                >
                  Pickup
                </button>
              </div>
            </Card>

            {type === "delivery" ? (
              <Card className="p-5 space-y-4">
                <h2 className="text-lg font-semibold">Delivery address</h2>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <Input
                  placeholder="Address line (e.g., 12 Allen Avenue)"
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                />
                <Input placeholder="Area / Landmark (optional)" value={area} onChange={(e) => setArea(e.target.value)} />
                <Input
                  placeholder="Delivery note (gate code, call on arrival...)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </Card>
            ) : (
              <Card className="p-5">
                <h2 className="text-lg font-semibold">Pickup</h2>
                <p className="mt-1 text-yum-text-secondary text-sm">
                  We’ll prepare your food and notify you when it’s ready.
                </p>
              </Card>
            )}

            <Card className="p-5 space-y-3">
              <h2 className="text-lg font-semibold">Tip (optional)</h2>
              <div className="flex flex-wrap gap-2">
                {[0, 200, 500, 1000].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTip(t)}
                    className={
                      tip === t
                        ? "h-10 px-4 rounded-full bg-brand-sun/70 text-brand-black font-bold ring-1 ring-black/10"
                        : "h-10 px-4 rounded-full bg-white/70 text-yum-text-primary font-semibold ring-1 ring-black/10 hover:bg-white"
                    }
                  >
                    {t === 0 ? "No tip" : formatNaira(t)}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-5 space-y-3">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <div className="space-y-2">
                {detailed.map(({ line, item }) => (
                  <div key={line.itemId} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{item ? item.name : "Item unavailable"}</p>
                      <p className="text-sm text-yum-text-secondary">Qty: {line.quantity}</p>
                    </div>
                    <p className="font-semibold text-brand-deep">
                      {item ? formatNaira(item.priceNaira * line.quantity) : "—"}
                    </p>
                  </div>
                ))}
              </div>

              {cartHasMissingItems ? (
                <p className="text-sm font-semibold text-brand-deep">
                  Some items are unavailable. Remove them from your cart to continue.
                </p>
              ) : null}
            </Card>

            <Card className="p-5 space-y-3">
              <h2 className="text-lg font-semibold">Promo code</h2>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Enter code (YUM10 or FREEDEL)"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                  />
                </div>
                <Button variant="secondary" onClick={applyPromo}>
                  Apply
                </Button>
              </div>
              {promoError ? <p className="text-sm text-brand-deep font-semibold">{promoError}</p> : null}
              {promoApplied ? (
                <p className="text-sm text-yum-text-secondary">
                  Applied: <span className="font-semibold text-brand-deep">{promoApplied}</span>
                </p>
              ) : null}
            </Card>

            <Card className="p-5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-yum-text-secondary">Subtotal</span>
                <span className="font-semibold">{formatNaira(subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-yum-text-secondary">Delivery fee</span>
                <span className="font-semibold">{formatNaira(deliveryFee)}</span>
              </div>

              {discount > 0 ? (
                <div className="flex justify-between text-sm">
                  <span className="text-yum-text-secondary">Discount</span>
                  <span className="font-semibold text-brand-deep">- {formatNaira(discount)}</span>
                </div>
              ) : null}

              {tip > 0 ? (
                <div className="flex justify-between text-sm">
                  <span className="text-yum-text-secondary">Tip</span>
                  <span className="font-semibold">{formatNaira(tip)}</span>
                </div>
              ) : null}

              <div className="pt-2 mt-2 border-t border-black/5 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-extrabold text-brand-deep">{formatNaira(total)}</span>
              </div>

              <Button className="w-full mt-2" disabled={!canPlace} onClick={placeOrder}>
                Place order
              </Button>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}