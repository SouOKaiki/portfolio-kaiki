"use client";

import { BadgeCheck } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import type { Client } from "@/lib/types";

export function Marquee({ clients }: { clients: Client[] }) {
  const t = useT();
  // Loop perfeito: renderizamos a lista DUAS vezes dentro de um único track
  // e animamos translateX de 0 a -50%. Quando chega em -50%, a segunda metade
  // está exatamente onde a primeira começou — sem salto.
  const items = [...clients, ...clients];

  return (
    <section className="mx-auto max-w-[1200px] px-7 py-[70px]">
      {/* Área delimitada (card de vidro) */}
      <div className="glass-card overflow-hidden px-6 py-9">
        <p className="mb-7 text-center text-[12px] uppercase tracking-[3px] text-faint">
          {t("marquee.label")}
        </p>
        <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="flex w-max animate-marquee gap-14 group-hover:[animation-play-state:paused]">
            {items.map((c, i) => (
              <span
                key={`${c.id}-${i}`}
                className="flex items-center gap-2.5 whitespace-nowrap font-display text-[1.35rem] font-semibold text-faint opacity-60 transition duration-300 hover:text-body hover:opacity-100"
              >
                <BadgeCheck size={22} className="opacity-70" />
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
