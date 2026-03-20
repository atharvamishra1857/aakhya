import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cartcontext"; // Import Provider
import CartDrawer from "@/components/cartDrawer"; // Import Component
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const brandFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"], // Playfair looks great slightly bold!
  variable: "--font-brand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vreya | Handloom Legacy",
  description: "Authentic Indian Handloom Sarees",
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
        className={`${inter.variable} ${brandFont.variable} font-sans flex flex-col min-h-screen`}
      >
        <CartProvider>
          <main className="flex-grow flex flex-col relative z-10 w-full">
            {children}
          </main>

          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
