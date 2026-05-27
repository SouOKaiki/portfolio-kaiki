"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Localized } from "@/lib/types";

// Todas as escritas passam pelo cliente do servidor, que carrega a sessão.
// O RLS no banco garante que só um usuário logado consegue gravar.

async function db() {
  return createClient();
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin");
}

// ---------------- Upload de arquivo ----------------
// Recebe um File (foto/áudio), envia para o bucket "media" e devolve a URL pública.
export async function uploadFile(formData: FormData): Promise<string | null> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return null;

  const supabase = await db();
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, { upsert: false });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

// ---------------- Conteúdo do site (hero, stats, contato) ----------------
export async function saveSiteContent(payload: {
  hero?: Record<string, unknown>;
  stats?: unknown[];
  contact?: Record<string, unknown>;
}) {
  const supabase = await db();
  const patch: Record<string, unknown> = { id: 1, updated_at: new Date().toISOString() };
  if (payload.hero) patch.hero = payload.hero;
  if (payload.stats) patch.stats = payload.stats;
  if (payload.contact) patch.contact = payload.contact;

  const { error } = await supabase.from("site_content").upsert(patch);
  if (error) throw new Error(error.message);
  refresh();
}

// ---------------- Portfólio ----------------
export async function savePortfolioItem(item: {
  id?: string;
  title: Localized;
  category: string;
  role: Localized;
  video_url?: string | null;
  poster_url?: string | null;
  poster_gradient?: string;
  sort_order?: number;
}) {
  const supabase = await db();
  const { error } = item.id
    ? await supabase.from("portfolio_items").update(item).eq("id", item.id)
    : await supabase.from("portfolio_items").insert(item);
  if (error) throw new Error(error.message);
  refresh();
}

export async function deletePortfolioItem(id: string) {
  const supabase = await db();
  const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

// ---------------- Vozes ----------------
export async function saveVoiceSample(item: {
  id?: string;
  character: Localized;
  specialty: Localized;
  audio_url?: string | null;
  photo_url?: string | null;
  avatar_gradient?: string;
  initials?: string;
  duration_label?: string;
  sort_order?: number;
}) {
  const supabase = await db();
  const { error } = item.id
    ? await supabase.from("voice_samples").update(item).eq("id", item.id)
    : await supabase.from("voice_samples").insert(item);
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteVoiceSample(id: string) {
  const supabase = await db();
  const { error } = await supabase.from("voice_samples").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

// ---------------- Clientes ----------------
export async function saveClient(item: {
  id?: string;
  name: string;
  logo_url?: string | null;
  sort_order?: number;
}) {
  const supabase = await db();
  const { error } = item.id
    ? await supabase.from("clients").update(item).eq("id", item.id)
    : await supabase.from("clients").insert(item);
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteClient(id: string) {
  const supabase = await db();
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}
