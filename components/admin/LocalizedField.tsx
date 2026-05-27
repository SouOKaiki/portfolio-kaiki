"use client";

import type { Localized } from "@/lib/types";
import { cn } from "@/lib/utils";

const base =
  "rounded-xl border bg-glass px-4 py-2.5 text-[14.5px] text-body outline-none transition w-full";

// Edita um texto nos dois idiomas, lado a lado.
// `showErrors` (vindo da validação ao salvar) destaca em vermelho o campo vazio.
export function LocalizedField({
  label,
  value,
  onChange,
  textarea = false,
  showErrors = false,
}: {
  label: string;
  value: Localized;
  onChange: (v: Localized) => void;
  textarea?: boolean;
  showErrors?: boolean;
}) {
  const Tag = textarea ? "textarea" : "input";
  const ptEmpty = showErrors && !value.pt.trim();
  const enEmpty = showErrors && !value.en.trim();

  const cls = (err: boolean) =>
    cn(
      base,
      textarea && "min-h-[80px] resize-y",
      err ? "border-pink focus:border-pink" : "border-line focus:border-purple"
    );

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] text-dim">{label}</span>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wide text-faint">
            🇧🇷 Português
          </span>
          <Tag
            value={value.pt}
            onChange={(e) =>
              onChange({ ...value, pt: (e.target as HTMLInputElement).value })
            }
            className={cls(ptEmpty)}
          />
          {ptEmpty && (
            <span className="text-[11.5px] text-pink">Preencha o português.</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wide text-faint">
            🇺🇸 English
          </span>
          <Tag
            value={value.en}
            onChange={(e) =>
              onChange({ ...value, en: (e.target as HTMLInputElement).value })
            }
            className={cls(enEmpty)}
          />
          {enEmpty && (
            <span className="text-[11.5px] text-pink">Fill in the English.</span>
          )}
        </div>
      </div>
    </div>
  );
}
