"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/navbar";
import { getProductsInCollection, ShopifyProductNode } from "@/lib/shopify";
import { useCart } from "@/context/cartcontext";

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
        <img src="https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=1920" alt="Collection Banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-brand-ink/40"></div>
        <div className="relative z-10 text-center text-brand-ivory px-6 mt-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase mb-4 opacity-80">The Complete Edit</p>
          <h1 className="text-5xl md:text-7xl font-display italic">Linen Vests</h1>
        </div>
      </div>

      <main className="flex-grow max-w-[1600px] mx-auto px-6 py-6 md:py-12 w-full flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-brand-borderlight pb-8 lg:pb-0 lg:pr-8">
           <div className="flex items-center gap-3 mb-8 lg:mb-12">
             <SlidersHorizontal size={18} className="text-brand-ink" />
             <span className="font-body text-sm tracking-widest uppercase">Filters</span>
           </div>

           <div className="space-y-8">
             <div>
               <h4 className="font-body text-xs tracking-widest uppercase mb-4 text-brand-gray">Hue</h4>
               <ul className="space-y-3 font-body text-sm text-brand-ink/80">
                 <li className="flex items-center gap-3 cursor-pointer group">
                   <div className="w-4 h-4 rounded-full border border-brand-sage bg-brand-sage flex items-center justify-center">
                     <span className="w-1.5 h-1.5 bg-brand-bgprimary rounded-full"></span>
                   </div>
                   <span className="group-hover:text-brand-sage transition-colors">Sage Green</span>
                 </li>
                 <li className="flex items-center gap-3 cursor-pointer group">
                   <div className="w-4 h-4 rounded-full border border-brand-borderlight bg-transparent flex items-center justify-center"></div>
                   <span className="group-hover:text-brand-rose transition-colors">Rose Pink</span>
                 </li>
                 <li className="flex items-center gap-3 cursor-pointer group">
                   <div className="w-4 h-4 rounded-full border border-brand-borderlight bg-transparent flex items-center justify-center"></div>
                   <span className="group-hover:text-brand-blue transition-colors">Powder Blue</span>
                 </li>
               </ul>
             </div>
             
             <div>
               <h4 className="font-body text-xs tracking-widest uppercase mb-4 text-brand-gray">Size</h4>
               <div className="flex flex-wrap gap-2">
                 {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                   <button key={size} className="w-10 h-10 border border-brand-borderlight rounded-full text-xs hover:border-brand-sage hover:text-brand-sage transition-colors">
                     {size}
                   </button>
                 ))}
               </div>
             </div>
           </div>
        </aside>

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
                      <img
                        src={`${product.images.edges[0]?.node.url}&width=800&format=webp`}
                        alt={product.title}
                        loading="lazy"
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
