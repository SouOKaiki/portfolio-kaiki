import type {
  PortfolioItem,
  VoiceSample,
  Client,
  Service,
  SiteContent,
  RawPortfolioItem,
  RawVoiceSample,
  RawClient,
  RawSiteContent,
} from "./types";
import type { Lang } from "./i18n/dict";
import { pick } from "./localize";

// =============================================================
// CONTEÚDO DO SITE — fonte única (bilíngue PT/EN).
// O site recebe textos JÁ resolvidos no idioma atual; o admin edita os
// objetos {pt,en}. Quando o Supabase está conectado, os dados vêm do banco
// no mesmo formato. Os componentes do site não mudam.
// =============================================================

export const rawSiteContent: RawSiteContent = {
  hero: {
    name: "Tokaira",
    photoUrl: "/me.jpg",
    titleLead: { pt: "Vamos dar vida", en: "Let's bring your" },
    titleHighlight: { pt: "projeto?", en: "project to life?" },
    subtitle: {
      pt: "Sou dublador profissional. Dou vida a personagens de jogos, animações, animes e tudo o que você precisar.",
      en: "I'm a professional voice actor. I bring to life characters in games, animation, anime and anything you need.",
    },
    primaryCtaLabel: { pt: "Meu registro de voz", en: "My voice reel" },
    reelUrl: "",
  },
  stats: [
    { value: "120+", label: { pt: "Projetos entregues", en: "Projects delivered" } },
    { value: "8 anos", label: { pt: "Na cabine", en: "In the booth" } },
    { value: "40+", label: { pt: "Personagens", en: "Characters" } },
  ],
  contact: {
    headline: {
      pt: "Vamos dar voz\nao seu projeto?",
      en: "Let's give voice\nto your project?",
    },
    text: {
      pt: "Me conta o que você precisa. Respondo rápido e mando um orçamento sem enrolação.",
      en: "Tell me what you need. I reply fast and send a straightforward quote.",
    },
    email: "ola@tokaira.studio",
    phone: "+55 (43) 90000-0000",
    location: "Londrina · PR",
    socials: [
      { platform: "instagram", url: "https://instagram.com/kaikikkkj" },
      { platform: "youtube", url: "https://youtube.com/MANGAK1" },
      { platform: "linkedin", url: "https://linkedin.com/" },
    ],
  },
};

export const rawPortfolio: RawPortfolioItem[] = [
  {
    id: "1",
    title: { pt: "Kaze no Senshi", en: "Kaze no Senshi" },
    category: "Anime",
    role: { pt: "Protagonista · Dublagem PT-BR", en: "Lead · PT-BR dubbing" },
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    posterGradient: "linear-gradient(135deg,#3a0a2a,#7a1145)",
    order: 1,
  },
  {
    id: "2",
    title: { pt: "Neon Drift", en: "Neon Drift" },
    category: "Games",
    role: {
      pt: "Vilão principal · Performance capture",
      en: "Main villain · Performance capture",
    },
    videoUrl: "https://vimeo.com/76979871",
    posterGradient: "linear-gradient(135deg,#1a0a3a,#4a1a8a)",
    order: 2,
  },
  {
    id: "3",
    title: { pt: "Pequenos Mundos", en: "Little Worlds" },
    category: "Animação",
    role: { pt: "Múltiplos personagens", en: "Multiple characters" },
    posterGradient: "linear-gradient(135deg,#2a0a1a,#8a1145)",
    order: 3,
  },
  {
    id: "4",
    title: { pt: "Hollow Signal", en: "Hollow Signal" },
    category: "Indie",
    role: { pt: "Narrador · Jogo indie", en: "Narrator · Indie game" },
    videoUrl: "https://drive.google.com/file/d/EXEMPLO/view",
    posterGradient: "linear-gradient(135deg,#0a2a3a,#11638a)",
    order: 4,
  },
];

export const rawVoices: RawVoiceSample[] = [
  {
    id: "1",
    character: { pt: "Tom de Criança", en: "Child voice" },
    specialty: { pt: "Energético · Determinado", en: "Energetic · Determined" },
    avatarGradient: "linear-gradient(135deg,#fd0757,#8d50fe)",
    initials: "H",
    durationLabel: "0:24",
    order: 1,
  },
  {
    id: "2",
    character: { pt: "Tom Natural", en: "Natural voice" },
    specialty: { pt: "Grave · Ameaçador", en: "Deep · Menacing" },
    avatarGradient: "linear-gradient(135deg,#8d50fe,#5a1aff)",
    initials: "V",
    durationLabel: "0:31",
    order: 2,
  },
  {
    id: "3",
    character: { pt: "Narração", en: "Narration" },
    specialty: { pt: "Imersivo · Comercial", en: "Immersive · Commercial" },
    avatarGradient: "linear-gradient(135deg,#ffde59,#fd0757)",
    initials: "N",
    durationLabel: "0:42",
    order: 3,
  },
  {
    id: "4",
    character: { pt: "Tom Grave", en: "Deep voice" },
    specialty: { pt: "Expressivo · Versátil", en: "Expressive · Versatile" },
    avatarGradient: "linear-gradient(135deg,#5a1aff,#8d50fe)",
    initials: "C",
    durationLabel: "0:19",
    order: 4,
  },
];

export const rawClients: RawClient[] = [
  { id: "1", name: "Frenchis Animinis", order: 1 },
  { id: "2", name: "KariKari", order: 2 },
  { id: "3", name: "DramaBox", order: 3 },
  { id: "4", name: "ShortMax", order: 4 },
  { id: "5", name: "FreeReels", order: 5 },
  { id: "6", name: "Realidade X", order: 6 },
  { id: "7", name: "Melolo", order: 7 },
  { id: "8", name: "NetShort", order: 8 },
];

// Serviços são traduzidos pelo dicionário i18n no próprio componente.
export const services: Service[] = [
  { id: "1", title: "", description: "", icon: "film", order: 1 },
  { id: "2", title: "", description: "", icon: "gamepad", order: 2 },
  { id: "3", title: "", description: "", icon: "sliders", order: 3 },
];

// -------------------------------------------------------------
// RESOLVEDORES: bilíngue -> string no idioma atual
// -------------------------------------------------------------

export function resolveSiteContent(raw: RawSiteContent, lang: Lang): SiteContent {
  return {
    hero: {
      name: raw.hero.name,
      photoUrl: raw.hero.photoUrl,
      titleLead: pick(raw.hero.titleLead, lang),
      titleHighlight: pick(raw.hero.titleHighlight, lang),
      subtitle: pick(raw.hero.subtitle, lang),
      primaryCtaLabel: pick(raw.hero.primaryCtaLabel, lang),
      reelUrl: raw.hero.reelUrl,
    },
    stats: raw.stats.map((s) => ({ value: s.value, label: pick(s.label, lang) })),
    contact: {
      headline: pick(raw.contact.headline, lang),
      text: pick(raw.contact.text, lang),
      email: raw.contact.email,
      phone: raw.contact.phone,
      location: raw.contact.location,
      socials: raw.contact.socials,
    },
  };
}

function resolvePortfolio(raw: RawPortfolioItem, lang: Lang): PortfolioItem {
  return {
    id: raw.id,
    title: pick(raw.title, lang),
    category: raw.category,
    role: pick(raw.role, lang),
    videoUrl: raw.videoUrl,
    posterUrl: raw.posterUrl,
    posterGradient: raw.posterGradient,
    order: raw.order,
  };
}

function resolveVoice(raw: RawVoiceSample, lang: Lang): VoiceSample {
  return {
    id: raw.id,
    character: pick(raw.character, lang),
    specialty: pick(raw.specialty, lang),
    audioUrl: raw.audioUrl,
    photoUrl: raw.photoUrl,
    avatarGradient: raw.avatarGradient,
    initials: raw.initials,
    durationLabel: raw.durationLabel,
    order: raw.order,
  };
}

function resolveClient(raw: RawClient): Client {
  return { id: raw.id, name: raw.name, logoUrl: raw.logoUrl, order: raw.order };
}

// -------------------------------------------------------------
// CAMADA DE ACESSO — Supabase quando configurado; senão estático.
// -------------------------------------------------------------

import { createClient } from "@/lib/supabase/server";
import { mapRawPortfolio, mapRawVoice, mapRawClient } from "@/lib/mappers";

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getSiteContent(lang: Lang): Promise<SiteContent> {
  if (!SUPABASE_READY) return resolveSiteContent(rawSiteContent, lang);
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_content")
      .select("hero, stats, contact")
      .eq("id", 1)
      .single();
    if (!data) return resolveSiteContent(rawSiteContent, lang);
    const merged: RawSiteContent = {
      hero: { ...rawSiteContent.hero, ...(data.hero ?? {}) },
      stats: (data.stats as RawSiteContent["stats"]) ?? rawSiteContent.stats,
      contact: { ...rawSiteContent.contact, ...(data.contact ?? {}) },
    };
    return resolveSiteContent(merged, lang);
  } catch {
    return resolveSiteContent(rawSiteContent, lang);
  }
}

export async function getPortfolio(lang: Lang): Promise<PortfolioItem[]> {
  if (!SUPABASE_READY) return rawPortfolio.map((r) => resolvePortfolio(r, lang));
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("sort_order", { ascending: true });
    const rows = data?.length ? data.map(mapRawPortfolio) : rawPortfolio;
    return rows.map((r) => resolvePortfolio(r, lang));
  } catch {
    return rawPortfolio.map((r) => resolvePortfolio(r, lang));
  }
}

export async function getVoiceSamples(lang: Lang): Promise<VoiceSample[]> {
  if (!SUPABASE_READY) return rawVoices.map((r) => resolveVoice(r, lang));
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("voice_samples")
      .select("*")
      .order("sort_order", { ascending: true });
    const rows = data?.length ? data.map(mapRawVoice) : rawVoices;
    return rows.map((r) => resolveVoice(r, lang));
  } catch {
    return rawVoices.map((r) => resolveVoice(r, lang));
  }
}

export async function getClients(): Promise<Client[]> {
  if (!SUPABASE_READY) return rawClients.map(resolveClient);
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("sort_order", { ascending: true });
    const rows = data?.length ? data.map(mapRawClient) : rawClients;
    return rows.map(resolveClient);
  } catch {
    return rawClients.map(resolveClient);
  }
}

export async function getServices(): Promise<Service[]> {
  return [...services].sort((a, b) => a.order - b.order);
}

// -------------------------------------------------------------
// LEITURA "RAW" (bilíngue) PARA O ADMIN
// -------------------------------------------------------------

export async function getRawSiteContent(): Promise<RawSiteContent> {
  if (!SUPABASE_READY) return rawSiteContent;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_content")
      .select("hero, stats, contact")
      .eq("id", 1)
      .single();
    if (!data) return rawSiteContent;
    return {
      hero: { ...rawSiteContent.hero, ...(data.hero ?? {}) },
      stats: (data.stats as RawSiteContent["stats"]) ?? rawSiteContent.stats,
      contact: { ...rawSiteContent.contact, ...(data.contact ?? {}) },
    };
  } catch {
    return rawSiteContent;
  }
}

export async function getRawPortfolio(): Promise<RawPortfolioItem[]> {
  if (!SUPABASE_READY) return rawPortfolio;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("sort_order", { ascending: true });
    return data?.length ? data.map(mapRawPortfolio) : rawPortfolio;
  } catch {
    return rawPortfolio;
  }
}

export async function getRawVoices(): Promise<RawVoiceSample[]> {
  if (!SUPABASE_READY) return rawVoices;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("voice_samples")
      .select("*")
      .order("sort_order", { ascending: true });
    return data?.length ? data.map(mapRawVoice) : rawVoices;
  } catch {
    return rawVoices;
  }
}

export async function getRawClients(): Promise<RawClient[]> {
  if (!SUPABASE_READY) return rawClients;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("sort_order", { ascending: true });
    return data?.length ? data.map(mapRawClient) : rawClients;
  } catch {
    return rawClients;
  }
}
