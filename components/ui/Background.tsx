"use client";

// Fundo atmosférico: orbs escuros e discretos que pulsam bem lentamente,
// mais o grid sutil que some no topo. Sem ruído/grain.
export function Background() {
  return (
    <>
      <div
        className="bg-orb animate-glowPulse"
        style={{
          width: 520,
          height: 520,
          background: "#7a0530",
          opacity: 0.18,
          top: -200,
          left: -160,
          animationDelay: "0s",
        }}
      />
      <div
        className="bg-orb animate-glowPulse"
        style={{
          width: 600,
          height: 600,
          background: "#3d1a7a",
          opacity: 0.16,
          top: "35%",
          right: -240,
          animationDelay: "4s",
        }}
      />
      <div
        className="bg-orb animate-glowPulse"
        style={{
          width: 440,
          height: 440,
          background: "#2a0d5c",
          opacity: 0.14,
          bottom: -180,
          left: "28%",
          animationDelay: "8s",
        }}
      />
      <div className="bg-grid" />
    </>
  );
}
