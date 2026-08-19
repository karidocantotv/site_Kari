'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase';

type Props = {
  courseSlug?: string;
  courseTitle?: string;
  source?: string;
  compact?: boolean;
};

function getTracking() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
  return Object.fromEntries(keys.map((key) => [key, params.get(key) || undefined]));
}

export default function LeadCapture({ courseSlug, courseTitle, source = 'site', compact = false }: Props) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [consent, setConsent] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus('error');
      setMessage('A captura de leads ainda não foi configurada neste ambiente.');
      return;
    }

    const tracking = getTracking();
    const sourcePage = window.location.pathname;
    const locale = sourcePage === '/es' || sourcePage.startsWith('/es/') ? 'es-LA' : 'pt-BR';

    const { error } = await supabase
      .from('leads')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        whatsapp: whatsapp.trim() || null,
        course_slug: courseSlug || null,
        source,
        locale,
        source_page: sourcePage,
        ...tracking,
        consent_marketing: consent,
        consent_at: consent ? new Date().toISOString() : null,
      });

    if (error) {
      if (error.code === '23505') {
        setStatus('success');
        setMessage(courseSlug
          ? 'Este e-mail já está cadastrado. Vamos continuar.'
          : 'Este e-mail já está cadastrado na nossa lista.');
        if (courseSlug) window.setTimeout(() => router.push(`/comprar/${courseSlug}?lead=1`), 700);
        return;
      }
      setStatus('error');
      setMessage(error.message.includes('course_slug')
        ? 'A base de dados precisa receber a atualização de captura de leads. Execute o SQL de migração incluído no projeto.'
        : 'Não foi possível registrar seus dados agora. Tente novamente.');
      return;
    }


    setStatus('success');
    setMessage(courseSlug
      ? 'Perfeito! Seu interesse foi registrado. Vamos continuar.'
      : 'Pronto! Você receberá as novidades da Kari.');

    if (courseSlug) {
      window.setTimeout(() => router.push(`/comprar/${courseSlug}?lead=1`), 700);
    }
  }

  return (
    <div className={compact ? 'lead-capture compact' : 'lead-capture'}>
      <div className="lead-copy">
        <span className="eyebrow">{courseSlug ? 'Antes de comprar' : 'Fique por dentro'}</span>
        <h2 className="serif">{courseSlug ? 'Quero conhecer este curso' : 'Receba inspiração no seu e-mail.'}</h2>
        <p>{courseSlug
          ? `Deixe seus dados para registrar seu interesse em ${courseTitle || 'este curso'} e seguir para a área de compra.`
          : 'Dicas, passo a passo, projetos e novidades dos cursos da Kari do Canto.'}</p>
      </div>
      <form onSubmit={submit} className="lead-form">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" aria-label="Seu nome" />
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu melhor e-mail" aria-label="Seu melhor e-mail" />
        <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp (opcional)" aria-label="WhatsApp" />
        <label className="consent"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /> <span>Quero receber novidades, dicas e informações sobre cursos.</span></label>
        <button className="btn primary" disabled={status === 'loading'} type="submit">{status === 'loading' ? 'ENVIANDO...' : courseSlug ? 'CONTINUAR' : 'QUERO RECEBER'}</button>
        {message && <p className={`form-status ${status}`}>{message}</p>}
      </form>
    </div>
  );
}
