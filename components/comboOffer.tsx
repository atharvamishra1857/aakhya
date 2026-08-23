"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useCart } from "@/context/cartcontext";
import { motion } from "framer-motion";

export default function ComboOffer({ mainProduct, comboProduct }: { mainProduct: any, comboProduct: any }) {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const mainVariant = mainProduct?.variants?.edges[0]?.node;
  const comboVariant = comboProduct?.variants?.edges[0]?.node;

  // Safety check
  if (!mainVariant || !comboVariant) return null;

  const mainPrice = Number(mainVariant.price.amount);
  const comboPrice = Number(comboVariant.price.amount);
  
  const subtotal = mainPrice + comboPrice;
  const bundleDiscount = subtotal * 0.10; // 10% off
  
  // Math.round fixes the ugly decimal issue!
  const finalPrice = Math.round(subtotal - bundleDiscount); 

  const handleAddBundle = async () => {
    setIsAdding(true);
    try {
      await addToCart({
        id: mainVariant.id,
        title: mainProduct.title,
        price: mainPrice,
        image: mainProduct.images.edges[0]?.node.url,
        handle: mainProduct.handle,
        variantTitle: mainVariant.title,
        selectedOptions: mainVariant.selectedOptions,
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      await addToCart({
        id: comboVariant.id,
        title: comboProduct.title,
        price: comboPrice,
        image: comboProduct.images.edges[0]?.node.url,
        handle: comboProduct.handle,
        variantTitle: comboVariant.title,
        selectedOptions: comboVariant.selectedOptions,
      });
    } catch (error) {
      console.error("Failed to add bundle to cart", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      className="mt-10 border border-brand-sage/30 bg-brand-sage/5 rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Luxury Corner Ribbon */}
      <div className="absolute top-0 right-0 bg-brand-sage text-brand-ivory text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-bl-xl font-medium shadow-sm">
        Save 10%
      </div>

      <h3 className="font-display text-2xl text-brand-ink mb-5">A Perfect Match</h3>
      
      <div className="flex items-center gap-4 mb-6">
        {/* Item 1 */}
        <div className="relative w-16 aspect-[3/4] rounded-lg overflow-hidden border border-brand-borderlight shadow-sm">
          <Image src={mainProduct.images.edges[0]?.node.url} alt="Main Item" fill className="object-cover" />
        </div>
        
        <Plus size={16} className="text-brand-sage shrink-0" />
        
        {/* Item 2 */}
        <div className="relative w-16 aspect-[3/4] rounded-lg overflow-hidden border border-brand-borderlight shadow-sm">
          <Image src={comboProduct.images.edges[0]?.node.url} alt="Paired Item" fill className="object-cover" />
        </div>
        
        {/* Pricing */}
        <div className="ml-auto text-right">
          <p className="font-body text-[13px] text-brand-gray line-through mb-0.5">₹{subtotal.toLocaleString()}</p>
          <p className="font-body text-xl text-brand-ink font-medium">₹{finalPrice.toLocaleString()}</p>
        </div>
      </div>

      <button
        onClick={handleAddBundle}
        disabled={isAdding}
        className="w-full h-12 bg-brand-ink text-brand-ivory rounded-full font-body text-[12px] uppercase tracking-wider hover:bg-brand-sage transition-all flex items-center justify-center shadow-lg disabled:opacity-70 hover:scale-[1.02]"
      >
        {isAdding ? "Adding to Bag..." : "Add Both To Bag"}
      </button>
    </motion.div>
  );
}