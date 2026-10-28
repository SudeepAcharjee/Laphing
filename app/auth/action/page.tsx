"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function ActionHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get("mode");
    const oobCode = searchParams.get("oobCode");
    const continueUrl = searchParams.get("continueUrl");

    const params = new URLSearchParams();
    if (mode) params.set("mode", mode);
    if (oobCode) params.set("oobCode", oobCode);
    if (continueUrl) params.set("continueUrl", continueUrl);

    if (mode === "resetPassword") {
      router.replace(`/reset-password?${params.toString()}`);
    } else {
      router.replace(`/?${params.toString()}`);
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-white">
      <Loader2 className="w-8 h-8 animate-spin text-[#FFDE59]" />
      <p className="font-semibold text-sm">Processing authentication action...</p>
    </div>
  );
}

export default function AuthActionPage() {
  return (
    <div className="min-h-screen bg-[#741117] flex items-center justify-center">
      <Suspense
        fallback={
          <div className="flex items-center justify-center text-white">
            <Loader2 className="w-8 h-8 animate-spin text-[#FFDE59]" />
          </div>
        }
      >
        <ActionHandler />
      </Suspense>
    </div>
  );
}

