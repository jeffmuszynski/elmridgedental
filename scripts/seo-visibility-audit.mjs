import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const logDir = path.join(root, 'seo-automation', 'local', 'logs');

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function has(text, pattern) {
  return typeof pattern === 'string' ? text.includes(pattern) : pattern.test(text);
}

function check(condition, id, message, details = {}) {
  return {
    id,
    ok: Boolean(condition),
    severity: condition ? 'ok' : 'error',
    message,
    details,
  };
}

function warn(condition, id, message, details = {}) {
  return {
    id,
    ok: Boolean(condition),
    severity: condition ? 'ok' : 'warning',
    message,
    details,
  };
}

function extractJsonLd(html) {
  return [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => {
      try {
        return JSON.parse(match[1]);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function daysSince(dateText) {
  const time = Date.parse(dateText);
  if (!Number.isFinite(time)) return Infinity;
  return Math.floor((Date.now() - time) / 86400000);
}

async function liveCheck(url) {
  try {
    const response = await fetch(url, { redirect: 'follow' });
    return {
      url,
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get('content-type') || '',
    };
  } catch (error) {
    return {
      url,
      ok: false,
      status: 0,
      error: error.message,
    };
  }
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const robots = read('robots.txt');
  const llms = read('llms.txt');
  const aiSummary = read('ai-summary');
  const sitemap = read('sitemap.xml');
  const home = read('index.html');
  const ledger = JSON.parse(read('seo-automation/ledger.json'));
  const homeSchemas = extractJsonLd(home);
  const aiSchemas = extractJsonLd(aiSummary);

  const requiredBots = [
    'Googlebot',
    'Bingbot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'GPTBot',
    'PerplexityBot',
    'ClaudeBot',
  ];

  const checks = [
    check(has(robots, 'Sitemap: https://www.elmridgedental.com/sitemap.xml'), 'robots-sitemap', 'robots.txt advertises the sitemap.'),
    ...requiredBots.map((bot) => check(has(robots, `User-agent: ${bot}`) && has(robots, 'Allow: /'), `robots-${bot}`, `${bot} is explicitly allowed.`)),
    check(has(llms, 'Canonical URL: https://www.elmridgedental.com'), 'llms-canonical', 'llms.txt includes canonical site identity.'),
    check(has(llms, 'Elm Ridge Implant and Family Dentistry'), 'llms-practice-name', 'llms.txt names the practice.'),
    check(has(llms, '2601 E Elms Rd'), 'llms-address', 'llms.txt includes the address.'),
    check(has(llms, 'No Medicaid'), 'llms-negative-facts', 'llms.txt includes important negative facts.'),
    check(has(aiSummary, '<meta name="robots" content="index, follow"'), 'ai-summary-indexable', '/ai-summary is indexable.'),
    check(has(aiSummary, 'data-schema="ai_summary_webpage"'), 'ai-summary-schema', '/ai-summary has WebPage schema.'),
    check(has(sitemap, '<loc>https://www.elmridgedental.com/ai-summary</loc>'), 'sitemap-ai-summary', 'Sitemap includes /ai-summary.'),
    check(has(sitemap, '<loc>https://www.elmridgedental.com/llms.txt</loc>'), 'sitemap-llms', 'Sitemap includes llms.txt.'),
    check(homeSchemas.some((schema) => schema['@id'] === 'https://www.elmridgedental.com/#dentist' || schema['@type'] === 'Dentist'), 'schema-dentist', 'Home page exposes Dentist schema.'),
    check(homeSchemas.some((schema) => schema['@id'] === 'https://www.elmridgedental.com/#organization' || schema['@type'] === 'Organization'), 'schema-organization', 'Home page exposes Organization schema.'),
    check(homeSchemas.some((schema) => Array.isArray(schema) && schema.some((item) => item['@id'] === 'https://www.elmridgedental.com/#dr-jeff')), 'schema-doctors', 'Home page exposes doctor Person schemas.'),
    check(aiSchemas.some((schema) => schema['@type'] === 'WebPage' && schema.url === 'https://www.elmridgedental.com/ai-summary'), 'schema-ai-summary', '/ai-summary exposes WebPage schema.'),
  ];

  const latestBlog = ledger.entries
    .filter((entry) => entry.type === 'blog')
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];

  checks.push(warn(latestBlog && daysSince(latestBlog.date) <= 14, 'blog-cadence', 'A blog was published in the last 14 days.', latestBlog || {}));

  const live = args.has('--live')
    ? await Promise.all([
        liveCheck('https://www.elmridgedental.com/robots.txt'),
        liveCheck('https://www.elmridgedental.com/llms.txt'),
        liveCheck('https://www.elmridgedental.com/ai-summary'),
        liveCheck('https://www.elmridgedental.com/sitemap.xml'),
      ])
    : [];

  const result = {
    ok: checks.every((item) => item.ok || item.severity === 'warning') && live.every((item) => item.ok),
    generatedAt: new Date().toISOString(),
    checks,
    live,
  };

  fs.mkdirSync(logDir, { recursive: true });
  fs.writeFileSync(path.join(logDir, `seo-visibility-audit-${Date.now()}.json`), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
