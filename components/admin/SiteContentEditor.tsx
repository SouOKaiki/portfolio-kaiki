"use client";

import { useState, useTransition } from "react";
import { Save, AlertCircle } from "lucide-react";
import { Field, Input, PrimaryButton } from "@/components/admin/Form";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { UploadField } from "@/components/admin/UploadField";
import { saveSiteContent } from "@/app/admin/actions";
import { findMissing } from "@/lib/localize";
import type { RawSiteContent } from "@/lib/types";

export function SiteContentEditor({ initial }: { initial: RawSiteContent }) {
  const [hero, setHero] = useState(initial.hero);
  const [stats, setStats] = useState(initial.stats);
  const [contact, setContact] = useState(initial.contact);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [missing, setMissing] = useState<string[]>([]);

  function save() {
    // Reúne todos os campos bilíngues e exige PT + EN em cada um.
    const fields = [
      { label: "Título (parte fixa)", value: hero.titleLead },
      { label: "Título (destaque)", value: hero.titleHighlight },
      { label: "Descrição", value: hero.subtitle },
      { label: "Botão de registro de voz", value: hero.primaryCtaLabel },
      ...stats.map((s, i) => ({ label: `Rótulo do número ${i + 1}`, value: s.label })),
      { label: "Título de contato", value: contact.headline },
      { label: "Texto de contato", value: contact.text },
    ];
    const miss = findMissing(fields);
    if (miss.length) {
      setShowErrors(true);
      setMissing(miss);
      return;
    }
    setShowErrors(false);
    setMissing([]);
    start(async () => {
      await saveSiteContent({ hero, stats, contact });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {/* HERO */}
      <section className="glass-card flex flex-col gap-4 p-6">
        <h3 className="font-display text-[1.15rem] font-semibold">
          Início (Hero)
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UploadField
            label="Sua foto"
            accept="image/*"
            value={hero.photoUrl}
            onUploaded={(url) => setHero({ ...hero, photoUrl: url })}
          />
          <Field label="Seu nome">
            <Input
              value={hero.name}
              onChange={(e) => setHero({ ...hero, name: e.target.value })}
            />
          </Field>
        </div>
        <LocalizedField
          label="Título (parte fixa)"
          value={hero.titleLead}
          onChange={(v) => setHero({ ...hero, titleLead: v })}
          showErrors={showErrors}
        />
        <LocalizedField
          label="Título (palavra em destaque)"
          value={hero.titleHighlight}
          onChange={(v) => setHero({ ...hero, titleHighlight: v })}
          showErrors={showErrors}
        />
        <LocalizedField
          label="Descrição"
          textarea
          value={hero.subtitle}
          onChange={(v) => setHero({ ...hero, subtitle: v })}
          showErrors={showErrors}
        />
        <LocalizedField
          label="Texto do botão de registro de voz"
          value={hero.primaryCtaLabel}
          onChange={(v) => setHero({ ...hero, primaryCtaLabel: v })}
          showErrors={showErrors}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UploadField
            label="Áudio do registro de voz (ou cole link abaixo)"
            accept="audio/*,video/*"
            value={hero.reelUrl}
            onUploaded={(url) => setHero({ ...hero, reelUrl: url })}
          />
          <Field label="Link do registro (YouTube/Vimeo, ou use o upload)">
            <Input
              value={hero.reelUrl}
              onChange={(e) => setHero({ ...hero, reelUrl: e.target.value })}
              placeholder="https://..."
            />
          </Field>
        </div>
      </section>

      {/* STATS */}
      <section className="glass-card p-6">
        <h3 className="mb-5 font-display text-[1.15rem] font-semibold">
          Números
        </h3>
        <div className="flex flex-col gap-5">
          {stats.map((s, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-xl border border-line p-4"
            >
              <Field label="Valor (ex.: 120+)">
                <Input
                  value={s.value}
                  onChange={(e) => {
                    const next = [...stats];
                    next[i] = { ...s, value: e.target.value };
                    setStats(next);
                  }}
                />
              </Field>
              <LocalizedField
                label="Rótulo"
                value={s.label}
                onChange={(v) => {
                  const next = [...stats];
                  next[i] = { ...s, label: v };
                  setStats(next);
                }}
                showErrors={showErrors}
        />
            </div>
          ))}
        </div>
      </section>

      {/* CONTATO */}
      <section className="glass-card flex flex-col gap-4 p-6">
        <h3 className="font-display text-[1.15rem] font-semibold">Contato</h3>
        <LocalizedField
          label="Título da seção de contato"
          value={contact.headline}
          onChange={(v) => setContact({ ...contact, headline: v })}
          showErrors={showErrors}
        />
        <LocalizedField
          label="Texto da chamada de contato"
          textarea
          value={contact.text}
          onChange={(v) => setContact({ ...contact, text: v })}
          showErrors={showErrors}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="E-mail">
            <Input
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
            />
          </Field>
          <Field label="Telefone">
            <Input
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            />
          </Field>
          <Field label="Localização">
            <Input
              value={contact.location}
              onChange={(e) =>
                setContact({ ...contact, location: e.target.value })
              }
            />
          </Field>
          {contact.socials.map((soc, i) => (
            <Field key={soc.platform} label={`Link ${soc.platform}`}>
              <Input
                value={soc.url}
                onChange={(e) => {
                  const next = [...contact.socials];
                  next[i] = { ...soc, url: e.target.value };
                  setContact({ ...contact, socials: next });
                }}
              />
            </Field>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3">
        {showErrors && missing.length > 0 && (
          <div className="flex items-start gap-2 rounded-xl border border-pink/40 bg-pink/10 px-4 py-2.5 text-[13px] text-pink">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <span>
              Faltam PT e/ou EN em: {missing.join(", ")}.
            </span>
          </div>
        )}
        <div className="flex items-center gap-4">
          <PrimaryButton onClick={save} disabled={pending}>
            <Save size={16} /> {pending ? "Salvando..." : "Salvar tudo"}
          </PrimaryButton>
          {saved && <span className="text-[14px] text-green-400">Salvo!</span>}
        </div>
      </div>
    </div>
  );
}
