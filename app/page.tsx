"use client";

import { getProductsInCollection } from "@/lib/shopify";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getProductsInCollection();
      setProducts(data);
    }
    fetchData();
  }, []);

  return (
    <div className="bg-[#5D1224] w-full relative flex flex-col">
      <Navbar isHome={true} />

      {/* --- LAYER 1: HERO SECTION --- */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-[#D4AF37]/10 blur-[120px] rounded-full"></div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto pt-20"
        >
          <p className="text-xs md:text-sm tracking-[0.3em] text-[#D4AF37] uppercase flex items-center justify-center gap-4">
            <span className="w-8 md:w-16 h-[1px] bg-[#D4AF37]/50"></span>
            The Royal Collection
            <span className="w-8 md:w-16 h-[1px] bg-[#D4AF37]/50"></span>
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-brand font-bold leading-tight mt-6 z-10">
            Weave Your <br className="md:hidden" />
            <br />
            <span className="relative inline-block text-[#D4AF37]">
              Legacy
              {/* --- THE ANIMATED HIGHLIGHT --- */}
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeInOut" }}
                className="absolute bottom-[4%] left-0 h-[12%] bg-[#D4AF37]/30 -z-10"
              />
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-[#FDFBF7]/60 font-light">
            Authentic Handloom. Timeless Grace.
          </p>
        </motion.div>

        {/* --- START SHOPPING BUTTON --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-10 relative z-10"
        >
          <Link
            href="/collection"
            className="bg-[#D4AF37] text-[#5D1224] px-10 py-4 uppercase tracking-[0.2em] text-sm font-bold hover:bg-[#FDFBF7] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Shopping
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#D4AF37]/50 flex flex-col items-center gap-2 z-10">
          <ChevronDown className="animate-bounce" size={20} />
        </div>
      </div>

      {/* --- LAYER 2: SCROLLING CONTENT --- */}
      <div className="relative z-10 bg-[#FDFBF7] w-full shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#5D1224] font-serif">
              Latest Arrivals
            </h2>
            <div className="w-16 h-1 bg-[#D4AF37] mt-2 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((item: any) => {
              const product = item.node;
              return (
                <div
                  key={product.id}
                  className="group relative bg-white p-4 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 relative">
                    <Link href={`/product/${product.handle}`}>
                      <Image
                        src={product.images.edges[0].node.url}
                        alt={product.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </Link>
                    <Link
                      href={`/product/${product.handle}`}
                      className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-[#5D1224] w-10 h-10 rounded-full flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-lg z-10"
                    >
                      <ShoppingBag size={18} />
                    </Link>
                  </div>

                  <div className="mt-4 flex justify-between items-start px-1">
                    <div>
                      <h3 className="text-lg font-serif font-medium text-gray-900 leading-tight group-hover:text-[#5D1224] transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Pure Silk</p>
                    </div>
                    <div className="text-right pl-2">
                      <p className="text-lg font-bold text-[#5D1224] whitespace-nowrap">
                        ₹{product.priceRange.minVariantPrice.amount}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="py-12 bg-[#F5F2EA] border-t border-[#D4AF37]/10">
          <div className="max-w-3xl mx-auto text-center px-6">
            <h3 className="text-xl md:text-2xl font-serif text-[#5D1224] mb-4 leading-relaxed">
              &quot;The saree is the only garment that has been in fashion for
              over 2,000 years.&quot;
            </h3>
            <p className="text-[#5D1224]/50 italic text-sm">
              - A Tribute to Indian Heritage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
