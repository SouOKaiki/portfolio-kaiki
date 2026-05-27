"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play, ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { resolveVideo } from "@/lib/video";
import { useT } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import type { PortfolioItem } from "@/lib/types";

// ---------- Card de pôster 2:3 ----------
function PosterCard({
  item,
  onOpen,
}: {
  item: PortfolioItem;
  onOpen: (item: PortfolioItem) => void;
}) {
  const t = useT();
  const video = resolveVideo(item.videoUrl);
  const isExternal = video.kind === "external";

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group relative aspect-[2/3] w-[240px] flex-shrink-0 snap-start overflow-hidden rounded-xl2 border border-line text-left transition-all duration-500 ease-smooth hover:-translate-y-1.5 hover:border-line-strong hover:shadow-[0_24px_50px_rgba(0,0,0,0.55)] sm:w-[260px]"
    >
      <div
        className="absolute inset-0 transition-transform duration-700 ease-smooth group-hover:scale-105"
        style={{
          background: item.posterUrl
            ? `center/cover url(${item.posterUrl})`
            : item.posterGradient,
        }}
      />

      {/* Ação que surge no canto inferior ao passar o mouse */}
      <div className="absolute inset-0 z-[2] flex flex-col justify-end bg-gradient-to-t from-[rgba(4,3,7,0.95)] via-[rgba(4,3,7,0.25)] to-transparent p-5">
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[2px] text-gold">
          {item.category}
        </div>
        <div className="font-display text-[1.2rem] font-semibold leading-tight">
          {item.title}
        </div>
        <div className="mt-1 text-[13px] text-dim">{item.role}</div>

        {item.videoUrl && (
          <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-line-strong bg-glass-strong px-3 py-1.5 text-[12.5px] font-medium text-body opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
            {isExternal ? (
              <>
                <ExternalLink size={13} /> {t("portfolio.openLink")}
              </>
            ) : (
              <>
                <Play size={13} fill="currentColor" /> {t("portfolio.watch")}
              </>
            )}
          </span>
        )}
      </div>
    </button>
  );
}

// ---------- Modal com player embutido ----------
function VideoModal({
  item,
  onClose,
}: {
  item: PortfolioItem;
  onClose: () => void;
}) {
  const t = useT();
  const video = resolveVideo(item.videoUrl);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[900px]"
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full border border-line bg-glass text-body transition hover:bg-glass-strong"
        >
          <X size={18} />
        </button>

        <div className="overflow-hidden rounded-xl2 border border-line-strong bg-ink-900">
          {video.kind === "embed" ? (
            <div className="aspect-video w-full">
              <iframe
                src={video.embedUrl}
                title={item.title}
                className="h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            // Link externo (Google Drive, etc.): não dá pra incorporar com
            // segurança, então apresentamos um cartão com botão para abrir.
            <div
              className="flex aspect-video w-full flex-col items-center justify-center gap-5 p-8"
              style={{ background: item.posterGradient }}
            >
              <p className="text-center font-display text-[1.3rem] font-semibold">
                {item.title}
              </p>
              {video.kind === "external" && (
                <a
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-glow"
                >
                  <ExternalLink size={18} /> {t("portfolio.openNewTab")}
                </a>
              )}
            </div>
          )}
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[2px] text-gold">
                {item.category}
              </div>
              <div className="font-display text-[1.05rem] font-semibold">
                {item.title}
              </div>
            </div>
            <div className="text-right text-[13px] text-dim">{item.role}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------- Carrossel ----------
export function Portfolio({ items }: { items: PortfolioItem[] }) {
  const t = useT();
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<PortfolioItem | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  // Verifica se há overflow (e portanto se as setas devem aparecer).
  const updateArrows = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const overflowing = el.scrollWidth > el.clientWidth + 4;
    setCanLeft(overflowing && el.scrollLeft > 4);
    setCanRight(
      overflowing && el.scrollLeft < el.scrollWidth - el.clientWidth - 4
    );
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scroller.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, items]);

  function scrollBy(dir: 1 | -1) {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  }

  return (
    <section id="portfolio" className="mx-auto max-w-[1200px] px-7 py-[120px]">
      <SectionHeader
        tag={t("portfolio.tag")}
        title={t("portfolio.title")}
        description={t("portfolio.desc")}
      />

      <div className="relative">
        {/* Seta esquerda — só aparece se houver para onde rolar */}
        <ArrowBtn
          side="left"
          show={canLeft}
          label={t("portfolio.prev")}
          onClick={() => scrollBy(-1)}
        />

        {/* Trilho de pôsteres.
            Os paddings verticais (py-10) + margens negativas (-my-10) criam
            espaço para a sombra do hover e o -translate-y do card respirarem,
            sem afetar o espaçamento vertical da seção. */}
        <motion.div
          ref={scroller}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="-my-10 flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-visible scroll-smooth px-1 py-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <PosterCard key={item.id} item={item} onOpen={setActive} />
          ))}
        </motion.div>

        {/* Seta direita */}
        <ArrowBtn
          side="right"
          show={canRight}
          label={t("portfolio.next")}
          onClick={() => scrollBy(1)}
        />
      </div>

      <AnimatePresence>
        {active && (
          <VideoModal item={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function ArrowBtn({
  side,
  show,
  label,
  onClick,
}: {
  side: "left" | "right";
  show: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-ink-900/80 text-body backdrop-blur-md transition-all duration-300 ease-smooth hover:bg-brand-gradient hover:border-transparent hover:shadow-glow-lg",
        side === "left" ? "-left-3 sm:-left-5" : "-right-3 sm:-right-5",
        show ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      {side === "left" ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
    </button>
  );
}
