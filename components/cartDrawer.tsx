"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/cartcontext";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const FREE_SHIPPING_THRESHOLD = 20000;
  const progressPercent = Math.min(
    100,
    (cartTotal / FREE_SHIPPING_THRESHOLD) * 100,
  );

  // ─── THE CHECKOUT GENERATOR ─────────────────────────────────────────────
  const handleCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsCheckingOut(true);

    try {
      const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
      const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

      // 1. Format the local cart items into Shopify's exact required format
      const lines = cartItems.map((item) => ({
        merchandiseId: item.id, // This is the variant ID
        quantity: item.quantity,
      }));

      // 2. The GraphQL mutation to create a cart and return the checkout URL
      const query = `
        mutation CartCreate($lines: [CartLineInput!]!) {
          cartCreate(input: { lines: $lines }) {
            cart {
              checkoutUrl
            }
          }
        }
      `;

      // 3. Fetch the URL directly from Shopify
      const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token!,
        },
        body: JSON.stringify({ query, variables: { lines } }),
      });

      const json = await res.json();
      const checkoutUrl = json.data?.cartCreate?.cart?.checkoutUrl;

      // 4. Redirect the user to Shopify's secure checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        console.error("Checkout URL not generated:", json);
        setIsCheckingOut(false);
      }
    } catch (err) {
      console.error("Error connecting to checkout:", err);
      setIsCheckingOut(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[200]" onClose={closeCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-[350ms]"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-[350ms]"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-brand-bgprimary/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transition ease-out duration-[500ms] transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-out duration-[500ms] transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-[400px]">
                  <div className="flex h-full flex-col bg-[#FDFBF7] shadow-[0_0_40px_rgba(0,0,0,0.1)]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-6 border-b border-brand-ink/10">
                      <Dialog.Title className="text-[32px] font-display text-brand-ink tracking-wide">
                        Your Edit
                      </Dialog.Title>
                      <button
                        onClick={closeCart}
                        aria-label="Close cart"
                        className="text-brand-ink/60 hover:text-brand-ink transition-colors flex items-center justify-center p-2 rounded-full hover:bg-brand-ink/5"
                        style={{ minWidth: "44px", minHeight: "44px" }}
                      >
                        <X size={26} strokeWidth={1} />
                      </button>
                    </div>

                    {/* Shipping Nudge */}
                    <div className="px-6 py-4 bg-brand-parchment/40 border-b border-brand-ink/5 relative overflow-hidden">
                      <div className="h-[2px] w-full bg-brand-ink/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-brand-gold"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 text-brand-ink custom-scrollbar">
                      {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[80%] text-brand-ink/40">
                          <ShoppingBag
                            size={48}
                            strokeWidth={0.5}
                            className="mb-4 text-brand-ink/30"
                          />
                          <p className="font-body tracking-[0.1em] text-[13px] uppercase">
                            Your cart is empty
                          </p>
                        </div>
                      ) : (
                        <ul className="space-y-8">
                          {cartItems.map((item) => (
                            <li key={item.id} className="flex gap-5">
                              {/* Square image */}
                              <div className="relative h-[100px] w-[100px] flex-shrink-0 bg-brand-parchment/50 border border-brand-ink/5">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  loading="lazy"
                                  width={100}
                                  height={100}
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format";
                                    e.currentTarget.onerror = null;
                                  }}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="flex flex-1 flex-col justify-between py-1">
                                <div className="flex justify-between items-start gap-2">
                                  <h3 className="font-display font-medium leading-[1.2] text-[18px] text-brand-ink">
                                    <Link
                                      href={`/product/${item.handle}`}
                                      onClick={closeCart}
                                      className="hover:text-brand-gold transition-colors"
                                    >
                                      {item.title}
                                    </Link>
                                  </h3>
                                  <button
                                    aria-label="Remove item"
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-brand-ink/40 hover:text-brand-rouge transition-colors flex min-w-[32px] min-h-[32px] items-center justify-end"
                                  >
                                    <Trash2 size={16} strokeWidth={1} />
                                  </button>
                                </div>

                                <p className="font-body text-brand-ink/60 text-xs tracking-wider uppercase mt-1 flex items-center gap-2">
                                  {(() => {
                                    const titleStr = (
                                      item.title +
                                      " " +
                                      item.handle
                                    ).toLowerCase();
                                    let colorBg = "bg-brand-rose";
                                    if (
                                      titleStr.includes("sage") ||
                                      titleStr.includes("green")
                                    ) {
                                      colorBg = "bg-brand-sage";
                                    } else if (
                                      titleStr.includes("powder blue") ||
                                      titleStr.includes("sky")
                                    ) {
                                      colorBg = "bg-brand-powderblue";
                                    } else if (
                                      titleStr.includes("blush pink") ||
                                      titleStr.includes("rose")
                                    ) {
                                      colorBg = "bg-brand-blushpink";
                                    }
                                    return (
                                      <span
                                        className={`w-2 h-2 rounded-full ${colorBg}`}
                                      />
                                    );
                                  })()}
                                  {item.handle.includes("vasara")
                                    ? "Vasara - Powder Blue"
                                    : ""}
                                </p>

                                <div className="flex justify-between items-end mt-auto">
                                  {/* Pill shaped quantity stepper */}
                                  <div className="flex items-center bg-[#FDFBF7] rounded-full h-[32px] px-1 border border-brand-ink/10 shadow-sm">
                                    <button
                                      aria-label="Decrease quantity"
                                      onClick={() => {
                                        if (item.quantity > 1)
                                          updateQuantity(item.id, -1);
                                      }}
                                      className="flex justify-center items-center w-8 h-[30px] rounded-full hover:bg-brand-ink/5 text-brand-ink transition-colors"
                                    >
                                      <Minus size={14} strokeWidth={1.5} />
                                    </button>
                                    <span className="font-body text-[13px] w-6 text-center select-none pt-[1px]">
                                      {item.quantity}
                                    </span>
                                    <button
                                      aria-label="Increase quantity"
                                      onClick={() => updateQuantity(item.id, 1)}
                                      className="flex justify-center items-center w-8 h-[30px] rounded-full hover:bg-brand-ink/5 text-brand-ink transition-colors"
                                    >
                                      <Plus size={14} strokeWidth={1.5} />
                                    </button>
                                  </div>
                                  <p className="font-body font-medium text-sm">
                                    ₹
                                    {(
                                      item.price * item.quantity
                                    ).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                      <div className="px-6 py-8 border-t border-brand-ink/10 bg-[#FDFBF7] mt-auto z-10">
                        <div className="flex justify-between items-baseline mb-3">
                          <p className="font-body tracking-[0.15em] text-xs text-brand-ink/70 uppercase">
                            Subtotal
                          </p>
                          <p className="font-display italic text-4xl text-brand-ink">
                            ₹{cartTotal.toLocaleString()}
                          </p>
                        </div>
                        <p className="font-body text-xs text-brand-ink/50 mb-6 tracking-wide text-center">
                          Taxes and shipping calculated at checkout.
                        </p>

                        {/* THE PROPER BUTTON (NOT A LINK) */}
                        <button
                          onClick={handleCheckout}
                          disabled={isCheckingOut}
                          className="w-full bg-brand-ink text-white hover:bg-[#C9A96E] hover:text-brand-ink h-14 rounded-full font-body font-medium tracking-[0.2em] text-sm uppercase flex items-center justify-center transition-all duration-500 shadow-lg hover:shadow-xl border border-transparent hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isCheckingOut ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing...
                            </span>
                          ) : (
                            "Checkout"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
