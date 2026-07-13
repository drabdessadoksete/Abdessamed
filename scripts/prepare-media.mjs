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
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_03 (1).webp',
    destination: 'public/images/orthodontie/guides',
    name: 'premier-echange-aligneurs',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_04 (2).webp',
    destination: 'public/images/orthodontie/guides',
    name: 'scanner-bilan-adulte',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_04 (3).webp',
    destination: 'public/images/orthodontie/guides',
    name: 'planification-alignement',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_04 (4).webp',
    destination: 'public/images/orthodontie/guides',
    name: 'explication-modele-aligneurs',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_05 (5).webp',
    destination: 'public/images/orthodontie/guides',
    name: 'consultation-aligneurs',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_05 (6).webp',
    destination: 'public/images/orthodontie/guides',
    name: 'equipe-explication-aligneurs',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_06 (7).webp',
    destination: 'public/images/orthodontie/guides',
    name: 'resultat-aligneurs-miroir',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_06 (8).webp',
    destination: 'public/images/orthodontie/guides',
    name: 'suivi-traitement-aligneurs',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_06 (9).webp',
    destination: 'public/images/orthodontie/guides',
    name: 'choix-aligneurs',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_07 (10).webp',
    destination: 'public/images/orthodontie/guides',
    name: 'contention-suivi-aligneurs',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_09 (1).webp',
    destination: 'public/images/implantologie/guides',
    name: 'explication-implant-modele',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_09 (2).webp',
    destination: 'public/images/implantologie/guides',
    name: 'planification-numerique-implant',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_10 (3).webp',
    destination: 'public/images/implantologie/guides',
    name: 'imagerie-panoramique-implant',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_10 (4).webp',
    destination: 'public/images/implantologie/guides',
    name: 'consultation-implant-modele',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_10 (5).webp',
    destination: 'public/images/implantologie/guides',
    name: 'bilan-implant-patiente',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_11 (6).webp',
    destination: 'public/images/implantologie/guides',
    name: 'analyse-imagerie-implant',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_11 (7).webp',
    destination: 'public/images/implantologie/guides',
    name: 'remplacement-dent-manquante',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_11 (8).webp',
    destination: 'public/images/implantologie/guides',
    name: 'entretien-suivi-implant',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_12 (9).webp',
    destination: 'public/images/implantologie/guides',
    name: 'planification-implants-ecran',
  },
  {
    source: 'the new 20 images/ChatGPT Image 13 juil. 2026, 11_42_12 (10).webp',
    destination: 'public/images/implantologie/guides',
    name: 'explication-implant-ecran',
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
