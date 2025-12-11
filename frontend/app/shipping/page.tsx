"use client";

import Link from "next/link";
import { GradientOverlay } from "@/app/components/ui/layout";

const shippingSections = [
  {
    title: "Order Processing",
    points: [
      "Orders are processed within 1–2 business days after payment confirmation.",
      "Orders placed on weekends or holidays will be processed on the next business day.",
    ],
  },
  {
    title: "Shipping Methods & Timelines",
    points: [
      "Standard Shipping: Delivered within 5–7 business days.",
      "Express Shipping (if available): Delivered within 2–4 business days.",
      "Delivery times may vary depending on your location and courier service.",
    ],
  },
  {
    title: "Shipping Charges",
    points: [
      "Free shipping on orders above 500 Rupees.",
      "Orders below the minimum amount will have a flat shipping fee of 50 Rupees.",
      "Express shipping charges (if offered) will be calculated at checkout.",
    ],
  },
  {
    title: "Tracking Your Order",
    points: [
      "Once shipped, you will receive an email/SMS with tracking details.",
      "You can track your order using the provided tracking number.",
    ],
  },
  {
    title: "Delays & Responsibility",
    points: [
      "We are not responsible for delays caused by courier partners, natural events, or incorrect shipping details provided by customers.",
      "If your package is delayed, please contact our support team for assistance.",
    ],
  },
  {
    title: "International Shipping (if applicable)",
    points: [
      "We ship worldwide to selected countries.",
      "International shipping rates and delivery times vary by destination.",
      "Customs duties, taxes, or import fees are the responsibility of the customer.",
    ],
  },
  {
    title: "Incorrect Address / Failed Delivery",
    points: [
      "Customers are responsible for providing the correct shipping address.",
      "If a package is returned due to an incorrect or incomplete address, reshipping charges will apply.",
    ],
  },
];

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)]">
      <GradientOverlay variant="violet" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* PAGE HEADER */}
        <header className="pt-12 sm:pt-16 lg:pt-24 mb-14">
          <p className="text-white/40 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] mb-3">
            Effective Date: 25/09/2025
          </p>

          <h1
            className="
              text-white font-light
              text-[28px] sm:text-[36px] lg:text-[44px]
              uppercase tracking-[0.18em]
            "
          >
            Shipping Policy
          </h1>

          <p className="text-white/55 text-[13px] sm:text-[14px] max-w-2xl mt-4 leading-relaxed">
            At Humantee, we aim to deliver your orders quickly and safely.
            Please review our shipping standards and responsibilities below.
          </p>
        </header>

        {/* POLICY SECTIONS */}
        <div className="space-y-7">
          {shippingSections.map((section) => (
            <section
              key={section.title}
              className="
                p-6 sm:p-7 rounded-2xl luxury-glass
                bg-white/5 border border-white/10 backdrop-blur-2xl
              "
            >
              <h2 className="
                text-white/90 text-[12px] sm:text-[13px]
                uppercase tracking-[0.26em] mb-4 font-medium
              ">
                {section.title}
              </h2>

              <ul className="
                space-y-2 text-white/70 
                text-[13px] sm:text-[14px]
                leading-[1.8]
                list-disc list-inside
              ">
                {section.points.map((point) => (
                  <li key={point} className="marker:text-white/35">
                    {point}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* CONTACT SECTION */}
        <section
          className="
            mt-10 p-6 sm:p-7 rounded-2xl luxury-glass
            bg-white/5 border border-white/10 backdrop-blur-2xl
          "
        >
          <h2 className="
            text-white/90 text-[12px] sm:text-[13px]
            uppercase tracking-[0.26em] mb-3 font-medium
          ">
            Contact Us
          </h2>

          <p className="
            text-white/70 text-[13px] sm:text-[14px] leading-[1.8]
          ">
            For any shipping-related questions, reach our concierge team at
            <span className="text-white"> humanteeofficial@gmail.com</span>
            or call
            <span className="text-white"> +91 7780-661493</span>.
          </p>

          <div className="
            flex flex-col sm:flex-row sm:items-center gap-2 mt-4
            text-[11px] uppercase tracking-[0.22em] text-white/50
          ">
            <Link href="mailto:humanteeofficial@gmail.com" className="hover:text-white/80">
              Email us
            </Link>
            <span className="hidden sm:block text-white/20">/</span>
            <Link href="tel:+917780661493" className="hover:text-white/80">
              Call us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
