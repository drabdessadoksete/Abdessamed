import assert from 'node:assert/strict'
import test from 'node:test'
import { classifyAnalyticsSource } from './analyticsSource.js'

test('AI sources are distinguished from traditional search without recording prompts', () => {
  for (const [host, expected] of [
    ['chatgpt.com', 'chatgpt'], ['chat.openai.com', 'chatgpt'], ['www.perplexity.ai', 'perplexity'],
    ['gemini.google.com', 'gemini'], ['claude.ai', 'claude'], ['copilot.microsoft.com', 'copilot'],
    ['www.google.fr', 'google'], ['www.bing.com', 'bing'],
  ]) assert.equal(classifyAnalyticsSource({ referrer: `https://${host}/conversation?prompt=private` }), expected)
})

test('campaign attribution accepts known sources and rejects impersonating domains', () => {
  assert.equal(classifyAnalyticsSource({ utmSource: 'chatgpt.com' }), 'chatgpt')
  assert.equal(classifyAnalyticsSource({ utmSource: ' newsletter ' }), 'newsletter')
  assert.equal(classifyAnalyticsSource({ referrer: 'https://google.fr.evil.test/' }), 'referral')
  assert.equal(classifyAnalyticsSource({ referrer: 'https://notchatgpt.com/' }), 'referral')
  assert.equal(classifyAnalyticsSource({ utmSource: 'patient-private-value' }), 'campaign')
})

test('direct, internal and malformed traffic have safe fallback labels', () => {
  assert.equal(classifyAnalyticsSource(), 'direct')
  assert.equal(classifyAnalyticsSource({ utmSource: null, referrer: 'https://chatgpt.com/' }), 'chatgpt')
  assert.equal(classifyAnalyticsSource({ referrer: 'https://www.cabinetdentairesete.fr/blog/', hostname: 'cabinetdentairesete.fr' }), 'direct')
  assert.equal(classifyAnalyticsSource({ referrer: 'malformed private data' }), 'other')
})
