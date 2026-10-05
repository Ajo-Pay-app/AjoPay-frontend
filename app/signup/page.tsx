"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api, setToken } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: "",
    email: "",
    password: "",
    stellarAddress: "",
    payoutCurrency: "NGN",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await api.signup(form);
      setToken(token);
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-xl font-semibold mb-4">Create your merchant account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="input"
          placeholder="Business name"
          value={form.businessName}
          onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          required
        />
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password (min 8 characters)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          minLength={8}
          required
        />
        <input
          className="input"
          placeholder="Stellar wallet address (G...)"
          value={form.stellarAddress}
          onChange={(e) => setForm({ ...form, stellarAddress: e.target.value })}
          required
        />
        <select
          className="input"
          value={form.payoutCurrency}
          onChange={(e) => setForm({ ...form, payoutCurrency: e.target.value })}
        >
          <option value="NGN">Nigeria — NGN</option>
          <option value="KES">Kenya — KES</option>
          <option value="GHS">Ghana — GHS</option>
          <option value="ZAR">South Africa — ZAR</option>
        </select>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
