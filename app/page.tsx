"use client";

import {
  getProductsInCollection,
  ShopifyProductNode,
} from "@/lib/shopify";
import Link from "next/link";
import { Scissors, Package, Shirt } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [products, setProducts] = useState<ShopifyProductNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
  console.log("|" + process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN + "|");
}, []);

  // --- THE FIXED GSAP LOGIC ---
  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".reveal").forEach((el: any) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          },
        );
      });
    });

    return () => ctx.revert();
  }, [isLoading]);


  return (
    <div className="bg-brand-bgprimary text-brand-ink flex flex-col">
      <Navbar isHome={true} />

      {/* ---------------- SECTION 1: HERO ---------------- */}
      <section className="relative h-[90vh] flex items-center px-6 md:px-16">
        <Image
          src="/hero-bg.png"
          alt="Rose pink vest"
          className="absolute inset-0 object-cover"
          fill // Added fill instead of strict width/height
          priority // Tells Next.js to load this immediately for better performance
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/40 z-[1]" />

        <div className="relative max-w-2xl space-y-6 text-brand-ivory reveal z-10">
          <h1 className="text-5xl md:text-7xl font-display italic leading-[1.1]">
            Soft statements.
            <br />
            Handcrafted elegance.
          </h1>

          <p className="font-body text-base font-light text-brand-ivory opacity-90 max-w-md">
            Limited edition embroidered clothes for everyday luxury
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
              "Crafted, not mass produced. At Aakhya, every piece is designed to
              feel soft, intentional, and timeless."
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.slice(0, 3).map((item) => (
              <Link href={`/product/${item.node.handle}`} key={item.node.id}>
                <div className="group relative bg-brand-bgprimary border border-brand-borderlight rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(44,37,32,0.06)] hover:-translate-y-1 transition-all duration-300">
                  {/* Parent has 'relative' here, which is perfect for fill */}
                  <div className="aspect-square overflow-hidden relative">
                    <div className="absolute top-3 right-3 z-10 border text-[11px] px-[8px] py-[2px] rounded-full font-body bg-brand-ink/5 text-brand-ink/60 border-brand-ink/10 backdrop-blur-sm">
                      Limited
                    </div>
                    <Image
                      src={
                        item.node.images.edges[0]?.node.url ||
                        "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=800"
                      }
                      alt={item.node.title}
                      fill // Added fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 text-center space-y-3">
                    <h3 className="font-display text-xl text-brand-ink">
                      {item.node.title}
                    </h3>
                    <p className="font-body text-sm text-brand-gray">
                      ₹{item.node.priceRange.minVariantPrice.amount}
                    </p>

                    <Link
                      href={`/product/${item.node.handle}`}
                      className="text-xs font-body tracking-wider uppercase text-brand-rose border-b border-brand-rose/30 hover:border-brand-rose pb-1 mt-2 inline-block transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Product →
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* ---------------- SECTION 3: LATEST ARRIVALS ---------------- */}
      <section className="flex flex-col md:flex-row w-full bg-brand-bgprimary">
        <div className="md:w-[40%] h-[60vh] md:h-auto relative reveal">
          <Image
            src="/aakhya4.jpg"
            fill // Added fill here to fix the crash
            className="object-cover"
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
          {products.length > 0 && (
            <ul className="py-4 space-y-2">
              {products.slice(0, 3).map((item) => (
                <li key={item.node.id}>
                  <Link
                    href={`/product/${item.node.handle}`}
                    className="font-body text-[13px] text-brand-gray hover:text-brand-ink transition-colors tracking-wide flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-rose group-hover:scale-150 transition-transform" />
                    {item.node.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/collection"
            className="inline-block border border-brand-rose text-brand-rose px-8 py-3 rounded-full hover:bg-brand-rose hover:text-brand-ivory transition-all max-w-max mt-4 text-sm font-body cursor-pointer"
          >
            Explore the Edit →
          </Link>
        </div>
      </section>

      {/* ---------------- SECTION 4: WHY aakhya ---------------- */}
      <section className="py-28 px-6 md:px-16 bg-brand-bgsecondary grid md:grid-cols-3 gap-16 md:gap-12 text-center reveal border-t border-brand-borderlight">
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

      {/* ---------------- SECTION 6: THE ATELIER ---------------- */}
      <section className="flex flex-col md:flex-row w-full bg-brand-bgdark text-brand-ivory reveal">
        <div className="md:w-[50%] h-[60vh] md:h-auto relative">
          <Image
            src="/aakhya-5.png"
            fill // Added fill here
            className="object-cover opacity-80 mix-blend-luminosity brightness-75 hover:mix-blend-normal hover:brightness-100 transition-all duration-700"
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
  // just adding this for a fresh deployment
}