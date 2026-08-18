'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export default function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      router.replace('/admin/login');
      return () => { active = false; };
    }
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (!data.session) router.replace('/admin/login');
      else setAuthorized(true);
    });
    return () => { active = false; };
  }, [router]);

  if (!authorized) return <main className="admin"><div className="container"><div className="adminbox"><p>Verificando acesso…</p></div></div></main>;
  return <>{children}</>;
}
