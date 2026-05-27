"use client";

import type { ReactNode } from "react";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] text-dim">{label}</span>
      {children}
    </label>
  );
}

const base =
  "rounded-xl border border-line bg-glass px-4 py-2.5 text-[14.5px] text-body outline-none transition focus:border-purple w-full";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={base} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return <textarea {...props} className={`${base} min-h-[88px] resize-y`} />;
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gradient px-5 py-2.5 text-[14px] font-medium text-white transition hover:shadow-glow-lg disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-glass px-4 py-2.5 text-[14px] text-body transition hover:bg-glass-strong disabled:opacity-50"
    >
      {children}
    </button>
  );
}
