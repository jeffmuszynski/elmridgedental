import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { doctorPersonSchemas, globalDentistSchema } from './site-helpers.mjs';

const root = process.cwd();

const heroLegacyName = 'hero photo.webp';
const heroName = 'hero.webp';
const heroVariantWidths = [640, 1024, 1920];
const homeHeroPicture = `<picture><source srcset="hero-640.webp 640w, hero-1024.webp 1024w, hero-1920.webp 1920w" sizes="(max-width: 768px) 100vw, 1920px" type="image/webp" /><img src="hero.webp" alt="Dr. Jeff and Dr. Kayla Muszynski with their family at Elm Ridge Implant and Family Dentistry in Killeen, TX" class="w-full h-full object-cover object-[50%_28%]" width="1215" height="1620" decoding="async" fetchpriority="high" loading="eager" /></picture>`;

const altOverrides = new Map([
  ['carecredit.webp', 'CareCredit financing accepted at Elm Ridge Implant and Family Dentistry in Killeen, TX'],
  ['Jeff photo.webp', 'Dr. Jeff Muszynski, dentist at Elm Ridge Implant and Family Dentistry in Killeen, TX'],
  ['kayla photo.webp', 'Dr. Kayla Muszynski, dentist at Elm Ridge Implant and Family Dentistry in Killeen, TX'],
  ['Building.webp', 'Exterior of Elm Ridge Implant and Family Dentistry building in Killeen, TX'],
  ['sleep-apnea-airway-ai.webp', 'Sleep apnea airway illustration at Elm Ridge Implant and Family Dentistry in Killeen, TX'],
  ['mandibular-advancement-device-ai.webp', 'Mandibular advancement oral appliance at Elm Ridge Implant and Family Dentistry in Killeen, TX'],
  ['single-tooth-implant-ai.webp', 'Single tooth dental implant illustration at Elm Ridge Implant and Family Dentistry in Killeen, TX'],
  ['implant-bridge-ai.webp', 'Dental implant bridge illustration at Elm Ridge Implant and Family Dentistry in Killeen, TX'],
  ['full-arch-implants-ai.webp', 'Full-arch dental implant illustration at Elm Ridge Implant and Family Dentistry in Killeen, TX'],
  ['cbct-implant-planning-killeen.webp', 'CBCT-guided dental implant planning at Elm Ridge Implant and Family Dentistry in Killeen, TX'],
  ['all-on-4 implants before and after.webp', 'All-on-4 dental implant result at Elm Ridge Implant and Family Dentistry in Killeen, TX'],
  ['cosmeticdentistry3.webp', 'Cosmetic dentistry smile result at Elm Ridge Implant and Family Dentistry in Killeen, TX'],
  ['cosmeticdentistry5.webp', 'Cosmetic dentistry smile result at Elm Ridge Implant and Family Dentistry in Killeen, TX'],
  ['cosmeticdentistry6.webp', 'Cosmetic dentistry smile result at Elm Ridge Implant and Family Dentistry in Killeen, TX'],
  ['square logo.webp', 'Elm Ridge Implant and Family Dentistry logo in Killeen, TX'],
  ['ELMRIDGE.webp', 'Elm Ridge Implant and Family Dentistry'],
  ['tylenol-ibuprofen-schedule.png', 'Alternating Tylenol and Ibuprofen schedule for post-operative dental pain control'],
]);

const headingFixes = [];

function routeFilesFromSitemap() {
  const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
  const locMatches = [...sitemap.matchAll(/<loc>https:\/\/www\.elmridgedental\.com(\/[^<]*)<\/loc>/g)];
  const files = new Set(['index.html']);
  for (const [, route] of locMatches) {
    if (route === '/') {
      files.add('index.html');
      continue;
    }
    files.add(route.slice(1));
  }
  return [...files].filter((file) => fs.existsSync(file));
}

function normalizedImagePath(src) {
  return decodeURIComponent(src.replace(/^https:\/\/www\.elmridgedental\.com\//, '').replace(/^\//, '').split('?')[0]);
}

function getAttr(tag, name) {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`, 'i'));
  return match ? match[1] : '';
}

function hasAttr(tag, name) {
  return new RegExp(`\\b${name}(?:=|\\b)`, 'i').test(tag);
}

function setAttr(tag, name, value) {
  const encoded = String(value).replace(/"/g, '&quot;');
  if (hasAttr(tag, name)) {
    return tag.replace(new RegExp(`${name}="[^"]*"`, 'i'), `${name}="${encoded}"`);
  }
  return tag.replace(/\/?>$/, (end) => ` ${name}="${encoded}"${end}`);
}

function removeAttr(tag, name) {
  return tag.replace(new RegExp(`\\s${name}="[^"]*"`, 'ig'), '');
}

function deriveBeforeAfterAlt(fileName, currentAlt) {
  const lower = fileName.toLowerCase();
  if (!/before|after/.test(lower)) return currentAlt;
  if (lower.includes('all-on-4')) {
    return 'All-on-4 dental implant result at Elm Ridge Implant and Family Dentistry in Killeen, TX';
  }
  const phase = lower.includes('before') ? 'before treatment' : 'after treatment';
  return `Cosmetic dentistry ${phase} at Elm Ridge Implant and Family Dentistry in Killeen, TX`;
}

function improvedAlt(relPath, currentAlt) {
  const baseName = path.basename(relPath);
  if (altOverrides.has(baseName)) return altOverrides.get(baseName);
  if (!currentAlt) return deriveBeforeAfterAlt(baseName, currentAlt);

  const normalized = currentAlt.trim().toLowerCase();
  if (normalized === 'carecredit') return altOverrides.get(baseName) || currentAlt;
  if (normalized === 'dr. jeff muszynski') return altOverrides.get(baseName) || currentAlt;
  if (normalized === 'dr. kayla muszynski') return altOverrides.get(baseName) || currentAlt;
  if (normalized === 'before and after dental result') return deriveBeforeAfterAlt(baseName, currentAlt);
  if (normalized === 'image' || normalized === 'picture' || normalized === 'photo') return deriveBeforeAfterAlt(baseName, currentAlt);

  return currentAlt;
}

function replaceHomepageHero(html, heroDimensions) {
  const heroMarkup = homeHeroPicture.replace('width="1215" height="1620"', `width="${heroDimensions.width}" height="${heroDimensions.height}"`);
  let updated = html.replace(
    /<div class="relative hidden lg:block overflow-hidden">[\s\S]*?<\/div>\s*\n\s*<\/div>/,
    `<div class="relative hidden lg:block overflow-hidden">\n          ${heroMarkup}\n        </div>\n\n      </div>`
  );
  if (!updated.includes('rel="preload" as="image" href="/hero-1024.webp"')) {
    updated = updated.replace(
      '<link rel="preconnect" href="https://fonts.googleapis.com" />',
      '<link rel="preload" as="image" href="/hero-1024.webp" imagesrcset="/hero-640.webp 640w, /hero-1024.webp 1024w, /hero-1920.webp 1920w" imagesizes="(max-width: 768px) 100vw, 1920px" fetchpriority="high" />\n  <link rel="preconnect" href="https://fonts.googleapis.com" />'
    );
  }
  return updated;
}

function syncHomepageSchemas(html) {
  const dentistScript = `<script type="application/ld+json" data-schema="global-dentist">${JSON.stringify(globalDentistSchema)}</script>`;
  const doctorScript = `<script type="application/ld+json" data-schema="doctor-persons">${JSON.stringify(doctorPersonSchemas)}</script>`;
  let updated = html.replace(/<script type="application\/ld\+json" data-schema="global-dentist">[\s\S]*?<\/script>/, () => dentistScript);
  if (updated.includes('data-schema="doctor-persons"')) {
    updated = updated.replace(/<script type="application\/ld\+json" data-schema="doctor-persons">[\s\S]*?<\/script>/, () => doctorScript);
  } else {
    updated = updated.replace('</head>', `${doctorScript}</head>`);
  }
  return updated;
}

function syncSharedSchemas(html) {
  const dentistScript = `<script type="application/ld+json" data-schema="global-dentist">${JSON.stringify(globalDentistSchema)}</script>`;
  const doctorScript = `<script type="application/ld+json" data-schema="doctor-persons">${JSON.stringify(doctorPersonSchemas)}</script>`;
  if (html.includes('data-schema="global-dentist"')) {
    return html.replace(
      /<script type="application\/ld\+json" data-schema="global-dentist">[\s\S]*?<\/script>(?:<script type="application\/ld\+json" data-schema="doctor-persons">[\s\S]*?<\/script>)?/,
      () => `${dentistScript}${doctorScript}`
    );
  }
  if (html.includes('</head>')) {
    return html.replace('</head>', `${dentistScript}${doctorScript}</head>`);
  }
  return html;
}

function fixHeadingHierarchy(file, html) {
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((match) => ({ level: Number(match[1]), index: match.index }));
  const h1Count = headings.filter((heading) => heading.level === 1).length;
  let updated = html;

  if (h1Count !== 1) {
    headingFixes.push({ file, issue: `Expected 1 h1, found ${h1Count}` });
  }

  for (let i = 1; i < headings.length; i += 1) {
    const previous = headings[i - 1].level;
    const current = headings[i].level;
    if (current - previous > 1) {
      const brokenTag = new RegExp(`<h${current}(\\b[^>]*)>`, 'i');
      updated = updated.replace(brokenTag, `<h${previous + 1}$1>`);
      updated = updated.replace(new RegExp(`</h${current}>`, 'i'), `</h${previous + 1}>`);
      headingFixes.push({ file, issue: `Adjusted h${current} to h${previous + 1}` });
      break;
    }
  }

  return updated;
}

async function withImageTools(fn) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  try {
    return await fn(page);
  } finally {
    await browser.close();
  }
}

async function imageInfo(page, absolutePath) {
  const extension = path.extname(absolutePath).slice(1).toLowerCase();
  const mime = extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' : extension === 'png' ? 'image/png' : 'image/webp';
  const srcUrl = `data:${mime};base64,${fs.readFileSync(absolutePath).toString('base64')}`;
  return page.evaluate(async (url) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    return { width: img.naturalWidth, height: img.naturalHeight };
  }, srcUrl);
}

async function createHeroAssets(page) {
  const legacyPath = path.join(root, heroLegacyName);
  const heroPath = path.join(root, heroName);
  const heroJpgPath = path.join(root, 'hero photo.jpg');
  if (!fs.existsSync(heroPath) && fs.existsSync(legacyPath)) {
    fs.renameSync(legacyPath, heroPath);
  }
  if (!fs.existsSync(heroJpgPath) && !fs.existsSync(heroPath)) {
    throw new Error('Hero source image is missing.');
  }

  const heroSourcePath = fs.existsSync(heroJpgPath) ? heroJpgPath : heroPath;
  const heroExtension = path.extname(heroSourcePath).slice(1).toLowerCase();
  const heroMime = heroExtension === 'jpg' || heroExtension === 'jpeg' ? 'image/jpeg' : 'image/webp';
  const heroUrl = `data:${heroMime};base64,${fs.readFileSync(heroSourcePath).toString('base64')}`;
  const variants = await page.evaluate(async ({ heroSrc, widths }) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = heroSrc;
    await img.decode();
    const originalCanvas = document.createElement('canvas');
    originalCanvas.width = img.naturalWidth;
    originalCanvas.height = img.naturalHeight;
    originalCanvas.getContext('2d').drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
    const outputs = [];
    for (const width of widths) {
      const scale = width / img.naturalWidth;
      const height = Math.round(img.naturalHeight * scale);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      outputs.push({
        width,
        height,
        dataUrl: canvas.toDataURL('image/webp', 0.75),
      });
    }
    return {
      originalWidth: img.naturalWidth,
      originalHeight: img.naturalHeight,
      originalDataUrl: originalCanvas.toDataURL('image/webp', 0.75),
      outputs,
    };
  }, { heroSrc: heroUrl, widths: heroVariantWidths });

  fs.writeFileSync(
    heroPath,
    Buffer.from(variants.originalDataUrl.replace(/^data:image\/webp;base64,/, ''), 'base64')
  );

  for (const output of variants.outputs) {
    const base64 = output.dataUrl.replace(/^data:image\/webp;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    fs.writeFileSync(path.join(root, `hero-${output.width}.webp`), buffer);
  }
  if (fs.existsSync(legacyPath)) {
    fs.unlinkSync(legacyPath);
  }
  return { width: variants.originalWidth, height: variants.originalHeight };
}

async function collectImageMetadata(page, routeFiles) {
  const imagePaths = new Set();
  for (const file of routeFiles) {
    const html = fs.readFileSync(file, 'utf8');
    for (const match of html.matchAll(/<img\b[^>]*src="([^"]+)"/gi)) {
      const src = match[1];
      if (/^(https?:|data:)/i.test(src)) continue;
      const relPath = normalizedImagePath(src);
      if (fs.existsSync(path.join(root, relPath))) imagePaths.add(relPath);
    }
  }

  const metadata = new Map();
  for (const relPath of imagePaths) {
    try {
      metadata.set(relPath, await imageInfo(page, path.join(root, relPath)));
    } catch {
      continue;
    }
  }
  return metadata;
}

function updateImageTags(file, html, metadata, heroDimensions) {
  let nonLogoImageCount = 0;
  let updated = html.replace(/hero%20photo\.webp/g, 'hero.webp').replace(/hero photo\.webp/g, 'hero.webp');

  if (file === 'index.html') {
    updated = replaceHomepageHero(updated, heroDimensions);
  }
  updated = syncSharedSchemas(updated);
  if (file === 'index.html') updated = syncHomepageSchemas(updated);

  updated = updated.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = getAttr(tag, 'src');
    if (!src || /^(https?:|data:)/i.test(src)) return tag;

    const relPath = normalizedImagePath(src);
    const baseName = path.basename(relPath);
    const dimensions = metadata.get(relPath);
    let nextTag = tag;

    if (dimensions) {
      nextTag = setAttr(nextTag, 'width', dimensions.width);
      nextTag = setAttr(nextTag, 'height', dimensions.height);
    }

    const currentAlt = getAttr(nextTag, 'alt');
    const nextAlt = improvedAlt(relPath, currentAlt);
    if (nextAlt && nextAlt !== currentAlt) {
      nextTag = setAttr(nextTag, 'alt', nextAlt);
    }

    if (baseName === 'ELMRIDGE.webp') {
      nextTag = removeAttr(nextTag, 'loading');
      nextTag = setAttr(nextTag, 'decoding', 'async');
      return nextTag;
    }

    if (baseName === 'square logo.webp') {
      nextTag = setAttr(nextTag, 'loading', 'lazy');
      nextTag = setAttr(nextTag, 'decoding', 'async');
      nextTag = removeAttr(nextTag, 'fetchpriority');
      return nextTag;
    }

    nonLogoImageCount += 1;
    const isHomepageHero = file === 'index.html' && baseName === heroName;
    const isPageHero = nonLogoImageCount === 1;

    nextTag = setAttr(nextTag, 'decoding', 'async');
    if (isHomepageHero) {
      nextTag = setAttr(nextTag, 'loading', 'eager');
      nextTag = setAttr(nextTag, 'fetchpriority', 'high');
    } else if (isPageHero) {
      nextTag = setAttr(nextTag, 'loading', 'eager');
      nextTag = removeAttr(nextTag, 'fetchpriority');
    } else {
      nextTag = setAttr(nextTag, 'loading', 'lazy');
      nextTag = removeAttr(nextTag, 'fetchpriority');
    }

    return nextTag;
  });

  updated = updated.replace(/<iframe\b([^>]*src="[^"]*google[^"]*"[^>]*)>/gi, (match, attrs) => {
    if (/\bloading="/i.test(match)) return match;
    return `<iframe${attrs} loading="lazy">`;
  });

  return fixHeadingHierarchy(file, updated);
}

function countScriptSchemas(html, type) {
  return [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1])
    .filter((json) => json.includes(`"@type":"${type}"`) || json.includes(`"@type": "${type}"`)).length;
}

const routeFiles = routeFilesFromSitemap();

await withImageTools(async (page) => {
  const heroDimensions = await createHeroAssets(page);
  const metadata = await collectImageMetadata(page, routeFiles);

  for (const file of routeFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const updated = updateImageTags(file, html, metadata, heroDimensions)
      .replace(/content="https:\/\/www\.elmridgedental\.com\/hero%20photo\.webp"/g, 'content="https://www.elmridgedental.com/hero.webp"')
      .replace(/content="https:\/\/www\.elmridgedental\.com\/hero photo\.webp"/g, 'content="https://www.elmridgedental.com/hero.webp"');
    if (updated !== html) fs.writeFileSync(file, updated);
  }

  const report = {
    routeCount: routeFiles.length,
    headingFixes,
    homepageFaqCtaCount: (fs.readFileSync('index.html', 'utf8').match(/Questions before your visit\?/g) || []).length,
    implantFaqSchemaCount: countScriptSchemas(fs.readFileSync('dental-implants-killeen-tx', 'utf8'), 'FAQPage'),
    blogIndexEntryCount: (() => {
      const blogHtml = fs.readFileSync('blog', 'utf8');
      const match = blogHtml.match(/"blogPost":\[(.*?)\]/);
      return match ? (match[1].match(/"@type":"BlogPosting"/g) || []).length : 0;
    })(),
    heroDimensions,
  };
  fs.writeFileSync('performance-pass-report.json', JSON.stringify(report, null, 2));
});
