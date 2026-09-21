import { buildArticleBodyBlocks } from './seoArticleContent.js'

// Positional suffixes keep repeated headings unique without changing editorial copy.
export function sectionId(heading, index) {
  const slug = heading.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 72)
  return `section-${index + 1}-${slug || 'guide'}`
}

export function contentOutline(page) {
  if (page.articleBody) {
    return buildArticleBodyBlocks(page.articleBody).flatMap((block, index) => (
      ['heading2', 'heading3'].includes(block.type)
        ? [{ id: sectionId(block.text, index), title: block.text, level: block.type === 'heading2' ? 2 : 3 }]
        : []
    ))
  }
  return (page.sections || []).map((section, index) => ({ id: sectionId(section.heading, index), title: section.heading, level: 2 }))
}
