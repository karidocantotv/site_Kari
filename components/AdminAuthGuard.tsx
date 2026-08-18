'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;
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
