"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  Package,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  User,
  MapPin,
  Minus,
  Plus,
  AlertCircle,
  ShieldCheck,
  Lock,
  X,
  Flame,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface OrderSuccessData {
  id: string;
  paymentId: string;
  customerName: string;
  email: string;
  totalAmount: number;
  quantity: number;
  productName: string;
  address: string;
}

export default function CheckoutPage() {
  const { openAuthModal } = useAuth();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Payment & Order states
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState<OrderSuccessData | null>(null);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

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
    if (formError) setFormError("");
  };

  // Order click handler -> Displays "Accepting orders soon" dialog instead of Razorpay
  const handleOrderSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError("");

    // If customer entered contact details, record their preorder interest lead in Firestore
    const emailToUse = (formData.email || user?.email || "").trim();
    const phoneToUse = formData.phone.trim();
    if (emailToUse || phoneToUse) {
      try {
        await addDoc(collection(db, "preorder_leads"), {
          name: formData.name.trim() || userName || "Anonymous Laphing Fan",
          email: emailToUse,
          phone: phoneToUse,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          quantity,
          finalTotal,
          createdAt: new Date(),
        });
      } catch (err) {
        console.warn("Could not record lead:", err);
      }
    }

    setShowComingSoonModal(true);
  };

  // Original Razorpay payment handler (preserved for when live gateway is re-enabled)
  const handleRazorpayPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError("");

    // Validate inputs
    if (!formData.name.trim()) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setFormError("Please enter a valid 10-digit phone number for delivery.");
      return;
    }
    const emailToUse = (formData.email || user?.email || "").trim();
    if (!emailToUse || !emailToUse.includes("@")) {
      setFormError("Please enter a valid email address for your order confirmation.");
      return;
    }
    if (!formData.address.trim()) {
      setFormError("Please enter your complete street address.");
      return;
    }
    if (!formData.city.trim()) {
      setFormError("Please enter your city.");
      return;
    }
    if (!formData.state.trim()) {
      setFormError("Please enter your state.");
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.trim().length < 6) {
      setFormError("Please enter a valid 6-digit PIN code.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Ensure Razorpay SDK is loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error(
          "Unable to load Razorpay payment gateway. Please check your network connection and try again."
        );
      }

      // 2. Request order from /api/razorpay
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.id) {
        throw new Error(orderData.error || "Failed to initialize payment order.");
      }

      // 3. Open Razorpay Checkout modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TtimsQbeGWPL99",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "de Laphing co.",
        description: `${quantity}x ${productDetails.name}`,
        image: "/logo.png",
        order_id: orderData.id,
        prefill: {
          name: formData.name.trim(),
          email: emailToUse.toLowerCase(),
          contact: formData.phone.trim(),
        },
        theme: {
          color: "#741117",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
        handler: async function (paymentResponse: any) {
          try {
            setIsProcessing(true);

            // 4. Verify payment signature on backend
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(
                verifyData.error ||
                  "Payment signature verification failed. Please contact support if payment was debited."
              );
            }

            // 5. Store completed order in Firestore
            const orderPayload = {
              userId: user?.uid || null,
              customerDetails: {
                name: formData.name.trim(),
                email: emailToUse.toLowerCase(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                pincode: formData.pincode.trim(),
              },
              items: [
                {
                  name: productDetails.name,
                  quantity: quantity,
                  unitPrice: unitPrice,
                  totalPrice: basePrice,
                },
              ],
              quantity: quantity,
              unitPrice: unitPrice,
              basePrice: basePrice,
              discountPercent: discountPercent,
              discountApplied: discountAmount,
              totalAmount: finalTotal,
              status: "Processing",
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              createdAt: new Date(),
            };

            const docRef = await addDoc(collection(db, "orders"), orderPayload);

            // 6. Update user profile if authenticated
            if (user?.uid) {
              try {
                await updateDoc(doc(db, "users", user.uid), {
                  phone: formData.phone.trim(),
                  address: `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state.trim()} - ${formData.pincode.trim()}`,
                });
              } catch (profileErr) {
                console.warn("Could not save address to user document:", profileErr);
              }
            }

            // 7. Send automated confirmation email
            try {
              fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  to: emailToUse.toLowerCase(),
                  type: "order_confirmation",
                  orderId: docRef.id,
                  name: formData.name.trim(),
                  totalAmount: finalTotal,
                  quantity: quantity,
                  productName: productDetails.name,
                  paymentId: paymentResponse.razorpay_payment_id,
                  address: `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state.trim()} - ${formData.pincode.trim()}`,
                }),
              }).catch((e) => console.warn("Background confirmation email notice:", e));
            } catch (mailErr) {
              console.warn("Email dispatch notice:", mailErr);
            }

            // 8. Render the Order Success view
            setOrderSuccess({
              id: docRef.id,
              paymentId: paymentResponse.razorpay_payment_id,
              customerName: formData.name.trim(),
              email: emailToUse.toLowerCase(),
              totalAmount: finalTotal,
              quantity: quantity,
              productName: productDetails.name,
              address: `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state.trim()} - ${formData.pincode.trim()}`,
            });
          } catch (err: any) {
            console.error("Post-payment error:", err);
            setFormError(
              err.message ||
                "Failed to register order after payment. Please contact support with your payment ID: " +
                  paymentResponse.razorpay_payment_id
            );
          } finally {
            setIsProcessing(false);
          }
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        setIsProcessing(false);
        setFormError(
          response.error?.description ||
            "Payment failed or was canceled. Please try again."
        );
      });
      razorpay.open();
    } catch (err: any) {
      console.error("Order flow error:", err);
      setFormError(
        err.message || "An unexpected error occurred. Please try again."
      );
      setIsProcessing(false);
    }
  };

  // Instant Test Order simulation (helpful while setting up or renewing Razorpay keys)
  const handleTestOrderSubmit = async () => {
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setFormError("Please enter a valid 10-digit phone number for delivery.");
      return;
    }
    const emailToUse = (formData.email || user?.email || "").trim();
    if (!emailToUse || !emailToUse.includes("@")) {
      setFormError("Please enter a valid email address for your order confirmation.");
      return;
    }
    if (!formData.address.trim()) {
      setFormError("Please enter your complete street address.");
      return;
    }
    if (!formData.city.trim()) {
      setFormError("Please enter your city.");
      return;
    }
    if (!formData.state.trim()) {
      setFormError("Please enter your state.");
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.trim().length < 6) {
      setFormError("Please enter a valid 6-digit PIN code.");
      return;
    }

    setIsProcessing(true);

    try {
      const mockPaymentId = `pay_test_${Math.random().toString(36).substring(2, 10)}`;
      const mockOrderId = `order_test_${Math.random().toString(36).substring(2, 10)}`;

      // 1. Verify simulation endpoint
      await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSimulation: true }),
      });

      // 2. Store in Firestore orders collection
      const orderPayload = {
        userId: user?.uid || null,
        customerDetails: {
          name: formData.name.trim(),
          email: emailToUse.toLowerCase(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
        items: [
          {
            name: productDetails.name,
            quantity: quantity,
            unitPrice: unitPrice,
            totalPrice: basePrice,
          },
        ],
        quantity: quantity,
        unitPrice: unitPrice,
        basePrice: basePrice,
        discountPercent: discountPercent,
        discountApplied: discountAmount,
        totalAmount: finalTotal,
        status: "Processing",
        razorpayOrderId: mockOrderId,
        razorpayPaymentId: mockPaymentId,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderPayload);

      // 3. Update user profile if authenticated
      if (user?.uid) {
        try {
          await updateDoc(doc(db, "users", user.uid), {
            phone: formData.phone.trim(),
            address: `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state.trim()} - ${formData.pincode.trim()}`,
          });
        } catch (profileErr) {
          console.warn("Could not save address to user document:", profileErr);
        }
      }

      // 4. Send confirmation email
      try {
        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: emailToUse.toLowerCase(),
            type: "order_confirmation",
            orderId: docRef.id,
            name: formData.name.trim(),
            totalAmount: finalTotal,
            quantity: quantity,
            productName: productDetails.name,
            paymentId: mockPaymentId,
            address: `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state.trim()} - ${formData.pincode.trim()}`,
          }),
        }).catch(console.warn);
      } catch (mailErr) {
        console.warn(mailErr);
      }

      // 5. Show order success
      setOrderSuccess({
        id: docRef.id,
        paymentId: mockPaymentId,
        customerName: formData.name.trim(),
        email: emailToUse.toLowerCase(),
        totalAmount: finalTotal,
        quantity: quantity,
        productName: productDetails.name,
        address: `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state.trim()} - ${formData.pincode.trim()}`,
      });
    } catch (err: any) {
      console.error("Test order simulation error:", err);
      setFormError(err.message || "Failed to create simulated order.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ===================================================================
  // ORDER CONFIRMATION / SUCCESS VIEW
  // ===================================================================
  if (orderSuccess) {
    return (
      <div className="min-h-screen w-full bg-[#741117] text-white flex flex-col justify-between select-none">
        <Navbar />

        <main className="w-full max-w-[800px] mx-auto px-4 sm:px-6 py-12 flex-1 flex items-center justify-center">
          <div className="w-full bg-[#401316] border-2 border-[#81191B] rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6 animate-fade-in">
            {/* Green / Gold Badge */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FFDE59] text-[#741117] flex items-center justify-center shadow-xl ring-8 ring-[#FFDE59]/20">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="inline-block text-xs font-bold text-[#FFDE59] uppercase tracking-widest bg-[#FFDE59]/15 border border-[#FFDE59]/30 px-3.5 py-1 rounded-full mb-3">
                Payment Confirmed & Verified
              </span>
              <h1 className="font-inter font-black text-white text-3xl sm:text-4xl uppercase tracking-tight">
                Order Placed Successfully!
              </h1>
              <p className="text-white/80 text-sm sm:text-base mt-2 max-w-lg mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{orderSuccess.customerName}</strong>! Your authentic cold laphing pack has been confirmed and our kitchen team is preparing your fresh batch.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#2D0D10] border border-[#81191B] rounded-2xl p-5 sm:p-6 text-left space-y-3.5 text-sm">
              <div className="flex justify-between items-center pb-3 border-b border-[#81191B]/60">
                <span className="text-white/60">Order ID</span>
                <span className="font-mono font-bold text-[#FFDE59] text-base">
                  #{orderSuccess.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#81191B]/60">
                <span className="text-white/60">Payment ID</span>
                <span className="font-mono text-white/90 text-xs sm:text-sm">
                  {orderSuccess.paymentId}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#81191B]/60">
                <span className="text-white/60">Product</span>
                <span className="font-bold text-white">
                  {orderSuccess.quantity}x {orderSuccess.productName}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#81191B]/60">
                <span className="text-white/60">Delivery Address</span>
                <span className="text-white/90 text-right max-w-[280px] truncate">
                  {orderSuccess.address}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 text-base">
                <span className="font-bold text-white">Total Paid</span>
                <span className="font-black text-[#FFDE59] text-2xl">
                  ₹{orderSuccess.totalAmount}
                </span>
              </div>
            </div>

            {/* Email Notice */}
            <div className="bg-[#540B10] border border-[#FFDE59]/25 rounded-xl p-3.5 text-xs text-white/90 text-center flex items-center justify-center gap-2">
              <span>📧 Order details and live status updates have been sent to</span>
              <strong className="text-[#FFDE59]">{orderSuccess.email}</strong>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
              <Link
                href="/dashboard"
                className="bg-[#FFDE59] hover:bg-[#FFE58A] text-[#741117] font-inter font-black text-sm uppercase tracking-wider py-3.5 px-7 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>View in My Orders</span>
              </Link>
              <Link
                href="/"
                className="bg-transparent hover:bg-white/5 border border-white/20 text-white font-inter font-bold text-sm uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ===================================================================
  // MAIN CHECKOUT FORM VIEW
  // ===================================================================
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
                  Secure Checkout
                </span>
              </div>

              <h1 className="font-inter font-black text-white text-2xl sm:text-3xl uppercase tracking-tight">
                Shipping & Delivery
              </h1>

              {!user && (
                <div className="mt-3 bg-[#520C11] border border-[#FFDE59]/20 rounded-xl p-3 text-[13px] text-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span>Have a referral code or registered account?</span>
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

            {/* Error Banner */}
            {formError && (
              <div className="mb-6 bg-red-500/15 border-2 border-red-500/40 text-red-200 p-4 rounded-2xl text-sm font-semibold flex flex-col gap-3 animate-fade-in">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">{formError}</div>
                </div>

                {formError.toLowerCase().includes("authentication") && (
                  <div className="bg-[#2D0A0D] border border-red-500/30 p-3.5 rounded-xl text-xs space-y-2 mt-1">
                    <p className="text-yellow-100/90 font-normal leading-relaxed">
                      💡 <strong>Notice:</strong> The Razorpay test keys currently configured in <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-yellow-300">.env.local</code> returned an Authentication Failed response from Razorpay. You can update them in <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-yellow-300">.env.local</code> with active keys from your Razorpay Dashboard.
                    </p>
                    <button
                      type="button"
                      onClick={handleTestOrderSubmit}
                      disabled={isProcessing}
                      className="w-full bg-[#FFDE59] hover:bg-[#FFE58A] text-[#741117] font-inter font-black text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Place Simulated Test Order (Verify Pipeline Now)</span>
                    </button>
                  </div>
                )}
              </div>
            )}

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
                      Full Name <span className="text-[#FFDE59]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Your Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#2C0A0E] border border-[#81191B] focus:border-[#FFDE59] rounded-xl py-3 px-3.5 text-[15px] text-white placeholder-white/40 outline-none transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <label className="text-[12px] font-bold uppercase tracking-wider text-white/70 block mb-1">
                      Phone Number <span className="text-[#FFDE59]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
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
                    Email Address (for order receipt & tracking) <span className="text-[#FFDE59]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
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
                    Street Address & House / Flat No. <span className="text-[#FFDE59]">*</span>
                  </label>
                  <textarea
                    name="address"
                    rows={3}
                    required
                    placeholder="House / Apartment number, Street, Landmark"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-[#2C0A0E] border border-[#81191B] focus:border-[#FFDE59] rounded-xl py-3 px-3.5 text-[15px] text-white placeholder-white/40 outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[12px] font-bold uppercase tracking-wider text-white/70 block mb-1">
                      City <span className="text-[#FFDE59]">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-[#2C0A0E] border border-[#81191B] focus:border-[#FFDE59] rounded-xl py-3 px-3.5 text-[15px] text-white placeholder-white/40 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[12px] font-bold uppercase tracking-wider text-white/70 block mb-1">
                      State <span className="text-[#FFDE59]">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-[#2C0A0E] border border-[#81191B] focus:border-[#FFDE59] rounded-xl py-3 px-3.5 text-[15px] text-white placeholder-white/40 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[12px] font-bold uppercase tracking-wider text-white/70 block mb-1">
                      PIN Code <span className="text-[#FFDE59]">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      maxLength={6}
                      placeholder="6-digit PIN"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full bg-[#2C0A0E] border border-[#81191B] focus:border-[#FFDE59] rounded-xl py-3 px-3.5 text-[15px] text-white placeholder-white/40 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Order Submit Button */}
              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  id="checkout-order-btn"
                  disabled={isProcessing}
                  className="w-full bg-[#FFDE59] hover:bg-[#FFE58A] disabled:opacity-50 text-[#741117] font-inter font-black text-[16px] sm:text-[18px] uppercase tracking-wider py-4 rounded-2xl shadow-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Pay Now • ₹{finalTotal}</span>
                      <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                    </>
                  )}
                </button>

                {/* Trust & Security Badge */}
                <div className="flex items-center justify-center gap-2 text-white/60 text-xs text-center pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Encrypted & Secure Payment via Razorpay (UPI, Cards, NetBanking)</span>
                </div>

                {/* Instant Test Mode Fallback */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleTestOrderSubmit}
                    disabled={isProcessing}
                    className="text-[11px] text-white/40 hover:text-[#FFDE59] transition-colors underline cursor-pointer"
                  >
                    Place instant test order without payment gateway
                  </button>
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
                    3 Servings Inside
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
                <p className="text-white/50 text-[11px]">Pack of 3 servings</p>
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
                <span>
                  Item Subtotal ({quantity} {quantity === 1 ? "pack" : "packs"})
                </span>
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
                <span>Delivery</span>
                <span className="text-white font-medium">₹0</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-[#81191B]/60 pt-5 flex justify-between items-baseline">
              <div>
                <span className="text-white font-inter font-black text-lg block">
                  Total Payable
                </span>
                <span className="text-white/50 text-[11px]">Includes all taxes</span>
              </div>
              <div className="text-right">
                <span className="font-inter font-black text-3xl sm:text-4xl text-[#FFDE59]">
                  ₹{finalTotal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= ACCEPTING ORDERS SOON MODAL ================= */}
      {showComingSoonModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowComingSoonModal(false);
          }}
        >
          <div className="relative w-full max-w-[460px] my-auto bg-[#FFDE59] text-[#741117] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.5)] border-3 border-[#81191B] animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowComingSoonModal(false)}
              type="button"
              aria-label="Close dialog"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 flex items-center justify-center rounded-full bg-[#81191B]/15 hover:bg-[#81191B] text-[#81191B] hover:text-[#FFDE59] transition-all duration-200 cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Icon & Content */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#81191B] text-[#FFDE59] flex items-center justify-center mb-4 shadow-lg rotate-[-3deg]">
                <Flame className="w-9 h-9 fill-[#FFDE59]" />
              </div>

              <span className="font-inter font-bold text-[#81191B]/80 text-[12px] sm:text-[13px] tracking-wider uppercase mb-1">
                A Little Chaos. A Lot of Flavour.
              </span>

              <h3 className="font-inter font-black text-[#81191B] text-[24px] sm:text-[28px] leading-[1.05] uppercase tracking-tight">
                We will be accepting orders soon!
              </h3>



              {/* Action Buttons */}
              <div className="w-full mt-6 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setShowComingSoonModal(false)}
                  className="w-full bg-[#81191B] hover:bg-[#681315] text-[#FFDE59] font-inter font-black text-[15px] sm:text-[16px] uppercase tracking-wider py-4 px-6 rounded-2xl shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
                >
                  Got It, Can&apos;t Wait!
                </button>

                <Link
                  href="/"
                  className="inline-block text-xs font-bold text-[#81191B]/80 hover:text-[#81191B] hover:underline transition-colors pt-1"
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Brand Footer */}
      <Footer />
    </div>
  );
}
