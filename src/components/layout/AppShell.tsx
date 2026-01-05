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
              <div className={`min-h-screen bg-yum-bg ${showBottomNav ? "pb-20" : "pb-0"}`}>
                {children}
                {showBottomNav ? <BottomNav /> : null}
              </div>
            </OrdersProvider>
          </FavoritesProvider>
        </CartProvider>
      </MenuProvider>
    </CustomerAuthProvider>
  );
}