import Link from "next/link";

const WHATSAPP_NUMBER = "2348059086041"; // digits only (for wa.me)
const WHATSAPP_LABEL = "+234 805 908 6041"; // how it should display

export function LuxuryFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10">
      <div className="rounded-3xl bg-white/70 backdrop-blur ring-1 ring-black/10 shadow-sm p-6 sm:p-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-extrabold text-[color:var(--primary)]">Yumyum</p>
              <p className="mt-2 text-sm text-yum-text-secondary">
                Premium Chicken & Chips · Turkey & Chips · Sides · Drinks · Sauces.
              </p>
            </div>

            <div>
              <p className="font-semibold">Open hours</p>
              <p className="text-sm text-yum-text-secondary">Mon–Sun · 10am – 10pm</p>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-3">
            <p className="font-semibold">Explore</p>
            <ul className="space-y-2 text-sm font-semibold text-[color:var(--deep)]">
              <li>
                <Link href="/menu">Menu</Link>
              </li>
              <li>
                <Link href="/favorites">Favorites</Link>
              </li>
              <li>
                <Link href="/cart">Your order</Link>
              </li>
              <li>
                <Link href="/orders">Orders</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <p className="font-semibold">Support</p>

            <div className="space-y-2 text-sm text-yum-text-secondary">
              <p>
                WhatsApp:{" "}
                <a
                  className="font-semibold text-[color:var(--deep)]"
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {WHATSAPP_LABEL}
                </a>
              </p>

              <p>
                Email:{" "}
                <a
                  className="font-semibold text-[color:var(--deep)]"
                  href="mailto:support@yumyum.com"
                >
                  support@yumyum.com
                </a>
              </p>

              <p>Delivery: Fast · Fresh · Reliable</p>

              <p className="pt-2 text-xs text-yum-text-secondary">
                © {year} Yumyum. Luxury fast food.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}