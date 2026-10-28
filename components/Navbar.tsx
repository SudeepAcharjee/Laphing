"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Gift, ShoppingBag, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const { user, userData, openAuthModal, openReferModal } = useAuth();

  const displayName = userData?.name || user?.displayName || user?.email?.split("@")[0] || "VIP";

  return (
    <header className="sticky top-0 z-50 w-full bg-[#741117] border-b border-black/10 select-none shrink-0 transition-all duration-300 shadow-md">
      <div className="w-full px-4 sm:px-8 md:px-12 h-[56px] sm:h-[64px] md:h-[72px] flex items-center justify-between">
        
        {/* Left: The Laphing Co. Logo */}
        <Link href="/" className="relative flex items-center shrink-0 group">
          <div className="relative w-[115px] h-[36px] sm:w-[140px] sm:h-[42px] md:w-[165px] md:h-[48px] transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logomain.svg"
              alt="The Laphing Co."
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Right Nav Action Items: Refer, Cart, Signup / Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-4 md:gap-5">
          
          {/* 1. Refer Button / Icon */}
          <button
            onClick={openReferModal}
            type="button"
            className="flex items-center gap-1.5 text-white hover:text-[#FFDE59] bg-white/5 hover:bg-white/10 px-2.5 sm:px-3 py-1.5 rounded-full transition-all duration-200 active:scale-95 cursor-pointer"
            title="Refer Friends & Earn Discounts"
          >
            <Gift className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#FFDE59]" />
            <span className="font-inter font-bold text-[12px] sm:text-[14px] tracking-wide">
              Refer
            </span>
          </button>

          {/* 2. Cart Icon */}
          <Link
            href="/checkout"
            aria-label="View Shopping Cart / Pre-orders"
            className="relative flex items-center justify-center text-white hover:text-[#FFDE59] bg-white/5 hover:bg-white/10 w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            title="Cart & Checkout"
          >
            <ShoppingBag className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            {/* Notification pip */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FFDE59] rounded-full animate-pulse" />
          </Link>

          {/* 3. Conditional: Signup Button (Logged Out) OR Avatar Icon (Logged In) */}
          {!user ? (
            <button
              onClick={() => openAuthModal("signup")}
              type="button"
              className="bg-[#FFDE59] hover:bg-[#FFE58A] text-[#81191B] font-inter font-extrabold text-[12px] sm:text-[14px] uppercase tracking-wider px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Signup
            </button>
          ) : (
            <Link
              href="/profile"
              aria-label="Go to User Profile"
              className="flex items-center gap-2 group cursor-pointer text-white hover:text-[#FFDE59] transition-colors bg-white/5 hover:bg-white/10 px-2 sm:px-3 py-1.5 rounded-full"
              title={`Profile (${displayName})`}
            >
              {/* User Avatar Circle */}
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FFDE59] text-[#81191B] flex items-center justify-center font-inter font-black text-[12px] sm:text-[13px] shadow-sm transition-transform group-hover:scale-105">
                <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>

              {/* Username (Desktop) */}
              <span className="font-bebas text-white tracking-[0.08em] text-[16px] sm:text-[18px] uppercase group-hover:text-[#FFDE59] transition-colors leading-none pt-0.5 max-w-[80px] sm:max-w-[130px] truncate hidden xs:inline-block">
                {displayName}
              </span>
            </Link>
          )}

        </div>

      </div>
    </header>
  );
}
