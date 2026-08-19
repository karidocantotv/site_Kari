import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ENDPOINT = 'https://api.cloudflare.com/client/v4/graphql';

function isoFromRange(range: string) {
  const days = range === '1d' ? 1 : range === '30d' ? 30 : 7;
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  return { start: start.toISOString(), end: end.toISOString() };
}

export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!auth?.startsWith('Bearer ') || !supabaseUrl || !supabaseAnonKey) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  const accessToken = auth.slice(7);
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (!user) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  const accountTag = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_ANALYTICS_API_TOKEN;
  if (!accountTag || !apiToken) return NextResponse.json({ error: 'Cloudflare Analytics não configurado.' }, { status: 503 });

  const range = new URL(request.url).searchParams.get('range') || '7d';
  const { start, end } = isoFromRange(range);
  const query = `query AdminRumAnalytics($accountTag: string!, $start: Time!, $end: Time!, $host: string!) {
    viewer { accounts(filter: { accountTag: $accountTag }) {
      pageviews: rumPageloadEventsAdaptiveGroups(filter: { datetime_geq: $start, datetime_leq: $end, requestHost: $host }, limit: 1000, orderBy: [count_DESC]) { count sum { visits } }
      topPages: rumPageloadEventsAdaptiveGroups(filter: { datetime_geq: $start, datetime_leq: $end, requestHost: $host }, limit: 8, orderBy: [count_DESC]) { count dimensions { requestPath } }
      countries: rumPageloadEventsAdaptiveGroups(filter: { datetime_geq: $start, datetime_leq: $end, requestHost: $host }, limit: 8, orderBy: [count_DESC]) { count dimensions { countryName } }
      vitals: rumWebVitalsEventsAdaptiveGroups(filter: { datetime_geq: $start, datetime_leq: $end, requestHost: $host }, limit: 100, orderBy: [count_DESC]) { count quantiles { largestContentfulPaintP75 interactionToNextPaintP75 cumulativeLayoutShiftP75 firstContentfulPaintP75 timeToFirstByteP75 } }
    }}
  }`;

  const response = await fetch(ENDPOINT, { method: 'POST', headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { accountTag, start, end, host: 'karidocanto.com.br' } }), cache: 'no-store' });
  const json = await response.json();
  if (!response.ok || json.errors) return NextResponse.json({ error: 'Falha ao consultar o Cloudflare Analytics.' }, { status: 502 });

  const account = json.data?.viewer?.accounts?.[0];
  if (!account) return NextResponse.json({ error: 'Conta Cloudflare não encontrada.' }, { status: 502 });
  const rows = account.pageviews || [];
  const pageviews = rows.reduce((sum: number, row: any) => sum + (row.count || 0), 0);
  const visits = rows.reduce((sum: number, row: any) => sum + (row.sum?.visits || 0), 0);
  const vitals = account.vitals || [];
  const samples = vitals.reduce((sum: number, row: any) => sum + (row.count || 0), 0);
  const weighted = (field: string) => { if (!samples) return null; const value = vitals.reduce((sum: number, row: any) => sum + (row.count || 0) * (row.quantiles?.[field] ?? -1), 0) / samples; return value < 0 ? null : value; };
  const ms = (value: number | null) => value == null ? null : value / 1000;

  return NextResponse.json({ range, start, end, pageviews, visits, vitals: { lcp: ms(weighted('largestContentfulPaintP75')), inp: ms(weighted('interactionToNextPaintP75')), cls: weighted('cumulativeLayoutShiftP75'), fcp: ms(weighted('firstContentfulPaintP75')), ttfb: ms(weighted('timeToFirstByteP75')) }, topPages: (account.topPages || []).map((r: any) => ({ path: r.dimensions?.requestPath || '/', count: r.count || 0 })), countries: (account.countries || []).map((r: any) => ({ country: r.dimensions?.countryName || 'Desconhecido', count: r.count || 0 })) });
}
