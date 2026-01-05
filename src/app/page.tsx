"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  Menu as MenuIcon,
  UserCircle2,
  Sparkles,
  Clock,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useMenu } from "@/store/menu";
import { formatNaira } from "@/lib/money";
import type { MenuItem } from "@/data/menu";
import { QuickAdd } from "@/components/cart/QuickAdd";
import { LuxuryFooter } from "@/components/layout/luxuryFooter";

function firstOf(items: MenuItem[], slug: string) {
  return items.find((x) => x.categorySlug === slug) ?? null;
}

function ensureExtrasIncluded<T extends { slug: string }>(cats: T[]) {
  // Keep order, but ensure "extras" is included in the first 6 if it exists.
  const copy = [...cats];
  const extrasIndex = copy.findIndex((c) => c.slug === "extras");
  if (extrasIndex === -1) return copy.slice(0, 6);

  const top = copy.slice(0, 6);
  const hasExtras = top.some((c) => c.slug === "extras");
  if (hasExtras) return top;

  // Replace the last item with extras
  const extras = copy[extrasIndex];
  return [...top.slice(0, 5), extras];
}

export default function HomePage() {
  const router = useRouter();
  const { categories, items } = useMenu();

  const featuredChicken = firstOf(items, "chicken-chips");
  const featuredTurkey = firstOf(items, "turkey-chips");
  const featuredDrink = firstOf(items, "drinks");

  const offers = [
    { title: "Food Choice", subtitle: "All your favourite food", image: "/images/chicken-1.jpg" },
    { title: "Luxury Box", subtitle: "Turkey & Chips", image: "/images/turkey-1.jpg" },
    { title: "Cold Drinks", subtitle: "Coca‑Cola", image: "/images/cocacola.jpg" },
  ];

  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % offers.length), 4200);
    return () => window.clearInterval(id);
  }, [offers.length]);

  const top6Cats = ensureExtrasIncluded(categories);

  const popular = React.useMemo(() => {
    const inStock = items.filter((x) => x.inStock);
    return (inStock.length ? inStock : items).slice(0, 6);
  }, [items]);

  return (
    <main className="min-h-screen bg-yum-bg">
      {/* App-like GREEN header */}
      <header className="sticky top-0 z-10">
        <div className="bg-[color:var(--primary)] text-white">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              className="h-10 w-10 rounded-xl bg-white/10 ring-1 ring-white/15 grid place-items-center"
              onClick={() => router.push("/menu")}
              aria-label="Open menu"
            >
              <MenuIcon size={20} />
            </button>

            <div className="text-center">
              <p className="text-[11px] opacity-90">Delivery to</p>
              <p className="text-sm font-extrabold leading-tight">Home</p>
            </div>

            <button
              className="h-10 w-10 rounded-xl bg-white/10 ring-1 ring-white/15 grid place-items-center"
              onClick={() => router.push("/account")}
              aria-label="Account"
            >
              <UserCircle2 size={20} />
            </button>
          </div>

          {/* Search inside green header */}
          <div className="px-4 pb-4">
            <Input
              className="bg-white"
              placeholder="Search food, drinks…"
              leftIcon={<Search size={18} />}
              onKeyDown={(e) => {
                if (e.key === "Enter") router.push("/menu");
              }}
            />
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-8">
        {/* Hero */}
        <Card className="overflow-hidden relative">
          <div className="relative p-5">
            <div className="absolute inset-0 lux-shimmer pointer-events-none" />
            <div
              className="absolute inset-0 pointer-events-none opacity-35"
              style={{
                background:
                  "radial-gradient(circle at 20% 20%, rgba(20,138,47,0.30), transparent 55%), radial-gradient(circle at 80% 25%, rgba(201,247,211,0.55), transparent 50%), radial-gradient(circle at 30% 90%, rgba(11,92,31,0.20), transparent 55%)",
              }}
            />

            <div className="relative grid gap-4 md:grid-cols-[1.1fr_0.9fr] items-center">
              <div className="fade-up">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-[color:var(--deep)] ring-1 ring-black/10">
                  <Sparkles size={14} />
                  {offers[i].title}
                </div>

                <h1 className="mt-3 text-2xl font-extrabold lux-title">{offers[i].subtitle}</h1>

                <p className="mt-2 text-sm text-yum-text-secondary max-w-md">
                  Premium taste, clean packaging, fast delivery.
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

              <div className="relative h-52 rounded-2xl overflow-hidden ring-1 ring-black/10 bg-white floaty">
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

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-white/80 ring-1 ring-black/10 p-3 flex items-center gap-2">
                <Clock size={16} className="text-[color:var(--deep)]" />
                <p className="text-xs font-semibold">Fast</p>
              </div>
              <div className="rounded-2xl bg-white/80 ring-1 ring-black/10 p-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[color:var(--deep)]" />
                <p className="text-xs font-semibold">Clean</p>
              </div>
              <div className="rounded-2xl bg-white/80 ring-1 ring-black/10 p-3 flex items-center gap-2">
                <Truck size={16} className="text-[color:var(--deep)]" />
                <p className="text-xs font-semibold">Reliable</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Categories (EXACTLY 6 TILES) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold">Categories</h2>
            <Link className="text-sm font-semibold text-[color:var(--deep)]" href="/menu">
              View all <ArrowRight size={16} className="inline-block" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {top6Cats.map((c) => (
              <button
                key={c.slug}
                onClick={() => router.push(`/menu?category=${encodeURIComponent(c.slug)}`)}
                className="rounded-2xl bg-white/90 ring-1 ring-black/10 p-3 text-center card-hover"
              >
                <div className="mx-auto h-10 w-10 rounded-xl bg-[color:var(--sun)] ring-1 ring-black/10 flex items-center justify-center text-lg">
                  {"🍽️"}
                </div>
                <p className="mt-2 text-xs font-semibold truncate">{c.name}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Featured */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold">Featured</h2>
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

                      <QuickAdd itemId={it.id} disabled={!it.inStock} />
                    </div>
                  </Card>
                );
              })}
          </div>
        </section>

        {/* Popular (adds length + app feel) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold">Popular</h2>
            <Link className="text-sm font-semibold text-[color:var(--deep)]" href="/menu">
              Open menu <ArrowRight size={16} className="inline-block" />
            </Link>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {popular.map((it) => (
              <Card key={it.id} className="overflow-hidden card-hover">
                <div className="relative h-40 bg-yum-surface">
                  <Image
                    src={it.image}
                    alt={it.name}
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
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

                  <QuickAdd itemId={it.id} disabled={!it.inStock} />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold">How it works</h2>

          <div className="grid gap-3">
            <Card className="p-4 bg-white/90 ring-1 ring-black/10">
              <p className="text-xs font-extrabold text-[color:var(--deep)]">STEP 1</p>
              <p className="mt-1 font-semibold">Choose a category</p>
              <p className="mt-1 text-sm text-yum-text-secondary">Chicken, Turkey, Drinks, Extras…</p>
            </Card>

            <Card className="p-4 bg-white/90 ring-1 ring-black/10">
              <p className="text-xs font-extrabold text-[color:var(--deep)]">STEP 2</p>
              <p className="mt-1 font-semibold">Add to order</p>
              <p className="mt-1 text-sm text-yum-text-secondary">Tap “Add to order” on items.</p>
            </Card>

            <Card className="p-4 bg-white/90 ring-1 ring-black/10">
              <p className="text-xs font-extrabold text-[color:var(--deep)]">STEP 3</p>
              <p className="mt-1 font-semibold">Checkout</p>
              <p className="mt-1 text-sm text-yum-text-secondary">We prepare and deliver fast.</p>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <Card className="overflow-hidden relative">
          <div className="p-6">
            <h2 className="text-xl font-extrabold lux-title">Ready to order?</h2>
            <p className="mt-2 text-sm text-yum-text-secondary">
              Open the menu and build your box in seconds.
            </p>

            <div className="mt-4 flex gap-2">
              <Link href="/menu">
                <Button>Go to menu</Button>
              </Link>
              <Link href="/cart">
                <Button variant="secondary">View cart</Button>
              </Link>
            </div>
          </div>
        </Card>

        <LuxuryFooter />
        <div className="h-10" />
      </div>
    </main>
  );
}