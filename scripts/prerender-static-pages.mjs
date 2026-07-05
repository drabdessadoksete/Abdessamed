import fs from 'node:fs/promises'
import path from 'node:path'
import { blogPages, servicePages } from '../src/data/seoContent.js'
import { buildArticleBodyBlocks } from '../src/utils/seoArticleContent.js'

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
  if (page.heroImage?.src) {
    return {
      src: page.heroImage.src,
      alt: page.heroImage.alt || 'Illustration de la page du Cabinet Dentaire Dr. Abdessadok à Sète',
    }
  }

  if (page.image?.src) {
    return {
      src: page.image.src,
      alt: page.image.alt || 'Illustration de la page du Cabinet Dentaire Dr. Abdessadok à Sète',
    }
  }

  if (page.url.includes('implant') || page.url.includes('aligner-dents-avant-implant')) {
    return {
      src: '/seo-images/implantologie-biotech-sete.png',
      alt: "Visuel d'implantologie dentaire BioTech a Sete pour illustrer la page du Dr Abdessadok",
    }
  }

  if (page.url.includes('prix')) {
    return {
      src: '/seo-images/logo-hero-section.png',
      alt: 'Identité visuelle du Cabinet Dentaire Dr. Abdessadok à Sète',
    }
  }

  if (page.url.includes('bassin-de-thau') || page.url.includes('balaruc') || page.url === '/blog') {
    return {
      src: '/seo-images/logo-hero-section.png',
      alt: 'Identité visuelle du Cabinet Dentaire Dr. Abdessadok à Sète',
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
    <header class="site-navbar site-navbar--solid">
      <div class="container-max flex h-16 items-center justify-between lg:h-[4.5rem]">
        <a href="/" class="nav-wordmark flex items-center gap-3 min-w-0">
          <span class="navbar-logo-orbit"><img src="/android-chrome-192x192.png" alt="" /></span>
          <span class="font-black text-sm sm:text-base truncate">Dr. Abdessadok</span>
        </a>
        <nav class="hidden lg:flex items-center gap-4 text-sm font-bold">
          <a href="/" class="hover:text-rolexGold transition">Accueil</a>
          <a href="/about" class="hover:text-rolexGold transition">A propos</a>
          <a href="/services" class="hover:text-rolexGold transition">Services</a>
          <a href="/blog" class="hover:text-rolexGold transition">Blog</a>
          <a href="/gallery" class="hover:text-rolexGold transition">Galerie</a>
          <a href="/contact" class="hover:text-rolexGold transition">Contact</a>
          <a href="/pre-rendez-vous" class="btn-primary">Pré-rendez-vous</a>
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

function renderBreadcrumbs(page, type) {
  const items = [
    { label: 'Accueil', href: '/' },
    { label: type === 'blog' ? 'Blog' : 'Services', href: type === 'blog' ? '/blog' : '/services' },
    { label: page.h1, href: page.url },
  ]

  return `
    <nav aria-label="Fil d ariane" class="mb-5 text-sm text-slate-300">
      <ol class="flex flex-wrap items-center gap-2">
        ${items
          .map(
            (item, index) => `
              <li class="flex items-center gap-2">
                ${
                  index < items.length - 1
                    ? `<a href="${item.href}" class="hover:text-rolexGold transition">${escapeHtml(item.label)}</a>`
                    : `<span class="text-slate-100">${escapeHtml(item.label)}</span>`
                }
                ${index < items.length - 1 ? '<span class="text-slate-500">/</span>' : ''}
              </li>
            `,
          )
          .join('')}
      </ol>
    </nav>
  `
}

function renderArticleBody(page) {
  if (!page.articleBody) return ''

  const blocks = buildArticleBodyBlocks(page.articleBody)

  return `
    <section class="card p-6 md:p-8">
      <div class="space-y-5">
        ${blocks
          .map((block) => {
            if (block.type === 'heading2') {
              return `<h2 class="text-2xl md:text-3xl font-bold pt-2">${escapeHtml(block.text)}</h2>`
            }

            if (block.type === 'heading3') {
              return `<h3 class="text-xl md:text-2xl font-semibold pt-1">${escapeHtml(block.text)}</h3>`
            }

            if (block.type === 'list') {
              return `
                <ul class="space-y-3 text-slate-200">
                  ${block.items
                    .map(
                      (item) => `
                        <li class="flex items-start gap-3">
                          <span class="mt-2 h-2.5 w-2.5 rounded-full bg-rolexGold shrink-0"></span>
                          <span>${escapeHtml(item)}</span>
                        </li>
                      `,
                    )
                    .join('')}
                </ul>
              `
            }

            if (block.type === 'quote') {
              return `<blockquote class="rounded-2xl border border-rolexGold/20 bg-rolexGreen/10 p-5 text-slate-100 italic leading-8">${escapeHtml(block.text)}</blockquote>`
            }

            return `<p class="text-slate-300 leading-8">${escapeHtml(block.text)}</p>`
          })
          .join('')}
      </div>
    </section>
  `
}

function renderSectionCards(page) {
  return page.sections
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
    .join('')
}

function renderRelatedReading(page) {
  const lookup = new Map([...servicePages, ...blogPages].map((item) => [item.url, item]))
  const related = (page.relatedReadingLinks || []).map((url) => lookup.get(url)).filter(Boolean)

  if (!related.length) return ''

  return `
    <section class="card p-6 md:p-8">
      <h2 class="text-2xl md:text-3xl font-bold mb-6">${escapeHtml(page.relatedReadingTitle || 'À lire aussi')}</h2>
      <div class="grid gap-4 md:grid-cols-2">
        ${related
          .map(
            (item) => `
              <a href="${item.url}" class="rounded-2xl border border-rolexGold/20 bg-rolexGreen/10 p-5 hover:bg-rolexGreen/20 transition">
                <div class="text-sm uppercase tracking-[0.16em] text-rolexGold">${escapeHtml(item.badge || 'Lecture conseillée')}</div>
                <div class="font-semibold text-lg mt-2">${escapeHtml(item.menuLabel || item.h1)}</div>
                <div class="text-sm text-slate-300 mt-2">${escapeHtml(item.menuDescription || item.metaDescription)}</div>
              </a>
            `,
          )
          .join('')}
      </div>
    </section>
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

function renderCtaSections(page) {
  if (!page.ctaSections?.length) return ''

  return `
    <div class="space-y-6">
      ${page.ctaSections
        .map(
          (section) => `
            <section class="rounded-[2rem] border p-6 md:p-8 ${
              section.tone === 'gold'
                ? 'border-rolexGold/30 bg-rolexGold/10'
                : 'border-rolexGreen/40 bg-rolexGreen/15'
            }">
              <h2 class="text-2xl md:text-3xl font-bold mb-4">${escapeHtml(section.heading)}</h2>
              <p class="text-slate-200 leading-8 mb-6">${escapeHtml(section.text)}</p>
              <div class="flex flex-wrap gap-3">
                ${section.buttons
                  .map(
                    (button, index) => `
                      <a href="${button.href}" class="${index === 0 ? 'btn-primary' : 'btn-outline'}">${escapeHtml(button.label)}</a>
                    `,
                  )
                  .join('')}
              </div>
            </section>
          `,
        )
        .join('')}
    </div>
  `
}

function renderPage(page) {
  const image = getPrimaryImage(page)
  const type = page.url.startsWith('/blog/') ? 'blog' : 'service'

  return `
    ${renderHeader()}
    <main class="overflow-x-hidden pt-16 lg:pt-[4.5rem]">
      <section class="section">
        <div class="container-max">
          ${renderBreadcrumbs(page, type)}
          <div class="rounded-[2rem] border border-rolexGold/30 bg-gradient-to-br from-rolexGreen/35 via-surface to-background p-8 md:p-12 shadow-soft">
            <div class="badge mb-4">${escapeHtml(page.badge)}</div>
            <h1 class="text-4xl md:text-5xl font-extrabold mb-6 max-w-5xl">${escapeHtml(page.h1)}</h1>
            <p class="text-lg text-slate-200 max-w-4xl leading-8">${escapeHtml(page.intro)}</p>
            ${
              page.heroActions?.length
                ? `
                  <div class="mt-6 flex flex-wrap gap-3">
                    ${page.heroActions
                      .map((action) => {
                        const className =
                          action.variant === 'secondary'
                            ? 'btn-outline'
                            : action.variant === 'ghost'
                              ? 'inline-flex items-center justify-center rounded-2xl border border-rolexGold/20 bg-rolexGreen/10 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-rolexGreen/20 transition'
                              : 'btn-primary'

                        return `<a href="${action.href}" class="${className}">${escapeHtml(action.label)}</a>`
                      })
                      .join('')}
                  </div>
                `
                : ''
            }
            <figure class="mt-8 overflow-hidden rounded-[2rem] border border-rolexGold/20 bg-rolexGreen/10">
              <img src="${image.src}" alt="${escapeHtml(image.alt)}" class="w-full h-[260px] md:h-[380px] object-cover" />
            </figure>
            ${
              page.highlights?.length
                ? `
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
                `
                : ''
            }
          </div>

          <div class="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 mt-10 items-start">
            <div class="space-y-8">
              ${page.articleBody ? renderArticleBody(page) : renderSectionCards(page)}
              ${renderCtaSections(page)}
              ${renderRelatedReading(page)}
              ${renderFaq(page)}

              <section class="rounded-[2rem] border border-rolexGold/30 bg-rolexGold/10 p-6 md:p-8">
                <h2 class="text-2xl md:text-3xl font-bold mb-4">${escapeHtml(page.ctaTitle)}</h2>
                <p class="text-slate-200 leading-8 mb-6">${escapeHtml(page.ctaText)}</p>
                <a href="${page.ctaHref || '/contact'}" class="btn-primary">${escapeHtml(page.ctaLabel)}</a>
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
  const featuredOrthodontiePages = blogPages.filter((page) => page.cluster === 'orthodontie').slice(0, 6)
  const groupedPages = [
    ['Orthodontie', blogPages.filter((page) => page.category === 'Orthodontie')],
    ['Orthodontie invisible', blogPages.filter((page) => page.category === 'Orthodontie invisible')],
    ['Bassin de Thau / Suivi local', blogPages.filter((page) => page.category === 'Bassin de Thau / Suivi local')],
    ['Autres articles', blogPages.filter((page) => !page.category)],
  ].filter(([, pages]) => pages.length)

  return `
    ${renderHeader()}
    <main class="overflow-x-hidden pt-16 lg:pt-[4.5rem]">
      <section class="section">
        <div class="container-max">
          <div class="rounded-[2rem] border border-rolexGold/30 bg-gradient-to-br from-rolexGreen/35 via-surface to-background p-8 md:p-12 shadow-soft">
            <div class="badge mb-4">Blog d'autorite</div>
            <h1 class="text-4xl md:text-5xl font-extrabold mb-6">Blog dentaire a Sete : orthodontie, orthodontie invisible et implantologie</h1>
            <p class="text-lg text-slate-200 max-w-4xl leading-8">
              Cette rubrique met en avant un cluster complet sur l'orthodontie a Sete, l'orthodontie invisible,
              les aligneurs transparents et le suivi des patients du Bassin de Thau, avec des contenus complementaires
              sur le prix du traitement et l'implantologie.
            </p>
            <figure class="mt-8 overflow-hidden rounded-[2rem] border border-rolexGold/20 bg-rolexGreen/10">
              <img src="/seo-images/logo-hero-section.png" alt="Identité visuelle du Cabinet Dentaire Dr. Abdessadok à Sète" class="w-full h-[260px] md:h-[380px] object-contain bg-white p-6" />
            </figure>
          </div>

          <section class="grid gap-6 md:grid-cols-2 mt-10">
            <a href="/orthodontie-sete" class="card p-6 hover:-translate-y-1 transition">
              <div class="badge mb-4">Page pilier orthodontie</div>
              <h2 class="text-2xl font-bold mb-3">Orthodontie à Sète</h2>
              <p class="text-slate-300 leading-7">Page essentielle pour comprendre quand consulter, comment réfléchir à l alignement dentaire et quelles questions poser avant un bilan.</p>
            </a>
            <a href="/orthodontie-invisible-sete" class="card p-6 hover:-translate-y-1 transition">
              <div class="badge mb-4">Page pilier orthodontie invisible</div>
              <h2 class="text-2xl font-bold mb-3">Orthodontie invisible à Sète</h2>
              <p class="text-slate-300 leading-7">Page essentielle sur les aligneurs transparents, le bilan, le quotidien, la durée et les questions utiles avant de prendre rendez-vous.</p>
            </a>
          </section>

          <section class="mt-10">
            <div class="flex items-end justify-between gap-4 mb-6">
              <div>
                <div class="badge mb-3">Cluster prioritaire</div>
                <h2 class="text-3xl md:text-4xl font-bold">Orthodontie et alignement dentaire a Sete</h2>
              </div>
              <p class="text-slate-300 max-w-2xl leading-7">
                Les contenus les plus strategiques sur l'orthodontie, l'orthodontie invisible et les premieres questions a se poser avant un bilan.
              </p>
            </div>
            <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              ${featuredOrthodontiePages
                .map(
                  (page) => `
                    <a href="${page.url}" class="card p-6 hover:-translate-y-1 transition">
                      <div class="badge mb-4">${escapeHtml(page.badge)}</div>
                      ${
                        page.image?.src
                          ? `<img src="${page.image.src}" alt="${escapeHtml(page.image.alt || page.h1)}" class="h-20 w-20 rounded-2xl object-contain border border-rolexGold/20 bg-white/90 p-3 mb-5" />`
                          : ''
                      }
                      <h3 class="text-2xl font-bold mb-3">${escapeHtml(page.h1)}</h3>
                      <p class="text-slate-300 leading-7 mb-6">${escapeHtml(page.excerpt || page.intro)}</p>
                      <span class="text-rolexGold font-semibold">Lire l'article</span>
                    </a>
                  `,
                )
                .join('')}
            </div>
          </section>

          <div class="space-y-10 mt-12">
            ${groupedPages
              .map(
                ([category, pages]) => `
                  <section>
                    <div class="flex items-end justify-between gap-4 mb-5">
                      <h2 class="text-2xl md:text-3xl font-bold">${escapeHtml(category)}</h2>
                      <div class="text-sm text-slate-400">${pages.length} article${pages.length > 1 ? 's' : ''}</div>
                    </div>
                    <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                      ${pages
                        .map(
                          (page) => `
                            <a href="${page.url}" class="card p-6 hover:-translate-y-1 transition">
                              <div class="badge mb-4">${escapeHtml(page.badge)}</div>
                              ${
                                page.cardImage?.src || page.image?.src
                                  ? `<img src="${(page.cardImage?.src || page.image.src)}" alt="${escapeHtml(page.cardImage?.alt || page.image?.alt || page.h1)}" class="h-20 w-20 rounded-2xl object-contain border border-rolexGold/20 bg-white/90 p-3 mb-5" />`
                                  : ''
                              }
                              <h3 class="text-2xl font-bold mb-3">${escapeHtml(page.h1)}</h3>
                              <p class="text-slate-300 leading-7 mb-6">${escapeHtml(page.excerpt || page.intro)}</p>
                              <span class="text-rolexGold font-semibold">Lire l'article</span>
                            </a>
                          `,
                        )
                        .join('')}
                    </div>
                  </section>
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
    <main class="overflow-x-hidden pt-16 lg:pt-[4.5rem]">
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
      image: `${siteUrl}/seo-images/logo-hero-section.png`,
    },
    renderHomeFallback(),
  )

  await writeRoute(
    template,
    '/blog',
    {
      title: 'Blog dentaire Sete : orthodontie invisible, prix et implantologie',
      description:
        "Blog dentaire du cabinet a Sete : orthodontie, orthodontie invisible, aligneurs transparents et implantologie.",
      url: `${siteUrl}/blog`,
      image: `${siteUrl}/seo-images/logo-hero-section.png`,
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
