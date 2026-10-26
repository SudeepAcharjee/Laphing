"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  Package,
  Sparkles,
  ArrowLeft,
  Bell,
  Clock,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Gift,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const { openAuthModal } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [discountPercent, setDiscountPercent] = useState(20);

  // Product state
  const [productDetails, setProductDetails] = useState({
    name: "Laphing Signature Pack",
    description: "Authentic Tibetan Cold Noodles. Spicy, Tangy, Addictive.",
    price: 499,
    imageUrl: "/pack.png",
  });

  // 1. Fetch live product details from Firestore settings
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "settings", "product");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as any;
          setProductDetails({
            name: data.name || "Laphing Signature Pack",
            description:
              data.description ||
              "Authentic Tibetan Cold Noodles. Spicy, Tangy, Addictive.",
            price: data.price || 499,
            imageUrl: data.imageUrl || "/pack.png",
          });
        }
      } catch (err) {
        console.error("Error fetching product", err);
      }
    };
    fetchProduct();
  }, []);

  // 2. Fetch logged in user and details
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setDiscountPercent(data.discountAvailable || 20);
            setUserName(data.name || "");
          }
        } catch (err) {
          console.error("Error fetching user data", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#741117] text-white flex flex-col justify-between select-none">
      {/* Brand Navbar */}
      <Navbar />

      {/* Main Content Stage */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-16 flex-1 flex flex-col items-center justify-center">
        
        {/* Coming Soon Hero Card */}
        <div className="w-full bg-[#401316] border-2 border-[#81191B] rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.45)] relative overflow-hidden text-center animate-in fade-in zoom-in-95 duration-200">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-[#FFDE59]/10 blur-[90px] pointer-events-none rounded-full" />

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFDE59]/15 border border-[#FFDE59]/30 text-[#FFDE59] text-xs sm:text-sm font-black uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FFDE59] animate-ping" />
            <Clock className="w-3.5 h-3.5" />
            <span>Coming Soon</span>
          </div>

          {/* Heading */}
          <h1 className="font-inter font-black text-white text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight leading-tight max-w-3xl mx-auto">
            Online Ordering Is <span className="text-[#FFDE59]">Dropping Soon!</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-white/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            We are fine-tuning our temperature-controlled cold dispatch & small-batch Tibetan noodle kitchen so every bite lands on your doorstep ice-cold, savory, and tongue-numbingly spicy.
          </p>

          {/* Product Preview Box */}
          <div className="mt-8 max-w-xl mx-auto bg-[#2D0D10] border border-[#81191B] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 text-left">
            <div className="relative w-24 h-28 bg-[#540B10] rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-[#81191B]">
              <Image
                src={productDetails.imageUrl || "/pack.png"}
                alt={productDetails.name}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-[#FFDE59] bg-[#FFDE59]/15 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Signature Batch
                </span>
                <span className="text-white/50 text-xs">• 2 Servings</span>
              </div>
              <h3 className="font-inter font-black text-white text-lg truncate">
                {productDetails.name}
              </h3>
              <p className="text-white/70 text-xs mt-0.5 line-clamp-2 leading-relaxed">
                {productDetails.description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-inter font-black text-[#FFDE59] text-xl">
                  ₹{productDetails.price}
                </span>
                <span className="text-white/60 text-xs flex items-center gap-1 font-medium">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Chili crunch & sauce included
                </span>
              </div>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mt-6 text-left">
            <div className="bg-[#2D0D10]/70 border border-[#81191B]/60 rounded-xl p-3.5 flex items-start gap-2.5">
              <span className="text-lg">❄️</span>
              <div>
                <p className="text-white text-xs font-bold">Cold Pack Dispatch</p>
                <p className="text-white/60 text-[11px] leading-snug">Temperature safe delivery</p>
              </div>
            </div>
            <div className="bg-[#2D0D10]/70 border border-[#81191B]/60 rounded-xl p-3.5 flex items-start gap-2.5">
              <span className="text-lg">🌶️</span>
              <div>
                <p className="text-white text-xs font-bold">Fresh Small Batches</p>
                <p className="text-white/60 text-[11px] leading-snug">Handmade cold noodles</p>
              </div>
            </div>
            <div className="bg-[#2D0D10]/70 border border-[#81191B]/60 rounded-xl p-3.5 flex items-start gap-2.5">
              <span className="text-lg">🥢</span>
              <div>
                <p className="text-white text-xs font-bold">Ready in 2 Mins</p>
                <p className="text-white/60 text-[11px] leading-snug">Sauce, mix & slurp</p>
              </div>
            </div>
          </div>

          {/* User Status / Waitlist Call To Action */}
          <div className="mt-8 max-w-xl mx-auto border-t border-[#81191B] pt-6">
            {user ? (
              <div className="bg-[#2D0D10] border border-[#FFDE59]/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFDE59] text-[#741117] flex items-center justify-center shrink-0 font-black">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">
                      You are on the priority list{userName ? `, ${userName}` : ""}!
                    </p>
                    <p className="text-[#FFDE59] text-xs font-semibold flex items-center gap-1.5 mt-0.5">
                      <Gift className="w-3.5 h-3.5" />
                      <span>{discountPercent}% launch discount saved in your account</span>
                    </p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#FFDE59] hover:bg-[#ffe37a] text-[#741117] font-inter font-black text-xs uppercase tracking-wider text-center transition-all shrink-0 shadow-md"
                >
                  View Profile
                </Link>
              </div>
            ) : (
              <div className="bg-[#2D0D10] border border-[#FFDE59]/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFDE59]/20 text-[#FFDE59] flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-[#FFDE59]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">
                      Want early access & 20% off at launch?
                    </p>
                    <p className="text-white/70 text-xs mt-0.5">
                      Get on the waitlist to receive instant drops & VIP discounts.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthModal("signup")}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#FFDE59] hover:bg-[#ffe37a] text-[#741117] font-inter font-black text-xs uppercase tracking-wider transition-all duration-200 shrink-0 shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get 20% Off
                </button>
              </div>
            )}
          </div>

          {/* Navigation CTA */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2D0D10] hover:bg-[#381014] border border-[#81191B] text-white/90 hover:text-white font-inter font-bold text-xs uppercase tracking-wider transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back To Home</span>
            </Link>
            {!user && (
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-transparent hover:bg-white/5 border border-white/20 text-white font-inter font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>Already Joined? Log In</span>
              </button>
            )}
          </div>

        </div>

      </main>

      {/* Brand Footer */}
      <Footer />
    </div>
  );
}
