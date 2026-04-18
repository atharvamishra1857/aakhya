import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, IM_Fell_English_SC } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cartcontext"; // Import Provider
import CartDrawer from "@/components/cartDrawer"; // Import Component
import Footer from "@/components/footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

const imFell = IM_Fell_English_SC({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-accent",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Vreya | Modern Occasion Wear",
  description: "Premium Modern Indian Womenswear",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ADDED suppressHydrationWarning to html and body to stop extension crashes globally
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${cormorant.variable} ${jost.variable} ${imFell.variable} font-body flex flex-col min-h-screen relative selection:bg-brand-burgundy selection:text-brand-cream overflow-x-hidden`}
      >
        <CartProvider>
          <main className="flex-grow flex flex-col relative z-10 w-full">
            {children}
          </main>

          <Footer />
          <CartDrawer />
        </CartProvider>

        {/* --- MOBILE FIX 1: Add Tailwind hidden class for mobile --- */}
        <div id="vreya-cursor-ring" className="hidden md:block"></div>
        <div id="vreya-cursor-dot" className="hidden md:block"></div>
      </body>
    </html>
  );
}
