"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Heart } from "lucide-react";
import type { MenuItem } from "@/data/menu";
import { formatNaira } from "@/lib/money";
import { useCart } from "@/store/cart";
import { useFavorites } from "@/store/favorites";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ItemDetails({ item }: { item: MenuItem }) {
  const { add } = useCart();
  const { has, toggle } = useFavorites();
  const [qty, setQty] = React.useState(1);

  const liked = has(item.id);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <Link className="text-sm font-semibold text-brand-deep" href="/menu">
          ← Back to menu
        </Link>
        <Link className="text-sm font-semibold text-brand-deep" href="/cart">
          View cart
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="relative h-64 bg-yum-surface">
          <Image src={item.image} alt={item.name} fill className="object-cover" />

          <button
            type="button"
            onClick={() => toggle(item.id)}
            className="absolute top-4 right-4 z-10 h-11 w-11 rounded-full bg-white/95 ring-1 ring-black/10 flex items-center justify-center"
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              size={22}
              className={liked ? "text-brand-deep" : "text-yum-text-secondary"}
              fill={liked ? "#AC1A08" : "transparent"}
            />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">{item.name}</h1>
              <p className="mt-1 text-yum-text-secondary">{item.description}</p>
              <p className="mt-2 text-xs text-yum-text-secondary">
                Prep time: ~{item.prepMinutes ?? 20} mins
              </p>
            </div>

            <div className="font-semibold text-brand-deep">
              {formatNaira(item.priceNaira)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-yum-text-secondary">Quantity</span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
              >
                –
              </Button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setQty((q) => Math.min(20, q + 1))}
                disabled={qty >= 20}
              >
                +
              </Button>
            </div>
          </div>

          <Button className="w-full" disabled={!item.inStock} onClick={() => add(item.id, qty)}>
            {item.inStock ? "Add to cart" : "Out of stock"}
          </Button>
        </div>
      </Card>
    </main>
  );
}