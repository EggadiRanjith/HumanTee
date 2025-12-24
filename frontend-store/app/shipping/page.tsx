"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GradientOverlay } from "@/app/components/ui/layout";
import { settingsApi } from "@/lib/api/settings";

type Section = { title: string; points: string[] };

export default function ShippingPolicyPage() {
  const [settings, setSettings] = useState({
    effective_date: "",
    intro_text: "",
    sections: [] as Section[],
    contact: {
      email: "humanteeofficial@gmail.com", // Temporary fallback
      phone: "+91 7780-661493"      // Temporary fallback
    }
  });

  // Fetch settings on mount
  useEffect(() => {
    settingsApi.getPublicSettings()
      .then((data) => {
        if (data && data['shipping']) {
          setSettings({
            effective_date: data['shipping'].effective_date || "",
            intro_text: data['shipping'].intro_text || "",
            sections: data['shipping'].sections || [],
            contact: data['header-footer']?.contact || {
              email: "humanteeofficial@gmail.com",
              phone: "+91 7780-661493"
            }
          });
        }
      })
      .catch((error) => {
        console.error('Failed to load shipping settings:', error);
      });
  }, []);

  return (
    <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)]">
      <GradientOverlay variant="violet" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* PAGE HEADER */}
        <header className="pt-12 sm:pt-16 lg:pt-24 mb-14">
          {settings.effective_date && (
            <p className="text-white/40 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] mb-3">
              Effective Date: {settings.effective_date}
            </p>
          )}

          <h1
            className="
              text-white font-light
              text-[28px] sm:text-[36px] lg:text-[44px]
              uppercase tracking-[0.18em]
            "
          >
            Shipping Policy
          </h1>

          {settings.intro_text && (
            <p className="text-white/55 text-[13px] sm:text-[14px] max-w-2xl mt-4 leading-relaxed">
              {settings.intro_text}
            </p>
          )}
        </header>

        {/* POLICY SECTIONS */}
        <div className="space-y-7">
          {settings.sections.map((section, index) => (
            <section
              key={index}
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
                {section.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="marker:text-white/35">
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
            <span className="text-white"> {settings.contact.email}</span>
            or call
            <span className="text-white"> {settings.contact.phone}</span>.
          </p>

          <div className="
            flex flex-col sm:flex-row sm:items-center gap-2 mt-4
            text-[11px] uppercase tracking-[0.22em] text-white/50
          ">
            <Link href={`mailto:${settings.contact.email}`} className="hover:text-white/80">
              Email us
            </Link>
            <span className="hidden sm:block text-white/20">/</span>
            <Link href={`tel:${settings.contact.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white/80">
              Call us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
