"use client";

import { Globe } from "lucide-react";
import { useLang } from "@/lib/i18n/LanguageProvider";

// Alterna PT <-> EN com um clique. Mostra o idioma atual.
export function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === "pt" ? "en" : "pt")}
      aria-label={lang === "pt" ? "Switch to English" : "Mudar para Português"}
      className="inline-flex items-center gap-1.5 rounded-[10px] border border-line bg-glass px-3 py-2 text-[13.5px] font-medium text-dim transition-all duration-300 ease-smooth hover:text-body"
    >
      <Globe size={15} />
      {lang === "pt" ? "PT" : "EN"}
    </button>
  );
}
