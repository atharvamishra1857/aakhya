"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Lock,
  ShoppingBag,
  Loader2,
  Check,
} from "lucide-react";
import Navbar from "@/components/navbar";
import { useCart } from "@/context/cartcontext";

// Example array of product images
const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1610189012928-8b9612c62c82?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export default function ProductPage() {
  // --- STATES ---
  const [activeIndex, setActiveIndex] = useState(0);
  const [cartState, setCartState] = useState<"idle" | "adding" | "success">(
    "idle",
  );

  // --- PULL IN THE CART BRAIN ---
  const { addToCart } = useCart();

  // --- AUTO CAROUSEL ---
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PRODUCT_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // --- ADD TO CART HANDLER ---
  const handleAddToCart = () => {
    if (cartState !== "idle") return;

    setCartState("adding");

    // 1. ACTUALLY ADD IT TO THE GLOBAL CART
    // Note: You will need to replace these dummy values with whatever
    // variables you are actually using on this page for the product!
    addToCart({
      id: "dummy-saree-1", // Needs to be a unique ID string
      title: "Royal Handloom Saree", // The product name
      price: 15000, // The price as a pure number
      image: PRODUCT_IMAGES[0], // Grab the first image from your array
      handle: "royal-handloom-saree", // The URL slug
    });

    // 2. Keep your awesome UI state transitions!
    setTimeout(() => setCartState("success"), 1200);
    setTimeout(() => setCartState("idle"), 4000);
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-maroon">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* ================= LEFT: IMAGE GALLERY ================= */}
          <div className="w-full lg:w-[55%] flex flex-col-reverse md:flex-row gap-4 lg:sticky lg:top-28 lg:h-[75vh]">
            {/* THUMBNAILS (Clickable) */}
            <div className="flex md:flex-col gap-3 w-full md:w-20 shrink-0 overflow-auto hide-scrollbar pb-2 md:pb-0">
              {PRODUCT_IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative w-20 h-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    i === activeIndex
                      ? "border-brand-maroon opacity-100 shadow-md"
                      : "border-transparent opacity-50 hover:opacity-100 hover:border-brand-gold/50"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* MAIN IMAGE (Crossfade Animation) */}
            <div className="relative w-full h-[60vh] md:h-full bg-gray-100 rounded-xl overflow-hidden shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex} // Changing the key triggers Framer Motion's exit/enter animations
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={PRODUCT_IMAGES[activeIndex]}
                    alt="Product Image"
                    fill
                    priority
                    className="object-cover object-top"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ================= RIGHT: PRODUCT DETAILS ================= */}
          <div className="w-full lg:w-[45%] flex flex-col justify-center py-4">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-gold border border-brand-gold/30 rounded-full px-3 py-1 w-fit mb-4">
              Heritage Collection
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-3 leading-tight">
              Kanjivaram Red Saree
            </h1>

            <div className="flex items-center gap-4 mb-5">
              <span className="text-2xl font-bold">₹8,000.00</span>
              <div className="flex items-center gap-1 text-brand-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
                <span className="text-xs text-gray-500 ml-2 font-light">
                  (42 Reviews)
                </span>
              </div>
            </div>

            <div className="w-full h-px bg-brand-maroon/10 mb-6"></div>

            <p className="text-brand-maroon/70 font-light leading-relaxed mb-6 text-sm">
              Authentic Kanjivaram silk from Tamil Nadu. Known for its
              durability and heavy zari border. A masterpiece of South Indian
              weaving.
            </p>

            {/* FEATURE GRID (Hover Effects Restored) */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="group flex items-center gap-3 p-3 rounded-lg border border-brand-maroon/10 bg-white hover:-translate-y-1 hover:shadow-md hover:border-brand-gold/50 transition-all duration-300 cursor-default">
                <Truck
                  className="text-brand-gold shrink-0 group-hover:scale-110 transition-transform"
                  size={18}
                />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Free Shipping
                  </h4>
                  <p className="text-[10px] text-gray-500">All over India</p>
                </div>
              </div>
              <div className="group flex items-center gap-3 p-3 rounded-lg border border-brand-maroon/10 bg-white hover:-translate-y-1 hover:shadow-md hover:border-brand-gold/50 transition-all duration-300 cursor-default">
                <ShieldCheck
                  className="text-brand-gold shrink-0 group-hover:scale-110 transition-transform"
                  size={18}
                />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Silk Mark
                  </h4>
                  <p className="text-[10px] text-gray-500">100% Certified</p>
                </div>
              </div>
              <div className="group flex items-center gap-3 p-3 rounded-lg border border-brand-maroon/10 bg-white hover:-translate-y-1 hover:shadow-md hover:border-brand-gold/50 transition-all duration-300 cursor-default">
                <RefreshCcw
                  className="text-brand-gold shrink-0 group-hover:scale-110 transition-transform"
                  size={18}
                />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Easy Returns
                  </h4>
                  <p className="text-[10px] text-gray-500">7-Day Guarantee</p>
                </div>
              </div>
              <div className="group flex items-center gap-3 p-3 rounded-lg border border-brand-maroon/10 bg-white hover:-translate-y-1 hover:shadow-md hover:border-brand-gold/50 transition-all duration-300 cursor-default">
                <Lock
                  className="text-brand-gold shrink-0 group-hover:scale-110 transition-transform"
                  size={18}
                />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Secure
                  </h4>
                  <p className="text-[10px] text-gray-500">
                    Encrypted checkout
                  </p>
                </div>
              </div>
            </div>

            {/* INTERACTIVE ADD TO CART BUTTON */}
            <button
              onClick={handleAddToCart}
              disabled={cartState !== "idle"}
              className={`w-full py-4 rounded-md tracking-[0.15em] uppercase text-sm font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-md
                ${cartState === "idle" ? "bg-brand-maroon text-brand-cream hover:bg-brand-gold hover:shadow-lg" : ""}
                ${cartState === "adding" ? "bg-brand-gold text-brand-maroon cursor-not-allowed" : ""}
                ${cartState === "success" ? "bg-green-700 text-white cursor-default" : ""}
              `}
            >
              {cartState === "idle" && (
                <>
                  <ShoppingBag size={18} />
                  Add to Cart
                </>
              )}
              {cartState === "adding" && (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Adding to Cart...
                </>
              )}
              {cartState === "success" && (
                <>
                  <Check size={18} />
                  Added Successfully
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
