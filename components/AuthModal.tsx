"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  increment,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Mail,
  Lock,
  Gift,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    refreshUserData,
  } = useAuth();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"signup" | "login" | "forgot">("signup");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    referralCode: "",
    consent: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sync mode with context
  useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
    }
    setError("");
    setSuccess("");
  }, [authModalMode, isAuthModalOpen]);

  // Read ref from URL if available & check auth param
  useEffect(() => {
    const urlRef = searchParams.get("ref");
    if (urlRef) {
      setFormData((prev) => ({ ...prev, referralCode: urlRef }));
    }
    const authParam = searchParams.get("auth");
    if (authParam === "login") {
      openAuthModal("login");
    } else if (authParam === "signup") {
      openAuthModal("signup");
    } else if (authParam === "forgot") {
      openAuthModal("forgot");
    }
  }, [searchParams]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const generateReferralCode = (name: string) => {
    const cleanName = name.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 4) || "LAPH";
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `${cleanName}${randomDigits}`;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch dynamic settings
      let preLaunchDiscount = 20;
      let referDiscount = 10;
      let maxReferrals = 5;

      try {
        const settingsSnap = await getDoc(doc(db, "settings", "global"));
        if (settingsSnap.exists()) {
          const s = settingsSnap.data();
          if (s.preLaunchDiscount) preLaunchDiscount = Number(s.preLaunchDiscount);
          if (s.referDiscount) referDiscount = Number(s.referDiscount);
          if (s.maxReferrals) maxReferrals = Number(s.maxReferrals);
        }
      } catch (settingsErr) {
        console.warn("Could not fetch global settings, using defaults", settingsErr);
      }

      // 2. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );
      const newUser = userCredential.user;

      // 3. Create Unique Referral Code
      const userRefCode = generateReferralCode(formData.name);

      // Handle Referred By
      const rawRef = formData.referralCode.trim();
      const appliedRef = rawRef.toUpperCase();

      // 4. Save to Firestore "users" collection
      await setDoc(doc(db, "users", newUser.uid), {
        uid: newUser.uid,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        consent: formData.consent,
        referralCode: userRefCode,
        referredBy: appliedRef || null,
        referralsCount: 0,
        discountAvailable: preLaunchDiscount, // Automatic launch discount
        role: "user",
        createdAt: new Date(),
      });

      // 5. If referred by someone, increment their referral count
      if (appliedRef) {
        try {
          let q = query(
            collection(db, "users"),
            where("referralCode", "==", appliedRef)
          );
          let querySnapshot = await getDocs(q);
          if (querySnapshot.empty && rawRef !== appliedRef) {
            q = query(
              collection(db, "users"),
              where("referralCode", "==", rawRef)
            );
            querySnapshot = await getDocs(q);
          }

          if (!querySnapshot.empty) {
            const referrerDoc = querySnapshot.docs[0];
            if (referrerDoc.id !== newUser.uid) {
              const referrerData = referrerDoc.data();
              const currentCount = referrerData.referralsCount || 0;

              if (currentCount < maxReferrals) {
                const newCount = currentCount + 1;
                const updatePayload: any = {
                  referralsCount: increment(1),
                };
                // Referrer gets 10% discount ONLY if 2 people sign up with their code
                if (newCount === 2) {
                  updatePayload.discountAvailable = increment(referDiscount);
                }
                await updateDoc(doc(db, "users", referrerDoc.id), updatePayload);
              }
            }
          }
        } catch (refErr) {
          console.warn("Could not process referrer credit", refErr);
        }
      }

      // 6. Also save to "signups" collection for Admin table
      try {
        await addDoc(collection(db, "signups"), {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          consent: formData.consent,
          referredBy: appliedRef,
          uid: newUser.uid,
          createdAt: new Date(),
        });
      } catch (signupErr) {
        console.warn("Could not mirror to signups collection", signupErr);
      }

      // 7. Dispatch 20% OFF Welcome Email automatically
      try {
        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "welcome",
            to: formData.email.trim().toLowerCase(),
            name: formData.name.trim(),
            referralCode: userRefCode,
            discountPercent: preLaunchDiscount || 20,
          }),
        }).catch((mailErr) => {
          console.warn("Background welcome email error:", mailErr);
        });
      } catch (emailErr) {
        console.warn("Could not trigger welcome email:", emailErr);
      }

      await refreshUserData();
      setSuccess("You're on the list! Welcome to de Laphing co.");

      setTimeout(() => {
        closeAuthModal();
      }, 1200);
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email already has an account. Please log in instead.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message || "An error occurred while signing up. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await signInWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );
      await refreshUserData();
      setSuccess("Welcome back! Logged in successfully.");

      setTimeout(() => {
        closeAuthModal();
      }, 1000);
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = formData.email.trim();
    if (!targetEmail) {
      setError("Please enter your registered email address.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1. Try sending via branded email API (uses brand theme, logo & View Link to open Firebase link)
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess("Password reset email sent! Please check your inbox and click 'View Link'.");
      } else if (data.fallbackToClient) {
        // Fallback to client-side Firebase Auth if Admin SDK credentials are not configured
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
        await sendPasswordResetEmail(auth, targetEmail, {
          url: `${baseUrl}/reset-password`,
          handleCodeInApp: true,
        });
        setSuccess("Password reset link sent! Please check your email inbox and spam folder.");
      } else {
        throw new Error(data.error || "Failed to send reset email.");
      }
    } catch (err: any) {
      console.error("Forgot password error:", err);
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(err.message || "Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FFF5DB] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-[#FFDE59] overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          type="button"
          className="absolute top-4 right-4 text-[#81191B] hover:text-black transition-colors p-1 rounded-full hover:bg-black/5 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Back Button for Forgot Password */}
        {mode === "forgot" && (
          <button
            onClick={() => {
              setMode("login");
              setError("");
              setSuccess("");
            }}
            type="button"
            className="absolute top-4 left-4 text-[#81191B] hover:text-black transition-colors p-1 rounded-full hover:bg-black/5 cursor-pointer flex items-center gap-1 text-xs font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        )}

        {/* Header Badge */}
        <div className="text-center mb-6">
          <span className="inline-block bg-[#81191B] text-[#FFDE59] font-inter font-black text-[11px] sm:text-[12px] uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-sm">
            {mode === "signup"
              ? "Pre-Launch Exclusive"
              : mode === "forgot"
              ? "Account Recovery"
              : "Welcome Back"}
          </span>

          <h3 className="font-bebas text-3xl sm:text-4xl text-[#81191B] tracking-wide uppercase leading-none">
            {mode === "signup"
              ? "Join The Waitlist"
              : mode === "forgot"
              ? "Forgot Password?"
              : "Log In"}
          </h3>

          <p className="font-inter text-[13px] sm:text-[14px] text-[#741117] font-medium mt-1">
            {mode === "signup"
              ? "Get 20% OFF your first order & VIP early launch access."
              : mode === "forgot"
              ? "Enter your registered email and we'll send a reset link."
              : "Sign in to check your order status, referral rewards & perks."}
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs sm:text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-green-100 border border-green-300 text-green-800 text-xs sm:text-sm flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Form Container */}
        <form
          onSubmit={
            mode === "signup"
              ? handleSignup
              : mode === "forgot"
              ? handleForgotPassword
              : handleLogin
          }
          className="space-y-3.5"
        >
          {/* Full Name (Sign Up only) */}
          {mode === "signup" && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#741117] mb-1">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Tenzin Norbu"
                  className="w-full bg-white text-[#2B0B0E] placeholder:text-gray-400 text-sm font-medium rounded-xl pl-9 pr-3 py-2.5 border-2 border-[#81191B]/20 focus:outline-none focus:border-[#81191B] transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email Address (All modes) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#741117] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@domain.com"
                className="w-full bg-white text-[#2B0B0E] placeholder:text-gray-400 text-sm font-medium rounded-xl pl-9 pr-3 py-2.5 border-2 border-[#81191B]/20 focus:outline-none focus:border-[#81191B] transition-colors"
              />
            </div>
          </div>

          {/* Password (Signup & Login) */}
          {mode !== "forgot" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#741117]">
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setError("");
                      setSuccess("");
                    }}
                    className="text-[11px] font-bold text-[#81191B] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="w-full bg-white text-[#2B0B0E] placeholder:text-gray-400 text-sm font-medium rounded-xl pl-9 pr-3 py-2.5 border-2 border-[#81191B]/20 focus:outline-none focus:border-[#81191B] transition-colors"
                />
              </div>
            </div>
          )}

          {/* WhatsApp / Phone (Sign Up only) */}
          {mode === "signup" && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#741117] mb-1">
                WhatsApp / Phone <span className="normal-case opacity-70">(Optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-white text-[#2B0B0E] placeholder:text-gray-400 text-sm font-medium rounded-xl px-3 py-2.5 border-2 border-[#81191B]/20 focus:outline-none focus:border-[#81191B] transition-colors"
              />
            </div>
          )}

          {/* Referral Code (Sign Up only) */}
          {mode === "signup" && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#741117] mb-1">
                Referral Code <span className="normal-case opacity-70">(Optional)</span>
              </label>
              <div className="relative">
                <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#81191B]" />
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  placeholder="e.g. FRIEND20"
                  className="w-full bg-white text-[#2B0B0E] placeholder:text-gray-400 text-sm font-medium rounded-xl pl-9 pr-3 py-2.5 border-2 border-[#81191B]/20 focus:outline-none focus:border-[#81191B] transition-colors uppercase"
                />
              </div>
            </div>
          )}

          {/* Consent Checkbox (Sign Up only) */}
          {mode === "signup" && (
            <div className="flex items-start gap-2.5 pt-1 pb-1">
              <input
                id="modal-consent"
                name="consent"
                type="checkbox"
                checked={formData.consent}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded accent-[#81191B] cursor-pointer"
              />
              <label
                htmlFor="modal-consent"
                className="text-[12px] text-[#741117]/90 leading-snug cursor-pointer select-none font-medium"
              >
                I want to receive early launch alerts, spicy recipes & pre-order perks.
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#81191B] hover:bg-[#681315] text-[#FFDE59] font-inter font-black text-[15px] tracking-wider uppercase py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-3 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : mode === "signup" ? (
              "Sign Up & Claim 20% Off"
            ) : mode === "forgot" ? (
              "Send Reset Link"
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Footer Switcher */}
        <div className="mt-4 pt-3 border-t border-[#81191B]/15 text-center">
          {mode === "signup" ? (
            <p className="text-[13px] text-[#741117] font-medium">
              Already on the list?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccess("");
                }}
                className="font-bold underline text-[#81191B] hover:text-black transition-colors cursor-pointer"
              >
                Log in here
              </button>
            </p>
          ) : mode === "forgot" ? (
            <p className="text-[13px] text-[#741117] font-medium">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccess("");
                }}
                className="font-bold underline text-[#81191B] hover:text-black transition-colors cursor-pointer"
              >
                Back to Log In
              </button>
            </p>
          ) : (
            <p className="text-[13px] text-[#741117] font-medium">
              New to de Laphing co.?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError("");
                  setSuccess("");
                }}
                className="font-bold underline text-[#81191B] hover:text-black transition-colors cursor-pointer"
              >
                Sign up for 20% off
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
