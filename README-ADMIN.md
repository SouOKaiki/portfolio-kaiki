# Painel Admin — Guia de configuração (Supabase)

Este guia liga o painel `/admin` ao banco de dados. Leva ~10 minutos.
**Você precisa fazer a parte do Supabase** (criar conta/projeto e usuário) —
por segurança, isso não pode ser automatizado.

---

## 1. Criar o projeto no Supabase

1. Acesse https://supabase.com e crie uma conta (grátis).
2. Clique em **New project**. Dê um nome (ex.: `tokaira`), defina uma senha
   de banco e escolha a região mais próxima (ex.: São Paulo).
3. Espere ~2 min até o projeto ficar pronto.

## 2. Rodar o schema do banco

1. No menu lateral, vá em **SQL Editor**.
2. Clique em **New query**, abra o arquivo `supabase/schema.sql` deste projeto,
   copie TODO o conteúdo e cole no editor.
3. Clique em **Run**. Isso cria as tabelas, as regras de segurança (RLS),
   o bucket de arquivos `media` e já insere o conteúdo inicial.

## 3. Criar o seu usuário de login

1. No menu lateral, vá em **Authentication > Users**.
2. Clique em **Add user > Create new user**.
3. Preencha seu e-mail e uma senha forte. Marque **Auto Confirm User**.
4. Esse será o login do `/admin`. (Não crie a conta pelo site — só por aqui.)

## 4. Pegar as chaves e preencher o `.env.local`

1. Vá em **Project Settings > API**.
2. Copie o **Project URL** e a chave **anon public**.
3. Na raiz do projeto, crie um arquivo chamado `.env.local` com:

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

## 5. Rodar

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Login do painel: http://localhost:3000/admin/login
- Painel: http://localhost:3000/admin

Entre com o e-mail/senha do passo 3. Pronto — você já edita foto, nome,
descrição, números, botão de registro de voz (com upload de áudio),
portfólio, vozes (com upload de áudio/foto), clientes e contato.

---

## Conteúdo bilíngue (PT / EN)

Cada texto do painel tem dois campos: **Português** e **English**, lado a lado.
O site mostra a versão do idioma escolhido pelo visitante. Se você deixar o
campo em inglês vazio, o site usa o português automaticamente — então nada
fica em branco. Você pode cadastrar tudo em PT primeiro e traduzir depois.

## Como funciona (resumo técnico)

- **Antes de configurar o Supabase**, o site usa dados estáticos de
  `lib/content.ts` e o `/admin` mostra estas instruções. Nada quebra.
- **Depois de configurar**, as funções `get*()` em `lib/content.ts` passam a
  ler do banco automaticamente. Os componentes do site não mudam.
- **Segurança**: o `middleware.ts` protege `/admin` (redireciona pro login se
  não estiver logado). O RLS no banco garante que só você (logado) escreve;
  qualquer pessoa só consegue ler.
- **Arquivos** (foto, áudios, pôsteres) vão para o bucket público `media`.

## Deploy na Vercel

1. Suba o projeto no GitHub.
2. Na Vercel, importe o repositório.
3. Em **Settings > Environment Variables**, adicione as duas variáveis do
   `.env.local`.
4. Deploy. O `/admin` funciona igual em produção.
