import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const FALLBACK = 'https://karidocanto.com.br/images/hero.webp';

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const source = base
    ? `${base}/storage/v1/object/public/site/brand/og-image`
    : FALLBACK;

  try {
    const response = await fetch(source, { cache: 'no-store' });
    if (!response.ok) {
      return NextResponse.redirect(FALLBACK, { status: 307 });
    }

    const headers = new Headers();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('CDN-Cache-Control', 'no-store');
    headers.set('Vercel-CDN-Cache-Control', 'no-store');

    return new NextResponse(response.body, { status: 200, headers });
  } catch {
    return NextResponse.redirect(FALLBACK, { status: 307 });
  }
}
