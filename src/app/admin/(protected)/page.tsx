"use client";

import { Card } from "@/components/ui/Card";
import { useMenu } from "@/store/menu";
import { useOrders } from "@/store/orders";
import { formatNaira } from "@/lib/money";

export default function AdminDashboardPage() {
  const { items, categories } = useMenu();
  const { orders } = useOrders();

  const revenue = orders.reduce((sum, o) => sum + (o.totalNaira ?? 0), 0);

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-yum-text-secondary">Menu items</p>
          <p className="text-2xl font-extrabold text-brand-deep">{items.length}</p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-yum-text-secondary">Categories</p>
          <p className="text-2xl font-extrabold text-brand-deep">{categories.length}</p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-yum-text-secondary">Total orders</p>
          <p className="text-2xl font-extrabold text-brand-deep">{orders.length}</p>
        </Card>
      </div>

      <Card className="p-5">
        <p className="text-sm text-yum-text-secondary">Revenue (demo)</p>
        <p className="text-2xl font-extrabold text-brand-deep">{formatNaira(revenue)}</p>
        <p className="mt-2 text-sm text-yum-text-secondary">
          This is stored locally for now. We’ll connect a real database later.
        </p>
      </Card>
    </main>
  );
}