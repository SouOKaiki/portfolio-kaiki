// Detecta o tipo de link de vídeo e devolve a melhor forma de exibi-lo.
// - YouTube e Vimeo: incorporados (embed) num player dentro do site.
// - Outros (Google Drive, etc.): tratados como link externo (abre em nova aba).

export type ResolvedVideo =
  | { kind: "embed"; embedUrl: string }
  | { kind: "external"; url: string }
  | { kind: "none" };

export function resolveVideo(url?: string): ResolvedVideo {
  if (!url) return { kind: "none" };

  // YouTube: youtube.com/watch?v=ID, youtu.be/ID, /embed/ID
  const yt =
    url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) {
    return {
      kind: "embed",
      embedUrl: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`,
    };
  }

  // Vimeo: vimeo.com/ID
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) {
    return {
      kind: "embed",
      embedUrl: `https://player.vimeo.com/video/${vm[1]}?autoplay=1`,
    };
  }

  // Qualquer outro link confiável: externo.
  return { kind: "external", url };
}
