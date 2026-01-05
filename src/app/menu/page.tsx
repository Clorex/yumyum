"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { useMenu } from "@/store/menu";
import { formatNaira } from "@/lib/money";
import type { MenuItem } from "@/data/menu";
import { QuickAdd } from "@/components/cart/QuickAdd";

export default function MenuPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const { categories, items } = useMenu();

  const categoryParam = sp.get("category") ?? "all";
  const [active, setActive] = React.useState<string>(categoryParam);
  const [q, setQ] = React.useState("");

  React.useEffect(() => setActive(categoryParam), [categoryParam]);

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((i) => {
      const matchesCategory = active === "all" ? true : i.categorySlug === active;
      const matchesQuery =
        query.length === 0 ||
        (i.name + " " + i.description + " " + i.id).toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [items, active, q]);

  function goCategory(slug: string) {
    setActive(slug);
    if (slug === "all") router.push("/menu");
    else router.push(`/menu?category=${encodeURIComponent(slug)}`);
  }

  function FoodCard({ item }: { item: MenuItem }) {
    return (
      <Card className="overflow-hidden card-hover">
        <div className="relative h-44 bg-yum-surface">
  {typeof item.image === "string" && item.image.trim().length > 0 ? (
    <Image
      src={item.image}
      alt={item.name}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      className="object-cover"
    />
  ) : (
    <div className="absolute inset-0 grid place-items-center text-sm text-yum-text-secondary">
      No image
    </div>
  )}

  {item.badge ? (
    <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-brand-deep ring-1 ring-black/10">
      {item.badge}
    </div>
  ) : null}
</div>

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold truncate">{item.name}</p>
              <p className="text-sm text-yum-text-secondary">{item.description}</p>
              <p className="mt-1 text-xs text-yum-text-secondary">
                ~{item.prepMinutes ?? 20} mins
                {item.spicy ? <span className="ml-2 font-semibold text-[color:var(--deep)]">Spicy</span> : null}
              </p>
            </div>

            <p className="font-extrabold text-[color:var(--deep)] whitespace-nowrap">
              {formatNaira(item.priceNaira)}
            </p>
          </div>

          {/* THIS IS THE ORDER BUTTON YOU WANT */}
          <QuickAdd itemId={item.id} disabled={!item.inStock} />
        </div>
      </Card>
    );
  }

  return (
    <main className="container-max px-4 py-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Menu</h1>
          <p className="text-sm text-yum-text-secondary">
            Tap <span className="font-semibold">Add to order</span> on any item.
          </p>
        </div>

        <Link className="text-sm font-semibold text-[color:var(--deep)]" href="/cart">
          Your order →
        </Link>
      </div>

      <Input
        placeholder="Search chicken, turkey, drinks…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        leftIcon={<Search size={18} />}
      />

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Chip active={active === "all"} onClick={() => goCategory("all")}>
          All
        </Chip>
        {categories.map((c) => (
          <Chip key={c.slug} active={active === c.slug} onClick={() => goCategory(c.slug)}>
            {c.name}
          </Chip>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 fade-up">
        {filtered.map((item) => (
          <FoodCard key={item.id} item={item} />
        ))}
      </div>

      <div className="h-10" />
    </main>
  );
}