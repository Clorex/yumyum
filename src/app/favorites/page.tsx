"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useFavorites } from "@/store/favorites";
import { useMenu } from "@/store/menu";
import { formatNaira } from "@/lib/money";

export default function FavoritesPage() {
  const { ids, toggle } = useFavorites();
  const { getItemById } = useMenu();

  const items = ids.map(getItemById).filter(Boolean);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Favorites</h1>
        <Link className="text-sm font-semibold text-brand-deep" href="/menu">
          Browse menu
        </Link>
      </div>

      {items.length === 0 ? (
        <Card className="p-6">
          <h2 className="text-lg font-semibold">No favorites yet</h2>
          <p className="mt-1 text-yum-text-secondary">
            Tap the heart on any item to save it here.
          </p>
          <div className="mt-4">
            <Link href="/menu">
              <Button>Browse menu</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <Card key={item!.id} className="overflow-hidden">
              <div className="relative h-40 bg-yum-surface">
                <Link href={`/item/${item!.id}`} className="block h-full w-full">
                  <Image src={item!.image} alt={item!.name} fill className="object-cover" />
                </Link>

                <button
                  type="button"
                  onClick={() => toggle(item!.id)}
                  className="absolute top-3 right-3 z-10 h-10 w-10 rounded-full bg-white/95 ring-1 ring-black/10 flex items-center justify-center"
                  aria-label="Remove from favorites"
                >
                  <Heart size={20} className="text-brand-deep" fill="#AC1A08" />
                </button>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/item/${item!.id}`}>
                      <h3 className="font-semibold">{item!.name}</h3>
                    </Link>
                    <p className="text-sm text-yum-text-secondary">{item!.description}</p>
                  </div>

                  <span className="font-extrabold text-brand-deep">
                    {formatNaira(item!.priceNaira)}
                  </span>
                </div>

                <Link href={`/item/${item!.id}`}>
                  <Button variant="secondary" className="w-full">
                    View item
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}