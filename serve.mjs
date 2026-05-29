import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { getSpamPhraseMatch } from './spam-protection.mjs';
import dotenv from 'dotenv';
import OpenAI, { toFile } from 'openai';
import Busboy from 'busboy';
import nodemailer from 'nodemailer';

dotenv.config({ path: '.env.local' });

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = process.env.PORT || 3000;
const CANONICAL_ORIGIN = 'https://www.elmridgedental.com';
const CONTACT_FORM_ENDPOINT = process.env.CONTACT_FORM_ENDPOINT || 'https://formsubmit.co/ajax/contact@elmridgedental.com';
const SMILE_EMAIL_TO = process.env.SMILE_EMAIL_TO || 'contact@elmridgedental.com';
const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO || SMILE_EMAIL_TO;
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const RECAPTCHA_ACTION = 'contact_form';
const RECAPTCHA_MIN_SCORE = 0.5;
const SMILE_PREVIEW_JOB_TTL_MS = 15 * 60 * 1000;
const SMILE_UPLOAD_LIMIT_BYTES = 20 * 1024 * 1024;
const smilePreviewJobs = new Map();
let openaiClient = null;

function getOpenAIClient() {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return openaiClient;
}

const SMILE_PROMPT = `
Edit only the transparent masked teeth area.
Keep every unmasked pixel identical to the source image.
Within the visible teeth only, create a photorealistic simulated cosmetic dental result with realistic ideal dental proportions: improved alignment, teeth sized to the face, balanced central incisors, slightly smaller lateral incisors, natural canine shape, natural enamel texture, subtle incisal translucency, realistic highlights, and a bright natural tooth shade.
Prioritize natural individual tooth anatomy over idealized uniformity.
Keep slight natural variation between teeth, including gentle incisal edge variation and believable width-to-height ratios.
Keep tooth length conservative and anatomically plausible. Do not elongate the upper front teeth beyond the patient's natural smile line; preserve realistic central incisor width-to-height proportions, roughly 75-85% width-to-height, and keep incisal edges following the lower lip curve.
If improving tooth shape, shorten rather than lengthen when uncertain. The final smile should look like natural cosmetic dentistry, not extended veneer mockups.
Avoid making the upper anterior teeth look like one continuous white band.
Use realistic embrasures, subtle line angles, and natural surface texture.
Keep shade bright but slightly warm, not pure white.
Do not edit lips, gums, mouth opening, smile width, skin, face, lighting, shadows, background, camera angle, crop, or expression.
Avoid oversized teeth, long rectangular veneer shapes, teeth that extend too far downward into the smile, square blocky teeth, piano-key veneers, over-whitening, plastic texture, excessive symmetry, cartoon teeth, glow, beauty filter effects, or face reshaping.
`;

const oldUrlRedirects = new Map([
  ['/contact-us', '/request-appointment'],
  ['/dentistnearme', '/dentist-killeen-tx'],
  ['/dentalimplants', '/dental-implants-killeen-tx'],
  ['/dental-implants-near-me-in-killeen-how-to-choose-the-right-fit', '/dental-implants-killeen-tx'],
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
  ['/before-and-after', '/cosmetic-dentistry-killeen-tx'],
  ['/invisalign', '/clear-aligners-killeen-tx'],
  ['/invisalign-killeen-tx', '/clear-aligners-killeen-tx'],
  ['/rootcanals', '/root-canal-killeen-tx'],
  ['/root-canal', '/root-canal-killeen-tx'],
  ['/dentures', '/dentures-killeen-tx'],
  ['/implant-bridges-killeen-tx', '/implant-bridge-killeen-tx'],
  ['/sleep-dentistry-killeen-tx', '/sleep-apnea-dentist-killeen-tx'],
  ['/sleep-dentistry', '/sleep-apnea-dentist-killeen-tx'],
  ['/sleep', '/sleep-apnea-dentist-killeen-tx'],
  ['/extractions', '/tooth-extractions-killeen-tx'],
  ['/emergencydentist', '/emergency-dentist-killeen-tx'],
  ['/emergency-dentist', '/emergency-dentist-killeen-tx'],
  ['/postoperativeinstructions', '/post-operative-instructions'],
  ['/post-operative-care', '/post-operative-instructions'],
  ['/post-op-instructions', '/post-operative-instructions'],
  ['/insurance', '/insurance-and-financing'],
  ['/financing', '/insurance-and-financing'],
  ['/insurance-financing', '/insurance-and-financing'],
  ['/appointment', '/request-appointment'],
  ['/appointments', '/request-appointment'],
  ['/request-an-appointment', '/request-appointment'],
  ['/contact', '/request-appointment'],
  ['/dentistnolanville', '/dentist-nolanville-tx'],
  ['/dentistnolanvilletx', '/dentist-nolanville-tx'],
  ['/nolanville-dentist', '/dentist-nolanville-tx'],
  ['/dentist-nolanville', '/dentist-nolanville-tx'],
  ['/generaldentistry', '/services'],
  ['/cleanings', '/dental-cleanings-killeen-tx'],
  ['/wellnessexams', '/dental-cleanings-killeen-tx'],
  ['/sedation', '/sedation-dentistry-killeen-tx'],
  ['/kids-dentist-killeen-tx', '/family-dentist-killeen-tx'],
  ['/blog-cosmetic-dentistry-options-killeen-tx', '/blog/cosmetic-dentistry-options-killeen-tx'],
  ['/blog-emergency-dentist-killeen-tx', '/blog/emergency-dentist-killeen-tx'],
  ['/blog-dental-implant-cost-killeen-tx', '/blog/dental-implant-cost-killeen-tx'],
  ['/blog-implants-vs-dentures-vs-bridges', '/blog/implants-vs-dentures-vs-bridges'],
  ['/blog-are-dental-implants-painful', '/blog/are-dental-implants-painful'],
  ['/blog-implant-dentist-killeen-tx', '/blog/implant-dentist-killeen-tx'],
]);

const goneUrls = new Set([
  '/_api/one-app-session-web/v3/businesses',
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
  '.json': 'application/json; charset=utf-8',
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

class SmileUploadError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'SmileUploadError';
    this.statusCode = statusCode;
  }
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

async function readLargeJsonBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 15 * 1024 * 1024) throw new Error('Request body too large');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

async function verifyRecaptcha(token) {
  if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !process.env.RECAPTCHA_SECRET_KEY) {
    if (isProduction) console.warn('Contact form reCAPTCHA skipped: env vars are missing.');
    return { ok: true, skipped: true };
  }

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

  const sentBySmtp = await sendContactLeadEmail(fields);
  if (sentBySmtp) return;

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

function getGoogleWorkspaceTransport() {
  if (!process.env.GOOGLE_WORKSPACE_SMTP_USER || !process.env.GOOGLE_WORKSPACE_SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: process.env.GOOGLE_WORKSPACE_SMTP_USER,
      pass: process.env.GOOGLE_WORKSPACE_SMTP_PASS,
    },
  });
}

async function sendContactLeadEmail(fields) {
  const transport = getGoogleWorkspaceTransport();

  if (!transport) return false;

  const excludedFields = new Set(['recaptcha_token', 'website', 'company', '_template', '_captcha']);
  const rows = Object.entries(fields)
    .filter(([key, value]) => !excludedFields.has(key) && String(value || '').trim())
    .map(([key, value]) => ({ key, value: String(value) }));
  const patientName = fields['Patient name'] || `${fields['First name'] || ''} ${fields['Last name'] || ''}`.trim() || 'Unknown patient';
  const subject = fields._subject || `WEBSITE APPOINTMENT REQUEST - ${patientName}`;
  const fromAddress = process.env.CONTACT_EMAIL_FROM || process.env.SMILE_EMAIL_FROM || process.env.GOOGLE_WORKSPACE_SMTP_USER;
  const from = {
    name: process.env.CONTACT_EMAIL_FROM_NAME || 'Elm Ridge Appointment Requests',
    address: fromAddress,
  };
  const text = [
    'New appointment request',
    '',
    ...rows.flatMap(({ key, value }) => [`${key}: ${value}`, '']),
  ].join('\n').trim();
  const htmlRows = rows
    .map(({ key, value }) => `<tr><th style="text-align:left;padding:10px;border:1px solid #d8e8e8;background:#EAF4F4;color:#2C3E3E;">${escapeHtml(key)}</th><td style="padding:10px;border:1px solid #d8e8e8;color:#2C3E3E;">${escapeHtml(value).replaceAll('\n', '<br />')}</td></tr>`)
    .join('');

  await transport.sendMail({
    from,
    to: CONTACT_EMAIL_TO,
    replyTo: fields.Email || undefined,
    subject,
    text,
    html: [
      '<div style="font-family:Arial,sans-serif;color:#2C3E3E;">',
      '<h2 style="margin:0 0 16px;">New appointment request</h2>',
      `<table style="border-collapse:collapse;width:100%;max-width:720px;">${htmlRows}</table>`,
      '</div>',
    ].join(''),
  });

  return true;
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
    let failed = false;
    const contentLength = Number(req.headers['content-length'] || 0);
    const rejectOnce = (error) => {
      if (failed) return;
      failed = true;
      reject(error);
    };

    if (contentLength > SMILE_UPLOAD_LIMIT_BYTES) {
      rejectOnce(new SmileUploadError('Image is too large. Please upload a file under 20MB.', 413));
      req.resume();
      return;
    }

    let busboy;

    try {
      busboy = Busboy({
        headers: req.headers,
        limits: {
          fileSize: SMILE_UPLOAD_LIMIT_BYTES,
          files: 1,
          fieldSize: 10 * 1024,
        },
      });
    } catch (error) {
      rejectOnce(new SmileUploadError(error.message || 'The smile photo upload could not be read. Please try another image.', 400));
      req.resume();
      return;
    }

    let uploadedFile = null;
    const fields = {};

    busboy.on('file', (fieldname, file, info) => {
      const chunks = [];

      file.on('data', (chunk) => {
        if (failed) return;
        chunks.push(chunk);
      });

      file.on('limit', () => {
        rejectOnce(new SmileUploadError('Image is too large. Please upload a file under 20MB.', 413));
        file.resume();
      });

      file.on('end', () => {
        if (failed) return;
        uploadedFile = {
          fieldname,
          filename: info.filename || 'smile-photo.jpg',
          mimeType: info.mimeType,
          buffer: Buffer.concat(chunks),
        };
      });
    });

    busboy.on('field', (fieldname, value) => {
      if (failed) return;
      fields[fieldname] = value;
    });

    busboy.on('error', (error) => {
      rejectOnce(new SmileUploadError(error.message || 'The smile photo upload could not be read. Please try another image.', 400));
    });

    busboy.on('finish', () => {
      if (failed) return;
      resolve({ uploadedFile, fields });
    });

    req.on('aborted', () => {
      rejectOnce(new SmileUploadError('The upload was interrupted. Please try again from a stable connection.', 400));
    });

    req.pipe(busboy);
  });
}

function getSmileEmailTransport() {
  return getGoogleWorkspaceTransport();
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function validateSmileUpload(uploadedFile) {
  if (!process.env.OPENAI_API_KEY) {
    return 'OpenAI API key is missing on the server.';
  }

  if (!uploadedFile) {
    return 'Please upload a smile photo.';
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(uploadedFile.mimeType)) {
    return 'Please upload a JPG, PNG, or WebP image.';
  }

  return '';
}

async function generateSmileSimulationImage(uploadedFile) {
  const imageFile = await toFile(
    uploadedFile.buffer,
    uploadedFile.filename,
    {
      type: uploadedFile.mimeType,
    }
  );

  const result = await getOpenAIClient().images.edit({
    model: 'gpt-image-1',
    image: imageFile,
    prompt: SMILE_PROMPT,
    size: '1024x1536',
    quality: 'high',
    n: 1,
    input_fidelity: 'high',
  });

  const b64 = result.data?.[0]?.b64_json;

  if (!b64) {
    throw new Error('The smile simulation could not be created.');
  }

  return `data:image/png;base64,${b64}`;
}

function scheduleSmilePreviewJobCleanup(jobId) {
  const job = smilePreviewJobs.get(jobId);
  if (!job || job.cleanupTimer) return;

  job.cleanupTimer = setTimeout(() => {
    smilePreviewJobs.delete(jobId);
  }, SMILE_PREVIEW_JOB_TTL_MS);

  job.cleanupTimer.unref?.();
}

async function processSmilePreviewJob(jobId, uploadedFile) {
  try {
    const imageUrl = await generateSmileSimulationImage(uploadedFile);
    const job = smilePreviewJobs.get(jobId);
    if (!job) return;

    job.status = 'complete';
    job.imageUrl = imageUrl;
    job.completedAt = Date.now();
  } catch (error) {
    if (!isProduction) console.error('Smile simulation job error:', error);
    const job = smilePreviewJobs.get(jobId);
    if (!job) return;

    job.status = 'error';
    job.error = error.message || 'Smile simulation failed. Please try another clear smile photo.';
    job.completedAt = Date.now();
  } finally {
    scheduleSmilePreviewJobCleanup(jobId);
  }
}

async function sendSmileSimulationEmail({ fields, compositeImageBuffer }) {
  const transport = getSmileEmailTransport();

  if (!transport) {
    if (!isProduction) console.warn('Smile simulation email skipped: Google Workspace SMTP env vars are missing.');
    return false;
  }

  const name = fields.name || 'Not provided';
  const phone = fields.phone || 'Not provided';
  const email = fields.email || 'Not provided';
  const message = fields.message || 'Not provided';
  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br />');
  const fromAddress = process.env.SMILE_EMAIL_FROM || process.env.GOOGLE_WORKSPACE_SMTP_USER;
  const from = {
    name: process.env.SMILE_EMAIL_FROM_NAME || 'Elm Ridge Implant and Family Dentistry',
    address: fromAddress,
  };
  const attachments = [{
    filename: 'elm-ridge-smile-simulation-before-after.png',
    content: compositeImageBuffer,
    contentType: 'image/png',
    cid: 'smile-composite',
    contentDisposition: 'inline',
  }];
  const introHtml = '<p style="font-size:17px;line-height:1.5;color:#2C3E3E;margin:0 0 16px;"><strong>Ready to talk about your smile makeover?</strong> Call us at <a href="tel:+12546994127" style="color:#5A9A9A;">254-699-4127</a> to schedule a cosmetic consult.</p>';
  const imageHtml = '<p style="margin:20px 0 0;"><img src="cid:smile-composite" alt="Elm Ridge smile simulation before and after" style="display:block;max-width:100%;height:auto;border:0;" /></p>';

  await transport.sendMail({
    from,
    to: SMILE_EMAIL_TO,
    replyTo: fields.email || undefined,
    subject: `New smile simulation lead: ${name}`,
    text: [
      'New smile simulation request',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      '',
      'What would they like to improve?',
      message,
      '',
      'Ready to talk about your smile makeover? Call us at 254-699-4127 to schedule a cosmetic consult.',
      '',
      'This smile simulation is for consultation planning only and is not a diagnosis, treatment plan, or guarantee of outcome.',
    ].join('\n'),
    html: [
      '<div style="font-family:Arial,sans-serif;color:#2C3E3E;">',
      '<h2 style="margin:0 0 12px;">New smile simulation request</h2>',
      `<p style="line-height:1.6;margin:0 0 16px;"><strong>Name:</strong> ${safeName}<br /><strong>Phone:</strong> ${safePhone}<br /><strong>Email:</strong> ${safeEmail}</p>`,
      `<p style="line-height:1.6;margin:0 0 18px;"><strong>What would they like to improve?</strong><br />${safeMessage}</p>`,
      introHtml,
      imageHtml,
      '<p style="font-size:13px;line-height:1.5;color:#667;margin:16px 0 0;">This smile simulation is for consultation planning only and is not a diagnosis, treatment plan, or guarantee of outcome.</p>',
      '</div>',
    ].join(''),
    attachments,
  });

  if (fields.email) {
    await transport.sendMail({
      from,
      to: fields.email,
      replyTo: SMILE_EMAIL_TO,
      subject: 'Your Elm Ridge smile simulation',
      text: [
        `Hi ${fields.name || 'there'},`,
        '',
        'Thank you for trying the Elm Ridge smile simulation tool.',
        '',
        'Ready to talk about your smile makeover? Call us at 254-699-4127 to schedule a cosmetic consult.',
        '',
        'This image is a simulation for education and consultation planning only. It is not a diagnosis, treatment plan, or guarantee of outcome. A personalized recommendation requires an evaluation with our dental team.',
        '',
        'Elm Ridge Implant and Family Dentistry',
        '2601 E. Elms Rd, Killeen, TX 76542',
        '254-699-4127',
        'https://www.elmridgedental.com',
      ].join('\n'),
      html: [
        '<div style="font-family:Arial,sans-serif;color:#2C3E3E;">',
        `<p style="font-size:16px;line-height:1.5;margin:0 0 14px;">Hi ${escapeHtml(fields.name || 'there')},</p>`,
        '<p style="font-size:16px;line-height:1.5;margin:0 0 14px;">Thank you for trying the Elm Ridge smile simulation tool.</p>',
        introHtml,
        imageHtml,
        '<p style="font-size:13px;line-height:1.5;color:#667;margin:16px 0 20px;">This image is a simulation for education and consultation planning only. It is not a diagnosis, treatment plan, or guarantee of outcome. A personalized recommendation requires an evaluation with our dental team.</p>',
        '<p style="font-size:15px;line-height:1.5;margin:0;"><strong>Elm Ridge Implant and Family Dentistry</strong><br />2601 E. Elms Rd, Killeen, TX 76542<br />254-699-4127<br /><a href="https://www.elmridgedental.com" style="color:#5A9A9A;">www.elmridgedental.com</a></p>',
        '</div>',
      ].join(''),
      attachments,
    });
  }

  return true;
}

async function handleSmileSimulation(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { Allow: 'POST' });
    res.end();
    return;
  }

  try {
    const { uploadedFile } = await parseSmileUpload(req);
    const validationError = validateSmileUpload(uploadedFile);

    if (validationError) {
      json(res, validationError.includes('OpenAI API key') ? 500 : 400, {
        error: validationError,
      });
      return;
    }

    const imageUrl = await generateSmileSimulationImage(uploadedFile);

    json(res, 200, {
      imageUrl,
    });
  } catch (error) {
    if (!isProduction) console.error('Smile simulation error:', error);

    json(res, 500, {
      error: 'Smile simulation failed. Please try another clear smile photo.',
    });
  }
}

async function handleSmileSimulationStart(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { Allow: 'POST' });
    res.end();
    return;
  }

  try {
    const { uploadedFile } = await parseSmileUpload(req);
    const validationError = validateSmileUpload(uploadedFile);

    if (validationError) {
      json(res, validationError.includes('OpenAI API key') ? 500 : 400, {
        error: validationError,
      });
      return;
    }

    const jobId = randomUUID();
    smilePreviewJobs.set(jobId, {
      status: 'pending',
      createdAt: Date.now(),
    });

    processSmilePreviewJob(jobId, uploadedFile);

    json(res, 202, {
      jobId,
    });
  } catch (error) {
    if (!isProduction) console.error('Smile simulation start error:', error);

    json(res, error instanceof SmileUploadError ? error.statusCode : 500, {
      error: error instanceof SmileUploadError
        ? error.message
        : 'Smile simulation failed to start. Please try another clear smile photo.',
    });
  }
}

async function handleSmileSimulationStatus(req, res, requestUrl) {
  if (req.method !== 'GET') {
    res.writeHead(405, { Allow: 'GET' });
    res.end();
    return;
  }

  const jobId = requestUrl.searchParams.get('jobId') || '';
  const job = smilePreviewJobs.get(jobId);

  if (!job) {
    json(res, 404, {
      status: 'error',
      error: 'Smile preview job was not found. Please start a new preview.',
    });
    return;
  }

  if (job.status === 'complete') {
    json(res, 200, {
      status: 'complete',
      imageUrl: job.imageUrl,
    });
    return;
  }

  if (job.status === 'error') {
    json(res, 200, {
      status: 'error',
      error: job.error || 'Smile simulation failed. Please try another clear smile photo.',
    });
    return;
  }

  json(res, 200, {
    status: 'pending',
  });
}

async function handleSmileSimulationEmail(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { Allow: 'POST' });
    res.end();
    return;
  }

  try {
    const fields = await readLargeJsonBody(req);
    const match = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(fields.compositeImage || '');

    if (!match) {
      json(res, 400, {
        error: 'Missing smile simulation image.',
      });
      return;
    }

    const compositeImageBuffer = Buffer.from(match[1], 'base64');
    await sendSmileSimulationEmail({
      fields,
      compositeImageBuffer,
    });

    json(res, 200, {
      ok: true,
    });
  } catch (error) {
    if (!isProduction) console.error('Smile simulation email error:', error);

    json(res, 500, {
      error: 'Smile simulation email failed.',
    });
  }
}
export const server = createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const host = (req.headers.host || '').split(':')[0].toLowerCase();
  const normalizedPath = requestUrl.pathname.replace(/\/+$/, '') || '/';
  const oldDestination = oldUrlRedirects.get(normalizedPath.toLowerCase());

  if (requestUrl.pathname === '/reviews' || requestUrl.pathname === '/reviews/') {
    const destination = new URL('/patient-reviews', requestUrl.origin);
    destination.search = requestUrl.search;
    res.writeHead(301, {
      Location: destination.toString(),
      'Cache-Control': 'public, max-age=3600',
    });
    res.end();
    return;
  }

  if (requestUrl.pathname === '/patient-reviews/') {
    const destination = new URL('/patient-reviews', requestUrl.origin);
    destination.search = requestUrl.search;
    res.writeHead(301, {
      Location: destination.toString(),
      'Cache-Control': 'public, max-age=3600',
    });
    res.end();
    return;
  }

  if (requestUrl.pathname === '/patient-reviews') {
    try {
      const data = await readFile(join(__dirname, 'patient-reviews'));
      const body = data.toString('utf8').replaceAll('__RECAPTCHA_SITE_KEY__', process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '');
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff'
      });
      res.end(body);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
    }
    return;
  }

  if (normalizedPath === '/api/contact' || (normalizedPath === '/contact' && req.method === 'POST')) {
    await handleContactForm(req, res);
    return;
  }

  if (goneUrls.has(normalizedPath.toLowerCase())) {
    res.writeHead(410, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'X-Robots-Tag': 'noindex',
    });
    res.end('410 Gone');
    return;
  }

  if (normalizedPath === '/api/smile-simulation/start' || normalizedPath === '/smile-simulation/start') {
    await handleSmileSimulationStart(req, res);
    return;
  }

  if (normalizedPath === '/api/smile-simulation/status' || normalizedPath === '/smile-simulation/status') {
    await handleSmileSimulationStatus(req, res, requestUrl);
    return;
  }

  if (normalizedPath === '/api/smile-simulation' || normalizedPath === '/smile-simulation') {
    await handleSmileSimulation(req, res);
    return;
  }

  if (normalizedPath === '/api/smile-simulation-email' || normalizedPath === '/smile-simulation-email') {
    await handleSmileSimulationEmail(req, res);
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

  try {
    let servedPath = filePath;
    let data;
    try {
      data = await readFile(servedPath);
    } catch {
      try {
        servedPath = join(filePath, 'index.html');
        data = await readFile(servedPath);
      } catch {
        servedPath = `${filePath}.html`;
        data = await readFile(servedPath);
      }
    }
    const ext = extname(servedPath).toLowerCase();
    const contentType = ext ? (mime[ext] || 'application/octet-stream') : 'text/html; charset=utf-8';
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
}).listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
