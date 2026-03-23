"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, ChevronDown } from "lucide-react";
import Navbar from "@/components/navbar";

const faqs = [
  {
    question: "How do I care for my Embroidered Linen Vest?",
    answer:
      "Our pieces must strictly be dry-cleaned. Never hand-wash or machine-wash your Vreya garments. Store them wrapped in a pure cotton cloth in a cool, dry place, and unfold them every few months to let the fabric breathe.",
  },
  {
    question: "What is your return and exchange policy?",
    answer:
      "We offer a 7-day return policy for unworn pieces in their original folding and packaging. Custom-stitched items and limited edition drops are non-refundable unless defective.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship our handcrafted pieces worldwide. International shipping typically takes 7-14 business days. Customs duties and taxes are calculated at checkout.",
  },
  {
    question: "How can I verify the authenticity of my linen vest?",
    answer:
      "Every Vreya Hand Embroidered garment comes with an Atelier Authenticity Mark guaranteeing 100% artisanal craft and linen source.",
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-brand-bgprimary text-brand-ink flex flex-col pt-24 font-body">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 lg:px-8 py-12 md:py-20">
        {/* --- PAGE HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display italic font-medium mb-4">
            Client Services
          </h1>
          <p className="font-light text-brand-gray mt-6">
            Whether you are seeking advice on linen care, tracking an order, or
            looking for styling consultation, our concierge team is at your
            service.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mt-16">
          {/* --- LEFT: CONTACT FORM --- */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-10"
          >
            {/* The Form */}
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <h2 className="text-2xl font-display mb-2">Send a Message</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full bg-brand-bgsecondary border-b border-brand-borderlight py-4 px-3 text-brand-ink placeholder:text-brand-gray/60 focus:outline-none focus:border-brand-rose transition-colors text-sm"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full bg-brand-bgsecondary border-b border-brand-borderlight py-4 px-3 text-brand-ink placeholder:text-brand-gray/60 focus:outline-none focus:border-brand-rose transition-colors text-sm"
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-brand-bgsecondary border-b border-brand-borderlight py-4 px-3 text-brand-ink placeholder:text-brand-gray/60 focus:outline-none focus:border-brand-rose transition-colors text-sm"
              />
              <textarea
                placeholder="How can we help you?"
                rows={4}
                className="w-full bg-brand-bgsecondary border-b border-brand-borderlight py-4 px-3 text-brand-ink placeholder:text-brand-gray/60 focus:outline-none focus:border-brand-rose transition-colors resize-none text-sm"
              ></textarea>
              <button className="bg-brand-rose text-brand-ivory py-4 px-8 tracking-widest uppercase text-xs hover:bg-opacity-90 transition-colors w-fit mt-4 rounded-full">
                Submit Request
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="font-body uppercase tracking-widest text-[11px] text-brand-sage mb-4 underline">
                  Email Us
                </h3>
                <div className="flex items-center gap-3 text-sm font-light text-brand-ink">
                  <Mail size={16} className="text-brand-sage" />
                  <span>concierge@vreya.com</span>
                </div>
              </div>
              <div>
                 <h3 className="font-body uppercase tracking-widest text-[11px] text-brand-sage mb-4 underline">
                   Visit Our Studio
                 </h3>
                 <div className="flex items-start gap-3 text-sm font-light text-brand-ink">
                   <MapPin size={16} className="text-brand-sage shrink-0 mt-0.5" />
                   <span>Pune, Maharashtra 411013, India</span>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* --- RIGHT: FAQS ACCORDION --- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-2xl font-display mb-8">
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col border-t border-brand-borderlight">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-brand-borderlight">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                  >
                    <span className="font-body text-[15px] group-hover:text-brand-rose transition-colors pr-4">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-brand-sage shrink-0"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: "auto", opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         transition={{ duration: 0.3, ease: "easeInOut" }}
                         className="overflow-hidden"
                      >
                         <p className="pb-6 text-brand-gray text-sm font-light leading-relaxed">
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
