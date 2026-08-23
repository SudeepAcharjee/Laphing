"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[90%] max-w-[1000px] animate-[fade-in-up_0.8s_ease-out_2.5s_both]">
      <nav className="relative flex items-center justify-between px-4 md:px-6 py-2.5 bg-[#111111]/90 backdrop-blur-md rounded-full border border-[#FFDE59]/20 shadow-[0_0_30px_rgba(255,222,89,0.05)]">
        
        {/* Logo */}
        <div className="relative w-[120px] h-[35px] md:w-[150px] md:h-[40px] shrink-0">
          <Image src="/logo.svg" alt="The Laphing Co" fill className="object-contain object-left" priority />
        </div>

        {/* Action Buttons & Cart */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          <div className="hidden md:flex items-center gap-3">
            <button className="text-[#FFDE59] border-2 border-[#FFDE59] hover:bg-[#FFDE59] hover:text-black transition-all duration-300 font-bold tracking-widest text-[12px] px-5 py-1.5 rounded-full">
              REFER
            </button>
            <button className="bg-[#FFDE59] text-black px-5 py-2 rounded-full text-[12px] font-bold tracking-widest hover:bg-[#e5c750] transition-colors">
              SIGN UP
            </button>
          </div>
          
          {/* Hamburger Icon (Mobile Only) */}
          <div 
            className="flex md:hidden items-center justify-center cursor-pointer p-1 transition-transform hover:scale-110 active:scale-95"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMobileMenuOpen ? (
                // Close Icon
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                // Hamburger Icon
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </div>
          
          <div className="relative cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center p-1 md:pr-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-1 right-0 md:right-1 bg-[#FFDE59] text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">2</span>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-[120%] left-0 w-full bg-[#111111]/95 backdrop-blur-lg border border-[#FFDE59]/20 rounded-2xl p-5 flex flex-col gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:hidden animate-[fade-in-up_0.3s_ease-out_both]">
          <button className="text-[#FFDE59] border-2 border-[#FFDE59] hover:bg-[#FFDE59] hover:text-black transition-all duration-300 font-bold tracking-widest text-[14px] px-5 py-3 rounded-full w-full">
            REFER
          </button>
          <button className="bg-[#FFDE59] text-black px-5 py-3 rounded-full text-[14px] font-bold tracking-widest hover:bg-[#e5c750] transition-colors w-full shadow-[0_0_20px_rgba(255,222,89,0.2)]">
            SIGN UP
          </button>
        </div>
      )}
    </div>
  );
}
