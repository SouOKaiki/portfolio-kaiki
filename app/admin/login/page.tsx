import { Lock } from "lucide-react";
import { login } from "@/app/admin/auth-actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      
      <main className="relative mx-auto flex min-h-screen max-w-[420px] flex-col justify-center px-7">
        <div className="glass-card p-8">
          <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl border border-line-strong bg-gradient-to-br from-pink/15 to-purple/15 text-pink">
            <Lock size={22} />
          </div>
          <h1 className="mb-1.5 font-display text-[1.6rem] font-bold tracking-[-0.5px]">
            Painel Tokaira
          </h1>
          <p className="mb-7 text-[14px] font-light text-dim">
            Entre para gerenciar o conteúdo do site.
          </p>

          {error && (
            <div className="mb-5 rounded-xl border border-pink/40 bg-pink/10 px-4 py-3 text-[13.5px] text-pink">
              {error}
            </div>
          )}

          <form action={login} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] text-dim">E-mail</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="rounded-xl border border-line bg-glass px-4 py-3 text-[15px] text-body outline-none transition focus:border-purple"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] text-dim">Senha</span>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="rounded-xl border border-line bg-glass px-4 py-3 text-[15px] text-body outline-none transition focus:border-purple"
              />
            </label>
            <button type="submit" className="btn-glow mt-2 justify-center">
              Entrar
            </button>
          </form>
        </div>
        <p className="mt-5 text-center text-[12.5px] text-faint">
          Acesso restrito · Tokaira
        </p>
      </main>
    </>
  );
}
