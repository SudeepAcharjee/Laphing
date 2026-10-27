"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import LaphingGuideSection from "@/components/LaphingGuideSection";

export default function Home() {
  const { openAuthModal } = useAuth();

  return (
    <div className="relative min-h-screen w-full bg-[#741117] font-sans text-white flex flex-col select-none overflow-x-hidden">
      {/* ================= MAROON & CREAM NAVBAR ================= */}
      <Navbar />

      <main className="flex-1 w-full">
        {/* ================= HERO SECTION & H1 ================= */}
        <section className="relative w-full bg-[#741117]">
          <h1 className="sr-only">
            The Laphing Co. | Authentic Tibetan Spicy Cold Noodles &amp; Soupy Laphing at Home | Majnu Ka Tilla Delhi Street Food
          </h1>
          <Image
            src="/hero.png"
            alt="The Laphing Co. - Authentic Tibetan Spicy Cold Noodles and Soupy Laphing with Artisanal Chilli Oil"
            width={1440}
            height={810}
            priority
            quality={100}
            className="w-full h-auto block"
            sizes="100vw"
          />
        </section>

      {/* ================= CALLOUT BANNER ================= */}
      <section className="relative w-full bg-[#6B1319] select-none border-t border-black/10">
        <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-10 md:px-16 lg:px-20 py-6 sm:py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          
          {/* Headline: Prominent Main Heading + Stylized Accent */}
          <h2 className="flex flex-wrap items-baseline justify-center md:justify-start gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-1.5 drop-shadow-sm text-center md:text-left">
            <span className="font-inter font-black text-white text-[22px] min-[360px]:text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px] xl:text-[44px] tracking-tight uppercase leading-none inline-flex items-baseline gap-x-3 sm:gap-x-4 md:gap-x-5 lg:gap-x-6">
              <span>CRAVING</span>
              <span>LAPHING?</span>
            </span>
            <span className="font-slackey text-[#FFDE59] text-[18px] min-[360px]:text-[20px] sm:text-[24px] md:text-[27px] lg:text-[30px] xl:text-[32px] tracking-normal uppercase leading-none">
              WE GET IT.
            </span>
          </h2>

          {/* Action Button */}
          <button
            onClick={() => openAuthModal("signup")}
            type="button"
            className="w-auto shrink-0 inline-flex items-center justify-center bg-[#FFDE59] hover:bg-[#FFE58A] text-[#741117] font-inter font-bold text-[14px] sm:text-[18px] tracking-wide px-7 sm:px-10 py-3 sm:py-4 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,222,89,0.35)] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] text-center cursor-pointer"
          >
            Join the waitlist
          </button>
        </div>
      </section>

      {/* ================= SECTION 2: WHAT'S INSIDE THIS BADDIE? ================= */}
      <section className="relative w-full overflow-hidden select-none bg-[#FFDD6E]">
        {/* Subtle Central Backdrop Shape Framing Pouch - Desktop Only */}
        <div className="hidden md:flex absolute inset-0 w-full h-full pointer-events-none items-center justify-center">
          <svg className="w-full h-full max-w-[1440px]" viewBox="0 0 1440 1120" fill="none" preserveAspectRatio="none">
            <path
              d="M 480 180 C 510 500, 440 800, 360 1120 L 1080 1120 C 1000 800, 930 500, 960 180 Z"
              fill="rgba(255, 255, 255, 0.22)"
            />
          </svg>
        </div>

        {/* ================= DESKTOP & TABLET STAGE (768px+) - Exact Figma Proportions ================= */}
        <div className="hidden md:block relative w-full max-w-[1440px] aspect-[1440/1120] mx-auto z-10">

          {/* SVG Connector Trails & Sparkles */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10" viewBox="0 0 1440 1120" fill="none">
            {/* Flavour-trail-0 (Chilli Sauce to Pouch) */}
            <path 
              d="M 350 320 C 410 335, 470 345, 525 335" 
              stroke="#81191B" 
              strokeWidth="3.2" 
              strokeDasharray="4 6" 
              opacity="0.8" 
              strokeLinecap="round" 
            />
            
            {/* Flavour-trail-1 (Soya Granules to Pouch) */}
            <path 
              d="M 370 550 C 420 555, 470 550, 520 540" 
              stroke="#81191B" 
              strokeWidth="3.2" 
              strokeDasharray="4 6" 
              opacity="0.8" 
              strokeLinecap="round" 
            />
            
            {/* Flavour-trail-2 (Laphing Sheets to Card/Shadow left) */}
            <path 
              d="M 380 810 C 425 815, 460 805, 495 775" 
              stroke="#81191B" 
              strokeWidth="3.2" 
              strokeDasharray="4 6" 
              opacity="0.8" 
              strokeLinecap="round" 
            />
            
            {/* Flavour-trail-3 (Wai Wai Noodles to Pouch) */}
            <path 
              d="M 1060 325 C 1010 338, 960 342, 915 340" 
              stroke="#81191B" 
              strokeWidth="3.2" 
              strokeDasharray="4 6" 
              opacity="0.8" 
              strokeLinecap="round" 
            />
            
            {/* Flavour-trail-4 (Sauce Mix to Pouch / Shadow right) */}
            <path 
              d="M 1065 550 C 1015 555, 965 550, 920 545" 
              stroke="#81191B" 
              strokeWidth="3.2" 
              strokeDasharray="4 6" 
              opacity="0.8" 
              strokeLinecap="round" 
            />
            
            {/* Flavour-trail-5 (Garlic Flakes to Card right) */}
            <path 
              d="M 1060 810 C 1015 805, 975 795, 940 775" 
              stroke="#81191B" 
              strokeWidth="3.2" 
              strokeDasharray="4 6" 
              opacity="0.8" 
              strokeLinecap="round" 
            />

            {/* Top Accents / Dash Marks */}
            {/* Top-Left under subtitle */}
            <line x1="435" y1="185" x2="442" y2="215" stroke="#81191B" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="472" y1="175" x2="467" y2="215" stroke="#81191B" strokeWidth="4.5" strokeLinecap="round" />

            {/* Top-Right under subtitle */}
            <line x1="920" y1="175" x2="898" y2="210" stroke="#81191B" strokeWidth="4.5" strokeLinecap="round" />

            {/* Bottom-Left Dash Marks (Exact from Screenshot) */}
            <line x1="400" y1="915" x2="422" y2="975" stroke="#81191B" strokeWidth="5.5" strokeLinecap="round" />
            <line x1="380" y1="1050" x2="420" y2="1025" stroke="#81191B" strokeWidth="5.5" strokeLinecap="round" />

            {/* Bottom-Right Dash Marks (Exact from Screenshot) */}
            <line x1="1040" y1="985" x2="1000" y2="1010" stroke="#81191B" strokeWidth="5.5" strokeLinecap="round" />
            <line x1="995" y1="1055" x2="1040" y2="1095" stroke="#81191B" strokeWidth="5.5" strokeLinecap="round" />
          </svg>

          {/* WHAT GOES INTO THE GOOD STUFF */}
          <div 
            className="absolute text-center z-20 pointer-events-none"
            style={{ left: '30%', right: '30%', top: '4.5%' }}
          >
            <span className="font-inter font-bold text-[#81191B] text-[15px] sm:text-[16px] leading-[19px] tracking-wider uppercase block">
              WHAT GOES INTO THE GOOD STUFF
            </span>
          </div>

          {/* What’s inside this Baddie? */}
          <div 
            className="absolute text-center z-20 pointer-events-none"
            style={{ left: '15%', right: '15%', top: '6.8%' }}
          >
            <h2 className="font-inter font-black text-[#81191B] text-[48px] lg:text-[64px] leading-tight tracking-tight block">
              What’s inside this Baddie?
            </h2>
          </div>

          {/* Six little personalities. One big craving. */}
          <div 
            className="absolute text-center z-20 pointer-events-none"
            style={{ left: '25%', right: '25%', top: '14.5%' }}
          >
            <p className="font-inter font-medium text-[#81191B] text-[19px] lg:text-[21px] leading-[26px] block">
              Six little personalities. One big craving.
            </p>
          </div>

          {/* Center Pouch (/about/center.png) */}
          <div 
            className="absolute z-20 transition-transform duration-300 hover:scale-[1.03]"
            style={{
              left: '36.5%',
              right: '36.5%',
              top: '21%',
              bottom: '29.5%',
              transform: 'rotate(-3deg)',
            }}
          >
            <div className="relative w-full h-full drop-shadow-[0_16px_30px_rgba(129,25,27,0.12)]">
              <Image
                src="/about/center.png"
                alt="Laphing Packaging Pouch"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1440px) 28vw, 400px"
              />
            </div>
          </div>

          {/* Oval Pouch Shadow (Warm terracotta-tan ellipse right under pouch bottom) */}
          <div 
            className="absolute pointer-events-none z-15"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              top: '68%',
              width: '360px',
              height: '68px',
              backgroundColor: 'rgba(129, 25, 27, 0.14)',
              borderRadius: '50%',
              opacity: 0.88,
              filter: 'blur(3px)',
            }}
          />

          {/* Badge: Ready in 5 mins! (Compact smaller box, positioned lower down, rotated 4.5deg) */}
          <div 
            className="absolute z-20 flex items-center justify-center rounded-[14px] shadow-[0_10px_24px_rgba(130,80,60,0.08)] border border-[#EFE5D5] transition-transform duration-300 hover:scale-105"
            style={{
              left: '50%',
              transform: 'translateX(-50%) rotate(4.5deg)',
              top: '77%',
              width: '335px',
              height: '70px',
              backgroundColor: '#FFFDF6',
            }}
          >
            <span className="font-inter font-bold text-[#81191B] text-[22px] lg:text-[25px] leading-none tracking-normal text-center select-none px-4 py-1">
              Ready in 5 mins!
            </span>
          </div>

          {/* 1. Chilli Sauce (1.svg) - Top-Left (Scaled down & balanced) */}
          <div 
            className="absolute z-20 transition-transform duration-300 hover:scale-105 cursor-pointer"
            style={{
              left: '9%',
              top: '20%',
              width: '15.5%',
              height: '18.5%',
            }}
          >
            <div className="relative w-full h-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
              <Image
                src="/about/1.svg"
                alt="Chilli Sauce Character"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>

          {/* 2. Soya Granules (5.svg) - Middle-Left */}
          <div 
            className="absolute z-20 transition-transform duration-300 hover:scale-105 cursor-pointer"
            style={{
              left: '7%',
              top: '45%',
              width: '19.5%',
              height: '17.5%',
            }}
          >
            <div className="relative w-full h-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
              <Image
                src="/about/5.svg"
                alt="Soya Granules Character"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>

          {/* 3. Laphing Sheets (6.svg) - Bottom-Left */}
          <div 
            className="absolute z-20 transition-transform duration-300 hover:scale-105 cursor-pointer"
            style={{
              left: '7%',
              top: '68%',
              width: '20%',
              height: '18%',
            }}
          >
            <div className="relative w-full h-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
              <Image
                src="/about/6.svg"
                alt="Laphing Sheets Character"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>

          {/* 4. Wai Wai Noodles (4.svg) - Top-Right (Scaled down & balanced) */}
          <div 
            className="absolute z-20 transition-transform duration-300 hover:scale-105 cursor-pointer"
            style={{
              left: '74%',
              top: '20%',
              width: '16%',
              height: '18.5%',
            }}
          >
            <div className="relative w-full h-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
              <Image
                src="/about/4.svg"
                alt="Wai Wai Noodles Character"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>

          {/* 5. Sauce Mix (2.svg) - Middle-Right */}
          <div 
            className="absolute z-20 transition-transform duration-300 hover:scale-105 cursor-pointer"
            style={{
              left: '74%',
              top: '45%',
              width: '16%',
              height: '18%',
            }}
          >
            <div className="relative w-full h-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
              <Image
                src="/about/2.svg"
                alt="Sauce Mix Character"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>

          {/* 6. Garlic Flakes (3.svg) - Bottom-Right */}
          <div 
            className="absolute z-20 transition-transform duration-300 hover:scale-105 cursor-pointer"
            style={{
              left: '74%',
              top: '68%',
              width: '16.5%',
              height: '17%',
            }}
          >
            <div className="relative w-full h-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
              <Image
                src="/about/3.svg"
                alt="Garlic Flakes Character"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>

        </div>

        {/* ================= MOBILE STAGE (< 768px) - Exact Same UI as Desktop ================= */}
        <div className="md:hidden relative z-10 w-full max-w-[480px] mx-auto px-2 pt-8 pb-10 flex flex-col items-center">
          
          {/* Mobile Header */}
          <div className="text-center mb-4 px-3">
            <span className="font-inter font-bold text-[#81191B] text-[11px] tracking-widest uppercase block mb-1">
              WHAT GOES INTO THE GOOD STUFF
            </span>
            <h2 className="font-inter font-black text-[#81191B] text-[26px] xs:text-[30px] leading-[1.08] tracking-tight block mb-1.5">
              What’s inside this Baddie?
            </h2>
            <p className="font-inter font-medium text-[#81191B] text-[13px] xs:text-[14px] block">
              Six little personalities. One big craving.
            </p>
          </div>

          {/* Mobile Interactive Stage - 1:1 Matching Desktop Layout */}
          <div className="relative w-full aspect-[390/490] max-h-[520px]">
            
            {/* Mobile SVG Connector Trails & Backdrop */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
              viewBox="0 0 390 490"
              fill="none"
            >
              {/* Central White Trapezoid/Curved Backdrop */}
              <path
                d="M 132 15 C 142 160, 120 330, 98 470 L 292 470 C 270 330, 248 160, 258 15 Z"
                fill="rgba(255, 255, 255, 0.22)"
              />

              {/* Trail 0: Top-Left (Chilli Sauce to Pouch) */}
              <path
                d="M 96 112 C 114 116, 130 120, 144 116"
                stroke="#81191B"
                strokeWidth="2.2"
                strokeDasharray="3 4"
                opacity="0.8"
                strokeLinecap="round"
              />

              {/* Trail 1: Mid-Left (Soya Granules to Pouch) */}
              <path
                d="M 102 232 C 118 235, 132 232, 144 227"
                stroke="#81191B"
                strokeWidth="2.2"
                strokeDasharray="3 4"
                opacity="0.8"
                strokeLinecap="round"
              />

              {/* Trail 2: Bottom-Left (Laphing Sheets to Pouch) */}
              <path
                d="M 104 358 C 118 360, 132 352, 144 340"
                stroke="#81191B"
                strokeWidth="2.2"
                strokeDasharray="3 4"
                opacity="0.8"
                strokeLinecap="round"
              />

              {/* Trail 3: Top-Right (Wai Wai to Pouch) */}
              <path
                d="M 292 114 C 276 120, 260 122, 246 118"
                stroke="#81191B"
                strokeWidth="2.2"
                strokeDasharray="3 4"
                opacity="0.8"
                strokeLinecap="round"
              />

              {/* Trail 4: Mid-Right (Sauce Mix to Pouch) */}
              <path
                d="M 288 232 C 272 235, 258 232, 246 228"
                stroke="#81191B"
                strokeWidth="2.2"
                strokeDasharray="3 4"
                opacity="0.8"
                strokeLinecap="round"
              />

              {/* Trail 5: Bottom-Right (Garlic Flakes to Pouch) */}
              <path
                d="M 286 358 C 272 355, 258 348, 246 340"
                stroke="#81191B"
                strokeWidth="2.2"
                strokeDasharray="3 4"
                opacity="0.8"
                strokeLinecap="round"
              />

              {/* Top Accent Lines */}
              <line x1="120" y1="16" x2="124" y2="30" stroke="#81191B" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="135" y1="12" x2="133" y2="30" stroke="#81191B" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="262" y1="12" x2="254" y2="28" stroke="#81191B" strokeWidth="2.5" strokeLinecap="round" />

              {/* Bottom Accent Lines */}
              <line x1="108" y1="410" x2="116" y2="432" stroke="#81191B" strokeWidth="3" strokeLinecap="round" />
              <line x1="100" y1="452" x2="118" y2="442" stroke="#81191B" strokeWidth="3" strokeLinecap="round" />
              <line x1="282" y1="425" x2="265" y2="438" stroke="#81191B" strokeWidth="3" strokeLinecap="round" />
              <line x1="264" y1="455" x2="280" y2="472" stroke="#81191B" strokeWidth="3" strokeLinecap="round" />
            </svg>

            {/* Central Pouch (Scaled appropriately for mobile) */}
            <div
              className="absolute z-20 transition-transform duration-300 hover:scale-[1.03]"
              style={{
                left: '33%',
                right: '33%',
                top: '12%',
                bottom: '24%',
                transform: 'rotate(-3deg)',
              }}
            >
              <div className="relative w-full h-full drop-shadow-[0_12px_24px_rgba(129,25,27,0.14)]">
                <Image
                  src="/about/center.png"
                  alt="Laphing Packaging Pouch"
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 140px, 160px"
                />
              </div>
            </div>

            {/* Oval Pouch Shadow */}
            <div
              className="absolute pointer-events-none z-15"
              style={{
                left: '50%',
                transform: 'translateX(-50%)',
                top: '70%',
                width: '130px',
                height: '24px',
                backgroundColor: 'rgba(129, 25, 27, 0.16)',
                borderRadius: '50%',
                filter: 'blur(2px)',
              }}
            />

            {/* Badge: Ready in 5 mins! */}
            <div
              className="absolute z-25 flex items-center justify-center rounded-xl shadow-[0_6px_16px_rgba(130,80,60,0.12)] border border-[#EFE5D5]"
              style={{
                left: '50%',
                transform: 'translateX(-50%) rotate(4.5deg)',
                top: '77%',
                width: '155px',
                height: '40px',
                backgroundColor: '#FFFDF6',
              }}
            >
              <span className="font-inter font-bold text-[#81191B] text-[13px] xs:text-[14px] leading-none tracking-normal text-center select-none px-2">
                Ready in 5 mins!
              </span>
            </div>

            {/* 1. Chilli Sauce (1.svg) - Top-Left */}
            <div
              className="absolute z-20 transition-transform duration-300 active:scale-95"
              style={{
                left: '2.5%',
                top: '9%',
                width: '24.5%',
                height: '21%',
              }}
            >
              <div className="relative w-full h-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.06)]">
                <Image
                  src="/about/1.svg"
                  alt="Chilli Sauce"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </div>

            {/* 2. Soya Granules (5.svg) - Middle-Left */}
            <div
              className="absolute z-20 transition-transform duration-300 active:scale-95"
              style={{
                left: '1%',
                top: '36%',
                width: '27.5%',
                height: '21%',
              }}
            >
              <div className="relative w-full h-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.06)]">
                <Image
                  src="/about/5.svg"
                  alt="Soya Granules"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </div>

            {/* 3. Laphing Sheets (6.svg) - Bottom-Left */}
            <div
              className="absolute z-20 transition-transform duration-300 active:scale-95"
              style={{
                left: '1%',
                top: '63%',
                width: '28%',
                height: '21%',
              }}
            >
              <div className="relative w-full h-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.06)]">
                <Image
                  src="/about/6.svg"
                  alt="Laphing Sheets"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </div>

            {/* 4. Wai Wai Noodles (4.svg) - Top-Right */}
            <div
              className="absolute z-20 transition-transform duration-300 active:scale-95"
              style={{
                right: '2.5%',
                top: '9%',
                width: '24.5%',
                height: '21%',
              }}
            >
              <div className="relative w-full h-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.06)]">
                <Image
                  src="/about/4.svg"
                  alt="Wai Wai Noodles"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </div>

            {/* 5. Sauce Mix (2.svg) - Middle-Right */}
            <div
              className="absolute z-20 transition-transform duration-300 active:scale-95"
              style={{
                right: '2.5%',
                top: '36%',
                width: '24.5%',
                height: '21%',
              }}
            >
              <div className="relative w-full h-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.06)]">
                <Image
                  src="/about/2.svg"
                  alt="Sauce Mix"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </div>

            {/* 6. Garlic Flakes (3.svg) - Bottom-Right */}
            <div
              className="absolute z-20 transition-transform duration-300 active:scale-95"
              style={{
                right: '2%',
                top: '63%',
                width: '25%',
                height: '20.5%',
              }}
            >
              <div className="relative w-full h-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.06)]">
                <Image
                  src="/about/3.svg"
                  alt="Garlic Flakes"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ================= SECTION 3: GET ON THE LIST (Waitlist & Discount) ================= */}
      <section className="relative w-full overflow-hidden select-none bg-[#81191B] lg:bg-gradient-to-r lg:from-[#81191B] lg:from-60% lg:to-[#FFDD6E] lg:to-60%">
        
        {/* ================= DESKTOP STAGE (1024px+) - Full width stage matching 20%offbg.png ================= */}
        <div className="hidden lg:block relative w-full aspect-[1440/880] mx-auto">
          
          {/* Section Background (20%offbg.png) */}
          <Image
            src="/20%25offbg.png"
            alt="Get on the List Background"
            fill
            priority
            unoptimized
            className="w-full h-full object-cover pointer-events-none select-none z-0"
            sizes="100vw"
          />

          {/* Left Content Column */}
          <div 
            className="absolute z-10 flex flex-col justify-center"
            style={{
              left: '9%',
              top: '5%',
              bottom: '5%',
              width: '45%',
            }}
          >
            {/* Eyebrow */}
            <span className="font-inter font-bold text-white text-[12px] xl:text-[13px] 2xl:text-[14px] tracking-[0.12em] uppercase block mb-2 xl:mb-2.5">
              YOUR NEXT CRAVING STARTS HERE
            </span>

            {/* Main Headline */}
            <h2 className="font-inter font-bold text-white text-[34px] xl:text-[42px] 2xl:text-[48px] leading-[1.08] tracking-tight block mb-5 xl:mb-6">
              Get on the List (it’s free)
            </h2>

            {/* Tier 1: 20% OFF */}
            <div className="mb-4 xl:mb-5">
              <span className="font-inter font-black text-[#FFDE6E] text-[56px] xl:text-[70px] 2xl:text-[78px] leading-none tracking-tight block mb-1 xl:mb-1.5">
                20% OFF
              </span>
              <p className="font-inter font-medium text-white text-[15px] xl:text-[17px] 2xl:text-[18px] block">
                Join the waitlist, save when you pre-order
              </p>
            </div>

            {/* CTA Button */}
            <div className="mb-4 xl:mb-5">
              <button
                onClick={() => openAuthModal("signup")}
                type="button"
                className="inline-flex items-center gap-2.5 bg-[#FFDE6E] hover:bg-[#FFE58A] text-[#81191B] font-inter font-black text-[13px] xl:text-[15px] tracking-wide uppercase px-7 xl:px-8 py-3 xl:py-3.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <span>JOIN THE WAITLIST</span>
                <span className="text-[17px] xl:text-[19px] font-bold leading-none">&rarr;</span>
              </button>
            </div>

            {/* Offer Subtext & Divider Line */}
            <div className="w-full max-w-[380px] xl:max-w-[420px] mb-4 xl:mb-5">
              <p className="font-inter font-bold text-white text-[14px] xl:text-[16px] tracking-tight mb-2">
                Get up to 30% off on pre-orders
              </p>
              <div className="w-full h-[1.5px] bg-white/35" />
            </div>

            {/* Tier 2: +10% OFF */}
            <div>
              <span className="font-inter font-black text-[#FFDE6E] text-[56px] xl:text-[70px] 2xl:text-[78px] leading-none tracking-tight block mb-1 xl:mb-1.5">
                +10% OFF
              </span>
              <p className="font-inter font-medium text-white text-[15px] xl:text-[17px] 2xl:text-[18px] block">
                Share your referral code with 2 friends.
              </p>
            </div>
          </div>

          {/* Right Content Column: Packaging Pouch (pack.png) */}
          <div 
            className="absolute z-10 transition-transform duration-300 hover:scale-[1.02]"
            style={{
              left: '58%',
              top: '10%',
              width: '33%',
              height: '80%',
            }}
          >
            <div className="relative w-full h-full">
              {/* Top-left tick marks (//) */}
              <div className="absolute -top-3 -left-6 pointer-events-none z-20">
                <svg width="40" height="36" viewBox="0 0 40 36" fill="none">
                  <line x1="8" y1="26" x2="22" y2="6" stroke="#FFDE6E" strokeWidth="3" strokeLinecap="round" />
                  <line x1="22" y1="30" x2="36" y2="10" stroke="#FFDE6E" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              {/* Bottom-right tick mark (\) */}
              <div className="absolute -bottom-2 -right-6 pointer-events-none z-20">
                <svg width="34" height="28" viewBox="0 0 34 28" fill="none">
                  <line x1="6" y1="6" x2="28" y2="22" stroke="#FFDE6E" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              {/* Pouch Image with subtle drop shadow and white contour */}
              <Image
                src="/pack.png"
                alt="Laphing Packaging Pouch"
                fill
                priority
                className="object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)]"
                sizes="(max-width: 1024px) 100vw, 35vw"
              />
            </div>
          </div>

        </div>

        {/* ================= MOBILE & TABLET STACK (< 1024px) ================= */}
        <div className="lg:hidden relative z-10 w-full py-10 sm:py-14 px-4 xs:px-6 sm:px-10 flex flex-col items-center">
          {/* Background image covering mobile section - shifted to show only the maroon sunburst rays */}
          <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
            <Image
              src="/20%25offbg.png"
              alt="Background"
              fill
              unoptimized
              className="object-cover object-left sm:object-[15%_center] w-full h-full"
            />
          </div>

          {/* Top Header */}
          <div className="text-center max-w-[600px] mb-3 sm:mb-5">
            <span className="font-inter font-bold text-white text-[11px] sm:text-[13px] tracking-[0.14em] uppercase block mb-1.5 sm:mb-2.5">
              YOUR NEXT CRAVING STARTS HERE
            </span>
            <h2 className="font-inter font-bold text-white text-[26px] xs:text-[32px] sm:text-[40px] leading-[1.1] tracking-tight block">
              Get on the List (it’s free)
            </h2>
          </div>

          {/* Center Packaging Pouch on Mobile (pack.png) */}
          <div className="relative w-full max-w-[200px] xs:max-w-[240px] sm:max-w-[280px] aspect-[498/640] my-2 sm:my-3">
            {/* Top-left tick marks */}
            <div className="absolute -top-3 -left-3 pointer-events-none z-20">
              <svg width="30" height="26" viewBox="0 0 40 36" fill="none">
                <line x1="8" y1="26" x2="22" y2="6" stroke="#FFDE6E" strokeWidth="3" strokeLinecap="round" />
                <line x1="22" y1="30" x2="36" y2="10" stroke="#FFDE6E" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            {/* Bottom-right tick mark */}
            <div className="absolute -bottom-2 -right-3 pointer-events-none z-20">
              <svg width="26" height="22" viewBox="0 0 34 28" fill="none">
                <line x1="6" y1="6" x2="28" y2="22" stroke="#FFDE6E" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <Image
              src="/pack.png"
              alt="Laphing Packaging Pouch"
              fill
              priority
              className="object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)]"
              sizes="(max-width: 640px) 220px, 280px"
            />
          </div>

          {/* Offers Container */}
          <div className="w-full max-w-[480px] flex flex-col items-center text-center mt-2 sm:mt-3">
            
            {/* 20% OFF */}
            <div className="mb-3.5 sm:mb-5">
              <span className="font-inter font-black text-[#FFDE6E] text-[44px] xs:text-[52px] sm:text-[64px] leading-none tracking-tight block mb-1">
                20% OFF
              </span>
              <p className="font-inter font-medium text-white text-[14px] xs:text-[15px] sm:text-[17px] block">
                Join the waitlist, save when you pre-order
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => openAuthModal("signup")}
              type="button"
              className="w-full max-w-[280px] justify-center inline-flex items-center gap-2 bg-[#FFDE6E] hover:bg-[#FFE58A] text-[#81191B] font-inter font-black text-[13px] xs:text-[14px] tracking-wide uppercase px-6 py-3 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:scale-105 active:scale-95 transition-all duration-200 mb-3.5 sm:mb-5 cursor-pointer"
            >
              <span>JOIN THE WAITLIST</span>
              <span className="text-[17px] font-bold leading-none">&rarr;</span>
            </button>

            {/* Offer Subtext & Divider Line */}
            <div className="w-full max-w-[300px] sm:max-w-[340px] mb-3.5 sm:mb-5">
              <p className="font-inter font-bold text-white text-[13px] sm:text-[15px] tracking-tight mb-2">
                Get up to 30% off on pre-orders
              </p>
              <div className="w-full h-[1.5px] bg-white/35" />
            </div>

            {/* +10% OFF */}
            <div>
              <span className="font-inter font-black text-[#FFDE6E] text-[44px] xs:text-[52px] sm:text-[64px] leading-none tracking-tight block mb-1">
                +10% OFF
              </span>
              <p className="font-inter font-medium text-white text-[14px] xs:text-[15px] sm:text-[17px] block">
                Share your referral code with 2 friends.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ================= SECTION 4: THE PEOPLE BEHIND THE CHAOS ================= */}
      <section className="relative w-full bg-[#FFDD6E] text-[#81191B] py-10 sm:py-14 md:py-20 lg:py-24 px-4 xs:px-6 sm:px-10 md:px-14 lg:px-20 overflow-hidden select-none">
        <div className="w-full max-w-[1140px] mx-auto flex flex-col justify-between">
          
          {/* Header Info - Left-aligned */}
          <div className="w-full text-left mb-8 sm:mb-12 md:mb-14">
            {/* Eyebrow */}
            <span className="font-inter font-bold text-[#81191B] text-[12px] sm:text-[14px] md:text-[15px] tracking-[0.02em] block mb-1.5 sm:mb-2.5">
              Crafted with intense love for spice
            </span>

            {/* Main Headline */}
            <h2 className="font-inter font-black text-[#81191B] text-[28px] xs:text-[36px] sm:text-[48px] md:text-[60px] lg:text-[74px] leading-[0.96] tracking-tight uppercase block">
              THE PEOPLE<br />
              BEHIND THE CHAOS
            </h2>
          </div>

          {/* Polaroids Display Stage */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10 md:gap-12 lg:gap-16 w-full my-auto py-2 sm:py-4">
            
            {/* Hand-drawn connecting arrow: Centered between Card 1 and Card 2 on Desktop */}
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <svg
                width="110"
                height="48"
                viewBox="0 0 110 48"
                fill="none"
                className="w-[85px] sm:w-[95px] md:w-[105px] lg:w-[115px] h-auto text-[#81191B]"
              >
                {/* Playful curved arrow */}
                <path
                  d="M 8 28 C 35 12, 75 12, 100 24"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Directional Arrowhead */}
                <path
                  d="M 84 30 L 100 24 L 90 12"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>

            {/* Left Polaroid */}
            <div className="relative w-full max-w-[290px] xs:max-w-[330px] sm:max-w-[390px] md:max-w-[440px] lg:max-w-[465px] bg-[#FFF5DB] border-[1.5px] border-[#81191B] rounded-[6px] p-3.5 xs:p-4 sm:p-5 pb-5 sm:pb-7 shadow-[0_12px_28px_rgba(129,25,27,0.12)] transition-transform duration-300 hover:scale-[1.02] cursor-pointer rotate-[-1.5deg] md:rotate-[-3.5deg]">
              {/* Photo Area */}
              <div className="relative w-full aspect-[4/3.8] bg-[#E7D5B7] border border-[#81191B]/40 flex flex-col items-center justify-center p-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#81191B" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span className="font-inter font-bold text-[#81191B] text-[11px] sm:text-[12px] md:text-[13px] tracking-wider uppercase mt-2.5 text-center">
                  FOUNDER PHOTO / VIDEO
                </span>
              </div>
              {/* Caption */}
              <p className="font-inter font-bold text-[#81191B] text-[16px] xs:text-[17px] sm:text-[19px] md:text-[20px] mt-3.5 sm:mt-5 text-left leading-tight">
                Meet the flavour makers.
              </p>
            </div>

            {/* Hand-drawn connecting arrow: Downward on Mobile */}
            <div className="flex md:hidden items-center justify-center -my-2 sm:-my-3 pointer-events-none text-[#81191B]">
              <svg
                width="36"
                height="44"
                viewBox="0 0 36 44"
                fill="none"
                className="w-7 h-auto"
              >
                <path
                  d="M 18 4 C 24 16, 12 24, 18 36"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 12 28 L 18 37 L 24 28"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>

            {/* Right Polaroid */}
            <div className="relative w-full max-w-[290px] xs:max-w-[330px] sm:max-w-[390px] md:max-w-[440px] lg:max-w-[465px] bg-[#FFF5DB] border-[1.5px] border-[#81191B] rounded-[6px] p-3.5 xs:p-4 sm:p-5 pb-5 sm:pb-7 shadow-[0_12px_28px_rgba(129,25,27,0.12)] transition-transform duration-300 hover:scale-[1.02] cursor-pointer rotate-[1.5deg] md:rotate-[3deg]">
              {/* Photo Area */}
              <div className="relative w-full aspect-[4/3.8] bg-[#E7D5B7] border border-[#81191B]/40 flex flex-col items-center justify-center p-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#81191B" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span className="font-inter font-bold text-[#81191B] text-[11px] sm:text-[12px] md:text-[13px] tracking-wider uppercase mt-2.5 text-center">
                  BEHIND THE SCENES
                </span>
              </div>
              {/* Caption */}
              <p className="font-inter font-bold text-[#81191B] text-[16px] xs:text-[17px] sm:text-[19px] md:text-[20px] mt-3.5 sm:mt-5 text-left leading-tight">
                A little chaos. A lot of flavour.
              </p>
            </div>

          </div>

          {/* Centered Sign-off */}
          <div className="relative w-full pt-6 sm:pt-10 md:pt-12 flex items-center justify-center">
            {/* Bottom Centered Text */}
            <p className="font-inter font-medium text-[#81191B] text-[13px] sm:text-[15px] md:text-[16px] text-center">
              From our kitchen to your next craving.
            </p>
          </div>

        </div>
      </section>

      {/* ================= SECTION 5: LAPHING GUIDE (SEO / AEO / GEO) ================= */}
      <LaphingGuideSection />
    </main>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}
