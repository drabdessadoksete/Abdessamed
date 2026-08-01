import fs from 'node:fs/promises'
import path from 'node:path'
import { buildArticleBodyBlocks } from '../src/utils/seoArticleContent.js'
import { seoRoutes, routeUrl } from '../src/config/seoRoutes.js'
import { getAlternatesForPageType, getLanguageNavigation } from '../src/config/multilingualRoutes.js'
import { media, mediaForRoute } from '../src/config/media.js'
import {
  absoluteUrl,
  dentistPersonSchema,
  dentistSchema,
  openingHoursSchema,
  organizationSchema,
  postalAddressSchema,
  site,
  trailingSlash,
} from '../src/config/site.js'

const distDir = path.resolve('dist')

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;')

function routeAsset(route) {
  if (route.page) return mediaForRoute(route.path)
  if (route.pageType === 'implant' || route.path.includes('implant')) return media.implantDigitalPlanning
  if (route.pageType === 'ortho' || route.path.includes('orthodont') || route.path.includes('invisalign') || route.path.includes('align')) return media.orthoTeamExplanation
  if (route.type === 'gallery') return media.implantModel
  if (route.type === 'contact' || route.type === 'about') return media.logo
  return media.homeConsultation
}

function routeBreadcrumbs(route) {
  if (route.path === '/') return []
  if (route.language && route.language !== 'fr') {
    const nav = getLanguageNavigation(route.language)
    return [
      { name: nav.labels.home, url: absoluteUrl(nav.paths.home) },
      { name: route.h1, url: routeUrl(route) },
    ]
  }
  const parent = route.type === 'article' ? { name: 'Guides', url: absoluteUrl('/blog/') } : { name: 'Soins', url: absoluteUrl('/services/') }
  if (['about', 'gallery', 'contact', 'preAppointment'].includes(route.type)) return [{ name: 'Accueil', url: absoluteUrl('/') }, { name: route.h1, url: routeUrl(route) }]
  return [{ name: 'Accueil', url: absoluteUrl('/') }, parent, { name: route.h1, url: routeUrl(route) }]
}

function breadcrumbSchema(route) {
  const items = routeBreadcrumbs(route)
  if (!items.length) return null
  return {
    '@type': 'BreadcrumbList',
    '@id': `${routeUrl(route)}#breadcrumb`,
    itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url })),
  }
}

function schemasFor(route) {
  const url = routeUrl(route)
  const language = route.language || 'fr'
  const asset = routeAsset(route)
  const imageUrl = absoluteUrl(asset.fallback)
  const primaryImage = {
    '@type': 'ImageObject',
    '@id': `${url}#primaryimage`,
    contentUrl: imageUrl,
    url: imageUrl,
    width: asset.width,
    height: asset.height,
    caption: asset.alt,
  }
  const webPage = { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: route.title, description: route.description, primaryImageOfPage: { '@id': primaryImage['@id'] }, inLanguage: language }
  const breadcrumb = breadcrumbSchema(route)

  if (route.type === 'home') return [
    dentistSchema,
    dentistPersonSchema,
    organizationSchema,
    { '@type': 'WebSite', '@id': `${url}#website`, url, name: site.practiceName, publisher: { '@id': dentistSchema['@id'] }, inLanguage: 'fr' },
    webPage,
    primaryImage,
  ]

  if (route.type === 'localizedHome') return [webPage, primaryImage, breadcrumb].filter(Boolean)

  if (route.type === 'treatment') return [
    { '@type': 'Service', '@id': `${url}#service`, name: route.h1, description: route.description, url, provider: { '@id': dentistSchema['@id'] }, areaServed: 'Sète, France' },
    webPage,
    primaryImage,
    breadcrumb,
  ].filter(Boolean)

  if (route.type === 'article') return [
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: route.h1,
      description: route.description,
      mainEntityOfPage: { '@id': webPage['@id'] },
      author: { '@id': organizationSchema['@id'] },
      publisher: { '@id': organizationSchema['@id'] },
      image: [imageUrl],
      datePublished: route.page.datePublished,
      dateModified: route.page.dateModified,
    },
    organizationSchema,
    dentistPersonSchema,
    webPage,
    primaryImage,
    breadcrumb,
  ].filter(Boolean)

  if (route.type === 'contact') return [
    dentistSchema,
    { ...webPage, '@type': 'ContactPage', mainEntity: { '@id': dentistSchema['@id'] } },
    postalAddressSchema,
    ...openingHoursSchema,
    primaryImage,
    breadcrumb,
  ].filter(Boolean)

  if (route.type === 'about') return [dentistPersonSchema, webPage, primaryImage, breadcrumb].filter(Boolean)
  if (route.type === 'blog' || route.type === 'gallery') return [{ ...webPage, '@type': 'CollectionPage' }, primaryImage, breadcrumb].filter(Boolean)
  return [webPage, primaryImage, breadcrumb].filter(Boolean)
}

function navLinks(route) {
  if (route.language && route.language !== 'fr') {
    const nav = getLanguageNavigation(route.language)
    return [
      [nav.labels.home, nav.paths.home],
      [nav.labels.ortho, nav.paths.ortho],
      [nav.labels.implant, nav.paths.implant],
      [nav.labels.contact, nav.paths.contact],
    ]
  }
  return [['Accueil', '/'], ['À propos', '/about/'], ['Soins', '/services/'], ['Guides', '/blog/'], ['Galerie', '/gallery/'], ['Contact', '/contact/']]
}

function header(route) {
  return `<header class="site-navbar site-navbar--solid authority-navbar"><div class="container-max authority-navbar__inner"><a href="${route.language && route.language !== 'fr' ? `/${route.language}/` : '/'}" class="authority-navbar__brand"><img src="${media.logo.fallback}" alt=""><span><strong>Dr. Abdessadok</strong><small>Chirurgien-dentiste · Sète</small></span></a><nav class="authority-navbar__desktop" aria-label="Navigation">${navLinks(route).map(([label, href]) => `<a href="${href}">${escapeHtml(label)}</a>`).join('')}</nav></div></header>`
}

function footer() {
  return `<footer class="authority-footer"><div class="container-max authority-footer__grid"><div class="authority-footer__brand"><img src="${media.logo.fallback}" alt="${escapeHtml(media.logo.alt)}"><p>Informations générales : aucun contenu ne remplace un examen clinique.</p></div><div><h2>Soins principaux</h2><nav aria-label="Soins principaux"><a href="/implantologie/">Implant dentaire à Sète</a><a href="/orthodontie-invisible-sete/">Orthodontie invisible à Sète</a></nav></div><div><h2>Contact</h2><address>${escapeHtml(site.address.streetAddress)}<br>${site.address.postalCode} ${site.address.addressLocality}<a href="tel:${site.telephone}">${site.telephoneDisplay}</a></address></div></div></footer>`
}

function breadcrumbsHtml(route) {
  const items = routeBreadcrumbs(route)
  if (!items.length) return ''
  return `<nav aria-label="Fil d’Ariane" class="content-breadcrumb">${items.map((item, index) => `${index ? '<span>/</span>' : ''}${index < items.length - 1 ? `<a href="${new URL(item.url).pathname}">${escapeHtml(item.name)}</a>` : `<span aria-current="page">${escapeHtml(item.name)}</span>`}`).join('')}</nav>`
}

function responsiveImage(asset, eager = false) {
  return `<figure><picture><source type="image/avif" srcset="${asset.sources.avif}" sizes="${asset.sizes || '100vw'}"><source type="image/webp" srcset="${asset.sources.webp}" sizes="${asset.sizes || '100vw'}"><img src="${asset.fallback}" alt="${escapeHtml(asset.alt)}" width="${asset.width}" height="${asset.height}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"></picture></figure>`
}

function shell(route, content) {
  return `${header(route)}<main id="main-content" class="public-main--internal">${content}</main>${footer()}`
}

function corePage(route) {
  const details = {
    home: {
      eyebrow: 'Cabinet dentaire à Sète',
      intro: 'Implantologie, orthodontie invisible et soins dentaires avec un bilan précis, des explications claires et un suivi au cabinet.',
      sections: [
        ['Implant dentaire à Sète', 'Étudier une dent manquante, les alternatives, la chirurgie, la cicatrisation et la maintenance.', '/implantologie/'],
        ['Orthodontie invisible à Sète', 'Examiner l’indication, le port des aligneurs, les limites et la contention.', '/orthodontie-invisible-sete/'],
        ['Soins dentaires', 'Prévenir, conserver, restaurer et orienter les demandes urgentes selon la situation.', '/services/'],
        ['Votre premier bilan', 'Écouter, examiner, expliquer les options et organiser le suivi.', '/contact/'],
      ],
    },
    about: { eyebrow: 'Le praticien et le cabinet', intro: 'Parcours universitaire, qualifications déclarées et approche clinique du Dr Abdessamed Abdessadok.', sections: site.qualifications.map((item) => ['Qualification', item]) },
    services: { eyebrow: 'Les soins du cabinet', intro: 'Chaque parcours commence par un bilan clinique et une discussion des alternatives.', sections: [['Implant dentaire', 'Évaluation d’une dent manquante et des solutions de remplacement.', '/implantologie/'], ['Orthodontie invisible', 'Étude de l’alignement, de l’occlusion et des aligneurs.', '/orthodontie-invisible-sete/'], ['Soins dentaires', 'Prévention, soins conservateurs, prothèses et urgences.']] },
    gallery: { eyebrow: 'Parcours en images', intro: 'Des scènes pédagogiques autour des consultations, de l’implantologie et des aligneurs pour mieux comprendre chaque parcours.', sections: [['Consultation', 'Écouter et expliquer avant de proposer une option.'], ['Implantologie', 'Visualiser les solutions de remplacement et les étapes du parcours.'], ['Orthodontie invisible', 'Comprendre le scanner, le port des aligneurs et le suivi.'], ['Technologie', 'Présenter les outils numériques sans garantie de résultat.']] },
    contact: { eyebrow: 'Nous joindre', intro: `${site.address.streetAddress}, ${site.address.postalCode} ${site.address.addressLocality}. Téléphone : ${site.telephoneDisplay}.`, sections: [['Adresse et accès', 'Rez-de-chaussée, au centre de Sète.'], ['Horaires', 'Lundi, mardi, jeudi et vendredi : 08:00–12:00 et 14:00–17:00. Mercredi : 08:00–12:00.'], ['Message non urgent', 'Ne transmettez pas de données médicales sensibles par le formulaire.']] },
    preAppointment: { eyebrow: 'Pré-rendez-vous téléphonique', intro: 'Un échange gratuit de 5 minutes pour déterminer votre besoin en implantologie ou en orthodontie invisible et vous orienter vers un rendez-vous adapté au cabinet.', sections: [['Choisissez votre besoin', 'Sélectionnez un pré-rendez-vous en implantologie ou en orthodontie invisible.'], ['Laissez vos coordonnées', 'Le cabinet utilise vos coordonnées uniquement pour répondre à la demande.']] },
  }[route.type]

  const hero = `<header class="page-hero"><div class="container-max page-hero__grid"><div><span class="section-kicker section-kicker--light">${escapeHtml(details.eyebrow)}</span><h1>${escapeHtml(route.h1)}</h1></div><p>${escapeHtml(details.intro)}</p></div></header>`
  const sections = `<section class="authority-section"><div class="container-max editorial-grid"><div class="editorial-grid__intro"><h2>Informations essentielles</h2><p>${escapeHtml(route.description)}</p></div><div class="editorial-list">${details.sections.map(([title, text, href]) => `<article><h3>${href ? `<a href="${href}">${escapeHtml(title)}</a>` : escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join('')}</div></div></section>`
  return shell(route, `${hero}${sections}`)
}

function localizedPage(route) {
  const nav = getLanguageNavigation(route.language)
  const asset = routeAsset(route)
  const hero = `<header class="localized-hero"><div class="container-max localized-hero__grid"><div><span class="section-kicker section-kicker--light">${escapeHtml(route.eyebrow)}</span><h1>${escapeHtml(route.h1)}</h1><p>${escapeHtml(route.intro)}</p><a class="btn-accent" href="${nav.paths.contact}">${escapeHtml(nav.labels.cta)}</a></div><div class="localized-hero__visual">${responsiveImage(asset, true)}</div></div></header>`
  const notice = `<aside class="language-disclosure"><div class="container-max"><strong>${escapeHtml(route.label)}</strong><p>${escapeHtml(route.notice)}</p></div></aside>`
  const sections = `<section class="authority-section localized-content"><div class="container-max"><div class="localized-content__grid">${route.sections.map((section, index) => `<article><span>${String(index + 1).padStart(2, '0')}</span><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.text)}</p>${section.linkType ? `<a href="${nav.paths[section.linkType]}">${escapeHtml(nav.labels.learn)} →</a>` : ''}</article>`).join('')}</div></div></section>`
  return shell(route, `${hero}${notice}${sections}`)
}

function contentPage(route) {
  const page = route.page
  const asset = routeAsset(route)
  const blocks = page.articleBody ? buildArticleBodyBlocks(page.articleBody) : []
  const hero = `<header class="content-hero"><div class="container-max">${breadcrumbsHtml(route)}<div class="content-hero__grid"><div class="content-hero__copy"><span class="section-kicker section-kicker--light">${escapeHtml(page.badge || 'Guide patient')}</span><h1>${escapeHtml(route.h1)}</h1><p>${escapeHtml(page.intro)}</p><div class="content-hero__actions"><a class="btn-accent" href="/pre-rendez-vous/">Demander un pré-rendez-vous</a><a class="btn-light" href="/contact/">Contacter le cabinet</a></div></div><div class="content-hero__visual">${responsiveImage(asset, true)}</div></div></div></header>`
  const reviewStatus = page.medicalReviewStatus === 'reviewed' && page.medicalReviewer
    ? `<strong>Relu par ${escapeHtml(page.medicalReviewer)}</strong>`
    : '<span>Information générale</span>'
  const review = route.type === 'article' ? `<div class="article-byline"><div class="container-max"><span>Par ${escapeHtml(page.authorName)}</span><span>Publié le ${escapeHtml(page.datePublished)}</span><span>Mis à jour le ${escapeHtml(page.dateModified)}</span>${reviewStatus}</div></div>` : ''
  const sections = blocks.length
    ? `<section class="article-section">${blocks.map((block) => block.type === 'heading2' ? `<h2>${escapeHtml(block.text)}</h2>` : block.type === 'heading3' ? `<h3>${escapeHtml(block.text)}</h3>` : block.type === 'list' ? `<ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : `<p>${escapeHtml(block.text)}</p>`).join('')}</section>`
    : (page.sections || []).map((section) => `<section class="article-section"><h2>${escapeHtml(section.heading)}</h2>${section.blocks.map((block) => `<div class="article-section__block">${block.subheading ? `<h3>${escapeHtml(block.subheading)}</h3>` : ''}${(block.paragraphs || []).map((text) => `<p>${escapeHtml(text)}</p>`).join('')}${block.bullets?.length ? `<ul>${block.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}</div>`).join('')}</section>`).join('')
  const faq = page.faq?.length ? `<section class="article-section faq-list"><h2>Questions fréquentes</h2>${page.faq.map((item) => `<details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join('')}</section>` : ''
  const disclosure = page.menuGroup === 'locals' ? '<aside class="content-disclosure"><strong>Le cabinet se situe à Sète.</strong><p>Cette page prépare votre venue depuis le Bassin de Thau et ne correspond pas à une adresse secondaire.</p></aside>' : ''
  const relatedRoutes = [...new Map((page.internalLinks || [])
    .map((url) => seoRoutes.find((item) => item.path === trailingSlash(url)))
    .filter((item) => item && item.path !== route.path && item.indexable !== false)
    .map((item) => [item.path, item])).values()].slice(0, 6)
  const related = relatedRoutes.length ? `<aside class="content-aside" aria-label="Ressources associées"><div><h2>Poursuivre votre lecture</h2>${relatedRoutes.map((item) => `<a href="${item.path}"><span>${escapeHtml(item.type === 'article' ? 'Guide' : 'Parcours')}</span><strong>${escapeHtml(item.h1)}</strong></a>`).join('')}</div></aside>` : ''
  const body = `<section class="authority-section content-main"><div class="container-max">${disclosure}<div class="content-layout"><article class="content-article"><section class="content-summary"><h2>À retenir</h2><ul>${(page.highlights || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>${sections}${faq}<section class="content-cta"><h2>${escapeHtml(page.ctaTitle)}</h2><p>${escapeHtml(page.ctaText)}</p><a class="btn-accent" href="${page.ctaHref || '/pre-rendez-vous/'}">${escapeHtml(page.ctaLabel)}</a></section></article>${related}</div></div></section>`
  return shell(route, `${hero}${review}${body}`)
}

function blogPage(route) {
  const articles = seoRoutes.filter((item) => item.type === 'article')
  return shell(route, `<header class="content-hero"><div class="container-max content-hero__copy"><span class="section-kicker section-kicker--light">Guides pour les patients</span><h1>${escapeHtml(route.h1)}</h1><p>${escapeHtml(route.description)}</p></div></header><section class="authority-section"><div class="container-max blog-card-grid">${articles.map((article) => `<article class="blog-card"><h2><a href="${article.path}">${escapeHtml(article.h1)}</a></h2><p>${escapeHtml(article.description)}</p><a href="${article.path}">Lire le guide →</a></article>`).join('')}</div></section>`)
}

function alternatesFor(route) {
  if (!route.pageType) return []
  return getAlternatesForPageType(route.pageType)
}

function replaceHead(template, route, options = {}) {
  const canonical = options.canonical === undefined ? routeUrl(route) : options.canonical
  const robots = options.robots || (route.indexable === false ? 'noindex,follow' : 'index,follow,max-image-preview:large')
  const schema = options.schema === undefined ? schemasFor(route) : options.schema
  const asset = routeAsset(route)
  let html = template
  html = html.replace(/<html([^>]*)lang=["'][^"']*["']/i, `<html$1lang="${route.language || 'fr'}"`)
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`)
  html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(route.description)}" data-static-seo="dedupe">`)
  html = html.replace(/\s*<meta property="og:[^"]+"[^>]*>/gi, '')
  html = html.replace(/\s*<meta name="twitter:[^"]+"[^>]*>/gi, '')
  html = html.replace(/\s*<link rel="canonical"[^>]*>/gi, '')
  html = html.replace(/\s*<link rel="alternate"[^>]*>/gi, '')
  html = html.replace(/\s*<meta name="robots"[^>]*>/gi, '')
  html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '')
  const alternates = alternatesFor(route)
  const tags = [
    canonical ? `<link rel="canonical" href="${canonical}" data-static-seo="dedupe">` : '',
    `<meta name="robots" content="${robots}" data-static-seo="dedupe">`,
    `<meta property="og:title" content="${escapeHtml(route.title)}" data-static-seo="dedupe">`,
    `<meta property="og:description" content="${escapeHtml(route.description)}" data-static-seo="dedupe">`,
    canonical ? `<meta property="og:url" content="${canonical}" data-static-seo="dedupe">` : '',
    `<meta property="og:type" content="${route.type === 'article' ? 'article' : 'website'}" data-static-seo="dedupe">`,
    `<meta property="og:image" content="${absoluteUrl(asset.fallback)}" data-static-seo="dedupe">`,
    `<meta property="og:image:alt" content="${escapeHtml(asset.alt)}" data-static-seo="dedupe">`,
    `<meta property="og:image:width" content="${asset.width}" data-static-seo="dedupe">`,
    `<meta property="og:image:height" content="${asset.height}" data-static-seo="dedupe">`,
    `<link rel="image_src" href="${absoluteUrl(asset.fallback)}">`,
    '<meta name="twitter:card" content="summary_large_image" data-static-seo="dedupe">',
    `<meta name="twitter:image" content="${absoluteUrl(asset.fallback)}" data-static-seo="dedupe">`,
    route.type === 'article' ? `<meta property="article:published_time" content="${escapeHtml(route.page.datePublished)}" data-static-seo="dedupe"><meta property="article:modified_time" content="${escapeHtml(route.page.dateModified)}" data-static-seo="dedupe">` : '',
    ...alternates.map((alternate) => `<link rel="alternate" hreflang="${alternate.language}" href="${absoluteUrl(alternate.href)}" data-static-seo="dedupe">`),
    alternates.length ? `<link rel="alternate" hreflang="x-default" href="${absoluteUrl('/')}" data-static-seo="dedupe">` : '',
    schema.length ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': schema })}</script>` : '',
  ].join('')
  return html.replace('</head>', `${tags}</head>`)
}

function injectBody(template, body) {
  return template.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${body}</div>`)
}

async function writeRoute(template, route) {
  const body = route.type === 'blog' ? blogPage(route) : route.language && route.language !== 'fr' ? localizedPage(route) : route.page ? contentPage(route) : corePage(route)
  const html = injectBody(replaceHead(template, route), body)
  const outputDir = route.path === '/' ? distDir : path.join(distDir, route.path.replace(/^\/+|\/+$/g, ''))
  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(path.join(outputDir, 'index.html'), html)
}

async function writePrivateShell(template, routePath) {
  const route = { title: 'Espace privé', description: 'Espace privé du cabinet.', path: routePath, indexable: false, type: 'private', h1: 'Espace privé', language: 'fr' }
  const html = injectBody(replaceHead(template, route, { canonical: null, robots: 'noindex,nofollow', schema: [] }), '')
  const outputDir = path.join(distDir, routePath.replace(/^\/+|\/+$/g, ''))
  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(path.join(outputDir, 'index.html'), html)
}

async function main() {
  const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8')
  for (const route of seoRoutes) await writeRoute(template, route)
  for (const route of ['/login/', '/admin/', '/admin/actualities/', '/legacy-actuality/']) await writePrivateShell(template, route)

  const notFound = { title: 'Page introuvable | Dr. Abdessadok', description: 'Cette page n’existe pas ou n’est plus disponible.', path: '/404/', h1: 'Cette page est introuvable.', type: 'notFound', indexable: false, language: 'fr' }
  const body = shell(notFound, '<section class="page-hero"><div class="container-max"><span class="section-kicker section-kicker--light">Erreur 404</span><h1>Cette page est introuvable.</h1><p>Retournez à l’accueil ou contactez le cabinet.</p><a href="/" class="btn-accent">Retour à l’accueil</a></div></section>')
  const html = injectBody(replaceHead(template, notFound, { canonical: null, robots: 'noindex,nofollow', schema: [] }), body)
  await fs.writeFile(path.join(distDir, '404.html'), html)
}

await main()
