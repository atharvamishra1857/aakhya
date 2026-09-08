"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { fbTrack } from "@/lib/fbpixel";

function OrderConfirmedContent() {
  const params = useSearchParams();
  const router = useRouter();
  const txnid = params.get("txnid");
  const paymentId = params.get("paymentId");

  // ── META PIXEL: Purchase (client-side) ──
  // This fires the browser-side half of the Purchase event. The server-side
  // half is fired from /api/payu/verify via the Conversions API. Both use
  // `txnid` as the shared eventID so Meta deduplicates them into one event
  // instead of counting two purchases.
  useEffect(() => {
    if (!txnid) return;

    let order: { cartItems?: { id: string; quantity: number }[]; cartTotal?: number } | null =
      null;
    try {
      const pending = sessionStorage.getItem("payu_pending_order");
      order = pending ? JSON.parse(pending) : null;
    } catch {
      order = null;
    }

    fbTrack(
      "Purchase",
      {
        value: order?.cartTotal,
        currency: "INR",
        content_ids: order?.cartItems?.map((i) => i.id) || [],
        contents: order?.cartItems?.map((i) => ({
          id: i.id,
          quantity: i.quantity,
        })) || [],
      },
      txnid,
    );

    // Clean up now that the purchase has been recorded client-side.
    sessionStorage.removeItem("payu_pending_order");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txnid]);

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