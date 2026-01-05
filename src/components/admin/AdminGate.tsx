"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";

const KEY = "yumyum_admin_authed_v1";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ok, setOk] = React.useState(false);

  React.useEffect(() => {
    const authed = sessionStorage.getItem(KEY) === "1";
    if (!authed && pathname !== "/admin/login") {
      router.replace("/admin/login");
      return;
    }
    setOk(true);
  }, [router, pathname]);

  if (!ok) return null;
  return <>{children}</>;
}

export function adminLogin() {
  sessionStorage.setItem(KEY, "1");
}

export function adminLogout() {
  sessionStorage.removeItem(KEY);
}