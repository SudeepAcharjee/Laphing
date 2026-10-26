"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen w-full bg-[#FFDE59] text-[#741117] flex flex-col justify-between selection:bg-[#741117] selection:text-white">
      {/* Brand Navbar */}
      <Navbar />

      {/* Main Content Stage */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 flex-1">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <span className="font-inter font-bold text-[#741117]/80 text-xs sm:text-sm uppercase tracking-widest block mb-2">
            de Laphing co. • Privacy
          </span>
          <h1 className="font-slackey text-3xl sm:text-4xl md:text-5xl text-[#741117] tracking-wide uppercase mb-3">
            PRIVACY POLICY
          </h1>
          <p className="font-inter font-medium text-[#741117]/85 text-sm sm:text-base max-w-xl mx-auto">
            We value your trust. Here is a clear, honest explanation of how we collect, protect, and handle your data.
          </p>
          <div className="mt-3 text-xs text-[#741117]/70 font-inter font-medium">
            Last Updated: October 2026
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-[#741117] text-white border-2 border-[#540B10] rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl space-y-8 font-inter text-sm sm:text-base leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFDE59]">
              1. Information We Collect
            </h2>
            <p className="text-white/85">
              When you join our waitlist, create a profile, or pre-order products, we collect the following details:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-white/80">
              <li><strong className="text-white">Contact Details:</strong> Your name, email address, and mobile number.</li>
              <li><strong className="text-white">Shipping Address:</strong> Street address, city, state, and pincode for accurate dispatch.</li>
              <li><strong className="text-white">Account Information:</strong> Login credentials, referral links, and stacked discount percentage.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-6 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFDE59]">
              2. How We Use Your Data
            </h2>
            <p className="text-white/85">
              We only use your personal information to deliver our products and improve your experience:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-white/80">
              <li>Fulfill and deliver your pre-orders.</li>
              <li>Send transaction receipts and batch dispatch updates.</li>
              <li>Credit referral discounts and apply your 20% waitlist perks automatically.</li>
              <li>Provide customer support when you reach out to our team.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-6 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFDE59]">
              3. Zero Data Selling Guarantee
            </h2>
            <p className="text-white/85">
              We never sell, rent, monetise, or trade your personal information with third-party data brokers or marketing agencies. Your contact details are strictly used for your relationship with <strong className="text-white">de Laphing co.</strong>
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-6 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFDE59]">
              4. Payment Security & Processing
            </h2>
            <p className="text-white/85">
              All payment transactions are encrypted and processed through our payment gateway partner, Razorpay. We never store, process, or have access to your complete credit card numbers, debit card numbers, or UPI PINs on our servers.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pt-6 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFDE59]">
              5. Data Storage & Security
            </h2>
            <p className="text-white/85">
              Your account details and orders are safeguarded using Firebase Authentication and Firestore database with strict security rules and SSL encryption in transit and at rest.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-6 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFDE59]">
              6. Your Privacy Rights
            </h2>
            <p className="text-white/85">
              You can view and edit your profile details at any time from your account page. If you would like your account, order history, or contact details completely removed from our system, simply email us at <strong className="text-white">support@thelaphingco.com</strong>.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-white/75 bg-white/5 p-4 rounded-2xl border border-white/10">
              <span>Have privacy questions or request data deletion?</span>
              <a
                href="mailto:support@thelaphingco.com"
                className="inline-flex items-center gap-1.5 text-[#FFDE59] font-bold hover:underline"
              >
                <Mail className="w-4 h-4" />
                <span>support@thelaphingco.com</span>
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
