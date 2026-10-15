import type { Payment } from "@/lib/api";

const STYLES: Record<Payment["status"], string> = {
  PENDING: "bg-amber-100 text-amber-800",
  PAID: "bg-emerald-100 text-emerald-800",
  EXPIRED: "bg-slate-100 text-slate-600",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function PaymentStatusBadge({ status }: { status: Payment["status"] }) {
  return <span className={`px-2 py-0.5 rounded-full text-xs ${STYLES[status]}`}>{status}</span>;
}
