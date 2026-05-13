import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { getSpamPhraseMatch } from './spam-protection.mjs';
import dotenv from 'dotenv';
import OpenAI, { toFile } from 'openai';
import Busboy from 'busboy';

dotenv.config({ path: '.env.local' });

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = process.env.PORT || 3000;
const CANONICAL_ORIGIN = 'https://www.elmridgedental.com';
const CONTACT_FORM_ENDPOINT = process.env.CONTACT_FORM_ENDPOINT || 'https://formsubmit.co/ajax/contact@elmridgedental.com';
const RECAPTCHA_ACTION = 'contact_form';
const RECAPTCHA_MIN_SCORE = 0.5;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SMILE_PROMPT = `
Edit only the transparent masked teeth area.
Keep every unmasked pixel identical to the source image.
Within the visible teeth only, create a photorealistic simulated cosmetic dental result: improved alignment, natural proportions, dominant centrals, slightly narrower laterals, gently tapered canines, natural enamel texture, subtle incisal translucency, realistic highlights, and a bright natural tooth shade.
Prioritize natural individual tooth anatomy over idealized uniformity. 
Keep slight natural variation between teeth. 
Avoid making the upper anterior teeth look like one continuous white band.
Use realistic embrasures, subtle line angles, and natural surface texture.
Keep shade bright but slightly warm, not pure white.
Do not edit lips, gums, mouth opening, smile width, skin, face, lighting, shadows, background, camera angle, crop, or expression.
Avoid piano-key veneers, over-whitening, plastic texture, excessive symmetry, cartoon teeth, glow, beauty filter effects, or face reshaping.
`;

const oldUrlRedirects = new Map([
  ['/contact-us', '/#contact'],
  ['/reviews', '/#reviews'],
  ['/before-and-after', '/#before-after'],
  ['/dentalimplants', '/dental-implants-killeen-tx'],
  ['/dental-implants', '/dental-implants-killeen-tx'],
  ['/implants', '/dental-implants-killeen-tx'],
  ['/implantdentistry', '/dental-implants-killeen-tx'],
  ['/dentalimplant', '/dental-implants-killeen-tx'],
  ['/dental-implant', '/dental-implants-killeen-tx'],
  ['/allon4', '/all-on-4-dental-implants-killeen-tx'],
  ['/all-on-4', '/all-on-4-dental-implants-killeen-tx'],
  ['/snapondentures', '/snap-on-dentures-killeen-tx'],
  ['/cosmeticdentistry', '/cosmetic-dentistry-killeen-tx'],
  ['/cosmetic-dentistry', '/cosmetic-dentistry-killeen-tx'],
  ['/invisalign', '/invisalign-killeen-tx'],
  ['/rootcanals', '/root-canal-killeen-tx'],
  ['/root-canal', '/root-canal-killeen-tx'],
  ['/dentures', '/dentures-killeen-tx'],
  ['/extractions', '/emergency-dentist-killeen-tx'],
  ['/emergencydentist', '/emergency-dentist-killeen-tx'],
  ['/emergency-dentist', '/emergency-dentist-killeen-tx'],
  ['/postoperativeinstructions', '/post-operative-instructions'],
  ['/post-operative-care', '/post-operative-instructions'],
  ['/post-op-instructions', '/post-operative-instructions'],
  ['/insurance', '/insurance-and-financing'],
  ['/financing', '/insurance-and-financing'],
  ['/insurance-financing', '/insurance-and-financing'],
  ['/dentistnolanville', '/dentist-nolanville-tx'],
  ['/dentistnolanvilletx', '/dentist-nolanville-tx'],
  ['/nolanville-dentist', '/dentist-nolanville-tx'],
  ['/dentist-nolanville', '/dentist-nolanville-tx'],
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

function parseSmileUpload(req) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: req.headers,
      limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1,
      },
    });

    let uploadedFile = null;

    busboy.on('file', (fieldname, file, info) => {
      const chunks = [];

      file.on('data', (chunk) => {
        chunks.push(chunk);
      });

      file.on('limit', () => {
        reject(new Error('Image is too large. Please upload a file under 10MB.'));
      });

      file.on('end', () => {
        uploadedFile = {
          fieldname,
          filename: info.filename || 'smile-photo.jpg',
          mimeType: info.mimeType,
          buffer: Buffer.concat(chunks),
        };
      });
    });

    busboy.on('error', reject);

    busboy.on('finish', () => {
      resolve(uploadedFile);
    });

    req.pipe(busboy);
  });
}

async function handleSmileSimulation(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { Allow: 'POST' });
    res.end();
    return;
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      json(res, 500, {
        error: 'OpenAI API key is missing on the server.',
      });
      return;
    }

    const uploadedFile = await parseSmileUpload(req);

    if (!uploadedFile) {
      json(res, 400, {
        error: 'Please upload a smile photo.',
      });
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(uploadedFile.mimeType)) {
      json(res, 400, {
        error: 'Please upload a JPG, PNG, or WebP image.',
      });
      return;
    }

    const imageFile = await toFile(
      uploadedFile.buffer,
      uploadedFile.filename,
      {
        type: uploadedFile.mimeType,
      }
    );

    const result = await openai.images.edit({
  model: "gpt-image-1",
  image: imageFile,
  prompt: SMILE_PROMPT,
  size: "1024x1536",
  quality: "high",
  n: 1,
  input_fidelity: "high",
});

    const b64 = result.data?.[0]?.b64_json;

    if (!b64) {
      json(res, 500, {
        error: 'The smile simulation could not be created.',
      });
      return;
    }

    json(res, 200, {
      imageUrl: `data:image/png;base64,${b64}`,
    });
  } catch (error) {
    if (!isProduction) console.error('Smile simulation error:', error);

    json(res, 500, {
      error: 'Smile simulation failed. Please try another clear smile photo.',
    });
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

  if (normalizedPath === '/api/smile-simulation') {
  await handleSmileSimulation(req, res);
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

  let url = normalizedPath;
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
