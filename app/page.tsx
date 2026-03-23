"use client";

import {
  getProductsInCollection,
  ShopifyProductNode,
  ShopifyProduct,
} from "@/lib/shopify";
import Link from "next/link";
import { Scissors, Package, Shirt } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { useCart } from "@/context/cartcontext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [products, setProducts] = useState<ShopifyProductNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProductsInCollection();
        setProducts(data || []);
      } catch (err) {
        console.error("Shopify fetch failed:", err);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- THE FIXED GSAP LOGIC ---
  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".reveal").forEach((el: any) => {
        // Changed to fromTo to prevent React Strict Mode invisibility bugs
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 }, // Explicit Start State
          {
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            opacity: 1, // Explicit End State
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          }
        );
      });
    });

    // Clean up animations when component unmounts
    return () => ctx.revert();
  }, [isLoading]);

  const handleQuickAdd = (e: any, variantId: string, item: ShopifyProduct) => {
    e.preventDefault();
    addToCart({
      id: variantId,
      title: item.title,
      price: Number(item.priceRange.minVariantPrice.amount),
      image: item.images.edges[0]?.node.url || "",
      handle: item.handle,
    });
  };

  return (
    <div className="bg-brand-bgprimary text-brand-ink flex flex-col">
      <Navbar isHome={true} />

      {/* ---------------- SECTION 1: HERO ---------------- */}
      <section className="relative h-[90vh] flex items-center px-6 md:px-16">
        <img
          src="/hero-bg.jpg"
          alt="Rose pink vest"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/40" />

        <div className="relative max-w-2xl space-y-6 text-brand-ivory reveal">
          <h1 className="text-5xl md:text-7xl font-display italic leading-[1.1]">
            Soft Statements.
            <br />
            Handcrafted Elegance.
          </h1>

          <p className="font-body text-base font-light text-brand-ivory opacity-90 max-w-md">
            Limited edition embroidered vests for everyday luxury
          </p>

          <div className="pt-2">
            <Link
              href="/collection"
              className="inline-block bg-brand-rose text-brand-ivory px-8 py-3 rounded-full hover:scale-105 transition-transform duration-200"
            >
              Shop Now →
            </Link>
          </div>

          <div className="flex gap-4 text-[12px] text-brand-ivory/70 opacity-70 mt-6 tracking-wide items-center font-body">
            <span>✦ Handcrafted</span>
            <span>✦ Limited Edition</span>
            <span>✦ Ships from Pune</span>
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 2: COLLECTION HIGHLIGHT ---------------- */}
      {isLoading ? (
        <section className="py-24 px-6 md:px-16 bg-brand-bgprimary">
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-brand-bgsecondary animate-pulse rounded-xl"
              />
            ))}
          </div>
        </section>
      ) : products.length > 0 ? (
        <section className="py-24 px-6 md:px-16 bg-brand-bgprimary reveal">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-display text-brand-ink">
              Collection Highlight
            </h2>
            <p className="font-display italic text-brand-muted max-w-2xl mx-auto text-lg leading-relaxed">
              "Crafted, not mass produced. At Vreya, every piece is designed to
              feel soft, intentional, and timeless."
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.slice(0, 3).map((item) => (
              <div
                key={item.node.id}
                className="group relative bg-brand-bgprimary border border-brand-borderlight rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(44,37,32,0.06)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden relative">
                  <div className="absolute top-3 right-3 z-10 bg-[rgba(201,125,125,0.12)] text-brand-rose border border-[rgba(201,125,125,0.3)] text-[11px] px-[8px] py-[2px] rounded-full font-body">
                    Limited
                  </div>
                  <img
                    src={
                      item.node.images.edges[0]?.node.url ||
                      "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=800"
                    }
                    alt={item.node.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center space-y-3">
                  <h3 className="font-display text-xl text-brand-ink">
                    {item.node.title}
                  </h3>
                  <p className="font-body text-sm text-brand-gray">
                    ₹{item.node.priceRange.minVariantPrice.amount}
                  </p>

                  <button
                    onClick={(e) =>
                      handleQuickAdd(
                        e,
                        item.node.variants.edges[0].node.id,
                        item.node
                      )
                    }
                    className="text-xs font-body tracking-wider uppercase text-brand-rose border-b border-brand-rose/30 hover:border-brand-rose pb-1 mt-2 inline-block transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ---------------- SECTION 3: LATEST ARRIVALS ---------------- */}
      <section className="flex flex-col md:flex-row w-full bg-brand-bgprimary">
        <div className="md:w-[40%] h-[60vh] md:h-auto relative reveal">
          <img
            src="https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1000"
            className="w-full h-full object-cover"
            alt="Sage green vest styling"
          />
        </div>
        <div className="md:w-[60%] p-12 md:p-24 flex flex-col justify-center space-y-6 reveal">
          <span className="font-body text-[11px] text-brand-sage tracking-widest uppercase">
            — New Drop
          </span>
          <h2 className="font-display italic text-5xl text-brand-ink">
            The Embroidery Edit
          </h2>
          <p className="font-body text-[15px] text-brand-gray leading-[1.8] max-w-md">
            Three colorways. One silhouette. Designed to wear every day and
            remember forever.
          </p>
          <div className="flex gap-6 py-4">
            <Link
              href="/collection/sage"
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="w-[28px] h-[28px] rounded-full bg-brand-sage group-hover:scale-110 transition-transform shadow-sm"></div>
              <span className="text-xs text-brand-gray font-body mt-1">
                Sage
              </span>
            </Link>
            <Link
              href="/collection/blush"
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="w-[28px] h-[28px] rounded-full bg-brand-rose group-hover:scale-110 transition-transform shadow-sm"></div>
              <span className="text-xs text-brand-gray font-body mt-1">
                Blush
              </span>
            </Link>
            <Link
              href="/collection/sky"
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="w-[28px] h-[28px] rounded-full bg-brand-blue group-hover:scale-110 transition-transform shadow-sm"></div>
              <span className="text-xs text-brand-gray font-body mt-1">
                Sky
              </span>
            </Link>
          </div>
          <Link
            href="/collection"
            className="inline-block border border-brand-rose text-brand-rose px-8 py-3 rounded-full hover:bg-brand-rose hover:text-brand-ivory transition-all max-w-max mt-4 text-sm font-body cursor-pointer"
          >
            Explore the Edit →
          </Link>
        </div>
      </section>

      {/* ---------------- SECTION 4: WHY VREYA ---------------- */}
      <section className="py-24 px-6 md:px-16 bg-brand-bgsecondary grid md:grid-cols-3 gap-16 md:gap-12 text-center reveal">
        <div className="flex flex-col items-center space-y-4">
          <Scissors className="w-6 h-6 text-brand-rose mb-2" strokeWidth={1} />
          <h3 className="font-display text-lg text-brand-ink">
            Handcrafted Details
          </h3>
          <p className="font-body text-[14px] text-brand-muted max-w-xs">
            Intricate embroidery & artisanal care
          </p>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <Package className="w-6 h-6 text-brand-rose mb-2" strokeWidth={1} />
          <h3 className="font-display text-lg text-brand-ink">
            Limited Pieces
          </h3>
          <p className="font-body text-[14px] text-brand-muted max-w-xs">
            Small batches, never mass produced
          </p>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <Shirt className="w-6 h-6 text-brand-rose mb-2" strokeWidth={1} />
          <h3 className="font-display text-lg text-brand-ink">
            Effortless Styling
          </h3>
          <p className="font-body text-[14px] text-brand-muted max-w-xs">
            Easy to style, wear with anything
          </p>
        </div>
      </section>

      {/* ---------------- SECTION 5: ONE PIECE MULTIPLE MOODS ---------------- */}
      <section className="py-24 bg-brand-bgprimary border-t border-brand-borderlight reveal">
        <div className="px-6 md:px-16 mb-12">
          <h2 className="font-display text-[40px] text-brand-ink text-left">
            One piece. Multiple moods.
          </h2>
        </div>
        <div
          className="flex overflow-x-auto gap-6 px-6 md:px-16 pb-8 snap-x"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {[
            {
              title: "Morning light",
              img: "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=600",
            },
            {
              title: "Studio sessions",
              img: "https://images.unsplash.com/photo-1605389657022-de5003319087?q=80&w=600",
            },
            {
              title: "Weekend brunch",
              img: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=600",
            },
            {
              title: "Evening out",
              img: "https://images.unsplash.com/photo-1454372182658-c712e4c5a1db?q=80&w=600",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex-none w-[80vw] md:w-[28vw] snap-center group"
            >
              <div className="aspect-[4/5] bg-brand-bgsecondary rounded-xl overflow-hidden mb-4 border border-brand-borderlight">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="font-body text-sm text-brand-gray text-center">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- SECTION 6: THE ATELIER ---------------- */}
      <section className="flex flex-col md:flex-row w-full bg-brand-bgdark text-brand-ivory reveal">
        <div className="md:w-[50%] h-[60vh] md:h-auto relative">
          <img
            src="https://images.unsplash.com/photo-1556909211-3698d532d7dc?q=80&w=1000"
            className="w-full h-full object-cover opacity-80 mix-blend-luminosity brightness-75 hover:mix-blend-normal hover:brightness-100 transition-all duration-700"
            alt="Designer sketching"
          />
        </div>
        <div className="md:w-[50%] p-12 md:p-24 flex flex-col justify-center space-y-8">
          <span className="font-body text-[11px] tracking-widest uppercase opacity-70">
            — Our Story
          </span>
          <h2 className="font-display italic text-4xl md:text-5xl">
            Every stitch is a decision.
          </h2>
          <p className="font-body text-brand-ivory/80 leading-[1.8] max-w-md text-[15px]">
            Each piece is shaped by artisans across generations, crafted slowly,
            intentionally.
          </p>
          <p className="font-display italic text-brand-rose text-lg border-l-2 border-brand-rose/40 pl-4 py-1 my-4">
            "We don't call it embellishment. We call it the work."
          </p>
          <div className="pt-4">
            <Link
              href="/our-story"
              className="inline-block border-b border-brand-ivory/50 pb-1 hover:text-brand-ivory hover:border-brand-ivory transition-colors font-body text-sm uppercase tracking-widest"
            >
              Read Our Story →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}