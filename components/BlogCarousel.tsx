'use client';

import Link from 'next/link';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

type Post = { id: string; slug: string; title: string; summary: string; category: string };
type MediaMap = Record<string, { url?: string; alt?: string } | undefined>;

export default function BlogCarousel({ posts, media, locale = 'pt' }: { posts: Post[]; media: MediaMap; locale?: 'pt' | 'es' }) {
  const [page, setPage] = useState(0);
  const restoreScrollY = useRef<number | null>(null);
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const visiblePosts = useMemo(() => posts.slice(safePage * pageSize, safePage * pageSize + pageSize), [posts, safePage]);
  const prefix = locale === 'es' ? '/es/blog/' : '/blog/';
  const labels = locale === 'es'
    ? { prev: 'Anterior', next: 'Siguiente', read: 'LEER ARTÍCULO →' }
    : { prev: 'Anterior', next: 'Próximo', read: 'LER ARTIGO →' };

  useLayoutEffect(() => {
    if (restoreScrollY.current === null) return;
    const y = restoreScrollY.current;
    restoreScrollY.current = null;
    const restore = () => window.scrollTo({ top: y, left: 0, behavior: 'auto' });
    restore();
    window.requestAnimationFrame(() => {
      restore();
      window.requestAnimationFrame(restore);
    });
  }, [safePage]);

  const changePage = (nextPage: number) => {
    restoreScrollY.current = window.scrollY;
    setPage(nextPage);
  };

  return (
    <>
      <div className="blog-carousel-grid-wrap" style={{ overflowAnchor: 'none' }}>
        <div className="grid4 blog-carousel-grid" style={{ overflowAnchor: 'none' }}>
          {visiblePosts.map((p) => {
            const href = prefix + p.slug;
            const image = media[`blog:${p.slug}:cover`];
            return (
              <article className="card" key={p.id}>
                <Link href={href} className="blog-card-image-link" aria-label={`${p.title} — ${labels.read}`} style={{ display: 'block', cursor: 'pointer' }}>
                  <img src={image?.url || '/images/blog-cestinho.webp'} alt={image?.alt || p.title} loading="lazy" decoding="async" width="200" height="118" style={{ cursor: 'pointer' }} />
                </Link>
                <div className="card-body">
                  <span className="tag">{p.category}</span>
                  <h3>{p.title}</h3>
                  <p>{p.summary}</p>
                  <Link className="more" href={href}>{labels.read}</Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="blog-carousel-controls" aria-label={locale === 'es' ? 'Navegación del blog' : 'Navegação do blog'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginTop: 30, overflowAnchor: 'none' }}>
          <button type="button" className="blog-carousel-arrow" onPointerDown={(event) => event.currentTarget.blur()} onClick={(event) => { event.preventDefault(); event.currentTarget.blur(); changePage((safePage - 1 + totalPages) % totalPages); }} aria-label={labels.prev} style={{ width: 42, height: 42, border: '1px solid var(--terracotta)', background: 'var(--white)', color: 'var(--terracotta)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>←</button>
          <span className="blog-carousel-page" aria-live="polite" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: 'var(--muted)' }}>{safePage + 1} / {totalPages}</span>
          <button type="button" className="blog-carousel-arrow" onPointerDown={(event) => event.currentTarget.blur()} onClick={(event) => { event.preventDefault(); event.currentTarget.blur(); changePage((safePage + 1) % totalPages); }} aria-label={labels.next} style={{ width: 42, height: 42, border: '1px solid var(--terracotta)', background: 'var(--terracotta)', color: 'white', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>→</button>
        </div>
      )}
    </>
  );
}
