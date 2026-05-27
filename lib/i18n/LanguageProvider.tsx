"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { dict, type Lang, type DictKey } from "./dict";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

const COOKIE = "tokaira_lang";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const router = useRouter();

  const setLang = useCallback(
    (l: Lang) => {
      setLangState(l);
      // Persiste no cookie para lembrar a escolha na próxima visita.
      document.cookie = `${COOKIE}=${l}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
      // Recarrega os dados do servidor para que o CONTEÚDO (textos do admin)
      // seja re-resolvido no novo idioma. A interface fixa já trocou na hora.
      router.refresh();
    },
    [router]
  );

  const t = useCallback(
    (key: DictKey) => dict[lang][key] ?? dict.pt[key] ?? key,
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang precisa estar dentro de LanguageProvider");
  return ctx;
}

// Atalho para traduzir só uma chave.
export function useT() {
  return useLang().t;
}

export const LANG_COOKIE = COOKIE;
