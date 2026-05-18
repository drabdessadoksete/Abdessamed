function cleanLine(line = '') {
  return line.trim().replace(/\*\*(.*?)\*\*/gu, '$1').replace(/`([^`]+)`/gu, '$1')
}

function isStandaloneHeading(unit) {
  return !unit.includes('\n') && unit.length <= 120
}

function isNumberedHeading(unit) {
  return /^\d+\.\s+/u.test(unit)
}

function isListUnit(lines) {
  return (
    lines.length > 1 &&
    lines.every((line) => line.length <= 180) &&
    lines.every((line) => !/[?!:]$/u.test(line) || /[;.]$/u.test(line))
  )
}

export function buildArticleBodyBlocks(articleBody = '') {
  const units = articleBody
    .replace(/\r/g, '')
    .split(/\n\s*\n/u)
    .map((unit) => unit.trim())
    .filter(Boolean)

  const blocks = []

  for (const unit of units) {
    const lines = unit.split('\n').map(cleanLine).filter(Boolean)

    if (!lines.length) continue

    if (lines.length === 1 && /^#{1,3}\s+/u.test(lines[0])) {
      const text = lines[0].replace(/^#{1,3}\s+/u, '')
      const level = lines[0].match(/^#+/u)?.[0].length || 2
      blocks.push({ type: level >= 3 ? 'heading3' : 'heading2', text })
      continue
    }

    if (lines.every((line) => line.startsWith('- '))) {
      blocks.push({ type: 'list', items: lines.map((line) => line.replace(/^- /u, '')) })
      continue
    }

    if (lines.every((line) => /^\d+\.\s+/u.test(line))) {
      blocks.push({ type: 'list', items: lines.map((line) => line.replace(/^\d+\.\s+/u, '')) })
      continue
    }

    if (lines.length === 1 && lines[0].startsWith('> ')) {
      blocks.push({ type: 'quote', text: lines[0].replace(/^>\s+/u, '') })
      continue
    }

    if (lines.length > 1 && lines[0].endsWith(':') && isListUnit(lines.slice(1))) {
      blocks.push({ type: 'paragraph', text: lines[0] })
      blocks.push({ type: 'list', items: lines.slice(1) })
      continue
    }

    if (isListUnit(lines)) {
      blocks.push({ type: 'list', items: lines })
      continue
    }

    if (isStandaloneHeading(lines[0])) {
      blocks.push({
        type: isNumberedHeading(lines[0]) ? 'heading3' : 'heading2',
        text: lines[0],
      })
      continue
    }

    blocks.push({ type: 'paragraph', text: lines.join(' ') })
  }

  return blocks
}
