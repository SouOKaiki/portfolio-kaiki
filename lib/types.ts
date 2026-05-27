// =============================================================
// TIPOS DO CONTEÚDO DO SITE
// O site recebe textos JÁ RESOLVIDOS no idioma atual (strings simples),
// então os componentes não mudam. O admin trabalha com os tipos "Raw"
// (bilíngues, {pt,en}) definidos no fim deste arquivo.
// =============================================================

// Texto bilíngue. Se "en" estiver vazio, o site cai no "pt".
export interface Localized {
  pt: string;
  en: string;
}

export type PortfolioCategory =
  | "Animação"
  | "Anime"
  | "Games"
  | "Indie"
  | "Comercial"
  | "Documentário";

export interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  role: string; // ex.: "Protagonista · Dublagem PT-BR"
  // videoUrl: YouTube/Vimeo são incorporados (embed) num player dentro do site.
  // Outros links confiáveis (Google Drive, etc.) abrem em nova aba.
  videoUrl?: string;
  posterUrl?: string; // imagem de capa (poster 2:3); fallback = gradiente
  posterGradient: string; // fallback visual enquanto não há imagem
  order: number;
}

export interface VoiceSample {
  id: string;
  character: string; // ex.: "Herói jovem"
  specialty: string; // ex.: "Energético · Determinado"
  audioUrl?: string; // arquivo de áudio (mp3)
  photoUrl?: string; // foto/arte do personagem
  avatarGradient: string; // fallback visual
  initials: string;
  durationLabel: string; // ex.: "0:24"
  order: number;
}

export interface Client {
  id: string;
  name: string;
  logoUrl?: string;
  order: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: "mic" | "waveform" | "sliders" | "headphones" | "film" | "gamepad";
  order: number;
}

export interface SiteContent {
  hero: {
    name: string; // seu nome (aparece sob a foto)
    photoUrl: string; // caminho da foto (ex.: "/me.jpg")
    titleLead: string; // ex.: "Vamos dar vida"
    titleHighlight: string; // última palavra com gradiente animado
    subtitle: string;
    primaryCtaLabel: string;
    reelUrl: string;
  };
  stats: { value: string; label: string }[];
  contact: {
    headline: string;
    text: string;
    email: string;
    phone: string;
    location: string;
    socials: { platform: "instagram" | "youtube" | "linkedin"; url: string }[];
  };
}

// =============================================================
// TIPOS "RAW" (BILÍNGUES) — usados pelo admin e pela camada de dados.
// Cada texto traduzível é um objeto { pt, en }. A função pick() resolve
// para o idioma escolhido (com fallback para pt) antes de chegar ao site.
// =============================================================

export interface RawPortfolioItem {
  id: string;
  title: Localized;
  category: PortfolioCategory;
  role: Localized;
  videoUrl?: string;
  posterUrl?: string;
  posterGradient: string;
  order: number;
}

export interface RawVoiceSample {
  id: string;
  character: Localized;
  specialty: Localized;
  audioUrl?: string;
  photoUrl?: string;
  avatarGradient: string;
  initials: string;
  durationLabel: string;
  order: number;
}

export interface RawClient {
  id: string;
  name: string; // nome próprio, não traduzimos
  logoUrl?: string;
  order: number;
}

export interface RawSiteContent {
  hero: {
    name: string;
    photoUrl: string;
    titleLead: Localized;
    titleHighlight: Localized;
    subtitle: Localized;
    primaryCtaLabel: Localized;
    reelUrl: string;
  };
  stats: { value: string; label: Localized }[];
  contact: {
    headline: Localized;
    text: Localized;
    email: string;
    phone: string;
    location: string;
    socials: { platform: "instagram" | "youtube" | "linkedin"; url: string }[];
  };
}
