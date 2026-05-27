"use client";

import { useState } from "react";
import { LayoutDashboard, Film, AudioLines, Users } from "lucide-react";
import { SiteContentEditor } from "@/components/admin/SiteContentEditor";
import { PortfolioEditor } from "@/components/admin/PortfolioEditor";
import { VoicesEditor } from "@/components/admin/VoicesEditor";
import { ClientsEditor } from "@/components/admin/ClientsEditor";
import { cn } from "@/lib/utils";
import type {
  RawSiteContent,
  RawPortfolioItem,
  RawVoiceSample,
  RawClient,
} from "@/lib/types";

const TABS = [
  { id: "content", label: "Conteúdo", icon: LayoutDashboard },
  { id: "portfolio", label: "Portfólio", icon: Film },
  { id: "voices", label: "Vozes", icon: AudioLines },
  { id: "clients", label: "Clientes", icon: Users },
] as const;

export function AdminTabs({
  content,
  portfolio,
  voices,
  clients,
}: {
  content: RawSiteContent;
  portfolio: RawPortfolioItem[];
  voices: RawVoiceSample[];
  clients: RawClient[];
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("content");

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2 border-b border-line pb-4">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-medium transition",
                active
                  ? "bg-brand-gradient text-white shadow-glow"
                  : "border border-line bg-glass text-dim hover:text-body"
              )}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "content" && <SiteContentEditor initial={content} />}
      {tab === "portfolio" && <PortfolioEditor initial={portfolio} />}
      {tab === "voices" && <VoicesEditor initial={voices} />}
      {tab === "clients" && <ClientsEditor initial={clients} />}
    </div>
  );
}
