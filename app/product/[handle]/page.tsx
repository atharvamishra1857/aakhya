"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronDown, Ruler } from "lucide-react";
import Navbar from "@/components/navbar";
import { useCart } from "@/context/cartcontext";
import ComboOffer from "@/components/comboOffer";
import {
  getProduct,
  getProductsInCollection,
  ShopifyProduct,
  ShopifyProductNode,
} from "@/lib/shopify";
import Image from "next/image";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type CartState = "idle" | "adding" | "success";
type AccordionKey = "fabric" | "care" | "shipping";

// ─── Helper function to parse Shopify Metaobjects cleanly ─────────────────────
function parseMetafield(metafield: any): string[] | null {
  if (!metafield) return null;

  if (metafield.references?.edges?.length > 0) {
    return metafield.references.edges
      .map((edge: any) => {
        const node = edge.node;
        if (node.fields) {
          const nameField = node.fields.find(
            (f: any) => f.key === "name" || f.key === "label",
          );
          if (nameField && nameField.value) {
            return nameField.value.replace(/^"|"$/g, "");
          }
        }
        if (node.handle) {
          return node.handle
            .split("-")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        }
        return null;
      })
      .filter(Boolean);
  }

  if (!metafield.value) return null;
  try {
    const parsed = JSON.parse(metafield.value);
    if (Array.isArray(parsed)) {
      const cleanArray = parsed.filter(
        (item: any) => typeof item === "string" && !item.includes("gid://"),
      );
      return cleanArray.length > 0 ? cleanArray : null;
    }
    if (typeof parsed === "string" && parsed.includes("gid://")) return null;
    return [parsed.toString()];
  } catch {
    if (metafield.value.includes("gid://")) return null;
    return [metafield.value];
  }
}

// ─── Size chart data ──────────────────────────────────────────────────────────
const DEFAULT_SIZE_CHART = [
  { size: "S", chest: "34–35", waist: "27–28", hip: "37–38", length: "24.5" },
  { size: "M", chest: "36–37", waist: "29–30", hip: "39–40", length: "25" },
  { size: "L", chest: "38–40", waist: "31–33", hip: "41–43", length: "25.5" },
];

const CALYX_DETAILED_CHART = [
  { id: "A", name: "HPS Length", S: "39.5", M: "40", L: "40.5", XL: "41", tol: "0.5" },
  { id: "B", name: "Chest Circumference", S: "36.5", M: "37", L: "38.5", XL: "39.5", tol: "0.75" },
  { id: "C", name: "Neckline Depth", S: "5.75", M: "6.25", L: "6", XL: "6.5", tol: "0.5" },
  { id: "D", name: "Armhole Circumference", S: "18", M: "19", L: "17", XL: "20", tol: "1" },
  { id: "E", name: "Shoulder Width", S: "13.5", M: "13", L: "14", XL: "14.5", tol: "0.5" },
  { id: "F", name: "Waist Circumference", S: "33.5", M: "32", L: "31.5", XL: "34.5", tol: "0.5" },
  { id: "G", name: "Hip Circumference", S: "43", M: "41", L: "42", XL: "44", tol: "1" },
  { id: "H", name: "Length for Right Side", S: "44.5", M: "44", L: "43.5", XL: "45", tol: "0.5" },
  { id: "I", name: "Back Shoulder Depth", S: "8.75", M: "9.75", L: "9.5", XL: "10", tol: "0.75" },
  { id: "J", name: "Side Pocket Opening", S: "6.5", M: "6.5", L: "6.5", XL: "6.5", tol: "0" },
  { id: "K", name: "Pocket Depth", S: "5", M: "5", L: "5", XL: "5", tol: "0" },
  { id: "L", name: "Neckline to Slit Opening", S: "17", M: "17", L: "17", XL: "17", tol: "0" },
  { id: "M", name: "Bottom Opening Circ.", S: "35", M: "36", L: "34", XL: "37", tol: "1" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function SizeChartModal({ onClose, productHandle }: { onClose: () => void, productHandle: string }) {
  const isCalyx = productHandle === "calyx";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-brand-ink/40 backdrop-blur-sm px-4 py-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          // Notice we make the modal wider (max-w-3xl) if it's Calyx to fit the columns!
          className={`bg-brand-bgprimary rounded-2xl border border-brand-borderlight shadow-2xl w-full flex flex-col ${
            isCalyx ? "max-w-3xl max-h-[90vh]" : "max-w-lg"
          } p-6 md:p-8 relative`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <Ruler size={16} className="text-brand-sage" strokeWidth={1.5} />
              <h3 className="font-display text-xl text-brand-ink">
                Size Guide {isCalyx && "— Calyx"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-bgsecondary transition-colors cursor-pointer"
            >
              <X size={15} className="text-brand-gray" />
            </button>
          </div>

          <p className="font-body text-[12px] text-brand-gray tracking-wide mb-5 shrink-0">
            {isCalyx 
              ? "Detailed garment measurements in inches." 
              : "All measurements in inches. When between sizes, size up for a relaxed fit."}
          </p>

          <div className="overflow-auto rounded-xl border border-brand-borderlight flex-grow hide-scrollbar">
            {isCalyx ? (
              <table className="w-full text-left font-body text-[12px] whitespace-nowrap">
                <thead>
                  <tr className="bg-brand-bgsecondary sticky top-0 z-10 shadow-sm">
                    {["Code", "Measurement (Inches)", "S", "M", "L", "XL", "Tol +/-"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-[10px] tracking-widest uppercase text-brand-gray font-normal"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CALYX_DETAILED_CHART.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`border-t border-brand-borderlight hover:bg-brand-bgsecondary/30 transition-colors ${
                        i % 2 === 0 ? "" : "bg-brand-bgsecondary/10"
                      }`}
                    >
                      <td className="px-4 py-2.5 text-brand-sage font-medium">{row.id}</td>
                      <td className="px-4 py-2.5 text-brand-ink">{row.name}</td>
                      <td className="px-4 py-2.5 text-brand-ink">{row.S}</td>
                      <td className="px-4 py-2.5 text-brand-ink">{row.M}</td>
                      <td className="px-4 py-2.5 text-brand-ink">{row.L}</td>
                      <td className="px-4 py-2.5 text-brand-ink">{row.XL}</td>
                      <td className="px-4 py-2.5 text-brand-gray">{row.tol}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left font-body text-[13px]">
                <thead>
                  <tr className="bg-brand-bgsecondary">
                    {["Size", "Chest", "Waist", "Hip", "Length"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-[10px] tracking-widest uppercase text-brand-gray font-normal"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEFAULT_SIZE_CHART.map((row, i) => (
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
            )}
          </div>

          <p className="font-body text-[11px] text-brand-gray/70 mt-5 text-center shrink-0">
            {isCalyx 
              ? "Please refer to the tech pack drawing for measurement points A through M."
              : "Model is 5′8″ wearing size S. Measurements may vary ±0.5″."}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

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
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
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
                <li
                  key={i}
                  className="flex items-start gap-3 font-body text-[14px] text-brand-gray leading-relaxed"
                >
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [similarProducts, setSimilarProducts] = useState<ShopifyProductNode[]>(
    [],
  );
  const [comboProduct, setComboProduct] = useState<ShopifyProduct | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cartState, setCartState] = useState<CartState>("idle");
  const [openAccordion, setOpenAccordion] = useState<AccordionKey | null>(null);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  // ─── DYNAMIC INVENTORY STATES ───
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );

  const { addToCart } = useCart();

  // Fetch Current Product AND Similar Products
  useEffect(() => {
    async function fetchProducts() {
      const productData = await getProduct(resolvedParams.handle);
      setProduct(productData);

      // ─── COMBO OFFER WIRING ───
      let comboHandleToFetch = null;

      if (resolvedParams.handle === "calyx") {
        comboHandleToFetch = "rubal-necklace"; 
      } 

      if (comboHandleToFetch) {
        const comboData = await getProduct(comboHandleToFetch);
        setComboProduct(comboData);
      }

      const similarData = await getProductsInCollection(5);
      if (similarData) {
        const filtered = similarData
          .filter((p) => p.node.handle !== resolvedParams.handle)
          .slice(0, 3);
        setSimilarProducts(filtered);
      }
    }
    fetchProducts();
  }, [resolvedParams.handle]);

  // Extract Exact Sizes and Colors from Shopify Variants
  useEffect(() => {
    if (product && product.variants?.edges) {
      // 1. Find all unique sizes
      const extractedSizes = Array.from(
        new Set(
          product.variants.edges
            .map(
              ({ node }) =>
                node.selectedOptions?.find(
                  (o: any) => o.name.toLowerCase() === "size",
                )?.value,
            )
            .filter(Boolean) as string[],
        ),
      );
      setAvailableSizes(extractedSizes);
      if (extractedSizes.length > 0) setSelectedSize(extractedSizes[0]);

      // 2. Find all unique colors
      const extractedColors = Array.from(
        new Set(
          product.variants.edges
            .map(
              ({ node }) =>
                node.selectedOptions?.find(
                  (o: any) => o.name.toLowerCase() === "color",
                )?.value,
            )
            .filter(Boolean) as string[],
        ),
      ).map((color) => ({
        label: color,
        value: color.toLowerCase(),
      }));

      setAvailableColors(extractedColors);
      if (extractedColors.length > 0) setSelectedColor(extractedColors[0]);
    }
  }, [product]);

  // Match the Active Variant ID when User Changes Size or Color
  useEffect(() => {
    if (product && product.variants?.edges) {
      const matchedVariant = product.variants.edges.find(({ node }) => {
        if (!node.selectedOptions) return false;

        const sizeMatch =
          availableSizes.length === 0 ||
          node.selectedOptions.some(
            (o: any) =>
              o.name.toLowerCase() === "size" &&
              o.value.toUpperCase() === selectedSize.toUpperCase(),
          );

        const colorMatch =
          availableColors.length === 0 ||
          node.selectedOptions.some(
            (o: any) =>
              o.name.toLowerCase() === "color" &&
              o.value.toLowerCase() === selectedColor?.value,
          );

        return sizeMatch && colorMatch;
      });

      if (matchedVariant) {
        setSelectedVariantId(matchedVariant.node.id);
      } else {
        setSelectedVariantId(product.variants.edges[0]?.node?.id || null);
      }
    }
  }, [
    selectedSize,
    selectedColor,
    product,
    availableSizes.length,
    availableColors.length,
  ]);

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-bgprimary flex items-center justify-center">
        <div className="w-3 h-3 bg-brand-sage rounded-full animate-ping" />
      </div>
    );
  }

  // ─── ROBUST SMART IMAGE FILTERING ───
  const allImages = product.images.edges.map((e) => ({
    url: e.node.url,
    alt: (e.node.altText || "").toLowerCase(),
  }));

  let images = allImages;

  if (selectedColor) {
    const label = selectedColor.label.toLowerCase();
    const val = selectedColor.value.toLowerCase();

    const searchTerms = [label, val];
    if (
      val.includes("sage") ||
      label.includes("sage") ||
      val.includes("green") ||
      label.includes("green")
    )
      searchTerms.push("green", "sage");
    if (val.includes("rose") || val.includes("blush") || label.includes("pink"))
      searchTerms.push("pink", "rose", "blush");
    if (val.includes("sky") || label.includes("sky") || label.includes("blue"))
      searchTerms.push("blue", "sky");

    const matchedImages = allImages.filter((img) => {
      const urlText = img.url.toLowerCase();
      return searchTerms.some(
        (term) => img.alt.includes(term) || urlText.includes(term),
      );
    });

    if (matchedImages.length > 0) {
      images = matchedImages;
    }
  }

  const safeIndex = Math.min(activeIndex, Math.max(0, images.length - 1));
  const mainImage =
    images[safeIndex]?.url ??
    "https://images.unsplash.com/photo-1596455607563-ad6193f76b17";
  const price = product.priceRange.minVariantPrice.amount;

  const handleColorSelect = (color: { label: string; value: string }) => {
    setSelectedColor(color);
    setActiveIndex(0);
  };

  const handleAddToCart = () => {
    if (cartState !== "idle" || !selectedVariantId) return;
    setCartState("adding");

    const matchedVariant = product.variants.edges.find(
      ({ node }) => node.id === selectedVariantId,
    )?.node;

    addToCart({
      id: selectedVariantId,
      title: product.title,
      price: Number(price),
      image: mainImage,
      handle: product.handle,
      variantTitle:
        matchedVariant?.title ||
        `${selectedSize}${selectedColor ? ` / ${selectedColor.label}` : ""}`,
      selectedOptions: matchedVariant?.selectedOptions || [],
      availableVariants: product.variants.edges.map((e) => ({
        id: e.node.id,
        title: e.node.title,
        availableForSale: (e.node as any).availableForSale ?? true,
        price: e.node.price,
        selectedOptions: e.node.selectedOptions,
      })),
    });

    setTimeout(() => setCartState("success"), 1200);
    setTimeout(() => setCartState("idle"), 3000);
  };

  const toggleAccordion = (key: AccordionKey) =>
    setOpenAccordion((prev) => (prev === key ? null : key));

  // ─── CONTEXT-AWARE ACCORDION LOGIC ───
  const productTitleLower = product.title.toLowerCase();
  const isJewelry = productTitleLower.includes("necklace") || productTitleLower.includes("ring") || productTitleLower.includes("earring");

  const defaultFabric = isJewelry 
    ? ["Premium UV resin coating", "Hand-placed detailing on a durable base"]
    : [
        "100% fine European flax linen, OEKO-TEX certified",
        "Breathable, structured weave — softens with each wash",
        "Inner lining: 100% organic cotton voile",
      ];
      
  const defaultCare = isJewelry
    ? ["Wipe gently with a soft, dry cloth", "Keep away from moisture, perfumes, and harsh chemicals", "Store in a dry pouch or box"]
    : ["Dry clean recommended"];

  const fabricData =
    parseMetafield(product.fabricCustom) ||
    parseMetafield(product.fabricShopify);
  const careData =
    parseMetafield(product.careCustom) || parseMetafield(product.careShopify);

  const dynamicAccordionData: {
    key: AccordionKey;
    label: string;
    content: string[];
  }[] = [
    {
      key: "fabric",
      label: isJewelry ? "Materials & Craft" : "Fabric & Material",
      content: fabricData || defaultFabric,
    },
    {
      key: "care",
      label: "Care Instructions",
      content: careData || defaultCare,
    },
    {
      key: "shipping",
      label: "Shipping & Returns",
      content: ["Dispatched within 3–5 business days"],
    },
  ];

  // ── SMART PRICING LOGIC ───
  const activeVariant =
    product.variants.edges.find(({ node }) => node.id === selectedVariantId)
      ?.node || product.variants.edges[0].node;

  const currentPrice = Number(activeVariant.price.amount);
  const compareAtPrice = activeVariant.compareAtPrice
    ? Number(activeVariant.compareAtPrice.amount)
    : null;

  let discountPercentage = 0;
  if (compareAtPrice && compareAtPrice > currentPrice) {
    discountPercentage = Math.round(
      ((compareAtPrice - currentPrice) / compareAtPrice) * 100,
    );
  }

  return (
    <div className="min-h-screen bg-brand-bgprimary text-brand-ink font-body flex flex-col pt-24 text-left">
      <Navbar />

      {sizeChartOpen && (
        <SizeChartModal
          onClose={() => setSizeChartOpen(false)}
          productHandle={resolvedParams.handle}
        />
      )}

      <main className="flex-grow w-full">
        <div className="max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row min-h-[85vh]">
          {/* ── LEFT: Image Gallery ─────────────────────────────────────── */}
          <div className="w-full lg:w-[60%] flex flex-col md:flex-row gap-4 p-6 lg:p-12">
            <div className="hidden md:flex flex-col gap-3 overflow-y-auto max-h-[85vh] hide-scrollbar pb-2 pr-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`relative w-[90px] aspect-[3/4] shrink-0 overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer ${
                    i === safeIndex
                      ? "border-brand-sage opacity-100 ring-1 ring-brand-sage"
                      : "border-transparent opacity-55 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    loading="lazy"
                    className="object-cover object-center"
                  />
                </button>
              ))}
            </div>

            <div className="relative w-full aspect-[3/4] bg-brand-bgsecondary overflow-hidden rounded-xl border border-brand-borderlight shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedColor?.value || "nocolor"}-${safeIndex}`}
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
                    priority
                    className="object-contain object-center p-2"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex md:hidden gap-3 mt-2 overflow-x-auto hide-scrollbar pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative w-[72px] aspect-[3/4] shrink-0 overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer ${
                    i === safeIndex
                      ? "border-brand-sage opacity-100"
                      : "border-transparent opacity-55 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-cover object-center"
                  />
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

              <div className="mb-6 flex items-center gap-3">
                <span className="font-body text-xl tracking-wide text-brand-ink">
                  ₹ {currentPrice.toLocaleString()}
                </span>

                {compareAtPrice && compareAtPrice > currentPrice && (
                  <>
                    <span className="font-body text-[15px] text-brand-gray line-through">
                      ₹ {compareAtPrice.toLocaleString()}
                    </span>
                    <span className="font-body text-[11px] font-medium tracking-wider uppercase bg-brand-rose/10 text-brand-rose px-2.5 py-1 rounded-sm border border-brand-rose/20">
                      {discountPercentage}% Off
                    </span>
                  </>
                )}
              </div>

              <div
                className="font-body text-brand-gray leading-[1.8] text-[15px] mb-10 [&>p]:mb-4 [&>strong]:font-medium [&>strong]:text-brand-ink"
                dangerouslySetInnerHTML={{
                  __html:
                    product.descriptionHtml ||
                    "<p>Limited edition embroidered clothes for everyday luxury.</p>",
                }}
              />

              {availableColors.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <p className="font-body text-[11px] tracking-widest uppercase text-brand-gray">
                      Colorway
                    </p>
                    <span className="font-body text-[11px] text-brand-ink/60">
                      — {selectedColor?.label}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {availableColors.map((color) => {
                      const isActive = selectedColor?.value === color.value;

                      const isGreenOrSage =
                        color.value.includes("sage") ||
                        color.value.includes("green");
                      const isPinkOrRose =
                        color.value.includes("rose") ||
                        color.value.includes("blush") ||
                        color.value.includes("pink");
                      const isBlueOrSky =
                        color.value.includes("sky") ||
                        color.value.includes("blue");

                      const brandBg = isGreenOrSage
                        ? "bg-brand-sage"
                        : isPinkOrRose
                          ? "bg-brand-rose"
                          : isBlueOrSky
                            ? "bg-brand-blue"
                            : "";

                      const brandRing = isGreenOrSage
                        ? "ring-brand-sage"
                        : isPinkOrRose
                          ? "ring-brand-rose"
                          : isBlueOrSky
                            ? "ring-brand-blue"
                            : "ring-brand-borderlight";

                      return (
                        <button
                          key={color.value}
                          onClick={() => handleColorSelect(color)}
                          aria-label={color.label}
                          title={color.label}
                          className={`w-9 h-9 rounded-full cursor-pointer transition-all duration-200 ${brandBg} ${
                            isActive
                              ? `ring-2 ring-offset-2 ring-offset-brand-bgprimary ${brandRing} scale-110`
                              : "opacity-50 hover:opacity-80 hover:scale-105"
                          }`}
                          style={
                            !brandBg ? { backgroundColor: color.value } : {}
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {availableSizes.length > 0 && (
                <div className="mb-10">
                  <div className="flex justify-between items-end mb-3">
                    <p className="font-body text-[11px] tracking-widest uppercase text-brand-gray">
                      Size
                    </p>
                    <button
                      onClick={() => setSizeChartOpen(true)}
                      className="flex items-center gap-1.5 text-[11px] text-brand-rose font-body cursor-pointer group"
                    >
                      <Ruler
                        size={12}
                        className="group-hover:rotate-12 transition-transform duration-200"
                      />
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {availableSizes.map((s) => (
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
              )}

              <div className="mb-10">
                <button
                  onClick={handleAddToCart}
                  disabled={cartState !== "idle"}
                  className="w-full h-14 bg-brand-rose text-brand-ivory rounded-full font-body text-[13px] uppercase hover:bg-opacity-90 transition-all flex items-center justify-center shadow-lg hover:scale-[1.02] cursor-pointer disabled:cursor-default"
                >
                  <AnimatePresence mode="wait">
                    {cartState === "idle" && (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        Add to Bag — ₹{Number(price).toLocaleString()}
                      </motion.span>
                    )}
                    {cartState === "adding" && (
                      <motion.div
                        key="adding"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
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
                      <motion.span
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
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
              
              {comboProduct && (
                <ComboOffer mainProduct={product} comboProduct={comboProduct} />
              )}
            </div>
          </div>
        </div>

       
              {/* ── Similar Products ──────────────────────────────────────────────── */}
{similarProducts.length > 0 && (
  <section className="py-24 w-full border-t border-brand-bgprimary">
    <h3 className="font-display text-4xl text-brand-ink mb-12 px-6 text-center">
      Complete the Look
    </h3>
    <div
      className="flex overflow-x-auto gap-4 md:gap-6 pb-8 snap-x snap-mandatory pl-6 pr-6 hide-scrollbar md:justify-center"
    >
      {similarProducts.map((item) => {
        const titleStr = item.node.title.toLowerCase();
        let productCardBadge =
          "bg-[rgba(201,125,125,0.12)] text-brand-rose border-[rgba(201,125,125,0.3)]";
        if (titleStr.includes("sage") || titleStr.includes("green")) {
          productCardBadge =
            "bg-[rgba(143,168,130,0.12)] text-brand-sage border-[rgba(143,168,130,0.3)]";
        } else if (titleStr.includes("sky") || titleStr.includes("blue")) {
          productCardBadge =
            "bg-[rgba(134,167,185,0.12)] text-brand-blue border-[rgba(134,167,185,0.3)]";
        }

        return (
          <Link
            href={`/product/${item.node.handle}`}
            key={item.node.id}
            className="flex-none w-[72vw] max-w-[280px] md:w-[240px] snap-center group text-left"
          >
            <div className="aspect-[3/4] bg-brand-bgprimary rounded-xl overflow-hidden mb-4 border border-brand-borderlight cursor-pointer relative shadow-[0_2px_12px_rgba(44,37,32,0.06)] group-hover:-translate-y-1 transition-all duration-300">
              <div
                className={`absolute top-3 right-3 z-10 border text-[11px] px-[8px] py-[2px] rounded-full font-body ${productCardBadge}`}
              >
                Limited
              </div>
              <Image
                src={
                  item.node.images.edges[0]?.node.url ||
                  "https://images.unsplash.com/photo-1596455607563-ad6193f76b17"
                }
                alt={item.node.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <h4 className="font-display text-lg text-brand-ink transition-colors">
              {item.node.title}
            </h4>
            <p className="font-body text-sm text-brand-gray mt-1">
              ₹{item.node.priceRange.minVariantPrice.amount}
            </p>
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