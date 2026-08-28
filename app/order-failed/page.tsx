"use client";

import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

export default function OrderFailedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
        <XCircle size={32} className="text-red-400" strokeWidth={1.5} />
      </div>
      <h1 className="font-display text-4xl text-brand-ink mb-3">Payment Failed</h1>
      <p className="font-body text-brand-ink/60 text-sm mb-8 max-w-sm">
        Your payment was not completed. No money has been charged. Please try again.
      </p>
      <button onClick={() => router.push("/checkout")}
        className="h-12 px-8 bg-brand-ink text-brand-ivory rounded-full font-body text-sm uppercase tracking-[0.15em] hover:bg-brand-ink/80 transition-all cursor-pointer">
        Try Again
      </button>
    </div>
  );
}