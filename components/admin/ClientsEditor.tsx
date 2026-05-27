"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { Field, Input, PrimaryButton, GhostButton } from "@/components/admin/Form";
import { saveClient, deleteClient } from "@/app/admin/actions";
import type { RawClient } from "@/lib/types";

type Row = RawClient & { _new?: boolean };

export function ClientsEditor({ initial }: { initial: RawClient[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [pending, start] = useTransition();

  function update(i: number, patch: Partial<Row>) {
    const next = [...rows];
    next[i] = { ...next[i], ...patch };
    setRows(next);
  }

  function addRow() {
    setRows([
      ...rows,
      { id: `new-${Date.now()}`, name: "", order: rows.length + 1, _new: true },
    ]);
  }

  function save(row: Row) {
    start(async () => {
      await saveClient({
        id: row._new ? undefined : row.id,
        name: row.name,
        logo_url: row.logoUrl ?? null,
        sort_order: row.order,
      });
    });
  }

  function remove(row: Row, i: number) {
    if (row._new) {
      setRows(rows.filter((_, idx) => idx !== i));
      return;
    }
    if (!confirm(`Remover "${row.name}"?`)) return;
    start(async () => {
      await deleteClient(row.id);
      setRows(rows.filter((_, idx) => idx !== i));
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row, i) => (
        <div
          key={row.id}
          className="glass-card flex flex-wrap items-end gap-4 p-4"
        >
          <div className="flex-1 min-w-[180px]">
            <Field label="Nome do cliente">
              <Input
                value={row.name}
                onChange={(e) => update(i, { name: e.target.value })}
              />
            </Field>
          </div>
          <div className="w-24">
            <Field label="Ordem">
              <Input
                type="number"
                value={row.order}
                onChange={(e) => update(i, { order: Number(e.target.value) })}
              />
            </Field>
          </div>
          <PrimaryButton onClick={() => save(row)} disabled={pending}>
            <Save size={15} /> Salvar
          </PrimaryButton>
          <GhostButton onClick={() => remove(row, i)} disabled={pending}>
            <Trash2 size={15} />
          </GhostButton>
        </div>
      ))}

      <GhostButton onClick={addRow}>
        <Plus size={16} /> Adicionar cliente
      </GhostButton>
    </div>
  );
}
