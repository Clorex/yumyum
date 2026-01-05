"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";
import { CartProvider } from "@/store/cart";
import { FavoritesProvider } from "@/store/favorites";
import { OrdersProvider } from "@/store/orders";
import { MenuProvider } from "@/store/menu";
import { CustomerAuthProvider } from "@/store/customerAuth";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const showBottomNav = !isAdmin;

  return (
    <CustomerAuthProvider>
      <MenuProvider>
        <CartProvider>
          <FavoritesProvider>
            <OrdersProvider>
              {isAdmin ? (
                <div className="min-h-screen bg-yum-bg">{children}</div>
              ) : (
                <div className="min-h-screen bg-neutral-100">
                  {/* Centered phone-app frame */}
                  <div className="mx-auto w-full max-w-[430px] min-h-screen bg-yum-bg ring-1 ring-black/5 shadow-xl">
                    <div className={showBottomNav ? "pb-28" : ""}>{children}</div>
                    {showBottomNav ? <BottomNav /> : null}
                  </div>
                </div>
              )}
            </OrdersProvider>
          </FavoritesProvider>
        </CartProvider>
      </MenuProvider>
    </CustomerAuthProvider>
  );
}