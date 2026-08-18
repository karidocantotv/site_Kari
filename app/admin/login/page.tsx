'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import AdminBrand from '@/components/AdminBrand';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/admin/dashboard');
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError('E-mail ou senha inválidos.');
      setLoading(false);
      return;
    }

    router.replace('/admin/dashboard');
  }

  return (
    <main className="admin">
      <div className="container">
        <div className="adminbox admin-login-box">
          <AdminBrand />
          <h1 className="serif">Kari Do Canto</h1>
          <p>Entre para gerenciar imagens e conteúdo do site.</p>
          <form onSubmit={handleSubmit} className="admin-login-form">
            <label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required /></label>
            <label>Senha<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>
            {error && <p role="alert" className="form-error">{error}</p>}
            <button className="btn primary" type="submit" disabled={loading}>{loading ? 'ENTRANDO…' : 'ENTRAR NO PAINEL'}</button>
          </form>
        </div>
      </div>
    </main>
  );
}
