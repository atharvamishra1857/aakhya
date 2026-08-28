import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="pt-16 pb-8 border-t border-brand-borderlight/10 z-10 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* --- MAIN FOOTER GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Column - Updated */}
          <div className="space-y-6">
            {/* Replace the old text title with your Logo Image */}
            <div className="relative w-32 h-12">
              {" "}
              {/* Adjust width/height as needed */}
              <Image
                src="/logo.png"
                alt="aakhya Logo"
                fill
                className="object-contain object-left"
              />
            </div>

            {/* Replace the old paragraph with your new tagline */}
            <p className="text-brand-ivory/90 font-display italic text-lg leading-relaxed max-w-xs">
              Timeless Elegance in Every Thread.
            </p>
            <div className="flex items-center gap-5 mt-2">
              <Link
                href="https://instagram.com/aakhya.in"
                target="_blank"
                className="text-brand-ivory/70 hover:text-brand-rose transition-colors"
              >
                <Instagram size={20} strokeWidth={1} />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                className="text-brand-ivory/70 hover:text-brand-rose transition-colors"
              >
                <Facebook size={20} strokeWidth={1} />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="text-brand-ivory/70 hover:text-brand-rose transition-colors"
              >
                <Twitter size={20} strokeWidth={1} />
              </Link>
            </div>
          </div>

          {/* Column 2: The Collection */}
          <div>
            <h4 className="text-brand-gold text-sm font-bold tracking-widest uppercase mb-6">
              The Collection
            </h4>
            <ul className="flex flex-col gap-4 text-sm font-light text-brand-cream/80">
              <li>
                <Link
                  href="/collection"
                  className="hover:text-brand-gold transition-colors"
                >
                  Vasara
                </Link>
              </li>
              <li>
                <Link
                  href="/collection"
                  className="hover:text-brand-gold transition-colors"
                >
                  Calyx
                </Link>
              </li>
              <li>
                <Link
                  href="/collection"
                  className="hover:text-brand-gold transition-colors"
                >
                  Rubal - Necklace
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Services (Smart Routing!) */}
          <div>
            <h4 className="text-brand-gold text-sm font-bold tracking-widest uppercase mb-6">
              Client Services
            </h4>
            <ul className="flex flex-col gap-4 text-sm font-light text-brand-cream/80">
              <li>
                <Link
                  href="/support"
                  className="hover:text-brand-gold transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="hover:text-brand-gold transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="hover:text-brand-gold transition-colors"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-brand-gold text-sm font-bold tracking-widest uppercase mb-6">
              Contact
            </h4>
            <ul className="flex flex-col gap-6 text-sm font-light text-brand-cream/80">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-gold shrink-0 mt-0.5" />
                <span>DM us on Instagram at "@aakhya.in"</span>
              </li>

              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-gold shrink-0" />
                <span>support@aakhyaofficial.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* --- BOTTOM COPYRIGHT BAR --- */}
        <div className="border-t border-brand-cream/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-light text-brand-cream/50">
          <p>© {new Date().getFullYear()} aakhya. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-brand-gold transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-brand-gold transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
