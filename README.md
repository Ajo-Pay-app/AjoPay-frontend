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

## Tech Stack

Next.js 15, React 19, TypeScript, Tailwind CSS

## Status

Under active development — see the org-level build plan for the current milestone.

## License

MIT
