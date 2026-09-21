import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'vite'
import { seoRoutes } from '../src/config/seoRoutes.js'

const distDir = path.resolve('dist')

function clearPageHead(template) {
  return template
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/\s*<meta\b[^>]*(?:name=["'](?:description|robots|twitter:[^"']+)["']|property=["'](?:og:|article:)[^"']+["'])[^>]*>/gi, '')
    .replace(/\s*<link\b[^>]*rel=["'](?:canonical|alternate|image_src)["'][^>]*>/gi, '')
    .replace(/\s*<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '')
}

function visibleInitialHtml(html) {
  // Framer Motion can emit its pre-animation opacity on the server. Publish the
  // visible state so the exact same text is readable before JavaScript loads.
  // Browser animations retain their initial states when React mounts.
  return html.replace(/style="([^"]+)"/g, (tag, style) => {
    if (!/(?:^|;)opacity:0(?:\.0+)?(?:;|$)/.test(style)) return tag
    return `style="${style.replace(/(^|;)opacity:0(?:\.0+)?(?=;|$)/, '$1opacity:1').replace(/(^|;)transform:[^;]+/, '$1transform:none')}"`
  })
}

function documentFor(template, route, rendered) {
  const { helmet } = rendered
  let head = [helmet.title, helmet.meta, helmet.link, helmet.script].map((item) => item.toString()).join('\n')
  if (route.type === 'notFound') {
    head = head
      .replace(/<link\b[^>]*rel="canonical"[^>]*>/gi, '')
      .replace(/<meta\b[^>]*property="og:url"[^>]*>/gi, '')
  }
  return template
    .replace(/<html\b[^>]*>/i, `<html ${helmet.htmlAttributes.toString()}>`)
    .replace('</head>', `${head}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${visibleInitialHtml(rendered.html)}</div>`)
}

async function writePrivateShell(template, routePath) {
  const head = '<title>Espace privé</title><meta name="description" content="Espace privé du cabinet." data-rh="true"><meta name="robots" content="noindex,nofollow" data-rh="true">'
  const outputDir = path.join(distDir, routePath.replace(/^\/+|\/+$/g, ''))
  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(path.join(outputDir, 'index.html'), template.replace('</head>', `${head}</head>`))
}

async function main() {
  const template = clearPageHead(await fs.readFile(path.join(distDir, 'index.html'), 'utf8'))
  if (!template.includes('<div id="root"></div>')) throw new Error('Expected a fresh Vite build before prerendering')

  // Keep the build-only renderer outside dist, with access to project dependencies.
  // It starts no server and is always removed, including when rendering fails.
  const cacheDir = path.resolve('node_modules/.cache')
  await fs.mkdir(cacheDir, { recursive: true })
  const renderDir = await fs.mkdtemp(path.join(cacheDir, 'public-prerender-'))
  try {
    await build({
      logLevel: 'warn',
      ssr: { noExternal: ['react-helmet-async'] },
      build: {
        ssr: 'scripts/render-public-pages.jsx',
        outDir: renderDir,
        emptyOutDir: true,
        minify: false,
        rollupOptions: { output: { entryFileNames: 'render.mjs' } },
      },
    })
    const { renderPublicRoute } = await import(pathToFileURL(path.join(renderDir, 'render.mjs')))
    for (const route of seoRoutes) {
      const html = documentFor(template, route, renderPublicRoute(route))
      const outputDir = route.path === '/' ? distDir : path.join(distDir, route.path.replace(/^\/+|\/+$/g, ''))
      await fs.mkdir(outputDir, { recursive: true })
      await fs.writeFile(path.join(outputDir, 'index.html'), html)
    }
    const notFound = { path: '/404/', type: 'notFound', language: 'fr' }
    await fs.writeFile(path.join(distDir, '404.html'), documentFor(template, notFound, renderPublicRoute(notFound)))
    for (const route of ['/login/', '/admin/', '/admin/actualities/', '/legacy-actuality/']) await writePrivateShell(template, route)
    console.log(`Prerendered ${seoRoutes.length} public routes using their actual React content, plus private shells and 404.html`)
  } finally {
    await fs.rm(renderDir, { recursive: true, force: true })
  }
}

await main()
