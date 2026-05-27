"use client";

import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

// Se reelUrl for um arquivo de áudio, toca/pausa inline.
// Caso contrário (YouTube/Vimeo/link), abre em nova aba.
const AUDIO_EXT = /\.(mp3|wav|ogg|m4a|aac|flac)(\?|$)/i;

export function VoiceReelButton({
  url,
  label,
}: {
  url: string;
  label: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const isAudio = !!url && AUDIO_EXT.test(url);

  if (!url) {
    return (
      <span className="btn-glow cursor-default opacity-60">
        <Play size={20} fill="#fff" />
        {label}
      </span>
    );
  }

  if (!isAudio) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="btn-glow">
        <Play size={20} fill="#fff" />
        {label}
      </a>
    );
  }

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else {
      el.play().catch(() => {});
    }
    setPlaying(!playing);
  }

  return (
    <button type="button" onClick={toggle} className="btn-glow">
      {playing ? <Pause size={20} fill="#fff" /> : <Play size={20} fill="#fff" />}
      {label}
      <audio
        ref={audioRef}
        src={url}
        onEnded={() => setPlaying(false)}
        preload="none"
      />
    </button>
  );
}
