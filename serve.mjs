import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = process.env.PORT || 3000;
const CANONICAL_ORIGIN = 'https://www.elmridgedental.com';

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

createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const host = (req.headers.host || '').split(':')[0].toLowerCase();
  const normalizedPath = requestUrl.pathname.replace(/\/+$/, '') || '/';
  const oldDestination = oldUrlRedirects.get(normalizedPath.toLowerCase());

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
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': longCacheExts.has(ext) ? 'public, max-age=31536000, immutable' : 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
