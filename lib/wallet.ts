"use client";

// Thin wrapper around the Freighter browser-extension wallet
// (https://www.freighter.app). Keeping all Freighter calls in one file means
// swapping in a different Stellar wallet later only touches this module.

import {
  isConnected as freighterIsConnected,
  requestAccess,
  getAddress,
  signTransaction as freighterSignTransaction,
} from "@stellar/freighter-api";

export interface WalletState {
  connected: boolean;
  address: string | null;
}

export async function isFreighterInstalled(): Promise<boolean> {
  try {
    const { isConnected } = await freighterIsConnected();
    return isConnected;
  } catch {
    return false;
  }
}

/** Prompts the Freighter extension's connect popup and returns the public key. */
export async function connectWallet(): Promise<string> {
  const access = await requestAccess();
  if (access.error) throw new Error(access.error);

  const { address, error } = await getAddress();
  if (error) throw new Error(error);
  return address;
}

export async function getConnectedAddress(): Promise<string | null> {
  try {
    const { address } = await getAddress();
    return address ?? null;
  } catch {
    return null;
  }
}

/**
 * Signs an unsigned transaction XDR built by the backend (or built client-side
 * against the settlement contract) and returns the signed XDR ready to submit
 * via Soroban RPC. The backend is responsible for building the `pay(...)`
 * invocation XDR — this function only handles the signing step in-browser.
 */
export async function signTransactionXdr(xdr: string, network: "TESTNET" | "PUBLIC") {
  const result = await freighterSignTransaction(xdr, {
    networkPassphrase:
      network === "TESTNET"
        ? "Test SDF Network ; September 2015"
        : "Public Global Stellar Network ; September 2015",
  });
  if (result.error) throw new Error(result.error);
  return result.signedTxXdr;
}
