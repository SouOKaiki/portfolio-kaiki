"use client";

import { useEffect, useRef } from "react";

// Rastro elegante do cursor em canvas puro (sem libs).
// Uma cadeia de pontos segue o mouse com atraso progressivo (efeito chicote),
// desenhada com fade e blur para lembrar motion blur, em gradiente rosa→roxo.
export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Não roda em telas sem mouse ou para quem prefere menos movimento.
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx0 = canvas.getContext("2d");
    if (!ctx0) return;
    const ctx: CanvasRenderingContext2D = ctx0; // narrowing preservado no escopo

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Cadeia de segmentos que perseguem o ponto anterior.
    // Cauda curta e fina = motion blur sutil, não "cobra de luz".
    const COUNT = 10;
    const points = Array.from({ length: COUNT }, () => ({
      x: width / 2,
      y: height / 2,
    }));

    const mouse = { x: width / 2, y: height / 2 };
    let active = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      active = true;
    };
    const onLeave = () => {
      active = false;
    };
    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    function render() {
      ctx.clearRect(0, 0, width, height);

      // O primeiro ponto persegue o mouse; cada um persegue o anterior.
      let prevX = mouse.x;
      let prevY = mouse.y;
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        // quanto mais longe na cauda, mais "preguiçoso" o seguimento
        const ease = 0.35 - (i / points.length) * 0.18;
        p.x += (prevX - p.x) * ease;
        p.y += (prevY - p.y) * ease;
        prevX = p.x;
        prevY = p.y;
      }

      if (active) {
        // Desenha a trilha como uma linha suave com largura e opacidade
        // decrescentes — fina, discreta, lembra motion blur, não chama atenção.
        for (let i = 0; i < points.length - 1; i++) {
          const a = points[i];
          const b = points[i + 1];
          const t = i / (points.length - 1); // 0 (cabeça) -> 1 (cauda)
          const alpha = (1 - t) * 0.18; // opacidade muito mais baixa
          const lineWidth = (1 - t) * 3 + 0.6; // bem mais fina

          // Cor interpolada rosa (#fd0757) -> roxo (#8d50fe)
          const r = Math.round(253 + (141 - 253) * t);
          const g = Math.round(7 + (80 - 7) * t);
          const bl = Math.round(87 + (254 - 87) * t);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha})`;
          ctx.lineWidth = lineWidth;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          // glow bem leve, só pra dar sensação de luz
          ctx.shadowColor = `rgba(${r},${g},${bl},${alpha})`;
          ctx.shadowBlur = 6;
          ctx.stroke();
        }
        // (cabeça dourada removida — destacava demais o cursor)
      }

      raf = requestAnimationFrame(render);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[150]"
    />
  );
}
