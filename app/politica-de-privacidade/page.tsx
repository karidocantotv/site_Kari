import type { Metadata } from 'next';
import Link from 'next/link';
import SeoJsonLd from '@/components/SeoJsonLd';

export const metadata: Metadata = { title: 'Política de Privacidade', description: 'Conheça como o site Kari Do Canto trata dados, formulários e informações de navegação.', alternates: { canonical: 'https://karidocanto.com.br/politica-de-privacidade' }, openGraph: { title: 'Política de Privacidade', description: 'Conheça como o site Kari Do Canto trata dados, formulários e informações de navegação.', url: 'https://karidocanto.com.br/politica-de-privacidade', type: 'website', images: [{ url: '/api/og-image', alt: 'Política de Privacidade' }] }, twitter: { card: 'summary_large_image', title: 'Política de Privacidade', description: 'Conheça como o site Kari Do Canto trata dados, formulários e informações de navegação.', images: ['/api/og-image'] } };

const styles = `
.legal{padding:72px 0 96px}.legal-wrap{max-width:900px;margin:0 auto}.legal h1{font-size:clamp(42px,6vw,68px);line-height:1.05;margin:12px 0 18px}.legal h2{font-size:28px;margin:42px 0 12px}.legal p,.legal li{font-size:16px;line-height:1.8;color:#5f5955}.legal ul{padding-left:24px}.legal .updated{font-size:13px;color:#8b817b}.legal a{color:inherit;text-decoration:underline}
`;

export default function PoliticaDePrivacidade() {
  return <>
    <SeoJsonLd type="WebPage" name="Política de Privacidade" description="Conheça como o site Kari Do Canto trata dados, formulários e informações de navegação." url="/politica-de-privacidade" image="/api/og-image" breadcrumbs={[{name:'Início',item:'/'},{name:'Política de Privacidade',item:'/politica-de-privacidade'}]} />
    <main className="legal"><style>{styles}</style><div className="container legal-wrap">
    <span className="eyebrow">Privacidade e transparência</span>
    <h1 className="serif">Política de Privacidade</h1>
    <p className="updated">Última atualização: 18 de agosto de 2026.</p>

    <p>A Kari Do Canto — Artesanato com Afeto valoriza a privacidade e busca tratar dados pessoais de forma transparente, segura e compatível com a legislação brasileira, especialmente a Lei Geral de Proteção de Dados Pessoais (LGPD).</p>

    <h2 className="serif">1. Quem somos</h2>
    <p>Esta política se aplica ao site <strong>karidocanto.com.br</strong> e aos recursos digitais disponibilizados pela Kari Do Canto. Para solicitações relacionadas aos seus dados pessoais, utilize o <Link href="/contato">canal de contato</Link> disponibilizado no site.</p>

    <h2 className="serif">2. Quais dados podemos coletar</h2>
    <p>Dependendo da forma como você utiliza o site, podemos tratar:</p>
    <ul>
      <li>nome e endereço de e-mail fornecidos voluntariamente em formulários, como a inscrição na newsletter;</li>
      <li>informações necessárias para atendimento, comunicação, cursos ou contratação de serviços, quando aplicável;</li>
      <li>informações técnicas e de navegação, como páginas acessadas, informações do dispositivo e dados relacionados à experiência de uso, quando coletados por ferramentas de análise habilitadas no site.</li>
    </ul>

    <h2 className="serif">3. Para que usamos os dados</h2>
    <p>Os dados podem ser utilizados para:</p>
    <ul>
      <li>responder mensagens e solicitações enviadas pelo usuário;</li>
      <li>realizar cadastro e comunicação de newsletter, quando solicitado;</li>
      <li>fornecer cursos, materiais, conteúdos ou serviços contratados;</li>
      <li>melhorar conteúdo, desempenho, segurança e experiência do site;</li>
      <li>cumprir obrigações legais e exercer regularmente direitos.</li>
    </ul>
    <p>O tratamento será realizado conforme a base legal aplicável a cada finalidade, incluindo consentimento, execução de contrato, cumprimento de obrigação legal ou regulatória e legítimo interesse, quando cabível.</p>

    <h2 className="serif">4. Newsletter e consentimento</h2>
    <p>Ao se cadastrar na newsletter, o usuário fornece voluntariamente nome e e-mail e declara consentimento para receber comunicações relacionadas a conteúdos, novidades, projetos e cursos da Kari Do Canto. O cadastro pode ser cancelado a qualquer momento por meio do canal de contato disponibilizado no site ou pelos mecanismos de descadastro eventualmente presentes nas comunicações.</p>

    <h2 className="serif">5. Ferramentas e fornecedores</h2>
    <p>O site pode utilizar fornecedores de tecnologia para hospedagem, armazenamento, autenticação, formulários, envio de comunicações e análise de desempenho. Atualmente, recursos do site podem utilizar serviços como Supabase para armazenamento e gerenciamento de dados e Cloudflare Web Analytics para métricas de navegação.</p>
    <p>Esses fornecedores podem tratar informações necessárias à prestação de seus serviços, observadas suas próprias políticas e as medidas de segurança aplicáveis.</p>

    <h2 className="serif">6. Cookies e tecnologias semelhantes</h2>
    <p>O site pode utilizar cookies e tecnologias semelhantes necessários ao funcionamento de determinados recursos e, quando habilitado, tecnologias de análise para compreender o uso do site e melhorar sua experiência. A configuração e o comportamento dessas tecnologias podem variar conforme os serviços utilizados e suas atualizações.</p>

    <h2 className="serif">7. Compartilhamento de dados</h2>
    <p>Dados pessoais não são vendidos. O compartilhamento poderá ocorrer quando necessário para executar serviços solicitados pelo usuário, operar a infraestrutura tecnológica do site, cumprir obrigação legal, exercer direitos ou atender outra hipótese legalmente autorizada.</p>

    <h2 className="serif">8. Segurança</h2>
    <p>São adotadas medidas técnicas e administrativas razoáveis para proteger os dados pessoais contra acessos não autorizados e situações acidentais ou ilícitas, considerando a natureza dos dados e os riscos envolvidos. Nenhum sistema conectado à internet pode ser considerado absolutamente imune a incidentes.</p>

    <h2 className="serif">9. Retenção</h2>
    <p>Os dados são mantidos pelo período necessário para cumprir as finalidades informadas, atender obrigações legais ou regulatórias, preservar direitos e cumprir prazos aplicáveis. Quando não houver mais necessidade de conservação, os dados poderão ser eliminados ou anonimizados, conforme permitido pela legislação.</p>

    <h2 className="serif">10. Direitos do titular</h2>
    <p>Nos termos da LGPD, o titular pode solicitar, conforme aplicável, confirmação da existência de tratamento, acesso aos dados, correção, anonimização, bloqueio ou eliminação, portabilidade, informação sobre compartilhamentos, revogação do consentimento e demais direitos previstos em lei.</p>
    <p>Alguns pedidos podem estar sujeitos a limitações legais. Para exercer seus direitos, utilize o <Link href="/contato">canal de contato</Link> do site e informe, sempre que possível, o pedido que deseja realizar e os dados necessários para sua identificação.</p>

    <h2 className="serif">11. Dados de crianças e adolescentes</h2>
    <p>O site não é direcionado especificamente à coleta de dados de crianças. Caso seja identificado tratamento inadequado de dados de criança ou adolescente, serão adotadas as medidas cabíveis de acordo com a legislação aplicável e o melhor interesse do titular.</p>

    <h2 className="serif">12. Alterações desta política</h2>
    <p>Esta política pode ser atualizada periodicamente para refletir mudanças no site, nos fornecedores, nas práticas de tratamento ou na legislação. A versão publicada nesta página será a versão vigente.</p>

    <h2 className="serif">13. Legislação</h2>
    <p>Esta política observa, entre outras normas aplicáveis, a Lei nº 13.709/2018 (LGPD) e a legislação brasileira pertinente à proteção da privacidade e dos consumidores.</p>

    <h2 className="serif">14. Contato</h2>
    <p>Para dúvidas ou solicitações sobre privacidade e proteção de dados, utilize o <Link href="/contato">canal de contato</Link> disponibilizado no site.</p>
  </div></main>
  </>;
}
