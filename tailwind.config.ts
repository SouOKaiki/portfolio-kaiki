import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta da marca Tokaira
        pink: "#fd0757",
        purple: "#8d50fe",
        gold: "#ffde59",
        ink: {
          DEFAULT: "#0a0a0a",
          900: "#0e0d12",
          800: "#16141c",
        },
        // Superfícies de vidro
        glass: {
          DEFAULT: "rgba(255,255,255,0.04)",
          strong: "rgba(255,255,255,0.06)",
        },
        line: {
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.14)",
        },
        body: "#f5f4f7",
        dim: "#a5a2b0",
        faint: "#6f6c7a",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        xl2: "20px",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #fd0757, #8d50fe)",
        "brand-text":
          "linear-gradient(110deg, #fd0757 10%, #8d50fe 55%, #ffde59 110%)",
      },
      boxShadow: {
        glow: "0 10px 40px rgba(253,7,87,0.4)",
        "glow-lg": "0 18px 50px rgba(141,80,254,0.55)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16,1,0.3,1)",
      },
      keyframes: {
        wave: {
          "0%,100%": { height: "30%" },
          "50%": { height: "70%" },
        },
        glowPulse: {
          "0%,100%": { opacity: "0.10", transform: "scale(1)" },
          "50%": { opacity: "0.20", transform: "scale(1.08)" },
        },
        gradientShift: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        wave: "wave 2.6s ease-in-out infinite",
        glowPulse: "glowPulse 14s ease-in-out infinite",
        gradientShift: "gradientShift 6s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
