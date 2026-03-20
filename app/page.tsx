"use client";

import { getProductsInCollection, ShopifyProductNode } from "@/lib/shopify";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";

export default function Home() {
  const [products, setProducts] = useState<ShopifyProductNode[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getProductsInCollection();
      setProducts(data);
    }
    fetchData();
  }, []);

  return (
    <div className="bg-brand-maroon w-full relative flex flex-col">
      <Navbar isHome={true} />

      {/* --- LAYER 1: HERO SECTION --- */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-brand-gold/10 blur-3xl rounded-full"></div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto pt-20"
        >
          <p className="text-xs md:text-sm tracking-[0.3em] text-brand-gold uppercase flex items-center justify-center gap-4">
            <span className="w-8 md:w-16 h-[1px] bg-brand-gold/50"></span>
            The Royal Collection
            <span className="w-8 md:w-16 h-[1px] bg-brand-gold/50"></span>
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-brand font-bold leading-tight mt-6 z-10">
            Not everything should scale. <br className="md:hidden" />
            <br />
            <span className="relative inline-block text-brand-gold">
              This doesn&apos;t
              {/* --- THE ANIMATED HIGHLIGHT --- */}
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeInOut" }}
                className="absolute bottom-[4%] left-0 h-[12%] bg-brand-gold/30 -z-10"
              />
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-brand-cream/60 font-light">
            We make fewer pieces so we don’t have to compromise on how they’re made.
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
            className="bg-brand-gold text-brand-maroon px-10 py-4 uppercase tracking-[0.2em] text-sm font-bold hover:bg-brand-cream transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Shopping
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-brand-gold/50 flex flex-col items-center gap-2 z-10">
          <ChevronDown className="animate-bounce" size={20} />
        </div>
      </div>

      {/* --- LAYER 2: SCROLLING CONTENT --- */}
      <div className="relative z-10 bg-brand-cream w-full shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-maroon font-serif">
              Latest Arrivals
            </h2>
            <div className="w-16 h-1 bg-brand-gold mt-2 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((item: ShopifyProductNode) => {
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
                      className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-brand-maroon w-10 h-10 rounded-full flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-lg z-10"
                    >
                      <ShoppingBag size={18} />
                    </Link>
                  </div>

                  <div className="mt-4 flex justify-between items-start px-1">
                    <div>
                      <h3 className="text-lg font-serif font-medium text-gray-900 leading-tight group-hover:text-brand-maroon transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Pure Silk</p>
                    </div>
                    <div className="text-right pl-2">
                      <p className="text-lg font-bold text-brand-maroon whitespace-nowrap">
                        ₹{product.priceRange.minVariantPrice.amount}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="py-12 bg-brand-light border-t border-brand-gold/10">
          <div className="max-w-3xl mx-auto text-center px-6">
            <h3 className="text-xl md:text-2xl font-serif text-brand-maroon mb-4 leading-relaxed">
              &quot;If it can be mass-produced, we’re not interested.&quot;
            </h3>
            <p className="text-brand-maroon/50 italic text-sm">
              - Vreya exists to do what production lines can’t.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

