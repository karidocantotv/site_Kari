import { NextRequest, NextResponse } from 'next/server';

const LANGUAGE_COOKIE = 'kari_locale';
const NO_STORE_HEADERS = {
  'Cache-Control': 'private, no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
};

function detectLocale(request: NextRequest): 'pt-BR' | 'es-LA' {
  const preferred = request.cookies.get(LANGUAGE_COOKIE)?.value;
  if (preferred === 'es-LA') return 'es-LA';
  if (preferred === 'pt-BR') return 'pt-BR';

  const acceptLanguage = request.headers.get('accept-language') || '';
  const languages = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const qParam = params.find((param) => param.trim().startsWith('q='));
      const q = qParam ? Number(qParam.trim().slice(2)) : 1;
      return { tag: tag.toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((item) => item.q > 0)
    .sort((a, b) => b.q - a.q);

  // Any Spanish browser preference selects Spanish LATAM.
  if (languages.some(({ tag }) => tag === 'es' || tag.startsWith('es-'))) {
    return 'es-LA';
  }

  return 'pt-BR';
}

function applyNoStore(response: NextResponse) {
  Object.entries(NO_STORE_HEADERS).forEach(([key, value]) => response.headers.set(key, value));
  return response;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Keep the language selection behavior only at the root URL.
  // The Spanish route remains explicit and is never redirected back to /.
  if (pathname === '/') {
    const locale = detectLocale(request);
    if (locale === 'es-LA') {
      const url = request.nextUrl.clone();
      url.pathname = '/es';
      const response = NextResponse.redirect(url);
      response.cookies.set(LANGUAGE_COOKIE, 'es-LA', {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
      });
      return applyNoStore(response);
    }

    const response = NextResponse.next();
    response.cookies.set(LANGUAGE_COOKIE, 'pt-BR', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return applyNoStore(response);
  }

  // The /es page also reads the YouTube configuration dynamically.
  // Prevent a stale CDN/browser document from serving the previous video ID.
  if (pathname === '/es' || pathname === '/es/') {
    return applyNoStore(NextResponse.next());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/es', '/es/'],
};
