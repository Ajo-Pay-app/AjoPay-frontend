export default function HomePage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-ajo-ink mb-4">
        Get paid in USDC. <span className="text-ajo-green">Cash out in Naira.</span>
      </h1>
      <p className="text-slate-600 max-w-xl mx-auto mb-8">
        AjoPay lets Nigerian and African merchants accept stablecoin payments via QR
        code or link, with real-time FX conversion and settlement straight to your
        bank — non-custodial, on Stellar.
      </p>
      <div className="space-x-3">
        <a href="/signup" className="btn-primary">
          Create your merchant account
        </a>
        <a href="/login" className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">
          Log in
        </a>
      </div>
    </div>
  );
}
