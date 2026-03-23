"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, User, Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/cartcontext";
import { usePathname } from "next/navigation";

// Reusable Navigation Link Component to enforce consistent UI states
const NavLink = ({ 
  href, 
  children, 
  isActive, 
  textColorClass, 
  isScrolled 
}: { 
  href: string; 
  children: React.ReactNode; 
  isActive: boolean; 
  textColorClass: string; 
  isScrolled: boolean; 
}) => {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center justify-center text-[12px] font-body tracking-[0.16em] uppercase transition-colors duration-500 hover:text-brand-gold ${textColorClass} ${isScrolled ? "text-brand-ink" : ""} py-1`}
    >
      {children}
      <span
        className={`absolute bottom-0 left-0 w-full h-[1px] bg-brand-gold origin-left transition-transform duration-300 ${
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  );
};

export default function Navbar({ isHome = false }: { isHome?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const { openCart, cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setIsPastHero(window.scrollY > window.innerHeight - 80);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen || isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSearchOpen, isMobileMenuOpen]);

  // dynamic backgrounds matching spec
  const navBackground = isScrolled
    ? "bg-[rgba(250,248,244,0.96)] backdrop-blur-[12px] shadow-sm"
    : "bg-transparent";

  // Text colors flip when scrolling past hero image
  const textColorClass =
    isHome && !isPastHero && !isScrolled ? "text-brand-white" : "text-brand-ink";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] px-6 md:px-12 flex items-center justify-between transition-all duration-500 ${navBackground} ${
          isScrolled ? "py-4" : "py-8"
        }`}
      >
        {/* --- LEFT: LOGO --- */}
        <div className="flex items-center gap-2 z-[110]">
          <Link href="/" className="group relative block">
            <span
              className={`text-2xl font-display uppercase tracking-[0.1em] block transition-colors duration-500 scale-y-110 font-medium ${
                isMobileMenuOpen ? "text-brand-cream" : textColorClass
              } ${isScrolled && !isMobileMenuOpen ? "text-brand-ink" : ""}`}
            >
              VREY<span className="small-caps">A</span>
            </span>
          </Link>
        </div>

        {/* --- CENTER: LINKS (Desktop) --- */}
        <div className="hidden md:flex items-center gap-12 z-[110]">
          {[
            { name: "Home", href: "/" },
            { name: "Collection", href: "/collection" },
            { name: "Our Story", href: "/our-story" },
            { name: "Support", href: "/support" }
          ].map((item) => (
            <NavLink
              key={item.name}
              href={item.href}
              isActive={pathname === item.href}
              textColorClass={textColorClass}
              isScrolled={isScrolled}
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* --- RIGHT: ICONS --- */}
        <div className="flex items-center gap-6 md:gap-8 z-[110]">
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search"
            className={`hidden sm:flex transition-colors duration-500 hover:text-brand-gold items-center justify-center min-w-[44px] min-h-[44px] ${textColorClass} ${isScrolled ? "text-brand-ink" : ""}`}
          >
            <Search size={22} strokeWidth={1} />
          </button>
          <Link
            href="/account"
            aria-label="User account"
            className={`hidden sm:flex transition-colors duration-500 hover:text-brand-gold items-center justify-center min-w-[44px] min-h-[44px] ${textColorClass} ${isScrolled ? "text-brand-ink" : ""}`}
          >
            <User size={22} strokeWidth={1} />
          </Link>
          <button
            aria-label="Open cart"
            className={`relative flex items-center justify-center transition-colors duration-500 hover:text-brand-gold min-w-[44px] min-h-[44px] ${
              isMobileMenuOpen ? "text-brand-cream" : textColorClass
            } ${isScrolled && !isMobileMenuOpen ? "text-brand-ink" : ""}`}
            onClick={openCart}
          >
            <ShoppingBag size={22} strokeWidth={1} />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={cartCount}
                className="absolute top-[8px] right-[4px] bg-brand-rouge text-brand-white text-[10px] font-body font-medium h-[16px] w-[16px] rounded-full flex items-center justify-center pointer-events-none"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
          <button
            aria-label="Toggle mobile menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden flex items-center justify-center transition-colors duration-500 min-w-[44px] min-h-[44px] hover:text-brand-gold ${
              isMobileMenuOpen ? "text-brand-cream" : textColorClass
            } ${isScrolled && !isMobileMenuOpen ? "text-brand-ink" : ""}`}
          >
            {isMobileMenuOpen ? (
              <X size={26} strokeWidth={1} />
            ) : (
              <Menu size={26} strokeWidth={1} />
            )}
          </button>
        </div>
      </nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-[90] bg-brand-ink flex flex-col pt-32 px-8"
          >
            <div className="flex flex-col gap-8 flex-grow justify-center -translate-y-8">
              {[
                { name: "Home", href: "/" },
                { name: "Collection", href: "/collection" },
                { name: "Our Story", href: "/our-story" },
                { name: "Support", href: "/support" }
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[48px] font-display text-brand-cream hover:text-brand-gold transition-colors block leading-[1.1]"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto pb-12 flex flex-col gap-6">
              <div className="w-full h-px bg-brand-cream/10 mb-2"></div>
              <div className="flex gap-12">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="flex items-center gap-3 text-brand-cream hover:text-brand-gold font-body"
                  style={{ minHeight: "44px" }}
                >
                  <Search size={22} strokeWidth={1} />
                  <span className="uppercase tracking-[0.2em] text-xs">Search</span>
                </button>
                <Link
                  href="/account"
                  className="flex items-center gap-3 text-brand-cream hover:text-brand-gold font-body"
                  style={{ minHeight: "44px" }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={22} strokeWidth={1} />
                  <span className="uppercase tracking-[0.2em] text-xs">Account</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SEARCH OVERLAY --- */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[200] bg-[rgba(253,250,245,0.96)] flex flex-col items-center justify-center px-6"
          >
            <button
              onClick={() => setIsSearchOpen(false)}
              aria-label="Close search"
              className="absolute top-8 right-6 md:top-10 md:right-12 text-brand-ink hover:text-brand-gold transition-colors flex items-center justify-center"
              style={{ minWidth: "44px", minHeight: "44px" }}
            >
              <X size={32} strokeWidth={1} />
            </button>
            <div className="w-full max-w-3xl flex flex-col gap-10">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <input
                  type="text"
                  autoFocus
                  placeholder="What are you looking for?"
                  className="w-full bg-transparent border-b border-brand-ink/20 py-4 text-3xl md:text-5xl font-display italic text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:border-brand-gold transition-colors"
                />
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-6"
              >
                <span className="text-[11px] font-body tracking-[0.2em] uppercase text-brand-gold/80">
                  Popular Searches
                </span>
                <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                  {["Hand Embroidered", "Bridal Edit", "Occasion Wear", "Co-ords & Sets"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setIsSearchOpen(false)}
                      className="text-brand-ink/70 hover:text-brand-ink transition-colors font-body text-sm md:text-base border-b border-transparent hover:border-brand-gold pb-1 min-h-[44px] tracking-wide"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
