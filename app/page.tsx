"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";

const ingredients = [
  { id: 1, name: "MASALA OIL", image: "/1.png", alt: "Masala Oil" },
  { id: 2, name: "WAI WAI NOODLES", image: "/2.png", alt: "Wai Wai Noodles" },
  { id: 3, name: "CHILLI GARLIC SAUCE", image: "/3.png", alt: "Chilli Garlic Sauce" },
  { id: 4, name: "CHILLI FLAKES", image: "/4.png", alt: "Chilli Flakes" },
  { id: 5, name: "DEHYDRATED VEGGIES", image: "/5.png", alt: "Dehydrated Veggies" },
  { id: 6, name: "SESAME PASTE", image: "/6.png", alt: "Sesame Paste" },
];

export default function Home() {
  const masterTrackRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroSlotRef = useRef<HTMLDivElement>(null);
  const landingSlotRef = useRef<HTMLDivElement>(null);
  const packageRef = useRef<HTMLDivElement>(null);
  const ingredientsPanelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGPathElement | null)[]>([]);
  const spineClipRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!masterTrackRef.current || !packageRef.current || !heroTextRef.current) return;

      const mm = gsap.matchMedia();

      // ================= DESKTOP & TABLET ANIMATION (lg: 1024px+) =================
      mm.add("(min-width: 1024px)", () => {
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: masterTrackRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        // Initial setup for items and lines
        itemRefs.current.forEach((item, index) => {
          if (item) gsap.set(item, { opacity: 0, x: -25, scale: 0.75 });
          const line = lineRefs.current[index];
          if (line) {
            const length = line.getTotalLength ? line.getTotalLength() : 110;
            gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
          }
        });

        if (spineClipRef.current) {
          gsap.set(spineClipRef.current, { attr: { height: 0 } });
        }

        // --- STEP 1: Hero Text Fades Out & Package Moves into Left Landing Position ---
        masterTl
          .to(heroTextRef.current, {
            opacity: 0,
            x: -50,
            duration: 0.25,
            ease: "power2.inOut",
          }, 0.05)
          .to(packageRef.current, {
            x: () => {
              const heroSlot = heroSlotRef.current?.getBoundingClientRect();
              const landSlot = landingSlotRef.current?.getBoundingClientRect();
              if (!heroSlot || !landSlot) return 0;
              return (landSlot.left + landSlot.width / 2) - (heroSlot.left + heroSlot.width / 2);
            },
            y: () => {
              const heroSlot = heroSlotRef.current?.getBoundingClientRect();
              const landSlot = landingSlotRef.current?.getBoundingClientRect();
              if (!heroSlot || !landSlot) return 0;
              return (landSlot.top + landSlot.height / 2) - (heroSlot.top + heroSlot.height / 2);
            },
            scale: 0.96,
            rotation: -3,
            duration: 0.3,
            ease: "power2.inOut",
          }, 0.05)
          .to(ingredientsPanelRef.current, {
            opacity: 1,
            duration: 0.1,
          }, 0.25);

        // --- Animate the Dotted Spine Drawing Downwards on Scroll ---
        if (spineClipRef.current) {
          masterTl.to(
            spineClipRef.current,
            {
              attr: { height: 440 },
              duration: 0.65,
              ease: "none",
            },
            0.28
          );
        }

        // --- STEP 2: 6 Ingredients reveal 1-by-1 with arrows ---
        ingredients.forEach((_, index) => {
          const item = itemRefs.current[index];
          const line = lineRefs.current[index];
          const startTime = 0.35 + index * 0.1;

          if (item) {
            masterTl.to(
              item,
              {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.09,
                ease: "back.out(1.3)",
              },
              startTime
            );
          }

          if (line) {
            masterTl.to(
              line,
              {
                strokeDashoffset: 0,
                duration: 0.08,
                ease: "power2.out",
              },
              startTime
            );
          }
        });

        masterTl.to({}, { duration: 0.1 });
      });

      // ================= MOBILE BREAKPOINT (< 1024px) =================
      mm.add("(max-width: 1023px)", () => {
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: masterTrackRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        itemRefs.current.forEach((item, index) => {
          if (item) gsap.set(item, { opacity: 0, x: 15, scale: 0.85 });
          const line = lineRefs.current[index];
          if (line) {
            const length = line.getTotalLength ? line.getTotalLength() : 80;
            gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
          }
        });

        // Step 1: Fade hero text and move package into mobile landing position
        masterTl
          .to(heroTextRef.current, {
            opacity: 0,
            y: -25,
            duration: 0.25,
            ease: "power2.inOut",
          }, 0.05)
          .to(packageRef.current, {
            x: () => {
              const heroSlot = heroSlotRef.current?.getBoundingClientRect();
              const landSlot = landingSlotRef.current?.getBoundingClientRect();
              if (!heroSlot || !landSlot) return 0;
              return (landSlot.left + landSlot.width / 2) - (heroSlot.left + heroSlot.width / 2);
            },
            y: () => {
              const heroSlot = heroSlotRef.current?.getBoundingClientRect();
              const landSlot = landingSlotRef.current?.getBoundingClientRect();
              if (!heroSlot || !landSlot) return 0;
              return (landSlot.top + landSlot.height / 2) - (heroSlot.top + heroSlot.height / 2);
            },
            scale: 0.82,
            rotation: -2,
            duration: 0.3,
            ease: "power2.inOut",
          }, 0.05)
          .to(ingredientsPanelRef.current, {
            opacity: 1,
            duration: 0.12,
          }, 0.25);

        // Step 2: Reveal the 6 ingredients on mobile with arrows
        ingredients.forEach((_, index) => {
          const item = itemRefs.current[index];
          const line = lineRefs.current[index];
          const startTime = 0.32 + index * 0.1;

          if (item) {
            masterTl.to(
              item,
              {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.09,
                ease: "power2.out",
              },
              startTime
            );
          }

          if (line) {
            masterTl.to(
              line,
              {
                strokeDashoffset: 0,
                duration: 0.08,
                ease: "power2.out",
              },
              startTime
            );
          }
        });

        masterTl.to({}, { duration: 0.1 });
      });

    }, masterTrackRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black font-sans text-white overflow-x-clip flex flex-col">
      <SplashScreen />

      {/* Ambient background vector details */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 850 C 300 950, 500 650, 1500 800" stroke="#FFC107" strokeWidth="1" strokeDasharray="5 10" fill="transparent" opacity="0.4" />
          <path d="M700 0 C 1000 300, 1100 150, 1500 500" stroke="#FFC107" strokeWidth="1" strokeDasharray="5 10" fill="transparent" opacity="0.4" />
          <path d="M-50 400 C 400 300, 800 600, 1500 100" stroke="#FFC107" strokeWidth="1" strokeDasharray="5 10" fill="transparent" opacity="0.2" />
        </svg>
      </div>

      <Navbar />

      {/* ================= UNIFIED SCROLL TRACK ================= */}
      <div 
        ref={masterTrackRef} 
        id="interactive-experience-track"
        className="relative h-[380vh] w-full"
      >
        {/* Sticky Stage Viewport */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden pt-16 sm:pt-20 md:pt-24 pb-4 sm:pb-6 px-4 sm:px-8 md:px-14 lg:px-24 xl:px-36 2xl:px-44">
          
          {/* Hero Screen Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none">
            <Image
              src="/image.png"
              alt="Hero Background"
              fill
              priority
              quality={90}
              className="object-cover object-center"
            />
            {/* Black overlay for contrast and rich mood */}
            <div className="absolute inset-0 bg-black/55" />
          </div>

          <div className="relative w-full max-w-[1140px] xl:max-w-[1180px] mx-auto h-full flex items-center justify-between gap-2 sm:gap-4 md:gap-8 lg:gap-12">
            
            {/* ================= LEFT COLUMN: Hero Text (Top) -> Product Package Lands Here on Scroll ================= */}
            <div className="relative w-[40%] sm:w-[42%] lg:w-[45%] xl:w-[44%] h-full flex items-center justify-start z-20">
              
              {/* Hero Left Content (Visible at top, fades out on scroll) */}
              <div 
                ref={heroTextRef} 
                className="flex flex-col items-start text-left z-20 shrink-0 w-full"
              >
                {/* Tagline */}
                <div className="mb-1.5 sm:mb-2 md:mb-3 animate-[fade-in-up_0.8s_ease-out_2.6s_both]">
                  <span className="text-[#FFAE00] font-inter font-bold tracking-[0.16em] sm:tracking-[0.2em] text-[11px] sm:text-[13px] md:text-[15px] uppercase">
                    SPICY. TANGY. ADDICTIVE.
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="font-bebas text-[42px] sm:text-[56px] md:text-[76px] lg:text-[96px] xl:text-[120px] leading-[0.88] tracking-[0.03em] uppercase mb-2 sm:mb-3 md:mb-4 animate-[fade-in-up_0.8s_ease-out_2.8s_both]">
                  <span className="text-white block">LOVE.</span>
                  <span className="text-[#FFAE00] block">LAPH.</span>
                  <span className="text-white block">CHEAT.</span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-white/70 font-inter text-[12px] sm:text-[14px] md:text-[16px] leading-tight sm:leading-snug font-normal mb-4 sm:mb-5 md:mb-6 animate-[fade-in-up_0.8s_ease-out_3.0s_both]">
                  Not just a snack,<br />
                  it’s a whole vibe.
                </p>
                
                {/* CTA Button with Mascot */}
                <div className="flex items-center gap-3 sm:gap-4 animate-[fade-in-up_0.8s_ease-out_3.2s_both] relative">
                  <div className="absolute -top-[28px] left-[105px] sm:-top-[34px] sm:left-[125px] md:-top-[42px] md:left-[140px] w-[38px] h-[38px] sm:w-[48px] sm:h-[48px] md:w-[56px] md:h-[56px] z-10 animate-swing origin-bottom cursor-pointer hover:animate-laugh transition-transform">
                    <Image src="/sitting.svg" alt="Sitting Mascot" fill className="object-contain drop-shadow-[0_4px_10px_rgba(255,174,0,0.3)] pointer-events-none" />
                  </div>

                  <button className="bg-[#FFAE00] hover:bg-[#ffb91a] text-black px-5 py-2.5 sm:px-7 sm:py-3 md:px-8 md:py-3.5 rounded-full font-extrabold text-[11px] sm:text-[13px] md:text-[14px] tracking-wider uppercase flex items-center gap-1.5 sm:gap-2 transition-all shadow-[0_0_20px_rgba(255,174,0,0.25)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                    <span>Join Waitlist</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M5 12h14"></path>
                      <path d="M13 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Left-Aligned Package Landing Slot (Package slides here on scroll) */}
              <div 
                ref={landingSlotRef} 
                id="landing-slot"
                className="absolute left-0 w-full max-w-[170px] sm:max-w-[240px] md:max-w-[320px] lg:max-w-[430px] xl:max-w-[460px] h-[220px] sm:h-[280px] md:h-[380px] lg:h-[480px] xl:h-[530px] flex items-center justify-start pointer-events-none"
              />

              {/* Ambient golden aura behind the left-aligned product landing spot */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[320px] lg:w-[420px] h-[220px] sm:h-[320px] lg:h-[420px] rounded-full bg-[#FFAE00]/12 blur-[90px] lg:blur-[130px] pointer-events-none" />
            </div>

            {/* ================= RIGHT COLUMN: Hero Package (Starts Here) -> 6 Ingredients Reveal Here ================= */}
            <div className="relative w-[60%] sm:w-[58%] lg:w-[55%] xl:w-[56%] h-full flex items-center justify-end z-30">
              
              {/* Product Package Start Slot */}
              <div 
                ref={heroSlotRef} 
                id="hero-slot"
                className="absolute right-0 w-full max-w-[170px] sm:max-w-[240px] md:max-w-[320px] lg:max-w-[430px] xl:max-w-[460px] h-[220px] sm:h-[280px] md:h-[380px] lg:h-[480px] xl:h-[530px] flex justify-end items-center pointer-events-none z-30"
              >
                {/* Product Package Box (Starts on Right of Hero, glides to Left Landing Slot) */}
                <div 
                  ref={packageRef} 
                  className="relative w-full h-full flex justify-center items-center pointer-events-auto will-change-transform z-30"
                >
                  <div className="relative w-full h-full animate-hero-entrance">
                    <Image 
                      src="/hero.png" 
                      alt="The Laphing Co Product Package" 
                      fill
                      sizes="(max-width: 640px) 170px, (max-width: 1024px) 320px, 460px" 
                      className="object-contain drop-shadow-[0_0_60px_rgba(255,174,0,0.25)]" 
                      priority 
                    />
                  </div>
                </div>
              </div>

              {/* Right: The 6 Ingredients Stack & Curved Pointer Flow */}
              <div 
                ref={ingredientsPanelRef}
                className="relative w-full z-20 flex flex-col gap-1.5 sm:gap-2.5 md:gap-3.5 lg:gap-4.5 opacity-0 transition-opacity duration-300 items-start pl-1 sm:pl-3 md:pl-4 lg:pl-6"
              >
                {/* Curved Vertical Dotted Spine passing through the 6 nodes */}
                <div className="hidden sm:block absolute left-0 top-[15px] sm:top-[20px] bottom-[15px] sm:bottom-[20px] w-[50px] lg:w-[90px] pointer-events-none z-10">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 90 420" preserveAspectRatio="none" fill="none">
                    <defs>
                      <clipPath id="spine-draw-clip">
                        <rect ref={spineClipRef} x="-20" y="0" width="130" height="0" />
                      </clipPath>
                    </defs>
                    <path 
                      d="M 6 25 C 45 95, 75 165, 75 210 C 75 255, 45 325, 6 395" 
                      stroke="#FFAE00" 
                      strokeWidth="1.8" 
                      strokeDasharray="4 6" 
                      opacity="0.8"
                      clipPath="url(#spine-draw-clip)"
                    />
                  </svg>
                </div>

                {ingredients.map((item, index) => {
                  // Margin offsets creating the prominent curve for arrows, pouches, and text together
                  const arcMarginClasses = [
                    "ml-0 lg:ml-0",
                    "ml-1 sm:ml-3 md:ml-5 lg:ml-8",
                    "ml-2 sm:ml-5 md:ml-10 lg:ml-16",
                    "ml-2 sm:ml-5 md:ml-10 lg:ml-16",
                    "ml-1 sm:ml-3 md:ml-5 lg:ml-8",
                    "ml-0 lg:ml-0",
                  ];

                  // Precise curve geometries for the arrows (responsive widths)
                  const arrowConfigs = [
                    {
                      widthClass: "w-[28px] sm:w-[50px] md:w-[85px] lg:w-[135px]",
                      viewBox: "0 0 135 44",
                      nodeX: 6,
                      nodeY: 36,
                      d: "M 6 36 C 45 36, 85 14, 122 14",
                    },
                    {
                      widthClass: "w-[26px] sm:w-[48px] md:w-[80px] lg:w-[130px]",
                      viewBox: "0 0 130 36",
                      nodeX: 6,
                      nodeY: 26,
                      d: "M 6 26 C 45 26, 80 16, 118 16",
                    },
                    {
                      widthClass: "w-[24px] sm:w-[45px] md:w-[75px] lg:w-[125px]",
                      viewBox: "0 0 125 28",
                      nodeX: 6,
                      nodeY: 14,
                      d: "M 6 14 L 114 14",
                    },
                    {
                      widthClass: "w-[24px] sm:w-[45px] md:w-[75px] lg:w-[125px]",
                      viewBox: "0 0 125 28",
                      nodeX: 6,
                      nodeY: 14,
                      d: "M 6 14 L 114 14",
                    },
                    {
                      widthClass: "w-[26px] sm:w-[48px] md:w-[80px] lg:w-[130px]",
                      viewBox: "0 0 130 36",
                      nodeX: 6,
                      nodeY: 10,
                      d: "M 6 10 C 45 10, 80 20, 118 20",
                    },
                    {
                      widthClass: "w-[28px] sm:w-[50px] md:w-[85px] lg:w-[135px]",
                      viewBox: "0 0 135 44",
                      nodeX: 6,
                      nodeY: 8,
                      d: "M 6 8 C 45 8, 85 30, 122 30",
                    },
                  ];

                  const arrow = arrowConfigs[index] || arrowConfigs[0];
                  const currentMargin = arcMarginClasses[index] || "";

                  return (
                    <div 
                      key={item.id}
                      ref={(el) => { itemRefs.current[index] = el; }}
                      className={`relative flex items-center gap-1.5 sm:gap-2.5 md:gap-3 lg:gap-4 group transition-all duration-300 ${currentMargin}`}
                    >
                      {/* Curving SVG Arrow with Yellow Node and Seamless Arrowhead */}
                      <div 
                        className={`relative h-[24px] sm:h-[30px] md:h-[36px] lg:h-[40px] shrink-0 pointer-events-none ${arrow.widthClass}`}
                        style={{ minWidth: "28px" }}
                      >
                        <svg 
                          className="w-full h-full overflow-visible" 
                          viewBox={arrow.viewBox} 
                          fill="none"
                        >
                          <defs>
                            <marker
                              id={`arrow-${item.id}`}
                              markerWidth="7"
                              markerHeight="7"
                              refX="4.5"
                              refY="3.5"
                              orient="auto"
                            >
                              <polygon points="0 1, 6 3.5, 0 6" fill="#FFAE00" />
                            </marker>
                          </defs>

                          {/* Animated Arrow Path with attached marker arrowhead */}
                          <path 
                            ref={(el) => { lineRefs.current[index] = el; }}
                            d={arrow.d}
                            stroke="#FFAE00" 
                            strokeWidth="2" 
                            strokeLinecap="round"
                            markerEnd={`url(#arrow-${item.id})`}
                          />

                          {/* Left Glowing Node dot */}
                          <circle 
                            cx={arrow.nodeX} 
                            cy={arrow.nodeY} 
                            r="4.5" 
                            fill="#FFAE00" 
                            className="drop-shadow-[0_0_8px_rgba(255,174,0,1)]" 
                          />
                        </svg>
                      </div>

                      {/* Ingredient Item: Floating Pouch + Bold Yellow Title */}
                      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 cursor-pointer group-hover:translate-x-1 transition-transform duration-300">
                        {/* Pouch Image */}
                        <div className="relative w-[34px] h-[34px] sm:w-[44px] sm:h-[44px] md:w-[54px] md:h-[54px] lg:w-[68px] lg:h-[68px] shrink-0 flex items-center justify-center">
                          <Image 
                            src={item.image} 
                            alt={item.alt} 
                            fill 
                            sizes="(max-width: 640px) 34px, (max-width: 1024px) 54px, 68px"
                            className="object-contain drop-shadow-[0_4px_14px_rgba(255,174,0,0.3)] group-hover:scale-110 transition-transform duration-300" 
                          />
                        </div>

                        {/* Title with Subtle Underline */}
                        <div className="flex flex-col items-start min-w-0">
                          <span className="font-bebas text-[13px] sm:text-[17px] md:text-[22px] lg:text-[26px] tracking-[0.04em] text-[#FFAE00] uppercase font-bold leading-none group-hover:text-white transition-colors duration-200 truncate">
                            {item.name}
                          </span>
                          <div className="w-full h-[1px] bg-gradient-to-r from-[#FFAE00]/40 via-[#FFAE00]/20 to-transparent mt-0.5 sm:mt-1" />
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ================= PAGE 3: BOTTOM CTA SECTION ================= */}
      <section className="relative w-full py-24 px-8 flex flex-col items-center justify-center text-center border-t border-white/10 bg-gradient-to-b from-black to-[#0a0702] z-20">
        <div className="max-w-[700px] flex flex-col items-center">
          <span className="text-[#FFAE00] font-inter font-bold tracking-[0.2em] text-[12px] md:text-[13px] uppercase mb-3">
            READY IN 7 MINUTES
          </span>
          <h2 className="font-bebas text-[48px] sm:text-[64px] md:text-[80px] leading-[0.9] tracking-tight uppercase text-white mb-6">
            CRAVING SATISFACTION, <br />
            <span className="text-[#FFAE00]">DELIVERED.</span>
          </h2>
          <button className="bg-[#FFAE00] hover:bg-[#ffb91a] text-black px-10 py-4 rounded-full font-extrabold text-[14px] tracking-wider uppercase flex items-center gap-2 transition-all shadow-[0_0_25px_rgba(255,174,0,0.3)] hover:scale-105 active:scale-95 cursor-pointer">
            Order Your Pack Now
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M13 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </section>

    </div>
  );
}
