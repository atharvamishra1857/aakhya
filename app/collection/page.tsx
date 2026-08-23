"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
        <Image
          src="/Collection-top.png"
          alt="Collection Banner"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-ink/40"></div>
        <div className="relative z-10 text-center text-brand-ivory px-6 mt-16">
          <p className="font-display underline text-4xl italic tracking-[0.3em] mb-4 opacity-80">
            The Complete Edit
          </p>
        </div>
      </div>

      <main className="flex-grow max-w-[1600px] mx-auto px-6 py-6 md:py-12 w-full">
        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden bg-brand-bgsecondary animate-pulse">
                  <div className="aspect-square w-full" />
                  <div className="p-5 space-y-2">
                    <div className="h-4 bg-brand-ink/10 rounded-full w-3/4 mx-auto" />
                    <div className="h-3 bg-brand-ink/10 rounded-full w-1/3 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-3 py-32 text-center">
              <p className="font-display italic text-3xl text-brand-ink/30">Nothing here yet.</p>
              <p className="font-body text-sm text-brand-gray mt-3">New pieces dropping soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((item: ShopifyProductNode) => {
                const product = item.node;
                return (
                  <div
                    key={product.id}
                    className="group relative bg-brand-bgprimary border border-brand-borderlight rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(44,37,32,0.06)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <Link
                      href={`/product/${product.handle}`}
                      className="block aspect-square overflow-hidden relative"
                    >
                      <div className="absolute top-3 right-3 z-10 bg-brand-ink/5 text-brand-ink/60 border border-brand-ink/10 text-[11px] px-[8px] py-[2px] rounded-full font-body backdrop-blur-sm">
                        Limited
                      </div>
                      <Image
                        src={
                          product.images.edges[0]?.node.url.includes("shopify.com")
                            ? `${product.images.edges[0].node.url}&width=800&format=webp`
                            : product.images.edges[0]?.node.url
                        }
                        alt={product.title}
                        loading="lazy"
                        width={800}
                        height={800}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format";
                          e.currentTarget.onerror = null;
                        }}
                        className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                      />
                      
                      {product.variants.edges.length > 1 && (
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          {Array.from(new Set(
                            product.variants.edges
                              .map((e: any) => e.node.selectedOptions?.find((o: any) => o.name.toLowerCase() === "color")?.value)
                              .filter(Boolean)
                          )).slice(0, 4).map((color: any) => (
                            <span
                              key={color}
                              title={color}
                              className="w-3 h-3 rounded-full border border-white/60 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      )}
                    </Link>

                    <div className="p-5 text-center flex flex-col justify-between items-center gap-2">
                      <Link
                        href={`/product/${product.handle}`}
                        className="block"
                      >
                        <h3 className="font-display text-lg text-brand-ink">
                          {product.title}
                        </h3>
                        <p className="font-body text-sm text-brand-gray mt-1 tracking-wide">
                          ₹{product.priceRange.minVariantPrice.amount}
                        </p>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const firstVariant = product.variants.edges[0]?.node;
                          if (firstVariant) {
                            addToCart({
                              id: firstVariant.id,
                              title: product.title,
                              price: Number(product.priceRange.minVariantPrice.amount),
                              image: product.images.edges[0].node.url,
                              handle: product.handle,
                              variantTitle: firstVariant.title,
                              selectedOptions: firstVariant.selectedOptions,
                              availableVariants: product.variants.edges.map((e: any) => ({
                                id: e.node.id,
                                title: e.node.title,
                                availableForSale: (e.node as any).availableForSale ?? true,
                                price: e.node.price,
                                selectedOptions: e.node.selectedOptions,
                              })),
                            });
                          }
                        }}
                        className="text-[11px] font-body tracking-[0.2em] uppercase text-brand-rose border-b border-brand-rose/20 hover:border-brand-rose pb-[2px] mt-2 transition-colors cursor-pointer"
                        aria-label="Quick Add to Cart"
                      >
                        Quick Add · {product.variants.edges[0]?.node.title ?? ""}
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