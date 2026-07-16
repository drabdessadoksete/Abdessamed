import { blogPages, servicePages } from '../data/seoContent.js'
import { absoluteUrl, trailingSlash } from './site.js'
import { multilingualRoutes } from './multilingualRoutes.js'

export const staticSeoRoutes = [
  { path: '/', title: 'Dentiste à Sète | Cabinet du Dr Abdessadok', description: "Dentiste à Sète : soins dentaires, implantologie et orthodontie invisible au cabinet du Dr Abdessamed Abdessadok. Adresse, horaires et contact.", h1: 'Cabinet dentaire à Sète : précision et humanité.', type: 'home', language: 'fr', pageType: 'home', source: 'src/pages/Home.jsx' },
  { path: '/about/', title: 'À propos du Dr Abdessadok | Cabinet dentaire Sète', description: 'Parcours universitaire, qualifications et approche clinique du Dr Abdessamed Abdessadok, chirurgien-dentiste à Sète.', h1: 'Dr Abdessamed Abdessadok', type: 'about', language: 'fr', source: 'src/pages/About.jsx' },
  { path: '/services/', title: 'Soins dentaires, implantologie et aligneurs à Sète', description: 'Découvrez les soins du cabinet à Sète : implantologie, orthodontie invisible, prévention, soins conservateurs et prothèses dentaires.', h1: 'Des parcours adaptés au besoin clinique.', type: 'services', language: 'fr', source: 'src/pages/Services.jsx' },
  { path: '/gallery/', title: 'Galerie des parcours dentaires | Dr Abdessadok', description: 'Découvrez en images les parcours en implantologie, orthodontie invisible et technologie dentaire proposés par le cabinet à Sète.', h1: 'Voir pour mieux comprendre.', type: 'gallery', language: 'fr', source: 'src/pages/Gallery.jsx' },
  { path: '/blog/', title: 'Guides dentaires à Sète | Implantologie et orthodontie', description: 'Guides patients du cabinet à Sète sur les implants dentaires, l’orthodontie invisible, les aligneurs et la préparation du premier bilan.', h1: 'Comprendre avant votre rendez-vous.', type: 'blog', language: 'fr', source: 'src/pages/BlogHub.jsx' },
  { path: '/contact/', title: 'Contact du cabinet dentaire à Sète | Dr Abdessadok', description: 'Adresse, téléphone, e-mail, accès et horaires du cabinet dentaire du Dr Abdessadok à Sète. Envoyez un message au cabinet.', h1: 'Contact', type: 'contact', language: 'fr', pageType: 'contact', source: 'src/pages/Contact.jsx' },
  { path: '/pre-rendez-vous/', title: 'Pré-rendez-vous téléphonique à Sète | Dr Abdessadok', description: 'Demandez un pré-rendez-vous téléphonique gratuit de 5 minutes pour être orienté vers un rendez-vous adapté.', h1: 'Commençons par vous écouter.', type: 'preAppointment', indexable: false, source: 'src/pages/PreAppointment.jsx' },
]

const contentRoutes = [...servicePages, ...blogPages].map((page) => ({
  path: trailingSlash(page.url),
  title: page.title,
  description: page.metaDescription,
  h1: page.h1,
  type: page.url.startsWith('/blog/') ? 'article' : 'treatment',
  language: 'fr',
  indexable: page.indexable,
  pageType: page.url === '/orthodontie-invisible-sete/' ? 'ortho' : page.url === '/implantologie/' ? 'implant' : undefined,
  page,
  source: page.cluster === 'implantologie'
    ? 'src/data/implantologyArticles.js'
    : page.url.startsWith('/blog/') && page.articleBody
      ? 'src/data/generatedOrthodontieArticles.js'
      : 'src/data/seoContent.js',
}))

const localizedSeoRoutes = multilingualRoutes.map((route) => ({
  ...route,
  h1: route.h1,
  language: route.language,
  indexable: true,
}))

export const seoRoutes = [...staticSeoRoutes, ...contentRoutes, ...localizedSeoRoutes]
export const sitemapRoutes = seoRoutes.filter((route) => route.indexable !== false)
export const seoRouteByPath = new Map(seoRoutes.map((route) => [trailingSlash(route.path), route]))

export function routeUrl(routeOrPath) {
  return absoluteUrl(typeof routeOrPath === 'string' ? routeOrPath : routeOrPath.path)
}
