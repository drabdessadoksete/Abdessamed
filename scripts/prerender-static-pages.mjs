import fs from 'node:fs/promises'
import path from 'node:path'
import { blogPages, servicePages } from '../src/data/seoContent.js'

const distDir = path.resolve('dist')
const siteUrl = 'https://cabinetdentairesete.fr'

function escapeHtml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function normalizeAssetPaths(html) {
  return html
    .replaceAll('href="./assets/', 'href="/assets/')
    .replaceAll('src="./assets/', 'src="/assets/')
    .replaceAll('href="./favicon', 'href="/favicon')
    .replaceAll('href="./android-chrome', 'href="/android-chrome')
    .replaceAll('href="./apple-touch-icon', 'href="/apple-touch-icon')
    .replaceAll('href="./site.webmanifest', 'href="/site.webmanifest')
    .replaceAll('src="./seo-images/', 'src="/seo-images/')
    .replaceAll('href="./seo-images/', 'href="/seo-images/')
}

function getPrimaryImage(page) {
  if (page.url.includes('implant') || page.url.includes('aligner-dents-avant-implant')) {
    return {
      src: '/seo-images/implantologie-biotech-sete.png',
      alt: "Visuel d'implantologie dentaire BioTech a Sete pour illustrer la page du Dr Abdessadok",
    }
  }

  if (page.url.includes('prix')) {
    return {
      src: '/seo-images/sourire-esthetique-sete.jpg',
      alt: "Sourire harmonieux illustre pour une page sur le prix de l'orthodontie invisible a Sete",
    }
  }

  if (page.url.includes('bassin-de-thau') || page.url.includes('balaruc') || page.url === '/blog') {
    return {
      src: '/seo-images/dr-abdessadok-sete.jpg',
      alt: 'Portrait du Dr Abdessadok au cabinet dentaire de Sete',
    }
  }

  if (page.url.includes('blog')) {
    return {
      src: '/seo-images/invisalign-sete.png',
      alt: "Aligneurs transparents Invisalign pour illustrer un article d'orthodontie invisible a Sete",
    }
  }

  if (page.url.includes('invisalign') || page.url.includes('orthodontie')) {
    return {
      src: '/seo-images/invisalign-sete.png',
      alt: "Visuel d'orthodontie invisible Invisalign pour la page du cabinet dentaire a Sete",
    }
  }

  return {
    src: '/seo-images/logo-cabinet-dentaire-sete.png',
    alt: 'Logo du cabinet dentaire Dr Abdessadok a Sete',
  }
}

function renderHeader() {
  return `
    <header class="sticky top-0 z-50 backdrop-blur navbar-gold border-b border-slate-800">
      <div class="container-max flex items-center justify-between h-14 md:h-16">
        <a href="/" class="flex items-center gap-2 min-w-0">
          <img src="/android-chrome-192x192.png" alt="Logo Cabinet Dentaire Dr Abdessadok" class="h-8 w-8 rounded-full object-cover" />
          <span class="font-bold text-sm sm:text-base truncate">Dr. Abdessadok</span>
        </a>
        <nav class="hidden md:flex items-center gap-4 text-sm">
          <a href="/" class="hover:text-rolexGold transition">Accueil</a>
          <a href="/about" class="hover:text-rolexGold transition">A propos</a>
          <a href="/services" class="hover:text-rolexGold transition">Services</a>
          <a href="/blog" class="hover:text-rolexGold transition">Blog</a>
          <a href="/gallery" class="hover:text-rolexGold transition">Galerie</a>
          <a href="/contact" class="hover:text-rolexGold transition">Contact</a>
        </nav>
      </div>
    </header>
  `
}

function renderRelatedLinks(urls = []) {
  const lookup = new Map([...servicePages, ...blogPages].map((page) => [page.url, page]))
  const items = urls
    .map((url) => lookup.get(url))
    .filter(Boolean)
    .map(
      (page) => `
        <a href="${page.url}" class="block rounded-2xl border border-rolexGold/20 bg-rolexGreen/10 p-4 hover:bg-rolexGreen/20 transition">
          <div class="font-semibold">${escapeHtml(page.menuLabel || page.h1)}</div>
          <div class="text-sm text-slate-300 mt-1">${escapeHtml(page.menuDescription || page.metaDescription)}</div>
        </a>
      `,
    )

  if (!items.length) return ''

  return `
    <aside class="card p-6 mt-8">
      <h2 class="text-xl font-bold mb-4">Pages a consulter</h2>
      <div class="space-y-3">
        ${items.join('')}
      </div>
    </aside>
  `
}

function renderFaq(page) {
  return `
    <section class="card p-6 md:p-8 mt-8">
      <h2 class="text-2xl md:text-3xl font-bold mb-6">Questions frequentes</h2>
      <div class="space-y-4">
        ${page.faq
          .map(
            (item) => `
              <details class="rounded-2xl border border-rolexGold/20 bg-rolexGreen/10 p-5">
                <summary class="cursor-pointer font-semibold">${escapeHtml(item.question)}</summary>
                <p class="mt-3 text-slate-300 leading-7">${escapeHtml(item.answer)}</p>
              </details>
            `,
          )
          .join('')}
      </div>
    </section>
  `
}

function renderPage(page) {
  const image = getPrimaryImage(page)
  const firstSections = page.sections.slice(0, 3)

  return `
    ${renderHeader()}
    <main class="overflow-x-hidden">
      <section class="section">
        <div class="container-max">
          <div class="rounded-[2rem] border border-rolexGold/30 bg-gradient-to-br from-rolexGreen/35 via-surface to-background p-8 md:p-12 shadow-soft">
            <div class="badge mb-4">${escapeHtml(page.badge)}</div>
            <h1 class="text-4xl md:text-5xl font-extrabold mb-6 max-w-5xl">${escapeHtml(page.h1)}</h1>
            <p class="text-lg text-slate-200 max-w-4xl leading-8">${escapeHtml(page.intro)}</p>
            <figure class="mt-8 overflow-hidden rounded-[2rem] border border-rolexGold/20 bg-rolexGreen/10">
              <img src="${image.src}" alt="${escapeHtml(image.alt)}" class="w-full h-[260px] md:h-[380px] object-cover" />
            </figure>
            <div class="grid md:grid-cols-3 gap-4 mt-8">
              ${page.highlights
                .map(
                  (item) => `
                    <div class="card p-5 bg-rolexGreen/20 border-rolexGold/20">
                      <div class="text-sm leading-7">${escapeHtml(item)}</div>
                    </div>
                  `,
                )
                .join('')}
            </div>
          </div>

          <div class="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 mt-10 items-start">
            <div class="space-y-8">
              ${firstSections
                .map(
                  (section) => `
                    <section class="card p-6 md:p-8">
                      <h2 class="text-2xl md:text-3xl font-bold mb-6">${escapeHtml(section.heading)}</h2>
                      <div class="space-y-6">
                        ${section.blocks
                          .map(
                            (block) => `
                              <div>
                                ${block.subheading ? `<h3 class="text-xl font-semibold mb-3">${escapeHtml(block.subheading)}</h3>` : ''}
                                <div class="space-y-4 text-slate-300 leading-8">
                                  ${(block.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
                                </div>
                                ${
                                  block.bullets?.length
                                    ? `
                                      <ul class="mt-4 space-y-3 text-slate-200">
                                        ${block.bullets
                                          .map(
                                            (bullet) => `
                                              <li class="flex items-start gap-3">
                                                <span class="mt-2 h-2.5 w-2.5 rounded-full bg-rolexGold shrink-0"></span>
                                                <span>${escapeHtml(bullet)}</span>
                                              </li>
                                            `,
                                          )
                                          .join('')}
                                      </ul>
                                    `
                                    : ''
                                }
                              </div>
                            `,
                          )
                          .join('')}
                      </div>
                    </section>
                  `,
                )
                .join('')}

              ${renderFaq(page)}

              <section class="rounded-[2rem] border border-rolexGold/30 bg-rolexGold/10 p-6 md:p-8">
                <h2 class="text-2xl md:text-3xl font-bold mb-4">${escapeHtml(page.ctaTitle)}</h2>
                <p class="text-slate-200 leading-8 mb-6">${escapeHtml(page.ctaText)}</p>
                <a href="/contact" class="btn-primary">${escapeHtml(page.ctaLabel)}</a>
              </section>
            </div>

            <div class="lg:sticky lg:top-24">
              ${renderRelatedLinks(page.internalLinks)}
            </div>
          </div>
        </div>
      </section>
    </main>
  `
}

function renderBlogHub() {
  return `
    ${renderHeader()}
    <main class="overflow-x-hidden">
      <section class="section">
        <div class="container-max">
          <div class="rounded-[2rem] border border-rolexGold/30 bg-gradient-to-br from-rolexGreen/35 via-surface to-background p-8 md:p-12 shadow-soft">
            <div class="badge mb-4">Blog d'autorite</div>
            <h1 class="text-4xl md:text-5xl font-extrabold mb-6">Blog dentaire a Sete : orthodontie invisible, prix et implantologie</h1>
            <p class="text-lg text-slate-200 max-w-4xl leading-8">
              Cette rubrique rassemble les contenus publies pour accompagner les recherches des patients autour d'Invisalign,
              de l'orthodontie invisible, du prix du traitement et du lien entre alignement dentaire et implantologie.
            </p>
            <figure class="mt-8 overflow-hidden rounded-[2rem] border border-rolexGold/20 bg-rolexGreen/10">
              <img src="/seo-images/dr-abdessadok-sete.jpg" alt="Portrait du Dr Abdessadok au cabinet dentaire de Sete" class="w-full h-[260px] md:h-[380px] object-cover" />
            </figure>
          </div>

          <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
            ${blogPages
              .map(
                (page) => `
                  <a href="${page.url}" class="card p-6 hover:-translate-y-1 transition">
                    <div class="badge mb-4">${escapeHtml(page.badge)}</div>
                    <h2 class="text-2xl font-bold mb-3">${escapeHtml(page.h1)}</h2>
                    <p class="text-slate-300 leading-7 mb-6">${escapeHtml(page.intro)}</p>
                    <span class="text-rolexGold font-semibold">Lire l'article</span>
                  </a>
                `,
              )
              .join('')}
          </div>
        </div>
      </section>
    </main>
  `
}

function renderHomeFallback() {
  return `
    ${renderHeader()}
    <main class="overflow-x-hidden">
      <section class="section">
        <div class="container-max">
          <div class="rounded-[2rem] border border-rolexGold/30 bg-gradient-to-br from-rolexGreen/35 via-surface to-background p-8 md:p-12 shadow-soft">
            <div class="badge mb-4">Cabinet dentaire a Sete</div>
            <h1 class="text-4xl md:text-5xl font-extrabold mb-6 max-w-5xl">Cabinet Dentaire Dr. Abdessadok : Invisalign, implantologie et soins a Sete</h1>
            <p class="text-lg text-slate-200 max-w-4xl leading-8">
              Cabinet dentaire a Sete proposant orthodontie invisible, implantologie BioTech et contenus d'information pour les patients de Sete, Meze, Frontignan, Agde, Marseillan, Balaruc-les-Bains et du Bassin de Thau.
            </p>
            <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
              ${[
                ...servicePages.slice(0, 9),
                { url: '/blog', h1: 'Blog dentaire a Sete', intro: "Questions frequentes sur l'orthodontie invisible, le prix et la rehabilitation du sourire." },
                { url: '/contact', h1: 'Contacter le cabinet', intro: 'Prendre rendez-vous ou demander un premier bilan au cabinet dentaire de Sete.' },
              ]
                .map(
                  (page) => `
                    <a href="${page.url}" class="card p-6 hover:-translate-y-1 transition">
                      <h2 class="text-2xl font-bold mb-3">${escapeHtml(page.h1)}</h2>
                      <p class="text-slate-300 leading-7">${escapeHtml(page.intro)}</p>
                    </a>
                  `,
                )
                .join('')}
            </div>
          </div>
        </div>
      </section>
    </main>
  `
}

function replaceHead(template, metadata) {
  let html = template
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(metadata.title)}</title>`)
  html = html.replace(
    /<meta name="description" content="[^"]*" data-rh="true">/i,
    `<meta name="description" content="${escapeHtml(metadata.description)}" data-rh="true">`,
  )
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/i,
    `<meta property="og:title" content="${escapeHtml(metadata.ogTitle || metadata.title)}" />`,
  )
  html = html.replace(
    /<meta property="og:description" content="[^"]*" \/>/i,
    `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`,
  )
  html = html.replace(
    /<meta property="og:url" content="[^"]*" \/>/i,
    `<meta property="og:url" content="${metadata.url}" />`,
  )

  if (html.includes('<meta property="og:image"')) {
    html = html.replace(/<meta property="og:image" content="[^"]*" \/>/i, `<meta property="og:image" content="${metadata.image}" />`)
  } else {
    html = html.replace('<meta property="og:site_name" content="cabinetdentairesete" />', `<meta property="og:site_name" content="cabinetdentairesete" />\n    <meta property="og:image" content="${metadata.image}" />`)
  }

  const canonicalTag = `<link rel="canonical" href="${metadata.url}" />`
  if (html.includes('rel="canonical"')) {
    html = html.replace(/<link rel="canonical" href="[^"]*" \/>/i, canonicalTag)
  } else {
    html = html.replace('<link rel="manifest" href="/site.webmanifest" />', `<link rel="manifest" href="/site.webmanifest" />\n    ${canonicalTag}`)
  }

  const robotsTag = '<meta name="robots" content="index,follow,max-image-preview:large" />'
  if (html.includes('<meta name="robots"')) {
    html = html.replace(/<meta name="robots" content="[^"]*" \/>/i, robotsTag)
  } else {
    html = html.replace(canonicalTag, `${canonicalTag}\n    ${robotsTag}`)
  }

  return html
}

function injectBody(template, bodyHtml) {
  return template.replace(
    /<div id="root">.*?<\/div>/s,
    `<div id="root">${bodyHtml}</div>`,
  )
}

async function writeRoute(template, routePath, metadata, bodyHtml) {
  let html = normalizeAssetPaths(template)
  html = replaceHead(html, metadata)
  html = injectBody(html, bodyHtml)

  const outputDir = routePath === '/' ? distDir : path.join(distDir, routePath.replace(/^\/+/, ''))
  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(path.join(outputDir, 'index.html'), html)
}

async function main() {
  const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8')
  const allPages = [...servicePages, ...blogPages]

  await writeRoute(
    template,
    '/',
    {
      title: 'Cabinet Dentaire Dr. Abdessadok | Invisalign, implantologie et soins a Sete',
      description:
        "Cabinet dentaire a Sete : Invisalign, implantologie BioTech et pages d'information pour les patients du Bassin de Thau.",
      url: `${siteUrl}/`,
      image: `${siteUrl}/seo-images/dr-abdessadok-sete.jpg`,
    },
    renderHomeFallback(),
  )

  await writeRoute(
    template,
    '/blog',
    {
      title: 'Blog dentaire Sete : orthodontie invisible, prix et implantologie',
      description:
        "Blog dentaire du cabinet a Sete : taquets Invisalign, prix de l'orthodontie invisible et relation entre alignement dentaire et implantologie.",
      url: `${siteUrl}/blog`,
      image: `${siteUrl}/seo-images/dr-abdessadok-sete.jpg`,
    },
    renderBlogHub(),
  )

  for (const page of allPages) {
    const image = getPrimaryImage(page)
    await writeRoute(
      template,
      page.url,
      {
        title: page.title,
        description: page.metaDescription,
        url: `${siteUrl}${page.url}`,
        image: `${siteUrl}${image.src}`,
      },
      renderPage(page),
    )
  }
}

await main()
