import type { Localized } from "./types";
import type { Lang } from "./i18n/dict";

// Resolve um texto bilíngue para o idioma escolhido.
// Se o idioma for "en" mas estiver vazio, cai no "pt" (nunca mostra vazio).
export function pick(value: Localized | string | undefined, lang: Lang): string {
  if (value == null) return "";
  if (typeof value === "string") return value; // compat: dado antigo só-string
  if (lang === "en") return value.en?.trim() ? value.en : value.pt ?? "";
  return value.pt ?? "";
}

// Cria um Localized a partir de um valor que pode vir do banco como
// string (formato antigo) ou objeto {pt,en}.
export function toLocalized(value: unknown): Localized {
  if (value == null) return { pt: "", en: "" };
  if (typeof value === "string") return { pt: value, en: "" };
  const v = value as Partial<Localized>;
  return { pt: v.pt ?? "", en: v.en ?? "" };
}

// Verifica se um texto bilíngue está completo (PT e EN preenchidos).
export function isComplete(value: Localized | undefined): boolean {
  return !!value && value.pt.trim().length > 0 && value.en.trim().length > 0;
}

// Recebe pares [rótulo, valor] e devolve os rótulos que estão incompletos.
export function findMissing(
  fields: { label: string; value: Localized }[]
): string[] {
  return fields.filter((f) => !isComplete(f.value)).map((f) => f.label);
}
