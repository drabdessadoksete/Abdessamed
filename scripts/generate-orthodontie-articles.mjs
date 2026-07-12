import fs from 'node:fs/promises'
import path from 'node:path'

const sourcePath = path.resolve('Articles_Orthodontie_Sete_Complets.txt')
const outputPath = path.resolve('src/data/generatedOrthodontieArticles.js')

const logoImage = {
  src: '/seo-images/logo-cabinet-dentaire-sete.png',
  ogSrc: 'https://cabinetdentairesete.fr/seo-images/logo-cabinet-dentaire-sete.png',
  alt: 'Logo du Cabinet Dentaire Dr. Abdessadok à Sète',
}

const heroLogoImage = {
  src: '/seo-images/logo-hero-section.png',
  ogSrc: 'https://cabinetdentairesete.fr/seo-images/logo-hero-section.png',
  alt: 'Identité visuelle du Cabinet Dentaire Dr. Abdessadok à Sète',
}

const articleCrossLinks = {
  'orthodontie-sete-quand-consulter-alignement-dentaire': [
    '/blog/orthodontie-adulte-sete-questions-avant-traitement/',
    '/blog/orthodontie-invisible-sete-questions-avant-bilan/',
  ],
  'orthodontie-adulte-sete-questions-avant-traitement': [
    '/blog/orthodontie-invisible-adulte-30-40-50-ans/',
    '/blog/verite-invisalign-taquets-temps-port-gene/',
  ],
  'dents-chevauchees-espaces-visibles-correction-sete': [
    '/blog/orthodontie-sete-quand-consulter-alignement-dentaire/',
    '/blog/orthodontie-invisible-sete-questions-avant-bilan/',
  ],
  'dents-qui-rebougent-apres-appareil-sete': [
    '/blog/orthodontie-invisible-sete-questions-avant-bilan/',
    '/blog/premier-bilan-orthodontie-invisible-sete/',
  ],
  'orthodontie-bassin-de-thau-suivi-sete': [
    '/invisalign-bassin-de-thau/',
    '/blog/orthodontie-sete-quand-consulter-alignement-dentaire/',
  ],
  'orthodontie-invisible-sete-questions-avant-bilan': [
    '/blog/duree-orthodontie-invisible-sete/',
    '/blog/orthodontie-invisible-quotidien-repas-entretien-parole/',
    '/blog/premier-bilan-orthodontie-invisible-sete/',
  ],
  'invisalign-aligneurs-transparents-gouttieres-differences': [
    '/blog/orthodontie-invisible-sete-questions-avant-bilan/',
    '/invisalign/',
  ],
  'duree-orthodontie-invisible-sete': [
    '/blog/premier-bilan-orthodontie-invisible-sete/',
    '/blog/orthodontie-invisible-quotidien-repas-entretien-parole/',
  ],
  'orthodontie-invisible-quotidien-repas-entretien-parole': [
    '/blog/orthodontie-invisible-sete-questions-avant-bilan/',
    '/blog/duree-orthodontie-invisible-sete/',
  ],
  'orthodontie-invisible-adulte-30-40-50-ans': [
    '/blog/orthodontie-adulte-sete-questions-avant-traitement/',
    '/blog/orthodontie-invisible-sete-questions-avant-bilan/',
  ],
  'orthodontie-invisible-adolescent-sete': [
    '/blog/orthodontie-invisible-sete-questions-avant-bilan/',
    '/invisalign/',
  ],
  'premier-bilan-orthodontie-invisible-sete': [
    '/blog/orthodontie-invisible-sete-questions-avant-bilan/',
    '/orthodontie-invisible-sete/',
  ],
}

const menuLabels = {
  'orthodontie-sete-quand-consulter-alignement-dentaire': 'Quand consulter',
  'orthodontie-adulte-sete-questions-avant-traitement': 'Questions adulte',
  'dents-chevauchees-espaces-visibles-correction-sete': 'Chevauchement ou espaces',
  'dents-qui-rebougent-apres-appareil-sete': 'Dents qui rebougent',
  'orthodontie-bassin-de-thau-suivi-sete': 'Suivi Bassin de Thau',
  'orthodontie-invisible-sete-questions-avant-bilan': 'Avant un bilan',
  'invisalign-aligneurs-transparents-gouttieres-differences': 'Invisalign ou aligneurs',
  'duree-orthodontie-invisible-sete': 'Durée du traitement',
  'orthodontie-invisible-quotidien-repas-entretien-parole': 'Vie quotidienne',
  'orthodontie-invisible-adulte-30-40-50-ans': 'Invisible après 30 ans',
  'orthodontie-invisible-adolescent-sete': 'Invisible adolescent',
  'premier-bilan-orthodontie-invisible-sete': 'Premier bilan',
}

function clean(value = '') {
  return value.replace(/\r/g, '').trim()
}

function extract(pattern, text) {
  const match = text.match(pattern)
  return match ? clean(match[1]) : ''
}

function sectionBetween(text, startPattern, endPattern) {
  const start = text.search(startPattern)
  if (start === -1) return ''

  const startMatch = text.slice(start).match(startPattern)
  const contentStart = start + startMatch[0].length
  const rest = text.slice(contentStart)
  const endMatch = rest.match(endPattern)
  const contentEnd = endMatch ? contentStart + endMatch.index : text.length
  return clean(text.slice(contentStart, contentEnd))
}

function parseInternalLinks(text) {
  const block = sectionBetween(text, /3\. Suggested internal links\s*/u, /4\. Hero image prompt/u)
  const links = []
  const regex = /Vers\s+([^\n]+)\n\s*Emplacement naturel\s*:\s*([^\n]+)\n\s*Anchor text\s*:\s*([^\n]+)/gu
  for (const match of block.matchAll(regex)) {
    links.push({
      url: clean(match[1]),
      placement: clean(match[2]),
      anchor: clean(match[3]),
    })
  }
  return links
}

function parseFaq(text) {
  const block = sectionBetween(text, /6\. FAQ\s*/u, /7\. Final CTA/u)
  const units = block.split(/\n\s*\n/u).map(clean).filter(Boolean)
  const faq = []

  for (let i = 0; i < units.length; i += 2) {
    const question = units[i]
    const answer = units[i + 1] || ''
    if (question && answer) {
      faq.push({ question, answer: answer.replace(/\s*\n+\s*/gu, ' ') })
    }
  }

  return faq
}

function parseKeywords(text) {
  const primary = extract(/Primary keyword\s*:\s*([^\n]+)/u, text)
  const secondaryBlock = sectionBetween(text, /Secondary keyword ideas\s*:\s*/u, /Search intent\s*:/u)
  const secondary = secondaryBlock.split('\n').map(clean).filter(Boolean)
  return [primary, ...secondary].filter(Boolean)
}

function guessCategory(slug) {
  if (slug.includes('bassin-de-thau')) return 'Bassin de Thau / Suivi local'
  if (slug.includes('invisible') || slug.includes('invisalign') || slug.includes('gouttieres') || slug.includes('aligneurs')) {
    return 'Orthodontie invisible'
  }
  return 'Orthodontie'
}

function buildHighlights(category, slug) {
  if (category === 'Orthodontie invisible') {
    return [
      'Article de fond sur les aligneurs transparents et le bilan initial',
      'Ton prudent sur les indications, la durée et la vie quotidienne',
      slug.includes('adulte') ? 'Angle pensé pour les attentes des patients adultes' : 'Lecture utile avant une première consultation',
    ]
  }

  if (category === 'Bassin de Thau / Suivi local') {
    return [
      'Angle local Sète et Bassin de Thau',
      'Importance du suivi et de la proximité du cabinet',
      'Liens utiles vers les informations locales et les autres guides orthodontiques',
    ]
  }

  return [
    'Article long format centré sur les questions fréquentes avant un bilan',
    'Approche mesurée sur l’indication et la faisabilité du traitement',
    'Contenu pensé pour les patients de Sète et du Bassin de Thau',
  ]
}

function getPrimaryPillar(category) {
  return category === 'Orthodontie invisible' ? '/orthodontie-invisible-sete/' : '/orthodontie-sete/'
}

function stripLeadingTitle(body, title) {
  const normalizedBody = clean(body)
  const lines = normalizedBody.split('\n')
  if (clean(lines[0]) === clean(title)) {
    return clean(lines.slice(1).join('\n'))
  }
  return normalizedBody
}

function countWords(text) {
  return clean(text).split(/\s+/u).filter(Boolean).length
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function parseArticle(part) {
  const title = extract(/Final title\s*:\s*([^\n]+)/u, part)
  const slug = extract(/Slug\s*:\s*([^\n]+)/u, part)
  const seoTitle = extract(/SEO title\s*:\s*([^\n]+)/u, part)
  const metaDescription = extract(/Meta description\s*:\s*([^\n]+)/u, part)
  const h1 = extract(/Suggested H1\s*:\s*([^\n]+)/u, part) || title
  const excerpt = extract(/Suggested excerpt for blog card\s*:\s*([^\n]+)/u, part)
  const heroImagePrompt = sectionBetween(part, /4\. Hero image prompt\s*/u, /5\. Full article/u)
  const articleBody = stripLeadingTitle(sectionBetween(part, /5\. Full article\s*/u, /6\. FAQ/u), h1)
  const faq = parseFaq(part)
  const ctaText = sectionBetween(part, /7\. Final CTA\s*/u, /(?:Récapitulatif final|Recapitulatif final|ARTICLE \d+)/u)
  const internalLinkSuggestions = parseInternalLinks(part)
  const category = guessCategory(slug)
  const keywords = parseKeywords(part)
  const primaryPillar = getPrimaryPillar(category)
  const internalLinks = unique([
    primaryPillar,
    ...internalLinkSuggestions.map((item) => item.url),
    ...(articleCrossLinks[slug] || []),
  ])

  return {
    url: `/blog/${slug}`,
    path: `blog/${slug}`,
    menuLabel: menuLabels[slug] || h1,
    menuDescription: excerpt,
    badge: category,
    title: seoTitle,
    metaDescription,
    h1,
    intro: excerpt,
    excerpt,
    category,
    cluster: 'orthodontie',
    highlights: buildHighlights(category, slug),
    articleBody,
    faq,
    ctaTitle: 'Demander un premier bilan au cabinet',
    ctaText,
    ctaLabel: 'Nous contacter',
    ctaHref: '/contact/',
    internalLinks,
    relatedReadingTitle: 'À lire aussi sur l’orthodontie et l’alignement dentaire',
    relatedReadingLinks: internalLinks.filter((url) => !['/contact/', '/about/'].includes(url)).slice(0, 5),
    keywords,
    image: logoImage,
    cardImage: logoImage,
    heroImage: heroLogoImage,
    heroImagePrompt,
    internalLinkSuggestions,
    wordCountApprox: countWords(articleBody),
  }
}

async function main() {
  const source = await fs.readFile(sourcePath, 'utf8')
  const parts = source.split(/ARTICLE \d+/u).slice(1).map(clean).filter(Boolean)
  const articles = parts.map(parseArticle)

  const fileContent = `export const generatedOrthodontieArticles = ${JSON.stringify(articles, null, 2)}\n`
  const current = await fs.readFile(outputPath, 'utf8').catch(() => '')
  if (current !== fileContent) await fs.writeFile(outputPath, fileContent)
  console.log(`Generated ${articles.length} orthodontie articles in ${path.relative(process.cwd(), outputPath)}`)
}

await main()
