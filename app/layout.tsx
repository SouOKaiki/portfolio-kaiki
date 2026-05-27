import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import { cookies } from "next/headers";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { LANG_COOKIE } from "@/lib/i18n/LanguageProvider";
import { CursorTrail } from "@/components/ui/CursorTrail";
import { ColorBends } from "@/components/ui/ColorBends";
import type { Lang } from "@/lib/i18n/dict";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tokaira Studio — Dublagem & Voice Acting",
  description:
    "Dublador e voice actor especializado em animação e games. Dou voz às suas histórias.",
  openGraph: {
    title: "Tokaira Studio — Dublagem & Voice Acting",
    description:
      "Dublador e voice actor especializado em animação e games.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lê o idioma escolhido (cookie). Sem cookie, começa em PT por padrão.
  const cookieStore = await cookies();
  const initialLang = (cookieStore.get(LANG_COOKIE)?.value as Lang) || "pt";

  return (
    <html
      lang={initialLang === "en" ? "en" : "pt-BR"}
      className={`${sora.variable} ${manrope.variable}`}
    >
      <body className="font-body">
        <ColorBends
          colors={["#fd0757", "#8d50fe", "#ffde59"]}
          rotation={12}
          speed={0.2}
          scale={1}
          frequency={0.9}
          warpStrength={0.95}
          mouseInfluence={1}
          noise={0.23}
          parallax={0.1}
          intensity={1.5}
          bandWidth={3.5}
          background="#050507"
          opacity={0.5}
        />
        <CursorTrail />
        <LanguageProvider initialLang={initialLang}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
