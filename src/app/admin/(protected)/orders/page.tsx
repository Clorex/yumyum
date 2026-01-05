"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useOrders } from "@/store/orders";
import { statusLabel, statusPillClass } from "@/lib/orderStatus";
import { formatNaira } from "@/lib/money";

export default function AdminOrdersPage() {
  const { orders, updateStatus, advanceDemo } = useOrders();

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Orders</h1>

      {orders.length === 0 ? (
        <Card className="p-6">
          <p className="font-semibold">No orders yet</p>
          <p className="text-sm text-yum-text-secondary">
            Place an order from the customer side, then refresh here.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((o) => (
            <Card key={o.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{o.orderNumber}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusPillClass(o.status)}`}>
                      {statusLabel(o.status)}
                    </span>
                  </div>
                  <p className="text-sm text-yum-text-secondary">{new Date(o.placedAt).toLocaleString()}</p>
                  <p className="text-sm text-yum-text-secondary">{o.type === "delivery" ? "Delivery" : "Pickup"}</p>
                </div>

                <p className="font-extrabold text-brand-deep">{formatNaira(o.totalNaira)}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <Button variant="secondary" onClick={() => advanceDemo(o.id)}>
                  Advance (demo)
                </Button>

                <select
                  className="h-10 rounded-lg bg-white/70 ring-1 ring-black/10 px-3 font-semibold"
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value as any)}
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="on_the_way">On the way</option>
                  <option value="delivered">Delivered</option>
                  <option value="canceled">Canceled</option>
                </select>

                <Link className="text-sm font-semibold text-brand-deep" href={`/orders/${o.id}`}>
                  View tracking →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}