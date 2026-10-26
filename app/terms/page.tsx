"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen w-full bg-[#FFDE59] text-[#741117] flex flex-col justify-between selection:bg-[#741117] selection:text-white">
      {/* Brand Navbar */}
      <Navbar />

      {/* Main Content Stage */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 flex-1">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <span className="font-inter font-bold text-[#741117]/80 text-xs sm:text-sm uppercase tracking-widest block mb-2">
            de Laphing co. • Legal
          </span>
          <h1 className="font-slackey text-3xl sm:text-4xl md:text-5xl text-[#741117] tracking-wide uppercase mb-3">
            TERMS OF SERVICE
          </h1>
          <p className="font-inter font-medium text-[#741117]/85 text-sm sm:text-base max-w-xl mx-auto">
            Please read these terms carefully before joining our waitlist, placing a pre-order, or using our website.
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
              1. Acceptance of Terms
            </h2>
            <p className="text-white/85">
              By accessing, browsing, registering on <strong className="text-white">thelaphingco.com</strong>, or placing a pre-order, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please discontinue your use of our platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-6 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFDE59]">
              2. Eligibility & Account Registration
            </h2>
            <p className="text-white/85">
              To join our waitlist, earn referral discounts, or purchase packs, you must register with accurate and verifiable details (legal name, active email address, and delivery phone number). You are responsible for maintaining the confidentiality of your account credentials.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-6 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFDE59]">
              3. Waitlist & Referral Promotional Discounts
            </h2>
            <p className="text-white/85">
              de Laphing co. offers exclusive early-bird incentives:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-white/80">
              <li>
                <strong className="text-white">20% OFF Launch Discount:</strong> Automatically applied to your launch order when registering for the official waitlist.
              </li>
              <li>
                <strong className="text-white">+10% OFF Referral Credits:</strong> For every friend who signs up using your unique referral link, you receive an additional +10% discount on your order.
              </li>
              <li>
                Promotional credits are non-transferable and may not be redeemed for raw cash. Any bot signups or self-referral attempts will result in immediate cancellation of referral rewards.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-6 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFDE59]">
              4. Pricing, Payments & Billing
            </h2>
            <p className="text-white/85">
              All prices shown on the website are in Indian Rupees (INR) and inclusive of applicable goods and service taxes (GST). Payment transactions are processed securely through our authorized payment partner, Razorpay. We do not store raw payment card credentials on our servers.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pt-6 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFDE59]">
              5. Shipping & Order Fulfillment
            </h2>
            <p className="text-white/85">
              Pre-orders are scheduled for priority dispatch as soon as the launch batch is completed. You will receive an email confirmation and tracking link once your shipment leaves our facility. Please verify that your delivery address and phone number are accurate at checkout.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-6 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFDE59]">
              6. Food Safety, Storage & Shelf Life
            </h2>
            <p className="text-white/85">
              Our unopened packs have a shelf life of 6 months when kept in a cool, dry place away from direct heat and sunlight. Once rehydrated or prepared, Laphing should be consumed fresh within the day. Due to the perishable nature of food items, unopened packs cannot be returned once delivered, unless damaged during transit.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 pt-6 border-t border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFDE59]">
              7. Governing Law & Contact
            </h2>
            <p className="text-white/85">
              These Terms are governed by and construed in accordance with the laws of India. Any disputes arising in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-white/75 bg-white/5 p-4 rounded-2xl border border-white/10">
              <span>Questions regarding these terms?</span>
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
