import assert from 'node:assert/strict'
import test from 'node:test'
import { buildArticleBodyBlocks } from './seoArticleContent.js'
import { contentOutline } from './contentOutline.js'

test('multiline questions and wrapped prose preserve every original line', () => {
  for (const body of [
    'un chevauchement des incisives ?\nun écart visible ?\nune dent tournée ?',
    'Une première ligne courte\nUne suite explicative qui ne doit jamais disparaître :',
  ]) {
    const result = buildArticleBodyBlocks(body)
    assert.equal(result.length, 1)
    assert.equal(result[0].type, 'paragraph')
    assert.equal(result[0].text, body.replaceAll('\n', ' '))
  }
})

test('explicit headings, lists and quotations retain their structure', () => {
  assert.deepEqual(buildArticleBodyBlocks('## Le bilan\n\n- Examen\n- Questions\n\n> Votre consultation'), [
    { type: 'heading2', text: 'Le bilan' },
    { type: 'list', items: ['Examen', 'Questions'] },
    { type: 'quote', text: 'Votre consultation' },
  ])
})

test('repeated and accented headings have distinct stable anchor targets', () => {
  const page = { sections: [{ heading: 'Étapes du bilan' }, { heading: 'Étapes du bilan' }] }
  const outline = contentOutline(page)
  assert.equal(new Set(outline.map((item) => item.id)).size, 2)
  assert.equal(outline[0].id, 'section-1-etapes-du-bilan')
  assert.deepEqual(contentOutline(page), outline)
})
