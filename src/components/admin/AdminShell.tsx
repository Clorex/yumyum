"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={
        "block px-3 py-2 rounded-xl font-semibold transition-colors " +
        (active
          ? "bg-brand-sun/70 text-brand-black ring-1 ring-black/10"
          : "text-yum-text-secondary hover:bg-white/70")
      }
    >
      {label}
    </Link>
  );
}

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: Session["user"];
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-yum-bg">
      <div className="mx-auto max-w-6xl px-4 py-6 grid gap-4 md:grid-cols-[260px_1fr]">
        <aside className="bg-white/75 rounded-2xl ring-1 ring-black/5 p-4 h-fit md:sticky md:top-6">
          <div className="mb-4">
            <p className="font-extrabold text-brand-deep text-lg">Yumyum Admin</p>
            <p className="text-xs text-yum-text-secondary">
              Signed in as <span className="font-semibold">{user?.email ?? "admin"}</span>
            </p>
          </div>

          <nav className="space-y-1">
            <NavLink href="/admin" label="Dashboard" />
            <NavLink href="/admin/menu" label="Menu items" />
            <NavLink href="/admin/categories" label="Categories" />
            <NavLink href="/admin/orders" label="Orders" />
          </nav>

          <button
            className="mt-4 w-full h-11 rounded-xl bg-white/85 ring-1 ring-black/10 font-semibold hover:bg-white"
            onClick={async () => {
              await signOut({ redirect: false });
              router.replace("/admin/login");
            }}
          >
            Logout
          </button>
        </aside>

        <section className="space-y-4">{children}</section>
      </div>
    </div>
  );
}