"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/navbar";
import Image from "next/image";

const CHAPTERS = [
  {
    id: 1,
    subtitle: "CHAPTER I : THE GENESIS",
    title: "Born in the Ghats",
    text: "Before Vreya was a brand, it was a rhythm. The clacking of wooden looms echoing through the narrow, sunlit lanes of Varanasi. Our ancestors didn't just weave silk; they wove stories of royalty, prayers, and timeless devotion into every six yards of fabric.",
    // REAL STOCK IMAGE of Varanasi/River
    image:
      "https://images.unsplash.com/photo-1605000520633-e98cc8b4b7c0?q=80&w=2000",
  },
  {
    id: 2,
    subtitle: "CHAPTER II : THE CRAFT",
    title: "The Art of Patience",
    text: "True luxury cannot be rushed. A single authentic Banarasi saree takes three master artisans over 150 hours to complete. From dyeing the raw silk in rich, earthly tones to the meticulous threading of pure gold Zari, our process defies modern fast fashion.",
    // REAL STOCK IMAGE of Golden Silk/Weaving
    image:
      "https://images.unsplash.com/photo-1605000520633-e98cc8b4b7c0?q=80&w=2000",
  },
  {
    id: 3,
    subtitle: "CHAPTER III : THE LEGACY",
    title: "Weave Your Own",
    text: "Today, Vreya bridges the gap between ancient royal courts and the modern connoisseur. We preserve the dying arts of handloom weaving so that when you wear our silk, you aren't just wearing a garment—you are carrying history forward.",
    // REAL STOCK IMAGE of Silk Fabric
    image:
      "https://images.unsplash.com/photo-1605000520633-e98cc8b4b7c0?q=80&w=2000",
  },
];

export default function OurStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --- 1. BACKGROUND CROSSFADES ---
  const bg1 = useTransform(scrollYProgress, [0, 0.28, 0.33], [1, 1, 0]);
  const bg2 = useTransform(
    scrollYProgress,
    [0.28, 0.33, 0.61, 0.66],
    [0, 1, 1, 0],
  );
  const bg3 = useTransform(scrollYProgress, [0.61, 0.66, 1], [0, 1, 1]);
  const bgs = [bg1, bg2, bg3];

  // --- 2. HEADINGS TIMELINE (Fades out FASTER) ---
  const h1O = useTransform(
    scrollYProgress,
    [0.0, 0.05, 0.1, 0.13],
    [0, 1, 1, 0],
  );
  const h2O = useTransform(
    scrollYProgress,
    [0.33, 0.36, 0.42, 0.45],
    [0, 1, 1, 0],
  );
  const h3O = useTransform(
    scrollYProgress,
    [0.66, 0.69, 0.75, 0.78],
    [0, 1, 1, 0],
  );

  const h1Y = useTransform(scrollYProgress, [0.0, 0.13], [30, -30]);
  const h2Y = useTransform(scrollYProgress, [0.33, 0.45], [30, -30]);
  const h3Y = useTransform(scrollYProgress, [0.66, 0.78], [30, -30]);

  const headingsOpacity = [h1O, h2O, h3O];
  const headingsY = [h1Y, h2Y, h3Y];

  // --- 3. STORY TEXT TIMELINE (Fades in LATER) ---
  // Notice the gap! Heading 1 dies at 0.13. Text 1 doesn't start until 0.16. Total silence in between.
  const p1O = useTransform(
    scrollYProgress,
    [0.16, 0.19, 0.26, 0.3],
    [0, 1, 1, 0],
  );
  const p2O = useTransform(
    scrollYProgress,
    [0.48, 0.51, 0.58, 0.62],
    [0, 1, 1, 0],
  );
  const p3O = useTransform(
    scrollYProgress,
    [0.81, 0.84, 0.95, 1.0],
    [0, 1, 1, 0],
  );

  const p1Y = useTransform(scrollYProgress, [0.16, 0.3], [30, -30]);
  const p2Y = useTransform(scrollYProgress, [0.48, 0.62], [30, -30]);
  const p3Y = useTransform(scrollYProgress, [0.81, 1.0], [30, -30]);

  const textsOpacity = [p1O, p2O, p3O];
  const textsY = [p1Y, p2Y, p3Y];

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="relative h-[600vh] bg-black">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          {/* Backgrounds */}
          {CHAPTERS.map((chapter, i) => (
            <motion.div
              key={`bg-${chapter.id}`}
              style={{ opacity: bgs[i] }}
              className="absolute inset-0"
            >
              <Image
                src={chapter.image}
                alt={chapter.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </motion.div>
          ))}

          {/* Content */}
          {CHAPTERS.map((chapter, i) => (
            <div
              key={`content-${chapter.id}`}
              className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center px-4 sm:px-6"
            >
              <motion.div
                style={{ opacity: headingsOpacity[i], y: headingsY[i] }}
                className="absolute text-center will-change-transform"
              >
                <h3 className="text-brand-gold text-sm md:text-base font-bold tracking-[0.4em] uppercase mb-4 drop-shadow-lg">
                  {chapter.subtitle}
                </h3>
                <h2 className="text-6xl md:text-8xl font-serif font-bold text-white leading-tight drop-shadow-2xl">
                  {chapter.title}
                </h2>
              </motion.div>

              <motion.div
                style={{ opacity: textsOpacity[i], y: textsY[i] }}
                className="absolute max-w-2xl bg-black/40 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl text-center will-change-transform"
              >
                <p className="text-lg md:text-2xl text-gray-100 leading-relaxed font-light">
                  {chapter.text}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
