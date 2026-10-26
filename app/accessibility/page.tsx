"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail } from "lucide-react";

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen w-full bg-[#FFDE59] text-[#741117] flex flex-col justify-between selection:bg-[#741117] selection:text-white">
      {/* Brand Navbar */}
      <Navbar />

      {/* Main Content Stage */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 flex-1">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <span className="font-inter font-bold text-[#741117]/80 text-xs sm:text-sm uppercase tracking-widest block mb-2">
            de Laphing co. • Accessibility
          </span>
          <h1 className="font-slackey text-3xl sm:text-4xl md:text-5xl text-[#741117] tracking-wide uppercase mb-3">
            ACCESSIBILITY STATEMENT
          </h1>
          <p className="font-inter font-medium text-[#741117]/85 text-sm sm:text-base max-w-xl mx-auto">
            Great food and great web experiences should be accessible to everyone. Here is how we ensure universal usability.
          </p>
          <div className="mt-3 text-xs text-[#741117]/70 font-inter font-medium">
            Standard: WCAG 2.1 Level AA • Continuously Audited
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-[#741117] text-white border-2 border-[#540B10] rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl space-y-8 font-inter text-sm sm:text-base leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFDE59]">
              1. Our Commitment to Accessibility
            </h2>
            <p className="text-white/85">
              At <strong className="text-white">de Laphing co.</strong>, we are committed to making our website, digital pre-order experience, and customer accounts usable and accessible for all individuals, including people with visual, hearing, motor, or cognitive disabilities.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-6 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFDE59]">
              2. Technical Standards & Practices
            </h2>
            <p className="text-white/85">
              Our website is built following the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-white/80">
              <li><strong className="text-white">High Contrast:</strong> Our brand palette features high-contrast combinations (e.g. bold white and golden yellow against deep velvet maroon) exceeding minimum 4.5:1 contrast standards.</li>
              <li><strong className="text-white">Keyboard Navigation:</strong> All interactive buttons, modals, forms, and links can be navigated using standard keyboard tab keys.</li>
              <li><strong className="text-white">Semantic HTML:</strong> Pages use standard HTML5 landmarks, descriptive alt attributes for food images, and accessible form labels.</li>
              <li><strong className="text-white">Scalable Layouts:</strong> The site smoothly scales and adapts when users zoom up to 200% without loss of content or functionality.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-6 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFDE59]">
              3. Ongoing Audits & Enhancements
            </h2>
            <p className="text-white/85">
              We periodically test our interfaces across modern web browsers (Chrome, Safari, Firefox, Edge) and mobile devices to identify and remediate any potential accessibility bottlenecks.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-6 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFDE59]">
              4. Feedback & Accessibility Support
            </h2>
            <p className="text-white/85">
              If you experience any difficulty accessing content, navigating our store, or placing an order, please reach out to us. We will gladly assist you and implement prompt improvements.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-white/75 bg-white/5 p-4 rounded-2xl border border-white/10">
              <span>Need help or want to report an accessibility issue?</span>
              <a
                href="mailto:delaphingcompany@gmail.com"
                className="inline-flex items-center gap-1.5 text-[#FFDE59] font-bold hover:underline"
              >
                <Mail className="w-4 h-4" />
                <span>delaphingcompany@gmail.com</span>
              </a>
            </div>
          </section>

        </div>

      </main>

      {/* Brand Footer */}
      <Footer />
    </div>
  );
}
