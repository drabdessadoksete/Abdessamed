import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve('.')
const variants = [480, 800, 1200, 1600]

const assets = [
  {
    source: 'new images/ChatGPT Image 12 juil. 2026, 18_44_18 (1).webp',
    destination: 'public/images/orthodontie/consultation',
    name: 'consultation-orthodontie',
  },
  {
    source: 'new images/ChatGPT Image 12 juil. 2026, 18_44_18 (2).webp',
    destination: 'public/images/implantologie/consultation',
    name: 'consultation-implantologie',
  },
  {
    source: 'new images/ChatGPT Image 12 juil. 2026, 18_44_19 (4).webp',
    destination: 'public/images/shared/technology',
    name: 'environnement-clinique-illustre',
  },
  {
    source: 'new images/ChatGPT Image 12 juil. 2026, 18_44_24 (1).webp',
    destination: 'public/images/orthodontie/explanation',
    name: 'explication-aligneurs',
  },
  {
    source: 'new images/ChatGPT Image 12 juil. 2026, 18_44_25 (4).webp',
    destination: 'public/images/orthodontie/scanner',
    name: 'scanner-intraoral',
  },
]

async function writeResponsiveAsset(asset) {
  const input = path.join(root, asset.source)
  const outputDir = path.join(root, asset.destination)
  await fs.mkdir(outputDir, { recursive: true })

  const metadata = await sharp(input).metadata()
  const availableWidths = variants.filter((width) => width <= metadata.width)
  if (!availableWidths.includes(metadata.width)) availableWidths.push(metadata.width)

  for (const width of availableWidths) {
    const pipeline = sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .withMetadata({ orientation: undefined })

    await pipeline.clone().avif({ quality: 58, effort: 5 }).toFile(path.join(outputDir, `${asset.name}-${width}.avif`))
    await pipeline.clone().webp({ quality: 78, effort: 5 }).toFile(path.join(outputDir, `${asset.name}-${width}.webp`))
  }
}

async function writeLogo() {
  const input = path.join(root, 'src/assets/Logo ( hero section ).png')
  const outputDir = path.join(root, 'public/images/shared/brand')
  await fs.mkdir(outputDir, { recursive: true })

  for (const width of [192, 384, 768]) {
    const pipeline = sharp(input).trim({ background: '#ffffff' }).resize({ width, withoutEnlargement: true })
    await pipeline.clone().webp({ quality: 86, effort: 5 }).toFile(path.join(outputDir, `cabinet-logo-${width}.webp`))
    await pipeline.clone().avif({ quality: 64, effort: 5 }).toFile(path.join(outputDir, `cabinet-logo-${width}.avif`))
  }
}

await Promise.all(assets.map(writeResponsiveAsset))
await writeLogo()
console.log(`Prepared ${assets.length} responsive illustration sets and the verified clinic logo.`)
