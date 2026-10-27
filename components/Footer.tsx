import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#741117] border-t border-black/10 select-none overflow-hidden py-10 sm:py-14 md:py-16">
      <div className="w-full max-w-[1440px] mx-auto px-5 xs:px-6 sm:px-10 md:px-14 lg:px-20 flex flex-col md:flex-row md:items-center justify-between gap-8 sm:gap-10 md:gap-14">
        
        {/* Left: Brand Logo with yellow 'the' and white 'laphing Co.' */}
        <div className="shrink-0 flex items-center">
          <Link
            href="/"
            className="inline-block transition-transform duration-300 hover:scale-105 active:scale-95"
            aria-label="de Laphing co. Home"
          >
            <div className="relative w-[140px] xs:w-[160px] sm:w-[190px] md:w-[220px] h-[65px] xs:h-[75px] sm:h-[90px] md:h-[105px]">
              <Image
                src="/logo-footer.svg"
                alt="the laphing Co."
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Right: Vertical Navigation in Inter font with inline Copyright */}
        <div className="flex-1 md:flex md:justify-end">
          <nav aria-label="Footer Navigation" className="flex flex-col gap-2.5 sm:gap-3">
            <Link
              href="/faq"
              className="font-inter font-medium text-[#FFF5DB] text-[15px] xs:text-[17px] sm:text-[19px] md:text-[21px] tracking-wide hover:text-[#FFDE59] transition-colors duration-200 uppercase w-fit"
            >
              FAQ
            </Link>
            <Link
              href="/terms"
              className="font-inter font-medium text-[#FFF5DB] text-[15px] xs:text-[17px] sm:text-[19px] md:text-[21px] tracking-wide hover:text-[#FFDE59] transition-colors duration-200 uppercase w-fit"
            >
              TERMS OF SERVICE
            </Link>
            <Link
              href="/privacy"
              className="font-inter font-medium text-[#FFF5DB] text-[15px] xs:text-[17px] sm:text-[19px] md:text-[21px] tracking-wide hover:text-[#FFDE59] transition-colors duration-200 uppercase w-fit"
            >
              PRIVACY POLICY
            </Link>
            
            {/* 4th row: Accessibility + Copyright on same line on wider screens, clean wrapping on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2.5 sm:gap-10 md:gap-14 lg:gap-20 pt-1 sm:pt-0">
              <Link
                href="/accessibility"
                className="font-inter font-medium text-[#FFF5DB] text-[15px] xs:text-[17px] sm:text-[19px] md:text-[21px] tracking-wide hover:text-[#FFDE59] transition-colors duration-200 uppercase w-fit shrink-0"
              >
                ACCESSIBILITY
              </Link>
              <span className="text-[11px] sm:text-[12px] md:text-[13px] text-[#FFF5DB]/60 tracking-normal font-inter sm:self-center leading-relaxed">
                © 2026 — The Laphing Co. • Majnu-ka-tilla, New Delhi • All Rights Reserved
              </span>
            </div>
          </nav>
        </div>

      </div>
    </footer>
  );
}

