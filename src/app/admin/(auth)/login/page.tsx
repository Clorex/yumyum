import Link from "next/link";

export default function AdminLoginPage() {
  // NextAuth sign-in URL (works without client-side JS)
  const googleSignInUrl = "/api/auth/signin/google?callbackUrl=%2Fadmin";

  return (
    <div className="min-h-screen bg-yum-bg px-4 flex items-center justify-center">
      <div className="w-full max-w-4xl grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white/85 ring-1 ring-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-8">
          <div
            className="rounded-2xl p-6 text-white"
            style={{
              background:
                "linear-gradient(90deg, #F88601 0%, #FFBB35 45%, #A73E14 100%)",
            }}
          >
            <p className="text-xs font-extrabold bg-white/20 inline-flex px-3 py-1 rounded-full">
              YUMYUM ADMIN
            </p>
            <h1 className="mt-3 text-2xl font-semibold">Owner Dashboard</h1>
            <p className="mt-2 text-sm text-white/90">
              Manage menu, prices, orders, and tracking.
            </p>
          </div>

          <p className="mt-5 text-sm text-yum-text-secondary">
            Only emails in <span className="font-semibold">ADMIN_EMAILS</span> can access.
          </p>
        </div>

        <div className="rounded-2xl bg-white/85 ring-1 ring-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-8">
          <h2 className="text-2xl font-semibold">Sign in</h2>
          <p className="mt-1 text-sm text-yum-text-secondary">
            Continue with Google to access admin.
          </p>

          <div className="mt-6 space-y-3">
            <a
              href={googleSignInUrl}
              className="w-full h-11 rounded-xl text-white font-semibold
                         bg-gradient-to-r from-[var(--primary)] to-[var(--primary-pressed)]
                         shadow-[0_10px_20px_rgba(248,134,1,0.25)]
                         hover:brightness-[1.02] active:brightness-[0.98]
                         inline-flex items-center justify-center"
            >
              Continue with Google
            </a>

            <Link className="block text-sm font-semibold text-brand-deep" href="/">
              ← Back to website
            </Link>

            <p className="text-xs text-yum-text-secondary">
              If this link opens an error page, your Google keys/redirect URI are not set yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}