"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, ShoppingCart, ClipboardList, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/cn";
import { useCart } from "@/store/cart";

const nav = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/menu", label: "Menu", Icon: UtensilsCrossed },
  { href: "/cart", label: "Order", Icon: ShoppingCart }, // center button
  { href: "/favorites", label: "Fav", Icon: Heart },
  { href: "/orders", label: "Orders", Icon: ClipboardList },
];

export function BottomNav() {
  const pathname = usePathname();
  const { itemsCount } = useCart();

  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 px-3 pb-[max(12px,env(safe-area-inset-bottom))]">
      <div className="relative h-16 rounded-full bg-white/92 backdrop-blur ring-1 ring-black/10 shadow-lg">
        <div className="grid h-full grid-cols-5 items-center">
          {nav.map(({ href, label, Icon }) => {
            const active = pathname === href;
            const isCart = href === "/cart";

            if (isCart) {
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative -mt-8 flex flex-col items-center justify-center"
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "relative grid h-14 w-14 place-items-center rounded-full text-white",
                      "bg-gradient-to-r from-[color:var(--primary)] via-[color:var(--sun)] to-[color:var(--primary-pressed)]",
                      "ring-1 ring-black/10 shadow-[0_18px_34px_rgba(20,138,47,0.25)]"
                    )}
                  >
                    <Icon size={24} />
                    {itemsCount > 0 ? (
                      <span className="absolute -top-2 -right-2 min-w-6 h-6 px-1 rounded-full bg-white text-[color:var(--deep)] text-[11px] font-extrabold flex items-center justify-center ring-1 ring-black/10">
                        {itemsCount > 99 ? "99+" : itemsCount}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 text-[11px] font-semibold text-yum-text-secondary">
                    {label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-[11px] font-semibold",
                  active ? "text-[color:var(--deep)]" : "text-yum-text-secondary"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}