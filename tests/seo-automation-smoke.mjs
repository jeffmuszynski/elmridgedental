import assert from 'assert/strict';
import { createDryRunPlan } from '../scripts/seo-gbp-dry-run.mjs';

const plan = createDryRunPlan({
  args: {
    topic: 'toothache at night killeen tx',
    bucket: 'emergency',
  },
});

assert.equal(plan.mode, 'dry-run');
assert.equal(plan.topic.bucket, 'emergency');
assert.ok(plan.blog.slug.includes('toothache'));
assert.ok(plan.blog.url.startsWith('https://www.elmridgedental.com/blog/'));
assert.ok(plan.blog.internalLinks.length > 0);
assert.ok(plan.gbp.caption.includes('Elm Ridge'));
assert.ok(plan.gbp.imageUrl, 'expected a GBP image selection');
assert.ok(plan.nextActions.length >= 4);

console.log('SEO automation smoke test passed.');
