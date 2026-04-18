"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronDown, Ruler } from "lucide-react";
import Navbar from "@/components/navbar";
import { useCart } from "@/context/cartcontext";
import { getProduct, getProductsInCollection, ShopifyProduct, ShopifyProductNode } from "@/lib/shopify";
import Image from "next/image";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type CartState = "idle" | "adding" | "success";
type AccordionKey = "fabric" | "care" | "shipping";

// ─── Helper function to parse Shopify Metaobjects cleanly ─────────────────────
function parseMetafield(metafield: any): string[] | null {
  if (!metafield) return null;

  if (metafield.references?.edges?.length > 0) {
    return metafield.references.edges.map((edge: any) => {
      const node = edge.node;
      if (node.fields) {
        const nameField = node.fields.find((f: any) => f.key === "name" || f.key === "label");
        if (nameField && nameField.value) {
          return nameField.value.replace(/^"|"$/g, '');
        }
      }
      if (node.handle) {
        return node.handle
          .split('-')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
      return null;
    }).filter(Boolean);
  }

  if (!metafield.value) return null;
  try {
    const parsed = JSON.parse(metafield.value);
    if (Array.isArray(parsed)) {
      const cleanArray = parsed.filter(item => typeof item === 'string' && !item.includes("gid://"));
      return cleanArray.length > 0 ? cleanArray : null;
    }
    if (typeof parsed === 'string' && parsed.includes("gid://")) return null;
    return [parsed.toString()];
  } catch {
    if (metafield.value.includes("gid://")) return null;
    return [metafield.value];
  }
}

// ─── Size chart data ──────────────────────────────────────────────────────────
const SIZE_CHART = [
  { size: "S",  chest: "34–35", waist: "27–28", hip: "37–38", length: "24.5" },
  { size: "M",  chest: "36–37", waist: "29–30", hip: "39–40", length: "25" },
  { size: "L",  chest: "38–40", waist: "31–33", hip: "41–43", length: "25.5" },
];

// ─── Color config ─────────────────────────────────────────────────────────────
const COLORS = [
  { label: "Sage",  value: "sage",  bgClass: "bg-brand-sage",  ring: "ring-brand-sage"  },
  { label: "Blush", value: "rose",  bgClass: "bg-brand-rose",  ring: "ring-brand-rose"  },
  { label: "Sky",   value: "blue",  bgClass: "bg-brand-blue",  ring: "ring-brand-blue"  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function AccordionItem({
  label,
  content,
  isOpen,
  onToggle,
}: {
  label: string;
  content: string[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-brand-borderlight">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left group cursor-pointer"
      >
        <span className="font-body text-[11px] tracking-widest uppercase text-brand-gray group-hover:text-brand-ink transition-colors">
          {label}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={14} className="text-brand-gray" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <ul className="space-y-2.5 pb-5">
              {content.map((line, i) => (
                <li key={i} className="flex items-start gap-3 font-body text-[14px] text-brand-gray leading-relaxed">
                  <span className="w-1 h-1 rounded-full bg-brand-sage mt-[7px] shrink-0" />
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SizeChartModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-brand-ink/40 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-brand-bgprimary rounded-2xl border border-brand-borderlight shadow-2xl w-full max-w-lg p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Ruler size={16} className="text-brand-sage" strokeWidth={1.5} />
              <h3 className="font-display text-xl text-brand-ink">Size Guide</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-bgsecondary transition-colors cursor-pointer"
            >
              <X size={15} className="text-brand-gray" />
            </button>
          </div>

          <p className="font-body text-[12px] text-brand-gray tracking-wide mb-5">
            All measurements in inches. When between sizes, size up for a relaxed fit.
          </p>

          <div className="overflow-x-auto rounded-xl border border-brand-borderlight">
            <table className="w-full text-left font-body text-[13px]">
              <thead>
                <tr className="bg-brand-bgsecondary">
                  {["Size", "Chest", "Waist", "Hip", "Length"].map((h) => (
                    <th key={h} className="px-4 py-3 text-[10px] tracking-widest uppercase text-brand-gray font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZE_CHART.map((row, i) => (
                  <tr
                    key={row.size}
                    className={`border-t border-brand-borderlight ${i % 2 === 0 ? "" : "bg-brand-bgsecondary/40"}`}
                  >
                    <td className="px-4 py-3 text-brand-sage font-medium">{row.size}</td>
                    <td className="px-4 py-3 text-brand-ink">{row.chest}</td>
                    <td className="px-4 py-3 text-brand-ink">{row.waist}</td>
                    <td className="px-4 py-3 text-brand-ink">{row.hip}</td>
                    <td className="px-4 py-3 text-brand-ink">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="font-body text-[11px] text-brand-gray/70 mt-5 text-center">
            Model is 5′8″ wearing size S. Measurements may vary ±0.5″.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [similarProducts, setSimilarProducts] = useState<ShopifyProductNode[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cartState, setCartState] = useState<CartState>("idle");
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [openAccordion, setOpenAccordion] = useState<AccordionKey | null>(null);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  const { addToCart } = useCart();

  // Fetch Current Product AND Similar Products
  useEffect(() => {
    async function fetchProducts() {
      // 1. Fetch Main Product
      const productData = await getProduct(resolvedParams.handle);
      setProduct(productData);

      // 2. Fetch Similar Products
      const similarData = await getProductsInCollection(5);
      if (similarData) {
        const filtered = similarData.filter(p => p.node.handle !== resolvedParams.handle).slice(0, 3);
        setSimilarProducts(filtered);
      }
    }
    fetchProducts();
  }, [resolvedParams.handle]);

  // ─── NEW: Auto-Detect Color Based on Shopify Product Title ────────────────
  useEffect(() => {
    if (product) {
      const titleStr = product.title.toLowerCase();
      if (titleStr.includes("sage") || titleStr.includes("green")) {
        setSelectedColor(COLORS.find(c => c.value === "sage") || COLORS[0]);
      } else if (titleStr.includes("sky") || titleStr.includes("blue")) {
        setSelectedColor(COLORS.find(c => c.value === "blue") || COLORS[2]);
      } else if (titleStr.includes("blush") || titleStr.includes("rose") || titleStr.includes("pink")) {
        setSelectedColor(COLORS.find(c => c.value === "rose") || COLORS[1]);
      }
    }
  }, [product]);

  // Update Active Variant ID when Size changes
  useEffect(() => {
    if (product && product.variants?.edges) {
      const matchedVariant = product.variants.edges.find(({ node }) => {
        const variantParts = node.title.split('/').map(part => part.trim().toUpperCase());
        return variantParts.includes(selectedSize.toUpperCase());
      });

      if (matchedVariant) {
        setSelectedVariantId(matchedVariant.node.id);
      } else {
        setSelectedVariantId(product.variants.edges[0].node.id);
      }
    }
  }, [selectedSize, product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-bgprimary flex items-center justify-center">
        <div className="w-3 h-3 bg-brand-sage rounded-full animate-ping" />
      </div>
    );
  }

  // Filter images by selected color keyword
  const allImages = product.images.edges.map((e) => e.node.url);
  const filteredImages = allImages.filter((url) =>
    url.toLowerCase().includes(selectedColor.value)
  );
  const images = filteredImages.length > 0 ? filteredImages : allImages;
  const safeIndex = Math.min(activeIndex, images.length - 1);
  const mainImage = images[safeIndex] ?? "https://images.unsplash.com/photo-1596455607563-ad6193f76b17";
  const price = product.priceRange.minVariantPrice.amount;

  const handleColorSelect = (color: typeof COLORS[0]) => {
    setSelectedColor(color);
    setActiveIndex(0); 
  };

  const handleAddToCart = () => {
    if (cartState !== "idle" || !selectedVariantId) return;
    setCartState("adding");
    addToCart({
      id: selectedVariantId,
      title: `${product.title} - ${selectedSize}`,
      price: Number(price),
      image: mainImage,
      handle: product.handle,
    });
    setTimeout(() => setCartState("success"), 1200);
    setTimeout(() => setCartState("idle"), 3000);
  };

  const toggleAccordion = (key: AccordionKey) =>
    setOpenAccordion((prev) => (prev === key ? null : key));

  const fabricData = parseMetafield(product.fabricCustom) || parseMetafield(product.fabricShopify);
  const careData = parseMetafield(product.careCustom) || parseMetafield(product.careShopify);

  const dynamicAccordionData: { key: AccordionKey; label: string; content: string[] }[] = [
    {
      key: "fabric",
      label: "Fabric & Material",
      content: fabricData || [
        "100% fine European flax linen, OEKO-TEX certified",
        "Breathable, structured weave — softens with each wash",
        "Inner lining: 100% organic cotton voile",
      ],
    },
    {
      key: "care",
      label: "Care Instructions",
      content: careData || [
        "Hand wash cold or delicate machine cycle",
        "Use mild, pH-neutral detergent",
        "Lay flat to dry — do not tumble dry",
        "Cool iron on reverse; no steam on embroidery",
      ],
    },
    {
      key: "shipping",
      label: "Shipping & Returns",
      content: [
        "Dispatched within 3–5 business days",
        "Easy 14-day returns for unworn, tagged items",
        "Exchange available for size issues — no questions asked",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-brand-bgprimary text-brand-ink font-body flex flex-col pt-24 text-left">
      <Navbar />

      {sizeChartOpen && <SizeChartModal onClose={() => setSizeChartOpen(false)} />}

      <main className="flex-grow w-full">
        <div className="max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row min-h-[85vh]">

          {/* ── LEFT: Image Gallery ─────────────────────────────────────── */}
          <div className="w-full lg:w-[60%] flex flex-col md:flex-row gap-4 p-6 lg:p-12">
            <div className="hidden md:flex flex-col gap-3 overflow-y-auto max-h-[80vh] hide-scrollbar pb-2 pr-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`relative h-[120px] w-[90px] shrink-0 overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer ${
                    i === safeIndex
                      ? "border-brand-sage opacity-100"
                      : "border-transparent opacity-55 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${i + 1}`} fill loading="lazy" className="object-cover" />
                </button>
              ))}
            </div>

            <div className="relative w-full aspect-[4/5] md:h-[80vh] md:aspect-auto bg-brand-bgsecondary overflow-hidden rounded-xl border border-brand-borderlight">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedColor.value}-${safeIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={mainImage}
                    alt={product.title}
                    fill
                    className="object-cover object-center"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex md:hidden gap-3 mt-2 overflow-x-auto hide-scrollbar pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative h-[90px] w-[68px] shrink-0 overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer ${
                    i === safeIndex
                      ? "border-brand-sage opacity-100"
                      : "border-transparent opacity-55 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Product Details ──────────────────────────────────── */}
          <div className="w-full lg:w-[40%] px-6 pb-24 lg:py-12 lg:pr-12 text-left">
            <div className="lg:sticky lg:top-[120px] max-w-lg mx-auto lg:mx-0">

              <h1 className="font-display text-[32px] md:text-[40px] font-medium leading-[1.1] mb-2 text-brand-ink">
                {product.title}
              </h1>

              <div className="mb-6">
                <span className="font-body text-xl tracking-wide text-brand-gray">
                  ₹ {Number(price).toLocaleString()}
                </span>
              </div>

              <div 
                className="font-body text-brand-gray leading-[1.8] text-[15px] mb-10 [&>p]:mb-4 [&>strong]:font-medium [&>strong]:text-brand-ink"
                dangerouslySetInnerHTML={{ 
                  __html: product.descriptionHtml || "<p>Limited edition embroidered vest for everyday luxury.</p>" 
                }} 
              />

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <p className="font-body text-[11px] tracking-widest uppercase text-brand-gray">
                    Colorway
                  </p>
                  <span className="font-body text-[11px] text-brand-ink/60">— {selectedColor.label}</span>
                </div>
                <div className="flex gap-3">
                  {COLORS.map((color) => {
                    const isActive = selectedColor.value === color.value;
                    return (
                      <button
                        key={color.value}
                        onClick={() => handleColorSelect(color)}
                        aria-label={color.label}
                        title={color.label}
                        className={`w-9 h-9 rounded-full ${color.bgClass} cursor-pointer transition-all duration-200 ${
                          isActive
                            ? `ring-2 ring-offset-2 ring-offset-brand-bgprimary ${color.ring} scale-110`
                            : "opacity-50 hover:opacity-80 hover:scale-105"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mb-10">
                <div className="flex justify-between items-end mb-3">
                  <p className="font-body text-[11px] tracking-widest uppercase text-brand-gray">Size</p>
                  <button
                    onClick={() => setSizeChartOpen(true)}
                    className="flex items-center gap-1.5 text-[11px] text-brand-rose font-body cursor-pointer group"
                  >
                    <Ruler size={12} className="group-hover:rotate-12 transition-transform duration-200" />
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {["S", "M", "L"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`h-10 px-5 rounded-full font-body text-xs border transition-colors cursor-pointer ${
                        selectedSize === s
                          ? "border-brand-sage bg-[rgba(143,168,130,0.1)] text-brand-sage"
                          : "border-brand-borderlight text-brand-gray hover:border-brand-sage"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <button
                  onClick={handleAddToCart}
                  disabled={cartState !== "idle"}
                  className="w-full h-14 bg-brand-rose text-brand-ivory rounded-full font-body text-[13px] uppercase hover:bg-opacity-90 transition-all flex items-center justify-center shadow-lg hover:scale-[1.02] cursor-pointer disabled:cursor-default"
                >
                  <AnimatePresence mode="wait">
                    {cartState === "idle" && (
                      <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        Add to Bag — ₹{Number(price).toLocaleString()}
                      </motion.span>
                    )}
                    {cartState === "adding" && (
                      <motion.div key="adding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                        {[0, 0.2, 0.4].map((delay, i) => (
                          <div
                            key={i}
                            className="w-[6px] h-[6px] rounded-full bg-brand-ivory animate-pulse"
                            style={{ animationDelay: `${delay}s` }}
                          />
                        ))}
                      </motion.div>
                    )}
                    {cartState === "success" && (
                      <motion.span key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                        Added <Check size={16} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              <div className="border-t border-brand-borderlight">
                {dynamicAccordionData.map(({ key, label, content }) => (
                  <AccordionItem
                    key={key}
                    label={label}
                    content={content}
                    isOpen={openAccordion === key}
                    onToggle={() => toggleAccordion(key)}
                  />
                ))}
              </div>

            </div>
          </div>
        </div>

        <section className="bg-brand-bgsecondary py-20 px-6 border-t border-brand-borderlight w-full">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 justify-between">
            <div className="md:w-1/2">
              <h3 className="font-display text-2xl text-brand-ink mb-6">How It&apos;s Made</h3>
              <ul className="space-y-4 font-body text-[15px] text-brand-gray text-left">
                {[
                  "Hand embroidered botanical motifs by artisans in Pune, taking over 42 hours to complete.",
                  "Cut from premium 100% fine European flax linen, ensuring breathability and structured softness.",
                  "Finished with delicate handmade bow thread-ties instead of standard buttons.",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-sage mt-2 shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="aspect-[4/3] bg-brand-bgprimary rounded-xl overflow-hidden border border-brand-borderlight relative">
                <Image
                  src="https://images.unsplash.com/photo-1454372182658-c712e4c5a1db?q=80&w=1000"
                  alt="Artisan details"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Similar Products ──────────────────────────────────────────────── */}
        {similarProducts.length > 0 && (
          <section className="py-24 px-6 md:px-16 w-full text-center border-t border-brand-bgprimary">
            <h3 className="font-display text-4xl text-brand-ink mb-12">Complete the Look</h3>
            <div className="flex overflow-x-auto gap-6 pb-8 snap-x justify-center" style={{ scrollSnapType: "x mandatory" }}>
              {similarProducts.map((item) => {
                const titleStr = item.node.title.toLowerCase();
                let productCardBadge = "bg-[rgba(201,125,125,0.12)] text-brand-rose border-[rgba(201,125,125,0.3)]";
                if (titleStr.includes("sage") || titleStr.includes("green")) {
                  productCardBadge = "bg-[rgba(143,168,130,0.12)] text-brand-sage border-[rgba(143,168,130,0.3)]";
                } else if (titleStr.includes("sky") || titleStr.includes("blue")) {
                  productCardBadge = "bg-[rgba(134,167,185,0.12)] text-brand-blue border-[rgba(134,167,185,0.3)]";
                }

                return (
                  <Link href={`/product/${item.node.handle}`} key={item.node.id} className="flex-none w-[80vw] md:w-[25vw] snap-center group">
                    <div className="aspect-[3/4] bg-brand-bgprimary rounded-xl overflow-hidden mb-4 border border-brand-borderlight cursor-pointer relative shadow-[0_2px_12px_rgba(44,37,32,0.06)] group-hover:-translate-y-1 transition-all duration-300">
                      <div className={`absolute top-3 right-3 z-10 border text-[11px] px-[8px] py-[2px] rounded-full font-body ${productCardBadge}`}>
                        Limited
                      </div>
                      <Image
                        src={item.node.images.edges[0]?.node.url || "https://images.unsplash.com/photo-1596455607563-ad6193f76b17"}
                        alt={item.node.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <h4 className="font-display text-lg text-brand-ink transition-colors">{item.node.title}</h4>
                    <p className="font-body text-sm text-brand-gray mt-1">₹{item.node.priceRange.minVariantPrice.amount}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}