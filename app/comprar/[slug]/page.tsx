import Link from 'next/link';
import { notFound } from 'next/navigation';

const courses: Record<string, { title: string; tag: string }> = {
  'feltro-criacoes-com-amor': { title: 'Feltro: Criações com Amor', tag: 'Feltro' },
  'patchwork-do-basico': { title: 'Patchwork: Do básico ao acabamento', tag: 'Patchwork' },
  'arte-em-madeira': { title: 'Arte em Madeira: Decore e transforme', tag: 'Arte em madeira' },
  'scrapbook-memorias': { title: 'Scrapbook: Memórias que ficam', tag: 'Scrapbook' },
};

export function generateStaticParams() { return Object.keys(courses).map((slug) => ({ slug })); }

export default async function Comprar({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = courses[slug];
  if (!course) notFound();
  return <section className="purchase-gate"><div className="container purchase-card">
    <span className="eyebrow">Área de compra · {course.tag}</span>
    <h1 className="serif">Seu interesse foi registrado.</h1>
    <p>Agora você pode continuar para a etapa de compra do curso <strong>{course.title}</strong>. O checkout será conectado nesta etapa do projeto.</p>
    <div className="actions"><button className="btn primary" type="button" disabled>CONTINUAR PARA O CHECKOUT</button><Link className="btn" href="/cursos">VOLTAR AOS CURSOS</Link></div>
    <small>Esta página já está preparada para receber o checkout oficial sem alterar a captura do lead.</small>
  </div></section>;
}
