import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Yumyum",
  description: "Chicken & Chips • Turkey & Chips • Sides & Drinks",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}