"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/?auth=login");
  }, [router]);

  return (
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-[#FFDE59]" />
      <span className="text-zinc-400 text-sm">Opening Log In dialog...</span>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex items-center justify-center p-4">
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-[#FFDE59]" />}>
        <LoginRedirect />
      </Suspense>
    </div>
  );
}
