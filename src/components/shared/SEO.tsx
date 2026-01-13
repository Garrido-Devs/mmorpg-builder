import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
}

const DEFAULT_TITLE = 'MMORPG Builder - Editor de Jogos 3D Open Source'
const DEFAULT_DESCRIPTION = 'Crie seu proprio MMORPG 3D no navegador. Editor visual completo com +100 assets 3D, sistema de IA para NPCs, componentes configuráveis. 100% Open Source e gratuito.'
const DEFAULT_KEYWORDS = 'mmorpg, game builder, editor de jogos, three.js, react, typescript, 3d game, rpg maker, game engine, open source, criar jogos, desenvolvimento de jogos'
const SITE_URL = 'https://mmorpg-builder.vercel.app'

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = '/og-image.png',
  url = SITE_URL,
}: SEOProps) {
  const fullTitle = title ? `${title} | MMORPG Builder` : DEFAULT_TITLE

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Emerson Garrido" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="MMORPG Builder" />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="application-name" content="MMORPG Builder" />
    </Helmet>
  )
}
