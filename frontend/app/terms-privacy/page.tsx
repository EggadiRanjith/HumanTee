"use client";

import Link from "next/link";
import { GradientOverlay } from "@/app/components/ui/layout";

const privacySections = [
  {
    title: "Information We Collect",
    points: [
      "Personal Information: Name, email address, phone number, billing/shipping address, and payment details (processed securely via our payment partners).",
      "Non-Personal Information: Browser type, device information, IP address, and browsing behavior.",
    ],
  },
  {
    title: "How We Use Your Information",
    points: [
      "Process and deliver your orders.",
      "Provide customer support and respond to inquiries.",
      "Send order updates, promotions, and newsletters (you can unsubscribe anytime).",
      "Improve our website, services, and shopping experience.",
      "Prevent fraud and ensure secure transactions.",
    ],
  },
  {
    title: "Sharing of Information",
    points: [
      "We respect your privacy and do not sell or rent your personal data.",
      "We may share your information only with trusted third parties (payment gateways, delivery partners, IT services) who help us run our business.",
      "We may share information with legal authorities if required by law or to protect our rights.",
    ],
  },
  {
    title: "Cookies & Tracking",
    points: [
      "Our website uses cookies and similar technologies to enhance user experience, remember preferences, and analyze traffic.",
      "You can manage or disable cookies through your browser settings.",
    ],
  },
  {
    title: "Data Security",
    points: [
      "We use industry-standard measures to protect your personal data from unauthorized access, loss, or misuse.",
      "Payment information is encrypted and processed securely.",
    ],
  },
  {
    title: "Your Rights",
    points: [
      "Access, update, or correct your personal information.",
      "Request deletion of your account/data (subject to legal or transactional requirements).",
      "Opt out of marketing emails anytime.",
    ],
  },
  {
    title: "Changes to Policy",
    points: [
      "We may update this Privacy Policy from time to time.",
      "Updates will be posted on this page with a revised effective date.",
    ],
  },
];

const termsSections = [
  {
    title: "General",
    points: [
      "This website is owned and operated by Humantee.",
      "By using our site, you agree to these Terms & Conditions along with our Privacy Policy and Return & Exchange Policy.",
      "We may update these terms at any time. Changes will be effective immediately once posted.",
    ],
  },
  {
    title: "Products & Orders",
    points: [
      "All products listed are subject to availability.",
      "We reserve the right to refuse or cancel any order if product availability, pricing errors, or payment issues occur.",
      "Images shown are for illustration; colors may slightly vary due to display settings.",
    ],
  },
  {
    title: "Pricing & Payments",
    points: [
      "Prices are listed in your selected currency and include or exclude applicable taxes as specified at checkout.",
      "We accept payments through secure third-party gateways.",
      "We are not responsible for delays or issues caused by payment providers.",
    ],
  },
  {
    title: "Shipping & Delivery",
    points: [
      "Delivery timelines are estimates and may vary based on location and courier services.",
      "We are not responsible for delays caused by shipping carriers, customs, or unforeseen circumstances.",
    ],
  },
  {
    title: "Returns & Exchanges",
    points: [
      "Returns/exchanges are subject to our Return & Exchange Policy.",
      "Products must meet eligibility conditions to qualify for a refund or exchange.",
    ],
  },
  {
    title: "Intellectual Property",
    points: [
      "All content on this site, including logos, images, designs, and text, is the property of Humantee.",
      "You may not copy, distribute, or use our content without written permission.",
    ],
  },
  {
    title: "Limitation of Liability",
    points: [
      "We are not liable for any indirect, incidental, or consequential damages arising from use of our website or products.",
      "Our total liability is limited to the amount you paid for the product.",
    ],
  },
  {
    title: "User Responsibilities",
    points: [
      "You agree not to misuse our website for fraudulent activities, hacking, or spreading harmful content.",
      "You must provide accurate details while placing an order.",
    ],
  },
  {
    title: "Governing Law",
    points: [
      "These terms are governed by the laws of India.",
      "Any disputes will be subject to the jurisdiction of courts in Bengaluru, Karnataka.",
    ],
  },
];

export default function TermsPrivacyPage() {
  return (
    <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)]">
      <GradientOverlay variant="violet" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* HEADER */}
        <header className="pt-12 sm:pt-16 lg:pt-24 mb-16">
          <p className="text-white/40 text-[10px] uppercase tracking-[0.28em] mb-3">
            Effective Date: 25/09/2025
          </p>

          <h1
            className="
              text-white font-light 
              text-[28px] sm:text-[36px] lg:text-[44px]
              uppercase tracking-[0.18em]
            "
          >
            Privacy & Terms
          </h1>

          <p className="text-white/55 text-[13px] sm:text-[14px] max-w-3xl mt-4 leading-relaxed">
            At Humantee, we are committed to safeguarding your personal information
            and maintaining transparency across all interactions. Review our privacy
            practices and service terms below.
          </p>
        </header>

        {/* PRIVACY SECTION */}
        <section className="space-y-7 mb-16">
          <div className="
            p-6 sm:p-7 rounded-2xl luxury-glass
            bg-white/5 border border-white/10 backdrop-blur-2xl
          ">
            <h2 className="
              text-white/90 text-[12px] sm:text-[13px]
              uppercase tracking-[0.26em] mb-5 font-medium
            ">
              Privacy Policy
            </h2>

            <div className="space-y-6">
              {privacySections.map((section) => (
                <article key={section.title}>
                  <h3 className="
                    text-white/80 text-[11px] sm:text-[12px]
                    uppercase tracking-[0.22em] mb-3
                  ">
                    {section.title}
                  </h3>

                  <ul className="
                    space-y-2 text-white/65
                    text-[13px] sm:text-[14px]
                    leading-[1.8] list-disc list-inside
                    marker:text-white/35
                  ">
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TERMS SECTION */}
        <section className="space-y-7">
          <div className="
            p-6 sm:p-7 rounded-2xl luxury-glass
            bg-white/5 border border-white/10 backdrop-blur-2xl
          ">
            <h2 className="
              text-white/90 text-[12px] sm:text-[13px]
              uppercase tracking-[0.26em] mb-5 font-medium
            ">
              Terms & Conditions
            </h2>

            <div className="space-y-6">
              {termsSections.map((section) => (
                <article key={section.title}>
                  <h3 className="
                    text-white/80 text-[11px] sm:text-[12px]
                    uppercase tracking-[0.22em] mb-3
                  ">
                    {section.title}
                  </h3>

                  <ul className="
                    space-y-2 text-white/65
                    text-[13px] sm:text-[14px]
                    leading-[1.8]
                    list-disc list-inside
                    marker:text-white/35
                  ">
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="
          mt-14 p-6 sm:p-7 rounded-2xl luxury-glass
          bg-white/5 border border-white/10 backdrop-blur-2xl
        ">
          <h2 className="
            text-white/90 text-[12px] sm:text-[13px]
            uppercase tracking-[0.26em] mb-3 font-medium
          ">
            Contact Us
          </h2>

          <p className="text-white/65 text-[13px] sm:text-[14px] leading-[1.8]">
            For questions regarding these policies, contact us at
            <span className="text-white"> humanteeofficial@gmail.com</span>
            or call
            <span className="text-white"> +91 7780-661493</span>.
          </p>
        </section>

      </div>
    </div>
  );
}
