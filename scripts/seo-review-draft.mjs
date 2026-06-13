import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { assertCompactTaskPacket, logAIUsage } from './seo-ai-usage.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const draftsDir = path.join(root, 'seo-automation', 'drafts');
const promptPath = path.join(root, 'seo-automation', 'prompts', 'second-pass-review.md');

function loadEnvLocal() {
  const envPath = path.join(root, '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (!process.env[key]) process.env[key] = rest.join('=').replace(/^['"]|['"]$/g, '');
  }
}

loadEnvLocal();

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith('--')) continue;
    const key = value.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      index += 1;
    }
  }
  return args;
}

function slugFromDraft(draft) {
  return String(draft.slug || draft.finalDraft?.slug || draft.primaryKeyword || draft.title || 'review')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function writeReviewFile(slug, suffix, payload) {
  fs.mkdirSync(draftsDir, { recursive: true });
  const file = path.join(draftsDir, `${slug}-${suffix}-${Date.now()}.json`);
  fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`);
  return file;
}

async function reviewWithOpenAI({ prompt, draft }) {
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.SEO_OPENAI_MODEL || 'gpt-4.1';
  const messages = [
    { role: 'system', content: prompt },
    { role: 'user', content: JSON.stringify(draft, null, 2) },
  ];
  const requestStats = assertCompactTaskPacket({
    operation: 'seo_blog_review',
    messages,
  });
  const response = await client.chat.completions.create({
    model,
    response_format: { type: 'json_object' },
    messages,
  });
  logAIUsage({
    operation: 'seo_blog_review',
    model,
    requestStats,
    usage: response.usage,
    metadata: {
      slug: slugFromDraft(draft),
      primaryKeyword: draft.primaryKeyword || draft.finalDraft?.primaryKeyword || null,
    },
  });
  const content = response.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenAI returned an empty review.');
  return JSON.parse(content);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input) throw new Error('Usage: npm run seo:review-draft -- --input seo-automation/drafts/example.json [--no-api]');

  const prompt = fs.readFileSync(promptPath, 'utf8');
  const draft = JSON.parse(fs.readFileSync(path.resolve(root, args.input), 'utf8'));
  const slug = slugFromDraft(draft);

  if (args['no-api'] || !process.env.OPENAI_API_KEY) {
    const reviewPackageFile = writeReviewFile(slug, 'review-package', {
      status: 'needs_llm_review',
      reason: process.env.OPENAI_API_KEY ? 'no-api flag supplied' : 'OPENAI_API_KEY is not configured',
      prompt,
      draft,
    });
    console.log(JSON.stringify({ mode: 'no-api', reviewPackageFile }, null, 2));
    return;
  }

  try {
    const review = await reviewWithOpenAI({ prompt, draft });
    const reviewFile = writeReviewFile(slug, 'review', review);
    console.log(JSON.stringify({ mode: 'reviewed', reviewFile }, null, 2));
  } catch (error) {
    const reviewPackageFile = writeReviewFile(slug, 'api-error-review-package', {
      status: 'needs_llm_review',
      reason: error.message,
      prompt,
      draft,
    });
    console.log(JSON.stringify({ mode: 'api-error', reviewPackageFile, reason: error.message }, null, 2));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
