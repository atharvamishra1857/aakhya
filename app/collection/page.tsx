"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar"; // Check capitalization: "Navbar" or "navbar"
import { getProductsInCollection } from "@/lib/shopify";

export default function CollectionPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Shopify Products on load
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProductsInCollection();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#5D1224] flex flex-col pt-12">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full">
        {/* --- PAGE HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            The Royal Collection
          </h1>
          <div className="w-12 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
          <p className="font-light text-[#5D1224]/70">
            Explore our curated selection of authentic handloom sarees. Each
            piece is a testament to centuries of weaving heritage.
          </p>
        </motion.div>

        {/* --- PRODUCT GRID --- */}
        {isLoading ? (
          /* Elegant Loading Spinner */
          <div className="flex justify-center items-center py-32">
            <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((item: any, i) => {
              const product = item.node;
              return (
                <motion.div
                  // Staggered fade-in animation based on index (i)
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  key={product.id}
                  className="group relative bg-white p-4 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-lg bg-gray-100 relative">
                    <Link href={`/product/${product.handle}`}>
                      <Image
                        src={product.images.edges[0]?.node.url}
                        alt={product.title}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </Link>

                    {/* Hover Add to Cart Button */}
                    <Link
                      href={`/product/${product.handle}`}
                      className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-[#5D1224] w-10 h-10 rounded-full flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-lg z-10 hover:bg-[#D4AF37] hover:text-[#FDFBF7]"
                    >
                      <ShoppingBag size={18} />
                    </Link>
                  </div>

                  <div className="mt-4 flex flex-col px-1">
                    <h3 className="text-lg font-serif font-medium text-gray-900 leading-tight group-hover:text-[#5D1224] transition-colors truncate">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 mb-2">
                      Pure Silk Handloom
                    </p>
                    <p className="text-lg font-bold text-[#5D1224]">
                      ₹{product.priceRange.minVariantPrice.amount}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
