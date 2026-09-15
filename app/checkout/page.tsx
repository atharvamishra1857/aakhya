"use client";

import { useState, useRef } from "react";
import { useCart } from "@/context/cartcontext";
import { useRouter } from "next/navigation";
import { fbTrack } from "@/lib/fbpixel";
import Image from "next/image";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const isSubmittingRef = useRef(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    city: "",
    province: "Maharashtra",
    zip: "",
    country: "India",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) return;
    if (isSubmittingRef.current) return;

    const required = ["firstName", "lastName", "email", "phone", "address1", "city", "zip"];
    for (const field of required) {
      if (!form[field as keyof typeof form]) {
        alert(`Please fill in your ${field}`);
        return;
      }
    }

    if (!window.Razorpay) {
      alert("Payment is still loading. Please try again in a moment.");
      return;
    }

    isSubmittingRef.current = true;
    setIsProcessing(true);

    try {
      const txnid = `TXN${Date.now()}`;
      const amount = cartTotal;

      fbTrack(
        "InitiateCheckout",
        {
          value: cartTotal,
          currency: "INR",
          content_ids: cartItems.map((i) => i.id),
          contents: cartItems.map((i) => ({ id: i.id, quantity: i.quantity })),
          num_items: cartItems.length,
        },
        txnid,
      );

      // 1. Create Razorpay order server-side
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, receipt: txnid }),
      });

      if (!orderRes.ok) {
        throw new Error(`Order API returned ${orderRes.status}`);
      }

      const { orderId, amount: orderAmount, currency, key } = await orderRes.json();

      if (!orderId || !key) {
        throw new Error("Order ID or key missing from response");
      }

      // 2. Open Razorpay checkout popup
      const options = {
        key,
        amount: orderAmount,
        currency,
        name: "Aakhya",
        description: cartItems.map((i) => i.title).join(", ").slice(0, 100),
        order_id: orderId,
        prefill: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#2b2420",
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cartItems: cartItems.map((i) => ({
                  id: i.id,
                  title: i.title,
                  price: i.price,
                  quantity: i.quantity,
                })),
                amount,
                form,
                txnid,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              router.push(
                `/order-confirmed?txnid=${verifyData.txnid}&paymentId=${verifyData.paymentId}`,
              );
            } else {
              router.push("/order-failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            router.push("/order-failed");
          } finally {
            isSubmittingRef.current = false;
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            // User closed the popup without paying
            isSubmittingRef.current = false;
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        isSubmittingRef.current = false;
        setIsProcessing(false);
        router.push("/order-failed");
      });
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong. Please try again.");
      isSubmittingRef.current = false;
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bgprimary">
        <p className="font-display text-2xl text-brand-ink mb-6">Your cart is empty</p>
        <button onClick={() => router.push("/")} className="font-body text-sm text-brand-ink underline">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="border-b border-brand-ink/10 px-6 py-4 flex items-center justify-between">
        <button onClick={() => router.push("/")} className="font-display text-2xl text-brand-ink">
          Aakhya
        </button>
        <p className="font-body text-xs text-brand-ink/40 tracking-widest uppercase">Secure Checkout</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-display text-2xl text-brand-ink mb-8">Delivery Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} className="border border-brand-ink/20 rounded-lg px-4 py-3 font-body text-sm text-brand-ink bg-transparent focus:outline-none focus:border-brand-ink" />
              <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} className="border border-brand-ink/20 rounded-lg px-4 py-3 font-body text-sm text-brand-ink bg-transparent focus:outline-none focus:border-brand-ink" />
            </div>
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border border-brand-ink/20 rounded-lg px-4 py-3 font-body text-sm text-brand-ink bg-transparent focus:outline-none focus:border-brand-ink" />
            <input name="phone" type="tel" placeholder="Phone number" value={form.phone} onChange={handleChange} className="w-full border border-brand-ink/20 rounded-lg px-4 py-3 font-body text-sm text-brand-ink bg-transparent focus:outline-none focus:border-brand-ink" />
            <input name="address1" placeholder="Address" value={form.address1} onChange={handleChange} className="w-full border border-brand-ink/20 rounded-lg px-4 py-3 font-body text-sm text-brand-ink bg-transparent focus:outline-none focus:border-brand-ink" />
            <div className="grid grid-cols-2 gap-4">
              <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="border border-brand-ink/20 rounded-lg px-4 py-3 font-body text-sm text-brand-ink bg-transparent focus:outline-none focus:border-brand-ink" />
              <input name="zip" placeholder="PIN code" value={form.zip} onChange={handleChange} className="border border-brand-ink/20 rounded-lg px-4 py-3 font-body text-sm text-brand-ink bg-transparent focus:outline-none focus:border-brand-ink" />
            </div>
            <select name="province" value={form.province} onChange={handleChange} className="w-full border border-brand-ink/20 rounded-lg px-4 py-3 font-body text-sm text-brand-ink bg-transparent focus:outline-none focus:border-brand-ink">
              {["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="mt-8 w-full h-14 bg-brand-ink text-brand-ivory rounded-full font-body text-sm uppercase tracking-[0.15em] transition-all hover:bg-brand-ink/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isProcessing ? "Processing..." : `Pay ₹${cartTotal.toLocaleString("en-IN")}`}
          </button>
          <p className="mt-4 text-center font-body text-xs text-brand-ink/40">🔒 Secured by Razorpay · All transactions are encrypted</p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-brand-ink mb-8">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-brand-bgprimary flex-shrink-0">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-ink text-brand-ivory text-[10px] rounded-full flex items-center justify-center font-body">{item.quantity}</span>
                </div>
                <div className="flex-1">
                  <p className="font-display text-sm text-brand-ink">{item.title}</p>
                  {item.variantTitle && <p className="font-body text-xs text-brand-ink/50">{item.variantTitle}</p>}
                </div>
                <p className="font-body text-sm text-brand-ink">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-brand-ink/10 space-y-2">
            <div className="flex justify-between font-body text-sm text-brand-ink/60">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between font-body text-sm text-brand-ink/60">
              <span>Shipping</span>
              <span>{cartTotal >= 20000 ? "Free" : "Calculated at next step"}</span>
            </div>
            <div className="flex justify-between font-display text-lg text-brand-ink pt-2 border-t border-brand-ink/10">
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}