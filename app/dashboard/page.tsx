"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type Payment } from "@/lib/api";

const statusColor: Record<Payment["status"], string> = {
  PENDING: "bg-amber-100 text-amber-800",
  PAID: "bg-emerald-100 text-emerald-800",
  EXPIRED: "bg-slate-100 text-slate-600",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<{ paidCount: number; pendingCount: number; totalFiatEarned: string } | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [amount, setAmount] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const [s, p] = await Promise.all([api.summary(), api.listPayments()]);
      setSummary(s);
      setPayments(p);
    } catch (err) {
      setError((err as Error).message);
      if ((err as Error).message.includes("token")) router.push("/login");
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onCreate() {
    setCreating(true);
    setError(null);
    try {
      const payment = await api.createPayment({ amountUsdc: Number(amount) });
      router.push(`/checkout/${payment.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-sm text-slate-500">Paid</p>
          <p className="text-2xl font-bold">{summary?.paidCount ?? "-"}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-2xl font-bold">{summary?.pendingCount ?? "-"}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-slate-500">Fiat earned</p>
          <p className="text-2xl font-bold">{summary?.totalFiatEarned ?? "-"}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-3">New payment request</h2>
        <div className="flex gap-2">
          <input
            className="input"
            placeholder="Amount in USDC"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button className="btn-primary whitespace-nowrap" onClick={onCreate} disabled={creating || !amount}>
            {creating ? "Creating..." : "Generate checkout link"}
          </button>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      <div className="card">
        <h2 className="font-semibold mb-3">Recent payments</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b">
            <tr>
              <th className="py-2">Reference</th>
              <th>USDC</th>
              <th>Fiat</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="py-2">{p.reference}</td>
                <td>{p.amountUsdc}</td>
                <td>
                  {p.currency} {p.amountFiat}
                </td>
                <td>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor[p.status]}`}>{p.status}</span>
                </td>
                <td>
                  <a href={`/checkout/${p.id}`} className="text-ajo-green underline text-xs">
                    View
                  </a>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-400">
                  No payments yet — create one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
