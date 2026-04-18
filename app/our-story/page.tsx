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
          <p className="font-body text-xs tracking-[0.3em] text-brand-sage uppercase mb-6">
            — A Story Woven In Quiet Details
          </p>
          <h1 className="font-display italic text-5xl md:text-7xl mb-8 max-w-4xl text-brand-ink">
            Crafted slowly, worn forever.
          </h1>
          <p className="font-body text-base md:text-lg text-brand-gray max-w-2xl leading-relaxed">
            Each piece you see here begins with a thought: what if clothing
            could feel like a memory? Not just something you wear, but something
            you carry.
          </p>
        </section>

        {/* --- Block 1 --- */}
        <section className="w-full flex flex-col md:flex-row items-center bg-brand-bgprimary">
          <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center space-y-6">
            <h2 className="font-display text-4xl text-brand-ink">
              Vreya was never meant to be loud.
            </h2>
            <p className="font-body text-brand-gray leading-[1.8] text-[15px]">
              The delicate florals are not just embroidery — they are small,
              intentional pauses. Hand-done, imperfect in the most beautiful
              way, they remind us that not everything needs to be fast to be
              meaningful. The tie-ups, the textures, the muted tones — they are
              all designed to move with you, not overpower you.
            </p>
          </div>
          <div className="w-full md:w-1/2 h-[50vh] md:h-[80vh] relative">
            <Image
              src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1920"
              alt="Fabric flatlay"
              width={800}
              height={1200}
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* --- Block 2 --- */}
        <section className="w-full flex flex-col md:flex-row-reverse items-center bg-brand-bgsecondary">
          <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center space-y-6">
            <h2 className="font-display text-4xl text-brand-ink">
              Vreya is for days when you want to feel light, but grounded.
            </h2>
            <p className="font-body text-brand-gray leading-[1.8] text-[15px]">
              It was born in the in-between moments — soft mornings, unhurried
              afternoons, the feeling of sunlight resting gently on your skin.
              It is for the woman who doesn’t need to announce herself, yet is
              always noticed.
            </p>
          </div>
          <div className="w-full md:w-1/2 h-[50vh] md:h-[80vh] relative">
            <Image
              src="https://images.unsplash.com/photo-1556909211-3698d532d7dc?q=80&w=1920"
              alt="Designer at work"
              width={800}
              height={1200}
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* --- Block 3 --- */}
        <section className="w-full py-24 md:py-32 bg-brand-bgprimary text-center px-6">
          <h2 className="font-display italic text-4xl md:text-5xl text-brand-ink mb-6">
            For the version of you that exists beyond trends.
          </h2>
          <p className="font-body text-brand-gray max-w-2xl leading-relaxed text-[15px] mb-16 mx-auto">
            For moments when you want comfort, without losing elegance. 
            You can wear it to the sea, to a quiet café, to a gathering, or simply at
            home — and it will belong, just as you do.
            Because Vreya isn’t about dressing up. It’s about coming closer to yourself. <br />
            — Vreya
          </p>
          <div className="w-full h-[60vh] md:h-[80vh] relative max-w-6xl mx-auto overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?q=80&w=1920"
              alt="Legacy craft"
              width={1200}
              height={800}
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
