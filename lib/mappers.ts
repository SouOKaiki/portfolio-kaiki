import type {
  RawPortfolioItem,
  RawVoiceSample,
  RawClient,
  PortfolioCategory,
} from "./types";
import { toLocalized } from "./localize";

// Converte linhas do banco para os tipos "Raw" (bilíngues) do app.
// Campos de texto traduzível vêm como JSON {pt,en} (ou string antiga).

/* eslint-disable @typescript-eslint/no-explicit-any */

export function mapRawPortfolio(row: any): RawPortfolioItem {
  return {
    id: String(row.id),
    title: toLocalized(row.title),
    category: row.category as PortfolioCategory,
    role: toLocalized(row.role),
    videoUrl: row.video_url ?? undefined,
    posterUrl: row.poster_url ?? undefined,
    posterGradient:
      row.poster_gradient ?? "linear-gradient(135deg,#3a0a2a,#7a1145)",
    order: row.sort_order ?? 0,
  };
}

export function mapRawVoice(row: any): RawVoiceSample {
  return {
    id: String(row.id),
    character: toLocalized(row.character),
    specialty: toLocalized(row.specialty),
    audioUrl: row.audio_url ?? undefined,
    photoUrl: row.photo_url ?? undefined,
    avatarGradient:
      row.avatar_gradient ?? "linear-gradient(135deg,#fd0757,#8d50fe)",
    initials: row.initials ?? "",
    durationLabel: row.duration_label ?? "0:00",
    order: row.sort_order ?? 0,
  };
}

export function mapRawClient(row: any): RawClient {
  return {
    id: String(row.id),
    name: row.name,
    logoUrl: row.logo_url ?? undefined,
    order: row.sort_order ?? 0,
  };
}
