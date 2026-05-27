// =============================================================
// i18n — dicionário da interface fixa (PT-BR / English)
// Os textos editáveis pelo admin (nome, descrição, etc.) continuam vindo
// do banco num idioma só. Aqui ficam apenas os rótulos fixos do site.
// Para adicionar uma frase: coloque a chave nos DOIS idiomas.
// =============================================================

export type Lang = "pt" | "en";

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "pt", label: "Português" },
  { code: "en", label: "English" },
];

export const dict = {
  pt: {
    "nav.portfolio": "Portfólio",
    "nav.voices": "Vozes",
    "nav.services": "Serviços",
    "nav.studio": "Estúdio",
    "nav.contact": "Contato",

    "hero.listenSamples": "Ouvir samples",

    "portfolio.tag": "Meus trabalhos",
    "portfolio.title": "Trabalhos que ganharam voz",
    "portfolio.desc":
      "Uma seleção de projetos — com foco em animação e games. Toque num pôster para assistir.",
    "portfolio.watch": "Assistir",
    "portfolio.openLink": "Abrir link",
    "portfolio.openNewTab": "Abrir em nova aba",
    "portfolio.prev": "Anterior",
    "portfolio.next": "Próximo",

    "voices.tag": "Range vocal",
    "voices.title": "Minhas vozes",
    "voices.desc":
      "Um mesmo artista, vários registros. Ouça como cada personagem ganha personalidade própria.",

    "marquee.label": "Confiaram no meu trabalho",

    "services.tag": "Serviços & setup",
    "services.title": "Do roteiro ao master",
    "services.desc":
      "Cabine tratada acusticamente, microfones de estúdio e edição própria. Você recebe áudio pronto pra usar.",
    "services.dubbing.title": "Dublagem de animação",
    "services.dubbing.desc":
      "Sincronia labial e interpretação para anime, animação ocidental e produções indie. Personagens que respiram.",
    "services.games.title": "Vozes para games",
    "services.games.desc":
      "Heróis, vilões, NPCs e narração. Performance pensada para o ritmo e a imersão do jogo.",
    "services.mix.title": "Mixagem & edição",
    "services.mix.desc":
      "Limpeza, equalização, tratamento e masterização. Entrego o áudio finalizado, pronto pra publicar.",

    "contact.cta": "Falar comigo",
    "footer.tagline":
      "Dublagem e voice acting para jogos, animações e animes. Cada história merece a voz certa.",
    "footer.contact": "Contato",
    "footer.madeWith": "Vamos dublar?",

    "lang.welcomeTitle": "Escolha seu idioma",
    "lang.welcomeText": "Choose your language",
    "lang.switch": "Idioma",
  },
  en: {
    "nav.portfolio": "Portfolio",
    "nav.voices": "Voices",
    "nav.services": "Services",
    "nav.studio": "Studio",
    "nav.contact": "Contact",

    "hero.listenSamples": "Listen to samples",

    "portfolio.tag": "My work",
    "portfolio.title": "Work that found its voice",
    "portfolio.desc":
      "A selection of projects — focused on animation and games. Tap a poster to watch.",
    "portfolio.watch": "Watch",
    "portfolio.openLink": "Open link",
    "portfolio.openNewTab": "Open in new tab",
    "portfolio.prev": "Previous",
    "portfolio.next": "Next",

    "voices.tag": "Vocal range",
    "voices.title": "My voices",
    "voices.desc":
      "One artist, many registers. Hear how each character takes on its own personality.",

    "marquee.label": "Trusted my work",

    "services.tag": "Services & setup",
    "services.title": "From script to master",
    "services.desc":
      "Acoustically treated booth, studio microphones and in-house editing. You get audio ready to use.",
    "services.dubbing.title": "Animation dubbing",
    "services.dubbing.desc":
      "Lip sync and acting for anime, western animation and indie productions. Characters that breathe.",
    "services.games.title": "Game voices",
    "services.games.desc":
      "Heroes, villains, NPCs and narration. Performance built for the game's pace and immersion.",
    "services.mix.title": "Mixing & editing",
    "services.mix.desc":
      "Cleanup, EQ, treatment and mastering. I deliver finished audio, ready to publish.",

    "contact.cta": "Get in touch",
    "footer.tagline":
      "Dubbing and voice acting for games, animation and anime. Every story deserves the right voice.",
    "footer.contact": "Contact",
    "footer.madeWith": "Made with voice.",

    "lang.welcomeTitle": "Choose your language",
    "lang.welcomeText": "Escolha seu idioma",
    "lang.switch": "Language",
  },
} as const;

export type DictKey = keyof (typeof dict)["pt"];
