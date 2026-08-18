import { NextRequest, NextResponse } from 'next/server';

const LANGUAGE_COOKIE = 'kari_locale';

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

export function middleware(request: NextRequest) {
  // Automatic language selection happens only at the root URL.
  // Explicit /es URLs and all other routes remain untouched for SEO/stability.
  if (request.nextUrl.pathname !== '/') return NextResponse.next();

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
    return response;
  }

  const response = NextResponse.next();
  response.cookies.set(LANGUAGE_COOKIE, 'pt-BR', {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return response;
}

export const config = {
  matcher: ['/'],
};
