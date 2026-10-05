const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("ajopay_token");
}

export function setToken(token: string) {
  window.localStorage.setItem("ajopay_token", token);
}

export function clearToken() {
  window.localStorage.removeItem("ajopay_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ? JSON.stringify(data.error) : `Request failed: ${res.status}`);
  return data as T;
}

export interface Merchant {
  id: string;
  email: string;
  businessName: string;
  stellarAddress: string;
  payoutCurrency: string;
}

export interface Payment {
  id: string;
  reference: string;
  amountUsdc: string;
  currency: string;
  fxRate: string;
  amountFiat: string;
  status: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";
  createdAt: string;
  expiresAt: string;
}

export const api = {
  signup: (body: { email: string; password: string; businessName: string; stellarAddress: string; payoutCurrency: string }) =>
    request<{ token: string; merchant: Merchant }>("/auth/signup", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<{ token: string; merchant: Merchant }>("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  me: () => request<Merchant>("/me"),

  createPayment: (body: { amountUsdc: number; currency?: string }) =>
    request<Payment>("/payments", { method: "POST", body: JSON.stringify(body) }),

  getPayment: (id: string) => request<Payment>(`/payments/${id}`),

  listPayments: () => request<Payment[]>("/payments"),

  summary: () =>
    request<{ paidCount: number; pendingCount: number; totalUsdc: string; totalFiatEarned: string; totalFiatCashedOut: string }>(
      "/summary",
    ),

  cashout: (id: string) => request(`/payments/${id}/cashout`, { method: "POST" }),

  simulatePay: (id: string) => request(`/payments/${id}/simulate-pay`, { method: "POST" }),
};
