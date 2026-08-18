type Breadcrumb = { name: string; item: string };

type Props = {
  type: 'WebSite' | 'WebPage' | 'Article' | 'Course' | 'CreativeWork';
  name: string;
  description: string;
  url: string;
  image?: string;
  breadcrumbs?: Breadcrumb[];
};

const base = 'https://karidocanto.com.br';

export default function SeoJsonLd({ type, name, description, url, image, breadcrumbs = [] }: Props) {
  const entity: Record<string, unknown> = {
    '@type': type,
    name,
    description,
    url: url.startsWith('http') ? url : `${base}${url}`,
    ...(image ? { image: image.startsWith('http') ? image : `${base}${image}` } : {}),
  };

  if (type === 'WebSite') {
    entity.publisher = { '@type': 'Person', name: 'Kari Do Canto', url: base };
    entity.inLanguage = 'pt-BR';
  }
  if (type === 'Article') {
    entity.headline = name;
    entity.author = { '@type': 'Person', name: 'Kari Do Canto', url: base };
    entity.publisher = { '@type': 'Person', name: 'Kari Do Canto', url: base };
    entity.inLanguage = 'pt-BR';
  }
  if (type === 'Course') {
    entity.provider = { '@type': 'Person', name: 'Kari Do Canto', url: base };
    entity.inLanguage = 'pt-BR';
  }

  const graph: Record<string, unknown>[] = [entity];
  if (breadcrumbs.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.item.startsWith('http') ? crumb.item : `${base}${crumb.item}`,
      })),
    });
  }

  const data = { '@context': 'https://schema.org', '@graph': graph };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
