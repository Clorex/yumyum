"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useOrders, type OrderStatus } from "@/store/orders";
import { formatNaira } from "@/lib/money";
import { statusLabel, statusPillClass } from "@/lib/orderStatus";

const steps: { key: OrderStatus; label: string }[] = [
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "on_the_way", label: "On the way" },
  { key: "delivered", label: "Delivered" },
];

export default function OrderTrackingPage() {
  const params = useParams<{ id: string }>();
  const { getById, advanceDemo, cancel } = useOrders();
  const order = getById(params.id);

  if (!order) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Order not found</h1>
        <p className="mt-2 text-yum-text-secondary">This order may have been cleared.</p>
        <div className="mt-4">
          <Link href="/orders">
            <Button variant="secondary">Back to orders</Button>
          </Link>
        </div>
      </main>
    );
  }

  const currentIndex = steps.findIndex((s) => s.key === order.status);

  // --- MAP LOGIC (replaces placeholder) ---
  // Set your restaurant location/address here (can be a full address for better accuracy)
  const restaurantAddress = "Amukpe NDDC Road, Amukpe, Sapele, Delta State, Nigeria";

  const deliveryDestination =
    order.type === "delivery" && order.address
      ? [order.address.line1, order.address.area].filter(Boolean).join(", ")
      : null;

  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // If we have a key + destination, show directions route.
  const directionsUrl =
    mapsKey && deliveryDestination
      ? `https://www.google.com/maps/embed/v1/directions?key=${encodeURIComponent(
          mapsKey
        )}&origin=${encodeURIComponent(restaurantAddress)}&destination=${encodeURIComponent(
          deliveryDestination
        )}`
      : null;

  // Otherwise show a basic embed map (often works without an API key).
  const basicUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    deliveryDestination ?? restaurantAddress
  )}&output=embed`;

  const mapSrc = directionsUrl ?? basicUrl;

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-semibold">{order.orderNumber}</h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${statusPillClass(
                order.status
              )}`}
            >
              {statusLabel(order.status)}
            </span>
          </div>

          <p className="text-sm text-yum-text-secondary">
            Total:{" "}
            <span className="font-semibold text-brand-deep">
              {formatNaira(order.totalNaira)}
            </span>
          </p>
        </div>

        <Link className="text-sm font-semibold text-brand-deep" href="/orders">
          ← Orders
        </Link>
      </div>

      {/* Controls (still local/demo until backend is wired) */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-yum-text-secondary">Order controls</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => advanceDemo(order.id)}
              disabled={order.status === "delivered" || order.status === "canceled"}
            >
              Advance status
            </Button>

            <Button
              variant="ghost"
              className="text-brand-deep hover:bg-brand-deep/10"
              onClick={() => cancel(order.id)}
              disabled={order.status === "delivered" || order.status === "canceled"}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Timeline */}
        <Card className="p-5">
          <h2 className="text-lg font-semibold">Status timeline</h2>

          <div className="mt-4 space-y-3">
            {steps.map((s, idx) => {
              const done = idx <= currentIndex && order.status !== "canceled";
              const canceled = order.status === "canceled";

              const eventTime = order.events?.find((e) => e.type === s.key)?.at;

              return (
                <div key={s.key} className="flex items-center gap-3">
                  <div
                    className={
                      canceled
                        ? "h-3 w-3 rounded-full bg-brand-deep ring-4 ring-brand-deep/15"
                        : done
                        ? "h-3 w-3 rounded-full bg-brand-primary ring-4 ring-brand-sun/25"
                        : "h-3 w-3 rounded-full bg-black/10"
                    }
                  />
                  <div className="flex-1">
                    <p className={done ? "font-semibold" : "text-yum-text-secondary"}>
                      {s.label}
                    </p>
                    {eventTime ? (
                      <p className="text-xs text-yum-text-secondary">
                        {new Date(eventTime).toLocaleTimeString()}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}

            {order.status === "canceled" ? (
              <div className="mt-3 p-3 rounded-lg bg-brand-deep/10 ring-1 ring-black/5">
                <p className="font-semibold text-brand-deep">Order canceled</p>
                <p className="text-sm text-yum-text-secondary">
                  In production this would include a reason and refund info.
                </p>
              </div>
            ) : null}
          </div>
        </Card>

        {/* Real Map (replaces placeholder) */}
        <Card className="p-5">
          <h2 className="text-lg font-semibold">Map</h2>

          <div className="mt-4 rounded-lg overflow-hidden ring-1 ring-black/5 bg-white">
            <iframe
              title="Order map"
              src={mapSrc}
              className="w-full h-72"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          {order.type === "delivery" && order.address ? (
            <div className="mt-4 text-sm">
              <p className="font-semibold">Deliver to</p>
              <p className="text-yum-text-secondary">
                {order.address.fullName} • {order.address.phone}
              </p>
              <p className="text-yum-text-secondary">{order.address.line1}</p>
              {order.address.area ? (
                <p className="text-yum-text-secondary">{order.address.area}</p>
              ) : null}
              {order.address.note ? (
                <p className="text-yum-text-secondary">Note: {order.address.note}</p>
              ) : null}

              {!mapsKey ? (
                <p className="mt-2 text-xs text-yum-text-secondary">
                  Optional: add <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to show full directions route.
                </p>
              ) : null}
            </div>
          ) : (
            <div className="mt-4 text-sm text-yum-text-secondary">
              Map is showing the restaurant area. Add a delivery address to show customer location/route.
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}