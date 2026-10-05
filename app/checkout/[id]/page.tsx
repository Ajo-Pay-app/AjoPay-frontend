"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { api, type Payment } from "@/lib/api";

export default function CheckoutPage() {
  const params = useParams<{ id: string }>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const p = await api.getPayment(params.id);
      setPayment(p);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    refresh();
    // Poll for status changes so the page updates once the indexer marks it paid.
    const interval = setInterval(refresh, 4000);
    return () => clearInterval(interval);
  }, [params.id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!payment) return <p className="text-slate-500">Loading...</p>;

  const checkoutUrl = `ajopay:pay?paymentId=${payment.id}&amount=${payment.amountUsdc}`;

  return (
    <div className="max-w-md mx-auto card text-center space-y-4">
      <h1 className="text-lg font-semibold">Pay {payment.amountUsdc} USDC</h1>
      <p className="text-slate-500 text-sm">
        ≈ {payment.currency} {payment.amountFiat} · ref {payment.reference}
      </p>

      {payment.status === "PENDING" && (
        <>
          <div className="flex justify-center py-4">
            <QRCodeSVG value={checkoutUrl} size={200} />
          </div>
          <p className="text-xs text-slate-400">
            Scan with a Stellar wallet (e.g. Freighter mobile) to pay, or connect a wallet in-browser
            — wire up `@stellar/freighter-api` here to trigger `settlement.pay()` directly.
          </p>
          {process.env.NEXT_PUBLIC_API_BASE_URL && (
            <button
              className="btn-primary w-full"
              onClick={async () => {
                await api.simulatePay(payment.id);
                refresh();
              }}
            >
              Simulate payment (demo mode only)
            </button>
          )}
        </>
      )}

      {payment.status === "PAID" && (
        <div className="bg-emerald-50 text-emerald-800 rounded-lg p-4">
          ✅ Payment received. Settlement to {payment.currency} is queued.
        </div>
      )}

      {payment.status === "EXPIRED" && (
        <div className="bg-slate-100 text-slate-600 rounded-lg p-4">This payment request has expired.</div>
      )}
    </div>
  );
}
