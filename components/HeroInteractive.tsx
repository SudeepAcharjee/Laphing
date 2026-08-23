"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function HeroInteractive() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(0.45);
  const [spreadFactor, setSpreadFactor] = useState(1);
  const [baseY, setBaseY] = useState(80);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width < 768) {
        setSpreadFactor(0.9); // Keeps outer packages safely within the 375px mobile screen edge
        setScaleFactor(0.2);
        setBaseY(60);
      } else if (width < 1024) {
        setSpreadFactor(0.85);
        setScaleFactor(0.3);
        setBaseY(70);
      } else {
        setSpreadFactor(1);
        setScaleFactor(0.4);
        setBaseY(80);
      }
    };

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollPosition / windowHeight));
      setScrollProgress(progress);
    };

    // Initial checks
    handleScroll();
    handleResize();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Configuration for the 6 packages fanning out (Horizontal layout for all screens)
  const packages = [
    { src: "/1.png", x: -370, y: 50, r: -20, z: 10 },
    { src: "/2.png", x: -290, y: 20, r: -10, z: 10 },
    { src: "/3.png", x: -210, y: 0,  r: -5,  z: 10 },
    { src: "/4.png", x: 210,  y: 0,  r: 5,   z: 10 },
    { src: "/5.png", x: 290,  y: 20, r: 10,  z: 10 },
    { src: "/6.png", x: 370,  y: 50, r: 20,  z: 10 },
  ];

  return (
    <div className={`relative w-full h-full max-w-[900px] flex justify-center items-center pointer-events-auto transition-opacity duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Package Images (Spread on scroll) */}
      {packages.map((pkg, index) => (
        <div 
          key={index}
          className="absolute w-[45px] h-[45px] md:w-[75px] md:h-[75px] lg:w-[110px] lg:h-[110px] ease-out will-change-transform"
          style={{
            zIndex: pkg.z,
            transform: `translate(${pkg.x * spreadFactor * scrollProgress}%, ${pkg.y * spreadFactor * scrollProgress}%) rotate(${pkg.r * scrollProgress}deg) scale(${0.6 + (0.4 * scrollProgress)})`,
            opacity: scrollProgress * 1.5 // Fade in slightly faster than position
          }}
        >
          <div className="w-full h-full relative animate-[fade-in-up_0.8s_ease-out_both]" style={{ animationDelay: `${3.0 + index * 0.1}s` }}>
            <Image src={pkg.src} alt={`Package ${index + 1}`} fill sizes="(max-width: 768px) 45px, (max-width: 1024px) 75px, 110px" className="object-contain drop-shadow-xl" />
          </div>
        </div>
      ))}

      {/* Main Hero Image (Front) */}
      <div 
        className="relative w-[40%] h-[40%] md:w-[85%] md:h-[85%] z-20 ease-out will-change-transform"
        style={{
          transform: `scale(${0.8 + (scaleFactor * scrollProgress)}) translateY(${20 - (20 * scrollProgress)}%)`,
        }}
      >
        <div className="w-full h-full relative animate-hero-entrance" style={{ animationDelay: '2.8s' }}>
          <Image 
            src="/hero.png" 
            alt="The Laphing Co Hero" 
            fill
            sizes="(max-width: 768px) 75vw, 50vw" 
            className="object-contain drop-shadow-[0_0_80px_rgba(255,222,89,0.15)]" 
            priority 
          />
        </div>
      </div>
    </div>
  );
}
