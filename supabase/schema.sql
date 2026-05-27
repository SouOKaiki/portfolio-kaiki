-- =============================================================
-- TOKAIRA — SCHEMA DO BANCO (Supabase / PostgreSQL)
-- Cole TODO este arquivo no SQL Editor do Supabase e clique em "Run".
-- Cria as tabelas, segurança (RLS) e os buckets de arquivos.
-- =============================================================

-- ---------- Extensões ----------
create extension if not exists "pgcrypto";

-- ---------- Tabela: conteúdo do site (linha única) ----------
-- Guarda hero, stats e contato como JSON para facilitar a edição.
create table if not exists public.site_content (
  id          int primary key default 1,
  hero        jsonb not null default '{}'::jsonb,
  stats       jsonb not null default '[]'::jsonb,
  contact     jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  constraint single_row check (id = 1)
);

-- ---------- Tabela: portfólio ----------
-- title e role são bilíngues: jsonb no formato {"pt":"...","en":"..."}
create table if not exists public.portfolio_items (
  id               uuid primary key default gen_random_uuid(),
  title            jsonb not null default '{"pt":"","en":""}'::jsonb,
  category         text not null,
  role             jsonb not null default '{"pt":"","en":""}'::jsonb,
  video_url        text,
  poster_url       text,
  poster_gradient  text not null default 'linear-gradient(135deg,#3a0a2a,#7a1145)',
  sort_order       int  not null default 0,
  created_at       timestamptz not null default now()
);

-- ---------- Tabela: vozes (samples) ----------
-- character e specialty são bilíngues (jsonb {pt,en})
create table if not exists public.voice_samples (
  id               uuid primary key default gen_random_uuid(),
  character        jsonb not null default '{"pt":"","en":""}'::jsonb,
  specialty        jsonb not null default '{"pt":"","en":""}'::jsonb,
  audio_url        text,
  photo_url        text,
  avatar_gradient  text not null default 'linear-gradient(135deg,#fd0757,#8d50fe)',
  initials         text not null default '',
  duration_label   text not null default '0:00',
  sort_order       int  not null default 0,
  created_at       timestamptz not null default now()
);

-- ---------- Tabela: clientes (marquee) ----------
create table if not exists public.clients (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  logo_url    text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- =============================================================
-- ROW LEVEL SECURITY
-- Leitura pública (site é público). Escrita só para usuários logados.
-- =============================================================
alter table public.site_content   enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.voice_samples   enable row level security;
alter table public.clients         enable row level security;

-- Leitura pública
create policy "public read site_content"   on public.site_content   for select using (true);
create policy "public read portfolio"       on public.portfolio_items for select using (true);
create policy "public read voices"          on public.voice_samples   for select using (true);
create policy "public read clients"         on public.clients         for select using (true);

-- Escrita apenas autenticado (qualquer usuário logado = você)
create policy "auth write site_content" on public.site_content
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write portfolio" on public.portfolio_items
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write voices" on public.voice_samples
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write clients" on public.clients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =============================================================
-- STORAGE (arquivos): foto do hero, áudios, pôsteres, fotos de personagem
-- =============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Leitura pública dos arquivos
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');

-- Upload/atualização/remoção só autenticado
create policy "auth upload media" on storage.objects
  for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "auth update media" on storage.objects
  for update using (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "auth delete media" on storage.objects
  for delete using (bucket_id = 'media' and auth.role() = 'authenticated');

-- =============================================================
-- SEED — conteúdo inicial (os mesmos placeholders do site)
-- =============================================================
insert into public.site_content (id, hero, stats, contact)
values (
  1,
  '{
    "name": "Tokaira",
    "photoUrl": "",
    "titleLead": {"pt":"Vamos dar vida","en":"Let''s bring your"},
    "titleHighlight": {"pt":"projeto?","en":"project to life?"},
    "subtitle": {"pt":"Sou dublador profissional. Dou vida a personagens de jogos, animações, animes e tudo o que você precisar.","en":"I''m a professional voice actor. I bring to life characters in games, animation, anime and anything you need."},
    "primaryCtaLabel": {"pt":"Meu registro de voz","en":"My voice reel"},
    "reelUrl": ""
  }'::jsonb,
  '[
    {"value":"120+","label":{"pt":"Projetos entregues","en":"Projects delivered"}},
    {"value":"8 anos","label":{"pt":"Na cabine","en":"In the booth"}},
    {"value":"40+","label":{"pt":"Personagens","en":"Characters"}}
  ]'::jsonb,
  '{
    "headline":{"pt":"Vamos dar voz\nao seu projeto?","en":"Let''s give voice\nto your project?"},
    "text":{"pt":"Me conta o que você precisa. Respondo rápido e mando um orçamento sem enrolação.","en":"Tell me what you need. I reply fast and send a straightforward quote."},
    "email":"ola@tokaira.studio",
    "phone":"+55 (43) 90000-0000",
    "location":"Londrina · PR",
    "socials":[
      {"platform":"instagram","url":"https://instagram.com/"},
      {"platform":"youtube","url":"https://youtube.com/"},
      {"platform":"linkedin","url":"https://linkedin.com/"}
    ]
  }'::jsonb
)
on conflict (id) do nothing;

insert into public.clients (name, sort_order) values
  ('VortexMedia',1),('Crunchyflix',2),('GameForge',3),('Aurora Tech',4),
  ('SomLivre',5),('Estúdio Lua',6),('PixelVoice',7),('NovaSound',8)
on conflict do nothing;

insert into public.portfolio_items (title, category, role, poster_gradient, sort_order) values
  ('{"pt":"Kaze no Senshi","en":"Kaze no Senshi"}','Anime','{"pt":"Protagonista · Dublagem PT-BR","en":"Lead · PT-BR dubbing"}','linear-gradient(135deg,#3a0a2a,#7a1145)',1),
  ('{"pt":"Neon Drift","en":"Neon Drift"}','Games','{"pt":"Vilão principal · Performance capture","en":"Main villain · Performance capture"}','linear-gradient(135deg,#1a0a3a,#4a1a8a)',2),
  ('{"pt":"Pequenos Mundos","en":"Little Worlds"}','Animação','{"pt":"Múltiplos personagens","en":"Multiple characters"}','linear-gradient(135deg,#2a0a1a,#8a1145)',3),
  ('{"pt":"Hollow Signal","en":"Hollow Signal"}','Indie','{"pt":"Narrador · Jogo indie","en":"Narrator · Indie game"}','linear-gradient(135deg,#0a2a3a,#11638a)',4)
on conflict do nothing;

insert into public.voice_samples (character, specialty, avatar_gradient, initials, duration_label, sort_order) values
  ('{"pt":"Herói jovem","en":"Young hero"}','{"pt":"Energético · Determinado","en":"Energetic · Determined"}','linear-gradient(135deg,#fd0757,#8d50fe)','H','0:24',1),
  ('{"pt":"Vilão sombrio","en":"Dark villain"}','{"pt":"Grave · Ameaçador","en":"Deep · Menacing"}','linear-gradient(135deg,#8d50fe,#5a1aff)','V','0:31',2),
  ('{"pt":"Narrador de game","en":"Game narrator"}','{"pt":"Imersivo · Épico","en":"Immersive · Epic"}','linear-gradient(135deg,#ffde59,#fd0757)','N','0:42',3),
  ('{"pt":"Personagem cômico","en":"Comic character"}','{"pt":"Expressivo · Versátil","en":"Expressive · Versatile"}','linear-gradient(135deg,#5a1aff,#8d50fe)','C','0:19',4)
on conflict do nothing;
