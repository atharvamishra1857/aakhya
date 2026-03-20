"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, ChevronDown } from "lucide-react";
import Navbar from "@/components/navbar"; // Check your capitalization if it's 'navbar'

// --- FAQ DATA ---
const faqs = [
  {
    question: "How do I care for my Banarasi silk saree?",
    answer:
      "Pure silk must strictly be dry-cleaned. Never hand-wash or machine-wash your Vreya handlooms. Store them wrapped in a pure cotton cloth in a cool, dry place, and unfold them every few months to let the fabric breathe.",
  },
  {
    question: "What is your return and exchange policy?",
    answer:
      "We offer a 7-day return policy for unworn sarees in their original folding and packaging. Custom-stitched blouses and bridal pre-orders are non-refundable.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship our heritage pieces worldwide. International shipping typically takes 7-14 business days. Customs duties and taxes are calculated at checkout.",
  },
  {
    question: "How can I verify the authenticity of my silk?",
    answer:
      "Every Vreya Banarasi and Kanjivaram saree comes with a Silk Mark certification tag issued by the Government of India, guaranteeing 100% pure silk.",
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First FAQ open by default

  return (
    <div className="min-h-screen bg-brand-cream text-brand-maroon flex flex-col pt-24">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 lg:px-8 py-12 md:py-20">
        {/* --- PAGE HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Client Services
          </h1>
          <div className="w-12 h-1 bg-brand-gold mx-auto mb-6"></div>
          <p className="font-light text-brand-maroon/70">
            Whether you are seeking advice on silk care, tracking an order, or
            looking for bridal consultation, our concierge team is at your
            service.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* --- LEFT: CONTACT FORM & INFO --- */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-10"
          >
            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-white p-8 rounded-2xl shadow-sm border border-black/5">
              <div>
                <h3 className="font-bold uppercase tracking-widest text-xs text-brand-gold mb-4">
                  Email Us
                </h3>
                <div className="flex items-center gap-3 text-sm font-light">
                  <Mail size={16} className="text-brand-gold" />
                  <span>concierge@vreya.com</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold uppercase tracking-widest text-xs text-brand-gold mb-4">
                  Call Us
                </h3>
                <div className="flex items-center gap-3 text-sm font-light">
                  <Phone size={16} className="text-brand-gold" />
                  <span>+91 98765 43210</span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <h3 className="font-bold uppercase tracking-widest text-xs text-brand-gold mb-4">
                  Visit Our Boutique
                </h3>
                <div className="flex items-start gap-3 text-sm font-light">
                  <MapPin
                    size={16}
                    className="text-brand-gold shrink-0 mt-0.5"
                  />
                  <span>
                    124 Heritage Weavers Lane,
                    <br />
                    Varanasi, UP 221001, India
                  </span>
                </div>
              </div>
            </div>

            {/* The Form */}
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <h2 className="text-2xl font-serif font-bold">Send a Message</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full bg-transparent border-b border-brand-maroon/20 py-3 text-brand-maroon placeholder:text-brand-maroon/40 focus:outline-none focus:border-brand-gold transition-colors"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full bg-transparent border-b border-brand-maroon/20 py-3 text-brand-maroon placeholder:text-brand-maroon/40 focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-transparent border-b border-brand-maroon/20 py-3 text-brand-maroon placeholder:text-brand-maroon/40 focus:outline-none focus:border-brand-gold transition-colors"
              />
              <textarea
                placeholder="How can we help you?"
                rows={4}
                className="w-full bg-transparent border-b border-brand-maroon/20 py-3 text-brand-maroon placeholder:text-brand-maroon/40 focus:outline-none focus:border-brand-gold transition-colors resize-none"
              ></textarea>
              <button className="bg-brand-maroon text-brand-cream py-4 px-8 tracking-widest uppercase text-sm font-medium hover:bg-brand-gold transition-colors w-fit mt-2">
                Submit Request
              </button>
            </form>
          </motion.div>

          {/* --- RIGHT: FAQS ACCORDION --- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-2xl font-serif font-bold mb-8">
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col border-t border-brand-maroon/10">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-brand-maroon/10">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                  >
                    <span className="font-medium text-lg group-hover:text-brand-gold transition-colors pr-4">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-brand-gold shrink-0"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </button>

                  {/* Framer Motion AnimatePresence for smooth accordion opening/closing */}
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-brand-maroon/70 font-light leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

