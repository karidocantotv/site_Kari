'use client';
import {usePathname} from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
export default function LanguageAwareNav(){const pathname=usePathname()||'/';const es=pathname==='/es'||pathname.startsWith('/es/');const p=(path:string)=>es?`/es${path==='/'?'':path}`:path;return <nav className="links" aria-label="Navegação principal"><LanguageSwitcher/><a href={p('/')}>{es?'INICIO':'INÍCIO'}</a><a href={p('/sobre')}>{es?'SOBRE KARI':'SOBRE Kari'}</a><a href={p('/cursos')}>{es?'CURSOS':'CURSOS'}</a><a href={p('/projetos')}>{es?'PROYECTOS':'PROJETOS'}</a><a href={p('/blog')}>BLOG</a><a href={p('/contato')}>{es?'CONTACTO':'CONTATO'}</a><a className="btn primary" href={p('/cursos')}>{es?'ÁREA DEL ALUMNO':'ÁREA DO ALUNO'}</a></nav>}
