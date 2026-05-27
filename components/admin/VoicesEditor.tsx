"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Save, AlertCircle } from "lucide-react";
import { Field, Input, PrimaryButton, GhostButton } from "@/components/admin/Form";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { UploadField } from "@/components/admin/UploadField";
import { saveVoiceSample, deleteVoiceSample } from "@/app/admin/actions";
import { findMissing } from "@/lib/localize";
import type { RawVoiceSample } from "@/lib/types";

type Row = RawVoiceSample & { _new?: boolean };

export function VoicesEditor({ initial }: { initial: RawVoiceSample[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [pending, start] = useTransition();
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
        character: { pt: "", en: "" },
        specialty: { pt: "", en: "" },
        avatarGradient: "linear-gradient(135deg,#fd0757,#8d50fe)",
        initials: "",
        durationLabel: "0:00",
        order: rows.length + 1,
        _new: true,
      },
    ]);
  }

  function save(row: Row) {
    const missing = findMissing([
      { label: "Personagem", value: row.character },
      { label: "Especialidade", value: row.specialty },
    ]);
    if (missing.length) {
      setInvalid((m) => ({ ...m, [row.id]: missing }));
      return;
    }
    setInvalid((m) => ({ ...m, [row.id]: [] }));
    start(async () => {
      await saveVoiceSample({
        id: row._new ? undefined : row.id,
        character: row.character,
        specialty: row.specialty,
        audio_url: row.audioUrl ?? null,
        photo_url: row.photoUrl ?? null,
        avatar_gradient: row.avatarGradient,
        initials: row.initials,
        duration_label: row.durationLabel,
        sort_order: row.order,
      });
    });
  }

  function remove(row: Row, i: number) {
    if (row._new) {
      setRows(rows.filter((_, idx) => idx !== i));
      return;
    }
    if (!confirm(`Remover "${row.character.pt}"?`)) return;
    start(async () => {
      await deleteVoiceSample(row.id);
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
              label="Personagem / registro"
              value={row.character}
              onChange={(v) => update(i, { character: v })}
              showErrors={hasErrors}
            />
            <LocalizedField
              label="Especialidade (ex.: Grave · Ameaçador)"
              value={row.specialty}
              onChange={(v) => update(i, { specialty: v })}
              showErrors={hasErrors}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UploadField
                label="Áudio do sample"
                accept="audio/*"
                value={row.audioUrl}
                onUploaded={(url) => update(i, { audioUrl: url })}
              />
              <UploadField
                label="Foto / arte (opcional)"
                accept="image/*"
                value={row.photoUrl}
                onUploaded={(url) => update(i, { photoUrl: url })}
              />
              <Field label="Iniciais (se não tiver foto)">
                <Input
                  value={row.initials}
                  maxLength={2}
                  onChange={(e) => update(i, { initials: e.target.value })}
                />
              </Field>
              <Field label="Duração (ex.: 0:24)">
                <Input
                  value={row.durationLabel}
                  onChange={(e) => update(i, { durationLabel: e.target.value })}
                />
              </Field>
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
        <Plus size={16} /> Adicionar voz
      </GhostButton>
    </div>
  );
}
