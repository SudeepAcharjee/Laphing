"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Flame,
  MapPin,
  Sparkles,
  Utensils,
  ChevronDown,
  ShoppingBag,
  Clock,
  Heart,
  CheckCircle2,
} from "lucide-react";

export default function LaphingGuideSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const guideTopics = [
    {
      icon: MapPin,
      badge: "Delhi's Little Tibet",
      title: "Majnu Ka Tilla Laphing (Delhi Street Food Icon)",
      description:
        "Tucked inside the bustling alleys of Majnu Ka Tilla (MKT) in North Delhi, authentic Tibetan street food culture comes alive. Laphing in Delhi has achieved legendary cult status — foodies and college students journey across the NCR specifically for fresh cold laphing drenched in dark red chilli oil and seasoned garlic water.",
      keywords: ["majnu ka tilla laphing", "laphing in delhi", "tibetian streetfood"],
    },
    {
      icon: Utensils,
      badge: "Cold vs. Broth",
      title: "Spicy Cold Noodles vs. Soupy Laphing",
      description:
        "Laphing comes in two mouthwatering styles. Dry rolled laphing features slippery, bouncy wheat or mung-bean noodle sheets wrapped around roasted chilli relish, cut into bite-sized rolls. Soupy laphing immerses flat cold noodles in a chilled, tangy vinegar and garlic-chilli broth that awakens every palate.",
      keywords: ["cold noodles", "soupy noodles", "spicy"],
    },
    {
      icon: Flame,
      badge: "The Soul of the Dish",
      title: "Artisanal Tibetan Chilli Oil & Secret Recipe",
      description:
        "The heartbeat of every great laphing recipe is its chilli oil. Made with slow-roasted crushed red chillies, Sichuan-style aromatic peppers, minced garlic relish, and toasted sesame, this fiery oil provides deep umami heat, vibrant red color, and a tingling, addictive finish.",
      keywords: ["laphing chilli oil", "laphing recipe", "spicy"],
    },
    {
      icon: Sparkles,
      badge: "The Cult Combo",
      title: "Wai Wai Laphing: The Crunch Revolution",
      description:
        "Born on the streets of Delhi and Himalayan Tibetan settlements, Wai Wai laphing is an ingenious creation. Crushed, crispy Wai Wai instant noodles and savoury tastemaker are rolled inside the gelatinous cold noodle wrap, creating a heavenly textural contrast of silky smoothness and loud, spicy crunch.",
      keywords: ["waiwai laphing", "tibetian streetfood", "cold noodles"],
    },
  ];

  const faqs = [
    {
      question: "What is Laphing and where does it originate?",
      answer:
        "Laphing (or Laping) is a traditional Tibetan street food dish originating from Liangfen in northern China and perfected in Tibet and Himalayan communities. Made from mung bean starch or wheat gluten, these translucent cold noodles are served chilled with roasted chilli oil, garlic water, soy sauce, and vinegar.",
    },
    {
      question: "How do I prepare authentic Tibetan Laphing at home?",
      answer:
        "With The Laphing Co. instant DIY kits, making laphing at home takes just 5 minutes. Simply unpack the chilled bouncy noodle sheets, drizzle our signature roasted Tibetan chilli oil and garlic glaze, sprinkle crushed Wai Wai noodles, and enjoy either dry rolled or with cold tangy broth.",
    },
    {
      question: "What makes Delhi's Majnu Ka Tilla Laphing so special?",
      answer:
        "Majnu Ka Tilla (MKT) in Delhi is home to Tibetan culinary masters who have refined laphing for generations. The fresh handmade noodle rolls, secret chilli oils, and vibrant street ambiance have made MKT the undisputed Laphing capital of India.",
    },
    {
      question: "What is the difference between dry rolled Laphing and Soupy Laphing?",
      answer:
        "Dry rolled laphing is tight gluten sheets filled with spicy paste and crunchy toppings, sliced into compact cylinders for easy dipping. Soupy laphing features flat noodle ribbons floating in an iced, refreshing bowl of tangy chilli-garlic broth.",
    },
    {
      question: "Is Wai Wai Laphing spicy?",
      answer:
        "Yes! Wai Wai laphing has a kick from our slow-cooked Tibetan chilli oil, but you can customize the heat by adjusting how much chilli relish and seasoning you drizzle over your noodles.",
    },
  ];

  return (
    <section
      id="laphing-guide"
      aria-label="Authentic Tibetan Laphing Guide and Delhi Street Food Culture"
      className="relative w-full bg-[#520C11] text-white py-14 sm:py-20 px-4 xs:px-6 sm:px-10 md:px-14 lg:px-20 border-t-2 border-[#81191B]/40 select-none overflow-hidden"
    >
      {/* Background Ambience Glow */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-[#FFDE59]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-[#FFDE59]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-[1280px] mx-auto z-10 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#FFDE59]/15 border border-[#FFDE59]/30 text-[#FFDE59] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            <Flame className="w-3.5 h-3.5" />
            <span>The Street Food Phenomenon</span>
          </div>

          <h2 className="font-inter font-black text-white text-2xl xs:text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight leading-tight">
            The Ultimate Guide to <span className="text-[#FFDE59]">Tibetan Laphing</span>
          </h2>

          <p className="font-inter text-white/80 text-sm sm:text-base leading-relaxed">
            From the bustling street corners of Majnu Ka Tilla in Delhi to your dining table. Everything you need to know about spicy cold noodles, tangy soupy broth, artisanal chilli oil, and the cult-favorite Wai Wai crunch.
          </p>
        </div>

        {/* 4 Pillars Grid (SEO / AEO Key Entity Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {guideTopics.map((topic, idx) => {
            const Icon = topic.icon;
            return (
              <article
                key={idx}
                className="bg-[#3D080C] border-2 border-[#81191B] hover:border-[#FFDE59]/50 rounded-3xl p-6 sm:p-8 space-y-3.5 shadow-xl transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFDE59] text-[#741117] flex items-center justify-center shadow-md shrink-0">
                    <Icon className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFDE59] bg-[#FFDE59]/10 border border-[#FFDE59]/20 px-3 py-1 rounded-full">
                    {topic.badge}
                  </span>
                </div>

                <h3 className="font-inter font-bold text-white text-xl sm:text-2xl tracking-tight leading-snug">
                  {topic.title}
                </h3>

                <p className="font-inter text-white/75 text-sm sm:text-[15px] leading-relaxed">
                  {topic.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {topic.keywords.map((kw, kidx) => (
                    <span
                      key={kidx}
                      className="text-[11px] font-mono text-[#FFDE59]/80 bg-black/30 px-2.5 py-0.5 rounded-md border border-[#81191B]"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        {/* Instant Laphing at Home Feature Highlight */}
        <div className="bg-[#6B1319] border-2 border-[#FFDE59]/40 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFDE59] uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Ready In 5 Minutes • No Cooking Required</span>
            </div>
            <h3 className="font-inter font-black text-white text-2xl sm:text-3xl uppercase tracking-tight">
              Enjoy Restaurant-Style Laphing at Home
            </h3>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              No need to wait for your next trip to Delhi or spend hours kneading starch. Our signature packs come fresh with chilled, hand-rolled gluten sheets, signature roasted Tibetan chilli oil, umami soy sauce, and crunchy Wai Wai topping.
            </p>
          </div>

          <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center gap-2.5 bg-[#FFDE59] hover:bg-[#FFE58A] text-[#741117] font-inter font-black text-sm sm:text-base uppercase tracking-wider py-4 px-8 rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Order Laphing Pack</span>
            </Link>
          </div>
        </div>

        {/* AEO Question-Answering Accordion */}
        <div className="max-w-3xl mx-auto space-y-4 pt-4">
          <div className="text-center mb-6 space-y-1.5">
            <h3 className="font-inter font-black text-white text-xl sm:text-2xl uppercase tracking-tight">
              Frequently Asked Questions (AEO & FAQs)
            </h3>
            <p className="text-white/60 text-xs sm:text-sm">
              Instant answers to popular questions about Tibetan cold noodles.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="bg-[#3D080C] border border-[#81191B] hover:border-[#FFDE59]/40 rounded-2xl overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-inter font-bold text-white text-sm sm:text-base cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#FFDE59] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-white/80 text-xs sm:text-sm leading-relaxed border-t border-[#81191B]/40 animate-in fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
