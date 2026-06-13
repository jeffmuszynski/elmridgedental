import assert from 'assert/strict';
import { createDryRunPlan } from '../scripts/seo-gbp-dry-run.mjs';
import { renderBlogHtml } from '../scripts/seo-render-blog.mjs';
import exampleDraft from '../seo-automation/reviewed-blog-draft.example.json' with { type: 'json' };

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

const html = renderBlogHtml(exampleDraft);
assert.ok(html.includes('<h1'));
assert.ok(html.includes('How Long Do Dental Implants Last in Killeen, TX'));
assert.ok(html.includes('data-schema="blog-posting"'));
assert.ok(!html.includes('<script>alert'));

console.log('SEO automation smoke test passed.');
