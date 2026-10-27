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
  };

  const generateReferralCode = (name: string) => {
    const randomString = Math.random().toString(36).substring(2, 6);
    const prefix = (name.trim().split(" ")[0] || "laphing").toLowerCase().replace(/[^a-z0-9]/g, "");
    return `${prefix || "user"}-${randomString}`;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.consent) {
      setError("Please check the box to confirm receiving your discount & updates.");
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch settings
      let preLaunchDiscount = 20;
      let referDiscount = 10;
      let maxReferrals = 2;
      try {
        const settingsSnap = await getDoc(doc(db, "settings", "global"));
        if (settingsSnap.exists()) {
          const d = settingsSnap.data();
          preLaunchDiscount = d.preLaunchDiscount ?? 20;
          referDiscount = d.referralDiscount ?? 10;
          if (d.maxReferrals !== undefined && d.maxReferrals !== null) {
            maxReferrals = Number(d.maxReferrals);
          }
        }
      } catch (err) {
        console.warn("Could not fetch global settings, using defaults", err);
      }

      // 2. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );
      const newUser = userCredential.user;

      // 3. Generate unique referral code
      const userRefCode = generateReferralCode(formData.name);
      const rawRef = formData.referralCode.trim();
      const appliedRef = rawRef ? rawRef.toLowerCase() : null;

      // 4. Save user document in Firestore (NO address field)
      await setDoc(doc(db, "users", newUser.uid), {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        consent: formData.consent,
        referralCode: userRefCode,
        referredBy: rawRef || null,
        discountAvailable: preLaunchDiscount,
        createdAt: new Date(),
        referralsCount: 0,
      });

      // 5. If referred, increment referrer's count & grant +10% only when 2 friends sign up
      if (appliedRef && appliedRef !== userRefCode.toLowerCase()) {
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
        await sendPasswordResetEmail(auth, targetEmail);
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
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      {/* Modal Card - Solid Brand Yellow Background */}
      <div className="relative w-full max-w-[430px] my-auto bg-[#FFDE59] text-[#741117] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.45)] border-2 border-[#81191B]/20 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          type="button"
          aria-label="Close dialog"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 flex items-center justify-center rounded-full bg-[#81191B]/10 hover:bg-[#81191B] text-[#81191B] hover:text-[#FFDE59] transition-all duration-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-5 pt-1">
          <h3 className="font-inter font-black text-[#81191B] text-[24px] sm:text-[27px] leading-tight uppercase tracking-tight">
            {mode === "signup"
              ? "Get On The List"
              : mode === "forgot"
              ? "Reset Password"
              : "Welcome Back"}
          </h3>
          <p className="font-inter font-medium text-[#741117]/85 text-[13px] sm:text-[14px] mt-1 max-w-[320px] leading-snug">
            {mode === "signup"
              ? "Sign up for 20% off at launch & exclusive spice drops."
              : mode === "forgot"
              ? "Enter your registered email and we will send a password reset link."
              : "Log in to check your referrals and pre-order perks."}
          </p>
        </div>

        {/* Tab Switcher OR Back Button */}
        {mode === "forgot" ? (
          <div className="flex justify-center mb-5">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#81191B] hover:text-black bg-[#81191B]/10 hover:bg-[#81191B]/20 px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Log In</span>
            </button>
          </div>
        ) : (
          <div className="flex p-1 bg-[#81191B]/15 rounded-full mb-5 max-w-[280px] mx-auto">
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-1.5 text-[13px] sm:text-[14px] font-inter font-bold rounded-full transition-all duration-200 uppercase tracking-wide ${
                mode === "signup"
                  ? "bg-[#81191B] text-[#FFDE59] shadow-sm"
                  : "text-[#81191B] hover:text-black cursor-pointer"
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-1.5 text-[13px] sm:text-[14px] font-inter font-bold rounded-full transition-all duration-200 uppercase tracking-wide ${
                mode === "login"
                  ? "bg-[#81191B] text-[#FFDE59] shadow-sm"
                  : "text-[#81191B] hover:text-black cursor-pointer"
              }`}
            >
              Log In
            </button>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="bg-[#81191B] text-[#FFDE59] px-4 py-3 rounded-xl mb-4 text-[13px] font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-900/90 text-white px-4 py-2.5 rounded-xl mb-4 text-[13px] font-medium flex items-center gap-2 shadow-sm animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-300" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={
            mode === "signup"
              ? handleSignup
              : mode === "forgot"
              ? handleForgotPassword
              : handleLogin
          }
          className="space-y-3"
        >
          {/* Sign Up Fields */}
          {mode === "signup" && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-[#81191B]/60" />
              </div>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFBF0] border border-[#81191B]/30 focus:border-[#81191B] text-[#580F13] placeholder-[#81191B]/50 rounded-xl text-[14px] font-medium outline-none transition-all shadow-inner"
              />
            </div>
          )}

          {/* Email Field (All Modes) */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-[#81191B]/60" />
            </div>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFBF0] border border-[#81191B]/30 focus:border-[#81191B] text-[#580F13] placeholder-[#81191B]/50 rounded-xl text-[14px] font-medium outline-none transition-all shadow-inner"
            />
          </div>

          {/* Password Field (Signup and Login Only) */}
          {mode !== "forgot" && (
            <div className="space-y-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#81191B]/60" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={mode === "signup" ? "Enter a New password" : "Password"}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFBF0] border border-[#81191B]/30 focus:border-[#81191B] text-[#580F13] placeholder-[#81191B]/50 rounded-xl text-[14px] font-medium outline-none transition-all shadow-inner"
                />
              </div>

              {/* Forgot Password Link in Login Mode */}
              {mode === "login" && (
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setError("");
                      setSuccess("");
                    }}
                    className="text-[12px] font-bold text-[#81191B]/90 hover:text-[#81191B] hover:underline cursor-pointer transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Referral Code Field (Sign Up Only) */}
          {mode === "signup" && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Gift className="h-4 w-4 text-[#81191B]/60" />
              </div>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="Referral Code (Optional)"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFBF0] border border-[#81191B]/30 focus:border-[#81191B] text-[#580F13] placeholder-[#81191B]/50 rounded-xl text-[14px] font-medium outline-none transition-all shadow-inner"
              />
            </div>
          )}

          {/* Consent Checkbox (Sign Up Only) */}
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
