"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Dialog, Transition } from "@headlessui/react";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart, type CartItem } from "@/context/cartcontext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CartDrawer() {
  const router = useRouter();
  const {
    isOpen,
    closeCart,
    cartItems,
    updateQuantity,
    updateVariant,
    removeFromCart,
    cartTotal,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const [pendingSize, setPendingSize] = useState<string | null>(null);
  const [pendingColor, setPendingColor] = useState<string | null>(null);

  // Seed pending selections from the item's current variant when sheet opens
  useEffect(() => {
    if (!editingItem) return;
    setPendingSize(editingItem.selectedOptions?.find((o) => o.name.toLowerCase() === "size")?.value ?? null);
    setPendingColor(editingItem.selectedOptions?.find((o) => o.name.toLowerCase() === "color")?.value ?? null);
  }, [editingItem?.id]);

  // Portal root — sheet renders directly on body, escaping all overflow-hidden ancestors
  useEffect(() => { setMounted(true); }, []);

  // RESETS CHECKOUT BUTTON IF USER HITS THE BROWSER "BACK" BUTTON
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      // event.persisted is true if the page was loaded from the browser cache
      if (event.persisted) {
        setIsCheckingOut(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // RESETS CHECKOUT BUTTON WHENEVER THE CART DRAWER REOPENS
  // Covers the case where the user navigates away mid-checkout
  // (e.g. clicks the logo to go back home) and then reopens the cart.
  useEffect(() => {
    if (isOpen) {
      setIsCheckingOut(false);
    }
  }, [isOpen]);

  const FREE_SHIPPING_THRESHOLD = 20000;
  const progressPercent = Math.min(
    100,
    (cartTotal / FREE_SHIPPING_THRESHOLD) * 100,
  );

  const handleCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);

    try {
      const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
      const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

      const lines = cartItems.map((item) => ({
        merchandiseId: item.id,
        quantity: item.quantity,
      }));

      const query = `
        mutation CartCreate($lines: [CartLineInput!]!) {
          cartCreate(input: { lines: $lines }) {
            cart {
              checkoutUrl
            }
          }
        }
      `;

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

      if (checkoutUrl) {
  closeCart();
  router.push("/checkout");
}
    } catch (err) {
  console.error("Error connecting to checkout:", err);
  closeCart();
  router.push("/checkout");
}
  };

  // Maps a color name from Shopify to a CSS hex/color value for the swatch dot.
  // Add entries here as you add new colorways to your Shopify inventory.
  function colorNameToHex(name: string): string {
    const map: Record<string, string> = {
      sage:         "#8FA882",
      green:        "#8FA882",
      blush:        "#E8B4B8",
      rose:         "#C97D7D",
      pink:         "#E8B4B8",
      sky:          "#86A7B9",
      blue:         "#86A7B9",
      "powder blue":"#86A7B9",
      ivory:        "#F5F0E8",
      white:        "#FFFFFF",
      black:        "#1A1A1A",
      ink:          "#2C2520",
      sand:         "#D4B896",
      oatmeal:      "#C8B89A",
      natural:      "#C8B89A",
      navy:         "#2C3E6B",
    };
    const key = name.toLowerCase();
    for (const [keyword, hex] of Object.entries(map)) {
      if (key.includes(keyword)) return hex;
    }
    return "#C4B5A5"; // neutral fallback
  }

  return (
  <>
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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-[400px] h-full">
                  <div className="flex h-full flex-col bg-[#FDFBF7] shadow-[0_0_40px_rgba(0,0,0,0.1)] relative overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-6 border-b border-brand-ink/10 shrink-0">
                      <Dialog.Title className="text-[32px] font-display text-brand-ink tracking-wide">
                        Your Edit
                      </Dialog.Title>
                      <button
                        onClick={closeCart}
                        aria-label="Close cart"
                        className="text-brand-ink/60 hover:text-brand-ink transition-colors flex items-center justify-center p-2 rounded-full hover:bg-brand-ink/5 cursor-pointer"
                        style={{ minWidth: "44px", minHeight: "44px" }}
                      >
                        <X size={26} strokeWidth={1} />
                      </button>
                    </div>

                    {/* Shipping Nudge */}
                    <div className="px-6 py-4 bg-brand-parchment/40 border-b border-brand-ink/5 shrink-0 relative overflow-hidden">
                      <div className="h-[2px] w-full bg-brand-ink/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-brand-gold"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Items List */}
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
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-brand-ink/40 hover:text-brand-rouge transition-colors flex min-w-[32px] min-h-[32px] items-center justify-end cursor-pointer"
                                  >
                                    <Trash2 size={16} strokeWidth={1} />
                                  </button>
                                </div>

                                <div className="flex items-center gap-3 mt-1">
                                  <p className="font-body text-brand-ink/60 text-xs tracking-wider uppercase flex items-center gap-2">
                                    {(() => {
                                      const colorOption =
                                        item.selectedOptions?.find(
                                          (opt) =>
                                            opt.name.toLowerCase() === "color",
                                        );
                                      const colorValue = colorOption
                                        ? colorOption.value.toLowerCase()
                                        : "";
                                      let colorBg = "bg-brand-borderlight";

                                      if (
                                        colorValue.includes("sage") ||
                                        colorValue.includes("green")
                                      )
                                        colorBg = "bg-brand-sage";
                                      else if (
                                        colorValue.includes("powder blue") ||
                                        colorValue.includes("sky") ||
                                        colorValue.includes("blue")
                                      )
                                        colorBg = "bg-brand-powderblue";
                                      else if (
                                        colorValue.includes("blush pink") ||
                                        colorValue.includes("rose") ||
                                        colorValue.includes("pink")
                                      )
                                        colorBg = "bg-brand-blushpink";

                                      return (
                                        <>
                                          {colorOption && (
                                            <span
                                              className={`w-2 h-2 rounded-full ${colorBg}`}
                                            />
                                          )}
                                          <span>{item.variantTitle}</span>
                                        </>
                                      );
                                    })()}
                                  </p>

                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation(); // <-- Add this to prevent bubbling
                                      console.log(
                                        "Edit button clicked for:",
                                        item.title,
                                      );
                                      setEditingItem(item);
                                    }}
                                    className="text-[10px] font-body uppercase tracking-widest text-brand-ink/40 hover:text-brand-ink underline underline-offset-2 transition-colors cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                </div>

                                <div className="flex justify-between items-end mt-auto">
                                  <div className="flex items-center bg-[#FDFBF7] rounded-full h-[32px] px-1 border border-brand-ink/10 shadow-sm">
                                    <button
                                      onClick={() =>
                                        item.quantity > 1 &&
                                        updateQuantity(item.id, -1)
                                      }
                                      className="flex justify-center items-center w-8 h-[30px] rounded-full hover:bg-brand-ink/5 text-brand-ink transition-colors cursor-pointer"
                                    >
                                      <Minus size={14} strokeWidth={1.5} />
                                    </button>
                                    <span className="font-body text-[13px] w-6 text-center select-none pt-[1px]">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateQuantity(item.id, 1)}
                                      className="flex justify-center items-center w-8 h-[30px] rounded-full hover:bg-brand-ink/5 text-brand-ink transition-colors cursor-pointer"
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
                      <div className="px-6 py-8 border-t border-brand-ink/10 bg-[#FDFBF7] shrink-0 relative z-10">
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

                        <button
                          onClick={handleCheckout}
                          disabled={isCheckingOut}
                          className="w-full bg-brand-ink text-white hover:bg-[#C9A96E] hover:text-brand-ink h-14 rounded-full font-body font-medium tracking-[0.2em] text-sm uppercase flex items-center justify-center transition-all duration-500 shadow-lg hover:shadow-xl border border-transparent hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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

    {/* ── VARIANT EDIT SHEET ─────────────────────────────────────────────────
        Rendered via portal directly on document.body so no overflow-hidden
        ancestor (the fixed inset-0 wrappers in the drawer) can clip it.     */}
    {mounted && createPortal(
      <>
        {/* Dim backdrop behind the sheet */}
        <div
          onClick={() => setEditingItem(null)}
          className={`fixed inset-0 z-[400] bg-brand-ink/30 backdrop-blur-sm transition-opacity duration-300 ${
            editingItem ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Sheet itself — fixed to bottom-right, same width as the cart drawer */}
        <div
          className={`fixed bottom-0 right-0 w-full max-w-[400px] h-[65%] z-[500] bg-[#FDFBF7] border-t border-brand-ink/10 shadow-[0_-20px_40px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden transition-transform duration-500 ease-in-out ${
            editingItem ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Sheet header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-brand-ink/10 shrink-0">
            <div>
              <h3 className="font-display text-xl text-brand-ink">Edit Selection</h3>
              {editingItem && (
                <p className="font-body text-xs text-brand-ink/50 mt-0.5 truncate max-w-[260px]">
                  {editingItem.title}
                </p>
              )}
            </div>
            <button
              onClick={() => setEditingItem(null)}
              className="p-2 cursor-pointer hover:bg-brand-ink/5 rounded-full transition-colors"
            >
              <X size={20} className="text-brand-ink/60" />
            </button>
          </div>

          {/* Sheet body — all options derived from real Shopify variants, zero hardcoding */}
          <div className="p-6 flex-1 overflow-y-auto">
            {editingItem && (() => {
              const variants = editingItem.availableVariants ?? [];

              // Unique sizes from the actual variant list
              const allSizes = Array.from(new Set(
                variants.flatMap((v) =>
                  v.selectedOptions.filter((o) => o.name.toLowerCase() === "size").map((o) => o.value)
                )
              ));

              // Unique colors from the actual variant list
              const allColors = Array.from(new Set(
                variants.flatMap((v) =>
                  v.selectedOptions.filter((o) => o.name.toLowerCase() === "color").map((o) => o.value)
                )
              ));

              // Matched variant for the current pending selection
              const matchedVariant = variants.find((v) =>
                v.selectedOptions.every((o) => {
                  if (o.name.toLowerCase() === "size")  return !pendingSize  || o.value === pendingSize;
                  if (o.name.toLowerCase() === "color") return !pendingColor || o.value === pendingColor;
                  return true;
                })
              );
              const isAvailable = matchedVariant?.availableForSale ?? true;

              return (
                <>
                  <p className="font-body text-[11px] tracking-widest uppercase text-brand-ink/40 mb-6">
                    Currently: {editingItem.variantTitle ?? "—"}
                  </p>

                  {/* Sizes */}
                  {allSizes.length > 0 && (
                    <div className="mb-6">
                      <p className="font-body text-[11px] tracking-widest uppercase text-brand-ink/60 mb-3">Size</p>
                      <div className="flex flex-wrap gap-2">
                        {allSizes.map((s) => {
                          const sizeAvailable = variants.some(
                            (v) => v.availableForSale &&
                              v.selectedOptions.some((o) => o.name.toLowerCase() === "size" && o.value === s)
                          );
                          return (
                            <button
                              key={s}
                              onClick={() => sizeAvailable && setPendingSize(s)}
                              disabled={!sizeAvailable}
                              className={`h-9 px-4 rounded-full font-body text-xs border transition-colors ${
                                !sizeAvailable
                                  ? "border-brand-borderlight text-brand-ink/20 line-through cursor-not-allowed"
                                  : pendingSize === s
                                  ? "border-brand-sage bg-brand-sage/10 text-brand-sage cursor-pointer"
                                  : "border-brand-borderlight text-brand-gray hover:border-brand-sage cursor-pointer"
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Colors */}
                  {allColors.length > 0 && (
                    <div className="mb-8">
                      <p className="font-body text-[11px] tracking-widest uppercase text-brand-ink/60 mb-3">Color</p>
                      <div className="flex flex-wrap gap-3">
                        {allColors.map((color) => {
                          const colorAvailable = variants.some(
                            (v) => v.availableForSale &&
                              v.selectedOptions.some((o) => o.name.toLowerCase() === "color" && o.value === color)
                          );
                          const isActive = pendingColor === color;
                          return (
                            <button
                              key={color}
                              title={color}
                              aria-label={color}
                              onClick={() => colorAvailable && setPendingColor(color)}
                              disabled={!colorAvailable}
                              className="flex flex-col items-center gap-1.5 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <span
                                className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                                  !colorAvailable
                                    ? "opacity-25 border-transparent"
                                    : isActive
                                    ? "ring-2 ring-offset-2 ring-offset-[#FDFBF7] ring-brand-ink scale-110 border-transparent"
                                    : "opacity-70 hover:opacity-100 hover:scale-105 border-transparent"
                                }`}
                                style={{ backgroundColor: colorNameToHex(color) }}
                              />
                              <span className={`font-body text-[10px] tracking-wide ${isActive ? "text-brand-ink" : "text-brand-ink/40"}`}>
                                {color}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {!isAvailable && (
                    <p className="font-body text-[11px] text-brand-rose mb-4 tracking-wide">
                      This combination is out of stock.
                    </p>
                  )}

                  <button
                    onClick={() => {
                      if (!editingItem || !matchedVariant) return;
                      updateVariant(editingItem.id, {
                        ...editingItem,
                        id: matchedVariant.id,
                        price: Number(matchedVariant.price.amount),
                        variantTitle: matchedVariant.title,
                        selectedOptions: matchedVariant.selectedOptions,
                      });
                      setEditingItem(null);
                    }}
                    disabled={!matchedVariant || !isAvailable}
                    className="w-full h-12 bg-brand-ink text-brand-ivory rounded-full font-body text-[13px] uppercase tracking-[0.15em] transition-all hover:bg-brand-ink/80 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {!matchedVariant ? "Select a combination" : !isAvailable ? "Out of Stock" : "Update"}
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      </>,
      document.body
    )}
  </>
  );
}