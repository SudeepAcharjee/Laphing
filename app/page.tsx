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
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const spineClipRef = useRef<SVGRectElement>(null);
  const packageFloatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!masterTrackRef.current || !packageRef.current || !heroTextRef.current) return;

      if (packageFloatRef.current) {
        gsap.to(packageFloatRef.current, {
          y: -15,
          rotation: 1.5,
          duration: 3.5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

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
          if (dotRefs.current[index]) {
            gsap.set(dotRefs.current[index], { opacity: 0 });
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
              attr: { height: 600 },
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

          if (dotRefs.current[index]) {
            masterTl.to(
              dotRefs.current[index],
              { opacity: 1, duration: 0.05 },
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
          if (dotRefs.current[index]) {
            gsap.set(dotRefs.current[index], { opacity: 0 });
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

        if (spineClipRef.current) {
          masterTl.to(
            spineClipRef.current,
            {
              attr: { height: 600 },
              duration: 0.65,
              ease: "none",
            },
            0.28
          );
        }

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

          if (dotRefs.current[index]) {
            masterTl.to(
              dotRefs.current[index],
              { opacity: 1, duration: 0.05 },
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
              className="object-cover object-center opacity-80"
            />
            {/* Smooth, premium gradient overlay for perfect contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#050300] mix-blend-multiply" />
          </div>

          <div className="relative w-full max-w-[1140px] xl:max-w-[1180px] mx-auto h-full flex items-center justify-between gap-2 sm:gap-4 md:gap-8 lg:gap-12">
            
            {/* ================= LEFT COLUMN: Hero Text (Top) -> Product Package Lands Here on Scroll ================= */}
            <div className="relative w-[45%] sm:w-[48%] lg:w-[50%] xl:w-[52%] h-full flex items-center justify-start z-20">
              
              {/* Hero Left Content (Visible at top, fades out on scroll) */}
              <div 
                ref={heroTextRef} 
                className="flex flex-col items-start text-left z-20 shrink-0 w-full"
              >
                {/* Tagline */}
                <div className="mb-3 sm:mb-4 md:mb-5 animate-[fade-in-up_0.8s_ease-out_2.6s_both]">
                  <span className="text-[#FFAE00] font-inter font-semibold tracking-[0.25em] text-[10px] sm:text-[12px] md:text-[14px] uppercase">
                    SPICY. TANGY. ADDICTIVE.
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="font-bebas text-[48px] sm:text-[68px] md:text-[92px] lg:text-[112px] xl:text-[136px] leading-[0.85] tracking-[0.03em] uppercase mb-4 sm:mb-6 md:mb-8 animate-[fade-in-up_0.8s_ease-out_2.8s_both]">
                  <span className="text-white block">LOVE.</span>
                  <span className="text-[#FFAE00] block">LAPH.</span>
                  <span className="text-white block">CHEAT.</span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-white/60 font-inter text-[14px] sm:text-[16px] md:text-[18px] leading-relaxed font-light mb-8 sm:mb-10 md:mb-12 animate-[fade-in-up_0.8s_ease-out_3.0s_both] max-w-[100%] sm:max-w-[95%] pr-4">
                  Not just a snack, it’s a whole <span className="text-white font-medium">vibe</span>.<br />
                  Get ready for the boldest flavours in every bite.
                </p>
                
                {/* CTA Button */}
                <div className="flex items-center gap-3 sm:gap-4 animate-[fade-in-up_0.8s_ease-out_3.2s_both] relative group">
                  {/* Clean mascot, no bouncy animations */}
                  <div className="absolute -top-[30px] left-[170px] sm:-top-[38px] sm:left-[200px] md:-top-[42px] md:left-[240px] w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] md:w-[56px] md:h-[56px] z-10 origin-bottom pointer-events-none transition-transform duration-500 group-hover:-translate-y-2">
                    <Image src="/sitting.svg" alt="Sitting Mascot" fill className="object-contain" />
                  </div>

                  <button className="bg-[#FFAE00] hover:bg-white text-black px-8 py-3.5 sm:px-10 sm:py-4 md:px-12 md:py-5 rounded-full font-bold font-inter text-[12px] sm:text-[14px] md:text-[15px] tracking-[0.05em] uppercase flex items-center gap-3 transition-colors duration-300 shadow-[0_10px_40px_-10px_rgba(255,174,0,0.5)] hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.5)]">
                    <span>Join Waitlist</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 transition-transform group-hover:translate-x-1">
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
            <div className="relative w-[55%] sm:w-[52%] lg:w-[50%] xl:w-[48%] h-full flex items-center justify-end z-30">
              
              {/* Subtle ambient glow behind the product */}
              <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[250px] sm:w-[350px] lg:w-[500px] h-[250px] sm:h-[350px] lg:h-[500px] rounded-full bg-[#FFAE00]/10 blur-[100px] lg:blur-[150px] pointer-events-none mix-blend-screen" />

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
                    {/* Inner wrapper for continuous floating animation */}
                    <div ref={packageFloatRef} className="w-full h-full relative">
                      <Image 
                        src="/hero.png" 
                        alt="The Laphing Co Product Package" 
                        fill
                        sizes="(max-width: 640px) 170px, (max-width: 1024px) 320px, 460px" 
                        className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]" 
                        priority 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: The 6 Ingredients Stack & Curved Pointer Flow */}
              <div 
                ref={ingredientsPanelRef}
                className="relative w-full max-w-[260px] sm:max-w-[300px] md:max-w-[380px] lg:max-w-[460px] xl:max-w-[500px] aspect-[5/6] opacity-0 transition-opacity duration-300"
              >
                {/* Unified SVG containing the animated spine curve and 6 straight arrows */}
                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-10" viewBox="0 0 500 600" fill="none">
                  <defs>
                    <clipPath id="spine-draw-clip">
                      <rect ref={spineClipRef} x="0" y="0" width="200" height="0" />
                    </clipPath>
                    <marker
                      id="arrowhead"
                      markerWidth="5"
                      markerHeight="5"
                      refX="4"
                      refY="2.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 5 2.5, 0 5" fill="#FFAE00" />
                    </marker>
                  </defs>

                  {/* Elegant, crisp spine arc */}
                  <path 
                    d="M 40 50 Q 160 300 40 550" 
                    stroke="#FFAE00" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 6" 
                    strokeLinecap="round"
                    opacity="0.3"
                    clipPath="url(#spine-draw-clip)"
                  />

                  {ingredients.map((item, index) => {
                    // Exact intersection points on the quadratic bezier spine
                    const yCoords = [50, 150, 250, 350, 450, 550];
                    const xCoords = [40, 78, 98, 98, 78, 40];
                    const targetX = 160;
                    const Y = yCoords[index];
                    const X = xCoords[index];

                    return (
                      <g key={`svg-${item.id}`}>
                        {/* Crisp Straight Animated Arrow */}
                        <path 
                          ref={(el) => { lineRefs.current[index] = el; }}
                          d={`M ${X} ${Y} L ${targetX} ${Y}`}
                          stroke="#FFAE00" 
                          strokeWidth="1.5" 
                          opacity="0.7"
                          markerEnd="url(#arrowhead)"
                        />
                        {/* Minimal Node Dot */}
                        <circle 
                          ref={(el) => { dotRefs.current[index] = el; }}
                          cx={X} cy={Y} r="3.5" 
                          fill="#FFAE00" 
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* HTML Overlays accurately positioned relative to the SVG ViewBox */}
                {ingredients.map((item, index) => {
                  const yCoords = [50, 150, 250, 350, 450, 550];
                  const topPercent = (yCoords[index] / 600) * 100;
                  const leftPercent = (175 / 500) * 100; // Leaves 15px gap from arrow tip
                  const widthPercent = ((500 - 175) / 500) * 100;

                  return (
                    <div 
                      key={item.id}
                      className="absolute z-20"
                      style={{ 
                        top: `${topPercent}%`, 
                        left: `${leftPercent}%`,
                        transform: 'translateY(-50%)',
                        width: `${widthPercent}%`
                      }}
                    >
                      {/* Clean inner wrapper */}
                      <div 
                        ref={(el) => { itemRefs.current[index] = el; }}
                        className="flex items-center gap-4 sm:gap-5 md:gap-6 cursor-pointer group hover:translate-x-2 transition-transform duration-500 ease-out py-2"
                      >
                        {/* Pouch Image - natural realistic shadow */}
                        <div className="relative w-[36px] h-[36px] sm:w-[48px] sm:h-[48px] md:w-[60px] md:h-[60px] lg:w-[72px] lg:h-[72px] shrink-0 flex items-center justify-center z-10 transition-transform duration-500 ease-out group-hover:scale-110">
                          <Image 
                            src={item.image} 
                            alt={item.alt} 
                            fill 
                            sizes="(max-width: 640px) 36px, (max-width: 1024px) 60px, 72px"
                            className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" 
                          />
                        </div>

                        {/* Minimal Text Content */}
                        <div className="flex flex-col items-start min-w-0 z-10 relative">
                          <span className="font-bebas text-[16px] sm:text-[20px] md:text-[26px] lg:text-[32px] tracking-[0.05em] text-white/60 uppercase font-medium leading-none group-hover:text-white transition-colors duration-300 truncate">
                            {item.name}
                          </span>
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
      <section className="relative w-full py-32 sm:py-40 px-6 sm:px-8 flex flex-col items-center justify-center text-center border-t border-white/5 bg-[#050300] z-20 overflow-hidden">
        
        {/* Soft, minimal ambient glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] h-[400px] bg-[#FFAE00]/5 blur-[150px] rounded-t-full pointer-events-none" />

        <div className="max-w-[800px] flex flex-col items-center relative z-10">
          <span className="text-[#FFAE00] font-inter font-semibold tracking-[0.3em] text-[10px] md:text-[12px] uppercase mb-6">
            READY IN 7 MINUTES
          </span>
          <h2 className="font-bebas text-[56px] sm:text-[76px] md:text-[104px] leading-[0.85] tracking-tight uppercase text-white mb-10">
            CRAVING SATISFACTION, <br />
            <span className="text-[#FFAE00]">DELIVERED.</span>
          </h2>
          <button className="bg-[#FFAE00] hover:bg-white text-black px-10 py-4 sm:px-12 sm:py-5 rounded-full font-bold font-inter text-[13px] sm:text-[15px] tracking-[0.05em] uppercase flex items-center gap-3 transition-colors duration-300 shadow-[0_10px_40px_-10px_rgba(255,174,0,0.5)] hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.5)]">
            <span>Order Your Pack Now</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1.5">
              <path d="M5 12h14"></path>
              <path d="M13 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </section>

    </div>
  );
}
