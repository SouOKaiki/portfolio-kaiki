# Tokaira Studio — Portfólio de Dublagem & Voice Acting

Site portfólio premium (dark, glassmorphism, animado) construído com Next.js
14 (App Router), Tailwind CSS, Framer Motion e lucide-react. Foco em dublagem
de **animação e games**.

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000 — o site público.
O painel admin (placeholder) fica em http://localhost:3000/admin

> Nota: o `npm run build` precisa de internet para baixar as fontes do Google
> (Sora e Manrope) via `next/font`. Em máquina/Vercel normais isso funciona
> automaticamente. Se algum dia precisar buildar offline, há um fallback
> comentado em `app/globals.css` e você pode trocar `layout.tsx` por um
> `<link>` de fontes.

## Estrutura

```
app/
  layout.tsx        → layout raiz (fontes + metadata) [server]
  page.tsx          → home; busca dados e monta as seções [server]
  globals.css       → estilos base, variáveis e classes utilitárias
  admin/page.tsx    → /admin (estrutura pronta, aguardando Supabase)

components/
  sections/         → Header, Hero, Marquee, Portfolio, VoiceSamples,
                      Services, Contact, Footer
  ui/               → Background, Soundwave, Reveal, Logo, SectionHeader

lib/
  types.ts          → tipos do conteúdo (contrato com o futuro Supabase)
  content.ts        → conteúdo central + funções get*() de acesso a dados
  utils.ts          → helper cn()
```

## Arquitetura dinâmica (importante)

Todo o conteúdo do site vem das funções `getPortfolio()`, `getVoiceSamples()`,
`getClients()`, `getServices()` e `getSiteContent()` em `lib/content.ts`.

Hoje elas retornam dados estáticos. Quando conectarmos o **Supabase**, basta
trocar o corpo dessas funções por queries ao banco — **os componentes não
mudam**, porque já recebem os dados via props tipadas.

## Personalizar agora

- Textos, números e contatos: `lib/content.ts`
- Cores da marca: `tailwind.config.ts` (pink/purple/gold)
- Logo: `components/ui/Logo.tsx` (troque o `<span>` por `<Image src="/logo.svg" />`)
- Vídeos do portfólio: campo `videoUrl` em cada item
- Áudios das vozes: campo `audioUrl` (o player já toca arquivos reais)

## Próximo passo: Supabase + /admin

1. Criar projeto no Supabase e preencher `.env.local` (veja `.env.example`)
2. Rodar o schema SQL (tabelas portfolio, voice_samples, clients, site_content)
3. Adicionar Supabase Auth + middleware para proteger `/admin`
4. Construir os formulários CRUD no painel

## Deploy

Pronto para Vercel: conecte o repositório, defina as variáveis de ambiente
(quando houver Supabase) e faça deploy.
