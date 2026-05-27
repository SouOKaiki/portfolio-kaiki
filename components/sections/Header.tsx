"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useT } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { key: "nav.portfolio" as const, href: "#portfolio" },
  { key: "nav.voices" as const, href: "#vozes" },
  { key: "nav.services" as const, href: "#servicos" },
  { key: "nav.studio" as const, href: "#estudio" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const t = useT();

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-[100] transition-all duration-400 ease-smooth",
        scrolled && "border-b border-line bg-ink/60 backdrop-blur-xl"
      )}
    >
      {/* grid de 3 colunas: símbolo à esquerda, abas centralizadas, contato à direita */}
      <div
        className={cn(
          "mx-auto grid max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center px-7 transition-all duration-400 ease-smooth",
          scrolled ? "py-3" : "py-5"
        )}
      >
        <div className="justify-self-start">
          <Logo />
        </div>

        {/* Links desktop — centralizados */}
        <div className="hidden items-center gap-1.5 justify-self-center md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-[10px] px-4 py-[9px] text-[14.5px] font-medium text-dim transition-all duration-300 ease-smooth hover:bg-glass hover:text-body"
            >
              {t(l.key)}
            </Link>
          ))}
        </div>

        {/* Direita (desktop): troca de idioma + contato */}
        <div className="hidden items-center gap-2.5 justify-self-end md:flex">
          <LanguageSwitcher />
          <Link
            href="#contato"
            className="rounded-[10px] bg-brand-gradient px-5 py-2.5 text-[14.5px] font-medium text-white shadow-[0_4px_18px_rgba(141,80,254,0.35)] transition-all duration-300 ease-smooth hover:-translate-y-px hover:shadow-glow-lg"
          >
            {t("nav.contact")}
          </Link>
        </div>

        {/* Mobile: switcher + menu */}
        <div className="col-start-3 flex items-center gap-2 justify-self-end md:hidden">
          <LanguageSwitcher />
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-[42px] w-[42px] place-items-center rounded-[11px] border border-line text-body"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-line bg-ink/90 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-7 py-4">
              {[...NAV_LINKS, { key: "nav.contact" as const, href: "#contato" }].map(
                (l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-[10px] px-4 py-3 font-medium text-dim transition hover:bg-glass hover:text-body"
                  >
                    {t(l.key)}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
