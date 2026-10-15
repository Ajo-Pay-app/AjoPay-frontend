"use client";

import { useEffect, useState } from "react";
import { connectWallet, getConnectedAddress, isFreighterInstalled } from "@/lib/wallet";

function shorten(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export default function ConnectWalletButton({
  onConnect,
}: {
  onConnect?: (address: string) => void;
}) {
  const [address, setAddress] = useState<string | null>(null);
  const [installed, setInstalled] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    isFreighterInstalled().then(setInstalled);
    getConnectedAddress().then(setAddress);
  }, []);

  async function handleClick() {
    if (installed === false) {
      window.open("https://www.freighter.app", "_blank");
      return;
    }
    setConnecting(true);
    setError(null);
    try {
      const addr = await connectWallet();
      setAddress(addr);
      onConnect?.(addr);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setConnecting(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-end">
      <button
        onClick={handleClick}
        disabled={connecting}
        className="px-3 py-1.5 rounded-lg border border-ajo-green text-ajo-green text-sm hover:bg-ajo-green hover:text-white transition disabled:opacity-50"
      >
        {address
          ? shorten(address)
          : installed === false
            ? "Install Freighter"
            : connecting
              ? "Connecting..."
              : "Connect wallet"}
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
