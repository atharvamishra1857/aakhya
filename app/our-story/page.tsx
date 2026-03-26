"use client";

import Navbar from "@/components/navbar";
import Image from "next/image";

export default function OurStory() {
  return (
    <div className="bg-brand-bgsecondary text-brand-ink flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-[100px]">
        {/* --- Hero Section --- */}
        <section className="px-6 md:px-16 py-24 md:py-32 flex flex-col items-center justify-center text-center">
          <p className="font-body text-xs tracking-[0.3em] text-brand-sage uppercase mb-6">— Our Story</p>
          <h1 className="font-display italic text-5xl md:text-7xl mb-8 max-w-4xl text-brand-ink">
            Crafted slowly, worn forever.
          </h1>
          <p className="font-body text-base md:text-lg text-brand-gray max-w-2xl leading-relaxed">
            Every thread woven into a Vreya piece holds a history of Indian craftsmanship. We believe in quiet luxury, intentional drops, and timeless elegance.
          </p>
        </section>

        {/* --- Block 1 --- */}
        <section className="w-full flex flex-col md:flex-row items-center bg-brand-bgprimary">
          <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center space-y-6">
            <h2 className="font-display text-4xl text-brand-ink">Born in the Ateliers</h2>
            <p className="font-body text-brand-gray leading-[1.8] text-[15px]">
              Before Vreya was a brand, it was a vision. The quiet hum of our ateliers echoing through the sunlit lanes of Lucknow and Jaipur. Our artisans didn't just embroider; they stitched stories of modern elegance and timeless devotion into every piece.
            </p>
          </div>
          <div className="w-full md:w-1/2 h-[50vh] md:h-[80vh] relative">
             <Image src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1920" alt="Fabric flatlay" width={800} height={1200} className="w-full h-full object-cover" />
          </div>
        </section>

        {/* --- Block 2 --- */}
        <section className="w-full flex flex-col md:flex-row-reverse items-center bg-brand-bgsecondary">
          <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center space-y-6">
            <h2 className="font-display text-4xl text-brand-ink">The Art of Patience</h2>
            <p className="font-body text-brand-gray leading-[1.8] text-[15px]">
              True luxury cannot be rushed. A single piece takes three master artisans over 200 hours to complete. From sketching the silhouettes to the meticulous hand embroidery of zardozi and chikankari, our process defies modern fast fashion.
            </p>
          </div>
          <div className="w-full md:w-1/2 h-[50vh] md:h-[80vh] relative">
             <Image src="https://images.unsplash.com/photo-1556909211-3698d532d7dc?q=80&w=1920" alt="Designer at work" width={800} height={1200} className="w-full h-full object-cover" />
          </div>
        </section>

        {/* --- Block 3 --- */}
        <section className="w-full py-24 md:py-32 bg-brand-bgprimary text-center px-6">
           <h2 className="font-display italic text-4xl md:text-5xl text-brand-ink mb-6">Carry It Forward</h2>
           <p className="font-body text-brand-gray max-w-2xl leading-relaxed text-[15px] mb-16 mx-auto">
             Today, Vreya bridges the gap between heritage craft and the modern connoisseur. We celebrate the intricate arts of hand embroidery so that when you wear our pieces, you aren't just wearing a garment—you are carrying history forward.
           </p>
           <div className="w-full h-[60vh] md:h-[80vh] relative max-w-6xl mx-auto overflow-hidden rounded-2xl">
             <Image src="https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?q=80&w=1920" alt="Legacy craft" width={1200} height={800} className="w-full h-full object-cover" />
           </div>
        </section>
      </main>
    </div>
  );
}
