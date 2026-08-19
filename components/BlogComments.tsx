'use client';

import { FormEvent, useEffect, useState } from 'react';

type CommentItem = { id: string; name: string; comment: string; created_at: string };

export default function BlogComments({ slug, locale }: { slug: string; locale: 'pt-BR' | 'es-LA' }) {
  const es = locale === 'es-LA';
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    const response = await fetch(`/api/blog-comments?slug=${encodeURIComponent(slug)}&locale=${locale}`, { cache: 'no-store' });
    const data = await response.json().catch(() => ({}));
    if (response.ok) setComments(data.comments || []);
  }
  useEffect(() => { load(); }, [slug, locale]);

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setStatus('');
    const response = await fetch('/api/blog-comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, locale, name, email, comment, website }) });
    const data = await response.json().catch(() => ({}));
    setStatus(data.message || data.error || (es ? 'No fue posible enviar.' : 'Não foi possível enviar.'));
    if (response.ok) { setName(''); setEmail(''); setComment(''); setWebsite(''); }
    setBusy(false);
  }

  return <section className="blog-comments" aria-labelledby="comments-title">
    <div className="comments-head"><span className="eyebrow">{es ? 'COMUNIDAD' : 'COMUNIDADE'}</span><h2 id="comments-title" className="serif">{es ? 'Deja tu comentario' : 'Deixe seu comentário'}</h2><p>{es ? 'Comparte tu experiencia, una duda o una idea. Los comentarios se publican después de la moderación.' : 'Compartilhe sua experiência, uma dúvida ou uma ideia. Os comentários são publicados após moderação.'}</p></div>
    {comments.length > 0 && <div className="comments-list">{comments.map(item => <article className="comment" key={item.id}><strong>{item.name}</strong><time dateTime={item.created_at}>{new Date(item.created_at).toLocaleDateString(es ? 'es-LA' : 'pt-BR')}</time><p>{item.comment}</p></article>)}</div>}
    <form className="comment-form" onSubmit={submit}>
      <input aria-label={es ? 'Tu nombre' : 'Seu nome'} required value={name} onChange={e => setName(e.target.value)} placeholder={es ? 'Tu nombre' : 'Seu nome'} maxLength={100} />
      <input aria-label={es ? 'Tu correo electrónico' : 'Seu e-mail'} required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={es ? 'Tu correo electrónico' : 'Seu e-mail'} maxLength={254} />
      <textarea aria-label={es ? 'Tu comentario' : 'Seu comentário'} required value={comment} onChange={e => setComment(e.target.value)} placeholder={es ? 'Escribe tu comentario...' : 'Escreva seu comentário...'} maxLength={3000} rows={5} />
      <input className="comment-honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={e => setWebsite(e.target.value)} />
      <button className="btn primary" disabled={busy}>{busy ? (es ? 'ENVIANDO…' : 'ENVIANDO…') : (es ? 'ENVIAR COMENTARIO' : 'ENVIAR COMENTÁRIO')}</button>
      {status && <p className="form-status" role="status">{status}</p>}
    </form>
  </section>;
}
