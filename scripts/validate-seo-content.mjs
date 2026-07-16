import { blogPages, servicePages } from '../src/data/seoContent.js'

const errors = []

function actualType(value) {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

function report(route, property, expected, value, reason) {
  errors.push({
    route,
    property,
    expected,
    actual: actualType(value),
    reason,
  })
}

function requireValue(route, object, property, expected, predicate, reportProperty = property) {
  const value = object[property]

  if (!(property in object)) {
    report(route, reportProperty, expected, undefined, 'missing property')
    return false
  }

  if (value === null) {
    report(route, reportProperty, expected, value, 'null property')
    return false
  }

  if (!predicate(value)) {
    report(route, reportProperty, expected, value, 'invalid data type')
    return false
  }

  return true
}

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0
const isStringArray = (value) => Array.isArray(value) && value.every(isNonEmptyString)

function validateOptionalString(route, object, property, reportProperty = property) {
  const value = object[property]
  if (value != null && typeof value !== 'string') {
    report(route, reportProperty, 'string, null, or omitted', value, 'invalid data type')
  }
}

function validateStringArray(route, object, property, { required = false } = {}) {
  const value = object[property]

  if (required) {
    requireValue(route, object, property, 'array of non-empty strings', isStringArray)
    return
  }

  if (value != null && !isStringArray(value)) {
    report(route, property, 'array of non-empty strings, null, or omitted', value, 'invalid data type')
  }
}

function validateSections(route, sections) {
  if (!Array.isArray(sections) || sections.length === 0) {
    report(route, 'sections', 'non-empty array when articleBody is null or omitted', sections, sections == null ? 'missing or null property' : 'invalid data type')
    return
  }

  sections.forEach((section, sectionIndex) => {
    const sectionPath = `sections[${sectionIndex}]`

    if (section === null || typeof section !== 'object' || Array.isArray(section)) {
      report(route, sectionPath, 'object', section, section === null ? 'null property' : 'invalid data type')
      return
    }

    requireValue(route, section, 'heading', 'non-empty string', isNonEmptyString, `${sectionPath}.heading`)

    if (!requireValue(route, section, 'blocks', 'non-empty array', (value) => Array.isArray(value) && value.length > 0, `${sectionPath}.blocks`)) return

    section.blocks.forEach((block, blockIndex) => {
      const blockPath = `${sectionPath}.blocks[${blockIndex}]`

      if (block === null || typeof block !== 'object' || Array.isArray(block)) {
        report(route, blockPath, 'object', block, block === null ? 'null property' : 'invalid data type')
        return
      }

      validateOptionalString(route, block, 'subheading', `${blockPath}.subheading`)

      if (block.paragraphs != null && !isStringArray(block.paragraphs)) {
        report(route, `${blockPath}.paragraphs`, 'array of non-empty strings, null, or omitted', block.paragraphs, 'invalid data type')
      }

      if (block.bullets != null && !isStringArray(block.bullets)) {
        report(route, `${blockPath}.bullets`, 'array of non-empty strings, null, or omitted', block.bullets, 'invalid data type')
      }

      const hasParagraphs = Array.isArray(block.paragraphs) && block.paragraphs.length > 0
      const hasBullets = Array.isArray(block.bullets) && block.bullets.length > 0
      if (!hasParagraphs && !hasBullets) {
        report(route, blockPath, 'object containing non-empty paragraphs and/or bullets', block, 'missing renderable block content')
      }
    })
  })
}

function validateFaq(route, faq) {
  if (faq == null) return

  if (!Array.isArray(faq)) {
    report(route, 'faq', 'array, null, or omitted', faq, 'invalid data type')
    return
  }

  faq.forEach((item, index) => {
    const itemPath = `faq[${index}]`
    if (item === null || typeof item !== 'object' || Array.isArray(item)) {
      report(route, itemPath, 'object', item, item === null ? 'null property' : 'invalid data type')
      return
    }
    requireValue(route, item, 'question', 'non-empty string', isNonEmptyString, `${itemPath}.question`)
    requireValue(route, item, 'answer', 'non-empty string', isNonEmptyString, `${itemPath}.answer`)
  })
}

function validatePage(page, type, index) {
  const route = typeof page?.url === 'string' && page.url ? page.url : `[${type} page ${index}]`

  if (page === null || typeof page !== 'object' || Array.isArray(page)) {
    report(route, 'page', 'object', page, page === null ? 'null page object' : 'invalid data type')
    return
  }

  for (const property of ['url', 'title', 'metaDescription', 'h1', 'intro', 'ctaTitle', 'ctaText', 'ctaLabel']) {
    requireValue(route, page, property, 'non-empty string', isNonEmptyString)
  }

  requireValue(route, page, 'internalLinks', 'array of non-empty strings', isStringArray)
  validateStringArray(route, page, 'highlights')

  for (const property of ['menuLabel', 'menuGroup', 'badge', 'ctaHref']) {
    validateOptionalString(route, page, property)
  }

  validateFaq(route, page.faq)

  if (page.articleBody == null) {
    validateSections(route, page.sections)
  } else if (typeof page.articleBody !== 'string') {
    report(route, 'articleBody', 'string, null, or omitted', page.articleBody, 'invalid data type')
  } else if (!page.articleBody.trim()) {
    report(route, 'articleBody', 'non-empty string when provided', page.articleBody, 'empty content')
  }

  if (type === 'blog') {
    for (const property of ['authorName', 'datePublished', 'dateModified', 'medicalReviewStatus']) {
      requireValue(route, page, property, 'non-empty string', isNonEmptyString)
    }
    validateOptionalString(route, page, 'medicalReviewer')
  }
}

servicePages.forEach((page, index) => validatePage(page, 'service', index))
blogPages.forEach((page, index) => validatePage(page, 'blog', index))

if (errors.length) {
  console.error(`SeoContentPage validation failed with ${errors.length} error(s):`)
  for (const error of errors) {
    console.error(`- route: ${error.route} | property: ${error.property} | issue: ${error.reason} | expected: ${error.expected} | actual: ${error.actual}`)
  }
  process.exit(1)
}

console.log(`SeoContentPage validation passed for ${servicePages.length + blogPages.length} pages (${servicePages.length} service, ${blogPages.length} blog).`)
