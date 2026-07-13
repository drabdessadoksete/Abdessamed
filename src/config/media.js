const responsive = (
  basePath,
  name,
  widths,
  { alt, focalPoint = 'center', sourceWidth = 1672, sourceHeight = 941 },
) => ({
  alt,
  focalPoint,
  generated: true,
  sizes: '(max-width: 767px) 100vw, 50vw',
  sources: {
    avif: widths.map((width) => `${basePath}/${name}-${width}.avif ${width}w`).join(', '),
    webp: widths.map((width) => `${basePath}/${name}-${width}.webp ${width}w`).join(', '),
  },
  fallback: `${basePath}/${name}-${widths.at(-1)}.webp`,
  width: widths.at(-1),
  height: Math.round(widths.at(-1) * sourceHeight / sourceWidth),
})

const portrait = (basePath, name, alt, focalPoint = 'center') => responsive(
  basePath,
  name,
  [480, 800, 1122],
  { alt, focalPoint, sourceWidth: 1122, sourceHeight: 1402 },
)

const orthodontieGuide = (name, alt, focalPoint) => portrait(
  '/images/orthodontie/guides',
  name,
  alt,
  focalPoint,
)

const implantologieGuide = (name, alt, focalPoint) => portrait(
  '/images/implantologie/guides',
  name,
  alt,
  focalPoint,
)

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
      alt: "Échange autour d'un projet dentaire et de ses différentes étapes",
      focalPoint: '62% center',
    },
  ),
  implantConsultation: responsive(
    '/images/implantologie/consultation',
    'consultation-implantologie',
    [480, 800, 1200, 1600, 1672],
    {
      alt: "Explication du remplacement d'une dent par un implant",
      focalPoint: 'center',
    },
  ),
  clinicalTechnology: responsive(
    '/images/shared/technology',
    'environnement-clinique-illustre',
    [480, 800, 1200, 1600, 1672],
    {
      alt: "Environnement de soins dentaires équipé d'outils numériques",
      focalPoint: 'center 58%',
    },
  ),
  alignerExplanation: responsive(
    '/images/orthodontie/explanation',
    'explication-aligneurs',
    [480, 800, 1200, 1600, 1672],
    {
      alt: 'Explication du fonctionnement des aligneurs transparents',
      focalPoint: '58% center',
    },
  ),
  intraoralScanner: responsive(
    '/images/orthodontie/scanner',
    'scanner-intraoral',
    [480, 800, 1200, 1600, 1672],
    {
      alt: "Utilisation d'un scanner intra-oral pendant un bilan orthodontique",
      focalPoint: 'center',
    },
  ),

  orthoFirstExchange: orthodontieGuide('premier-echange-aligneurs', 'Présentation des aligneurs au cours du premier échange', '50% 44%'),
  orthoAdultScan: orthodontieGuide('scanner-bilan-adulte', 'Empreinte numérique pendant un bilan orthodontique adulte', '50% 42%'),
  orthoPlanning: orthodontieGuide('planification-alignement', "Explication d'une planification d'alignement dentaire", '48% 42%'),
  orthoModel: orthodontieGuide('explication-modele-aligneurs', "Présentation d'un aligneur sur un modèle dentaire", '48% 43%'),
  orthoConsultation: orthodontieGuide('consultation-aligneurs', 'Échange sur le port quotidien des aligneurs', '50% 42%'),
  orthoTeamExplanation: orthodontieGuide('equipe-explication-aligneurs', "Explication d'un projet orthodontique avec supports numériques", '52% 43%'),
  orthoMirrorResult: orthodontieGuide('resultat-aligneurs-miroir', "Observation du sourire au cours d'un suivi orthodontique", '54% 40%'),
  orthoFollowUp: orthodontieGuide('suivi-traitement-aligneurs', "Point de suivi d'un traitement par aligneurs", '49% 43%'),
  orthoOptions: orthodontieGuide('choix-aligneurs', "Comparaison de différents aligneurs pendant une consultation", '52% 43%'),
  orthoRetention: orthodontieGuide('contention-suivi-aligneurs', "Explication de la contention après un traitement orthodontique", '48% 43%'),

  implantModel: implantologieGuide('explication-implant-modele', "Explication d'un implant à l'aide d'un modèle dentaire", '48% 43%'),
  implantDigitalPlanning: implantologieGuide('planification-numerique-implant', "Présentation numérique d'un projet implantaire", '53% 45%'),
  implantImaging: implantologieGuide('imagerie-panoramique-implant', "Lecture d'une imagerie panoramique avant un projet implantaire", '51% 42%'),
  implantCloseModel: implantologieGuide('consultation-implant-modele', "Échange détaillé autour d'un modèle implantaire", '50% 44%'),
  implantAssessment: implantologieGuide('bilan-implant-patiente', "Bilan d'un projet implantaire avec support d'imagerie", '50% 43%'),
  implantImageReview: implantologieGuide('analyse-imagerie-implant', "Analyse d'une imagerie dans le cadre d'un bilan implantaire", '50% 44%'),
  implantMissingTooth: implantologieGuide('remplacement-dent-manquante', "Présentation d'une solution pour remplacer une dent manquante", '54% 48%'),
  implantMaintenance: implantologieGuide('entretien-suivi-implant', "Consultation de suivi et d'entretien d'un implant", '48% 43%'),
  implantScreenPlanning: implantologieGuide('planification-implants-ecran', "Visualisation d'une planification implantaire sur écran", '51% 43%'),
  implantScreenExplanation: implantologieGuide('explication-implant-ecran', "Explication d'un implant avec un modèle et un écran", '50% 44%'),
}

export const mediaByRoute = {
  '/implantologie/': media.implantDigitalPlanning,
  '/orthodontie-sete/': media.orthoPlanning,
  '/orthodontie-invisible-sete/': media.orthoTeamExplanation,
  '/invisalign/': media.orthoFirstExchange,
  '/prix-orthodontie-invisible-sete/': media.orthoConsultation,
  '/orthodontie-invisible-meze/': media.orthoFollowUp,
  '/invisalign-frontignan/': media.orthoOptions,
  '/invisalign-marseillan/': media.orthoRetention,
  '/orthodontie-invisible-agde/': media.orthoModel,
  '/orthodontie-adulte-balaruc-les-bains/': media.orthoAdultScan,
  '/invisalign-bassin-de-thau/': media.orthoMirrorResult,

  '/blog/orthodontie-sete-quand-consulter-alignement-dentaire/': media.orthoFirstExchange,
  '/blog/orthodontie-adulte-sete-questions-avant-traitement/': media.orthoAdultScan,
  '/blog/dents-chevauchees-espaces-visibles-correction-sete/': media.orthoPlanning,
  '/blog/dents-qui-rebougent-apres-appareil-sete/': media.orthoRetention,
  '/blog/orthodontie-bassin-de-thau-suivi-sete/': media.orthoFollowUp,
  '/blog/orthodontie-invisible-sete-questions-avant-bilan/': media.orthoConsultation,
  '/blog/invisalign-aligneurs-transparents-gouttieres-differences/': media.orthoOptions,
  '/blog/duree-orthodontie-invisible-sete/': media.orthoTeamExplanation,
  '/blog/orthodontie-invisible-quotidien-repas-entretien-parole/': media.orthoMirrorResult,
  '/blog/orthodontie-invisible-adulte-30-40-50-ans/': media.orthoModel,
  '/blog/orthodontie-invisible-adolescent-sete/': media.alignerExplanation,
  '/blog/premier-bilan-orthodontie-invisible-sete/': media.homeConsultation,
  '/blog/verite-invisalign-taquets-temps-port-gene/': media.intraoralScanner,
  '/blog/aligner-dents-avant-implant/': media.implantScreenPlanning,

  '/blog/etapes-pose-implant-dentaire/': media.implantScreenExplanation,
  '/blog/implant-dentaire-douleur-anesthesie-cicatrisation/': media.implantAssessment,
  '/blog/remplacer-dent-manquante-solutions/': media.implantMissingTooth,
  '/blog/bilan-imagerie-avant-implant/': media.implantImaging,
  '/blog/entretien-duree-vie-implant-dentaire/': media.implantMaintenance,
  '/blog/aligner-dents-avant-pose-implant/': media.implantImageReview,
}

export function mediaForRoute(url = '') {
  if (mediaByRoute[url]) return mediaByRoute[url]
  if (url.includes('implant')) return media.implantModel
  if (url.includes('orthodontie') || url.includes('invisalign')) return media.orthoConsultation
  return media.homeConsultation
}

export const galleryMedia = [
  media.orthoFirstExchange,
  media.orthoAdultScan,
  media.orthoPlanning,
  media.orthoMirrorResult,
  media.orthoRetention,
  media.implantModel,
  media.implantDigitalPlanning,
  media.implantImaging,
  media.implantMissingTooth,
  media.implantScreenPlanning,
]

export const mediaSlots = {
  orthodontieVideo: null,
  implantologieVideo: null,
  clinicDocumentaryGallery: [],
}
