"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface SoundwaveProps {
  bars?: number;
  className?: string;
  barClassName?: string;
  active?: boolean; // false = estático e discreto
}

// Onda sonora calma e organizada. Em vez de alturas aleatórias, as barras
// seguem um padrão senoidal suave, com a animação defasada de forma contínua —
// dá a sensação de uma onda fluindo, não de barras "pulando" caoticamente.
export function Soundwave({
  bars = 40,
  className,
  barClassName,
  active = true,
}: SoundwaveProps) {
  const config = useMemo(
    () =>
      Array.from({ length: bars }, (_, i) => {
        // Padrão senoidal: alturas sobem e descem de forma ordenada.
        const t = i / bars;
        const base = 30 + Math.sin(t * Math.PI * 4) * 24 + 16; // 22%–70%
        return {
          baseHeight: `${Math.round(base)}%`,
          delay: `${(i * 0.08).toFixed(2)}s`,
        };
      }),
    [bars]
  );

  return (
    <div className={cn("flex items-center gap-[3px]", className)}>
      {config.map((c, i) => (
        <span
          key={i}
          className={cn(
            "flex-1 rounded-full",
            active
              ? "animate-wave bg-gradient-to-b from-pink/80 to-purple/80"
              : "bg-faint/50",
            barClassName
          )}
          style={
            active
              ? { animationDelay: c.delay, height: c.baseHeight }
              : { height: c.baseHeight }
          }
        />
      ))}
    </div>
  );
}
