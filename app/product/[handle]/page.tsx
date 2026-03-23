"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Check } from "lucide-react";
import Navbar from "@/components/navbar";
import { useCart } from "@/context/cartcontext";
import { getProduct, ShopifyProduct } from "@/lib/shopify";

export default function ProductPage({ params }: { params: { handle: string } }) {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cartState, setCartState] = useState<"idle" | "adding" | "success">("idle");
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState("M");
  
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      const data = await getProduct(params.handle);
      setProduct(data);
      if (data && data.variants.edges.length > 0) {
        setSelectedVariantId(data.variants.edges[0].node.id);
      }
    }
    fetchProduct();
  }, [params.handle]);

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-bgprimary flex items-center justify-center">
        <div className="w-3 h-3 bg-brand-sage rounded-full animate-ping"></div>
      </div>
    );
  }

  const images = product.images.edges.map(e => e.node.url);
  const mainImage = images.length > 0 ? images[activeIndex] : "https://images.unsplash.com/photo-1596455607563-ad6193f76b17";
  const price = product.priceRange.minVariantPrice.amount;
  const variants = product.variants.edges;

  const handleAddToCart = () => {
    if (cartState !== "idle" || !selectedVariantId) return;
    setCartState("adding");

    addToCart({
      id: selectedVariantId,
      title: product.title,
      price: Number(price),
      image: mainImage,
      handle: product.handle,
    });

    setTimeout(() => setCartState("success"), 1200);
    setTimeout(() => setCartState("idle"), 3000);
  };

  return (
    <div className="min-h-screen bg-brand-bgprimary text-brand-ink font-body flex flex-col pt-24 text-left">
      <Navbar />

      <main className="flex-grow w-full">
        <div className="max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row min-h-[85vh]">
          
          {/* ================= LEFT: 60% IMAGE GALLERY ================= */}
          <div className="w-full lg:w-[60%] flex flex-col md:flex-row gap-4 p-6 lg:p-12">
            {/* THUMBNAILS (Hidden on mobile) */}
            <div className="hidden md:flex flex-col gap-4 overflow-y-auto max-h-[80vh] hide-scrollbar pb-2 pr-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`relative h-[120px] w-[90px] shrink-0 overflow-hidden rounded-lg border transition-all duration-300 ${
                    i === activeIndex
                      ? "border-brand-sage opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* MAIN IMAGE */}
            <div className="relative w-full aspect-[4/5] md:h-[80vh] md:aspect-auto bg-brand-bgsecondary overflow-hidden rounded-xl border border-brand-borderlight">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img
                    src={mainImage}
                    alt={product.title}
                    className="w-full h-full object-cover object-center"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* MOBILE THUMBNAILS */}
            <div className="flex md:hidden gap-4 mt-2 overflow-x-auto hide-scrollbar pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative h-[100px] w-[75px] shrink-0 overflow-hidden rounded-lg border transition-all duration-300 ${
                    i === activeIndex
                      ? "border-brand-sage opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ================= RIGHT: 40% PRODUCT DETAILS (Sticky) ================= */}
          <div className="w-full lg:w-[40%] px-6 pb-24 lg:py-12 lg:pr-12 text-left">
            <div className="lg:sticky lg:top-[120px] max-w-lg mx-auto lg:mx-0">
              
              <div className="flex items-center gap-3 bg-[rgba(143,168,130,0.1)] text-brand-sage border border-brand-sage/20 mb-6 w-fit px-3 py-1 rounded-full">
                <ShieldCheck size={14} className="text-brand-sage" strokeWidth={1.5} />
                <span className="font-body text-[10px] tracking-widest uppercase font-medium">
                  Atelier Authenticity Mark
                </span>
              </div>

              <h1 className="font-display text-[32px] md:text-[40px] font-medium leading-[1.1] mb-2 text-brand-ink">
                {product.title}
              </h1>

              <div className="mb-8">
                <span className="font-body text-xl tracking-wide text-brand-gray">
                  ₹ {Number(price).toLocaleString()}
                </span>
              </div>

              <p className="font-body text-brand-gray leading-[1.8] text-[15px] mb-10 text-left">
                {product.description || "Limited edition embroidered vest for everyday luxury. Completely handcrafted, zero fast-fashion shortcuts."}
              </p>

              {/* COLOR SELECTOR */}
              <div className="mb-8">
                <p className="font-body text-[11px] tracking-widest uppercase text-brand-gray mb-3">
                  Colorway
                </p>
                <div className="flex gap-4">
                   <button
                     onClick={() => {}}
                     className="w-8 h-8 rounded-full bg-brand-sage ring-1 ring-offset-2 ring-brand-bgprimary border border-brand-sage cursor-pointer marker"
                     aria-label="Sage"
                   />
                   <button
                     onClick={() => {}}
                     className="w-8 h-8 rounded-full bg-brand-rose opacity-60 hover:opacity-100 cursor-pointer"
                     aria-label="Blush"
                   />
                   <button
                     onClick={() => {}}
                     className="w-8 h-8 rounded-full bg-brand-blue opacity-60 hover:opacity-100 cursor-pointer"
                     aria-label="Sky"
                   />
                </div>
              </div>

              {/* SIZE SELECTOR */}
              <div className="mb-10">
                <div className="flex justify-between items-end mb-3">
                  <p className="font-body text-[11px] tracking-widest uppercase text-brand-gray">
                    Size
                  </p>
                  <button className="text-[11px] text-brand-rose underline font-body cursor-pointer">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`h-10 px-5 rounded-full font-body text-xs border transition-colors cursor-pointer ${
                        selectedSize === s 
                        ? 'border-brand-sage bg-[rgba(143,168,130,0.1)] text-brand-sage' 
                        : 'border-brand-borderlight text-brand-gray hover:border-brand-sage'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* --- ADD TO CART BUTTON --- */}
              <div className="mb-12">
                <button
                  onClick={handleAddToCart}
                  disabled={cartState !== "idle"}
                  className="w-full h-14 bg-brand-rose text-brand-ivory rounded-full font-body text-[13px] uppercase hover:bg-opacity-90 transition-all flex items-center justify-center shadow-lg hover:scale-[1.02]"
                >
                  <AnimatePresence mode="wait">
                    {cartState === "idle" && <span key="idle">Add to Bag - ₹{price}</span>}
                    {cartState === "adding" && (
                      <motion.div key="adding" initial={{opacity:0}} animate={{opacity:1}} className="flex items-center gap-2">
                        <div className="w-[6px] h-[6px] rounded-full bg-brand-ivory animate-[pulse_1s_infinite_0s]"></div>
                        <div className="w-[6px] h-[6px] rounded-full bg-brand-ivory animate-[pulse_1s_infinite_0.2s]"></div>
                        <div className="w-[6px] h-[6px] rounded-full bg-brand-ivory animate-[pulse_1s_infinite_0.4s]"></div>
                      </motion.div>
                    )}
                    {cartState === "success" && (
                      <motion.span key="success" initial={{opacity:0}} animate={{opacity:1}} className="flex items-center gap-2">
                        Added <Check size={16} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* BELOW THE FOLD DETAILS */}
        <section className="bg-brand-bgsecondary py-20 px-6 border-t border-brand-borderlight w-full">
           <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 justify-between">
              <div className="md:w-1/2">
                 <h3 className="font-display text-2xl text-brand-ink mb-6">How It's Made</h3>
                 <ul className="space-y-4 font-body text-[15px] text-brand-gray text-left">
                    <li className="flex items-start gap-4">
                       <span className="w-1.5 h-1.5 rounded-full bg-brand-sage mt-2 shrink-0"></span>
                       <span>Hand embroidered botanical motifs by artisans in Pune, taking over 42 hours complete.</span>
                    </li>
                    <li className="flex items-start gap-4">
                       <span className="w-1.5 h-1.5 rounded-full bg-brand-sage mt-2 shrink-0"></span>
                       <span>Cut from premium 100% fine European flax linen, ensuring breathability and structured softness.</span>
                    </li>
                    <li className="flex items-start gap-4">
                       <span className="w-1.5 h-1.5 rounded-full bg-brand-sage mt-2 shrink-0"></span>
                       <span>Finished with delicate handmade bow thread-ties instead of standard buttons.</span>
                    </li>
                 </ul>
              </div>
              <div className="md:w-1/2">
                 <div className="aspect-[4/3] bg-brand-bgprimary rounded-xl overflow-hidden border border-brand-borderlight">
                    <img src="https://images.unsplash.com/photo-1454372182658-c712e4c5a1db?q=80&w=1000" alt="Artisan details" className="w-full h-full object-cover" />
                 </div>
              </div>
           </div>
        </section>

        {/* COMPLETE THE LOOK */}
        <section className="py-24 px-6 md:px-16 w-full text-center border-t border-brand-bgprimary">
           <h3 className="font-display text-4xl text-brand-ink mb-12">Complete the Look</h3>
           <div className="flex overflow-x-auto gap-6 pb-8 snap-x justify-center" style={{ scrollSnapType: 'x mandatory' }}>
              {[1,2,3].map(i => (
                <div key={i} className="flex-none w-[80vw] md:w-[25vw] snap-center group">
                  <div className="aspect-[3/4] bg-brand-bgsecondary rounded-xl overflow-hidden mb-4 border border-brand-borderlight cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1596455607563-ad6193f76b17" alt="styled" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <h4 className="font-display text-lg">Linen Trouser - Cream</h4>
                  <p className="font-body text-sm text-brand-gray mt-1">₹1,950</p>
                </div>
              ))}
           </div>
        </section>

      </main>
    </div>
  );
}
