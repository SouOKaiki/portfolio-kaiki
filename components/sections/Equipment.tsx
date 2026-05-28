"use client";

import { Mic, AudioWaveform, Home } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useT } from "@/lib/i18n/LanguageProvider";
import type { DictKey } from "@/lib/i18n/dict";

// Seção de equipamento — três cards (microfone, DAW, sala tratada).
// O id #estudio fica preservado pra não quebrar o link da nav.
const ITEMS: {
  icon: typeof Mic;
  title: DictKey;
  desc: DictKey;
}[] = [
  { icon: Mic,          title: "equipment.mic.title",  desc: "equipment.mic.desc"  },
  { icon: AudioWaveform, title: "equipment.daw.title", desc: "equipment.daw.desc" },
  { icon: Home,         title: "equipment.room.title", desc: "equipment.room.desc" },
];

function Card({ idx, Icon, title, desc }: {
  idx: number;
  Icon: typeof Mic;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-xl2 border border-line bg-glass p-9 backdrop-blur-md transition-all duration-400 ease-smooth hover:-translate-y-1.5 hover:border-line-strong hover:bg-glass-strong"
    >
      {/* Linha superior que cresce no hover (igual aos cards de Serviços) */}
      <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-gradient transition-transform duration-500 ease-smooth group-hover:scale-x-100" />

      <div className="mb-[22px] grid h-14 w-14 place-items-center rounded-2xl border border-line-strong bg-gradient-to-br from-pink/15 to-purple/15 text-pink">
        <Icon size={26} />
      </div>
      <h3 className="mb-3 font-display text-[1.3rem] font-semibold">{title}</h3>
      <p className="text-[14.5px] font-light text-dim">{desc}</p>
    </motion.div>
  );
}

export function Equipment() {
  const t = useT();
  return (
    <section id="estudio" className="mx-auto max-w-[1200px] px-7 py-[120px]">
      <SectionHeader
        tag={t("equipment.tag")}
        title={t("equipment.title")}
        description={t("equipment.desc")}
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((it, i) => (
          <Card
            key={i}
            idx={i}
            Icon={it.icon}
            title={t(it.title)}
            desc={t(it.desc)}
          />
        ))}
      </div>
    </section>
  );
}
