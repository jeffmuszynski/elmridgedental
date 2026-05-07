import fs from 'fs';

const pages = {
  'dental-implants-killeen-tx': [
    ['How long do dental implants take to heal?', 'Most implant cases need about 3 to 4 months of healing before the final restoration. Some grafting or sinus cases may take longer.'],
    ['Are dental implants painful?', 'Patients are numbed for implant placement. Soreness, swelling, or tenderness can happen afterward, but the visit is planned to keep the experience controlled and comfortable.'],
    ['What affects dental implant cost?', 'Cost depends on the number of implants, whether extractions or bone grafting are needed, the type of final teeth, materials, and the complexity of the case.'],
    ['Can I have sedation for dental implants?', 'Nitrous oxide and oral conscious sedation options may be available for evaluated candidates.'],
  ],
  'single-tooth-implant-killeen-tx': [
    ['How long does a single tooth implant take to heal?', 'A single tooth implant commonly heals for about 3 to 4 months before the final crown is made.'],
    ['Does a single implant protect nearby teeth?', 'A single implant can replace one missing tooth without reshaping the neighboring teeth for a traditional bridge.'],
  ],
  'implant-bridges-killeen-tx': [
    ['What is an implant bridge?', 'An implant bridge replaces several missing teeth with a fixed restoration supported by dental implants.'],
    ['Is an implant bridge different from one implant per tooth?', 'Yes. An implant bridge can often replace several teeth with fewer implants than one implant for every missing tooth.'],
  ],
  'full-arch-dental-implants-killeen-tx': [
    ['What are full-arch dental implants?', 'Full-arch dental implants replace most or all teeth in an arch with implant-supported teeth.'],
    ['Do full-arch implants require bone grafting?', 'Some patients need grafting and some do not. CBCT imaging helps evaluate bone support before treatment is recommended.'],
  ],
  'all-on-4-dental-implants-killeen-tx': [
    ['What does All-on-4 mean?', 'All-on-4 commonly refers to a full-arch implant approach that uses four implants to support fixed teeth when anatomy and planning allow.'],
    ['Is All-on-4 right for everyone?', 'No. The right number and position of implants depends on bone, bite, smile design, health history, and long-term goals.'],
  ],
  'snap-on-dentures-killeen-tx': [
    ['What are snap-on dentures?', 'Snap-on dentures are removable dentures that attach to dental implants for improved stability compared with traditional dentures.'],
    ['Are snap-on dentures fixed in place?', 'No. Snap-on dentures attach to implants but are still removable for cleaning and maintenance.'],
  ],
};

function faqSchema(qas) {
  return `<script type="application/ld+json" data-schema="implant-faq-enhancement">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qas.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  })}</script>`;
}

function faqSection(qas) {
  return `<section id="implant-faq-enhancement" class="py-16 bg-stone"><div class="max-w-4xl mx-auto px-6"><h2 class="font-display text-4xl text-charcoal mb-8">Dental Implant FAQ</h2><div class="space-y-4">${qas.map(([q, a]) => `<details class="bg-white border border-teal-light p-6"><summary class="font-semibold text-charcoal">${q}</summary><p class="mt-3 text-charcoal/65 leading-7">${a}</p></details>`).join('')}</div></div></section>`;
}

for (const [file, qas] of Object.entries(pages)) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  html = html
    .replace(/<section id="implant-faq-enhancement"[\s\S]*?<\/section>/g, '')
    .replace(/<script type="application\/ld\+json" data-schema="implant-faq-enhancement">[\s\S]*?<\/script>/g, '');
  html = html.replace('</main>', `${faqSection(qas)}</main>`);
  html = html.replace('</body>', `${faqSchema(qas)}</body>`);
  fs.writeFileSync(file, html);
}
