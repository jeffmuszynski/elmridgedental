import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  breadcrumb,
  domain,
  faqSchema,
  footer,
  head,
  header,
  jsonLd,
  menuScript,
  withHeadSchemas,
} from '../site-helpers.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ledgerPath = path.join(root, 'seo-automation', 'ledger.json');

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

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizeSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function imageUrl(value) {
  if (!value) return `${domain}/Building.webp`;
  const image = String(value);
  if (/^https?:\/\//i.test(image)) return image;
  return `${domain}/${image.replace(/^\/+/, '')}`;
}

function imageSrc(value) {
  if (!value) return '';
  const image = String(value);
  if (/^https?:\/\//i.test(image)) return image;
  return `/${image.replace(/^\/+/, '')}`;
}

function cleanSectionHtml(html) {
  return String(html || '')
    .replace(/<\s*(script|style|iframe|object|embed|form|input|button|textarea|select)[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|style|iframe|object|embed|form|input|button|textarea|select)[^>]*\/?>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\s(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, ' $1="#"');
}

function normalizeDraft(rawDraft) {
  const hasReviewedDraft = Boolean(rawDraft.finalDraft);
  const draft = hasReviewedDraft ? rawDraft.finalDraft : rawDraft;
  if (hasReviewedDraft && rawDraft.status !== 'approved') {
    throw new Error(`Review is not approved: ${rawDraft.status || 'missing status'}`);
  }
  if (!hasReviewedDraft && rawDraft.status && rawDraft.status !== 'approved') {
    throw new Error(`Draft is not approved: ${rawDraft.status}`);
  }

  const slug = normalizeSlug(draft.slug || draft.primaryKeyword || draft.title);
  if (!slug) throw new Error('Draft needs a slug, title, or primaryKeyword.');
  if (!draft.title) throw new Error('Draft needs a title.');
  if (!draft.description) throw new Error('Draft needs a description.');
  if (!Array.isArray(draft.sections) || draft.sections.length === 0) {
    throw new Error('Draft needs at least one section.');
  }

  return {
    ...draft,
    status: 'approved',
    slug,
    category: draft.category || 'Patient Education',
    heroIntro: draft.heroIntro || draft.description,
    faq: Array.isArray(draft.faq) ? draft.faq : [],
    relatedLinks: Array.isArray(draft.relatedLinks) ? draft.relatedLinks : [],
  };
}

function relatedLinksHtml(links) {
  if (!links.length) return '';
  const items = links
    .filter((link) => link.href && link.label)
    .map((link) => `<a href="${escapeHtml(link.href)}" class="inline-flex border border-teal-light bg-white px-4 py-2 text-sm font-semibold text-teal-dark hover:border-teal hover:text-charcoal">${escapeHtml(link.label)}</a>`)
    .join('');
  if (!items) return '';
  return `<div data-blog-related="true" class="not-prose border border-teal-light bg-stone p-5"><p class="text-xs uppercase tracking-[0.26em] text-teal-dark mb-3">Related Services</p><div class="flex flex-wrap gap-3 not-prose">${items}</div></div>`;
}

function blogPostingSchema(draft, pagePath) {
  const now = new Date().toISOString().slice(0, 10);
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: draft.title,
    description: draft.description,
    image: imageUrl(draft.image),
    datePublished: draft.datePublished || now,
    dateModified: draft.dateModified || now,
    author: {
      '@type': 'Person',
      '@id': `${domain}/#dr-jeff`,
      name: 'Dr. Jeff Muszynski, DDS',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Elm Ridge Implant and Family Dentistry',
      logo: {
        '@type': 'ImageObject',
        url: `${domain}/square%20logo.webp`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${domain}${pagePath}`,
    },
  }, 'blog-posting');
}

export function renderBlogHtml(rawDraft) {
  const draft = normalizeDraft(rawDraft);
  const pagePath = `/blog/${draft.slug}`;
  const imageHtml = draft.image
    ? `<figure class="not-prose mb-8"><img src="${escapeHtml(imageSrc(draft.image))}" alt="${escapeHtml(draft.imageAlt || draft.title)}" class="w-full shadow-xl" loading="eager" decoding="async" /></figure>`
    : '';
  const sectionsHtml = draft.sections
    .map((section) => `<h2>${escapeHtml(section.heading)}</h2>${cleanSectionHtml(section.html)}`)
    .join('');
  const faqHtml = draft.faq.length
    ? `<section class="py-16 bg-stone"><div class="max-w-4xl mx-auto px-6"><h2 class="font-display text-4xl mb-8">FAQ</h2><div class="space-y-4">${draft.faq.map((item) => `<details class="bg-white border border-teal-light p-6"><summary class="font-semibold">${escapeHtml(item.question)}</summary><p class="mt-3 text-charcoal/65 leading-7">${escapeHtml(item.answer)}</p></details>`).join('')}</div></div></section>`
    : '';

  return `${withHeadSchemas(
    head(draft.title, draft.description, pagePath),
    draft.faq.length ? faqSchema(draft.faq.map((item) => [item.question, item.answer])) : '',
    breadcrumb(pagePath, 'Blog'),
    blogPostingSchema(draft, pagePath),
  )}<body class="font-body text-charcoal bg-stone">${header()}<main><section class="bg-charcoal text-white py-20"><div class="max-w-4xl mx-auto px-6"><nav class="text-xs uppercase tracking-widest text-teal mb-6"><a href="/">Home</a> / <a href="/blog">Blog</a></nav><p class="text-xs uppercase tracking-widest text-teal mb-4">${escapeHtml(draft.category)}</p><h1 class="font-display text-5xl md:text-6xl font-light leading-tight mb-6">${escapeHtml(draft.title)}</h1><p class="text-white/70 leading-8 text-lg">${escapeHtml(draft.heroIntro)}</p></div></section><article class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">${imageHtml}${relatedLinksHtml(draft.relatedLinks)}${sectionsHtml}<p class="bg-stone border border-teal-light p-5"><strong>Need a personalized answer?</strong> <a href="/request-appointment">Request a visit</a> with Elm Ridge Implant and Family Dentistry in Killeen.</p></div></article>${faqHtml}<section class="py-16 bg-charcoal text-white text-center"><div class="max-w-3xl mx-auto px-6"><h2 class="font-display text-4xl mb-4">Ready for a Clearer Answer?</h2><p class="text-white/65 mb-8">Elm Ridge can evaluate your situation and explain the options that fit your mouth, goals, and budget.</p><a href="/request-appointment" class="inline-block bg-teal px-8 py-4 text-xs uppercase tracking-widest font-semibold">Request an Appointment</a></div></section></main>${footer(false)}${menuScript}</body></html>`;
}

function blogIndexCard(draft) {
  return `<a href="/blog/${escapeHtml(draft.slug)}" class="block bg-stone border border-teal-light p-7 hover:border-teal transition-colors"><p class="text-xs uppercase tracking-widest text-teal-dark mb-3">${escapeHtml(draft.category)}</p><h2 class="font-display text-3xl text-charcoal mb-4">${escapeHtml(draft.title)}</h2><p class="text-charcoal/65 leading-7">${escapeHtml(draft.description)}</p></a>`;
}

function upsertBlogIndex(draft) {
  const file = path.join(root, 'blog', 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const href = `/blog/${draft.slug}`;
  if (html.includes(`href="${href}"`)) return { file, changed: false };

  const marker = '<section class="py-16 bg-white"><div class="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-6">';
  if (!html.includes(marker)) throw new Error('Could not find blog index card grid.');
  html = html.replace(marker, `${marker}${blogIndexCard(draft)}`);
  fs.writeFileSync(file, html);
  return { file, changed: true };
}

function upsertSitemap(draft) {
  const file = path.join(root, 'sitemap.xml');
  const loc = `${domain}/blog/${draft.slug}`;
  let xml = fs.readFileSync(file, 'utf8');
  if (xml.includes(`<loc>${loc}</loc>`)) return { file, changed: false };

  const entry = `  <url><loc>${loc}</loc><priority>${draft.category === 'Dental Implants' ? '0.9' : '0.7'}</priority></url>\n`;
  xml = xml.replace('</urlset>', `${entry}</urlset>`);
  fs.writeFileSync(file, xml);
  return { file, changed: true };
}

function upsertLedger(draft) {
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
  const url = `${domain}/blog/${draft.slug}`;
  const existing = ledger.entries.find((entry) => entry.url === url);
  if (existing) return { file: ledgerPath, changed: false };

  const today = new Date().toISOString().slice(0, 10);
  ledger.updated = today;
  ledger.entries.unshift({
    date: today,
    type: 'blog',
    bucket: String(draft.category || 'Patient Education').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    primaryKeyword: draft.primaryKeyword || draft.title,
    title: draft.title,
    url,
    imageId: draft.gbp?.imageId || null,
    status: 'ready',
  });
  fs.writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`);
  return { file: ledgerPath, changed: true };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input) throw new Error('Usage: npm run seo:render-blog -- --input path/to/reviewed-draft.json [--write]');

  const inputPath = path.resolve(root, args.input);
  const rawDraft = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const draft = normalizeDraft(rawDraft);
  const html = renderBlogHtml(draft);
  const outputPath = path.join(root, 'blog', draft.slug, 'index.html');

  if (args.write) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html);
    const updates = [
      { file: outputPath, changed: true },
      upsertBlogIndex(draft),
      upsertSitemap(draft),
      upsertLedger(draft),
    ];
    console.log(JSON.stringify({ outputPath, updates }, null, 2));
  } else {
    console.log(JSON.stringify({ outputPath, bytes: Buffer.byteLength(html), dryRun: true }, null, 2));
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
