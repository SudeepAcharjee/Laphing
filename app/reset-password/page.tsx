"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Firebase passes action code in 'oobCode' query param
  const oobCode = searchParams.get("oobCode") || "";
  const mode = searchParams.get("mode") || "resetPassword";

  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(true);
  const [invalidCode, setInvalidCode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setVerifying(false);
      setInvalidCode(true);
      setError("No reset code provided in the link. Please request a new password reset link.");
      return;
    }

    // Verify the password reset code with Firebase
    verifyPasswordResetCode(auth, oobCode)
      .then((userEmail) => {
        setEmail(userEmail);
        setVerifying(false);
      })
      .catch((err) => {
        console.error("Code verification error:", err);
        setVerifying(false);
        setInvalidCode(true);
        if (err.code === "auth/expired-action-code") {
          setError("This password reset link has expired. Please request a new one.");
        } else if (err.code === "auth/invalid-action-code") {
          setError("This password reset link is invalid or has already been used.");
        } else {
          setError("Invalid or expired reset link. Please try again.");
        }
      });
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess(true);
    } catch (err: any) {
      console.error("Confirm password error:", err);
      if (err.code === "auth/expired-action-code") {
        setError("This reset link has expired. Please request a new one.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.");
      } else {
        setError(err.message || "Failed to reset password. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-12 px-4 sm:px-0">
      <div className="bg-[#FFF5DB] text-[#2B0B0E] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-[#FFDE59]">
        
        {/* Brand Heading */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#741117] text-[#FFDE59] mb-3 shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="font-bebas text-3xl sm:text-4xl text-[#741117] tracking-wider uppercase leading-none">
            Reset Your Password
          </h1>
          {email && !success && (
            <p className="text-xs sm:text-sm text-[#741117]/80 mt-1 font-medium">
              for <strong className="text-[#741117]">{email}</strong>
            </p>
          )}
        </div>

        {/* State 1: Verifying code */}
        {verifying && (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#741117]" />
            <p className="text-sm font-semibold text-[#741117]">Verifying reset link...</p>
          </div>
        )}

        {/* State 2: Invalid or expired code */}
        {!verifying && invalidCode && (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-xl bg-red-100 border border-red-300 text-red-800 text-sm flex items-start gap-2.5 text-left">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
            <Link
              href="/?auth=forgot"
              className="inline-flex items-center justify-center w-full bg-[#741117] hover:bg-[#5a0c11] text-[#FFDE59] font-bold py-3 px-4 rounded-xl transition uppercase tracking-wide text-sm"
            >
              Request a New Reset Link
            </Link>
          </div>
        )}

        {/* State 3: Password reset successful */}
        {!verifying && success && (
          <div className="space-y-5 text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-1">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-[#741117] tracking-wide uppercase">
                Password Reset Complete!
              </h2>
              <p className="text-xs sm:text-sm text-[#741117]/90 mt-1 font-medium">
                Your password has been successfully updated. You can now log in with your new credentials.
              </p>
            </div>
            <Link
              href="/?auth=login"
              className="inline-flex items-center justify-center gap-2 w-full bg-[#741117] hover:bg-[#5a0c11] text-[#FFDE59] font-bold py-3.5 px-4 rounded-xl transition uppercase tracking-wider text-sm shadow-md"
            >
              <span>Log In Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* State 4: Form ready */}
        {!verifying && !invalidCode && !success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs sm:text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#741117] mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  autoFocus
                  minLength={6}
                  className="w-full bg-white text-[#2B0B0E] placeholder:text-gray-400 border-2 border-[#81191B]/20 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:border-[#741117] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#741117]"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#741117] mb-1.5">
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                minLength={6}
                className="w-full bg-white text-[#2B0B0E] placeholder:text-gray-400 border-2 border-[#81191B]/20 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:border-[#741117]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#741117] hover:bg-[#5a0c11] text-[#FFDE59] font-inter font-bold uppercase tracking-wider text-sm py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving New Password...</span>
                </>
              ) : (
                "Save & Reset Password"
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#741117] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#FFDE59]" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

