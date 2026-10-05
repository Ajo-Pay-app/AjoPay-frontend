import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AjoPay — Merchant Dashboard",
  description: "Accept USDC, settle straight to NGN, KES and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b border-slate-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="font-bold text-lg text-ajo-green">
              AjoPay
            </a>
            <nav className="text-sm space-x-4">
              <a href="/dashboard" className="hover:underline">
                Dashboard
              </a>
              <a href="/login" className="hover:underline">
                Log in
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
