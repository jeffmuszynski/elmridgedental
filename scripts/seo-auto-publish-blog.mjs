import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lockPath = path.join(root, 'seo-automation', 'local', 'blog-auto-publish.lock');
const logDir = path.join(root, 'seo-automation', 'local', 'logs');

function loadEnvLocal() {
  const envPath = path.join(root, '.env.local');
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (!process.env[key]) process.env[key] = rest.join('=').replace(/^['"]|['"]$/g, '');
  }
}

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
    env: process.env,
  });
}

function runJson(command, args) {
  const output = run(command, args);
  return JSON.parse(output);
}

function ensureCleanWorktree() {
  const status = run('git', ['status', '--porcelain', '--untracked-files=all']);
  const meaningful = status
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => !line.includes('seo-automation/local/') && !line.includes('seo-automation/drafts/'));

  if (meaningful.length) {
    throw new Error(`Worktree has existing uncommitted changes:\n${meaningful.join('\n')}`);
  }
}

function withLock(fn) {
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });

  if (fs.existsSync(lockPath)) {
    const ageMs = Date.now() - fs.statSync(lockPath).mtimeMs;
    if (ageMs < 1000 * 60 * 60 * 6) {
      throw new Error(`Blog automation lock exists: ${lockPath}`);
    }
  }

  fs.writeFileSync(lockPath, `${process.pid}\n${new Date().toISOString()}\n`);
  try {
    return fn();
  } finally {
    fs.rmSync(lockPath, { force: true });
  }
}

function newestGeneratedFile(result, key) {
  const file = result[key];
  if (!file) throw new Error(`Expected ${key} in command output.`);
  return path.relative(root, path.resolve(root, file));
}

function commitAndPush(reviewFile, renderResult) {
  const changedFiles = new Set([
    'blog/index.html',
    'sitemap.xml',
    'seo-automation/ledger.json',
  ]);

  for (const update of renderResult.updates || []) {
    if (update.changed && update.file) changedFiles.add(path.relative(root, update.file));
  }

  const files = [...changedFiles].filter((file) => fs.existsSync(path.join(root, file)));
  run('git', ['add', ...files], { stdio: 'inherit' });

  const staged = run('git', ['diff', '--cached', '--name-only']).trim();
  if (!staged) {
    throw new Error('No staged changes after blog render.');
  }

  const draft = JSON.parse(fs.readFileSync(path.join(root, reviewFile), 'utf8'));
  const title = draft.finalDraft?.title || draft.title || 'SEO blog post';
  run('git', ['commit', '-m', `Publish SEO blog: ${title}`], { stdio: 'inherit' });
  run('git', ['push', 'origin', 'main'], { stdio: 'inherit' });
}

function main() {
  loadEnvLocal();
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required in .env.local or the environment.');
  }

  fs.mkdirSync(logDir, { recursive: true });

  withLock(() => {
    ensureCleanWorktree();

    const generated = runJson('node', ['scripts/seo-generate-draft.mjs', '--queue', 'seo-automation/topic-queue.example.json']);
    const draftFile = newestGeneratedFile(generated, 'draftFile');

    const reviewed = runJson('node', ['scripts/seo-review-draft.mjs', '--input', draftFile]);
    const reviewFile = newestGeneratedFile(reviewed, 'reviewFile');

    const renderResult = runJson('node', ['scripts/seo-render-blog.mjs', '--input', reviewFile, '--write']);

    run('npm', ['run', 'seo:test'], { stdio: 'inherit' });
    commitAndPush(reviewFile, renderResult);

    const summary = {
      ok: true,
      completedAt: new Date().toISOString(),
      draftFile,
      reviewFile,
      outputPath: renderResult.outputPath,
    };
    fs.writeFileSync(path.join(logDir, `blog-auto-publish-${Date.now()}.json`), `${JSON.stringify(summary, null, 2)}\n`);
    console.log(JSON.stringify(summary, null, 2));
  });
}

main();
