// Exact examples visible in the user's GSC screenshots (report updated 2026-09-18).
// The screenshots show only 10/21 redirect examples and 10/14 noindex examples.
const apex = 'https://cabinetdentairesete.fr'
export const gscCases = [
  ...[
    '/services', '/invisalign-marseillan', '/orthodontie-invisible-agde', '/invisalign',
    '/contact', '/gallery', '/implantologie',
    '/blog/prix-orthodontie-invisible-sete', '/blog/prix-orthodontie-invisible-sete/',
  ].map((path) => ({ category: 'page_with_redirect', url: `${apex}${path}` })),
  { category: 'page_with_redirect', url: 'http://cabinetdentairesete.fr/' },
  ...[
    '/blog/bilan-imagerie-avant-implant/', '/blog/dents-chevauchees-espaces-visibles-correction-sete/',
    '/blog/orthodontie-invisible-quotidien-repas-entretien-parole/',
    '/blog/verite-invisalign-taquets-temps-port-gene', '/blog/verite-invisalign-taquets-temps-port-gene/',
    '/login', '/login/', '/blog/aligner-dents-avant-implant', '/blog/aligner-dents-avant-implant/',
    '/blog/duree-orthodontie-invisible-sete',
  ].map((path) => ({ category: 'noindex', url: `${apex}${path}` })),
  ...[
    '/blog/orthodontie-invisible-adulte-30-40-50-ans',
    '/blog/orthodontie-invisible-quotidien-repas-entretien-parole',
    '/blog/orthodontie-bassin-de-thau-suivi-sete',
    '/blog/orthodontie-invisible-sete-questions-avant-bilan',
    '/blog/dents-chevauchees-espaces-visibles-correction-sete',
    '/blog/dents-qui-rebougent-apres-appareil-sete',
    '/blog/orthodontie-adulte-sete-questions-avant-traitement',
    '/blog/orthodontie-sete-quand-consulter-alignement-dentaire', '/orthodontie-sete',
  ].map((path) => ({ category: 'redirect_error', url: `${apex}${path}` })),
  ...[
    'https://www.cabinetdentairesete.fr/', `${apex}/orthodontie-invisible-meze/`,
    `${apex}/orthodontie-invisible-agde/`, 'https://www.cabinetdentairesete.fr/invisalign-marseillan/',
  ].map((url) => ({ category: 'alternate_canonical', url })),
  ...[
    '/implant-dentaire-balaruc-les-bains/', '/blog/orthodontie-invisible-adulte-30-40-50-ans/',
    '/blog/orthodontie-sete-quand-consulter-alignement-dentaire/',
    '/blog/orthodontie-adulte-sete-questions-avant-traitement/',
    '/orthodontie-adulte-balaruc-les-bains/',
    '/actualities/39fadf61-8196-4e3d-bc2f-c7d9d953619d', '/actualities',
    '/actualities/84603478-f35f-4f74-9052-a9ff3f01e632',
  ].map((path) => ({ category: 'crawled_not_indexed', url: `${apex}${path}` })),
  ...['/contention-apres-aligneurs/', '/de/kontakt/']
    .map((path) => ({ category: 'discovered_not_indexed', url: `${apex}${path}` })),
]
