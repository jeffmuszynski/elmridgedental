import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const logDir = path.join(root, 'seo-automation', 'local', 'logs');
const ledgerPath = path.join(root, 'seo-automation', 'local', 'ctr-optimizer-ledger.json');

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
    env: process.env,
  });
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

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function normalizePagePath(urlText) {
  if (!urlText) return '';
  const url = new URL(urlText);
  return url.pathname.replace(/\/+$/, '') || '/';
}

function recentlyChanged(ledger, recommendation) {
  const key = `${recommendation.localFile}|${recommendation.keyword}`;
  const latest = [...(ledger.entries || [])]
    .filter((entry) => entry.key === key)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];

  if (!latest) return false;
  const ageMs = Date.now() - Date.parse(latest.date);
  return Number.isFinite(ageMs) && ageMs < 1000 * 60 * 60 * 24 * 21;
}

function selectCandidate(recommendations, ledger) {
  return recommendations.find((item) => {
    if (!item.localFile || !item.suggestedTitle || !item.suggestedDescription) return false;
    if (item.confidence !== 'High') return false;
    if (Number(item.impressions || 0) < 50) return false;
    if (Number(item.position || 0) > 10) return false;
    if (Number(item.priority || 0) < 2) return false;
    if (!Array.isArray(item.reasons) || item.reasons.length === 0) return false;
    if (normalizePagePath(item.targetPage) !== normalizePagePath(item.currentRankingPage)) return false;
    if (recentlyChanged(ledger, item)) return false;
    if (item.currentTitle === item.suggestedTitle && item.currentDescription === item.suggestedDescription) return false;
    return true;
  });
}

function escapeHtmlAttr(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeJsString(text) {
  return String(text || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function replaceRequired(text, pattern, replacement, label) {
  if (!pattern.test(text)) throw new Error(`Could not replace ${label}.`);
  return text.replace(pattern, replacement);
}

function updateMetadata(file, title, description) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');
  const titleEscaped = escapeHtmlAttr(title);
  const descriptionEscaped = escapeHtmlAttr(description);

  html = replaceRequired(html, /<title>[\s\S]*?<\/title>/i, `<title>${titleEscaped}</title>`, 'title');
  html = replaceRequired(html, /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="description" content="${descriptionEscaped}" />`, 'meta description');
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${titleEscaped}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${descriptionEscaped}" />`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${titleEscaped}" />`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${descriptionEscaped}" />`);

  fs.writeFileSync(filePath, html);
}

function updateHomepageGenerator(title, description) {
  const file = path.join(root, 'agentic-rebuild.mjs');
  let source = fs.readFileSync(file, 'utf8');
  source = replaceRequired(
    source,
    /const homepageSeoTitle = '[^']*';/,
    `const homepageSeoTitle = '${escapeJsString(title)}';`,
    'homepageSeoTitle'
  );
  source = replaceRequired(
    source,
    /const homepageSeoDescription = '[^']*';/,
    `const homepageSeoDescription = '${escapeJsString(description)}';`,
    'homepageSeoDescription'
  );
  fs.writeFileSync(file, source);
}

function commitAndPush(candidate) {
  const files = [candidate.localFile];
  if (candidate.localFile === 'index.html') files.push('agentic-rebuild.mjs');

  run('git', ['add', ...files], { stdio: 'inherit' });
  const staged = run('git', ['diff', '--cached', '--name-only']).trim();
  if (!staged) return false;

  run('git', ['commit', '-m', `Test CTR metadata: ${candidate.keyword}`], { stdio: 'inherit' });
  run('git', ['push', 'origin', 'main'], { stdio: 'inherit' });
  return true;
}

async function main() {
  fs.mkdirSync(logDir, { recursive: true });
  ensureCleanWorktree();

  const audit = JSON.parse(run('node', ['scripts/seo-ctr-audit.mjs']));
  const ledger = readJson(ledgerPath, { entries: [] });
  const candidate = selectCandidate(audit.recommendations || [], ledger);

  if (!candidate) {
    const result = {
      ok: true,
      changed: false,
      completedAt: new Date().toISOString(),
      reason: 'No eligible high-confidence CTR metadata change.',
      recommendationCount: (audit.recommendations || []).length,
    };
    writeJson(path.join(logDir, `seo-auto-ctr-optimizer-${Date.now()}.json`), result);
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  updateMetadata(candidate.localFile, candidate.suggestedTitle, candidate.suggestedDescription);
  if (candidate.localFile === 'index.html') {
    updateHomepageGenerator(candidate.suggestedTitle, candidate.suggestedDescription);
  }

  run('npm', ['run', 'seo:test'], { stdio: 'inherit' });

  const committed = commitAndPush(candidate);
  const entry = {
    date: new Date().toISOString(),
    key: `${candidate.localFile}|${candidate.keyword}`,
    keyword: candidate.keyword,
    matchedQuery: candidate.matchedQuery,
    localFile: candidate.localFile,
    oldTitle: candidate.currentTitle,
    oldDescription: candidate.currentDescription,
    newTitle: candidate.suggestedTitle,
    newDescription: candidate.suggestedDescription,
    impressions: candidate.impressions,
    ctr: candidate.ctr,
    expectedCtr: candidate.expectedCtr,
    position: candidate.position,
    committed,
  };

  ledger.entries = [entry, ...(ledger.entries || [])].slice(0, 50);
  writeJson(ledgerPath, ledger);

  const result = {
    ok: true,
    changed: committed,
    completedAt: new Date().toISOString(),
    candidate: entry,
  };
  writeJson(path.join(logDir, `seo-auto-ctr-optimizer-${Date.now()}.json`), result);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
