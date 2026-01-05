"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useOrders } from "@/store/orders";
import { useCart } from "@/store/cart";
import { formatNaira } from "@/lib/money";
import { statusLabel, statusPillClass } from "@/lib/orderStatus";

export default function OrdersPage() {
  const router = useRouter();
  const { orders } = useOrders();
  const { replace } = useCart();

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <Link className="text-sm font-semibold text-brand-deep" href="/menu">
          Browse menu
        </Link>
      </div>

      {orders.length === 0 ? (
        <Card className="p-6">
          <h2 className="text-lg font-semibold">No orders yet</h2>
          <p className="mt-1 text-yum-text-secondary">
            Place your first order and it will show up here.
          </p>
          <div className="mt-4">
            <Link href="/menu">
              <Button>Browse menu</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((o) => (
            <Card key={o.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{o.orderNumber}</p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${statusPillClass(
                        o.status
                      )}`}
                    >
                      {statusLabel(o.status)}
                    </span>
                  </div>

                  <p className="text-sm text-yum-text-secondary">
                    {new Date(o.placedAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-yum-text-secondary">
                    {o.type === "delivery" ? "Delivery" : "Pickup"}
                  </p>
                </div>

                <p className="text-lg font-extrabold text-brand-deep">
                  {formatNaira(o.totalNaira)}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => router.push(`/orders/${o.id}`)}>
                  Track
                </Button>
                <Button
                  onClick={() => {
                    replace(o.lines);
                    router.push("/cart");
                  }}
                >
                  Order again
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}