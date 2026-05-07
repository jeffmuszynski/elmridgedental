import fs from 'fs';
import { head, header, footer, menuScript, breadcrumb, faqSchema, domain, practiceName } from './site-helpers.mjs';

const path = '/dentist-nolanville-tx';
const title = 'Dentist Near Nolanville, TX';
const description = 'Looking for a dentist near Nolanville, TX? Elm Ridge Implant and Family Dentistry in Killeen offers implants, cosmetic dentistry, emergency care, insurance help, and family dental care.';
const faq = [
  ['Do you accept patients from Nolanville?', 'Yes. Elm Ridge Implant and Family Dentistry is located in Killeen and welcomes patients and families from Nolanville.'],
  ['How far is your office from Nolanville?', 'Our office is in Killeen, a short drive from Nolanville with convenient access from nearby local roads.'],
  ['Do you offer dental implants near Nolanville?', 'Yes. We offer dental implant consultations, CBCT-guided planning, implant placement, and implant restoration at our Killeen office.'],
  ['Do you offer emergency dental care near Nolanville?', 'Yes. Patients from Nolanville can contact our office for urgent dental problems such as tooth pain, swelling, broken teeth, or lost crowns.'],
];

const webPageSchema = `<script type="application/ld+json" data-schema="nolanville-webpage">${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description,
  url: `${domain}${path}`,
  publisher: {
    '@type': 'Dentist',
    '@id': `${domain}/#dentist`,
    name: practiceName,
  },
})}</script>`;

fs.writeFileSync('dentist-nolanville-tx', `${head(title, description, path)}
<body class="font-body text-charcoal bg-stone">
${header()}
<main id="main-content">
  <section class="bg-charcoal text-white py-20">
    <div class="max-w-5xl mx-auto px-6">
      <nav class="text-xs uppercase tracking-widest text-teal mb-6"><a href="/">Home</a> / Nolanville</nav>
      <p class="font-body text-xs uppercase tracking-widest text-teal mb-4">Nolanville Area Dentist</p>
      <h1 class="font-display text-5xl md:text-6xl font-light leading-tight mb-6">Dentist Near Nolanville, TX</h1>
      <p class="text-white/70 leading-8 text-lg max-w-3xl">Located in Killeen, Elm Ridge Implant and Family Dentistry welcomes Nolanville patients who want modern dental care, clear answers, and a privately owned office that does not feel corporate.</p>
      <div class="mt-8 flex flex-col sm:flex-row gap-4"><a href="/#contact" class="inline-block bg-teal px-8 py-4 text-xs uppercase tracking-widest font-semibold text-center">Request an Appointment</a><a href="tel:+12546994127" class="inline-block border border-teal px-8 py-4 text-xs uppercase tracking-widest font-semibold text-teal text-center">Call 254-699-4127</a></div>
    </div>
  </section>
  <section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
    <p>Nolanville families and patients are close enough to Killeen that choosing the right dental office does not have to mean choosing the nearest one. Elm Ridge Implant and Family Dentistry is built for patients who value continuity, thoughtful treatment planning, and a team that explains options clearly.</p>
    <p>Patients from Nolanville often come to us for comprehensive care under one roof, including preventive visits, emergency dental care, cosmetic dentistry, Invisalign, crowns, root canal therapy, dentures, and dental implants. The goal is not to push treatment. The goal is to give you an honest diagnosis, a clear plan, and dentistry designed to last.</p>
    <h2>Why Nolanville Patients Choose Elm Ridge</h2>
    <ul><li>Privately owned care led by Dr. Jeff and Dr. Kayla Muszynski</li><li>Modern technology, including CBCT imaging for implant planning</li><li>Dental implants placed and restored in-house</li><li>Cosmetic dentistry focused on natural-looking results</li><li>Emergency dental care for tooth pain, swelling, broken teeth, and lost crowns</li><li>Help understanding <a href="/insurance-and-financing">insurance and financing</a> before treatment begins</li></ul>
    <h2>Dental Services for Nolanville Patients</h2>
    <p><a href="/dental-implants-killeen-tx">Dental implants</a> can replace one tooth, several teeth, or support full-arch options. Our implant planning uses CBCT imaging so anatomy, bone, bite, and the final tooth position are considered before treatment begins.</p>
    <p><a href="/cosmetic-dentistry-killeen-tx">Cosmetic dentistry</a> may include whitening, bonding, veneers, crowns, Invisalign, or a combination of treatments designed around your actual smile.</p>
    <p><a href="/emergency-dentist-killeen-tx">Emergency dental care</a> is available for urgent problems like severe tooth pain, swelling, cracked teeth, broken fillings, or lost crowns. If you have difficulty breathing or swallowing, seek emergency medical care first.</p>
    <p>Patients can also review <a href="/post-operative-instructions">post-operative instructions</a> after treatment so healing guidance is easy to find from home.</p>
    <h2>Easy Access from Nolanville to Our Killeen Office</h2>
    <p>Elm Ridge Implant and Family Dentistry is located at 2601 E Elms Rd in Killeen. For many Nolanville patients, the drive is straightforward enough to make a privately owned, relationship-based dental office worth choosing over a closer corporate clinic.</p>
    <h2>Not Corporate Dentistry</h2>
    <p>Our office is intentionally personal. Patients see familiar faces, get clear recommendations, and are not rushed through a high-volume system. That continuity matters for everything from a routine exam to an implant consultation or urgent dental visit.</p>
  </div></section>
  <section class="py-16 bg-stone"><div class="max-w-4xl mx-auto px-6"><h2 class="font-display text-4xl mb-8">Nolanville Dental FAQ</h2><div class="space-y-4">${faq.map(([q,a])=>`<details class="bg-white border border-teal-light p-6"><summary class="font-semibold">${q}</summary><p class="mt-3 text-charcoal/65 leading-7">${a}</p></details>`).join('')}</div></div></section>
  <section class="py-16 bg-charcoal text-white text-center"><div class="max-w-3xl mx-auto px-6"><h2 class="font-display text-4xl mb-4">Looking for a dentist near Nolanville, TX?</h2><p class="text-white/65 mb-8">Schedule your visit with Elm Ridge Implant and Family Dentistry in Killeen.</p><a href="/#contact" class="inline-block bg-teal px-8 py-4 text-xs uppercase tracking-widest font-semibold">Request an Appointment</a></div></section>
</main>
${footer()}
${faqSchema(faq)}
${breadcrumb(path, 'Nolanville')}
${webPageSchema}
<script src="/accessibility.js" defer></script>
${menuScript}
</body></html>`);

if (fs.existsSync('dentist-harker-heights-tx')) {
  let harker = fs.readFileSync('dentist-harker-heights-tx', 'utf8');
  if (!harker.includes('/dentist-nolanville-tx')) {
    const linkSection = `<section class="py-10 bg-white"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-stone p-6"><p class="font-body text-sm text-charcoal/65 leading-7">Also nearby: <a href="/dentist-nolanville-tx" class="text-teal-dark font-semibold">dentist near Nolanville, TX</a>.</p></div></section>`;
    harker = harker.replace('</main>', `${linkSection}</main>`);
    fs.writeFileSync('dentist-harker-heights-tx', harker);
  }
}

let sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const loc = `${domain}/dentist-nolanville-tx`;
if (!sitemap.includes(loc)) {
  sitemap = sitemap.replace('</urlset>', `  <url><loc>${loc}</loc><priority>0.7</priority></url>\n</urlset>`);
  fs.writeFileSync('sitemap.xml', sitemap);
}
