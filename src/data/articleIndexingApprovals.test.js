import test from 'node:test'
import assert from 'node:assert/strict'
import { approvedArticleUrls, isArticleIndexable } from './articleIndexingApprovals.js'
import { blogPages } from './seoContent.js'

test('all 15 owner-approved articles are indexable without inventing review attribution', () => {
  assert.equal(approvedArticleUrls.size, 15)
  for (const url of approvedArticleUrls) {
    const page = blogPages.find((article) => article.url === url)
    assert.ok(page, `Approval has no article: ${url}`)
    assert.equal(page.indexable, true, url)
    assert.equal(page.medicalReviewer, null, 'An approval must not fabricate a reviewer')
  }
})

test('new articles still need approval or an identified completed review', () => {
  const page = { url: '/blog/future-article/' }
  assert.equal(isArticleIndexable(page), false)
  assert.equal(isArticleIndexable({ ...page, medicalReviewStatus: 'reviewed' }), false)
  assert.equal(isArticleIndexable({ ...page, medicalReviewStatus: 'pending', medicalReviewer: 'Reviewer' }), false)
  assert.equal(isArticleIndexable({ ...page, medicalReviewStatus: 'reviewed', medicalReviewer: 'Reviewer' }), true)
})
