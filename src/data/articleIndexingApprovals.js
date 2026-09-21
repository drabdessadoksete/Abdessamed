// The site owner confirmed the dentists' approval of these 15 existing articles
// on 2026-09-21. This records permission to index them, not a named clinical
// reviewer or a medical review date (neither was supplied).
// New articles still require their own approval or a completed review record.
export const approvedArticleUrls = new Set([
  '/blog/orthodontie-adulte-sete-questions-avant-traitement/',
  '/blog/dents-chevauchees-espaces-visibles-correction-sete/',
  '/blog/dents-qui-rebougent-apres-appareil-sete/',
  '/blog/invisalign-aligneurs-transparents-gouttieres-differences/',
  '/blog/duree-orthodontie-invisible-sete/',
  '/blog/orthodontie-invisible-quotidien-repas-entretien-parole/',
  '/blog/orthodontie-invisible-adulte-30-40-50-ans/',
  '/blog/orthodontie-invisible-adolescent-sete/',
  '/blog/premier-bilan-orthodontie-invisible-sete/',
  '/blog/aligner-dents-avant-implant/',
  '/blog/etapes-pose-implant-dentaire/',
  '/blog/implant-dentaire-douleur-anesthesie-cicatrisation/',
  '/blog/remplacer-dent-manquante-solutions/',
  '/blog/bilan-imagerie-avant-implant/',
  '/blog/entretien-duree-vie-implant-dentaire/',
])

export function isArticleIndexable(page) {
  return approvedArticleUrls.has(page.url)
    || (page.medicalReviewStatus === 'reviewed' && Boolean(page.medicalReviewer))
}
