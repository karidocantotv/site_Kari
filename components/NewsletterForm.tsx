'use client';

import { FormEvent, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export default function NewsletterForm() {
  const pathname = usePathname() || '/';
  const es = pathname === '/es' || pathname.startsWith('/es/');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const sending = es ? 'Enviando…' : 'Enviando…';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(sending);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setStatus(es ? 'El boletín todavía no está configurado.' : 'Newsletter ainda não configurada.'); return; }
    const { error } = await supabase.from('newsletter_subscribers').insert({ email: email.trim().toLowerCase(), name: name.trim() || null, source: 'footer', consent: true });
    const alreadyRegistered = error?.code === '23505';
    setStatus(error && !alreadyRegistered ? (es ? 'No fue posible registrarte ahora.' : 'Não foi possível cadastrar agora.') : alreadyRegistered ? (es ? 'Tu correo ya está registrado.' : 'Seu e-mail já está cadastrado.') : (es ? '¡Listo! Tu registro se realizó correctamente.' : 'Pronto! Seu cadastro foi realizado.'));
    if (!error || alreadyRegistered) { setEmail(''); setName(''); }
  }

  return <form className="newsletter-form" onSubmit={submit}>
    <input value={name} onChange={(e) => setName(e.target.value)} placeholder={es ? 'Tu nombre' : 'Seu nome'} aria-label={es ? 'Tu nombre' : 'Seu nome'} />
    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={es ? 'Tu mejor correo electrónico' : 'Seu melhor e-mail'} aria-label={es ? 'Tu mejor correo electrónico' : 'Seu melhor e-mail'} />
    <button className="btn" disabled={status === sending} type="submit">{es ? 'QUIERO RECIBIR' : 'QUERO RECEBER'}</button>
    {status && <span className="newsletter-status">{status}</span>}
  </form>;
}
