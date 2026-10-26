"use client";

import { useState, Suspense } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Lock, Mail, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const unauthorized = searchParams.get("error") === "unauthorized";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin"); // Redirect to dashboard overview on success
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#3D0F13] border border-[#741B20] rounded-3xl shadow-2xl p-8 sm:p-10 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#FFDE59]/15 blur-[60px] pointer-events-none" />

      <div className="relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block relative w-[140px] h-[40px] mb-4">
            <Image
              src="/logomain.svg"
              alt="The Laphing Co."
              fill
              className="object-contain"
              priority
            />
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#FFDE59] text-[#741117]">
              Admin Portal
            </span>
          </div>
          <p className="text-yellow-100/70 text-xs mt-1">Sign in to access your store operations</p>
        </div>

        {error && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-300 p-3.5 rounded-xl mb-6 text-xs text-center font-semibold">
            {error}
          </div>
        )}

        {unauthorized && !error && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-300 p-3.5 rounded-xl mb-6 text-xs text-center font-semibold">
            You do not have administrative privileges.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-yellow-200/80 ml-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-yellow-200/50" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 bg-[#240608] border border-[#62161A] rounded-xl py-3 text-sm text-yellow-50 placeholder-yellow-100/30 focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent transition-all outline-none font-medium"
                placeholder="admin@laphing.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-yellow-200/80 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-yellow-200/50" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 bg-[#240608] border border-[#62161A] rounded-xl py-3 text-sm text-yellow-50 placeholder-yellow-100/30 focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent transition-all outline-none font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFDE59] hover:bg-[#ffe37a] text-[#741117] font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FFDE59]/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95 mt-4 text-sm uppercase tracking-wider"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Authenticating...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-[#240608] text-yellow-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#741117]/30 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFDE59]/10 blur-[150px] pointer-events-none rounded-full" />
      <Suspense fallback={<Loader2 className="w-10 h-10 animate-spin text-[#FFDE59]" />}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
