import { createBrowserClient } from "@supabase/ssr";

// Cliente usado em Client Components (roda no navegador).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
