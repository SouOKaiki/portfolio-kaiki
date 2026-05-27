"use client";

import { Instagram, Youtube, Linkedin, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useT } from "@/lib/i18n/LanguageProvider";
import type { SiteContent } from "@/lib/types";

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
};

export function Footer({ content }: { content: SiteContent }) {
  const t = useT();
  const { contact } = content;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line pb-10 pt-16">
      <div className="mx-auto max-w-[1200px] px-7">
        <div className="mb-12 flex flex-wrap items-start justify-between gap-10">
          {/* Marca + descrição */}
          <div className="max-w-[320px]">
            <Logo showText />
            <p className="mt-5 text-[14px] font-light text-dim">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Apenas contato (sem repetir a navegação) */}
          <div>
            <h4 className="mb-4 text-[13px] uppercase tracking-[1.5px] text-faint">
              {t("footer.contact")}
            </h4>
            <a
              href={`mailto:${contact.email}`}
              className="mb-2.5 block text-[14.5px] text-dim transition hover:text-body"
            >
              {contact.email}
            </a>
            <span className="mb-2.5 block text-[14.5px] text-dim">
              {contact.phone}
            </span>
            <span className="block text-[14.5px] text-dim">
              {contact.location}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-7 text-[13.5px] text-faint">
          <span>© {year} Tokaira. {t("footer.madeWith")}</span>
          <div className="flex gap-3">
            {contact.socials.map((s) => {
              const Icon = SOCIAL_ICONS[s.platform];
              return (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.platform}
                  className="grid h-[42px] w-[42px] place-items-center rounded-xl border border-line bg-glass text-dim transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:border-transparent hover:bg-brand-gradient hover:text-white"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
