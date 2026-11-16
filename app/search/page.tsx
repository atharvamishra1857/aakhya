"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { searchProducts, ShopifyProductNode } from "@/lib/shopify";
import { Search, X } from "lucide-react";

// Quick-access category chips — map to Shopify query syntax
const CATEGORIES = [
  { label: "Vests",       query: "product_type:vest OR title:vest" },
  { label: "Kurtis",      query: "product_type:kurti OR title:kurti" },
  { label: "Accessories", query: "product_type:accessory OR tag:accessory" },
  { label: "Necklaces",   query: "product_type:necklace OR title:necklace" },
  { label: "New In",      query: "tag:new" },
];

export default function SearchPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const initialQ     = searchParams.get("q") ?? "";

  const [inputValue, setInputValue] = useState(initialQ);
  const [results,    setResults]    = useState<ShopifyProductNode[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [searched,   setSearched]   = useState(false);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    const data = await searchProducts(q.trim());
    setResults(data);
    setLoading(false);
  }, []);

  // Run search when URL param changes (e.g. user hits back)
  useEffect(() => { runSearch(initialQ); }, [initialQ, runSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
  };

  const handleClear = () => {
    setInputValue("");
    router.push("/search");
  };

  const handleChip = (q: string) => {
    setInputValue(q);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen bg-brand-bgprimary pt-24 font-body text-brand-ink">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* ── Search bar ── */}
        <form onSubmit={handleSubmit} className="relative mb-6">
          <Search
            size={16}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-gray pointer-events-none"
          />
          <input
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for vests, kurtis, necklaces…"
            className="w-full h-14 pl-12 pr-12 rounded-full border border-brand-borderlight bg-brand-bgsecondary text-brand-ink placeholder:text-brand-gray/50 font-body text-[15px] outline-none focus:border-brand-sage transition-colors"
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-ink cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </form>

        {/* ── Category chips ── */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(({ label, query }) => (
            <button
              key={label}
              onClick={() => handleChip(query)}
              className="px-4 py-1.5 rounded-full border border-brand-borderlight text-[12px] tracking-wider uppercase text-brand-gray hover:border-brand-sage hover:text-brand-sage transition-colors cursor-pointer"
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── States ── */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-3 h-3 bg-brand-sage rounded-full animate-ping" />
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-24">
            <p className="font-display text-3xl text-brand-ink mb-3">
              Nothing found for &ldquo;{initialQ}&rdquo;
            </p>
            <p className="font-body text-brand-gray text-[14px] mb-8">
              Try a different spelling, or browse a category below.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {CATEGORIES.map(({ label, query }) => (
                <button
                  key={label}
                  onClick={() => handleChip(query)}
                  className="px-4 py-1.5 rounded-full border border-brand-borderlight text-[12px] tracking-wider uppercase text-brand-gray hover:border-brand-sage hover:text-brand-sage transition-colors cursor-pointer"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="font-body text-[12px] text-brand-gray tracking-widest uppercase mb-6">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {results.map(({ node }) => (
                <Link
                  href={`/product/${node.handle}`}
                  key={node.id}
                  className="group text-left"
                >
                  <div className="aspect-[3/4] bg-brand-bgsecondary rounded-xl overflow-hidden border border-brand-borderlight mb-3 relative group-hover:-translate-y-1 transition-transform duration-300">
                    <Image
                      src={node.images.edges[0]?.node.url ?? ""}
                      alt={node.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="font-display text-[16px] text-brand-ink leading-tight">
                    {node.title}
                  </h3>
                  <p className="font-body text-[13px] text-brand-gray mt-1">
                    ₹{Number(node.priceRange.minVariantPrice.amount).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}

        {!loading && !searched && (
          <p className="font-body text-brand-gray text-center text-[14px] py-16">
            Start typing to find something you&apos;ll love.
          </p>
        )}
      </main>
    </div>
  );
}