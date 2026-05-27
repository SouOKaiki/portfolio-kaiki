"use client";

import {
  Film,
  Gamepad2,
  SlidersHorizontal,
  Mic,
  AudioWaveform,
  Headphones,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useT } from "@/lib/i18n/LanguageProvider";
import type { DictKey } from "@/lib/i18n/dict";
import type { Service } from "@/lib/types";

const ICONS: Record<Service["icon"], LucideIcon> = {
  film: Film,
  gamepad: Gamepad2,
  sliders: SlidersHorizontal,
  mic: Mic,
  waveform: AudioWaveform,
  headphones: Headphones,
};

// Mapa do ícone do serviço para as chaves de tradução.
const SERVICE_KEYS: Record<
  Service["icon"],
  { title: DictKey; desc: DictKey } | undefined
> = {
  film: { title: "services.dubbing.title", desc: "services.dubbing.desc" },
  gamepad: { title: "services.games.title", desc: "services.games.desc" },
  sliders: { title: "services.mix.title", desc: "services.mix.desc" },
  mic: undefined,
  waveform: undefined,
  headphones: undefined,
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const t = useT();
  const Icon = ICONS[service.icon];
  const keys = SERVICE_KEYS[service.icon];
  // Usa tradução quando existe chave; senão cai no texto do banco/estático.
  const title = keys ? t(keys.title) : service.title;
  const description = keys ? t(keys.desc) : service.description;
  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-xl2 border border-line bg-glass p-9 backdrop-blur-md transition-all duration-400 ease-smooth hover:-translate-y-1.5 hover:border-line-strong hover:bg-glass-strong"
    >
      {/* Linha superior que cresce no hover */}
      <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-gradient transition-transform duration-500 ease-smooth group-hover:scale-x-100" />

      <div className="mb-[22px] grid h-14 w-14 place-items-center rounded-2xl border border-line-strong bg-gradient-to-br from-pink/15 to-purple/15 text-pink">
        <Icon size={26} />
      </div>
      <h3 className="mb-3 font-display text-[1.3rem] font-semibold">{title}</h3>
      <p className="text-[14.5px] font-light text-dim">{description}</p>
    </motion.div>
  );
}

export function Services({ services }: { services: Service[] }) {
  const t = useT();
  return (
    <section id="servicos" className="mx-auto max-w-[1200px] px-7 py-[120px]">
      <SectionHeader
        tag={t("services.tag")}
        title={t("services.title")}
        description={t("services.desc")}
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <ServiceCard key={s.id} service={s} index={i} />
        ))}
      </div>
    </section>
  );
}
