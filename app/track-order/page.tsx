"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Package } from "lucide-react";

function TrackOrderContent() {
  const params = useSearchParams();
  const router = useRouter();
  const txnid = params.get("txnid");

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-bgprimary flex items-center justify-center mb-6">
        <Package size={32} className="text-brand-ink" strokeWidth={1.5} />
      </div>

      <h1 className="font-display text-4xl text-brand-ink mb-3">Track Your Order</h1>
      <p className="font-body text-brand-ink/60 text-sm mb-8 max-w-sm">
        Your order is being processed. Once shipped, you'll receive a tracking number via email.
      </p>

      {txnid && (
        <div className="bg-brand-bgprimary rounded-2xl px-8 py-6 mb-8 w-full max-w-sm">
          <div className="flex justify-between font-body text-sm">
            <span className="text-brand-ink/50">Transaction ID</span>
            <span className="text-brand-ink text-xs">{txnid}</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-sm mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-brand-sage/30 flex items-center justify-center text-xs font-body text-brand-ink">1</div>
          <div className="flex-1">
            <p className="font-body text-sm text-brand-ink">Order Placed</p>
            <p className="font-body text-xs text-brand-ink/50">Payment confirmed</p>
          </div>
          <span className="text-brand-sage text-xs font-body">✓ Done</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-brand-ink/10 flex items-center justify-center text-xs font-body text-brand-ink">2</div>
          <div className="flex-1">
            <p className="font-body text-sm text-brand-ink">Processing</p>
            <p className="font-body text-xs text-brand-ink/50">We're preparing your order</p>
          </div>
          <span className="text-brand-ink/30 text-xs font-body">Pending</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-brand-ink/10 flex items-center justify-center text-xs font-body text-brand-ink">3</div>
          <div className="flex-1">
            <p className="font-body text-sm text-brand-ink">Shipped</p>
            <p className="font-body text-xs text-brand-ink/50">On the way to you</p>
          </div>
          <span className="text-brand-ink/30 text-xs font-body">Pending</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-ink/10 flex items-center justify-center text-xs font-body text-brand-ink">4</div>
          <div className="flex-1">
            <p className="font-body text-sm text-brand-ink">Delivered</p>
            <p className="font-body text-xs text-brand-ink/50">Enjoy your Aakhya order</p>
          </div>
          <span className="text-brand-ink/30 text-xs font-body">Pending</span>
        </div>
      </div>

      <p className="font-body text-xs text-brand-ink/40 mb-8">
        Questions? Email us at support@aakhyaofficial.com
      </p>

      <button
        onClick={() => router.push("/")}
        className="h-12 px-8 bg-brand-ink text-brand-ivory rounded-full font-body text-sm uppercase tracking-[0.15em] hover:bg-brand-ink/80 transition-all cursor-pointer"
      >
        Continue Shopping
      </button>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense>
      <TrackOrderContent />
    </Suspense>
  );
}