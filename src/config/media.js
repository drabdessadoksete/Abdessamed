const responsive = (basePath, name, widths, { alt, caption, focalPoint = 'center' }) => ({
  alt,
  caption,
  focalPoint,
  generated: true,
  sizes: '(max-width: 767px) 100vw, 50vw',
  sources: {
    avif: widths.map((width) => `${basePath}/${name}-${width}.avif ${width}w`).join(', '),
    webp: widths.map((width) => `${basePath}/${name}-${width}.webp ${width}w`).join(', '),
  },
  fallback: `${basePath}/${name}-${widths.at(-1)}.webp`,
  width: widths.at(-1),
  height: Math.round(widths.at(-1) * 941 / 1672),
})

export const media = {
  logo: {
    alt: 'Cabinet Dentaire Dr Abdessadok, chirurgien-dentiste à Sète',
    generated: false,
    sources: {
      avif: '/images/shared/brand/cabinet-logo-192.avif 192w, /images/shared/brand/cabinet-logo-384.avif 384w, /images/shared/brand/cabinet-logo-768.avif 768w',
      webp: '/images/shared/brand/cabinet-logo-192.webp 192w, /images/shared/brand/cabinet-logo-384.webp 384w, /images/shared/brand/cabinet-logo-768.webp 768w',
    },
    fallback: '/images/shared/brand/cabinet-logo-384.webp',
    width: 768,
    height: 768,
  },
  homeConsultation: responsive(
    '/images/orthodontie/consultation',
    'consultation-orthodontie',
    [480, 800, 1200, 1600, 1672],
    {
      alt: "Illustration d'un échange entre un chirurgien-dentiste et une patiente autour d'un projet dentaire",
      caption: 'Illustration éditoriale, non réalisée dans le cabinet.',
      focalPoint: '62% center',
    },
  ),
  implantConsultation: responsive(
    '/images/implantologie/consultation',
    'consultation-implantologie',
    [480, 800, 1200, 1600, 1672],
    {
      alt: "Illustration d'une consultation expliquant le remplacement d'une dent par un implant",
      caption: 'Illustration éditoriale, non réalisée dans le cabinet.',
      focalPoint: 'center',
    },
  ),
  clinicalTechnology: responsive(
    '/images/shared/technology',
    'environnement-clinique-illustre',
    [480, 800, 1200, 1600, 1672],
    {
      alt: "Illustration d'un environnement de soins dentaires équipé d'outils numériques",
      caption: "Illustration d'ambiance, non-photographie du cabinet.",
    },
  ),
  alignerExplanation: responsive(
    '/images/orthodontie/explanation',
    'explication-aligneurs',
    [480, 800, 1200, 1600, 1672],
    {
      alt: "Illustration d'une explication du fonctionnement des aligneurs transparents",
      caption: 'Illustration éditoriale, non réalisée dans le cabinet.',
      focalPoint: '58% center',
    },
  ),
  intraoralScanner: responsive(
    '/images/orthodontie/scanner',
    'scanner-intraoral',
    [480, 800, 1200, 1600, 1672],
    {
      alt: "Illustration de l'utilisation d'un scanner intra-oral pendant un bilan orthodontique",
      caption: 'Illustration éditoriale, non réalisée dans le cabinet.',
      focalPoint: 'center',
    },
  ),
}

export const mediaSlots = {
  orthodontieVideo: null,
  implantologieVideo: null,
  clinicDocumentaryGallery: [],
}
