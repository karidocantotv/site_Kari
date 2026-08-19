import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  let ok = false;
  if (token && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { error } = await supabase.from('newsletter_subscribers').update({ unsubscribed_at: new Date().toISOString() }).eq('unsubscribe_token', token);
    ok = !error;
  }
  return <main className="pageHero"><span className="eyebrow">Newsletter</span><h1 className="serif">{ok ? 'Inscrição cancelada.' : 'Link inválido.'}</h1><p>{ok ? 'Você não receberá novas campanhas da Kari Do Canto.' : 'Não foi possível encontrar essa inscrição.'}</p><div className="actions" style={{justifyContent:'center'}}><Link className="btn primary" href="/">VOLTAR AO INÍCIO</Link></div></main>;
}
