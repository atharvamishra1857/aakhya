"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import { SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/navbar";
import { getProductsInCollection, ShopifyProductNode } from "@/lib/shopify";
import { useCart } from "@/context/cartcontext";
import Image from "next/image";

export default function CollectionPage() {
  const [products, setProducts] = useState<ShopifyProductNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

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
    <div className="min-h-screen bg-brand-bgprimary text-brand-ink font-body flex flex-col pt-24">
      <Navbar />

      {/* Page Header Banner */}
      <div className="relative w-full h-[40vh] md:h-[50vh] flex flex-col items-center justify-center mb-12 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=1920" alt="Collection Banner" width={1920} height={1080} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-brand-ink/40"></div>
        <div className="relative z-10 text-center text-brand-ivory px-6 mt-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase mb-4 opacity-80">The Complete Edit</p>
          <h1 className="text-5xl md:text-7xl font-display italic">Linen Vests</h1>
        </div>
      </div>

      <main className="flex-grow max-w-[1600px] mx-auto px-6 py-6 md:py-12 w-full">

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading || products.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square mb-6 rounded-xl animate-pulse bg-brand-bgsecondary"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((item: ShopifyProductNode) => {
                const product = item.node;
                return (
                  <div key={product.id} className="group relative bg-brand-bgprimary border border-brand-borderlight rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(44,37,32,0.06)] hover:-translate-y-1 transition-all duration-300">
                    <Link href={`/product/${product.handle}`} className="block aspect-square overflow-hidden relative">
                      <div className="absolute top-3 right-3 z-10 bg-[rgba(201,125,125,0.12)] text-brand-rose border border-[rgba(201,125,125,0.3)] text-[11px] px-[8px] py-[2px] rounded-full font-body backdrop-blur-sm">
                        Limited
                      </div>
                      <Image
                        src={`${product.images.edges[0]?.node.url}&width=800&format=webp`}
                        alt={product.title}
                        loading="lazy"
                        width={800}
                        height={800}
                        onError={(e) => { e.currentTarget.src='https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format'; e.currentTarget.onerror=null; }}
                        className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                      />
                    </Link>

                    <div className="p-5 text-center flex flex-col justify-between items-center gap-2">
                      <Link href={`/product/${product.handle}`} className="block">
                        <h3 className="font-display text-lg text-brand-ink">{product.title}</h3>
                        <p className="font-body text-sm text-brand-gray mt-1 tracking-wide">₹{product.priceRange.minVariantPrice.amount}</p>
                      </Link>
                      <button 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          if (product.variants.edges.length > 0) {
                            addToCart({ 
                              id: product.variants.edges[0].node.id, 
                              title: product.title, 
                              price: Number(product.priceRange.minVariantPrice.amount), 
                              image: product.images.edges[0].node.url, 
                              handle: product.handle 
                            });
                          }
                        }}
                        className="text-[11px] font-body tracking-[0.2em] uppercase text-brand-rose border-b border-brand-rose/20 hover:border-brand-rose pb-[2px] mt-2 transition-colors cursor-pointer"
                        aria-label="Quick Add to Cart"
                      >
                        Quick Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
