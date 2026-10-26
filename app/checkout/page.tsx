"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  Package,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Bell,
  Clock,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Gift,
  User,
  Phone,
  Mail,
  MapPin,
  Minus,
  Plus,
  X,
  Check,
  AlertCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const { openAuthModal } = useAuth();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Pre-order Popup Modal State
  const [showPreOrderModal, setShowPreOrderModal] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);

  // Product state
  const [productDetails, setProductDetails] = useState({
    name: "Laphing Signature Pack",
    description: "Authentic Tibetan Cold Noodles. Spicy, Tangy, Addictive.",
    price: 499,
    imageUrl: "/pack.png",
  });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Pricing calculations
  const unitPrice = productDetails.price;
  const basePrice = unitPrice * quantity;
  const discountAmount = Math.floor((basePrice * discountPercent) / 100);
  const finalTotal = Math.max(0, basePrice - discountAmount);

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
      } finally {
        setLoading(false);
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
            setFormData((prev) => ({
              ...prev,
              name: data.name || prev.name,
              email: data.email || currentUser.email || prev.email,
              phone: data.phone || prev.phone,
              address: data.address || prev.address,
            }));
          } else {
            setFormData((prev) => ({
              ...prev,
              email: currentUser.email || prev.email,
              name: currentUser.displayName || prev.name,
            }));
            setDiscountPercent(20);
          }
        } catch (err) {
          console.error("Error fetching user data", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showPreOrderModal) {
        setShowPreOrderModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPreOrderModal]);

  // Order click handler -> Displays the pre-order popup modal & records lead
  const handleOrderSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Save lead to signups/waitlist if email is available
    const contactEmail = formData.email || user?.email;
    if (contactEmail && !leadSaved) {
      try {
        addDoc(collection(db, "signups"), {
          name: formData.name || userName || "Pre-order Customer",
          email: contactEmail,
          phone: formData.phone || "",
          address: `${formData.address || ""}${formData.city ? `, ${formData.city}` : ""}${formData.pincode ? ` - ${formData.pincode}` : ""}`.trim(),
          consent: true,
          quantity,
          product: productDetails.name,
          source: "checkout_preorder_click",
          createdAt: new Date(),
        })
          .then(() => setLeadSaved(true))
          .catch((err) => console.log("Non-blocking lead save notice:", err));
      } catch (err) {
        // non-blocking
      }
    }

    setShowPreOrderModal(true);
  };

  // Removed blocking loader so the checkout page renders immediately both in SSR & CSR

  return (
    <div className="min-h-screen w-full bg-[#741117] text-white flex flex-col justify-between select-none">
      {/* Brand Navbar */}
      <Navbar />

      {/* Main Content Stage */}
      <main className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-8 sm:py-12 flex-1">
        
        {/* Checkout Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ================= LEFT COLUMN: SHIPPING & CONTACT (7 Cols) ================= */}
          <div className="lg:col-span-7 bg-[#401316] border border-[#81191B] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl">
            
            {/* Header */}
            <div className="mb-8 pb-6 border-b border-[#81191B]/60">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFDE59] animate-pulse" />
                <span className="font-inter font-bold text-[#FFDE59] text-[12px] uppercase tracking-wider">
                  Secure Priority Pre-Order
                </span>
              </div>

              <h1 className="font-inter font-black text-white text-2xl sm:text-3xl uppercase tracking-tight">
                Shipping & Delivery
              </h1>

              {!user && (
                <div className="mt-3 bg-[#520C11] border border-[#FFDE59]/20 rounded-xl p-3 text-[13px] text-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span>Have a referral code or waitlist account?</span>
                  <button
                    type="button"
                    onClick={() => openAuthModal("login")}
                    className="text-[#FFDE59] font-bold hover:underline shrink-0 text-left sm:text-right cursor-pointer"
                  >
                    Log in for discounts
                  </button>
                </div>
              )}
            </div>

            <form id="checkout-form" onSubmit={handleOrderSubmit} className="space-y-6">
              
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-inter font-bold text-white text-[16px] uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-[#FFDE59]" />
                  <span>Contact Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="relative">
                    <label className="text-[12px] font-bold uppercase tracking-wider text-white/70 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#2C0A0E] border border-[#81191B] focus:border-[#FFDE59] rounded-xl py-3 px-3.5 text-[15px] text-white placeholder-white/40 outline-none transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <label className="text-[12px] font-bold uppercase tracking-wider text-white/70 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 Mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#2C0A0E] border border-[#81191B] focus:border-[#FFDE59] rounded-xl py-3 px-3.5 text-[15px] text-white placeholder-white/40 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-[12px] font-bold uppercase tracking-wider text-white/70 block mb-1">
                    Email Address (for order updates & dispatch alerts)
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="yourname@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#2C0A0E] border border-[#81191B] focus:border-[#FFDE59] rounded-xl py-3 px-3.5 text-[15px] text-white placeholder-white/40 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-4 pt-2">
                <h3 className="font-inter font-bold text-white text-[16px] uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FFDE59]" />
                  <span>Shipping Address</span>
                </h3>

                <div>
                  <label className="text-[12px] font-bold uppercase tracking-wider text-white/70 block mb-1">
                    Street Address & House / Flat No.
                  </label>
                  <textarea
                    name="address"
                    rows={3}
                    placeholder="House / Apartment number, Street, Landmark"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-[#2C0A0E] border border-[#81191B] focus:border-[#FFDE59] rounded-xl py-3 px-3.5 text-[15px] text-white placeholder-white/40 outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[12px] font-bold uppercase tracking-wider text-white/70 block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-[#2C0A0E] border border-[#81191B] focus:border-[#FFDE59] rounded-xl py-3 px-3.5 text-[15px] text-white placeholder-white/40 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[12px] font-bold uppercase tracking-wider text-white/70 block mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-[#2C0A0E] border border-[#81191B] focus:border-[#FFDE59] rounded-xl py-3 px-3.5 text-[15px] text-white placeholder-white/40 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[12px] font-bold uppercase tracking-wider text-white/70 block mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="6-digit PIN"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full bg-[#2C0A0E] border border-[#81191B] focus:border-[#FFDE59] rounded-xl py-3 px-3.5 text-[15px] text-white placeholder-white/40 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Order Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  id="checkout-order-btn"
                  className="w-full bg-[#FFDE59] hover:bg-[#FFE58A] text-[#741117] font-inter font-black text-[16px] sm:text-[18px] uppercase tracking-wider py-4 rounded-2xl shadow-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer"
                >
                  <span>Pre-Order Now • ₹{finalTotal}</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-white/70 text-[12px] font-medium text-center">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#FFDE59]" />
                    No Immediate Payment Required
                  </span>
                  <span>•</span>
                  <span>Free Cold-Pack Dispatch</span>
                  <span>•</span>
                  <span>Authentic Tibetan Recipe</span>
                </div>
              </div>

            </form>

          </div>

          {/* ================= RIGHT COLUMN: ORDER SUMMARY (5 Cols) ================= */}
          <div className="lg:col-span-5 bg-[#2D0D10] border-2 border-[#81191B] rounded-3xl p-6 sm:p-8 shadow-2xl sticky top-24 space-y-6">
            
            <h3 className="font-inter font-black text-white text-xl uppercase tracking-tight flex items-center gap-2">
              <Package className="w-5 h-5 text-[#FFDE59]" />
              <span>Order Summary</span>
            </h3>

            {/* Product Preview Card */}
            <div className="flex items-center gap-4 bg-[#401316] border border-[#81191B] p-4 rounded-2xl">
              
              {/* Thumbnail */}
              <div className="relative w-20 h-24 bg-[#540B10] rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-[#81191B]">
                <Image
                  src={productDetails.imageUrl || "/pack.png"}
                  alt={productDetails.name}
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-inter font-bold text-white text-[16px] leading-snug truncate">
                  {productDetails.name}
                </h4>
                <p className="text-white/60 text-[12px] mt-0.5 line-clamp-2 leading-relaxed">
                  {productDetails.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-block text-[11px] font-bold text-[#FFDE59] uppercase tracking-wider bg-[#FFDE59]/10 px-2 py-0.5 rounded-full">
                    2 Servings Inside
                  </span>
                </div>
              </div>

              {/* Item Price */}
              <div className="font-inter font-bold text-white text-[18px] shrink-0 text-right">
                ₹{unitPrice}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-[#401316]/70 border border-[#81191B]/80 px-4 py-3 rounded-2xl">
              <div>
                <p className="text-white font-bold text-sm">Quantity</p>
                <p className="text-white/50 text-[11px]">Packs of 2 servings</p>
              </div>
              <div className="flex items-center gap-3 bg-[#2D0D10] border border-[#81191B] rounded-xl px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-white hover:text-[#FFDE59] hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-inter font-black text-white text-base min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-white hover:text-[#FFDE59] hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-[#81191B]/60 pt-5 space-y-3.5">
              <div className="flex justify-between text-white/75 text-[14px]">
                <span>Item Subtotal ({quantity} {quantity === 1 ? 'pack' : 'packs'})</span>
                <span className="text-white font-medium">₹{basePrice}</span>
              </div>

              {discountPercent > 0 ? (
                <div className="flex justify-between items-center bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-xl text-[13px] font-bold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                    Launch Discount ({discountPercent}%)
                  </span>
                  <span>-₹{discountAmount}</span>
                </div>
              ) : (
                <div className="flex justify-between items-center text-white/60 text-[12px] bg-white/5 p-2.5 rounded-xl">
                  <span>Want 20% Launch Discount?</span>
                  <button
                    type="button"
                    onClick={() => openAuthModal("signup")}
                    className="text-[#FFDE59] hover:underline font-bold cursor-pointer"
                  >
                    Join Waitlist
                  </button>
                </div>
              )}

              <div className="flex justify-between text-white/75 text-[14px]">
                <span>Cold Dispatch & Delivery</span>
                <span className="text-[#FFDE59] font-bold uppercase tracking-wider text-[12px]">
                  FREE
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-[#81191B]/60 pt-5 flex justify-between items-baseline">
              <div>
                <span className="text-white font-inter font-black text-lg block">Estimated Total</span>
                <span className="text-white/50 text-[11px]">Includes all taxes</span>
              </div>
              <div className="text-right">
                <span className="font-inter font-black text-3xl sm:text-4xl text-[#FFDE59]">
                  ₹{finalTotal}
                </span>
              </div>
            </div>

            {/* Guarantee Banner */}
            <div className="bg-[#401316] border border-[#81191B]/80 rounded-2xl p-4 text-[12px] text-white/75 space-y-2">
              <div className="flex items-center gap-2 text-[#FFDE59] font-bold">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>The Laphing Co. Guarantee</span>
              </div>
              <p className="leading-relaxed">
                Made with authentic spices, fresh chillies, garlic paste, and hand-rolled cold gluten noodles. Dispatched in temperature-controlled freshness packs.
              </p>
            </div>

          </div>

        </div>

      </main>

      {/* Brand Footer */}
      <Footer />

      {/* =================================================================== */}
      {/* PRE-ORDER POPUP MODAL (Triggered when user clicks to order)          */}
      {/* =================================================================== */}
      {showPreOrderModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPreOrderModal(false);
          }}
        >
          <div className="relative w-full max-w-[460px] my-auto bg-[#FFDE59] text-[#741117] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.5)] border-2 border-[#81191B]/25 animate-in zoom-in-95 duration-200 text-center">
            
            {/* Close Button */}
            <button
              onClick={() => setShowPreOrderModal(false)}
              type="button"
              aria-label="Close pre-order modal"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 flex items-center justify-center rounded-full bg-[#81191B]/10 hover:bg-[#81191B] text-[#81191B] hover:text-[#FFDE59] transition-all duration-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Icon Header */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-[#81191B] text-[#FFDE59] flex items-center justify-center shadow-lg mb-4">
              <Bell className="w-8 h-8 animate-bounce" />
            </div>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#81191B]/15 text-[#81191B] text-xs font-black uppercase tracking-widest mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>Pre-Orders Launching Soon</span>
            </div>

            {/* Heading */}
            <h3 className="font-inter font-black text-[#81191B] text-2xl sm:text-[28px] uppercase tracking-tight leading-tight">
              Pre-Orders Dropping Soon!
            </h3>

            {/* Core Message */}
            <p className="mt-3 text-[#741117] text-sm sm:text-base font-medium leading-relaxed">
              We will be soon accepting Pre-orders and will email you as soon as our fresh cold-dispatch begins!
            </p>

            {/* Advance Sign-up Pitch */}
            <div className="mt-4 p-4 rounded-2xl bg-[#81191B]/10 border border-[#81191B]/20 text-left">
              <p className="text-xs sm:text-[13px] text-[#741117] leading-relaxed font-semibold">
                ✨ <strong>Advance VIP Access:</strong> Sign up today to secure early priority dispatch, instant stock drops, and unlock an exclusive <strong>20% discount</strong> on your first order!
              </p>

              {(formData.email || user?.email) && (
                <div className="mt-2.5 pt-2 border-t border-[#81191B]/15 flex items-center gap-2 text-xs text-[#81191B] font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="truncate">
                    Updates will be sent to: <u>{formData.email || user?.email}</u>
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-2.5">
              {!user ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPreOrderModal(false);
                      openAuthModal("signup");
                    }}
                    className="w-full bg-[#81191B] hover:bg-[#681416] text-[#FFDE59] font-inter font-black text-sm uppercase tracking-wider py-3.5 px-5 rounded-2xl shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Sign Up To Get Notifications</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPreOrderModal(false);
                      openAuthModal("login");
                    }}
                    className="w-full bg-transparent hover:bg-[#81191B]/10 text-[#81191B] font-inter font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Already have an account? Log In
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="bg-emerald-600/15 border border-emerald-700/30 text-emerald-900 rounded-xl p-3 text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                    <span>You are registered! {discountPercent}% discount is active.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPreOrderModal(false)}
                    className="w-full bg-[#81191B] hover:bg-[#681416] text-[#FFDE59] font-inter font-black text-sm uppercase tracking-wider py-3.5 px-5 rounded-2xl shadow-lg transition-all cursor-pointer"
                  >
                    Got It, Thank You!
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
