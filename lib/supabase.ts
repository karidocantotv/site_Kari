import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let browserClient: SupabaseClient | null = null;

const fetchWithTimeout: typeof fetch = async (input, init = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  if (init.signal) {
    if (init.signal.aborted) controller.abort();
    else init.signal.addEventListener('abort', () => controller.abort(), { once: true });
  }
  try { return await fetch(input, { ...init, signal: controller.signal }); }
  finally { clearTimeout(timeout); }
};

export function getSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!browserClient) browserClient = createClient(supabaseUrl, supabaseAnonKey, { global: { fetch: fetchWithTimeout } });
  return browserClient;
}
