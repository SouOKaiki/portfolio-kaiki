"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Save, AlertCircle } from "lucide-react";
import { Field, Input, PrimaryButton, GhostButton } from "@/components/admin/Form";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { UploadField } from "@/components/admin/UploadField";
import { savePortfolioItem, deletePortfolioItem } from "@/app/admin/actions";
import { findMissing } from "@/lib/localize";
import type { RawPortfolioItem } from "@/lib/types";

type Row = RawPortfolioItem & { _new?: boolean };

const CATEGORIES = [
  "Animação",
  "Anime",
  "Games",
  "Indie",
  "Comercial",
  "Documentário",
];

export function PortfolioEditor({ initial }: { initial: RawPortfolioItem[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [pending, start] = useTransition();
  // Guarda quais linhas tiveram tentativa de salvar com campo faltando.
  const [invalid, setInvalid] = useState<Record<string, string[]>>({});

  function update(i: number, patch: Partial<Row>) {
    const next = [...rows];
    next[i] = { ...next[i], ...patch };
    setRows(next);
  }

  function addRow() {
    setRows([
      ...rows,
      {
        id: `new-${Date.now()}`,
        title: { pt: "", en: "" },
        category: "Animação",
        role: { pt: "", en: "" },
        posterGradient: "linear-gradient(135deg,#3a0a2a,#7a1145)",
        order: rows.length + 1,
        _new: true,
      },
    ]);
  }

  function save(row: Row) {
    // Validação: PT e EN obrigatórios em título e função.
    const missing = findMissing([
      { label: "Título", value: row.title },
      { label: "Função / descrição", value: row.role },
    ]);
    if (missing.length) {
      setInvalid((m) => ({ ...m, [row.id]: missing }));
      return;
    }
    setInvalid((m) => ({ ...m, [row.id]: [] }));
    start(async () => {
      await savePortfolioItem({
        id: row._new ? undefined : row.id,
        title: row.title,
        category: row.category,
        role: row.role,
        video_url: row.videoUrl ?? null,
        poster_url: row.posterUrl ?? null,
        poster_gradient: row.posterGradient,
        sort_order: row.order,
      });
    });
  }

  function remove(row: Row, i: number) {
    if (row._new) {
      setRows(rows.filter((_, idx) => idx !== i));
      return;
    }
    if (!confirm(`Remover "${row.title.pt}"?`)) return;
    start(async () => {
      await deletePortfolioItem(row.id);
      setRows(rows.filter((_, idx) => idx !== i));
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {rows.map((row, i) => {
        const rowErrors = invalid[row.id] ?? [];
        const hasErrors = rowErrors.length > 0;
        return (
          <div key={row.id} className="glass-card flex flex-col gap-4 p-6">
            <LocalizedField
              label="Título"
              value={row.title}
              onChange={(v) => update(i, { title: v })}
              showErrors={hasErrors}
            />
            <LocalizedField
              label="Função / descrição"
              value={row.role}
              onChange={(v) => update(i, { role: v })}
              showErrors={hasErrors}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Categoria">
                <select
                  value={row.category}
                  onChange={(e) =>
                    update(i, {
                      category: e.target.value as RawPortfolioItem["category"],
                    })
                  }
                  className="w-full rounded-xl border border-line bg-glass px-4 py-2.5 text-[14.5px] text-body outline-none focus:border-purple"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-ink-900">
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Link do vídeo (YouTube, Vimeo, Drive...)">
                <Input
                  value={row.videoUrl ?? ""}
                  onChange={(e) => update(i, { videoUrl: e.target.value })}
                  placeholder="https://..."
                />
              </Field>
              <UploadField
                label="Pôster (imagem 2:3)"
                accept="image/*"
                value={row.posterUrl}
                onUploaded={(url) => update(i, { posterUrl: url })}
              />
              <Field label="Ordem">
                <Input
                  type="number"
                  value={row.order}
                  onChange={(e) => update(i, { order: Number(e.target.value) })}
                />
              </Field>
            </div>

            {hasErrors && (
              <div className="flex items-center gap-2 rounded-xl border border-pink/40 bg-pink/10 px-4 py-2.5 text-[13px] text-pink">
                <AlertCircle size={15} />
                Preencha PT e EN em: {rowErrors.join(", ")}.
              </div>
            )}

            <div className="flex gap-3">
              <PrimaryButton onClick={() => save(row)} disabled={pending}>
                <Save size={15} /> Salvar
              </PrimaryButton>
              <GhostButton onClick={() => remove(row, i)} disabled={pending}>
                <Trash2 size={15} /> Remover
              </GhostButton>
            </div>
          </div>
        );
      })}

      <GhostButton onClick={addRow}>
        <Plus size={16} /> Adicionar trabalho
      </GhostButton>
    </div>
  );
}
