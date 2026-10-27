"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Copy, Check, X, Users, Gift, Share2 } from "lucide-react";

export default function ReferModal() {
  const { isReferModalOpen, closeReferModal, userData, user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!isReferModalOpen || !user) return null;

  const referralCode = userData?.referralCode || "laphing-vip";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://thelaphing.com";
  const referralLink = `${origin}?ref=${referralCode}`;
  const referralsCount = userData?.referralsCount || 0;
  const currentDiscount = userData?.discountAvailable || 20;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(
    `Craving authentic Tibetan Laphing? Use my referral code "${referralCode}" to get 20% off when pre-orders open! ${referralLink}`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeReferModal();
      }}
    >
      <div className="relative w-full max-w-[430px] my-auto bg-[#FFDE59] text-[#741117] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.45)] border-2 border-[#81191B]/20 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={closeReferModal}
          type="button"
          aria-label="Close dialog"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 flex items-center justify-center rounded-full bg-[#81191B]/10 hover:bg-[#81191B] text-[#81191B] hover:text-[#FFDE59] transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon & Heading */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#81191B] text-[#FFDE59] flex items-center justify-center mb-3 shadow-md">
            <Gift className="w-7 h-7" />
          </div>

          <h3 className="font-inter font-black text-[#81191B] text-[24px] sm:text-[26px] leading-tight uppercase tracking-tight">
            Share The Spice
          </h3>
          <p className="font-inter font-medium text-[#741117]/85 text-[13px] sm:text-[14px] mt-1 max-w-[320px] leading-snug">
            Get 20% OFF on signup. Refer 2 friends to unlock an extra +10% OFF (up to 30% OFF total)!
          </p>
        </div>

        {/* Perk Badges */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-[#FFFBF0] rounded-2xl p-3 border border-[#81191B]/20 text-center">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#81191B]/70">
              Your Discount
            </span>
            <span className="font-inter font-black text-[24px] text-[#81191B] leading-tight block mt-0.5">
              {currentDiscount}% OFF
            </span>
          </div>

          <div className="bg-[#FFFBF0] rounded-2xl p-3 border border-[#81191B]/20 text-center">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#81191B]/70">
              Friends Joined
            </span>
            <span className="font-inter font-black text-[24px] text-[#81191B] leading-tight block mt-0.5">
              {Math.min(referralsCount, 2)} / 2
            </span>
          </div>
        </div>

        {/* Referral Status Progress Notice */}
        <div className="mb-4 px-3 py-2 rounded-xl bg-[#FFFBF0]/90 border border-[#81191B]/20 text-center text-[12px] font-semibold text-[#81191B] shadow-inner">
          {referralsCount >= 2 ? (
            <span className="text-emerald-700 flex items-center justify-center gap-1.5 font-bold">
              <Check className="w-4 h-4 stroke-[3]" />
              Goal reached! Your +10% bonus is active (30% OFF total).
            </span>
          ) : referralsCount === 1 ? (
            <span>
              🔥 1 friend joined! Need <strong>1 more friend</strong> to unlock +10% OFF.
            </span>
          ) : (
            <span>
              Invite <strong>2 friends</strong> to unlock an extra <strong>+10% OFF</strong>.
            </span>
          )}
        </div>

        {/* Referral Link Copy Area */}
        <div className="mb-4">
          <label className="block text-[12px] font-bold uppercase tracking-wider text-[#81191B] mb-1.5 ml-1">
            Your Unique Referral Link
          </label>
          <div className="flex items-center gap-2 bg-[#FFFBF0] border border-[#81191B]/30 rounded-xl p-1.5 shadow-inner">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full bg-transparent text-[#580F13] text-[13px] font-medium px-2.5 outline-none truncate"
            />
            <button
              onClick={handleCopy}
              type="button"
              className="shrink-0 flex items-center gap-1.5 bg-[#81191B] hover:bg-[#681315] text-[#FFDE59] px-3.5 py-2 rounded-lg font-inter font-bold text-[12px] uppercase tracking-wide transition-all active:scale-95 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Share via WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-inter font-bold text-[14px] uppercase tracking-wide py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span>Share to WhatsApp</span>
        </a>

      </div>
    </div>
  );
}
