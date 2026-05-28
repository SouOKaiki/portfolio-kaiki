"use client";

import { Mail } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { useT } from "@/lib/i18n/LanguageProvider";
import type { SiteContent } from "@/lib/types";

export function Contact({ content }: { content: SiteContent }) {
  const t = useT();
  const { contact } = content;
  return (
    <section className="mx-auto max-w-[1200px] px-7 py-[120px]">
      <Reveal>
        <div
          id="contato"
          className="relative overflow-hidden rounded-[32px] border border-line-strong bg-gradient-to-br from-pink/[0.12] to-purple/[0.12] px-[50px] py-[70px] text-center backdrop-blur-xl"
        >
          {/* Glow superior */}
          <span className="pointer-events-none absolute -top-[150px] left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-purple opacity-30 blur-[130px]" />

          <h2 className="relative mb-[18px] whitespace-pre-line font-display text-[clamp(2rem,5vw,3.4rem)] font-bold leading-tight tracking-[-1px]">
            {contact.headline}
          </h2>
          <p className="relative mx-auto mb-9 max-w-[480px] text-[1.1rem] font-light text-dim">
            {contact.text}
          </p>
          <a href={`mailto:${contact.email}`} className="btn-glow relative">
            <Mail size={20} />
            {t("contact.cta")}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
