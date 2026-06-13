import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
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

function buildCtrExportUrl() {
  const topicUrl = process.env.SEO_TOPIC_QUEUE_URL;
  const explicitUrl = process.env.SEO_CTR_OPPORTUNITIES_URL;
  const sourceUrl = explicitUrl || topicUrl;

  if (!sourceUrl) {
    throw new Error('SEO_TOPIC_QUEUE_URL or SEO_CTR_OPPORTUNITIES_URL is required.');
  }

  const url = new URL(sourceUrl);
  url.searchParams.set('action', 'seoCtrOpportunities');
  if (!url.searchParams.has('limit')) url.searchParams.set('limit', '10');
  return url.toString();
}

function localFileForPage(pageUrl) {
  const url = new URL(pageUrl);
  const cleanPath = url.pathname.replace(/^\/+|\/+$/g, '') || 'index.html';
  const candidates = cleanPath.endsWith('.html')
    ? [cleanPath]
    : [cleanPath, path.join(cleanPath, 'index.html'), `${cleanPath}.html`];

  return candidates.find((candidate) => fs.existsSync(path.join(root, candidate))) || null;
}

function extractMetadata(file) {
  if (!file) return {};
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]?.replace(/\s+/g, ' ').trim() || '';
  const description = (html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i) || [])[1]?.replace(/\s+/g, ' ').trim() || '';
  return { title, description };
}

function titleCaseKeyword(keyword) {
  const keepLower = new Set(['a', 'an', 'and', 'for', 'in', 'near', 'of', 'on', 'or', 'the', 'to', 'vs']);
  return String(keyword || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index > 0 && keepLower.has(lower)) return lower;
      if (lower === 'tx') return 'TX';
      if (lower === 'all' && /on/i.test(keyword)) return 'All';
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ')
    .replace(/\bAll on 4\b/i, 'All-on-4');
}

function humanizeKeyword(keyword) {
  return String(keyword || '')
    .replace(/\bnear me\b/gi, '')
    .replace(/\btx\b/gi, 'TX')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasServiceIntentMismatch(item) {
  const keyword = String(item.keyword || '').toLowerCase();
  const query = String(item.matchedQuery || '').toLowerCase();

  const serviceTokens = [
    'implant',
    'denture',
    'emergency',
    'cosmetic',
    'veneer',
    'crown',
    'root canal',
    'sleep apnea',
    'invisalign',
  ];

  return serviceTokens.some((token) => keyword.includes(token) && !query.includes(token));
}

function compact(text, max) {
  if (text.length <= max) return text;
  const shortened = text.slice(0, max - 1).replace(/\s+\S*$/, '');
  return `${shortened}.`;
}

function buildSuggestedTitle(item) {
  const keyword = titleCaseKeyword(humanizeKeyword(item.keyword || item.matchedQuery));
  const category = String(item.category || '').toLowerCase();

  if (category.includes('full arch')) return compact(`${keyword} in Killeen, TX | Fixed Teeth Options`, 62);
  if (category.includes('implant denture')) return compact(`${keyword} | Stable Denture Options in Killeen`, 62);
  if (category.includes('emergency')) return compact(`${keyword} | Same-Day Help When Possible`, 62);
  if (category.includes('cosmetic')) return compact(`${keyword} | Natural-Looking Smile Options`, 62);
  if (category.includes('location')) return compact(`${keyword} | Private Dental Office Nearby`, 62);
  if (category.includes('core local')) return 'Killeen Dentist | Private Office & 550+ Reviews';
  return compact(`${keyword} | Elm Ridge Dentist in Killeen, TX`, 62);
}

function buildSuggestedDescription(item) {
  const keyword = humanizeKeyword(item.keyword || item.matchedQuery || 'dental care').toLowerCase();
  const category = String(item.category || '').toLowerCase();

  if (category.includes('full arch')) {
    return compact(`Learn ${keyword} options in Killeen with CBCT planning, clear cost factors, financing guidance, and care from a private implant-focused dental office.`, 158);
  }
  if (category.includes('implant denture')) {
    return compact(`Compare ${keyword} options in Killeen, including stability, cost factors, timeline, and fit. Elm Ridge explains choices before treatment starts.`, 158);
  }
  if (category.includes('emergency')) {
    return compact(`Need an emergency dentist in Killeen? Call Elm Ridge for tooth pain, swelling, broken teeth, or lost crowns. Same-day visits when possible.`, 158);
  }
  if (category.includes('cosmetic')) {
    return compact(`Explore ${keyword} options in Killeen, including veneers, bonding, whitening, aligners, and crowns designed for natural-looking results.`, 158);
  }
  return compact(`Visit Elm Ridge for private dental care in Killeen, clear explanations, modern technology, calmer visits, and 550+ five-star reviews.`, 158);
}

function scoreMetadataGap(item, metadata) {
  const title = metadata.title || '';
  const description = metadata.description || '';
  const keyword = String(item.keyword || '').toLowerCase();
  let score = 0;
  const reasons = [];

  if (!title.toLowerCase().includes(keyword.split(/\s+/)[0])) {
    score += 1;
    reasons.push('title may not lead with the query intent');
  }
  if (!/review|550|private|same-day|cost|CBCT|financing/i.test(`${title} ${description}`)) {
    score += 1;
    reasons.push('snippet lacks a strong click reason');
  }
  if (description.length > 160) {
    score += 1;
    reasons.push('meta description is likely long enough to truncate');
  }
  if (Number(item.ctr || 0) < Number(item.expectedCtr || 0) / 2) {
    score += 1;
    reasons.push('CTR is less than half the expected floor');
  }
  if (hasServiceIntentMismatch(item)) {
    score += 2;
    reasons.push('matched query appears broader than the target keyword; confirm whether this is a CTR issue or a target matching issue');
  }

  return { score, reasons };
}

async function main() {
  loadEnvLocal();
  const response = await fetch(buildCtrExportUrl(), { redirect: 'follow' });
  if (!response.ok) throw new Error(`CTR export failed with HTTP ${response.status}`);

  const payload = await response.json();
  if (payload.ok === false) throw new Error(payload.error || 'CTR export returned ok=false.');

  const opportunities = Array.isArray(payload.opportunities) ? payload.opportunities : [];
  const recommendations = opportunities.map((item) => {
    const pageUrl = item.targetPage || item.currentRankingPage;
    const file = pageUrl ? localFileForPage(pageUrl) : null;
    const metadata = extractMetadata(file);
    const gap = scoreMetadataGap(item, metadata);

    return {
      keyword: item.keyword,
      matchedQuery: item.matchedQuery,
      category: item.category,
      targetPage: item.targetPage,
      currentRankingPage: item.currentRankingPage,
      localFile: file,
      impressions: item.impressions,
      clicks: item.clicks,
      ctr: item.ctr,
      expectedCtr: item.expectedCtr,
      position: item.position,
      confidence: item.confidence,
      currentTitle: metadata.title || '',
      currentDescription: metadata.description || '',
      suggestedTitle: hasServiceIntentMismatch(item) ? '' : buildSuggestedTitle(item),
      suggestedDescription: hasServiceIntentMismatch(item) ? '' : buildSuggestedDescription(item),
      suggestedAction: hasServiceIntentMismatch(item)
        ? 'Review Target_Keywords matching before changing title/meta. The ranking query is broader than the target service keyword.'
        : 'Test title/meta rewrite after confirming this page is the correct landing page for the query.',
      reasons: gap.reasons,
      priority: gap.score + Math.min(3, Math.floor(Number(item.impressions || 0) / 50)),
    };
  }).sort((a, b) => b.priority - a.priority || Number(b.impressions || 0) - Number(a.impressions || 0));

  const result = {
    ok: true,
    generatedAt: new Date().toISOString(),
    sourceLabel: payload.sourceLabel || payload.source || 'apps-script-seo-export',
    recommendations,
  };

  fs.mkdirSync(logDir, { recursive: true });
  fs.writeFileSync(path.join(logDir, `seo-ctr-audit-${Date.now()}.json`), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
