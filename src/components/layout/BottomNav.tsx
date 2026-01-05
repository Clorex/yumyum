"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, ShoppingCart, ClipboardList } from "lucide-react";
import { cn } from "@/lib/cn";
import { useCart } from "@/store/cart";

const nav = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/favorites", label: "Favorites", Icon: Heart },
  { href: "/cart", label: "Order", Icon: ShoppingCart }, // renamed label
  { href: "/orders", label: "Orders", Icon: ClipboardList },
];

export function BottomNav() {
  const pathname = usePathname();
  const { itemsCount } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/80 backdrop-blur border-t border-black/5">
      <div className="mx-auto max-w-5xl px-4">
        <div className="h-16 flex items-center justify-between">
          {nav.map(({ href, label, Icon }) => {
            const active = pathname === href;
            const isOrder = href === "/cart";

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex flex-1 flex-col items-center justify-center gap-1 py-2",
                  active ? "text-brand-primary" : "text-yum-text-secondary"
                )}
                aria-current={active ? "page" : undefined}
              >
                <span className="relative">
                  <Icon size={22} />
                  {isOrder && itemsCount > 0 ? (
                    <span className="absolute -top-2 -right-3 min-w-5 h-5 px-1 rounded-full bg-brand-sun text-brand-black text-[11px] font-extrabold flex items-center justify-center ring-1 ring-black/10">
                      {itemsCount > 99 ? "99+" : itemsCount}
                    </span>
                  ) : null}
                </span>
                <span className="text-[12px] font-semibold">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}