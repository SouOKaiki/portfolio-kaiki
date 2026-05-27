"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Soundwave } from "@/components/ui/Soundwave";
import { VoiceReelButton } from "@/components/ui/VoiceReelButton";
import { useT } from "@/lib/i18n/LanguageProvider";
import type { SiteContent } from "@/lib/types";

// Stagger para revelar os elementos do hero em sequência suave.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero({ content }: { content: SiteContent }) {
  const t = useT();
  const { hero, stats } = content;

  // Separa a última palavra do título para aplicar o gradiente animado.
  const lead = hero.titleLead;
  const highlight = hero.titleHighlight;

  return (
    <header
      id="top"
      className="relative mx-auto flex min-h-screen max-w-[1100px] flex-col items-center justify-center px-7 pb-28 pt-[150px] text-center"
    >
      {/* Onda decorativa bem suave atrás da foto */}
      <div className="pointer-events-none absolute inset-x-0 top-[26%] -z-10 mx-auto hidden h-[260px] max-w-[760px] items-center justify-center opacity-25 md:flex">
        <Soundwave bars={56} className="h-full w-full" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center"
      >
        {/* Foto central com borda em gradiente animado + glow */}
        <motion.div variants={item} className="relative mb-10">
          <span className="absolute -inset-[3px] rounded-full bg-gradient-to-tr from-pink via-purple to-gold opacity-90 blur-[2px] animate-gradientShift [background-size:250%_100%]" />
          <span className="absolute -inset-6 -z-10 rounded-full bg-purple/25 blur-3xl" />
          <div className="relative h-[168px] w-[168px] overflow-hidden rounded-full border-2 border-white/10 bg-ink-900 md:h-[200px] md:w-[200px]">
            {hero.photoUrl ? (
              <Image
                src={hero.photoUrl}
                alt={hero.name}
                fill
                priority
                sizes="200px"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-brand-gradient font-display text-5xl font-bold text-white">
                {hero.name?.charAt(0) || "T"}
              </div>
            )}
          </div>
        </motion.div>

        <motion.h1
          variants={item}
          className="max-w-[820px] font-display text-[clamp(2.4rem,6vw,4.6rem)] font-extrabold leading-[1.05] tracking-[-1.5px]"
        >
          {lead}{" "}
          <span className="text-brand-gradient-animated">{highlight}</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-[560px] text-[clamp(1.05rem,2vw,1.25rem)] font-light leading-relaxed text-dim"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <VoiceReelButton url={hero.reelUrl} label={hero.primaryCtaLabel} />
          <Link href="#vozes" className="btn-ghost">
            <Soundwave
              bars={5}
              active={false}
              className="h-5 w-7"
              barClassName="!bg-body"
            />
            {t("hero.listenSamples")}
          </Link>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-16 flex flex-wrap justify-center gap-12"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-brand-gradient font-display text-[2.1rem] font-bold">
                {s.value}
              </div>
              <div className="text-[13px] uppercase tracking-[1.5px] text-faint">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </header>
  );
}
