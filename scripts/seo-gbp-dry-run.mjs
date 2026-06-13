import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultConfigPath = path.join(root, 'seo-automation', 'config.json');
const defaultLedgerPath = path.join(root, 'seo-automation', 'ledger.json');
const defaultQueuePath = path.join(root, 'seo-automation', 'topic-queue.example.json');
const defaultImagesPath = path.join(root, 'gbp', 'images.json');
const defaultSitemapPath = path.join(root, 'sitemap.xml');
const draftsDir = path.join(root, 'seo-automation', 'drafts');

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
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value) {
  return normalize(value)
    .replace(/\b(tx|texas)\b/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function titleCase(value) {
  const small = new Set(['a', 'an', 'and', 'at', 'for', 'in', 'near', 'of', 'or', 'the', 'to', 'vs', 'with']);
  return normalize(value)
    .split(' ')
    .map((word, index) => {
      if (index > 0 && small.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ')
    .replace(/\bTx\b/g, 'TX')
    .replace(/\bGbp\b/g, 'GBP');
}

function localizeTitle(value) {
  const patientPhrase = normalize(value)
    .replace(/\b(tx|texas)\b/g, ' ')
    .replace(/\bnear me\b/g, 'in killeen')
    .replace(/\s+/g, ' ')
    .trim();
  const withoutKilleen = patientPhrase
    .replace(/\bin killeen\b/g, ' ')
    .replace(/\bkilleen\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return `${titleCase(withoutKilleen)} in Killeen, TX`;
}

function keywordTokens(value) {
  const stop = new Set(['a', 'an', 'and', 'are', 'at', 'can', 'do', 'does', 'for', 'how', 'i', 'in', 'is', 'it', 'killeen', 'me', 'near', 'of', 'or', 'the', 'to', 'tx', 'vs', 'what', 'when', 'with']);
  return normalize(value)
    .split(' ')
    .filter((token) => token.length > 2 && !stop.has(token));
}

function bucketForTopic(topic, config) {
  if (topic.bucket) return topic.bucket;
  const text = normalize(`${topic.primaryKeyword} ${topic.intent || ''}`);
  let best = config.strategyBuckets[0];
  let bestScore = -1;
  for (const bucket of config.strategyBuckets) {
    const score = bucket.topics.reduce((sum, phrase) => sum + (text.includes(normalize(phrase)) ? 3 : 0), 0) + Number(bucket.weight || 0);
    if (score > bestScore) {
      best = bucket;
      bestScore = score;
    }
  }
  return best.id;
}

function recentlyUsedScore(topic, ledger) {
  const keyword = normalize(topic.primaryKeyword);
  const bucket = normalize(topic.bucket);
  return ledger.entries.reduce((score, entry) => {
    const entryKeyword = normalize(entry.primaryKeyword);
    if (entryKeyword === keyword) return score + 100;
    if (entryKeyword.includes(keyword) || keyword.includes(entryKeyword)) return score + 50;
    if (bucket && normalize(entry.bucket) === bucket) return score + 3;
    return score;
  }, 0);
}

function chooseTopic({ args, config, ledger, queue }) {
  if (args.topic) {
    return {
      primaryKeyword: args.topic,
      bucket: args.bucket || bucketForTopic({ primaryKeyword: args.topic }, config),
      intent: args.intent || 'patient education',
      priority: Number(args.priority || 100),
      source: 'cli',
    };
  }

  const enriched = queue.topics.map((topic) => {
    const bucket = bucketForTopic(topic, config);
    return {
      ...topic,
      bucket,
      rotationPenalty: recentlyUsedScore({ ...topic, bucket }, ledger),
      strategyWeight: config.strategyBuckets.find((item) => item.id === bucket)?.weight || 0,
    };
  });

  enriched.sort((a, b) => {
    const aScore = Number(a.priority || 0) + Number(a.strategyWeight || 0) - Number(a.rotationPenalty || 0);
    const bScore = Number(b.priority || 0) + Number(b.strategyWeight || 0) - Number(b.rotationPenalty || 0);
    return bScore - aScore;
  });

  return enriched[0];
}

function readSitemap(file) {
  const xml = fs.readFileSync(file, 'utf8');
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

function scoreText(text, tokens) {
  const normalized = normalize(text);
  return tokens.reduce((score, token) => score + (normalized.includes(token) ? 1 : 0), 0);
}

function chooseInternalLinks(topic, urls) {
  const tokens = keywordTokens(topic.primaryKeyword);
  const scored = urls
    .filter((url) => !url.includes('/blog/'))
    .map((url) => ({ url, score: scoreText(url, tokens) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.url.localeCompare(b.url));

  const required = [
    'https://www.elmridgedental.com/request-appointment',
    'https://www.elmridgedental.com/services',
    'https://www.elmridgedental.com/insurance-and-financing',
  ];

  return [...scored.map((item) => item.url), ...required]
    .filter((url, index, all) => all.indexOf(url) === index)
    .slice(0, 6);
}

function chooseImage(topic, imagesJson) {
  const tokens = keywordTokens(`${topic.primaryKeyword} ${topic.bucket} ${topic.intent || ''}`);
  const bucketCategoryBoosts = {
    implants: ['implants'],
    emergency: ['restorative'],
    cosmetic: ['cosmetic'],
    family: ['practice', 'restorative'],
    sleep: ['sleep apnea'],
  };
  const scored = imagesJson.images
    .map((image) => {
      const haystack = `${image.id} ${image.category} ${(image.topics || []).join(' ')} ${image.alt} ${image.recommendedUse}`;
      const category = normalize(image.category);
      const categoryBoost = (bucketCategoryBoosts[topic.bucket] || []).some((item) => category.includes(item)) ? 2 : 0;
      const exactTopicBoost = (image.topics || []).some((item) => normalize(topic.primaryKeyword).includes(normalize(item)) || normalize(item).includes(normalize(topic.primaryKeyword))) ? 3 : 0;
      const score = scoreText(haystack, tokens) + categoryBoost + exactTopicBoost + (image.largeFile ? -2 : 0);
      return { image, score };
    })
    .sort((a, b) => b.score - a.score || a.image.id.localeCompare(b.image.id));

  return scored[0]?.image;
}

function buildOutline(topic, bucketLabel) {
  const localTitle = localizeTitle(topic.primaryKeyword);
  const shortTitle = localTitle.replace(' in Killeen, TX', '');
  return {
    title: localTitle,
    metaDescription: `${localTitle}: clear, patient-friendly guidance from Elm Ridge Implant and Family Dentistry in Killeen, TX.`,
    sections: [
      'Quick answer',
      `Why patients search for ${shortTitle}`,
      `What affects the answer for ${bucketLabel.toLowerCase()}`,
      'When to call a dentist',
      'What Elm Ridge may check',
      'Cost, insurance, and next steps',
      'FAQ',
    ],
    faqIdeas: [
      `Is ${shortTitle.toLowerCase()} something I should ask a dentist about?`,
      'Can you give an exact answer online?',
      'Will insurance cover treatment?',
      'How do I schedule a visit?',
    ],
  };
}

function buildGbpPost(topic, outline, image) {
  const keyword = normalize(topic.primaryKeyword);
  const isEmergency = keyword.includes('toothache') || keyword.includes('emergency') || keyword.includes('broken') || keyword.includes('abscess');
  const opening = isEmergency
    ? 'Dental symptoms can be stressful, especially when pain changes or gets worse.'
    : `${outline.title} is a common question for patients comparing dental options.`;
  const caption = `${opening} Elm Ridge Implant and Family Dentistry in Killeen helps patients understand the cause, options, timing, and estimated costs before treatment decisions are made.\n\nIf you want a personalized answer, request a visit or call 254-699-4127.`;

  return {
    caption,
    imageId: image?.id || null,
    imageUrl: image?.url || null,
    callToAction: 'CALL',
    phone: '254-699-4127',
  };
}

export function createDryRunPlan(options = {}) {
  const args = options.args || {};
  const config = options.config || readJson(args.config || defaultConfigPath);
  const ledger = options.ledger || readJson(args.ledger || defaultLedgerPath);
  const queue = options.queue || readJson(args.queue || defaultQueuePath);
  const imagesJson = options.imagesJson || readJson(args.images || defaultImagesPath);
  const urls = options.urls || readSitemap(args.sitemap || defaultSitemapPath);

  const topic = chooseTopic({ args, config, ledger, queue });
  const bucket = config.strategyBuckets.find((item) => item.id === topic.bucket) || config.strategyBuckets[0];
  const slug = slugify(topic.primaryKeyword);
  const blogPath = `/blog/${slug}`;
  const image = chooseImage(topic, imagesJson);
  const outline = buildOutline(topic, bucket.label);
  const internalLinks = chooseInternalLinks(topic, urls);
  const gbpPost = buildGbpPost(topic, outline, image);

  return {
    generatedAt: new Date().toISOString(),
    mode: 'dry-run',
    topic,
    strategy: {
      bucket: bucket.id,
      bucketLabel: bucket.label,
      duplicateRiskScore: recentlyUsedScore(topic, ledger),
      guardrails: config.guardrails,
    },
    blog: {
      slug,
      path: blogPath,
      url: `${config.practice.domain}${blogPath}`,
      ...outline,
      internalLinks,
    },
    gbp: gbpPost,
    nextActions: [
      'Generate first draft with approved LLM prompt.',
      'Run second-pass review for accuracy, local relevance, duplication, and guardrails.',
      'Write blog HTML only after review passes.',
      'Publish GBP post only after Google Business Profile credentials are connected.',
      'Append final publish details to seo-automation/ledger.json.',
    ],
  };
}

function writeDraft(plan) {
  fs.mkdirSync(draftsDir, { recursive: true });
  const file = path.join(draftsDir, `${plan.blog.slug}-${Date.now()}.json`);
  fs.writeFileSync(file, `${JSON.stringify(plan, null, 2)}\n`);
  return file;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const plan = createDryRunPlan({ args });
  const output = args.write ? { ...plan, draftFile: writeDraft(plan) } : plan;
  console.log(JSON.stringify(output, null, 2));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
