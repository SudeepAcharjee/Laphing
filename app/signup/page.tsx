"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function SignupRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    const target = ref ? `/?auth=signup&ref=${encodeURIComponent(ref)}` : "/?auth=signup";
    router.replace(target);
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-[#FFDE59]" />
      <span className="text-zinc-400 text-sm">Opening Sign Up dialog...</span>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex items-center justify-center p-4">
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-[#FFDE59]" />}>
        <SignupRedirect />
      </Suspense>
    </div>
  );
}
