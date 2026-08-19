'use client';

function getYouTubeId(value: string) {
  try {
    const url = new URL(value.trim());
    if (url.hostname.includes('youtu.be')) return url.pathname.replace('/', '').split('/')[0] || null;
    if (url.hostname.includes('youtube.com')) {
      if (url.pathname === '/watch') return url.searchParams.get('v');
      if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/')[2] || null;
      if (url.pathname.startsWith('/embed/')) return url.pathname.split('/')[2] || null;
    }
  } catch {
    return null;
  }
  return null;
}

export default function YouTubeEmbed({ url, title }: { url?: string; title: string }) {
  if (!url) return null;
  const id = getYouTubeId(url);
  if (!id) return null;

  return <div className="youtube-embed">
    <iframe
      src={`https://www.youtube.com/embed/${encodeURIComponent(id)}`}
      title={title}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
    <style jsx>{`
      .youtube-embed{position:relative;width:100%;aspect-ratio:16/9;margin:28px 0 36px;overflow:hidden;background:#000;box-shadow:0 12px 30px rgba(63,53,47,.10)}
      .youtube-embed iframe{position:absolute;inset:0;width:100%;height:100%;border:0;margin:0}
    `}</style>
  </div>;
}
