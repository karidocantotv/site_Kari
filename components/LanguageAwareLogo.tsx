'use client';
import {usePathname} from 'next/navigation';
import LogoImage from '@/components/LogoImage';
export default function LanguageAwareLogo(){const es=(usePathname()||'/').startsWith('/es');return <a href={es?'/es':'/'} className="logo logo-mark" aria-label="Kari Do Canto — inicio"><LogoImage/></a>}
