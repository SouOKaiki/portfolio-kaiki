"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n/LanguageProvider";
import type { Lang } from "@/lib/i18n/dict";

// Aparece só quando não há cookie de idioma (primeira visita).
// O `show` é decidido no servidor e passado como prop.
export function LanguageWelcome({ show }: { show: boolean }) {
  const { setLang } = useLang();
  // estado local para esconder com animação após escolher
  const choose = (l: Lang) => setLang(l);

  return (
    <AnimatePresence>
      {show && <Modal onChoose={choose} />}
    </AnimatePresence>
  );
}

function Modal({ onChoose }: { onChoose: (l: Lang) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-6 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.94, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 12, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card relative w-full max-w-[400px] overflow-hidden p-8 text-center"
      >
        <span className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-purple/30 blur-3xl" />

        <h2 className="relative mb-1 font-display text-[1.5rem] font-bold tracking-[-0.5px]">
          Escolha seu idioma
        </h2>
        <p className="relative mb-7 text-[14px] font-light text-dim">
          Choose your language
        </p>

        <div className="relative flex flex-col gap-3">
          <button
            onClick={() => onChoose("pt")}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-gradient px-5 py-3.5 font-medium text-white transition hover:shadow-glow-lg"
          >
            🇧🇷 Português
          </button>
          <button
            onClick={() => onChoose("en")}
            className="flex items-center justify-center gap-2 rounded-xl border border-line-strong bg-glass px-5 py-3.5 font-medium text-body transition hover:bg-glass-strong"
          >
            🇺🇸 English
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
