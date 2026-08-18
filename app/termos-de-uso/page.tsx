import Link from 'next/link';

export const metadata = {
  title: 'Termos de Uso',
  description: 'Termos de uso do site KARI Do Canto — Artesanato com Afeto.',
};

const styles = `
.legal{padding:72px 0 96px}.legal-wrap{max-width:900px;margin:0 auto}.legal h1{font-size:clamp(42px,6vw,68px);line-height:1.05;margin:12px 0 18px}.legal h2{font-size:28px;margin:42px 0 12px}.legal p,.legal li{font-size:16px;line-height:1.8;color:#5f5955}.legal ul{padding-left:24px}.legal .updated{font-size:13px;color:#8b817b}.legal a{color:inherit;text-decoration:underline}
`;

export default function TermosDeUso() {
  return <main className="legal"><style>{styles}</style><div className="container legal-wrap">
    <span className="eyebrow">Informações legais</span>
    <h1 className="serif">Termos de Uso</h1>
    <p className="updated">Última atualização: 18 de agosto de 2026.</p>

    <p>Bem-vinda(o) à KARI Do Canto — Artesanato com Afeto. Estes Termos de Uso estabelecem as regras para utilização deste site, seus conteúdos, cursos, projetos, materiais e demais funcionalidades. Ao acessar ou utilizar o site, você declara que leu e concorda com estes termos.</p>

    <h2 className="serif">1. Sobre o site</h2>
    <p>O site KARI Do Canto apresenta conteúdos de artesanato, projetos, dicas, materiais educativos e informações sobre cursos e produtos digitais ou físicos eventualmente disponibilizados. As informações podem ser atualizadas, alteradas ou retiradas sem aviso prévio.</p>

    <h2 className="serif">2. Conteúdo e propriedade intelectual</h2>
    <p>Textos, fotografias, vídeos, ilustrações, identidade visual, marcas, logotipos, materiais de cursos, projetos, apostilas e demais conteúdos disponibilizados no site são protegidos pela legislação aplicável e pertencem à KARI Do Canto ou a seus respectivos titulares.</p>
    <p>É permitido acessar e utilizar o conteúdo para fins pessoais e não comerciais, respeitadas as condições específicas de cada material. Não é permitido copiar, reproduzir, redistribuir, vender, publicar, modificar ou utilizar comercialmente conteúdos protegidos sem autorização prévia, salvo quando a legislação permitir.</p>

    <h2 className="serif">3. Cursos e materiais</h2>
    <p>Quando houver cursos, aulas ou materiais pagos, as condições específicas de preço, acesso, forma de pagamento, prazo, entrega, cancelamento e eventual garantia serão apresentadas no momento da contratação e integrarão a relação contratual aplicável.</p>
    <p>Materiais educativos têm finalidade informativa e de ensino de artesanato. Resultados podem variar conforme materiais, técnica, experiência e execução de cada pessoa.</p>

    <h2 className="serif">4. Links e serviços de terceiros</h2>
    <p>O site pode apresentar links, vídeos, redes sociais, serviços de hospedagem, ferramentas de análise e outros recursos de terceiros. Cada serviço possui seus próprios termos e políticas. A KARI Do Canto não controla integralmente serviços externos e não se responsabiliza por alterações realizadas por seus respectivos operadores.</p>

    <h2 className="serif">5. Disponibilidade do site</h2>
    <p>Buscamos manter o site disponível e seguro, mas não garantimos funcionamento ininterrupto ou livre de falhas. Manutenções, atualizações, indisponibilidades de fornecedores ou eventos fora de nosso controle podem interromper temporariamente o acesso.</p>

    <h2 className="serif">6. Responsabilidades do usuário</h2>
    <p>O usuário deve utilizar o site de forma lícita, respeitosa e compatível com estes termos. É proibido tentar obter acesso não autorizado, interferir no funcionamento do site, introduzir código malicioso ou utilizar os recursos para finalidade ilícita.</p>

    <h2 className="serif">7. Privacidade</h2>
    <p>O tratamento de dados pessoais realizado por meio do site é explicado na <Link href="/politica-de-privacidade">Política de Privacidade</Link>, que integra estes Termos de Uso.</p>

    <h2 className="serif">8. Alterações destes termos</h2>
    <p>Estes termos podem ser atualizados para refletir mudanças no site, nos serviços oferecidos ou na legislação. A versão publicada nesta página será considerada a versão vigente.</p>

    <h2 className="serif">9. Legislação aplicável</h2>
    <p>Estes termos são interpretados de acordo com a legislação brasileira, observados os direitos assegurados ao consumidor e demais normas aplicáveis.</p>

    <h2 className="serif">10. Contato</h2>
    <p>Para dúvidas, solicitações ou informações relacionadas a estes termos, utilize o <Link href="/contato">canal de contato</Link> disponibilizado no site.</p>
  </div></main>;
}
