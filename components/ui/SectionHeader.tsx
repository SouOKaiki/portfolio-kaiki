import { Reveal } from "@/components/ui/Reveal";

interface SectionHeaderProps {
  tag: string;
  title: string;
  description?: string;
}

export function SectionHeader({ tag, title, description }: SectionHeaderProps) {
  return (
    <Reveal>
      <div className="mb-[14px] flex items-center gap-2.5 font-display text-[13px] font-semibold uppercase tracking-[4px] text-pink">
        <span className="h-0.5 w-[30px] bg-pink" />
        {tag}
      </div>
      <h2 className="mb-[18px] max-w-[680px] font-display text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-[1.08] tracking-[-1px]">
        {title}
      </h2>
      {description && (
        <p className="mb-[64px] max-w-[540px] text-[1.05rem] font-light text-dim">
          {description}
        </p>
      )}
    </Reveal>
  );
}
