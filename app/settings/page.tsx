"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type Merchant } from "@/lib/api";
import ConnectWalletButton from "@/components/ConnectWalletButton";

export default function SettingsPage() {
  const router = useRouter();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .me()
      .then(setMerchant)
      .catch((err) => {
        setError(err.message);
        router.push("/login");
      });
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!merchant) return <p className="text-slate-500">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Merchant settings</h1>

      <div className="card space-y-3">
        <div>
          <p className="text-xs text-slate-500">Business name</p>
          <p className="font-medium">{merchant.businessName}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Email</p>
          <p className="font-medium">{merchant.email}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Payout currency</p>
          <p className="font-medium">{merchant.payoutCurrency}</p>
        </div>
      </div>

      <div className="card space-y-3">
        <p className="text-xs text-slate-500">Stellar wallet on file</p>
        <p className="font-mono text-xs break-all">{merchant.stellarAddress}</p>
        <p className="text-xs text-slate-400">
          This is the address checkout payments ultimately settle to on-chain. Connecting a
          wallet below lets you verify it matches what's in your Freighter extension —
          updating it on the backend isn't wired up yet (a good next feature to add).
        </p>
        <ConnectWalletButton />
      </div>
    </div>
  );
}
