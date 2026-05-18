import fs from 'node:fs/promises'
import path from 'node:path'

const sourcePath = path.resolve('pages_piliers_orthodontie_sete.txt')
const outputPath = path.resolve('src/data/generatedOrthodontiePillars.js')

const heroImage = {
  src: '/seo-images/logo-hero-section.png',
  ogSrc: 'https://cabinetdentairesete.fr/seo-images/logo-hero-section.png',
  alt: 'Identité visuelle du Cabinet Dentaire Dr. Abdessadok à Sète',
}

const cardImage = {
  src: '/seo-images/logo-cabinet-dentaire-sete.png',
  ogSrc: 'https://cabinetdentairesete.fr/seo-images/logo-cabinet-dentaire-sete.png',
  alt: 'Logo du Cabinet Dentaire Dr. Abdessadok à Sète',
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

function countWords(text) {
  return clean(text).split(/\s+/u).filter(Boolean).length
}

function stripBody(body) {
  return clean(
    body
      .replace(/^# .+\n+/u, '')
      .replace(/^\*\*CTA[^\n]*\n?/gmu, '')
      .replace(/^\*\*Lien [^\n]*\n?/gmu, '')
      .replace(/^\*\*Ancre suggérée[^\n]*\n?/gmu, '')
      .replace(/\n---\n/gu, '\n\n')
      .replace(/\n## À lire aussi[\s\S]*?(?=\n## [^\n]+)/u, '\n')
      .replace(/\n---\s*$/u, '')
      .replace(/\n{3,}/gu, '\n\n'),
  )
}

function parseFaq(section) {
  const items = []
  const matches = [...section.matchAll(/###\s+([^\n]+)\n+([\s\S]*?)(?=\n###\s+|$)/gu)]
  for (const match of matches) {
    items.push({
      question: clean(match[1]),
      answer: clean(match[2]).replace(/\n---\s*$/u, '').replace(/\n+/gu, ' '),
    })
  }
  return items
}

function parseCtaSections(section, pageKey) {
  const blocks = [...section.matchAll(/###\s+([^\n]+)\n+([\s\S]*?)(?=\n###\s+|$)/gu)]
  return blocks
    .map((match) => {
      const heading = clean(match[1])
      const raw = clean(match[2])
      const buttons = [...raw.matchAll(/\*\*Bouton(?: [^:*]+)?\s*:\*\*\s*([^\n]+)/gu)].map((buttonMatch) => {
        const label = clean(buttonMatch[1])
        let href = '/contact'
      if (/prix/iu.test(label)) href = '/prix-orthodontie-invisible-sete'
      else if (/orthodontie invisible/iu.test(label)) href = '/orthodontie-invisible-sete'
      else if (/orthodontie à sète|orthodontie a sete/iu.test(label)) href = '/orthodontie-sete'
      return { label, href }
    })
    const text = clean(raw.replace(/\*\*Bouton(?: [^:*]+)?\s*:\*\*\s*[^\n]+/gu, '').replace(/\*\*(.*?)\*\*/gu, '$1').replace(/^##\s+/gmu, '')).replace(/\n+/gu, ' ')

      return {
        heading,
        text,
        buttons,
        tone: pageKey === 'general' ? 'emerald' : 'gold',
      }
    })
    .filter((block) => !/^CTA final$/iu.test(block.heading))
}

function parsePage(block, config) {
  const h1 = extract(/\*\*Suggested H1\*\*\s*:\s*([^\n]+)/u, block)
  const excerpt = extract(/\*\*Suggested excerpt for blog\/card if reused elsewhere\*\*\s*:\s*([^\n]+)/u, block)
  const body = stripBody(sectionBetween(block, /## 5\. Full visible page copy\s*/u, /## 6\. FAQ/u))
  const faqSection = sectionBetween(block, /## 6\. FAQ\s*/u, /## 7\. CTA sections/u)
  const ctaSection = sectionBetween(block, /## 7\. CTA sections\s*/u, /## 8\. Internal linking recommendations/u)
  const heroPrompt = sectionBetween(block, /## 10\. Suggested hero image prompt\s*/u, /(?:# PAGE|# RÉCAPITULATIF FINAL)/u)

  return {
    url: config.url,
    path: config.url.replace(/^\//u, ''),
    menuGroup: 'pillars',
    menuLabel: config.menuLabel,
    menuDescription: excerpt,
    badge: config.badge,
    title: config.title,
    metaDescription: config.metaDescription,
    h1,
    intro: excerpt,
    excerpt,
    highlights: config.highlights,
    articleBody: body,
    faq: parseFaq(faqSection),
    ctaSections: parseCtaSections(ctaSection, config.pageKey),
    ctaTitle: config.finalCtaTitle,
    ctaText: config.finalCtaText,
    ctaLabel: config.finalCtaLabel,
    ctaHref: '/contact',
    internalLinks: config.internalLinks,
    relatedReadingTitle: 'À lire aussi sur l’orthodontie et l’alignement dentaire',
    relatedReadingLinks: config.relatedReadingLinks,
    keywords: config.keywords,
    heroActions: config.heroActions,
    image: cardImage,
    heroImage,
    heroImagePrompt: heroPrompt,
    wordCountApprox: countWords(body),
  }
}

async function main() {
  const source = await fs.readFile(sourcePath, 'utf8')
  const page1Block = sectionBetween(source, /# PAGE 1 — ORTHODONTIE À SÈTE\s*/u, /# PAGE 2 — ORTHODONTIE INVISIBLE À SÈTE/u)
  const page2Block = sectionBetween(source, /# PAGE 2 — ORTHODONTIE INVISIBLE À SÈTE\s*/u, /# RÉCAPITULATIF FINAL/u)

  const pages = [
    parsePage(page1Block, {
      pageKey: 'general',
      url: '/orthodontie-sete',
      menuLabel: 'Orthodontie à Sète',
      badge: 'Page pilier orthodontie',
      title: 'Orthodontie à Sète : alignement dentaire et bilan | Dr. Abdessadok',
      metaDescription:
        'Vous vous interrogez sur l’alignement de vos dents ? Découvrez quand consulter pour une orthodontie à Sète, quelles questions poser et comment se déroule un premier bilan.',
      highlights: [
        'Page pilier générale sur l’alignement dentaire à Sète',
        'Repères concrets sur chevauchement, espaces, récidive et orthodontie adulte',
        'Pont naturel vers l’orthodontie invisible lorsque cette option mérite discussion',
      ],
      finalCtaTitle: 'Vous vous interrogez sur votre alignement dentaire à Sète ?',
      finalCtaText:
        'Dents chevauchées, espace visible, récidive après un ancien appareil ou simple doute sur votre sourire : un premier bilan permet de faire le point avec prudence sur ce qui mérite réellement d’être discuté.',
      finalCtaLabel: 'Demander un bilan',
      internalLinks: [
        '/orthodontie-invisible-sete',
        '/contact',
        '/about',
        '/prix-orthodontie-invisible-sete',
        '/blog/orthodontie-sete-quand-consulter-alignement-dentaire',
        '/blog/orthodontie-adulte-sete-questions-avant-traitement',
        '/blog/dents-chevauchees-espaces-visibles-correction-sete',
        '/blog/dents-qui-rebougent-apres-appareil-sete',
        '/blog/orthodontie-bassin-de-thau-suivi-sete',
      ],
      relatedReadingLinks: [
        '/blog/orthodontie-sete-quand-consulter-alignement-dentaire',
        '/blog/orthodontie-adulte-sete-questions-avant-traitement',
        '/blog/dents-chevauchees-espaces-visibles-correction-sete',
        '/blog/dents-qui-rebougent-apres-appareil-sete',
        '/blog/orthodontie-bassin-de-thau-suivi-sete',
      ],
      keywords: [
        'orthodontie sete',
        'orthodontie a sete',
        'orthodontie bassin de thau',
        'orthodontie adulte sete',
        'alignement dentaire sete',
      ],
      heroActions: [
        { label: 'Demander un bilan', href: '/contact', variant: 'primary' },
        { label: 'Prendre contact avec le cabinet', href: '/contact', variant: 'secondary' },
        { label: 'Découvrir l’orthodontie invisible à Sète', href: '/orthodontie-invisible-sete', variant: 'ghost' },
      ],
    }),
    parsePage(page2Block, {
      pageKey: 'invisible',
      url: '/orthodontie-invisible-sete',
      menuLabel: 'Orthodontie invisible Sète',
      badge: 'Page pilier orthodontie invisible',
      title: 'Orthodontie invisible à Sète : aligneurs et bilan | Dr. Abdessadok',
      metaDescription:
        'Découvrez l’orthodontie invisible à Sète : aligneurs transparents, bilan, suivi, durée, quotidien et questions utiles avant de prendre rendez-vous.',
      highlights: [
        'Page pilier centrale sur les aligneurs transparents à Sète',
        'Réponses claires sur bilan, quotidien, durée, adultes et adolescents',
        'Maillage fort vers le prix, le suivi local et le cluster d’articles dédiés',
      ],
      finalCtaTitle: 'Vous pensez à une orthodontie invisible à Sète ?',
      finalCtaText:
        'Aligneurs transparents, récidive après un ancien appareil, gêne liée à l’alignement ou simple besoin d’un avis : un premier bilan permet de poser les bonnes questions avant de se lancer.',
      finalCtaLabel: 'Prendre rendez-vous',
      internalLinks: [
        '/orthodontie-sete',
        '/prix-orthodontie-invisible-sete',
        '/contact',
        '/about',
        '/blog/orthodontie-invisible-sete-questions-avant-bilan',
        '/blog/invisalign-aligneurs-transparents-gouttieres-differences',
        '/blog/duree-orthodontie-invisible-sete',
        '/blog/orthodontie-invisible-quotidien-repas-entretien-parole',
        '/blog/orthodontie-invisible-adulte-30-40-50-ans',
        '/blog/orthodontie-invisible-adolescent-sete',
        '/blog/premier-bilan-orthodontie-invisible-sete',
      ],
      relatedReadingLinks: [
        '/blog/orthodontie-invisible-sete-questions-avant-bilan',
        '/blog/invisalign-aligneurs-transparents-gouttieres-differences',
        '/blog/duree-orthodontie-invisible-sete',
        '/blog/orthodontie-invisible-quotidien-repas-entretien-parole',
        '/blog/orthodontie-invisible-adulte-30-40-50-ans',
        '/blog/orthodontie-invisible-adolescent-sete',
        '/blog/premier-bilan-orthodontie-invisible-sete',
      ],
      keywords: [
        'orthodontie invisible sete',
        'invisalign sete',
        'aligneurs transparents sete',
        'gouttieres invisibles sete',
        'orthodontie invisible adulte sete',
        'orthodontie invisible bassin de thau',
      ],
      heroActions: [
        { label: 'Demander un bilan', href: '/contact', variant: 'primary' },
        { label: 'Prendre rendez-vous', href: '/contact', variant: 'secondary' },
        { label: 'Voir le prix de l’orthodontie invisible', href: '/prix-orthodontie-invisible-sete', variant: 'ghost' },
      ],
    }),
  ]

  await fs.writeFile(outputPath, `export const generatedOrthodontiePillars = ${JSON.stringify(pages, null, 2)}\n`)
  console.log(`Generated ${pages.length} orthodontie pillar pages in ${path.relative(process.cwd(), outputPath)}`)
}

await main()
