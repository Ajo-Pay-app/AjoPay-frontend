# AjoPay-Frontend

Merchant dashboard for **AjoPay** — onboard, generate USDC checkout links/QR codes,
track payments, and view settlement history, all from the browser.

## Structure

```
AjoPay-Frontend/
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── checkout/
│   └── layout.tsx
├── components/
├── lib/
├── public/
└── .env.local.example
```

## Requirements

- Node.js 20+
- A Stellar-compatible wallet browser extension (e.g. Freighter) for testing payments

## Quick Start

```bash
cp .env.local.example .env.local
npm install
npm run dev   # http://localhost:3000
```

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` — points at `AjoPay-Backend` api-gateway
- `NEXT_PUBLIC_SETTLEMENT_CONTRACT_ID` — from `AjoPay-Contract`
- `NEXT_PUBLIC_STELLAR_NETWORK` — `TESTNET` or `PUBLIC`

## Wallet Integration

`lib/wallet.ts` wraps the [Freighter](https://www.freighter.app) browser extension
(`@stellar/freighter-api`) for connecting a wallet and signing transactions.
`components/ConnectWalletButton.tsx` is a drop-in connect button used on the
settings page. The checkout page still uses a "simulate payment" demo button
rather than a real signed `pay()` call — wiring that up (build the invocation
XDR on the backend, sign it here, submit via Soroban RPC) is a good next step
once you're comfortable with the current flow.

## Tech Stack

Next.js 15, React 19, TypeScript, Tailwind CSS, `@stellar/freighter-api`

## Status

Under active development — see the org-level build plan for the current milestone.

## License

MIT
