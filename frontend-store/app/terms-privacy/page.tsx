"use client";

import { useMemo } from "react";
import Link from "next/link";
import { GradientOverlay } from "@/app/components/ui/layout";
import { useSettings } from "@/app/contexts/SettingsContext";

type Section = { title: string; points: string[] };

const DEFAULT_CONTACT = { email: "humanteeteam@gmail.com", phone: "+91 7780-661493" };

export default function TermsPrivacyPage() {
  const { settings: raw, loading } = useSettings();

  const settings = useMemo(() => {
    const p = raw?.policies;
    if (!p) return {
      effective_date: "",
      intro_text: "",
      privacy_sections: [] as Section[],
      terms_sections: [] as Section[],
      contact: DEFAULT_CONTACT,
    };
    return {
      effective_date: p.effective_date ?? "",
      intro_text: p.intro_text ?? "",
      privacy_sections: (p.privacy_sections ?? []) as Section[],
      terms_sections: (p.terms_sections ?? []) as Section[],
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
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* HEADER */}
        <header className="pt-12 sm:pt-16 lg:pt-24 mb-16">
          {settings.effective_date && (
            <p className="text-white/40 text-[10px] uppercase tracking-[0.28em] mb-3">
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
            Privacy & Terms
          </h1>

          {settings.intro_text && (
            <p className="text-white/55 text-[13px] sm:text-[14px] max-w-3xl mt-4 leading-relaxed">
              {settings.intro_text}
            </p>
          )}
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
              {settings.privacy_sections.map((section, index) => (
                <article key={index}>
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
                    {section.points.map((point, pointIndex) => (
                      <li key={pointIndex}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TERMS SECTION */}
        <section className="space-y-7 mb-16">
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
              {settings.terms_sections.map((section, index) => (
                <article key={index}>
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
                    {section.points.map((point, pointIndex) => (
                      <li key={pointIndex}>{point}</li>
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
            <span className="text-white"> {settings.contact.email}</span>
            or call
            <span className="text-white"> {settings.contact.phone}</span>.
          </p>
        </section>

      </div>
    </div>
  );
}
