"use client";

import { useState } from "react";
import { useCart } from "@/context/cartcontext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
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

    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address1",
      "city",
      "zip",
    ];
    for (const field of required) {
      if (!form[field as keyof typeof form]) {
        alert(`Please fill in your ${field}`);
        return;
      }
    }

    setIsProcessing(true);

    try {
      const txnid = `TXN${Date.now()}`;
      const amount = "1.00";
      const productinfo = cartItems
        .map((i) => i.title)
        .join(", ")
        .slice(0, 100);
      const firstname = form.firstName;
      const email = form.email;

      // Get hash from our API
      const udf1 = JSON.stringify(cartItems.map(i => ({
        id: i.id,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
      })));

      const hashRes = await fetch("/api/payu/hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txnid, amount, productinfo, firstname, email, udf1 }),
      });

      const { hash, key } = await hashRes.json();

      // Store cart + address in sessionStorage for after payment returns
      sessionStorage.setItem(
        "payu_pending_order",
        JSON.stringify({ cartItems, cartTotal, form, txnid }),
      );

      // Build PayU form and auto-submit
      const payuData: Record<string, string> = {
        key,
        txnid,
        amount,
        productinfo,
        firstname,
        lastname: form.lastName,
        email,
        phone: form.phone,
        address1: form.address1,
        city: form.city,
        state: form.province,
        zipcode: form.zip,
        country: form.country,
        udf1: udf1,
        hash,
        surl: `${window.location.origin}/api/payu/verify`,
        furl: `${window.location.origin}/order-failed`,
      };

      const payuForm = document.createElement("form");
      payuForm.method = "POST";
      payuForm.action =
        process.env.NEXT_PUBLIC_PAYU_BASE_URL ||
        "https://test.payu.in/_payment";

      Object.entries(payuData).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = v;
        payuForm.appendChild(input);
      });

      document.body.appendChild(payuForm);
      payuForm.submit();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bgprimary">
        <p className="font-display text-2xl text-brand-ink mb-6">
          Your cart is empty
        </p>
        <button
          onClick={() => router.push("/")}
          className="font-body text-sm text-brand-ink underline"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="border-b border-brand-ink/10 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="font-display text-2xl text-brand-ink"
        >
          Aakhya
        </button>
        <p className="font-body text-xs text-brand-ink/40 tracking-widest uppercase">
          Secure Checkout
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left — Form */}
        <div>
          <h2 className="font-display text-2xl text-brand-ink mb-8">
            Delivery Details
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                className="border border-brand-ink/20 rounded-lg px-4 py-3 font-body text-sm text-brand-ink bg-transparent focus:outline-none focus:border-brand-ink"
              />
              <input
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                className="border border-brand-ink/20 rounded-lg px-4 py-3 font-body text-sm text-brand-ink bg-transparent focus:outline-none focus:border-brand-ink"
              />
            </div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-brand-ink/20 rounded-lg px-4 py-3 font-body text-sm text-brand-ink bg-transparent focus:outline-none focus:border-brand-ink"
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-brand-ink/20 rounded-lg px-4 py-3 font-body text-sm text-brand-ink bg-transparent focus:outline-none focus:border-brand-ink"
            />
            <input
              name="address1"
              placeholder="Address"
              value={form.address1}
              onChange={handleChange}
              className="w-full border border-brand-ink/20 rounded-lg px-4 py-3 font-body text-sm text-brand-ink bg-transparent focus:outline-none focus:border-brand-ink"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="border border-brand-ink/20 rounded-lg px-4 py-3 font-body text-sm text-brand-ink bg-transparent focus:outline-none focus:border-brand-ink"
              />
              <input
                name="zip"
                placeholder="PIN code"
                value={form.zip}
                onChange={handleChange}
                className="border border-brand-ink/20 rounded-lg px-4 py-3 font-body text-sm text-brand-ink bg-transparent focus:outline-none focus:border-brand-ink"
              />
            </div>
            <select
              name="province"
              value={form.province}
              onChange={handleChange}
              className="w-full border border-brand-ink/20 rounded-lg px-4 py-3 font-body text-sm text-brand-ink bg-transparent focus:outline-none focus:border-brand-ink"
            >
              {[
                "Andhra Pradesh",
                "Arunachal Pradesh",
                "Assam",
                "Bihar",
                "Chhattisgarh",
                "Goa",
                "Gujarat",
                "Haryana",
                "Himachal Pradesh",
                "Jharkhand",
                "Karnataka",
                "Kerala",
                "Madhya Pradesh",
                "Maharashtra",
                "Manipur",
                "Meghalaya",
                "Mizoram",
                "Nagaland",
                "Odisha",
                "Punjab",
                "Rajasthan",
                "Sikkim",
                "Tamil Nadu",
                "Telangana",
                "Tripura",
                "Uttar Pradesh",
                "Uttarakhand",
                "West Bengal",
                "Delhi",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="mt-8 w-full h-14 bg-brand-ink text-brand-ivory rounded-full font-body text-sm uppercase tracking-[0.15em] transition-all hover:bg-brand-ink/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isProcessing
              ? "Redirecting to PayU..."
              : `Pay ₹${cartTotal.toLocaleString("en-IN")}`}
          </button>

          <p className="mt-4 text-center font-body text-xs text-brand-ink/40">
            🔒 Secured by PayU · All transactions are encrypted
          </p>
        </div>

        {/* Right — Order Summary */}
        <div>
          <h2 className="font-display text-2xl text-brand-ink mb-8">
            Order Summary
          </h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-brand-bgprimary flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-ink text-brand-ivory text-[10px] rounded-full flex items-center justify-center font-body">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-display text-sm text-brand-ink">
                    {item.title}
                  </p>
                  {item.variantTitle && (
                    <p className="font-body text-xs text-brand-ink/50">
                      {item.variantTitle}
                    </p>
                  )}
                </div>
                <p className="font-body text-sm text-brand-ink">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
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
              <span>
                {cartTotal >= 20000 ? "Free" : "Calculated at next step"}
              </span>
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
