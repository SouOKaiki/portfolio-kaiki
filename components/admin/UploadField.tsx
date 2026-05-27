"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, Check } from "lucide-react";
import { uploadFile } from "@/app/admin/actions";

interface UploadFieldProps {
  label: string;
  accept: string; // "image/*" | "audio/*"
  value?: string;
  onUploaded: (url: string) => void;
}

// Faz upload para o bucket "media" e devolve a URL pública via onUploaded.
export function UploadField({
  label,
  accept,
  value,
  onUploaded,
}: UploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  async function handle(file: File) {
    setState("loading");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const url = await uploadFile(fd);
      if (url) {
        onUploaded(url);
        setState("done");
      } else {
        setState("idle");
      }
    } catch {
      setState("idle");
      alert("Falha no upload. Verifique se você está logado e tente de novo.");
    }
  }

  const isImage = accept.startsWith("image");

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] text-dim">{label}</span>
      <div className="flex items-center gap-3">
        {value && isImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="preview"
            className="h-12 w-12 rounded-lg border border-line object-cover"
          />
        )}
        {value && !isImage && (
          <audio src={value} controls className="h-9 max-w-[200px]" />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-glass px-4 py-2.5 text-[13.5px] text-body transition hover:bg-glass-strong"
        >
          {state === "loading" ? (
            <Loader2 size={15} className="animate-spin" />
          ) : state === "done" ? (
            <Check size={15} className="text-green-400" />
          ) : (
            <Upload size={15} />
          )}
          {value ? "Trocar arquivo" : "Enviar arquivo"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handle(f);
          }}
        />
      </div>
    </div>
  );
}
