import { cookies } from "next/headers";
import { Background } from "@/components/ui/Background";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Portfolio } from "@/components/sections/Portfolio";
import { VoiceSamples } from "@/components/sections/VoiceSamples";
import { Services } from "@/components/sections/Services";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { LanguageWelcome } from "@/components/ui/LanguageWelcome";
import { LANG_COOKIE } from "@/lib/i18n/LanguageProvider";
import type { Lang } from "@/lib/i18n/dict";
import {
  getSiteContent,
  getPortfolio,
  getVoiceSamples,
  getClients,
  getServices,
} from "@/lib/content";

// Server Component: lê o idioma do cookie, busca dados já resolvidos nesse
// idioma e detecta a primeira visita (sem cookie) para mostrar o pop-up.
export default async function HomePage() {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get(LANG_COOKIE)?.value as Lang | undefined;
  const firstVisit = !cookieLang;
  const lang: Lang = cookieLang === "en" ? "en" : "pt";

  const [content, portfolio, voices, clients, services] = await Promise.all([
    getSiteContent(lang),
    getPortfolio(lang),
    getVoiceSamples(lang),
    getClients(),
    getServices(),
  ]);

  return (
    <>
      <Background />
      <Header />
      <main>
        <Hero content={content} />
        <Marquee clients={clients} />
        <Portfolio items={portfolio} />
        <VoiceSamples samples={voices} />
        <Services services={services} />
        <Contact content={content} />
      </main>
      <Footer content={content} />
      <LanguageWelcome show={firstVisit} />
    </>
  );
}
