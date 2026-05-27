import Link from "next/link";
import { LogOut, ExternalLink, Lock } from "lucide-react";
import { Background } from "@/components/ui/Background";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { logout } from "@/app/admin/auth-actions";
import {
  getRawSiteContent,
  getRawPortfolio,
  getRawVoices,
  getRawClients,
} from "@/lib/content";

// Painel sempre dinâmico (lê dados atualizados a cada visita).
export const dynamic = "force-dynamic";

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function AdminPage() {
  // Se o Supabase ainda não foi configurado, mostramos instruções
  // em vez de quebrar (o middleware não bloqueia sem env de auth).
  if (!SUPABASE_READY) {
    return (
      <>
        <Background />
        <main className="relative mx-auto flex min-h-screen max-w-[640px] flex-col justify-center px-7">
          <div className="glass-card p-8">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl border border-line-strong bg-gradient-to-br from-pink/15 to-purple/15 text-pink">
              <Lock size={22} />
            </div>
            <h1 className="mb-3 font-display text-[1.8rem] font-bold tracking-[-0.5px]">
              Quase lá
            </h1>
            <p className="mb-4 font-light text-dim">
              O painel está pronto, mas o Supabase ainda não foi conectado.
              Siga o passo a passo do arquivo{" "}
              <code className="rounded bg-glass px-1.5 py-0.5 text-body">
                README-ADMIN.md
              </code>{" "}
              para criar o projeto, rodar o SQL e preencher o{" "}
              <code className="rounded bg-glass px-1.5 py-0.5 text-body">
                .env.local
              </code>
              . Depois é só recarregar esta página.
            </p>
            <Link href="/" className="text-[14px] text-purple hover:underline">
              ← Voltar ao site
            </Link>
          </div>
        </main>
      </>
    );
  }

  const [content, portfolio, voices, clients] = await Promise.all([
    getRawSiteContent(),
    getRawPortfolio(),
    getRawVoices(),
    getRawClients(),
  ]);

  return (
    <>
      <Background />
      <main className="relative mx-auto min-h-screen max-w-[920px] px-7 py-14">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-[1.9rem] font-bold tracking-[-0.5px]">
              Painel <span className="text-brand-gradient">Tokaira</span>
            </h1>
            <p className="text-[14px] font-light text-dim">
              Edite o conteúdo do site. As mudanças aparecem na hora.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-glass px-4 py-2.5 text-[14px] text-body transition hover:bg-glass-strong"
            >
              <ExternalLink size={15} /> Ver site
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-glass px-4 py-2.5 text-[14px] text-dim transition hover:text-body"
              >
                <LogOut size={15} /> Sair
              </button>
            </form>
          </div>
        </header>

        <AdminTabs
          content={content}
          portfolio={portfolio}
          voices={voices}
          clients={clients}
        />
      </main>
    </>
  );
}
