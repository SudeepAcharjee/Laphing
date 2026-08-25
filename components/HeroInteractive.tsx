"use client";

import Image from "next/image";

export default function HeroInteractive() {
  return (
    <div className="relative w-full h-full max-w-[550px] flex justify-center items-center pointer-events-auto">
      {/* Main Hero Package Image */}
      <div className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] lg:h-[580px] z-20 animate-hero-entrance">
        <Image 
          src="/hero.png" 
          alt="The Laphing Co Package" 
          fill
          sizes="(max-width: 768px) 85vw, (max-width: 1200px) 50vw, 550px" 
          className="object-contain drop-shadow-[0_0_80px_rgba(255,174,0,0.18)]" 
          priority 
        />
      </div>
    </div>
  );
}
