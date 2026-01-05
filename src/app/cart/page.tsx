"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/store/cart";
import { useMenu } from "@/store/menu";
import { formatNaira } from "@/lib/money";

export default function CartPage() {
  const { lines, setQty, remove, clear } = useCart();
  const { getItemById } = useMenu();

  const detailed = lines.map((l) => ({
    line: l,
    item: getItemById(l.itemId),
  }));

  const subtotal = detailed.reduce((sum, row) => {
    if (!row.item) return sum;
    return sum + row.item.priceNaira * row.line.quantity;
  }, 0);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your order</h1>
        <Link className="text-sm font-semibold text-brand-deep" href="/menu">
          Add more food
        </Link>
      </div>

      {lines.length === 0 ? (
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Your order is empty</h2>
          <p className="mt-1 text-yum-text-secondary">
            Add Chicken & Chips, Turkey & Chips, drinks, and extras.
          </p>
          <div className="mt-4">
            <Link href="/menu">
              <Button>Browse menu</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {detailed.map(({ line, item }) => (
              <Card key={line.itemId} className="p-4">
                {!item ? (
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">Item unavailable</p>
                      <p className="text-sm text-yum-text-secondary">
                        This item was removed from the menu.
                      </p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => remove(line.itemId)}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-yum-surface ring-1 ring-black/5">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{item.name}</p>
                      <p className="text-sm text-yum-text-secondary truncate">
                        {formatNaira(item.priceNaira)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setQty(item.id, Math.max(1, line.quantity - 1))}
                        disabled={line.quantity <= 1}
                      >
                        –
                      </Button>
                      <span className="w-8 text-center font-semibold">{line.quantity}</span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setQty(item.id, Math.min(20, line.quantity + 1))}
                        disabled={line.quantity >= 20}
                      >
                        +
                      </Button>
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => remove(item.id)}>
                      Remove
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>

          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-yum-text-secondary">Subtotal</p>
              <p className="text-xl font-semibold">{formatNaira(subtotal)}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={clear}>
                Clear order
              </Button>
              <Link href="/checkout">
                <Button>Checkout</Button>
              </Link>
            </div>
          </Card>
        </>
      )}
    </main>
  );
}