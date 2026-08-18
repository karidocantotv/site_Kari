'use client';

import { FormEvent, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Enviando...');
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus('Newsletter ainda não configurada.');
      return;
    }
    const { error } = await supabase.from('newsletter_subscribers').insert({ email: email.trim().toLowerCase(), name: name.trim() || null, source: 'footer', consent: true });
    const alreadyRegistered = error?.code === '23505';
    setStatus(error && !alreadyRegistered ? 'Não foi possível cadastrar agora.' : alreadyRegistered ? 'Seu e-mail já está cadastrado.' : 'Pronto! Seu cadastro foi realizado.');
    if (!error || alreadyRegistered) { setEmail(''); setName(''); }
  }

  return <form className="newsletter-form" onSubmit={submit}>
    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" aria-label="Seu nome" />
    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu melhor e-mail" aria-label="Seu melhor e-mail" />
    <button className="btn" disabled={status === 'Enviando...'} type="submit">QUERO RECEBER</button>
    {status && <span className="newsletter-status">{status}</span>}
  </form>;
}
