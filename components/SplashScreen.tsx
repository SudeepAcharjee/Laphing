"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress interval for the futuristic bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Speed up near the end or just linear
        return prev + 2; 
      });
    }, 40); // 40ms * 50 = 2000ms

    // Fades out after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2500);

    // Removes from DOM after 3 seconds
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-all duration-700 ease-in-out ${
        isFading ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60 z-0 pointer-events-none"
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 w-full max-w-lg md:max-w-2xl px-12 flex flex-col items-center justify-center">
        
        {/* Futuristic Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-[#FFDE59] opacity-10 blur-[100px] rounded-full" />

        {/* Mascot & Bar Container */}
        <div className="w-full relative mt-16 h-32">
          
          {/* Mascot Tracking with Progress */}
          <div 
            className="absolute bottom-4 z-10 transition-all duration-75 ease-linear"
            style={{ left: `${progress}%` }}
          >
            {/* The Mascot wrapper with a futuristic wobble & trail */}
            <div className="absolute -left-[45px] md:-left-[60px] bottom-0 w-[90px] h-[90px] md:w-[120px] md:h-[120px]">
              {/* Motion Trail 1 */}
              <div className="absolute inset-0 opacity-30 -translate-x-4 blur-[2px] animate-pulse">
                <Image src="/Running.svg" alt="Trail" fill className="object-contain" />
              </div>
              {/* Motion Trail 2 */}
              <div className="absolute inset-0 opacity-15 -translate-x-8 blur-[4px] animate-pulse" style={{ animationDelay: '100ms' }}>
                <Image src="/Running.svg" alt="Trail" fill className="object-contain" />
              </div>
              {/* Main Mascot */}
              <div className="relative w-full h-full drop-shadow-[0_0_20px_rgba(255,222,89,0.8)]">
                <Image
                  src="/Running.svg"
                  alt="Running Mascot"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Futuristic Neon Loading Bar */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#222] rounded-full">
            {/* The Fill */}
            <div 
              className="absolute top-0 left-0 h-full bg-[#FFDE59] shadow-[0_0_15px_#FFDE59] transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
            {/* Glowing Tip */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-[6px] h-[6px] bg-white rounded-full shadow-[0_0_10px_2px_#fff,0_0_20px_#FFDE59] transition-all duration-75 ease-linear"
              style={{ left: `calc(${progress}% - 3px)` }}
            />
          </div>

        </div>

        {/* Futuristic Loading Text */}
        <div className="mt-16 flex flex-col items-center">
          <p className="font-anton text-transparent bg-clip-text bg-gradient-to-r from-[#FFDE59] to-[#FFC922] text-xl md:text-2xl tracking-[0.2em] animate-pulse uppercase">
            {progress < 30 ? "PREPARING THE SPICE..." : progress < 70 ? "ROLLING THE LAPHING..." : "READY TO SERVE..."}
          </p>
          <div className="flex gap-1 mt-3">
            <span className="w-1.5 h-1.5 bg-[#FFDE59] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-[#FFDE59] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-[#FFDE59] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="font-mono text-[#555] text-[10px] mt-4 tracking-widest">
            {progress.toFixed(0)}%
          </p>
        </div>

      </div>
    </div>
  );
}
