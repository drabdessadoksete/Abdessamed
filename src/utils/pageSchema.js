import { absoluteUrl, dentistPersonSchema, dentistSchema, organizationSchema } from '../config/site.js'

export const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${absoluteUrl('/')}#website`,
  url: absoluteUrl('/'),
  name: organizationSchema.name,
  publisher: { '@id': organizationSchema['@id'] },
  inLanguage: ['fr', 'en', 'es', 'de'],
}

export const practiceGraph = [dentistSchema, dentistPersonSchema, organizationSchema, websiteSchema]

export function corePageGraph(route, image) {
  if (!route) return []
  const url = absoluteUrl(route.path)
  const isTreatment = route.type === 'treatment'
  const type = route.type === 'contact' ? 'ContactPage'
    : route.type === 'about' ? 'AboutPage'
      : ['blog', 'gallery', 'services'].includes(route.type) ? 'CollectionPage'
        : isTreatment ? 'MedicalWebPage' : 'WebPage'
  const breadcrumbId = `${url}#breadcrumb`
  const imageId = `${url}#primaryimage`
  const home = { name: route.labels?.home || 'Accueil', url: absoluteUrl(route.paths?.home || '/') }
  const items = [route.type === 'localizedHome' ? { name: 'Accueil', url: absoluteUrl('/') } : home, { name: route.h1, url }]
  return [
    {
      '@type': type, '@id': `${url}#webpage`, url, name: route.title,
      description: route.description, inLanguage: route.language || 'fr',
      isPartOf: { '@id': websiteSchema['@id'] },
      primaryImageOfPage: { '@id': imageId },
      ...(route.path !== '/' ? { breadcrumb: { '@id': breadcrumbId } } : {}),
      ...(['contact', 'home', 'localizedHome'].includes(route.type) ? { mainEntity: { '@id': dentistSchema['@id'] } } : {}),
      ...(route.type === 'about' ? { mainEntity: { '@id': dentistPersonSchema['@id'] } } : {}),
      ...(isTreatment ? { mainEntity: { '@id': `${url}#service` } } : {}),
    },
    {
      '@type': 'ImageObject', '@id': imageId,
      url: absoluteUrl(image.fallback), contentUrl: absoluteUrl(image.fallback),
      width: image.width, height: image.height, caption: image.alt,
    },
    ...(route.path !== '/' ? [{
      '@type': 'BreadcrumbList', '@id': breadcrumbId,
      itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url })),
    }] : []),
    ...(isTreatment ? [{
      '@type': 'Service', '@id': `${url}#service`, url, name: route.h1,
      description: route.description, provider: { '@id': dentistSchema['@id'] }, areaServed: 'Sète et Bassin de Thau',
    }] : []),
  ]
}

export function contentBreadcrumbs(page, type = 'service') {
  return [
    { name: 'Accueil', url: absoluteUrl('/') },
    { name: type === 'blog' ? 'Guides' : 'Soins', url: absoluteUrl(type === 'blog' ? '/blog/' : '/services/') },
    { name: page.menuLabel || page.h1, url: absoluteUrl(page.url) },
  ]
}

// Both HTML output and client navigation use the same facts and review conditions.
export function contentPageGraph(page, type, image) {
  const url = absoluteUrl(page.url)
  const isArticle = type === 'blog'
  const reviewed = page.medicalReviewStatus === 'reviewed' && Boolean(page.medicalReviewer)
  const imageId = `${url}#primaryimage`
  const pageId = `${url}#webpage`
  const primaryId = `${url}#${isArticle ? 'article' : 'service'}`
  const breadcrumbId = `${url}#breadcrumb`
  return [
    {
      '@type': 'MedicalWebPage', '@id': pageId, url, name: page.title,
      description: page.metaDescription, inLanguage: 'fr',
      isPartOf: { '@id': websiteSchema['@id'] },
      about: { '@id': dentistSchema['@id'] },
      mainEntity: { '@id': primaryId },
      primaryImageOfPage: { '@id': imageId },
      breadcrumb: { '@id': breadcrumbId },
      audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
      ...(isArticle ? { specialty: 'https://schema.org/Dentistry' } : {}),
      ...(reviewed ? {
        lastReviewed: page.dateModified,
        reviewedBy: page.medicalReviewer === dentistPersonSchema.name
          ? { '@id': dentistPersonSchema['@id'] }
          : { '@type': 'Person', name: page.medicalReviewer },
      } : {}),
    },
    isArticle ? {
      '@type': 'Article', '@id': primaryId, headline: page.h1,
      description: page.metaDescription, inLanguage: 'fr',
      mainEntityOfPage: { '@id': pageId },
      datePublished: page.datePublished, dateModified: page.dateModified,
      author: { '@id': organizationSchema['@id'] },
      publisher: { '@id': organizationSchema['@id'] },
      image: { '@id': imageId },
    } : {
      '@type': 'Service', '@id': primaryId, name: page.h1,
      description: page.metaDescription, url,
      provider: { '@id': dentistSchema['@id'] },
      areaServed: 'Sète et Bassin de Thau',
    },
    {
      '@type': 'ImageObject', '@id': imageId,
      url: absoluteUrl(image.fallback), contentUrl: absoluteUrl(image.fallback),
      width: image.width, height: image.height, caption: image.alt,
    },
    {
      '@type': 'BreadcrumbList', '@id': breadcrumbId,
      itemListElement: contentBreadcrumbs(page, type).map((item, index) => ({
        '@type': 'ListItem', position: index + 1, name: item.name, item: item.url,
      })),
    },
    ...(page.faq?.length ? [{
      '@type': 'FAQPage', '@id': `${url}#faq`, isPartOf: { '@id': pageId },
      mainEntity: page.faq.map((item) => ({
        '@type': 'Question', name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    }] : []),
  ]
}
