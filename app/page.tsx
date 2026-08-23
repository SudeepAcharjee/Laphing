import Image from "next/image";
import Link from "next/link";
import SplashScreen from "@/components/SplashScreen";
import HeroInteractive from "@/components/HeroInteractive";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#070707] font-sans text-white overflow-clip flex flex-col">
      <SplashScreen />
      
      {/* Background Image with Dark Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image src="/image.png" alt="Background" fill className="object-cover" priority />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Background Dotted Path Detail */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 850 C 300 950, 500 650, 1500 800" stroke="#FFC107" strokeWidth="1" strokeDasharray="5 10" fill="transparent" opacity="0.4" />
          <path d="M700 0 C 1000 300, 1100 150, 1500 500" stroke="#FFC107" strokeWidth="1" strokeDasharray="5 10" fill="transparent" opacity="0.4" />
          <path d="M-50 400 C 400 300, 800 600, 1500 100" stroke="#FFC107" strokeWidth="1" strokeDasharray="5 10" fill="transparent" opacity="0.2" />
        </svg>
      </div>

      <Navbar />

      {/* Scrollable Container for Animation (300vh) */}
      <div className="h-[250vh] relative">
        {/* Sticky Container holding the actual content */}
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-start pt-36 md:pt-28 overflow-clip">
          
          {/* Centered Text Content */}
          <div className="flex flex-col justify-center items-center z-30 text-center px-4 shrink-0 mt-6 md:mt-4 mb-4 md:mb-8 lg:mb-12">
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6 animate-[fade-in-up_0.8s_ease-out_2.6s_both]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FFDE59]"></div>
              <span className="text-white/80 font-inter font-bold tracking-[0.15em] text-[10px] md:text-[11px] uppercase">
                SPICY. TANGY. ADDICTIVE.
              </span>
            </div>

            <h1 className="font-inter font-medium text-[35px] md:text-[50px] lg:text-[65px] leading-[1.05] text-white mb-6 tracking-tight animate-[fade-in-up_0.8s_ease-out_2.8s_both]">
              We <span className="font-serif italic text-[#FFDE59] font-normal">make</span> really cool <br className="hidden md:block"/>
              laphing in 7 <span className="font-serif italic text-[#FFDE59] font-normal">mins.</span>
            </h1>
            
            <p className="text-white/60 font-inter text-[15px] md:text-[18px] leading-relaxed max-w-[400px] mb-8 font-normal animate-[fade-in-up_0.8s_ease-out_3.0s_both]">
              Affordable, fast and human powered cravings.
            </p>
            
            <div className="flex items-center gap-4 animate-[fade-in-up_0.8s_ease-out_3.2s_both] relative mt-2">
              
              {/* Mascot Sitting on Button */}
              <div className="absolute -top-[38px] right-1 md:-top-[50px] md:right-2 w-[52px] h-[52px] md:w-[65px] md:h-[65px] z-10 animate-swing origin-bottom cursor-pointer hover:animate-laugh transition-transform">
                <Image src="/sitting.svg" alt="Sitting Mascot" fill className="object-contain drop-shadow-[0_4px_10px_rgba(255,222,89,0.3)] pointer-events-none" />
              </div>

              <button className="bg-[#FFDE59] text-black px-8 py-3.5 rounded-full font-bold text-[14px] flex items-center gap-2 hover:bg-[#e5c750] transition-colors relative z-0 shadow-[0_0_20px_rgba(255,222,89,0.2)]">
                Sign Up Now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M13 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Interactive Scroll Hero Image Container */}
          <div className="relative flex-grow w-full z-20 flex justify-center items-center pointer-events-none pb-8 md:pb-12 mt-4 md:mt-0">
            <HeroInteractive />
          </div>

        </div>
      </div>

    </div>
  );
}
