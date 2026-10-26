"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, Mail } from "lucide-react";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "what-is-laphing",
    category: "Product & Taste",
    question: "What exactly is Laphing?",
    answer: "Laphing is a beloved Himalayan street food delicacy made of soft, chewy cold mung bean / wheat starch jelly sheets rolled or sliced and tossed in an intensely flavorful, fiery chili garlic oil, soy sauce, and aromatic spices. We created de Laphing co. to bring this authentic street-style experience straight to your kitchen in ready-to-eat convenience.",
  },
  {
    id: "how-to-prepare",
    category: "Preparation",
    question: "How long does it take to prepare at home?",
    answer: "Only 7 minutes! The pack contains dried Laphing rolls or sheets and our signature sauce pouches. Simply rehydrate the sheets in water per instructions for 5–7 minutes, drain, cut into bite-sized rolls, and toss with our chili oil, garlic crunch, and savory seasoning.",
  },
  {
    id: "pack-contents",
    category: "Product & Taste",
    question: "What comes inside each packaging pouch?",
    answer: "Each pouch includes: 1) Authentic starch Laphing sheets/rolls, 2) Signature slow-brewed Chili-Garlic Oil packet, 3) Savory vinegar & spice seasoning concentrate, 4) Crispy textured soya protein chunks, and 5) Crushed toasted sesame-garlic garnish.",
  },
  {
    id: "heat-level",
    category: "Taste & Spice",
    question: "How spicy is it? Can I control the heat level?",
    answer: "Laphing is traditionally spicy and savory! However, our chili garlic oil is packed in a separate sachet. If you prefer a mild kick, add just half of the oil. If you love the authentic fiery street style, empty the entire pouch!",
  },
  {
    id: "is-it-vegan",
    category: "Ingredients & Diet",
    question: "Is de Laphing co. pack 100% vegetarian / vegan?",
    answer: "Yes! All our standard Laphing packs are 100% vegetarian and vegan friendly. We use pure vegetable extracts, wheat/mung bean starches, premium plant oils, and textured soy protein. There are zero animal byproducts or hidden gelatin.",
  },
  {
    id: "allergens",
    category: "Ingredients & Diet",
    question: "Does it contain gluten or soy allergens?",
    answer: "Our signature recipe contains wheat flour (gluten) and soy sauce/soya chunks (soy). If you have severe celiac or gluten sensitivities, please review the ingredient list on the back of the pouch or contact our support team.",
  },
  {
    id: "waitlist-discount",
    category: "Orders & Waitlist",
    question: "How do the 20% OFF and +10% referral discounts work?",
    answer: "By signing up for our early waitlist, you automatically lock in a flat 20% discount on your launch order. Once signed up, you receive a unique referral link from your profile. For every friend who signs up with your link, you get an additional +10% OFF stacked on your order!",
  },
  {
    id: "delivery-timeline",
    category: "Orders & Delivery",
    question: "When will shipping and deliveries begin?",
    answer: "We are currently in the final stages of batch production and quality certification. Waitlist members will get early priority access to order before public release. You will receive an email and notification as soon as your batch is ready to ship.",
  },
  {
    id: "shelf-life",
    category: "Preparation & Storage",
    question: "What is the shelf life and how should I store it?",
    answer: "Our unopened pouches have a shelf life of 6 months when kept in a cool, dry place away from direct sunlight. No refrigeration is needed until after opening or preparing the sheets.",
  },
  {
    id: "payment-methods",
    category: "Orders & Billing",
    question: "Which payment options do you support?",
    answer: "We accept all major payment methods including UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, MasterCard, RuPay), Net Banking, and popular mobile wallets via our secure Razorpay gateway.",
  },
];

export default function FAQPage() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    "what-is-laphing": true,
    "how-to-prepare": true,
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen w-full bg-[#FFDE59] text-[#741117] flex flex-col justify-between selection:bg-[#741117] selection:text-white">
      {/* Brand Navbar */}
      <Navbar />

      {/* Main Content Stage */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 flex-1">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <span className="font-inter font-bold text-[#741117]/80 text-xs sm:text-sm uppercase tracking-widest block mb-2">
            de Laphing co. • Help Center
          </span>
          <h1 className="font-slackey text-3xl sm:text-4xl md:text-5xl text-[#741117] tracking-wide uppercase mb-3">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="font-inter font-medium text-[#741117]/85 text-sm sm:text-base max-w-xl mx-auto">
            Got questions about our spicy cold jelly noodles, preparation, or waitlist discounts? Find quick answers below.
          </p>
        </div>

        {/* Clean Accordion Card */}
        <div className="bg-[#741117] text-white border-2 border-[#540B10] rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl space-y-4">
          {FAQ_DATA.map((item, index) => {
            const isOpen = !!openIds[item.id];
            return (
              <div
                key={item.id}
                className={`border-b border-white/10 pb-4 transition-colors ${
                  index === FAQ_DATA.length - 1 ? "border-b-0 pb-0" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-start justify-between gap-4 py-2 text-left group cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div>
                    <span className="text-[11px] font-bold text-[#FFDE59] uppercase tracking-wider block mb-1">
                      {item.category}
                    </span>
                    <h3 className="font-inter font-bold text-base sm:text-lg text-white group-hover:text-[#FFDE59] transition-colors">
                      {item.question}
                    </h3>
                  </div>

                  <span
                    className={`shrink-0 p-1.5 rounded-full bg-white/10 text-[#FFDE59] group-hover:bg-[#FFDE59] group-hover:text-[#741117] transition-all duration-200 mt-1 ${
                      isOpen ? "rotate-180 bg-[#FFDE59] text-[#741117]" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {isOpen && (
                  <div className="pt-2 pb-2 pr-6 text-white/85 font-inter text-sm sm:text-base leading-relaxed animate-in fade-in duration-200">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Simple Contact Footer inside card */}
          <div className="pt-8 mt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="font-inter font-bold text-white text-sm sm:text-base">
                Have another question?
              </h4>
              <p className="text-xs sm:text-sm text-white/70">
                We are always happy to help with orders or inquiries.
              </p>
            </div>

            <a
              href="mailto:support@thelaphingco.com"
              className="inline-flex items-center gap-2 bg-[#FFDE59] hover:bg-[#FFE58A] text-[#741117] font-inter font-bold text-xs sm:text-sm uppercase tracking-wider px-5 py-2.5 rounded-full transition-all active:scale-95 shadow-sm"
            >
              <Mail className="w-4 h-4" />
              <span>support@thelaphingco.com</span>
            </a>
          </div>
        </div>

      </main>

      {/* Brand Footer */}
      <Footer />
    </div>
  );
}
