import { createClient } from '@supabase/supabase-js';

export type PublicSiteSettings = Record<string, string>;

export async function getPublicSiteSettings(keys: string[]): Promise<PublicSiteSettings> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return {};
  const supabase = createClient(url, key);
  const { data } = await supabase.from('site_settings').select('key,value').in('key', keys);
  return Object.fromEntries((data ?? []).map((row) => [row.key, row.value ?? '']));
}
