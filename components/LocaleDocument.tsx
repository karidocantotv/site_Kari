'use client';
import { useEffect } from 'react';
export default function LocaleDocument({locale,children}:{locale:'pt-BR'|'es-LA';children:React.ReactNode}){useEffect(()=>{document.documentElement.lang=locale==='es-LA'?'es':'pt-BR'},[locale]);return <>{children}</>}
