import fs from 'fs';
import { head, header, footer, menuScript, breadcrumb, domain, faqSchema, withHeadSchemas } from './site-helpers.mjs';

const postOpPages = [
  {
    title: 'Dental Fillings',
    slug: 'fillings',
    serviceLabel: 'General Dentistry',
    servicePath: '/#services',
    surgical: false,
    content: [
      { type: 'list', items: [
        'Do not eat until numbness has worn off to avoid biting your cheek, lip, or tongue.',
        'Use caution with hot foods while numb—you may not be able to judge temperature accurately.',
        'Your filling is fully hardened when you leave the office.',
      ] },
      { type: 'heading', text: 'What to Expect:' },
      { type: 'list', items: [
        'Some cold sensitivity is normal for a few days to a couple of weeks.',
        'This is usually due to temporary inflammation of the nerve, similar to how other tissues respond after minor procedures.',
        'It should gradually improve.',
      ] },
      { type: 'heading', text: 'Call us if:' },
      { type: 'list', items: [
        'Cold sensitivity lingers or worsens',
        'Pain to heat or spontaneous pain develops',
        'Pain with biting',
        'Your bite feels high or uneven',
      ] },
    ],
    faq: [
      ['Is sensitivity after a filling normal?', 'Some cold sensitivity is normal for a few days to a couple of weeks after a filling and should gradually improve.'],
      ['When can I eat after a filling?', 'Do not eat until numbness has worn off so you do not accidentally bite your cheek, lip, or tongue.'],
    ],
  },
  {
    title: 'Crowns (Temporary)',
    slug: 'crowns',
    serviceLabel: 'Dental Crowns',
    servicePath: '/dental-crowns-killeen-tx',
    surgical: false,
    content: [
      { type: 'list', items: [
        'You will leave with a temporary crown while your final crown is being fabricated.',
        'Avoid all hard or sticky foods until the permanent crown is placed.',
        'Brush normally, but gently around the area.',
      ] },
      { type: 'heading', text: 'Flossing:' },
      { type: 'list', items: ['Always pull floss out to the side, not upward, to prevent dislodging the temporary.'] },
      { type: 'heading', text: 'If your temporary comes off:' },
      { type: 'list', items: [
        'Call us to let us know.',
        'This is usually not an emergency unless sensitivity is present.',
        'If intact:',
        'A small amount of toothpaste can help hold it temporarily (remove before eating or sleeping)',
        'Temporary cement from a pharmacy can also be used if needed',
      ] },
    ],
    faq: [
      ['What if my temporary crown falls off?', 'Call us to let us know. If the temporary is intact, a small amount of toothpaste or pharmacy temporary cement may help hold it briefly if needed.'],
      ['Can I floss around a temporary crown?', 'Yes, but pull floss out to the side instead of upward so you do not dislodge the temporary crown.'],
    ],
  },
  {
    title: 'Tooth Extractions',
    slug: 'extractions',
    serviceLabel: 'Emergency Dental Care',
    servicePath: '/emergency-dentist-killeen-tx',
    surgical: true,
    content: [
      { type: 'heading', text: 'Bleeding:' },
      { type: 'list', items: [
        'Some oozing is normal.',
        'You should not be soaking through gauze repeatedly.',
      ] },
      { type: 'heading', text: 'Most common cause of continued bleeding is inadequate pressure:' },
      { type: 'list', items: [
        'Make sure the gauze is positioned directly over the site',
        'Use enough gauze so that your teeth do NOT touch when biting',
        'Use multiple gauze squares if needed',
        'Wrap them in a larger piece to maintain pressure',
      ] },
      { type: 'heading', text: 'Second most common cause:' },
      { type: 'list', items: [
        'Frequent spitting',
        'This creates suction and disrupts the clot',
      ] },
      { type: 'heading', text: 'Avoid for 1 week:' },
      { type: 'list', items: [
        'Straws',
        'Smoking',
        'Forceful spitting',
        'Aggressive rinsing',
      ] },
      { type: 'heading', text: 'Diet:' },
      { type: 'list', items: [
        'Soft foods for 24 hours',
        'Avoid seeds, popcorn, small particles',
        'Avoid carbonated beverages for 3 days',
      ] },
      { type: 'heading', text: 'Swelling:' },
      { type: 'list', items: ['Ice 10 minutes on / 10 minutes off for 24 hours'] },
      { type: 'heading', text: 'Rinsing:' },
      { type: 'list', items: [
        'Begin gentle saltwater rinses after 24 hours',
        'Do not swish aggressively for 4 days',
      ] },
      { type: 'list', items: [
        'Dry socket may occur if the clot is disrupted.',
        'Common causes include smoking, poor clot formation, and early rinsing.',
      ] },
      { type: 'heading', text: 'Call us if:' },
      { type: 'list', items: [
        'Bleeding does not improve with firm pressure',
        'Pain significantly worsens after a few days',
      ] },
    ],
    warnings: [
      'Bleeding does not improve with firm pressure',
      'Swelling rapidly worsens',
      'Fever develops',
      'Pain significantly worsens after a few days',
      'Difficulty swallowing or breathing',
    ],
    faq: [
      ['Is it normal to bleed after an extraction?', 'Some oozing is normal, but you should not be soaking through gauze repeatedly. Firm pressure directly over the site is usually the key.'],
      ['What is dry socket?', 'Dry socket may occur if the clot is disrupted. Smoking, poor clot formation, and early rinsing can increase the risk.'],
      ['When can I rinse after an extraction?', 'Begin gentle saltwater rinses after 24 hours, but do not swish aggressively for 4 days.'],
    ],
  },
  {
    title: 'Dental Implants',
    slug: 'implants',
    serviceLabel: 'Dental Implants',
    servicePath: '/dental-implants-killeen-tx',
    surgical: true,
    content: [
      { type: 'list', items: [
        'Take all prescribed medications, including antibiotics, as directed.',
        'Limit activity for a few days.',
      ] },
      { type: 'heading', text: 'Oral Hygiene:' },
      { type: 'list', items: [
        'Avoid brushing the surgical site for about 1 week if sutures were placed.',
        'Clean nearby teeth gently with a soft brush, floss, or cotton swab.',
      ] },
      { type: 'heading', text: 'Healing Abutment:' },
      { type: 'list', items: [
        'Do not chew on it.',
        'Do not push on it with your tongue or finger.',
        'If it becomes loose or falls out, call immediately.',
      ] },
      { type: 'heading', text: 'Chewing:' },
      { type: 'list', items: ['Do not chew on the implant site for at least 3 months.'] },
      { type: 'heading', text: 'Smoking:' },
      { type: 'list', items: [
        'Smoking is the number one cause of implant failure.',
        'If an implant fails in a smoker, no refunds will be provided and additional charges will apply for future treatment.',
      ] },
      { type: 'heading', text: 'Timeline:' },
      { type: 'list', items: [
        'Typical healing is 3–4 months.',
        '6 months if sinus grafting was performed.',
      ] },
    ],
    warnings: [
      'Healing abutment becomes loose or falls out',
      'Swelling rapidly worsens',
      'Fever develops',
      'Severe worsening pain',
      'Difficulty swallowing or breathing',
    ],
    faq: [
      ['How long do dental implants take to heal?', 'Typical implant healing is 3 to 4 months, or about 6 months if sinus grafting was performed.'],
      ['Can I chew on my dental implant while it heals?', 'Do not chew on the implant site for at least 3 months unless you are specifically told otherwise.'],
      ['Why is smoking a problem after implant surgery?', 'Smoking is the number one cause of implant failure and can seriously interfere with healing.'],
      ['What should I do if my healing abutment comes loose?', 'Do not chew on it or push on it. If it becomes loose or falls out, call immediately.'],
      ['Can a dental implant fail?', 'Implants can fail, especially when healing is disrupted. Smoking is listed in these instructions as the number one cause of implant failure.'],
    ],
  },
  {
    title: 'Bone Grafting',
    slug: 'bone-graft',
    serviceLabel: 'Dental Implants',
    servicePath: '/dental-implants-killeen-tx',
    surgical: true,
    content: [
      { type: 'list', items: [
        'Follow extraction instructions unless otherwise directed.',
        'Sutures will always be placed.',
        'Small graft particles may come out. This is normal.',
        'Avoid chewing in the area for 3–4 weeks.',
      ] },
    ],
    warnings: [
      'Swelling rapidly worsens',
      'Fever develops',
      'Severe worsening pain',
      'Bleeding does not improve with firm pressure',
      'Difficulty swallowing or breathing',
    ],
    faq: [
      ['Is it normal for bone graft particles to come out?', 'Yes. Small graft particles may come out, and this can be normal.'],
      ['How long should I avoid chewing on a bone graft?', 'Avoid chewing in the grafted area for 3 to 4 weeks unless directed otherwise.'],
    ],
  },
  {
    title: 'Root Canal Therapy',
    slug: 'root-canal',
    serviceLabel: 'Root Canal Therapy',
    servicePath: '/root-canal-killeen-tx',
    surgical: false,
    painControl: true,
    content: [
      { type: 'list', items: [
        'Avoid chewing hard foods on the treated tooth.',
        'Unless told otherwise, a crown is typically needed as soon as possible.',
        'The tooth is more fragile after a root canal and can break without protection.',
        'Mild soreness is normal for a few days to a week.',
      ] },
      { type: 'heading', text: 'Call us if:' },
      { type: 'list', items: [
        'Pain is severe or worsening',
        'Swelling develops',
      ] },
    ],
    warnings: [
      'Pain is severe or worsening',
      'Swelling develops',
      'Fever develops',
      'Difficulty swallowing or breathing',
    ],
  },
  {
    title: 'Deep Cleanings',
    slug: 'deep-cleaning',
    serviceLabel: 'General Dentistry',
    servicePath: '/#services',
    surgical: false,
    content: [
      { type: 'list', items: [
        'Mild soreness for a few days is normal.',
        'Cold sensitivity may occur for a few weeks.',
        'Use sensitivity toothpaste and prescribed rinse as directed.',
      ] },
    ],
  },
  {
    title: 'Teeth Whitening',
    slug: 'whitening',
    serviceLabel: 'Cosmetic Dentistry',
    servicePath: '/cosmetic-dentistry-killeen-tx',
    surgical: false,
    content: [
      { type: 'list', items: [
        'Sensitivity is normal in some patients and is temporary.',
        'It does not damage teeth.',
        'You may need to alternate days.',
        'Avoid staining foods immediately after whitening.',
      ] },
    ],
  },
  {
    title: 'Immediate Dentures',
    slug: 'immediate-dentures',
    serviceLabel: 'Dentures',
    servicePath: '/dentures-killeen-tx',
    surgical: true,
    content: [
      { type: 'list', items: ['Leave dentures in for the first 48 hours, removing only to clean.'] },
      { type: 'heading', text: 'After 48 hours:' },
      { type: 'list', items: [
        'Remove at night while sleeping.',
        'Remove at least once daily for cleaning.',
      ] },
      { type: 'heading', text: 'Cleaning:' },
      { type: 'list', items: [
        'Brush dentures daily.',
        'Soak in denture cleaner if desired.',
        'Use mild dish soap if needed.',
        'Do not use toothpaste.',
      ] },
      { type: 'heading', text: 'Important Expectations for Immediate Dentures' },
      { type: 'paragraph', text: 'Because immediate dentures are made before teeth are removed, there are some unique challenges:' },
      { type: 'list', items: [
        'Esthetics and bite cannot be fully verified beforehand.',
        'Perfect results cannot be guaranteed.',
        'Fit will change significantly during healing, and relines will be necessary to catch up with changes.',
        'Looseness is normal.',
        'Sore spots are common. Call early for adjustments if sore spots develop — do not wait for sores to become severe.',
      ] },
      { type: 'paragraph', text: 'For these reasons, immediate dentures are often considered "temporary" or "healing dentures." A second denture may be needed after healing (roughly six months) to overcome these challenges.' },
    ],
    warnings: [
      'Severe sores develop',
      'Bleeding does not improve with firm pressure',
      'Swelling rapidly worsens',
      'Fever develops',
      'Difficulty swallowing or breathing',
    ],
    faq: [
      ['How long should I wear immediate dentures?', 'Leave immediate dentures in for the first 48 hours, removing only to clean. After 48 hours, remove them at night while sleeping.'],
      ['Are sore spots normal with immediate dentures?', 'Sore spots are common. Call early for adjustments instead of waiting for severe sores.'],
      ['Will immediate dentures get loose?', 'Yes. Fit changes significantly during healing, and looseness is normal. Relines will be needed.'],
    ],
  },
];

function painControlBlock() {
  return `<aside class="mt-8 border border-teal-light bg-teal-pale/60 p-6 sm:p-7">
    <img src="/assets/images/tylenol-ibuprofen-schedule.png" alt="Alternating Tylenol and Ibuprofen schedule for post-operative dental pain control" class="mx-auto w-full max-w-[650px] h-auto object-contain" loading="lazy" decoding="async" />
    <p class="mt-4 text-center font-body text-sm sm:text-base leading-7 text-charcoal/70">If you are unsure whether you can safely take Acetaminophen (Tylenol) or Ibuprofen (Motrin), consult your medical doctor before taking them.</p>
  </aside>`;
}

function warningBox(page) {
  if (!page.warnings?.length) return '';
  return `<aside class="mt-8 border border-teal-light bg-white p-5 sm:p-6">
    <p class="font-body text-xs uppercase tracking-widest text-teal-dark mb-3">Call us immediately if...</p>
    <ul class="space-y-2 text-charcoal/70 leading-7">${page.warnings.map(item => `<li class="flex gap-3"><span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal"></span><span>${item}</span></li>`).join('')}</ul>
  </aside>`;
}

function reviewNote() {
  return `<p class="mt-7 border-t border-teal-light/60 pt-4 font-body text-xs uppercase tracking-widest text-charcoal/45">Last updated: August 2026<br />Reviewed by Dr. Jeff Muszynski</p>`;
}

function pageFaqBlock(page) {
  if (!page.faq?.length) return '';
  return `<div class="mt-8">
    <h3 class="font-body text-base font-semibold text-charcoal mb-4">FAQ</h3>
    <div class="space-y-3">${page.faq.map(([q,a])=>`<details class="bg-white border border-teal-light p-5"><summary class="font-semibold text-charcoal">${q}</summary><p class="mt-3 text-charcoal/65 leading-7">${a}</p></details>`).join('')}</div>
  </div>`;
}

function renderContent(page, { includeFaq = false } = {}) {
  const pieces = [];
  for (const block of page.content) {
    if (block.type === 'heading') {
      pieces.push(`<h3 class="font-body text-base font-semibold text-charcoal mt-7 mb-3">${block.text}</h3>`);
    } else if (block.type === 'paragraph') {
      pieces.push(`<p class="text-charcoal/70 leading-8 sm:leading-7">${block.text}</p>`);
    } else if (block.type === 'list') {
      pieces.push(`<ul class="space-y-3 sm:space-y-2 text-charcoal/70 leading-8 sm:leading-7">${block.items.map(item => `<li class="flex gap-3"><span class="mt-3 sm:mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal"></span><span>${item}</span></li>`).join('')}</ul>`);
    }
  }
  if (page.surgical || page.painControl) pieces.push(painControlBlock());
  pieces.push(warningBox(page));
  if (includeFaq) pieces.push(pageFaqBlock(page));
  pieces.push(reviewNote());
  return pieces.join('');
}

function pageCard(page, expanded = false) {
  return `<details id="${page.slug}" data-post-op-section="${page.slug}" class="group scroll-mt-28 bg-white border border-teal-light/80 shadow-[0_18px_55px_rgba(44,62,62,0.05)]" ${expanded ? 'open' : ''}>
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 sm:px-7">
      <span class="font-display text-2xl sm:text-3xl text-charcoal">${page.title}</span>
      <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-pale text-teal-dark transition-transform group-open:rotate-45" aria-hidden="true">+</span>
    </summary>
    <div class="border-t border-teal-light/60 px-5 py-6 sm:px-7 sm:py-7">
      ${renderContent(page)}
      <div class="mt-7 flex flex-col sm:flex-row gap-3">
        <a href="/post-op/${page.slug}" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white hover:bg-teal-dark">Open Instructions Page</a>
        <a href="${page.servicePath}" class="inline-block border border-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-teal-dark hover:bg-teal-pale">Related Service</a>
      </div>
    </div>
  </details>`;
}

function hubHashScript() {
  const slugs = postOpPages.map(page => page.slug);
  return `<script>
(() => {
  const validSections = new Set(${JSON.stringify(slugs)});
  const openFromHash = () => {
    const hash = decodeURIComponent(window.location.hash || '').replace(/^#/, '');
    const sections = document.querySelectorAll('[data-post-op-section]');
    sections.forEach(section => { section.open = false; });
    if (!validSections.has(hash)) return;
    const target = document.getElementById(hash);
    if (!target) return;
    target.open = true;
    window.requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  window.addEventListener('DOMContentLoaded', openFromHash);
  window.addEventListener('hashchange', openFromHash);
})();
</script>`;
}

function fullPage(page) {
  const path = `/post-op/${page.slug}`;
  const description = `${page.title} post-operative instructions from Elm Ridge in Killeen, TX with clear guidance for healing, comfort, home care, and when to call us.`;
  return `${withHeadSchemas(head(`${page.title} Post-Operative Instructions`, description, path).replace('content="index, follow"', 'content="noindex, follow"'), breadcrumb(path, `${page.title} Instructions`), page.faq?.length ? faqSchema(page.faq) : '')}
<body class="font-body text-charcoal bg-stone">
${header()}
<main id="main-content">
  <section class="bg-charcoal text-white py-20">
    <div class="max-w-5xl mx-auto px-6">
      <nav class="text-xs uppercase tracking-widest text-teal mb-6"><a href="/">Home</a> / <a href="/post-operative-instructions">Post-Operative Instructions</a></nav>
      <p class="font-body text-xs uppercase tracking-widest text-teal mb-4">Patient Instructions</p>
      <h1 class="font-display text-5xl md:text-6xl font-light leading-tight mb-6">${page.title}</h1>
      <p class="text-white/70 leading-8 text-lg max-w-3xl">Clear, simple instructions to help you heal quickly and comfortably after your procedure.</p>
    </div>
  </section>
  <section class="py-16 bg-white">
    <div class="max-w-4xl mx-auto px-6">
      <div class="mb-8 flex flex-col sm:flex-row gap-3">
        <a href="/post-operative-instructions" class="inline-block border border-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-teal-dark hover:bg-teal-pale">All Instructions</a>
        <a href="${page.servicePath}" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white hover:bg-teal-dark">${page.serviceLabel}</a>
      </div>
      <article class="border border-teal-light bg-stone/70 p-6 sm:p-9 shadow-[0_20px_70px_rgba(44,62,62,0.06)]">
        ${renderContent(page, { includeFaq: true })}
      </article>
    </div>
  </section>
</main>
${footer()}
<script src="/accessibility.js" defer></script>
${menuScript}
</body></html>`;
}

function hubPage() {
  const path = '/post-operative-instructions';
  const description = 'Post-operative dental instructions in Killeen, TX for fillings, crowns, extractions, implants, bone grafts, whitening, and immediate dentures.';
  return `${withHeadSchemas(head('Post-Operative Instructions', description, path), breadcrumb(path, 'Post-Operative Instructions'))}
<body class="font-body text-charcoal bg-stone">
${header()}
<main id="main-content">
  <section class="bg-charcoal text-white py-20">
    <div class="max-w-5xl mx-auto px-6">
      <nav class="text-xs uppercase tracking-widest text-teal mb-6"><a href="/">Home</a> / Post-Operative Instructions</nav>
      <p class="font-body text-xs uppercase tracking-widest text-teal mb-4">Patient Instructions</p>
      <h1 class="font-display text-5xl md:text-6xl font-light leading-tight mb-6">Post-Operative Instructions</h1>
      <p class="text-white/70 leading-8 text-lg max-w-3xl">Clear, simple instructions to help you heal quickly and comfortably after your procedure.</p>
    </div>
  </section>
  <section class="py-16 bg-stone">
    <div class="max-w-4xl mx-auto px-6">
      <div class="space-y-4">
        ${postOpPages.map(page => pageCard(page)).join('')}
      </div>
    </div>
  </section>
</main>
${footer()}
<script src="/accessibility.js" defer></script>
${hubHashScript()}
${menuScript}
</body></html>`;
}

function insertFooterLink(html) {
  if (html.includes('/post-operative-instructions')) return html;
  return html.replace(
    '<li><a href="/blog" class="font-body text-sm text-white/55 hover:text-white">Blog</a></li>',
    '<li><a href="/insurance-and-financing" class="font-body text-sm text-white/55 hover:text-white">Insurance &amp; Financing</a></li><li><a href="/post-operative-instructions" class="font-body text-sm text-white/55 hover:text-white">Post-Op Instructions</a></li><li><a href="/blog" class="font-body text-sm text-white/55 hover:text-white">Blog</a></li>'
  );
}

function addServicePostOpLinks() {
  const snippets = [
    ['dental-implants-killeen-tx', '<section class="py-12 bg-stone"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-white p-7"><h2 class="font-display text-3xl text-charcoal mb-3">After Implant Treatment</h2><p class="text-charcoal/65 leading-7 mb-5">Review healing instructions for dental implant surgery and bone grafting before or after your appointment.</p><div class="flex flex-col sm:flex-row gap-3"><a href="/post-operative-instructions#implants" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">Dental Implant Instructions</a><a href="/post-operative-instructions#bone-graft" class="inline-block border border-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-teal-dark">Bone Graft Instructions</a></div></div></section>'],
    ['single-tooth-implant-killeen-tx', '<section class="py-12 bg-stone"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-white p-7"><h2 class="font-display text-3xl text-charcoal mb-3">After Implant Treatment</h2><p class="text-charcoal/65 leading-7 mb-5">Review healing instructions for dental implant surgery and bone grafting before or after your appointment.</p><div class="flex flex-col sm:flex-row gap-3"><a href="/post-operative-instructions#implants" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">Dental Implant Instructions</a><a href="/post-operative-instructions#bone-graft" class="inline-block border border-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-teal-dark">Bone Graft Instructions</a></div></div></section>'],
    ['implant-bridges-killeen-tx', '<section class="py-12 bg-stone"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-white p-7"><h2 class="font-display text-3xl text-charcoal mb-3">After Implant Treatment</h2><p class="text-charcoal/65 leading-7 mb-5">Review healing instructions for dental implant surgery and bone grafting before or after your appointment.</p><div class="flex flex-col sm:flex-row gap-3"><a href="/post-operative-instructions#implants" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">Dental Implant Instructions</a><a href="/post-operative-instructions#bone-graft" class="inline-block border border-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-teal-dark">Bone Graft Instructions</a></div></div></section>'],
    ['full-arch-dental-implants-killeen-tx', '<section class="py-12 bg-stone"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-white p-7"><h2 class="font-display text-3xl text-charcoal mb-3">After Implant Treatment</h2><p class="text-charcoal/65 leading-7 mb-5">Review healing instructions for dental implant surgery and bone grafting before or after your appointment.</p><div class="flex flex-col sm:flex-row gap-3"><a href="/post-operative-instructions#implants" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">Dental Implant Instructions</a><a href="/post-operative-instructions#bone-graft" class="inline-block border border-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-teal-dark">Bone Graft Instructions</a></div></div></section>'],
    ['all-on-4-dental-implants-killeen-tx', '<section class="py-12 bg-stone"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-white p-7"><h2 class="font-display text-3xl text-charcoal mb-3">After Implant Treatment</h2><p class="text-charcoal/65 leading-7 mb-5">Review healing instructions for dental implant surgery and bone grafting before or after your appointment.</p><div class="flex flex-col sm:flex-row gap-3"><a href="/post-operative-instructions#implants" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">Dental Implant Instructions</a><a href="/post-operative-instructions#bone-graft" class="inline-block border border-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-teal-dark">Bone Graft Instructions</a></div></div></section>'],
    ['snap-on-dentures-killeen-tx', '<section class="py-12 bg-stone"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-white p-7"><h2 class="font-display text-3xl text-charcoal mb-3">After Implant Denture Treatment</h2><p class="text-charcoal/65 leading-7 mb-5">Review implant surgery and denture healing instructions before or after your appointment.</p><div class="flex flex-col sm:flex-row gap-3"><a href="/post-operative-instructions#implants" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">Dental Implant Instructions</a><a href="/post-operative-instructions#immediate-dentures" class="inline-block border border-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-teal-dark">Immediate Denture Instructions</a></div></div></section>'],
    ['dental-crowns-killeen-tx', '<section class="py-12 bg-stone"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-white p-7"><h2 class="font-display text-3xl text-charcoal mb-3">Temporary Crown Instructions</h2><p class="text-charcoal/65 leading-7 mb-5">If you leave with a temporary crown, these instructions help protect it until your final crown is placed.</p><a href="/post-operative-instructions#crowns" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">View Crown Instructions</a></div></section>'],
    ['root-canal-killeen-tx', '<section class="py-12 bg-stone"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-white p-7"><h2 class="font-display text-3xl text-charcoal mb-3">After Root Canal Therapy</h2><p class="text-charcoal/65 leading-7 mb-5">Review what to expect after treatment and how to protect the tooth while it heals.</p><a href="/post-operative-instructions#root-canal" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">View Root Canal Instructions</a></div></section>'],
    ['dentures-killeen-tx', '<section class="py-12 bg-stone"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-white p-7"><h2 class="font-display text-3xl text-charcoal mb-3">Immediate Denture Instructions</h2><p class="text-charcoal/65 leading-7 mb-5">If dentures are placed the day teeth are removed, these instructions explain the first 48 hours and what to expect during healing.</p><a href="/post-operative-instructions#immediate-dentures" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">View Immediate Denture Instructions</a></div></section>'],
    ['cosmetic-dentistry-killeen-tx', '<section class="py-12 bg-stone"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-white p-7"><h2 class="font-display text-3xl text-charcoal mb-3">After Whitening</h2><p class="text-charcoal/65 leading-7 mb-5">Review whitening instructions for sensitivity, scheduling, and avoiding stains after treatment.</p><a href="/post-operative-instructions#whitening" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">View Whitening Instructions</a></div></section>'],
    ['emergency-dentist-killeen-tx', '<section class="py-12 bg-stone"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-white p-7"><h2 class="font-display text-3xl text-charcoal mb-3">After Tooth Extractions</h2><p class="text-charcoal/65 leading-7 mb-5">Review extraction instructions for bleeding, swelling, eating, rinsing, and dry socket prevention.</p><a href="/post-operative-instructions#extractions" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">View Extraction Instructions</a></div></section>'],
  ];

  for (const [file, snippet] of snippets) {
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    const originalHtml = html;
    html = html
      .replaceAll('href="/post-op/fillings"', 'href="/post-operative-instructions#fillings"')
      .replaceAll('href="/post-op/crowns"', 'href="/post-operative-instructions#crowns"')
      .replaceAll('href="/post-op/extractions"', 'href="/post-operative-instructions#extractions"')
      .replaceAll('href="/post-op/implants"', 'href="/post-operative-instructions#implants"')
      .replaceAll('href="/post-op/bone-graft"', 'href="/post-operative-instructions#bone-graft"')
      .replaceAll('href="/post-op/root-canal"', 'href="/post-operative-instructions#root-canal"')
      .replaceAll('href="/post-op/deep-cleaning"', 'href="/post-operative-instructions#deep-cleaning"')
      .replaceAll('href="/post-op/whitening"', 'href="/post-operative-instructions#whitening"')
      .replaceAll('href="/post-op/immediate-dentures"', 'href="/post-operative-instructions#immediate-dentures"');
    if (html.includes(snippet)) {
      if (html !== originalHtml) fs.writeFileSync(file, html);
      continue;
    }
    html = html.replace('</main>', `${snippet}</main>`);
    fs.writeFileSync(file, html);
  }
}

function updateSitemap() {
  const childPattern = /  <url><loc>https:\/\/www\.elmridgedental\.com\/post-op\/[^<]+<\/loc><priority>0\.5<\/priority><\/url>\n/g;
  let sitemap = fs.readFileSync('sitemap.xml', 'utf8').replace(childPattern, '');
  const routes = ['post-operative-instructions'];
  for (const route of routes) {
    const loc = `${domain}/${route}`;
    if (sitemap.includes(loc)) continue;
    sitemap = sitemap.replace('</urlset>', `  <url><loc>${loc}</loc><priority>0.5</priority></url>\n</urlset>`);
  }
  fs.writeFileSync('sitemap.xml', sitemap);
}

fs.mkdirSync('post-op', { recursive: true });
fs.writeFileSync('post-operative-instructions', hubPage());
for (const page of postOpPages) fs.writeFileSync(`post-op/${page.slug}`, fullPage(page));
for (const file of fs.readdirSync('.')) {
  if (fs.statSync(file).isFile()) {
    const html = fs.readFileSync(file, 'utf8');
    if (html.includes('<footer class="bg-charcoal')) fs.writeFileSync(file, insertFooterLink(html));
  }
}
addServicePostOpLinks();
updateSitemap();
