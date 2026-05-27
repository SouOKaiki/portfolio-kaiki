import Link from "next/link";

interface LogoProps {
  href?: string;
  /** mostra o texto ao lado do símbolo (usado no footer; o header usa só o símbolo) */
  showText?: boolean;
}

// Símbolo da marca. Quando você me enviar o arquivo do logo, troque o <svg>
// interno por: <Image src="/logo.svg" alt="Tokaira" width={22} height={22} />
export function Logo({ href = "#top", showText = false }: LogoProps) {
  return (
    <Link href={href} className="flex cursor-pointer items-center gap-[11px]">
      <span className="relative grid h-[40px] w-[40px] flex-shrink-0 place-items-center rounded-[12px] bg-brand-gradient shadow-glow">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M3 12h2l2-7 3 14 3-11 2 6h6"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showText && (
        <span className="font-display text-[19px] font-bold leading-none tracking-[0.5px]">
          KAIKI
          <span className="mt-[-3px] block text-[11px] font-normal tracking-[3px] text-dim">
            AUGUSTO
          </span>
        </span>
      )}
    </Link>
  );
}
