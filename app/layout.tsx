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
        <div id="vreya-cursor-ring"></div>
        <div id="vreya-cursor-dot"></div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  const ring = document.getElementById('vreya-cursor-ring');
  const dot  = document.getElementById('vreya-cursor-dot');
  
  if (!ring || !dot) return;
  
  let mouseX = 0, mouseY = 0;
  
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    ring.style.transform = 'translate(' + (mouseX - 15) + 'px, ' + (mouseY - 15) + 'px)';
    dot.style.transform  = 'translate(' + (mouseX - 2.5) + 'px, ' + (mouseY - 2.5) + 'px)';
    ring.style.opacity = '1';
    dot.style.opacity  = '1';
  });
  
  document.addEventListener('mouseleave', function() {
    ring.style.opacity = '0';
    dot.style.opacity  = '0';
  });
  
  document.addEventListener('mouseenter', function() {
    ring.style.opacity = '1';
    dot.style.opacity  = '1';
  });
  
  // Scale on interactive elements
  document.addEventListener('mouseover', function(e) {
    if (e.target.closest('a, button, [data-hover]')) {
      ring.style.width  = '52px';
      ring.style.height = '52px';
    } else {
      ring.style.width  = '30px';
      ring.style.height = '30px';
    }
  });
})();
`
          }}
        />
      </body>
    </html>
  );
}
