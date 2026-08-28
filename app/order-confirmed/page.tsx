"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { CheckCircle } from "lucide-react";

function OrderConfirmedContent() {
  const params = useSearchParams();
  const router = useRouter();
  const txnid = params.get("txnid");
  const paymentId = params.get("paymentId");

  useEffect(() => {
    // Clear cart is already handled
    // Redirect to tracking page after 5 seconds
    const timer = setTimeout(() => {
      router.push(`/track-order?txnid=${txnid}`);
    }, 5000);
    return () => clearTimeout(timer);
  }, [txnid, router]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-sage/20 flex items-center justify-center mb-6">
        <CheckCircle size={32} className="text-brand-sage" strokeWidth={1.5} />
      </div>

      <h1 className="font-display text-4xl text-brand-ink mb-3">Order Confirmed</h1>
      <p className="font-body text-brand-ink/60 text-sm mb-8 max-w-sm">
        Thank you for shopping with Aakhya. Your order has been placed and we'll begin processing it shortly.
      </p>

      {txnid && (
        <div className="bg-brand-bgprimary rounded-2xl px-8 py-6 mb-8 space-y-2 w-full max-w-sm">
          <div className="flex justify-between font-body text-sm">
            <span className="text-brand-ink/50">Transaction ID</span>
            <span className="text-brand-ink text-xs">{txnid}</span>
          </div>
          {paymentId && (
            <div className="flex justify-between font-body text-sm">
              <span className="text-brand-ink/50">Payment ID</span>
              <span className="text-brand-ink text-xs">{paymentId}</span>
            </div>
          )}
        </div>
      )}

      <p className="font-body text-xs text-brand-ink/40 mb-2">
        A confirmation email will be sent shortly.
      </p>
      <p className="font-body text-xs text-brand-ink/40 mb-8">
        Redirecting to order tracking in 5 seconds...
      </p>

      <button
        onClick={() => router.push(`/track-order?txnid=${txnid}`)}
        className="h-12 px-8 bg-brand-ink text-brand-ivory rounded-full font-body text-sm uppercase tracking-[0.15em] hover:bg-brand-ink/80 transition-all cursor-pointer"
      >
        Track My Order
      </button>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense>
      <OrderConfirmedContent />
    </Suspense>
  );
}