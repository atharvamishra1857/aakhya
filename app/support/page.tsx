"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, ChevronDown } from "lucide-react";
import Navbar from "@/components/navbar";

const faqs = [
  {
    question: "How do I care for my Embroidered Linen Vest?",
    answer:
      "Our pieces must strictly be dry-cleaned. Never hand-wash or machine-wash your aakhya garments. Store them wrapped in a pure cotton cloth in a cool, dry place, and unfold them every few months to let the fabric breathe.",
  },
  {
    question: "What is your return and exchange policy?",
    answer:
      "We offer a 7-day return policy on the damaged products only that might have been damaged either in the shipping or by us. Because we are a new brand we will be needing an unboxing video to confirm the same. Hope you'll understand and give us the leverage.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "No, we don't ship internationally as of now. But if you keep giving us the love we might start soon.",
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [result, setResult] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted");

    // 1. Grab the form element to use later for resetting
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    formData.append("access_key", "1f4a3be1-0e35-4a82-8e27-5acb21a6a9ab");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Success!");
      form.reset();
      setTimeout(() => setResult(""), 3000);
    } else {
      setResult("Error");
    }
  };

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
            <form className="flex flex-col gap-6" onSubmit={onSubmit}>
              <input
                type="hidden"
                name="subject"
                value="New message from Aakhya support form"
              />
              <input type="hidden" name="from_name" value="Aakhya Support" />
              <h2 className="text-2xl font-display mb-2">Send a Message</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <input
                  type="text"
                  name="first_name" // Added name attribute
                  placeholder="First Name"
                  className="w-full bg-brand-bgsecondary border-b border-brand-borderlight py-4 px-3 text-brand-ink placeholder:text-brand-gray/60 focus:outline-none focus:border-brand-rose transition-colors text-sm"
                />
                <input
                  type="text"
                  name="last_name" // Added name attribute
                  placeholder="Last Name"
                  className="w-full bg-brand-bgsecondary border-b border-brand-borderlight py-4 px-3 text-brand-ink placeholder:text-brand-gray/60 focus:outline-none focus:border-brand-rose transition-colors text-sm"
                />
              </div>
              <input
                type="email"
                name="email" // Added name attribute
                required // Added required validation
                placeholder="Email Address"
                className="w-full bg-brand-bgsecondary border-b border-brand-borderlight py-4 px-3 text-brand-ink placeholder:text-brand-gray/60 focus:outline-none focus:border-brand-rose transition-colors text-sm"
              />
              <textarea
                name="message" // Added name attribute
                required // Added required validation
                placeholder="How can we help you?"
                rows={4}
                className="w-full bg-brand-bgsecondary border-b border-brand-borderlight py-4 px-3 text-brand-ink placeholder:text-brand-gray/60 focus:outline-none focus:border-brand-rose transition-colors resize-none text-sm"
              ></textarea>
              <button
                type="submit"
                className="bg-brand-rose text-brand-ivory py-4 px-8 tracking-widest uppercase text-xs hover:bg-opacity-90 transition-colors w-fit mt-4 rounded-full"
              >
                Submit Request
              </button>

              {/* Optional: Show the result message to the user */}
              {result && <p className="text-sm mt-2">{result}</p>}
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="font-body uppercase tracking-widest text-[11px] text-brand-sage mb-4 underline">
                  Email Us
                </h3>
                <div className="flex items-center gap-3 text-sm font-light text-brand-ink">
                  <Mail size={16} className="text-brand-sage" />
                  <span>support@aakhyaofficial.com</span>
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
