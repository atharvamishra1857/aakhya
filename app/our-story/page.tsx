"use client";

import { useRef } from "react";
import Navbar from "@/components/navbar";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

// ─── REUSABLE CINEMATIC COMPONENTS ───────────────────────────────────────

function StaggeredText({ text, className = "", delay = 0 }: { text: string; className?: string, delay?: number }) {
  const words = text.split(" ");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08, delayChildren: delay },
        },
      }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20, rotate: 1 },
            visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px" }} 
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CinematicImage({ src, alt, aspectClass = "aspect-[3/4] md:aspect-[4/5]", speed = 1 }: { src: string, alt: string, aspectClass?: string, speed?: number }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${10 * speed}%`, `${10 * speed}%`]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);

  return (
    <div ref={containerRef} className={`w-full ${aspectClass} relative overflow-hidden rounded-xl bg-brand-borderlight/40 shadow-sm`}>
      <motion.div
        initial={{ clipPath: "inset(100% 0 0 0)" }} 
        whileInView={{ clipPath: "inset(0% 0 0 0)" }} 
        viewport={{ once: true, margin: "0px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full"
      >
        <motion.div style={{ y, scale }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-center"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────

export default function OurStory() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="bg-brand-bgprimary text-brand-ink flex flex-col min-h-screen selection:bg-brand-sage selection:text-brand-ivory">
      <Navbar />

      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-brand-sage origin-left z-50 opacity-80"
      />

      <main className="flex-grow pt-[100px] overflow-hidden">
        
        {/* --- Hero Section --- */}
        <section className="px-6 md:px-12 py-20 md:py-24 flex flex-col items-center justify-center text-center relative min-h-[60vh]">
          <FadeUp delay={0.1}>
            <p className="font-body text-[11px] tracking-[0.3em] text-brand-sage uppercase mb-6">
              — A Story Woven In Quiet Details
            </p>
          </FadeUp>
          
          <StaggeredText 
            text="Crafted slowly, worn forever." 
            className="font-display italic text-5xl md:text-7xl lg:text-8xl mb-6 max-w-4xl text-brand-ink leading-tight"
            delay={0.2}
          />
          
          <FadeUp delay={0.6}>
            <p className="font-body text-base md:text-lg text-brand-gray max-w-xl leading-relaxed mx-auto">
              Each piece you see here begins with a thought: what if clothing
              could feel like a memory? Not just something you wear, but something
              you carry.
            </p>
          </FadeUp>
        </section>

        {/* --- Flowing Editorial Section --- */}
        <section className="w-full bg-brand-bgsecondary border-y border-brand-borderlight z-10 px-6 md:px-12 py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto flex flex-col gap-24 md:gap-32">
            
            {/* Block 1: Text Left, Image Right */}
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 md:pr-12">
                <FadeUp>
                  <h2 className="font-display text-4xl md:text-5xl text-brand-ink leading-[1.1]">
                    Aakhya was never meant to be loud.
                  </h2>
                </FadeUp>
                <FadeUp delay={0.2}>
                  <p className="font-body text-brand-gray leading-[1.7] text-[15px] md:text-[16px]">
                    The delicate florals are not just embroidery — they are small,
                    intentional pauses. They remind us that not everything needs to be fast to be
                    meaningful. 
                  </p>
                </FadeUp>
              </div>
              <div className="w-full md:w-1/2">
                <CinematicImage 
                  src="/aakhya-collection1.jpeg" 
                  alt="Story image 1" 
                  aspectClass="aspect-[4/3]"
                  speed={0.8}
                />
              </div>
            </div>

            {/* Block 2: Image Left, Text Right */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-16">
              <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 md:pl-12">
                <FadeUp>
                  <h2 className="font-display text-4xl md:text-5xl text-brand-ink leading-[1.1]">
                    Imperfect in the most beautiful way.
                  </h2>
                </FadeUp>
                <FadeUp delay={0.2}>
                  <p className="font-body text-brand-gray leading-[1.7] text-[15px] md:text-[16px]">
                    Every detail is hand-done and carefully considered. We embrace the 
                    slight variations that come with human touch, making every single garment 
                    entirely unique to the person wearing it.
                  </p>
                </FadeUp>
              </div>
              <div className="w-full md:w-1/2">
                <CinematicImage 
                  src="/aakhya-5.png" 
                  alt="Story image 2" 
                  aspectClass="aspect-[3/4]"
                  speed={1.1}
                />
              </div>
            </div>

            {/* Block 3: Text Left, Image Right */}
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 md:pr-12">
                <FadeUp>
                  <h2 className="font-display text-4xl md:text-5xl text-brand-ink leading-[1.1]">
                    Designed to move with you.
                  </h2>
                </FadeUp>
                <FadeUp delay={0.2}>
                  <p className="font-body text-brand-gray leading-[1.7] text-[15px] md:text-[16px]">
                    The tie-ups, the textures, the muted tones — they are
                    all designed to complement your life, not overpower it. Pieces that 
                    feel as light and grounded as the moments you wear them in.
                  </p>
                </FadeUp>
              </div>
              <div className="w-full md:w-1/2">
                <CinematicImage 
                  src="/Collection-top.png" 
                  alt="Story image 3" 
                  aspectClass="aspect-[4/5]"
                  speed={0.9}
                />
              </div>
            </div>

          </div>
        </section>

        {/* --- Massive Full-Width Parallax Break --- */}
        {/* <section className="w-full h-[40vh] md:h-[65vh] relative overflow-hidden">
          <CinematicImage 
            src="/YOUR_IMAGE_4_FULL_WIDTH.jpg" 
            alt="Full width story break" 
            aspectClass="h-full w-full rounded-none"
            speed={1.2}
          />
          <div className="absolute inset-0 bg-brand-ink/10" />
        </section> */}

        {/* --- Block 3: The Final Statement --- */}
        <section className="w-full py-20 md:py-32 bg-brand-bgprimary text-center px-6 relative">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            <StaggeredText 
              text="For the version of you that exists beyond trends."
              className="font-display italic text-3xl md:text-5xl text-brand-ink mb-8 leading-tight"
            />
            
            <FadeUp delay={0.3}>
              <p className="font-body text-brand-gray max-w-xl leading-relaxed text-[15px] md:text-[16px] mb-8 mx-auto">
                For moments when you want comfort, without losing elegance. You can
                wear it to the sea, to a quiet café, to a gathering, or simply at
                home — and it will belong, just as you do. Because aakhya isn’t
                about dressing up. It’s about coming closer to yourself.
              </p>
              <p className="font-display italic text-2xl text-brand-sage">— Aakhya</p>
            </FadeUp>
          </div>
        </section>
        
      </main>
    </div>
  );
}