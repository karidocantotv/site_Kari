'use client';

const sizes = [
  { name: 'Logo do site', size: 'SVG (preferencial) ou 600 × 180 px', use: 'Header e footer', note: 'Se for PNG, use fundo transparente.' },
  { name: 'Preview social / Open Graph', size: '1200 × 630 px', use: 'WhatsApp, Facebook, LinkedIn e compartilhamentos', note: 'Proporção 1.91:1.' },
  { name: 'Home — hero', size: '1600 × 900 px', use: 'Imagem principal da Home', note: 'Proporção 16:9.' },
  { name: 'Home — vídeo', size: '1280 × 720 px', use: 'Capa/thumbnail de vídeo', note: 'Proporção 16:9.' },
  { name: 'Home / Sobre — imagem da Kari', size: '1200 × 1500 px', use: 'Retrato e apresentação da Kari', note: 'Proporção 4:5.' },
  { name: 'Página 404', size: '1200 × 800 px', use: 'Imagem da página de erro', note: 'Proporção 3:2.' },
  { name: 'Capa de blog', size: '1600 × 900 px', use: 'Cards e topo do artigo', note: 'Proporção 16:9. O site otimiza para exibição.' },
  { name: 'Imagem interna de blog', size: '1200 × 900 px', use: 'Fotos dentro dos artigos', note: 'Proporção 4:3.' },
  { name: 'Capa de curso', size: '1600 × 900 px', use: 'Cards e página do curso', note: 'Proporção 16:9.' },
  { name: 'Capa de projeto', size: '1600 × 900 px', use: 'Cards e página do projeto', note: 'Proporção 16:9.' },
  { name: 'Galeria / imagem de projeto', size: '1600 × 1200 px', use: 'Fotos adicionais do projeto', note: 'Proporção 4:3.' },
];

export default function AdminImageSizeGuide() {
  return (
    <section className="media-logo-callout" style={{ marginBottom: 24 }}>
      <div style={{ width: '100%' }}>
        <span className="eyebrow">Padrão de produção</span>
        <h3 className="serif">Tamanhos recomendados para imagens</h3>
        <p style={{ marginBottom: 16 }}>Use estes tamanhos como padrão ao preparar imagens para o site. Sempre que possível, envie JPG, WebP ou AVIF otimizado; mantenha o arquivo original sem texto sobreposto quando o título já é exibido pelo site.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 10 }}>
          {sizes.map(item => (
            <div key={item.name} style={{ border: '1px solid rgba(0,0,0,.10)', padding: 14, background: 'rgba(255,255,255,.35)' }}>
              <strong style={{ display: 'block', marginBottom: 5 }}>{item.name}</strong>
              <span style={{ display: 'block', fontWeight: 700 }}>{item.size}</span>
              <small style={{ display: 'block', marginTop: 5 }}>{item.use}</small>
              <small style={{ display: 'block', marginTop: 3, opacity: .75 }}>{item.note}</small>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 14, fontSize: 12, opacity: .8 }}>Peso recomendado: tente manter imagens de conteúdo abaixo de 300 KB quando a qualidade permitir. Limite de upload atual: 12 MB por imagem.</p>
      </div>
    </section>
  );
}
