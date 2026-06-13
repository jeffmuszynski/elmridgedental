import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createDryRunPlan } from './seo-gbp-dry-run.mjs';
import { assertCompactTaskPacket, logAIUsage } from './seo-ai-usage.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const draftsDir = path.join(root, 'seo-automation', 'drafts');
const promptPath = path.join(root, 'seo-automation', 'prompts', 'blog-draft.md');

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

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.resolve(root, file), 'utf8'));
}

function writeDraftFile(slug, suffix, payload) {
  fs.mkdirSync(draftsDir, { recursive: true });
  const file = path.join(draftsDir, `${slug}-${suffix}-${Date.now()}.json`);
  fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`);
  return file;
}

async function generateWithOpenAI({ prompt, plan }) {
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.SEO_OPENAI_MODEL || 'gpt-4.1';
  const messages = [
    { role: 'system', content: prompt },
    { role: 'user', content: JSON.stringify(plan, null, 2) },
  ];
  const requestStats = assertCompactTaskPacket({
    operation: 'seo_blog_draft',
    messages,
  });
  const response = await client.chat.completions.create({
    model,
    response_format: { type: 'json_object' },
    messages,
  });
  logAIUsage({
    operation: 'seo_blog_draft',
    model,
    requestStats,
    usage: response.usage,
    metadata: {
      primaryKeyword: plan.topic?.primaryKeyword || plan.blog?.primaryKeyword || null,
      slug: plan.blog?.slug || null,
    },
  });
  const content = response.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenAI returned an empty draft.');
  return JSON.parse(content);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const prompt = fs.readFileSync(promptPath, 'utf8');
  const plan = args.plan ? readJson(args.plan) : createDryRunPlan({ args });

  if (args['no-api'] || !process.env.OPENAI_API_KEY) {
    const packageFile = writeDraftFile(plan.blog.slug, 'prompt-package', {
      status: 'needs_llm',
      reason: process.env.OPENAI_API_KEY ? 'no-api flag supplied' : 'OPENAI_API_KEY is not configured',
      prompt,
      plan,
    });
    console.log(JSON.stringify({ mode: 'no-api', packageFile }, null, 2));
    return;
  }

  try {
    const draft = await generateWithOpenAI({ prompt, plan });
    const draftFile = writeDraftFile(plan.blog.slug, 'draft', draft);
    console.log(JSON.stringify({ mode: 'generated', draftFile }, null, 2));
  } catch (error) {
    const packageFile = writeDraftFile(plan.blog.slug, 'api-error-prompt-package', {
      status: 'needs_llm',
      reason: error.message,
      prompt,
      plan,
    });
    console.log(JSON.stringify({ mode: 'api-error', packageFile, reason: error.message }, null, 2));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
