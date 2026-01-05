"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useMenu } from "@/store/menu";
import { formatNaira } from "@/lib/money";
import type { MenuItem } from "@/data/menu";
import { QuickAdd } from "@/components/cart/QuickAdd";

// ✅ FIX: match the real filename casing: src/components/layout/luxuryFooter.tsx
import { LuxuryFooter } from "@/components/layout/luxuryFooter";

function firstOf(items: MenuItem[], slug: string) {
  return items.find((x) => x.categorySlug === slug) ?? null;
}

export default function HomePage() {
  const router = useRouter();
  const { categories, items } = useMenu();

  const featuredChicken = firstOf(items, "chicken-chips");
  const featuredTurkey = firstOf(items, "turkey-chips");
  const featuredDrink = firstOf(items, "drinks");

  const offers = [
    { title: "Special offer", subtitle: "Chicken & Chips", image: "/images/chicken-1.jpg" },
    { title: "Luxury box", subtitle: "Turkey & Chips", image: "/images/turkey-1.jpg" },
    { title: "Cold & premium", subtitle: "Coca‑Cola", image: "/images/cocacola.jpg" },
  ];

  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % offers.length), 4200);
    return () => window.clearInterval(id);
  }, [offers.length]);

  return (
    <main className="min-h-screen bg-yum-bg">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-black/5">
        <div className="container-max px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-yum-text-secondary">Delivery to</p>
            <p className="font-semibold">Home</p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/menu">
              <Button variant="secondary" size="sm">
                Menu
              </Button>
            </Link>
            <Link href="/cart">
              <Button size="sm">Your order</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container-max px-4 py-6 space-y-8">
        <Input
          placeholder="Search chicken, turkey, drinks…"
          leftIcon={<Search size={18} />}
          onKeyDown={(e) => {
            if (e.key === "Enter") router.push("/menu");
          }}
        />

        {/* Animated luxury hero */}
        <Card className="overflow-hidden relative">
          <div className="relative p-6 sm:p-8">
            <div className="absolute inset-0 lux-shimmer pointer-events-none" />
            <div
              className="absolute inset-0 pointer-events-none opacity-45"
              style={{
                background:
                  "radial-gradient(circle at 20% 20%, rgba(255,187,53,0.55), transparent 55%), radial-gradient(circle at 80% 20%, rgba(248,134,1,0.45), transparent 50%), radial-gradient(circle at 30% 90%, rgba(167,62,20,0.25), transparent 55%)",
              }}
            />

            <div className="relative grid gap-5 md:grid-cols-[1.2fr_0.8fr] items-center">
              <div className="fade-up">
                <div className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-[color:var(--deep)] ring-1 ring-black/10">
                  {offers[i].title}
                </div>

                <h1 className="mt-3 text-3xl font-extrabold lux-title">{offers[i].subtitle}</h1>

                <p className="mt-2 text-sm text-yum-text-secondary max-w-md">
                  Premium taste. Premium packaging. Fast delivery.
                </p>

                <div className="mt-4 flex gap-2">
                  <Link href="/menu">
                    <Button>Order now</Button>
                  </Link>
                  <Link href="/menu">
                    <Button variant="secondary">Explore</Button>
                  </Link>
                </div>

                <div className="mt-4 flex gap-2">
                  {offers.map((_, idx) => (
                    <button
                      key={idx}
                      className={
                        "h-2.5 w-2.5 rounded-full " +
                        (idx === i ? "bg-[color:var(--primary)]" : "bg-black/15")
                      }
                      onClick={() => setI(idx)}
                      aria-label={`Offer ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="relative h-56 rounded-2xl overflow-hidden ring-1 ring-black/10 bg-white floaty">
                <Image
                  src={offers[i].image}
                  alt="Offer"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Categories (lux tiles) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Categories</h2>
            <Link className="text-sm font-semibold text-[color:var(--deep)]" href="/menu">
              View all <ArrowRight size={16} className="inline-block" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => router.push(`/menu?category=${encodeURIComponent(c.slug)}`)}
                className="rounded-2xl bg-white/86 ring-1 ring-black/10 p-3 text-left card-hover"
              >
                <div className="h-10 w-10 rounded-xl bg-[color:var(--sun)]/70 ring-1 ring-black/10 flex items-center justify-center text-lg">
                  {"🍽️"}
                </div>
                <p className="mt-2 text-sm font-semibold">{c.name}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Featured (only a few, not everything) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Featured</h2>
            <Link className="text-sm font-semibold text-[color:var(--deep)]" href="/menu">
              See more <ArrowRight size={16} className="inline-block" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[featuredChicken, featuredTurkey, featuredDrink]
              .filter(Boolean)
              .map((item) => {
                const it = item as MenuItem;
                return (
                  <Card key={it.id} className="overflow-hidden card-hover">
                    <div className="relative h-44 bg-yum-surface">
                      <Image
                        src={it.image}
                        alt={it.name}
                        fill
                        sizes="(max-width:768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{it.name}</p>
                          <p className="text-sm text-yum-text-secondary">{it.description}</p>
                        </div>
                        <p className="font-extrabold text-[color:var(--deep)] whitespace-nowrap">
                          {formatNaira(it.priceNaira)}
                        </p>
                      </div>

                      {/* ORDER BUTTON ALWAYS VISIBLE */}
                      <QuickAdd itemId={it.id} disabled={!it.inStock} />
                    </div>
                  </Card>
                );
              })}
          </div>
        </section>

        <LuxuryFooter />
        <div className="h-16" />
      </div>
    </main>
  );
}