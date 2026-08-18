export type Locale = 'pt-BR' | 'es-LA';
export const DEFAULT_LOCALE: Locale = 'pt-BR';
export const SPANISH_LOCALE: Locale = 'es-LA';

export function isLocale(value?: string): value is Locale {
  return value === 'pt-BR' || value === 'es-LA';
}

export function localizedPath(locale: Locale, path: string) {
  if (locale === 'pt-BR') return path || '/';
  return `/es${path === '/' ? '' : path}`;
}

export function oppositeLocale(locale: Locale): Locale {
  return locale === 'pt-BR' ? 'es-LA' : 'pt-BR';
}
