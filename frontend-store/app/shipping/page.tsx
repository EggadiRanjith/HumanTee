"use client";

import { useMemo } from "react";
import Link from "next/link";
import { GradientOverlay } from "@/app/components/ui/layout";
import { useSettings } from "@/app/contexts/SettingsContext";

type Section = { title: string; points: string[] };

const DEFAULT_CONTACT = { email: "humanteeteam@gmail.com", phone: "+91 7780-661493" };

export default function ShippingPolicyPage() {
  const { settings: raw, loading } = useSettings();

  const settings = useMemo(() => {
    const s = raw?.shipping as any;
    if (!s) return {
      effective_date: "",
      intro_text: "",
      sections: [] as Section[],
      contact: DEFAULT_CONTACT,
    };
    return {
      effective_date: s.effective_date ?? "",
      intro_text: s.intro_text ?? "",
      sections: (s.sections ?? []) as Section[],
      contact: (raw?.["header-footer"] as any)?.contact ?? DEFAULT_CONTACT,
    };
  }, [raw]);

  if (loading) {
    return (
      <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen brand-bg pb-24 pt-[var(--header-height)]">
      <GradientOverlay variant="violet" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* PAGE HEADER */}
        <header className="pt-8 sm:pt-12 lg:pt-16 xl:pt-20 mb-10 sm:mb-14">
          {settings.effective_date && (
            <p className="text-white/40 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] mb-3">
              Effective Date: {settings.effective_date}
            </p>
          )}

          <h1
            className="
              text-white font-light
              text-[24px] sm:text-[28px] md:text-[36px] lg:text-[44px]
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
        <div className="space-y-5 sm:space-y-7">
          {settings.sections.map((section, index) => (
            <section
              key={index}
              className="
                p-4 sm:p-6 md:p-7 rounded-xl sm:rounded-2xl luxury-glass
                bg-white/5 border border-white/10 backdrop-blur-2xl
              "
            >
              <h2 className="
                text-white/90 text-[11px] sm:text-[12px] md:text-[13px]
                uppercase tracking-[0.26em] mb-3 sm:mb-4 font-medium
              ">
                {section.title}
              </h2>

              <ul className="
                space-y-1.5 sm:space-y-2 text-white/70 
                text-[12px] sm:text-[13px] md:text-[14px]
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
            <Link href={`tel:${settings.contact.phone?.replace(/[^0-9+]/g, '') || ''}`} className="hover:text-white/80">
              Call us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
