import fs from 'fs';
import {
  beforeAfterLightbox,
  beforeAfterScript,
  beforeAfterSection,
  beforeAfterStyles,
} from './before-after-gallery.mjs';

const homeFile = 'index.html';
const cosmeticFile = 'cosmetic-dentistry-killeen-tx';
const section = beforeAfterSection();

function updateHome() {
  let html = fs.readFileSync(homeFile, 'utf8');
  html = html.replace(
    /  <!-- BEFORE & AFTER -->[\s\S]*?\n  <!-- COSMETIC -->/,
    `${section}\n\n  <!-- COSMETIC -->`
  );
  fs.writeFileSync(homeFile, html);
}

function updateCosmetic() {
  let html = fs.readFileSync(cosmeticFile, 'utf8');

  if (!html.includes('data-before-after-gallery')) {
    html = html.replace('</head>', `${beforeAfterStyles}</head>`);
  }

  if (html.includes('<!-- SHARED BEFORE & AFTER GALLERY -->')) {
    html = html.replace(
      /  <!-- SHARED BEFORE & AFTER GALLERY -->[\s\S]*?  <!-- \/SHARED BEFORE & AFTER GALLERY -->/,
      section
    );
  } else {
    html = html.replace(
      /(\s*<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 space-y-8 leading-8 text-charcoal\/70">)/,
      `\n${section}\n$1`
    );
  }

  if (!html.includes('id="ba-lightbox"')) {
    html = html.replace('<footer ', `${beforeAfterLightbox}\n<footer `);
  }

  if (!html.includes('<script data-before-after-gallery>')) {
    html = html.replace('</body>', `${beforeAfterScript}</body>`);
  }

  fs.writeFileSync(cosmeticFile, html);
}

updateHome();
updateCosmetic();
