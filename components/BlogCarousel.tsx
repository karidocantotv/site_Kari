'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Post = { id: string; slug: string; title: string; summary: string; category: string };
type MediaMap = Record<string, { url?: string; alt?: string } | undefined>;

export default function BlogCarousel({ posts, media, locale = 'pt' }: { posts: Post[]; media: MediaMap; locale?: 'pt' | 'es' }) {
  const [page, setPage] = useState(0);
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const visiblePosts = useMemo(() => posts.slice(safePage * pageSize, safePage * pageSize + pageSize), [posts, safePage]);
  const prefix = locale === 'es' ? '/es/blog/' : '/blog/';
  const labels = locale === 'es'
    ? { prev: 'Anterior', next: 'Siguiente', read: 'LEER ARTÍCULO →' }
    : { prev: 'Anterior', next: 'Próximo', read: 'LER ARTIGO →' };

  return (
    <>
      <div className="grid4 blog-carousel-grid">
        {visiblePosts.map((p) => {
          const href = prefix + p.slug;
          const image = media[`blog:${p.slug}:cover`];
          return (
            <article className="card" key={p.id}>
              <Link href={href} className="blog-card-image-link" aria-label={`${p.title} — ${labels.read}`}>
                <img src={image?.url || '/images/blog-cestinho.webp'} alt={image?.alt || p.title} loading="lazy" decoding="async" width="200" height="118" />
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
      {totalPages > 1 && (
        <div className="blog-carousel-controls" aria-label={locale === 'es' ? 'Navegación del blog' : 'Navegação do blog'}>
          <button type="button" className="blog-carousel-arrow" onClick={() => setPage((safePage - 1 + totalPages) % totalPages)} aria-label={labels.prev}>←</button>
          <span className="blog-carousel-page">{safePage + 1} / {totalPages}</span>
          <button type="button" className="blog-carousel-arrow" onClick={() => setPage((safePage + 1) % totalPages)} aria-label={labels.next}>→</button>
        </div>
      )}
    </>
  );
}
