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


export async function getPublicBlogMedia(slug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return {};
  const supabase = createClient(url, key);
  const slots = [`blog:${slug}:cover`, `blog:${slug}:inside`, `blog:${slug}:download`];
  const { data } = await supabase.from('media_assets').select('slot,path,alt_text').eq('bucket', 'blog').in('slot', slots);
  return Object.fromEntries((data ?? []).map((row) => [row.slot, {
    url: supabase.storage.from('blog').getPublicUrl(row.path).data.publicUrl,
    alt: row.alt_text ?? '',
    filename: row.filename ?? '',
  }]));
}


export async function getPublicBlogCovers(slugs: string[]) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return {};
  const supabase = createClient(url, key);
  const slots = slugs.map((slug) => `blog:${slug}:cover`);
  const { data } = await supabase.from('media_assets').select('slot,path,alt_text').eq('bucket', 'blog').in('slot', slots);
  return Object.fromEntries((data ?? []).map((row) => [row.slot, {
    url: supabase.storage.from('blog').getPublicUrl(row.path).data.publicUrl,
    alt: row.alt_text ?? '',
    filename: row.filename ?? '',
  }]));
}
