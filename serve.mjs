import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { getSpamPhraseMatch } from './spam-protection.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = process.env.PORT || 3000;
const CANONICAL_ORIGIN = 'https://www.elmridgedental.com';
const CONTACT_FORM_ENDPOINT = process.env.CONTACT_FORM_ENDPOINT || 'https://formsubmit.co/ajax/contact@elmridgedental.com';
const RECAPTCHA_ACTION = 'contact_form';
const RECAPTCHA_MIN_SCORE = 0.5;

const oldUrlRedirects = new Map([
  ['/contact-us', '/#contact'],
  ['/reviews', '/#reviews'],
  ['/before-and-after', '/#before-after'],
  ['/dentalimplants', '/dental-implants-killeen-tx'],
  ['/cosmeticdentistry', '/cosmetic-dentistry-killeen-tx'],
  ['/invisalign', '/invisalign-killeen-tx'],
  ['/rootcanals', '/root-canal-killeen-tx'],
  ['/dentures', '/dentures-killeen-tx'],
  ['/extractions', '/emergency-dentist-killeen-tx'],
  ['/generaldentistry', '/#services'],
  ['/cleanings', '/#services'],
  ['/wellnessexams', '/#services'],
  ['/sedation', '/#services'],
]);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const isProduction = process.env.NODE_ENV === 'production';
const blockedCounts = new Map();

function logBlockedSubmission(reason) {
  blockedCounts.set(reason, (blockedCounts.get(reason) || 0) + 1);
  if (!isProduction) {
    console.warn(`Blocked contact form submission: ${reason}`);
  }
}

function json(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 64 * 1024) throw new Error('Request body too large');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

async function verifyRecaptcha(token) {
  if (!isProduction && process.env.RECAPTCHA_SKIP_VERIFY === 'true') {
    return { ok: true, skipped: true };
  }

  if (!token) return { ok: false, reason: 'missing_recaptcha_token' };

  if (!process.env.RECAPTCHA_SECRET_KEY) {
    return { ok: false, reason: 'missing_recaptcha_config' };
  }

  const params = new URLSearchParams({
    secret: process.env.RECAPTCHA_SECRET_KEY,
    response: token,
  });

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  const result = await response.json();

  if (!result.success) return { ok: false, reason: 'recaptcha_failed' };
  if (result.action !== RECAPTCHA_ACTION) return { ok: false, reason: 'recaptcha_action_mismatch' };
  if (typeof result.score === 'number' && result.score < RECAPTCHA_MIN_SCORE) {
    return { ok: false, reason: 'recaptcha_low_score' };
  }

  return { ok: true };
}

async function forwardContactLead(fields) {
  if (!isProduction && CONTACT_FORM_ENDPOINT === 'mock') return;

  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(fields)) {
    if (key === 'recaptcha_token' || key === 'website' || key === 'company') continue;
    body.append(key, String(value || ''));
  }

  const response = await fetch(CONTACT_FORM_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) throw new Error('Contact form provider rejected submission');
}

async function handleContactForm(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { Allow: 'POST' });
    res.end();
    return;
  }

  try {
    const fields = await readJsonBody(req);
    const honeypotValue = `${fields.website || ''}${fields.company || ''}`.trim();
    if (honeypotValue) {
      logBlockedSubmission('honeypot');
      json(res, 200, { ok: true });
      return;
    }

    const spamPhrase = getSpamPhraseMatch(fields);
    if (spamPhrase) {
      logBlockedSubmission(`keyword:${spamPhrase}`);
      json(res, 200, { ok: true });
      return;
    }

    const recaptcha = await verifyRecaptcha(fields.recaptcha_token);
    if (!recaptcha.ok) {
      logBlockedSubmission(recaptcha.reason);
      json(res, 403, { ok: false });
      return;
    }

    await forwardContactLead(fields);
    json(res, 200, { ok: true });
  } catch (error) {
    if (!isProduction) console.error(error);
    json(res, 500, { ok: false });
  }
}

createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const host = (req.headers.host || '').split(':')[0].toLowerCase();
  const normalizedPath = requestUrl.pathname.replace(/\/+$/, '') || '/';
  const oldDestination = oldUrlRedirects.get(normalizedPath.toLowerCase());

  if (normalizedPath === '/api/contact') {
    await handleContactForm(req, res);
    return;
  }

  if (oldDestination || host === 'elmridgedental.com') {
    const destination = new URL(oldDestination || requestUrl.pathname, CANONICAL_ORIGIN);
    destination.search = requestUrl.search;
    res.writeHead(301, {
      Location: destination.toString(),
      'Cache-Control': 'public, max-age=3600',
    });
    res.end();
    return;
  }

  let url = requestUrl.pathname;
  if (url === '/') url = '/index.html';
  const filePath = join(__dirname, decodeURIComponent(url));
  const ext = extname(filePath).toLowerCase();
  const contentType = ext ? (mime[ext] || 'application/octet-stream') : 'text/html; charset=utf-8';

  try {
    const data = await readFile(filePath);
    const longCacheExts = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp']);
    const body = contentType.startsWith('text/html')
      ? data.toString('utf8').replaceAll('__RECAPTCHA_SITE_KEY__', process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '')
      : data;
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': longCacheExts.has(ext) ? 'public, max-age=31536000, immutable' : 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
