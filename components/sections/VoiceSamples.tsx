"use client";

import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useT } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import type { VoiceSample } from "@/lib/types";

function VoiceCard({
  sample,
  index,
  isPlaying,
  progress,
  onToggle,
  onSeek,
  registerRef,
}: {
  sample: VoiceSample;
  index: number;
  isPlaying: boolean;
  progress: number; // 0..1
  onToggle: () => void;
  onSeek: (ratio: number) => void;
  registerRef: (el: HTMLAudioElement | null) => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  function handleSeek(e: React.MouseEvent) {
    const el = barRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onSeek((e.clientX - rect.left) / rect.width);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-6 hover:-translate-y-1 hover:border-line-strong hover:bg-glass-strong"
    >
      <div className="min-w-0">
        <div className="font-display text-[1.15rem] font-semibold">
          {sample.character}
        </div>
        <div className="mb-4 text-[13px] font-medium text-gold">
          {sample.specialty}
        </div>

        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onToggle}
            aria-label={isPlaying ? "Pausar" : "Reproduzir"}
            className={cn(
              "grid h-11 w-11 flex-shrink-0 place-items-center rounded-full border border-line-strong text-body transition-all duration-300 ease-smooth",
              isPlaying
                ? "border-transparent bg-brand-gradient shadow-[0_0_18px_rgba(141,80,254,0.45)]"
                : "bg-glass-strong hover:border-transparent hover:bg-brand-gradient hover:shadow-[0_0_18px_rgba(141,80,254,0.45)]"
            )}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
          </button>

          {/* Linha de progresso elegante (player comum) */}
          <div
            ref={barRef}
            onClick={handleSeek}
            className="group relative h-[5px] flex-1 cursor-pointer rounded-full bg-white/10"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-pink to-purple"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
            {/* Cabeça do progresso */}
            <div
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover:opacity-100"
              style={{ left: `${Math.round(progress * 100)}%` }}
            />
          </div>

          <span className="flex-shrink-0 text-[12px] tabular-nums text-faint">
            {sample.durationLabel}
          </span>

          {sample.audioUrl && (
            <audio ref={registerRef} src={sample.audioUrl} preload="none" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function VoiceSamples({ samples }: { samples: VoiceSample[] }) {
  const t = useT();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const refs = useRef<Record<string, HTMLAudioElement | null>>({});

  function stopOthers(exceptId: string) {
    Object.entries(refs.current).forEach(([id, audio]) => {
      if (id !== exceptId && audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }

  function toggle(sample: VoiceSample) {
    const el = refs.current[sample.id];
    stopOthers(sample.id);

    if (playingId === sample.id) {
      el?.pause();
      setPlayingId(null);
    } else {
      el?.play().catch(() => {
        /* sem áudio ainda — botão segue como demonstração */
      });
      setPlayingId(sample.id);
    }
  }

  function seek(sample: VoiceSample, ratio: number) {
    const el = refs.current[sample.id];
    if (el && el.duration) {
      el.currentTime = Math.max(0, Math.min(1, ratio)) * el.duration;
      setProgress((p) => ({ ...p, [sample.id]: ratio }));
    }
  }

  return (
    <section id="vozes" className="mx-auto max-w-[1200px] px-7 py-[120px]">
      <SectionHeader
        tag={t("voices.tag")}
        title={t("voices.title")}
        description={t("voices.desc")}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {samples.map((s, i) => (
          <VoiceCard
            key={s.id}
            sample={s}
            index={i}
            isPlaying={playingId === s.id}
            progress={progress[s.id] ?? 0}
            onToggle={() => toggle(s)}
            onSeek={(r) => seek(s, r)}
            registerRef={(el) => {
              refs.current[s.id] = el;
              if (el) {
                el.ontimeupdate = () =>
                  setProgress((p) => ({
                    ...p,
                    [s.id]: el.duration ? el.currentTime / el.duration : 0,
                  }));
                el.onended = () => {
                  setPlayingId(null);
                  setProgress((p) => ({ ...p, [s.id]: 0 }));
                };
              }
            }}
          />
        ))}
      </div>
    </section>
  );
}
