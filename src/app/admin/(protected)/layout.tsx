import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { AdminShell } from "@/components/admin/AdminShell";

function allowedAdmin(email?: string | null) {
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (!email) return false;
  if (list.length === 0) return true; // dev fallback
  return list.includes(email.toLowerCase());
}

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) redirect("/admin/login");
  if (!allowedAdmin(email)) redirect("/admin/login?error=notallowed");

  return <AdminShell user={session.user}>{children}</AdminShell>;
}