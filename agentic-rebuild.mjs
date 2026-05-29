import fs from 'fs';
import path from 'path';
import {
  breadcrumb,
  dentistEntityRef,
  domain,
  faqSchema,
  footer,
  head,
  header,
  jsonLd,
  menuScript,
  organizationEntityRef,
  practiceName,
  withHeadSchemas,
  writePage,
} from './site-helpers.mjs';

const phoneDisplay = '254-699-4127';
const phoneHref = 'tel:+12546994127';
const addressLine = '2601 E Elms Rd, Killeen, TX 76542';
const mapHref = 'https://www.google.com/maps?q=2601+E+Elms+Rd,+Killeen,+TX+76542';
const reviewPhrase = '5.0 Google rating from 550+ reviews';
const insuranceCaveat = 'We can estimate benefits, but final payment is determined by the insurance company.';
const serviceAreas = ['Killeen', 'Harker Heights', 'Copperas Cove', 'Fort Cavazos / Fort Hood', 'Belton', 'Salado', 'Temple', 'Nolanville'];

const doctorJeffServices = [
  'dental implants',
  'single implants',
  'implant bridges',
  'full-arch dental implants',
  'All-on-4-style treatment',
  'snap-on dentures',
  'dentures',
  'full-mouth implant planning',
  'surgical extractions',
  'wisdom teeth',
  'bone grafting',
  'sinus lifts',
  'immediate implants when appropriate',
  'immediate dentures',
  'root canals, including molar root canals',
  'oral surgery',
  'sleep apnea oral appliances',
  'take-home sleep studies workflow',
  'oral conscious sedation',
  'nitrous oxide',
  'cosmetic dentistry',
  'restorative dentistry',
  'family dentistry',
  'pediatric/family care',
  'clear aligners',
  'crowns',
  'bridges',
  'fillings',
];

const doctorKaylaServices = [
  'cosmetic dentistry',
  'family dentistry',
  'pediatric/family care',
  'restorative dentistry',
  'cleanings and exams',
  'fillings',
  'crowns',
  'bridges',
  'cosmetic bonding',
  'veneers',
  'whitening',
  'clear aligners',
];

const reviews = [
  ['Linda Skidmore', 'From the moment I walked in it was such a great experience. The staff is friendly and professional.'],
  ['Sherri Pearson', 'Dr. Jeff and his staff are outstanding. He took the time to explain my options and answer my questions.'],
  ['Katherine Shamard', "From securing an appointment to checkout, this is by far the best experience I've had with a dental practice."],
  ['Jeff Heckathorn', 'Friendly and very thorough. Results are incredible. Smooth, pain-free experience.'],
  ['Sally Curtis', 'I have high anxiety at the dentist. Rachel is always gentle, kind, and professional.'],
  ['Michele McCarty-Crabill', 'Dr. Jeff has a wonderful bedside manner and his touch is gentle.'],
  ['Ronald E. Smith', 'I broke a tooth and Dr. Jeff and his entire staff worked me in quickly.'],
  ['Tami Thomas Calderon', 'They took the time to get to know my grandson and help him feel comfortable.'],
  ['Ramona Dinwiddie', 'We are new patients and the staff welcomed us and made us feel right at home.'],
  ['Gloria Larkin', 'The care is exemplary. The staff is welcoming, knowledgeable, and willing to answer questions.'],
  ['Vickie Strathman', "One of the best experiences I've had in a dentist office. The staff explained everything."],
  ['Anaistasia Holston', "Dr. Jeff is always honest and does what's best for the patient."],
  ['Sherry Cason', 'Elm Ridge is that office that makes you feel welcomed and comfortable.'],
  ['Todd Martin', 'Friendly staff and really nice facilities. I was given a detailed plan for future dental work.'],
  ['Pat Davis', 'Everyone is friendly, helpful, and professional. They are thorough and explain what visits will entail.'],
  ['Maggie Foster', 'Best dental office ever. Professional, friendly, compassionate, and kind.'],
  ['Mary Avinon', 'Dr. Jeff was patient with me and explained my treatment plan from start to finish.'],
  ['Nikki Dariah', 'The kindest staff. They give you all of your options.'],
  ['Tammy L. Williams', 'Very welcoming staff. Broke my tooth and they saw me the next day.'],
  ['Robin Deeder', 'Dr. Jeff explained all options with pros and cons and even pictures.'],
  ['Walter Brizuela', 'I have been treated by both Dr. Jeff and Kayla and they are exceptional.'],
  ['Diane Oberto', 'Modern facility with a professional and caring staff. I have never been so at ease.'],
  ['Ashley Carroll', 'I came in for a second opinion and Jeff was informative, helpful, and put my worries at ease.'],
];

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function writeHtml(file, html) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

function pillLinks(items) {
  return `<div class="flex flex-wrap gap-3 not-prose">${items.map((item) => `<a href="${item.href}" class="inline-flex border border-teal-light bg-white px-4 py-2 text-sm font-semibold text-teal-dark hover:border-teal hover:text-charcoal">${esc(item.label)}</a>`).join('')}</div>`;
}

function uniqueLinks(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.href || seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  });
}

function cardGrid(items) {
  return `<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 not-prose">${items.map((item) => `<a href="${item.href}" class="block bg-white border border-teal-light p-6 hover:border-teal transition-colors"><p class="text-xs uppercase tracking-[0.26em] text-teal-dark mb-3">${esc(item.kicker || 'Service')}</p><h3 class="font-display text-3xl text-charcoal mb-3">${esc(item.label)}</h3><p class="text-charcoal/65 leading-7">${esc(item.text || 'Learn how Elm Ridge approaches this service with clear planning and practical options.')}</p></a>`).join('')}</div>`;
}

function simpleSchema(type, name, pagePath, description, extra = {}) {
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': type,
    name,
    url: `${domain}${pagePath}`,
    description,
    provider: dentistEntityRef,
    ...extra,
  }, `${pagePath.replaceAll('/', '').replaceAll('-', '_') || 'home'}_${type.toLowerCase()}`);
}

function pageIntroBlock(answer) {
  return `<section class="py-10 bg-white"><div class="max-w-4xl mx-auto px-6"><div class="border border-teal-light bg-teal-pale/50 p-6"><p class="font-body text-xs tracking-[0.28em] uppercase text-teal-dark mb-3">Short Answer</p><p class="text-charcoal/75 leading-8 text-lg">${answer}</p></div></div></section>`;
}

function atAGlance(items) {
  return `<div class="grid sm:grid-cols-2 gap-4 not-prose">${items.map(([label, value]) => `<div class="border border-teal-light bg-stone p-5"><p class="text-xs uppercase tracking-[0.26em] text-teal-dark mb-2">${esc(label)}</p><p class="text-charcoal/70 leading-7">${value}</p></div>`).join('')}</div>`;
}

function relatedSection(items) {
  return `<h2>Related Services</h2>${pillLinks(items)}`;
}

const relatedDescriptions = {
  '/services': 'Services - Browse the full Elm Ridge care menu.',
  '/new-patients': 'New patients - What to expect before your first visit.',
  '/insurance-and-financing': 'Insurance and financing - How benefits, estimates, and payment options work.',
  '/request-appointment': 'Request appointment - Send a request or call for help choosing the right visit.',
  '/reviews': 'Patient reviews - Read what patients say about their experience at Elm Ridge.',
  '/dental-implants-killeen-tx': 'Dental implants - Learn how implants can replace missing teeth with a long-term fixed option.',
  '/single-tooth-implant-killeen-tx': 'Single tooth implants - Compare one-tooth replacement options before choosing a plan.',
  '/implant-bridge-killeen-tx': 'Implant bridges - A fixed option when several teeth are missing in a row.',
  '/snap-on-dentures-killeen-tx': 'Snap-on dentures - A removable implant-retained option, especially useful for loose lower dentures.',
  '/full-arch-dental-implants-killeen-tx': 'Full-arch dental implants - Fixed implant teeth for a full upper or lower arch.',
  '/all-on-4-dental-implants-killeen-tx': 'All-on-4 dental implants - How this search term fits into full-arch planning.',
  '/dentures-vs-implants-killeen-tx': 'Dentures vs implants - Compare stability, cost, maintenance, and long-term tradeoffs.',
  '/bone-grafting-killeen-tx': 'Socket preservation grafting - How preserving bone after extraction may protect future implant options.',
  '/sinus-lift-killeen-tx': 'Limited sinus bump planning - When upper back implants need a little more room.',
  '/dental-implant-cost-killeen-tx': 'Dental implant cost - What affects implant estimates and insurance math.',
  '/dental-crowns-killeen-tx': 'Dental crowns - Stronger protection for cracked, worn, or heavily filled teeth.',
  '/crown-cost-killeen-tx': 'Crown cost - What affects crown fees, buildup needs, and insurance estimates.',
  '/root-canal-killeen-tx': 'Root canals - When infection is the reason a tooth needs more than a crown.',
  '/molar-root-canal-killeen-tx': 'Molar root canals - Why back teeth need careful canal anatomy and crown planning.',
  '/root-canal-cost-killeen-tx': 'Root canal cost - How tooth type, complexity, and restoration needs affect the estimate.',
  '/tooth-extractions-killeen-tx': 'Tooth extractions - When removing a tooth is the right move and how replacement planning works.',
  '/wisdom-teeth-removal-killeen-tx': 'Wisdom teeth - Case-by-case removal with referral when anatomy is more complex.',
  '/dentures-killeen-tx': 'Dentures - Traditional, immediate, partial, and implant-supported options explained honestly.',
  '/partial-dentures-killeen-tx': 'Partial dentures - Removable replacement for several missing teeth.',
  '/immediate-dentures-killeen-tx': 'Immediate dentures - Same-day tooth removal plans with realistic follow-up expectations.',
  '/cosmetic-dentistry-killeen-tx': 'Cosmetic dentistry - Natural-looking smile improvements planned around teeth, bite, and goals.',
  '/veneers-killeen-tx': 'Veneers - Porcelain shape and shade changes when the tooth structure supports it.',
  '/cosmetic-bonding-killeen-tx': 'Cosmetic bonding - Conservative repairs for small chips, gaps, and shape changes.',
  '/teeth-whitening-killeen-tx': 'Teeth whitening - Custom trays with take-home whitening gel.',
  '/clear-aligners-killeen-tx': 'Clear aligners - Tooth movement for crowding, spacing, relapse, and pre-restorative planning.',
  '/clear-aligner-cost-killeen-tx': 'Clear aligner cost - What affects aligner fees and financing.',
  '/emergency-dentist-killeen-tx': 'Emergency dentistry - Call first for urgent pain, swelling, broken teeth, or trauma.',
  '/broken-tooth-killeen-tx': 'Broken tooth - What determines whether a tooth needs a filling, crown, root canal, or extraction.',
  '/toothache-killeen-tx': 'Toothache - When pain points to decay, cracks, infection, bite stress, or emergency care.',
  '/dental-abscess-killeen-tx': 'Dental abscess - Swelling and infection signs that should not wait.',
  '/lost-crown-killeen-tx': 'Lost crown - What to do now and when the tooth needs a new crown or deeper treatment.',
  '/knocked-out-tooth-killeen-tx': 'Knocked-out tooth - Permanent tooth avulsion is urgent and time-sensitive.',
  '/sleep-apnea-dentist-killeen-tx': 'Sleep apnea oral appliances - Dental appliance therapy after physician diagnosis.',
  '/sleep-apnea-appliance-cost-killeen-tx': 'Sleep apnea appliance cost - Appliance ranges and medical insurance requirements.',
  '/tmj-splint-therapy-killeen-tx': 'TMJ splint therapy - Conservative splint care for selected clenching, grinding, and jaw soreness patterns.',
  '/dr-jeff-muszynski-dds': 'Jeff Muszynski, DDS - Meet the dentist who leads implant, surgical, root canal, and complex restorative care.',
  '/dr-kayla-muszynski-dds': 'Kayla Muszynski, DDS - Meet one of the dentists who provides family, restorative, and cosmetic care at Elm Ridge.',
};

function providerLinks(names = ['Jeff Muszynski, DDS', 'Kayla Muszynski, DDS']) {
  const links = names.includes('Jeff Muszynski, DDS')
    ? [{ label: 'Jeff Muszynski, DDS', href: '/dr-jeff-muszynski-dds' }]
    : [];
  if (names.includes('Kayla Muszynski, DDS')) links.push({ label: 'Kayla Muszynski, DDS', href: '/dr-kayla-muszynski-dds' });
  return `<h2>Provider Links</h2>${pillLinks(links)}`;
}

function serviceKind(page) {
  const slug = page.slug || '';
  if (slug.includes('sleep-apnea')) return 'sleep';
  if (slug.includes('tmj')) return 'tmj';
  if (slug.includes('sedation') || slug.includes('nitrous')) return 'comfort';
  if (slug.includes('implant') || slug.includes('all-on-4') || slug.includes('bone-grafting') || slug.includes('sinus-lift') || slug.includes('snap-on')) return 'implant';
  if (slug.includes('denture')) return 'denture';
  if (slug.includes('veneer') || slug.includes('bonding') || slug.includes('whitening') || slug.includes('aligner') || slug.includes('cosmetic')) return 'cosmetic';
  if (slug.includes('root-canal') || slug.includes('molar-root')) return 'root-canal';
  if (slug.includes('extraction') || slug.includes('wisdom')) return 'oral-surgery';
  if (slug.includes('crown') || slug.includes('bridge') || slug.includes('filling')) return 'restorative';
  return 'family';
}

function defaultServiceGlance(page) {
  const nextStep = `Call ${phoneDisplay} or request an appointment.`;
  switch (serviceKind(page)) {
    case 'implant':
      return [
        ['Best for', 'Missing teeth, failing teeth, loose dentures, or implant planning questions.'],
        ['Planning', 'Exam, imaging, bite review, and a clear restorative plan before treatment.'],
        ['Comfort', 'Local anesthesia, nitrous oxide, and oral conscious sedation when appropriate.'],
        ['Next step', nextStep],
      ];
    case 'denture':
      return [
        ['Best for', 'Several missing teeth, full-mouth tooth loss, or a denture that no longer feels stable.'],
        ['Options', 'Traditional dentures, partial dentures, immediate dentures, and implant-retained choices.'],
        ['Planning', 'Fit, speech, chewing, appearance, maintenance, and future implant options all matter.'],
        ['Next step', nextStep],
      ];
    case 'cosmetic':
      return [
        ['Best for', 'Chips, wear, gaps, discoloration, shape concerns, or a smile that no longer feels like you.'],
        ['Planning', 'Shade, tooth shape, bite, gum display, and facial proportions are reviewed together.'],
        ['Style', 'Natural-looking, conservative changes when the tooth structure and goals fit.'],
        ['Next step', nextStep],
      ];
    case 'comfort':
      return [
        ['Best for', 'Dental anxiety, sensitive gag reflex, longer visits, or treatment that feels hard to face.'],
        ['Options', 'Nitrous oxide and oral conscious sedation for evaluated candidates.'],
        ['Not offered', 'No IV sedation, deep sedation, or general anesthesia.'],
        ['Next step', nextStep],
      ];
    case 'sleep':
      return [
        ['Best for', 'Appropriate mild to moderate OSA patients and some CPAP-intolerant patients.'],
        ['Diagnosis', 'A sleep physician must make the official diagnosis before appliance delivery.'],
        ['Appliance', 'FDA-cleared oral appliances are used when appropriate.'],
        ['Next step', nextStep],
      ];
    case 'tmj':
      return [
        ['Scope', 'Limited TMJ care focused on splint therapy.'],
        ['Best for', 'Patients who may benefit from a protective or stabilization splint.'],
        ['Referral', 'More advanced TMJ needs are explained and referred appropriately.'],
        ['Next step', nextStep],
      ];
    case 'root-canal':
      return [
        ['Best for', 'A painful or infected tooth that can still be predictably saved.'],
        ['Molar root canals', 'Elm Ridge performs many root canals, including molars.'],
        ['Not offered', 'Root canal retreatments are not performed.'],
        ['Next step', nextStep],
      ];
    case 'oral-surgery':
      return [
        ['Best for', 'Teeth that cannot be saved predictably or wisdom teeth that need evaluation.'],
        ['Treatment', 'Simple and surgical extractions, including many wisdom tooth cases.'],
        ['Planning', 'Replacement options, grafting, and healing are discussed when relevant.'],
        ['Next step', nextStep],
      ];
    case 'restorative':
      return [
        ['Best for', 'Cavities, cracked teeth, missing teeth, worn teeth, or older dental work that is failing.'],
        ['Materials', 'Tooth-colored fillings and lab-made crowns or bridges when appropriate.'],
        ['Planning', 'The goal is to protect the tooth without overtreating it.'],
        ['Next step', nextStep],
      ];
    default:
      return [
        ['Best for', 'Families who want steady preventive care and clear answers when something changes.'],
        ['Children', 'Seen once teeth are present as part of family dentistry.'],
        ['Gum health', 'Routine periodontal therapy and maintenance are recommended when appropriate.'],
        ['Next step', nextStep],
      ];
  }
}

function defaultWhoText(page) {
  switch (serviceKind(page)) {
    case 'implant':
      return 'This helps patients who are missing one tooth, several teeth, or a full arch, as well as patients whose current denture or older dental work is not giving them the stability they need.';
    case 'denture':
      return 'This helps patients who need a removable replacement for missing teeth, are preparing for extractions, or want to compare traditional dentures with implant-retained options.';
    case 'cosmetic':
      return 'This helps patients who want their smile to look healthier, more balanced, or more like it used to look without being pushed toward a one-size-fits-all makeover.';
    case 'comfort':
      return 'This helps patients who feel anxious, have had difficult dental experiences, need longer treatment, or want to understand comfort options before scheduling.';
    case 'sleep':
      return 'This helps patients with a physician diagnosis of obstructive sleep apnea, especially appropriate mild to moderate cases and some patients who cannot tolerate CPAP.';
    case 'tmj':
      return 'This helps patients who may benefit from limited splint therapy. More complex jaw-joint, muscle, or pain concerns may need referral to a provider with a broader TMJ focus.';
    case 'root-canal':
      return 'This helps patients with tooth pain, lingering temperature sensitivity, swelling, or infection when the tooth still has a reasonable chance of being saved.';
    case 'oral-surgery':
      return 'This helps patients with teeth that are broken, infected, loose, impacted, or not predictable to save, including many wisdom tooth cases.';
    case 'restorative':
      return 'This helps patients with cavities, cracks, old fillings, missing teeth, bite changes, or damage that needs a practical repair instead of guesswork.';
    default:
      return 'This helps children, adults, and seniors who want a reliable dental home for cleanings, exams, fillings, gum monitoring, second opinions, and long-term planning.';
  }
}

function defaultExpectText(page) {
  switch (serviceKind(page)) {
    case 'implant':
      return 'Expect a diagnosis-first visit. Elm Ridge reviews imaging, bone, bite, gum health, medical history, and the final tooth design before recommending the implant path.';
    case 'denture':
      return 'Expect a conversation about fit, comfort, appearance, maintenance, and whether implants would meaningfully improve stability before a final recommendation is made.';
    case 'cosmetic':
      return 'Expect a careful look at tooth shape, shade, wear, gum display, bite, and photos when helpful. The goal is a result that fits your face and does not look overdone.';
    case 'comfort':
      return 'Expect a health-history review and clear instructions. Nitrous oxide is different from oral conscious sedation, and oral sedation requires planning and a driver.';
    case 'sleep':
      return 'Expect a workflow that respects the medical boundary: sleep-study data goes to a sleep physician, and a physician diagnosis is required before appliance delivery.';
    case 'tmj':
      return 'Expect an evaluation focused on whether splint therapy is appropriate. If the problem appears more advanced, Elm Ridge will explain referral options.';
    case 'root-canal':
      return 'Expect testing, X-rays, and a discussion of whether the tooth can be saved predictably. Back teeth often need a crown afterward to reduce fracture risk.';
    case 'oral-surgery':
      return 'Expect Elm Ridge to explain why the tooth should or should not come out, what comfort options apply, and whether grafting or replacement planning should be considered.';
    case 'restorative':
      return 'Expect Elm Ridge to explain what is damaged, how much healthy tooth remains, and whether a filling, crown, bridge, root canal, or implant option makes the most sense.';
    default:
      return 'Expect a review of health history, appropriate X-rays or imaging, a dental and gum evaluation, and a plainspoken explanation of findings.';
  }
}

function defaultCallText(page) {
  switch (serviceKind(page)) {
    case 'implant':
      return 'Call if you are missing a tooth, have a failing tooth, are tired of loose dentures, or want a second opinion before committing to implant treatment.';
    case 'denture':
      return 'Call if teeth are missing, dentures are loose, eating feels limited, or you need to plan extractions and replacement teeth at the same time.';
    case 'cosmetic':
      return 'Call if chips, wear, gaps, discoloration, crowding, or old dental work keep drawing your attention in photos or conversation.';
    case 'comfort':
      return 'Call before scheduling if anxiety, a past bad experience, or a longer procedure makes you want to talk through comfort options.';
    case 'sleep':
      return 'Call if you have a sleep apnea diagnosis, struggle with CPAP, or want to know whether an oral appliance may be appropriate after physician involvement.';
    case 'tmj':
      return 'Call if you want to know whether limited splint therapy may help. Seek medical or specialty care promptly for severe, spreading, or complex pain concerns.';
    case 'root-canal':
      return 'Call if tooth pain lingers, wakes you up, comes with swelling, or makes biting difficult. Severe swelling or trouble swallowing should be treated as an emergency.';
    case 'oral-surgery':
      return 'Call if a tooth is broken, infected, loose, impacted, painful, or being discussed for removal. Urgent swelling, trauma, or uncontrolled bleeding needs immediate attention.';
    case 'restorative':
      return 'Call if a tooth hurts, cracks, feels sharp, loses a filling, changes color, or feels different when you bite.';
    default:
      return 'Call for cleanings, new patient visits, second opinions, bleeding gums, a child first visit, or any change you do not want to guess about.';
  }
}

function defaultApproachText(page) {
  switch (serviceKind(page)) {
    case 'implant':
      return 'Elm Ridge starts with the end result in mind. The implant position, bone, gums, bite, and final tooth design all have to work together before treatment makes sense.';
    case 'denture':
      return 'Elm Ridge compares removable and implant-supported options honestly, including comfort, maintenance, cost, and what daily life usually feels like with each choice.';
    case 'cosmetic':
      return 'Cosmetic dentistry is planned with restraint. The goal is not to make every smile look the same, but to improve the details that matter while protecting healthy tooth structure.';
    case 'comfort':
      return 'Comfort care is matched to the patient and procedure. Elm Ridge explains what nitrous oxide and oral conscious sedation can and cannot do before treatment day.';
    case 'sleep':
      return 'Sleep apnea care is handled as a medical-dental workflow. Elm Ridge supports testing and oral appliance therapy, while a sleep physician handles the official diagnosis.';
    case 'tmj':
      return 'The TMJ approach is intentionally limited and honest: splint therapy when appropriate, with referral when symptoms call for more advanced care.';
    case 'root-canal':
      return 'The goal is to save teeth when that is predictable and to be clear when it is not. Elm Ridge also explains when a specialist or extraction is the more appropriate path.';
    case 'oral-surgery':
      return 'Elm Ridge does not treat extraction as the only answer. The team first considers whether the tooth can be saved, then plans removal, grafting, or replacement when needed.';
    case 'restorative':
      return 'Restorative dentistry is about matching the repair to the problem. Small damage may need a conservative filling; larger cracks or weakened teeth may need stronger protection.';
    default:
      return 'Elm Ridge keeps family dentistry practical: prevent what can be prevented, fix what needs fixing, and explain the difference clearly.';
  }
}

function renderDetailSections(sections = []) {
  if (!sections.length) return '';
  return sections.map((section) => `<h2>${esc(section.title)}</h2>${section.html || `<p>${section.text}</p>`}`).join('');
}

function defaultNextQuestions(page, related) {
  const supportHrefs = new Set(['/services', '/new-patients', '/insurance-and-financing', '/request-appointment', '/reviews']);
  return uniqueLinks(related)
    .filter((item) => !supportHrefs.has(item.href))
    .slice(0, 4)
    .map((item) => ({
      label: item.label,
      href: item.href,
      text: relatedDescriptions[item.href] || `${item.label} - Learn how this option fits into a clear treatment plan at Elm Ridge.`,
    }));
}

function nextQuestionsSection(items = []) {
  if (!items.length) return '';
  return `<h2>Common Next Questions</h2><div class="not-prose grid sm:grid-cols-2 gap-4">${items.map((item) => `<a href="${item.href}" class="block border border-teal-light bg-stone p-5 hover:border-teal transition-colors"><p class="font-semibold text-charcoal mb-2">${esc(item.label)}</p><p class="text-sm leading-7 text-charcoal/65">${esc(item.text)}</p></a>`).join('')}</div>`;
}

function serviceBody(page) {
  const supportLinks = [
    { label: 'Services', href: '/services' },
    { label: 'New patients', href: '/new-patients' },
    { label: 'Insurance and financing', href: '/insurance-and-financing' },
    { label: 'Request appointment', href: '/request-appointment' },
    { label: 'Reviews', href: '/reviews' },
  ];
  const related = uniqueLinks([...(page.related || []), ...supportLinks]).filter((item) => item.href !== `/${page.slug}`);
  const nextQuestions = page.nextQuestions || defaultNextQuestions(page, related);
  return `${pageIntroBlock(page.answer)}
  <section class="py-14 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
    <h2>At a Glance</h2>
    ${atAGlance(page.glance)}
    <h2>Who It Helps</h2>
    <p>${page.who}</p>
    <h2>How Elm Ridge Approaches It</h2>
    <p>${page.approach || defaultApproachText(page)}</p>
    ${renderDetailSections(page.detailSections)}
    <h2>What to Expect</h2>
    <p>${page.expect}</p>
    <h2>When to Call</h2>
    <p>${page.call}</p>
    <h2>Insurance and Payment</h2>
    <p>${page.payment || `Coverage depends on your plan, diagnosis, and treatment details. ${insuranceCaveat}`}</p>
    ${page.extra || ''}
    ${providerLinks(page.providers)}
    ${nextQuestionsSection(nextQuestions)}
    ${relatedSection(related)}
    <p class="bg-stone border border-teal-light p-5"><strong>Ready for the next step?</strong> Call <a href="${phoneHref}">${phoneDisplay}</a> or <a href="/request-appointment">request an appointment</a>. For urgent dental problems, call instead of using the form.</p>
  </div></section>`;
}

function createServicePage(page) {
  writePage(page.slug, {
    path: `/${page.slug}`,
    title: page.title,
    description: page.description,
    crumb: page.crumb || page.h1,
    kicker: page.kicker || 'Dental Service',
    h1: page.h1,
    intro: page.intro,
    image: page.image || 'Building.webp',
    alt: page.alt || 'Elm Ridge Implant and Family Dentistry in Killeen, TX',
    body: serviceBody(page),
    faqHeading: page.faqHeading || 'Common Questions',
    faq: page.faq,
    heroPrimaryLabel: page.isEmergency ? 'Call First' : 'Request an Appointment',
    heroPrimaryHref: page.isEmergency ? phoneHref : '/request-appointment',
    heroSecondaryLabel: page.isEmergency ? 'Request Appointment' : `Call ${phoneDisplay}`,
    heroSecondaryHref: page.isEmergency ? '/request-appointment' : phoneHref,
    footerTitle: page.footerTitle || 'Need a clear dental plan?',
    footerText: page.footerText || 'Elm Ridge will explain what is happening, what your options are, and what makes sense for your mouth.',
    footerPrimaryLabel: page.isEmergency ? 'Call First' : 'Request an Appointment',
    footerPrimaryHref: page.isEmergency ? phoneHref : '/request-appointment',
    footerSecondaryLabel: page.isEmergency ? 'Request Appointment' : `Call ${phoneDisplay}`,
    footerSecondaryHref: page.isEmergency ? '/request-appointment' : phoneHref,
    headSchemas: [
      simpleSchema('Service', page.h1, `/${page.slug}`, page.description, {
        serviceType: page.serviceType || page.h1,
        areaServed: serviceAreas.map((name) => ({ '@type': name.includes('Fort') ? 'Place' : 'City', name })),
      }),
      page.medical ? simpleSchema('MedicalProcedure', page.h1, `/${page.slug}`, page.description, {
        procedureType: page.procedureType || 'Dental',
        bodyLocation: page.bodyLocation || 'Mouth',
      }) : '',
    ],
  });
}

function standardFaq(name) {
  return [
    [`Is ${name} right for everyone?`, 'No. Elm Ridge starts with an exam, appropriate imaging, and a discussion of your goals before recommending treatment.'],
    ['Will insurance help?', `${insuranceCaveat} Coverage depends on your employer, plan, diagnosis, and remaining benefits.`],
    ['How do I schedule?', `Call ${phoneDisplay} or use the appointment request page. Online scheduling is an appointment request, not guaranteed real-time booking.`],
  ];
}

function emergencyBody(page) {
  const related = uniqueLinks(page.related || []).filter((item) => item.href !== `/${page.slug}`);
  return `${pageIntroBlock(page.answer)}
  <section class="py-14 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
    <h2>What to Do Now</h2>
    <p>${page.now}</p>
    <div class="not-prose grid sm:grid-cols-2 gap-4">
      <a href="${phoneHref}" class="block bg-teal text-white p-6 text-center font-semibold tracking-widest uppercase text-xs">Call ${phoneDisplay}</a>
      <a href="/request-appointment" class="block border border-teal p-6 text-center font-semibold tracking-widest uppercase text-xs text-teal-dark">Request Appointment</a>
    </div>
    <h2>When to Go to the ER</h2>
    <p>Go to the ER for severe swelling, trouble breathing, trouble swallowing, uncontrolled bleeding, major trauma, or any medical emergency.</p>
    <h2>What Elm Ridge Can Do</h2>
    <p>${page.treat}</p>
    ${renderDetailSections(page.detailSections)}
    <h2>Insurance and Payment</h2>
    <p>${page.costText || 'Emergency visits may involve an exam, X-rays, same-day treatment, or a staged plan. Treatment is separate from the emergency exam when needed.'} ${insuranceCaveat}</p>
    ${relatedSection(related)}
  </div></section>`;
}

function emergencyQuestionBody(page) {
  const links = uniqueLinks([...(page.related || []), serviceLinks.insurance, serviceLinks.appointment]).filter((item) => item.href !== `/${page.slug}`);
  return `${pageIntroBlock(page.answer)}
  <section class="py-14 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
    <h2>${esc(page.question || 'What should I do right now?')}</h2>
    <p>${page.now}</p>
    <div class="not-prose grid sm:grid-cols-2 gap-4">
      <a href="${phoneHref}" class="block bg-teal text-white p-6 text-center font-semibold tracking-widest uppercase text-xs">Call ${phoneDisplay}</a>
      <a href="/emergency-dentist-killeen-tx" class="block border border-teal p-6 text-center font-semibold tracking-widest uppercase text-xs text-teal-dark">Emergency Page</a>
    </div>
    <h2>Can this wait?</h2>
    <p>${page.wait}</p>
    <h2>When should I go to the ER?</h2>
    <p>Go to the ER for severe swelling, trouble breathing, trouble swallowing, uncontrolled bleeding, major trauma, or any medical emergency.</p>
    <h2>What can Elm Ridge do?</h2>
    <p>${page.treat}</p>
    <h2>What might the treatment involve?</h2>
    <p>${page.treatmentOptions}</p>
    ${renderDetailSections(page.detailSections)}
    <h2>Will insurance apply?</h2>
    <p>${page.costText || 'Emergency visits may involve an exam, X-rays, same-day treatment, or a staged plan. Treatment is separate from the emergency exam when needed.'} ${insuranceCaveat}</p>
    ${nextQuestionsSection(page.nextQuestions || [])}
    ${relatedSection(links)}
  </div></section>`;
}

function createEmergencyPage(page) {
  page = { ...page, ...(emergencyEnhancements[page.slug] || {}) };
  writePage(page.slug, {
    path: `/${page.slug}`,
    title: page.title,
    description: page.description,
    crumb: page.crumb || page.h1,
    kicker: 'Emergency Dentistry',
    h1: page.h1,
    intro: page.intro,
    body: page.isSymptom ? emergencyQuestionBody(page) : emergencyBody(page),
    faqHeading: 'Emergency FAQ',
    faq: page.faq,
    heroPrimaryLabel: 'Call First',
    heroPrimaryHref: phoneHref,
    heroSecondaryLabel: 'Request Appointment',
    heroSecondaryHref: '/request-appointment',
    footerTitle: 'Call first for urgent dental problems',
    footerText: 'Same-day care is offered when the schedule allows, but calling is the best way to get triaged.',
    footerPrimaryLabel: `Call ${phoneDisplay}`,
    footerPrimaryHref: phoneHref,
    footerSecondaryLabel: 'Request Appointment',
    footerSecondaryHref: '/request-appointment',
    headSchemas: [simpleSchema('Service', page.h1, `/${page.slug}`, page.description, { serviceType: 'Emergency dental care' })],
  });
}

const ownerCostRangeData = {
  'dental-implant-cost-killeen-tx': { ownerApprovedRange: '$3,500-$6,500 for many single-tooth implant cases. The lower end is closer to implant, abutment, and crown only; the higher end may include extraction, socket preservation grafting, and other needed extras.', needed: 'single implant, abutment/crown, extraction, grafting, sinus lift, temporary tooth options' },
  'full-arch-dental-implant-cost-killeen-tx': { ownerApprovedRange: '$25,000-$35,000 per arch for fixed full-arch dental implants; $50,000-$70,000 for both arches. Final zirconia is the go-to material; acrylic is rare/selective when appropriate.', needed: 'per-arch fixed full-arch range, temporary prosthesis, final zirconia, acrylic/select alternatives, extractions/grafting' },
  'snap-on-denture-cost-killeen-tx': { ownerApprovedRange: '$8,000-$14,000 per arch for many snap-on denture cases. Cost depends on implant count, new versus existing denture, attachments, extractions, and maintenance needs.', needed: 'implant-retained denture range by implant count, attachment maintenance, new versus existing denture' },
  'crown-cost-killeen-tx': { ownerApprovedRange: '$900-$1,600 per tooth for a lab-made crown. Core buildup commonly ranges from $250-$500 when needed.', needed: 'lab-made crown range, buildup/core range, crown replacement considerations' },
  'root-canal-cost-killeen-tx': { ownerApprovedRange: '$600-$1,200 for many root canal cases. Crown cost after root canal treatment is separate when recommended.', needed: 'anterior, premolar, molar root canal ranges and crown-after-root-canal estimate notes' },
  'clear-aligner-cost-killeen-tx': { ownerApprovedRange: '$3,500-$5,500 for many clear aligner cases, depending on complexity, treatment length, records, refinements, retainers, and insurance orthodontic benefits.', needed: 'clear aligner treatment range by case complexity, records, refinements, retainers' },
  'emergency-dentist-cost-killeen-tx': { ownerApprovedRange: '$150-$350 for emergency exam, X-ray, and triage. Treatment is separate.', needed: 'emergency exam, X-rays/imaging, common same-day treatment estimate ranges' },
  'sleep-apnea-appliance-cost-killeen-tx': { ownerApprovedRange: '$2,500-$3,500 for many sleep apnea oral appliance cases. Medical insurance may help when requirements are met.', needed: 'oral appliance range, records/scans, follow-up, medical insurance billing notes' },
};

function costBody(page) {
  const factors = [...new Set(page.factors)];
  return `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
    <div class="border border-teal-light bg-teal-pale/50 p-6">
      <p class="font-body text-xs tracking-[0.28em] uppercase text-teal-dark mb-3">Cost Estimate Basics</p>
      <p class="text-charcoal/75 leading-8 text-lg">${page.answer}</p>
    </div>
    ${page.ownerApprovedRange ? `<h2>Typical Public Cost Range</h2><p>${esc(page.ownerApprovedRange)}</p><p>Cost ranges are typical public ranges, not guarantees.</p>` : ''}
    <h2>What Affects Cost?</h2>
    <ul>${factors.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
    <h2>Insurance and Benefits</h2>
    <p>Elm Ridge is in-network with most major PPO dental plans and can file many out-of-network PPO plans. Benefits vary by employer and plan. ${insuranceCaveat}</p>
    <h2>Financing Options</h2>
    <p>CareCredit and Cherry are available. In-house payment arrangements may be considered case by case. Payment is due at the time of service unless another arrangement has been made before treatment.</p>
    <h2>Why an Exam May Be Needed</h2>
    <p>${page.exam}</p>
    ${relatedSection(uniqueLinks([...(page.related || []), serviceLinks.services, serviceLinks.newPatients, serviceLinks.insurance, serviceLinks.appointment]))}
  </div></section>`;
}

function createCostPage(page) {
  writePage(page.slug, {
    path: `/${page.slug}`,
    title: page.title,
    description: page.description,
    crumb: page.crumb,
    kicker: 'Cost and Financing',
    h1: page.h1,
    intro: page.intro,
    body: costBody(page),
    faqHeading: 'Cost FAQ',
    faq: [
      ['Can you give an exact price online?', 'No. A responsible estimate depends on diagnosis, imaging, materials, insurance, and treatment complexity.'],
      ['Do you offer financing?', 'Yes. Elm Ridge offers CareCredit and Cherry, and case-by-case in-house arrangements may be discussed.'],
      ['Will insurance cover this?', `Coverage varies by plan. ${insuranceCaveat}`],
    ],
    headSchemas: [simpleSchema('Service', page.h1, `/${page.slug}`, page.description, { serviceType: 'Dental cost consultation' })],
  });
}

function appointmentForm(idPrefix = 'appointment') {
  return `<form id="${idPrefix}-form" class="space-y-5" action="/api/contact" method="POST">
    <input type="hidden" name="_subject" id="${idPrefix}-subject" value="WEBSITE APPOINTMENT REQUEST" />
    <input type="hidden" name="_template" value="table" />
    <input type="hidden" name="_captcha" value="false" />
    <input type="hidden" name="Patient name" id="${idPrefix}-patient-name" value="" />
    <input type="hidden" name="Source page URL" id="${idPrefix}-source-page" value="" />
    <input type="hidden" name="Date/time submitted" id="${idPrefix}-submitted-at" value="" />
    <input type="hidden" name="recaptcha_token" id="${idPrefix}-recaptcha-token" value="" />
    <div class="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
      <input id="${idPrefix}-website" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div><label for="${idPrefix}-first-name" class="block font-body text-xs tracking-widest uppercase text-charcoal/50 mb-2">First Name</label><input id="${idPrefix}-first-name" name="First name" type="text" autocomplete="given-name" required class="w-full px-4 py-3 border border-teal-light bg-stone text-charcoal" /></div>
      <div><label for="${idPrefix}-last-name" class="block font-body text-xs tracking-widest uppercase text-charcoal/50 mb-2">Last Name</label><input id="${idPrefix}-last-name" name="Last name" type="text" autocomplete="family-name" required class="w-full px-4 py-3 border border-teal-light bg-stone text-charcoal" /></div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div><label for="${idPrefix}-phone" class="block font-body text-xs tracking-widest uppercase text-charcoal/50 mb-2">Phone</label><input id="${idPrefix}-phone" name="Phone" type="tel" autocomplete="tel" inputmode="tel" required class="w-full px-4 py-3 border border-teal-light bg-stone text-charcoal" /><p id="${idPrefix}-phone-error" class="hidden mt-2 font-body text-xs text-red-700" aria-live="polite">Please enter a valid phone number.</p></div>
      <div><label for="${idPrefix}-email" class="block font-body text-xs tracking-widest uppercase text-charcoal/50 mb-2">Email</label><input id="${idPrefix}-email" name="Email" type="email" autocomplete="email" class="w-full px-4 py-3 border border-teal-light bg-stone text-charcoal" /></div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div><label for="${idPrefix}-patient-type" class="block font-body text-xs tracking-widest uppercase text-charcoal/50 mb-2">Patient Type</label><select id="${idPrefix}-patient-type" name="Patient type" class="w-full px-4 py-3 border border-teal-light bg-stone text-charcoal"><option>New patient</option><option>Existing patient</option></select></div>
      <div><label for="${idPrefix}-service" class="block font-body text-xs tracking-widest uppercase text-charcoal/50 mb-2">Service of Interest</label><select id="${idPrefix}-service" name="Service of interest" required class="w-full px-4 py-3 border border-teal-light bg-stone text-charcoal"><option value="">Select a service</option><option>New patient exam and cleaning</option><option>Dental implants</option><option>Emergency care</option><option>Cosmetic dentistry</option><option>Sleep apnea oral appliance consultation</option><option>Root canal</option><option>Tooth extraction</option><option>Sedation options</option><option>Other</option></select></div>
    </div>
    <div><label for="${idPrefix}-insurance" class="block font-body text-xs tracking-widest uppercase text-charcoal/50 mb-2">Insurance</label><input id="${idPrefix}-insurance" name="Insurance information" type="text" placeholder="Insurance company, if any" class="w-full px-4 py-3 border border-teal-light bg-stone text-charcoal" /></div>
    <div><label for="${idPrefix}-message" class="block font-body text-xs tracking-widest uppercase text-charcoal/50 mb-2">Message</label><textarea id="${idPrefix}-message" name="Message" rows="4" class="w-full px-4 py-3 border border-teal-light bg-stone text-charcoal resize-none" placeholder="Tell us what you need help with. Do not include sensitive medical information."></textarea></div>
    <button id="${idPrefix}-submit" type="submit" class="w-full px-8 py-4 bg-teal text-white font-body font-semibold tracking-widest uppercase text-xs hover:bg-teal-dark disabled:opacity-70">Send Appointment Request</button>
    <p class="font-body text-xs text-charcoal/50 leading-relaxed">Online scheduling is currently an appointment request, not guaranteed real-time booking. For urgent dental problems, call ${phoneDisplay} instead of using this form.</p>
    <div id="${idPrefix}-status" class="hidden border border-teal-light bg-teal-pale/60 p-5 font-body text-base leading-relaxed text-charcoal" role="status" aria-live="polite" tabindex="-1"></div>
  </form>
  <script>
  (function(){
    const form = document.getElementById('${idPrefix}-form');
    if (!form) return;
    const submit = document.getElementById('${idPrefix}-submit');
    const status = document.getElementById('${idPrefix}-status');
    const phone = document.getElementById('${idPrefix}-phone');
    const phoneError = document.getElementById('${idPrefix}-phone-error');
    function show(message, ok) {
      if (!status) return;
      status.textContent = message;
      status.classList.remove('hidden');
      status.classList.toggle('bg-red-50', !ok);
      status.classList.toggle('text-red-800', !ok);
      status.focus();
    }
    form.addEventListener('submit', async function(event) {
      event.preventDefault();
      const digits = phone ? phone.value.replace(/\\D/g, '') : '';
      if (phone && digits.length < 10) {
        phone.setAttribute('aria-invalid', 'true');
        if (phoneError) phoneError.classList.remove('hidden');
        phone.focus();
        return;
      }
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Sending...';
      }
      const first = form.querySelector('[name="First name"]')?.value.trim() || '';
      const last = form.querySelector('[name="Last name"]')?.value.trim() || '';
      const service = form.querySelector('[name="Service of interest"]')?.value.trim() || '';
      document.getElementById('${idPrefix}-patient-name').value = (first + ' ' + last).trim();
      document.getElementById('${idPrefix}-source-page').value = window.location.href;
      document.getElementById('${idPrefix}-submitted-at').value = new Date().toLocaleString();
      document.getElementById('${idPrefix}-subject').value = ['WEBSITE APPOINTMENT REQUEST', (first + ' ' + last).trim(), service].filter(Boolean).join(' - ');
      try {
        const payload = Object.fromEntries(new FormData(form).entries());
        const response = await fetch(form.action, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error('Submission failed');
        form.reset();
        show('Thank you. Someone from our team will reach out within one business day.', true);
      } catch {
        show('Sorry, something went wrong. Please call our office or try again.', false);
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.textContent = 'Send Appointment Request';
        }
      }
    });
  })();
  </script>`;
}

function writeCustomPage(file, pagePath, title, description, crumb, body, schemas = []) {
  writeHtml(file, `${withHeadSchemas(head(title, description, pagePath), breadcrumb(pagePath, crumb), ...schemas)}<body class="font-body text-charcoal bg-stone">${header()}<main id="main-content">${body}</main>${footer()}<script src="/accessibility.js" defer></script>${menuScript}</body></html>`);
}

function hero(kicker, h1, intro, actions = '') {
  return `<section class="bg-charcoal text-white py-20"><div class="max-w-6xl mx-auto px-6"><nav class="text-xs uppercase tracking-widest text-teal mb-6"><a href="/">Home</a></nav><p class="text-xs uppercase tracking-widest text-teal mb-4">${esc(kicker)}</p><h1 class="font-display text-5xl md:text-6xl font-light leading-tight mb-6">${esc(h1)}</h1><p class="text-white/70 leading-8 text-lg max-w-3xl">${esc(intro)}</p>${actions || `<div class="flex flex-col sm:flex-row gap-4 mt-8"><a href="/request-appointment" class="inline-block bg-teal px-8 py-4 text-xs uppercase tracking-widest font-semibold text-center">Request Appointment</a><a href="${phoneHref}" class="inline-block border border-teal px-8 py-4 text-xs uppercase tracking-widest font-semibold text-teal text-center">Call ${phoneDisplay}</a></div>`}</div></section>`;
}

function buildCorePages() {
  writePage('about', {
    path: '/about',
    title: 'About Elm Ridge Implant and Family Dentistry',
    description: 'Meet Elm Ridge Implant and Family Dentistry, a private dental practice in Killeen focused on family care, implants, cosmetic dentistry, and clear treatment planning.',
    crumb: 'About',
    kicker: 'About Elm Ridge',
    h1: 'Private Dental Care With Familiar Faces',
    intro: 'Elm Ridge Implant and Family Dentistry is a privately owned Killeen practice led by Jeff Muszynski, DDS and Kayla Muszynski, DDS.',
    image: 'Building.webp',
    alt: 'Elm Ridge Implant and Family Dentistry in Killeen, TX',
    body: `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
      <h2>Who We Are</h2><p>Elm Ridge provides family dentistry, dental implants, cosmetic dentistry, restorative care, emergency dentistry, sedation options, and sleep apnea oral appliance therapy from one Killeen office. The practice is intentionally personal: familiar doctors, clear explanations, organized records, and treatment plans that are built around the patient in the chair.</p>
      <h2>Where We Are</h2><p><a href="${mapHref}" target="_blank" rel="noopener">${addressLine}</a>. Hours are Monday through Thursday from 8 AM to 5 PM. The office is closed Friday through Sunday.</p>
      <h2>Who We Serve</h2><p>Elm Ridge serves patients from ${serviceAreas.join(', ')}. Patients from nearby communities visit the Killeen office for routine care, second opinions, emergency dentistry, implant planning, cosmetic dentistry, and more involved restorative decisions.</p>
      <h2>What We Do Not Do</h2><ul><li>Elm Ridge does not accept Medicaid.</li><li>Elm Ridge does not offer IV sedation, deep sedation, or general anesthesia.</li><li>Elm Ridge does not have an in-office membership plan.</li><li>Elm Ridge does not market as a pediatric specialty office, though children are seen as part of family dentistry once teeth are present.</li></ul>
      ${pillLinks([{ label: 'Meet the doctors', href: '/doctors' }, { label: 'Services', href: '/services' }, { label: 'New patients', href: '/new-patients' }, { label: 'Reviews', href: '/reviews' }])}
    </div></section>`,
    faq: [
      ['Is Elm Ridge accepting new patients?', 'Yes. New patients can call or request an appointment online.'],
      ['Where is Elm Ridge located?', addressLine],
      ['What are the hours?', 'Monday through Thursday from 8 AM to 5 PM. Friday through Sunday are closed.'],
    ],
  });

  writePage('doctors', {
    path: '/doctors',
    title: 'Elm Ridge Dentists in Killeen, TX',
    description: 'Meet Jeff Muszynski, DDS and Kayla Muszynski, DDS, the husband-and-wife dentists at Elm Ridge Implant and Family Dentistry in Killeen.',
    crumb: 'Doctors',
    kicker: 'Our Doctors',
    h1: 'Meet Your Dentists',
    intro: 'Jeff Muszynski, DDS and Kayla Muszynski, DDS lead Elm Ridge with a mix of clinical confidence, clear explanations, and private-practice warmth.',
    image: 'dr jeff and kayla muszynski.jpg',
    alt: 'Jeff Muszynski, DDS and Kayla Muszynski, DDS',
    body: `<section class="py-16 bg-white"><div class="max-w-5xl mx-auto px-6 prose-page space-y-7">
      <div class="grid md:grid-cols-2 gap-6 not-prose">
        <a href="/dr-jeff-muszynski-dds" class="block bg-stone border border-teal-light p-6 hover:border-teal"><img src="/Jeff photo.webp" alt="Jeff Muszynski, DDS" class="w-full aspect-[4/5] object-cover mb-5" loading="lazy" decoding="async" /><h2 class="font-display text-4xl text-charcoal">Jeff Muszynski, DDS</h2><p class="text-charcoal/65 leading-7">Implants, oral surgery, root canals, sedation, sleep apnea appliances, cosmetic, restorative, and family dentistry.</p></a>
        <a href="/dr-kayla-muszynski-dds" class="block bg-stone border border-teal-light p-6 hover:border-teal"><img src="/kayla photo.webp" alt="Kayla Muszynski, DDS" class="w-full aspect-[4/5] object-cover object-[50%_18%] mb-5" loading="lazy" decoding="async" /><h2 class="font-display text-4xl text-charcoal">Kayla Muszynski, DDS</h2><p class="text-charcoal/65 leading-7">Cosmetic dentistry, family dentistry, cleanings and exams, fillings, crowns, bridges, bonding, veneers, and whitening.</p></a>
      </div>
      <h2>A Family Practice in the Plainest Sense</h2><p>Jeff and Kayla met at Abilene Christian University on a dental mission trip to Guatemala. They have three kids who keep them busy with sports, gymnastics, and school activities, plus two German shorthaired pointers named Rush and Junior.</p>
      ${pillLinks([{ label: 'Services', href: '/services' }, { label: 'New patients', href: '/new-patients' }, { label: 'Reviews', href: '/reviews' }, { label: 'Request appointment', href: '/request-appointment' }])}
    </div></section>`,
    faq: [
      ['Who are the dentists at Elm Ridge?', 'Jeff Muszynski, DDS and Kayla Muszynski, DDS.'],
      ['Where did they attend dental school?', 'Both attended the University of Oklahoma College of Dentistry.'],
    ],
  });
}

function doctorPage(doctor) {
  writePage(doctor.slug, {
    path: `/${doctor.slug}`,
    title: `${doctor.name} | Killeen Dentist | Elm Ridge`,
    description: `${doctor.name} provides private dental care at Elm Ridge Implant and Family Dentistry in Killeen. Learn about education, focus areas, and personal background.`,
    crumb: doctor.name,
    kicker: 'Elm Ridge Dentist',
    h1: doctor.name,
    intro: doctor.intro,
    image: doctor.image,
    alt: doctor.name,
    body: `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
      <h2>At a Glance</h2>${atAGlance(doctor.glance)}
      <h2>Bio</h2><p>${doctor.bio}</p><p>Jeff and Kayla have three kids who keep them busy with sports, gymnastics, and school activities. They also have two German shorthaired pointers named Rush and Junior.</p>
      <h2>Clinical Focus Areas</h2><ul>${doctor.focus.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
      <h2>Education</h2><ul><li>Abilene Christian University, undergraduate school</li><li>University of Oklahoma College of Dentistry, dental school</li><li>Dental school graduation: ${doctor.gradYear}</li></ul>
      <h2>Linked Services</h2>${pillLinks(doctor.links)}
      ${pillLinks([{ label: 'All doctors', href: '/doctors' }, { label: 'Services', href: '/services' }, { label: 'New patients', href: '/new-patients' }, { label: 'Reviews', href: '/reviews' }, { label: 'Request appointment', href: '/request-appointment' }])}
    </div></section>`,
    faq: [
      [`Where did ${doctor.name} go to school?`, `${doctor.name} attended Abilene Christian University for undergraduate school and the University of Oklahoma College of Dentistry for dental school.`],
      [`What does ${doctor.name} focus on clinically?`, doctor.focus.slice(0, 6).join(', ') + '.'],
    ],
    headSchemas: [jsonLd({
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${domain}/#${doctor.slug}`,
      name: doctor.name,
      jobTitle: 'Dentist',
      image: `${domain}/${doctor.image.replaceAll(' ', '%20')}`,
      url: `${domain}/${doctor.slug}`,
      worksFor: dentistEntityRef,
      alumniOf: [
        { '@type': 'CollegeOrUniversity', name: 'Abilene Christian University' },
        { '@type': 'CollegeOrUniversity', name: 'University of Oklahoma College of Dentistry' },
      ],
      knowsAbout: doctor.focus,
    }, `${doctor.slug}-person`)],
  });
}

function buildDoctorPages() {
  doctorPage({
    slug: 'dr-jeff-muszynski-dds',
    name: 'Jeff Muszynski, DDS',
    image: 'Jeff photo.webp',
    gradYear: '2014',
    intro: 'Jeff Muszynski, DDS focuses on implants, oral surgery, root canals, sedation, sleep apnea oral appliances, cosmetic dentistry, restorative dentistry, and family care.',
    glance: [
      ['From', 'Arizona'],
      ['Dental school', 'University of Oklahoma College of Dentistry, 2014'],
      ['Family', 'Married to Kayla; three kids'],
      ['Guilty pleasure', 'Snickers with almond'],
    ],
    bio: 'Jeff is from Arizona. He met Kayla at Abilene Christian University on a dental mission trip to Guatemala. Outside the office, he enjoys snow skiing, mountain biking, hiking, fishing, camping, and lifting weights.',
    focus: doctorJeffServices,
    links: [
      { label: 'Dental implants', href: '/dental-implants-killeen-tx' },
      { label: 'Full-arch implants', href: '/full-arch-dental-implants-killeen-tx' },
      { label: 'Tooth extractions', href: '/tooth-extractions-killeen-tx' },
      { label: 'Wisdom teeth removal', href: '/wisdom-teeth-removal-killeen-tx' },
      { label: 'Root canals', href: '/root-canal-killeen-tx' },
      { label: 'Sleep apnea appliances', href: '/sleep-apnea-dentist-killeen-tx' },
      { label: 'Sedation dentistry', href: '/sedation-dentistry-killeen-tx' },
      { label: 'Cosmetic dentistry', href: '/cosmetic-dentistry-killeen-tx' },
    ],
  });

  doctorPage({
    slug: 'dr-kayla-muszynski-dds',
    name: 'Kayla Muszynski, DDS',
    image: 'kayla photo.webp',
    gradYear: '2015',
    intro: 'Kayla Muszynski, DDS focuses on cosmetic dentistry, family dentistry, restorative dentistry, cleanings and exams, fillings, crowns, bridges, bonding, veneers, and whitening.',
    glance: [
      ['From', 'Belton, TX'],
      ['Dental school', 'University of Oklahoma College of Dentistry, 2015'],
      ['Family', 'Married to Jeff; three kids'],
      ['Guilty pleasure', 'Blue Bell Rocky Road ice cream'],
    ],
    bio: 'Kayla is from Belton, TX. She met Jeff at Abilene Christian University on a dental mission trip to Guatemala. Outside the office, she enjoys filling the house with plants, gardening, pouring into her kids, and going overboard with holiday decorations.',
    focus: doctorKaylaServices,
    links: [
      { label: 'Family dentistry', href: '/family-dentist-killeen-tx' },
      { label: 'Dental cleanings', href: '/dental-cleanings-killeen-tx' },
      { label: 'Fillings', href: '/dental-fillings-killeen-tx' },
      { label: 'Crowns', href: '/dental-crowns-killeen-tx' },
      { label: 'Bridges', href: '/dental-bridges-killeen-tx' },
      { label: 'Veneers', href: '/veneers-killeen-tx' },
      { label: 'Whitening', href: '/teeth-whitening-killeen-tx' },
      { label: 'Cosmetic bonding', href: '/cosmetic-bonding-killeen-tx' },
    ],
  });
}

const serviceLinks = {
  services: { label: 'Services', href: '/services' },
  newPatients: { label: 'New patients', href: '/new-patients' },
  insurance: { label: 'Insurance and financing', href: '/insurance-and-financing' },
  appointment: { label: 'Request appointment', href: '/request-appointment' },
  reviews: { label: 'Reviews', href: '/reviews' },
  jeff: { label: 'Jeff Muszynski, DDS', href: '/dr-jeff-muszynski-dds' },
  kayla: { label: 'Kayla Muszynski, DDS', href: '/dr-kayla-muszynski-dds' },
};

const costRanges = {
  singleImplant: '$3,500-$6,500',
  implantBridge: '$8,000-$10,000',
  snapOnDenture: '$8,000-$14,000 per arch',
  fullArch: '$25,000-$35,000 per arch',
  fullArchBoth: '$50,000-$70,000 for both arches',
  crown: '$900-$1,600 per tooth',
  coreBuildup: '$250-$500 when needed',
  rootCanal: '$600-$1,200',
  clearAligners: '$3,500-$5,500',
  emergency: '$150-$350 for emergency exam, X-rays, and triage; treatment is separate',
  sleepAppliance: '$2,500-$3,500',
  socketGraft: '$400-$650',
  sinusBump: '$500-$800 with implant placement',
  completeDentures: '$800-$1,800 per arch',
  immediateDentures: '$800-$1,800 per arch',
  partialDentures: '$800-$1,800 per arch',
  simpleExtraction: '$150-$250',
  surgicalExtraction: '$200-$300',
  wisdomTooth: '$150-$500 per tooth',
  fillings: '$150-$450',
  whitening: '$250-$500',
  veneers: '$1,200-$2,500 per tooth',
};

const costContext = 'Typical public ranges are not guarantees. PPO insurance can dramatically change out-of-pocket cost. Medicaid is not accepted. CareCredit and Cherry are available. Payment is due at time of service. Financing may help spread out larger treatment costs. ' + insuranceCaveat;

function htmlList(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

function costRangeHtml(range, note = '') {
  return `<p><strong>Typical public range:</strong> ${range}. ${note ? `${note} ` : ''}${costContext}</p>`;
}

function simpleTable(headers, rows) {
  return `<div class="not-prose overflow-x-auto my-5"><table class="w-full border-collapse text-sm"><thead><tr>${headers.map((header) => `<th class="border border-teal-light bg-stone p-3 text-left font-semibold text-charcoal">${esc(header)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td class="border border-teal-light p-3 align-top text-charcoal/75 leading-7">${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

const implantTimelineHtml = htmlList([
  'Extract the tooth and place socket preservation grafting when appropriate.',
  'Place the implant about 3-4 months later, depending on healing and anatomy.',
  'Take implant impressions or scans about 3-4 months after implant placement.',
  'Seat the final restoration about 1 month later.',
]);

function implantValueHtml() {
  return `<p>Dental implants are often one of the strongest long-term tooth replacement options. They usually cost more upfront than a removable denture or traditional bridge, but they can be more cost-effective over time because they are designed for longevity and do not rely on reshaping neighboring teeth. Bridges and dentures can work well, but they may need replacement or major maintenance during the same period that a well-planned implant is still functioning.</p>`;
}

const beforeAfterGallery = [
  ['cosmetic dentistry 2before.webp', 'Before smile photo shared with patient consent'],
  ['cosmetic dentistry 2after.webp', 'After smile photo shared with patient consent'],
  ['cosmeticdentistry3.webp', 'Smile result photo shared with patient consent'],
  ['cosmeticdentistry5.webp', 'Smile result photo shared with patient consent'],
  ['cosmetic dentistry before 11.jpg', 'Before smile photo shared with patient consent'],
  ['cosmetic dentistry 11 after.jpg', 'After smile photo shared with patient consent'],
  ['all on 4 before.jpg', 'Before full-arch smile photo shared with patient consent'],
  ['all on 4 after.JPG', 'After full-arch smile photo shared with patient consent'],
  ['cosmetic killeen before.jpg', 'Before smile photo shared with patient consent'],
  ['cosmetic killeen after.jpg', 'After smile photo shared with patient consent'],
  ['cosmetic before 1.jpg', 'Before smile photo shared with patient consent'],
  ['cosmetic after 1.jpg', 'After smile photo shared with patient consent'],
];

function cosmeticGalleryHtml() {
  return `<h2>Before-and-after photos</h2><p>Individual results vary. Images are shared with patient consent.</p><div class="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-5">${beforeAfterGallery.map(([src, alt]) => `<figure class="bg-stone border border-teal-light p-3"><img src="/${src}" alt="${alt}" class="w-full aspect-[4/3] object-cover" loading="lazy" decoding="async" /><figcaption class="sr-only">${alt}</figcaption></figure>`).join('')}</div>`;
}

const implantRelated = [
  { label: 'Dental implants', href: '/dental-implants-killeen-tx' },
  { label: 'Single tooth implant', href: '/single-tooth-implant-killeen-tx' },
  { label: 'Implant bridge', href: '/implant-bridge-killeen-tx' },
  { label: 'Snap-on dentures', href: '/snap-on-dentures-killeen-tx' },
  { label: 'Full-arch dental implants', href: '/full-arch-dental-implants-killeen-tx' },
  { label: 'All-on-4-style treatment', href: '/all-on-4-dental-implants-killeen-tx' },
  { label: 'Bone grafting', href: '/bone-grafting-killeen-tx' },
  { label: 'Sinus lifts', href: '/sinus-lift-killeen-tx' },
  { label: 'Implant cost', href: '/dental-implant-cost-killeen-tx' },
  serviceLinks.jeff,
];

const emergencyRelated = [
  { label: 'Emergency dentist', href: '/emergency-dentist-killeen-tx' },
  { label: 'Broken tooth', href: '/broken-tooth-killeen-tx' },
  { label: 'Toothache', href: '/toothache-killeen-tx' },
  { label: 'Dental abscess', href: '/dental-abscess-killeen-tx' },
  { label: 'Lost crown', href: '/lost-crown-killeen-tx' },
  { label: 'Knocked-out tooth', href: '/knocked-out-tooth-killeen-tx' },
  { label: 'Crowns', href: '/dental-crowns-killeen-tx' },
  { label: 'Root canals', href: '/root-canal-killeen-tx' },
  { label: 'Extractions', href: '/tooth-extractions-killeen-tx' },
];

const cosmeticRelated = [
  { label: 'Cosmetic dentistry', href: '/cosmetic-dentistry-killeen-tx' },
  { label: 'Veneers', href: '/veneers-killeen-tx' },
  { label: 'Cosmetic bonding', href: '/cosmetic-bonding-killeen-tx' },
  { label: 'Teeth whitening', href: '/teeth-whitening-killeen-tx' },
  { label: 'Clear aligners', href: '/clear-aligners-killeen-tx' },
  serviceLinks.reviews,
];

const serviceEnhancements = {
  'dental-implants-killeen-tx': {
    h1: 'Dental Implants Planned Around the Final Tooth',
    intro: 'A dental implant is only useful if the final tooth is comfortable, cleanable, and built for the bite it has to live in.',
    answer: 'Dental implants can replace a single tooth, several teeth, or a full arch. Elm Ridge plans the implant position, bone, gums, bite, and final restoration together instead of treating the implant screw as the whole answer.',
    glance: [
      ['Best for', 'Missing or failing teeth when bone, bite, and health history support the plan'],
      ['Typical single implant range', costRanges.singleImplant],
      ['Timeline', 'Often several months from extraction or implant placement to final tooth'],
      ['Provider focus', 'Jeff Muszynski, DDS'],
    ],
    who: 'Implants may help patients who are missing a tooth, facing an extraction, tired of loose dentures, or comparing a bridge, partial, snap-on denture, or full-arch option.',
    approach: 'Elm Ridge starts with restorative planning: what the final tooth needs to look like, how it needs to chew, whether the bite is stable, and whether the bone can support the plan. CBCT imaging is used when needed to evaluate bone, anatomy, nerves, sinus position, and implant options.',
    detailSections: [
      { title: 'Long-term value', html: implantValueHtml() },
      { title: 'When an implant may not be the right fit', html: htmlList(['A traditional bridge may make more sense if neighboring teeth already need crowns.', 'A removable denture or partial may fit the budget or timeline better.', 'Active infection, limited bone, smoking, uncontrolled diabetes, medical history, or bite forces may change the plan.', 'Some advanced surgical cases are better handled with oral surgeon or specialist involvement.']) },
      { title: 'Typical implant timeline', html: `<p>For extraction, socket preservation, implant placement, and a final restoration, a common sequence is:</p>${implantTimelineHtml}<p>Immediate implants may be possible in selected cases, but they are not appropriate for every tooth or every infection pattern. Timelines vary by healing, bone, anatomy, bite, medical history, and the treatment plan.</p>` },
      { title: 'Complex cases and specialist coordination', html: '<p>Some implant and bone grafting cases require an oral surgeon or specialist for the surgical phase. Dr. Jeff can still evaluate the restorative goals, coordinate the plan, help determine what the final teeth need to look and function like, and restore the case after surgery when appropriate.</p>' },
      { title: 'Implants placed elsewhere', html: '<p>Elm Ridge can evaluate and restore implants placed elsewhere when appropriate. Bring records if available, including implant brand or system, implant connection, implant size, placement date, prior X-rays, and restorative parts information. Elm Ridge commonly works with major implant systems and most often sees Nobel and Straumann connections, but no office can promise that every system can always be restored.</p>' },
      { title: 'Typical cost range', html: costRangeHtml(costRanges.singleImplant, 'For a single implant, the lower end is closer to implant, abutment, and crown only. The higher end may include extraction, socket preservation grafting, and other needed extras.') },
    ],
    payment: costContext,
    faq: [
      ['Are implants always better than bridges or dentures?', 'No. Implants are often one of the strongest long-term options, but bridges and dentures can be the better fit depending on teeth, bone, health, budget, and timeline.'],
      ['Can Elm Ridge restore implants placed somewhere else?', 'Often, after evaluation and with records, implant system information, and imaging as needed.'],
      ['Do you do immediate implants?', 'Sometimes. Immediate implants may be appropriate in selected cases, but infection, bone, gum tissue, and bite can make a staged plan safer.'],
      ['What if I need an oral surgeon?', 'Elm Ridge can still be the planning and restorative home when a specialist is needed for advanced surgery.'],
      ['Does insurance cover dental implants?', `Coverage varies widely by plan. ${insuranceCaveat}`],
    ],
  },
  'single-tooth-implant-killeen-tx': {
    h1: 'A Single-Tooth Implant When One Tooth Is Missing',
    answer: 'A single-tooth implant replaces one missing tooth with an implant, abutment, and crown. It can be a strong option when the neighboring teeth are healthy and the bone, gum tissue, and bite support the plan.',
    glance: [
      ['Typical range', costRanges.singleImplant],
      ['Common timeline', 'Extraction/graft, healing, implant, healing, scan, final crown'],
      ['Key advantage', 'Does not require reshaping adjacent healthy teeth'],
      ['Provider focus', 'Jeff Muszynski, DDS'],
    ],
    who: 'This can help when one tooth is missing, failing, cracked beyond repair, or being planned for removal and the goal is a fixed replacement that stands on its own.',
    detailSections: [
      { title: 'When this makes sense', html: htmlList(['The neighboring teeth are healthy and do not need crowns.', 'There is enough bone or a predictable grafting plan.', 'The bite can be managed so the implant crown is not overloaded.', 'The patient wants a fixed replacement instead of a removable partial.']) },
      { title: 'When something else may be better', html: htmlList(['A bridge may be more practical if adjacent teeth already need crowns.', 'A partial denture may fit a temporary or lower-cost plan better.', 'A staged graft or referral may be needed if bone is limited.']) },
      { title: 'Typical timeline', html: `<p>A common sequence for extraction, socket preservation, implant, and crown is:</p>${implantTimelineHtml}<p>Immediate implant placement may be possible in selected cases, but only when the anatomy, infection level, bone, and bite make it responsible.</p>` },
      { title: 'Typical cost range', html: costRangeHtml(costRanges.singleImplant, 'The lower end is closer to implant, abutment, and crown only. The higher end may include extraction, socket preservation grafting, and other needed extras.') },
    ],
    payment: costContext,
    faq: [
      ['Will I be without a tooth during healing?', 'Temporary tooth options depend on the tooth location, bite, and treatment plan. Elm Ridge will explain what is realistic before treatment starts.'],
      ['Can an implant be placed the same day as extraction?', 'Sometimes, but not every case is a good immediate implant case.'],
      ['Is a single implant better than a bridge?', 'Often it is preferred when neighboring teeth are healthy, but a bridge can still be a good option in selected cases.'],
      ['What records help if another office placed the implant?', 'Implant system, connection, size, placement date, prior X-rays, and restorative parts information are helpful.'],
    ],
  },
  'implant-bridge-killeen-tx': {
    h1: 'Implant Bridges for Several Missing Teeth in a Row',
    answer: 'An implant bridge can replace multiple missing teeth without placing one implant for every tooth. The design depends on the number of missing teeth, implant positions, bone, bite forces, final material, and restorative space.',
    glance: [
      ['Typical range', `${costRanges.implantBridge} for many typical cases`],
      ['Best for', 'Multiple missing teeth in one area'],
      ['Main comparison', 'Implant bridge vs traditional bridge'],
      ['Provider focus', 'Jeff Muszynski, DDS'],
    ],
    who: 'Implant bridges can help patients missing several teeth who want fixed teeth and either cannot or should not replace every missing tooth with an individual implant.',
    detailSections: [
      { title: 'Implant bridge vs traditional bridge', html: simpleTable(['Option', 'What to know'], [['Implant bridge', 'Does not require reshaping adjacent healthy teeth. It is surgical and usually takes longer, but can be better when neighboring teeth are healthy.'], ['Traditional bridge', 'Can be faster and less surgical. It may be practical when neighboring teeth already need crowns, but it depends on those teeth for support.']]) },
      { title: 'What affects the plan', html: htmlList(['Number of missing teeth', 'Number and position of implants', 'Final material', 'Bone needs or grafting', 'Bite forces and habits', 'Restorative space and smile line', 'Whether existing teeth are involved']) },
      { title: 'Typical cost range', html: costRangeHtml(costRanges.implantBridge, 'This applies to many typical implant bridge cases. Span length, number of implants, final material, bone needs, and bite forces can change cost.') },
    ],
    payment: costContext,
    faq: [
      ['Can an implant bridge replace several teeth?', 'Yes. It can replace multiple teeth in a row when the implants and bite can support the design.'],
      ['Is an implant bridge always better than a traditional bridge?', 'No. A traditional bridge can be appropriate when adjacent teeth already need crowns or when surgery is not the right fit.'],
      ['Can Elm Ridge restore implants placed elsewhere?', 'Yes, after evaluation and with records, system information, and imaging as needed.'],
      ['How many implants will I need?', 'That depends on the span, bone, bite, and final design. Elm Ridge will plan from the final teeth backward.'],
    ],
  },
  'bone-grafting-killeen-tx': {
    h1: 'Socket Preservation Bone Grafting After Extraction',
    intro: 'A cheap extraction today can become a more expensive implant problem later if the socket collapses and the ridge shrinks.',
    answer: 'Elm Ridge performs socket preservation grafting. The practice does not routinely perform broader ridge augmentation, block grafting, vertical grafting, or staged complex graft reconstruction.',
    glance: [
      ['Typical range', costRanges.socketGraft],
      ['Common use', 'Preserving an extraction socket when future implant replacement is possible'],
      ['Not routine scope', 'Block grafting, vertical grafting, broad ridge reconstruction'],
      ['Provider focus', 'Jeff Muszynski, DDS'],
    ],
    who: 'Socket preservation may help when a tooth is removed and the patient wants to keep implant options open, reduce ridge collapse, or avoid a bigger compromise later.',
    approach: 'Elm Ridge evaluates the tooth, infection, socket walls, future replacement plan, medical history, and anatomy before recommending a graft. Not every extraction needs one.',
    detailSections: [
      { title: 'Why bone shrinks after a tooth is removed', html: '<p>Tooth roots help support the surrounding jawbone. After a tooth is removed, the socket can narrow and flatten as it heals. That shrinkage can make a future implant harder, less ideal, or more expensive.</p>' },
      { title: 'What socket preservation does', html: '<p>Socket preservation places grafting material into the extraction socket when appropriate. The goal is to support the ridge shape while healing occurs. It can protect options, but it does not guarantee that an implant can be placed later.</p>' },
      { title: 'When socket grafting may not be necessary', html: htmlList(['The tooth is not being replaced with an implant.', 'The site has enough bone and the future plan does not depend on ridge preservation.', 'Health, infection, or anatomy makes a different timing safer.', 'The patient has chosen a removable denture plan where grafting is not expected to improve the final result enough.']) },
      { title: 'What affects the grafting plan', html: htmlList(['Infection around the tooth', 'Remaining socket walls and anatomy', 'Smoking and diabetes control', 'Health history and healing risk', 'Timing of implant placement', 'Nerve position, sinus location, and available bone on CBCT imaging']) },
      { title: 'When a specialist may be needed', html: '<p>More advanced ridge augmentation, block grafting, vertical grafting, or staged complex graft reconstruction may require referral or specialist involvement. Elm Ridge can still be the restorative planning home, coordinate goals, and restore the case after surgery when appropriate.</p>' },
      { title: 'Typical cost range', html: costRangeHtml(costRanges.socketGraft, 'Socket preservation grafting is usually discussed when future implant replacement is possible.') },
    ],
    related: [{ label: 'Tooth extractions', href: '/tooth-extractions-killeen-tx' }, { label: 'Dental implants', href: '/dental-implants-killeen-tx' }, { label: 'Single tooth implant', href: '/single-tooth-implant-killeen-tx' }, { label: 'Sinus lifts', href: '/sinus-lift-killeen-tx' }, { label: 'Implant cost', href: '/dental-implant-cost-killeen-tx' }, serviceLinks.jeff],
    payment: costContext,
    faq: [
      ['Does every extraction need a bone graft?', 'No. Socket preservation depends on the tooth, future replacement plan, anatomy, and health factors.'],
      ['Does a socket graft guarantee an implant later?', 'No. It can help preserve options, but healing, anatomy, and medical factors still matter.'],
      ['Does Elm Ridge do all types of bone grafting?', 'No. Elm Ridge performs socket preservation grafting; complex reconstruction may require referral.'],
      ['Can Elm Ridge still coordinate my implant if a specialist grafts the bone?', 'Yes, when appropriate. Elm Ridge can help plan the final tooth needs and restore the case.'],
    ],
  },
  'sinus-lift-killeen-tx': {
    h1: 'Limited Sinus Lifts for Upper Implant Planning',
    answer: 'Elm Ridge performs limited sinus lift or sinus bump procedures at the same time as implant placement when appropriate. The practice does not perform staged sinus lifts that require a separate grafting and healing phase.',
    glance: [
      ['Typical range', costRanges.sinusBump],
      ['Common area', 'Upper back teeth near the maxillary sinus'],
      ['Scope', 'Limited sinus bump with implant placement when appropriate'],
      ['Provider focus', 'Jeff Muszynski, DDS'],
    ],
    who: 'A limited sinus lift may help when an upper back tooth implant needs a small amount of additional vertical bone because the sinus is close to the implant site.',
    approach: 'CBCT imaging helps Elm Ridge evaluate sinus position, available bone, anatomy, and whether an implant can be placed responsibly in the same visit.',
    detailSections: [
      { title: 'Why the sinus matters', html: '<p>Upper back teeth sit close to the maxillary sinus. When a tooth has been missing or bone is limited, the sinus may leave less room for an implant.</p>' },
      { title: 'When a limited sinus bump may work', html: htmlList(['The implant site only needs a modest amount of additional vertical space.', 'The implant can be placed with adequate stability at the same appointment.', 'CBCT imaging shows anatomy that supports a limited approach.']) },
      { title: 'When this may not be the right fit', html: htmlList(['The site needs staged sinus grafting with a separate healing phase.', 'Sinus anatomy, infection, bone volume, or medical history makes specialist involvement safer.', 'A different tooth replacement option fits the patient better.']) },
      { title: 'Typical cost range', html: costRangeHtml(costRanges.sinusBump, 'This is for a limited sinus lift or sinus bump performed with implant placement. More advanced staged sinus grafting is outside Elm Ridge routine scope.') },
    ],
    related: [{ label: 'Dental implants', href: '/dental-implants-killeen-tx' }, { label: 'Bone grafting', href: '/bone-grafting-killeen-tx' }, { label: 'Single tooth implant', href: '/single-tooth-implant-killeen-tx' }, { label: 'Implant cost', href: '/dental-implant-cost-killeen-tx' }, serviceLinks.jeff],
    payment: costContext,
    faq: [
      ['Does every upper implant need a sinus lift?', 'No. Many upper implants do not require a sinus lift.'],
      ['Can every sinus case be handled in one visit?', 'No. Some sinus cases need staged grafting, referral, or a different treatment plan.'],
      ['How does Elm Ridge decide?', 'CBCT imaging helps evaluate bone height, sinus position, anatomy, and implant options.'],
    ],
  },
  'full-arch-dental-implants-killeen-tx': {
    title: 'Full-Arch Dental Implants in Killeen, TX | All-on-4 & All-on-X Options | Elm Ridge',
    h1: 'Full-Arch Dental Implants in Killeen',
    answer: 'Many patients search for All-on-4 or All-on-X when they are really looking for fixed implant teeth that replace an entire upper or lower arch. Elm Ridge uses the broader term full-arch dental implants because the best plan is not always exactly four implants.',
    glance: [
      ['Typical range', `${costRanges.fullArch}; ${costRanges.fullArchBoth}`],
      ['Final material', 'Zirconia is the go-to; acrylic is rare/selective'],
      ['Timeline', 'Final teeth commonly around 5-7 months after healing and records'],
      ['Provider focus', 'Jeff Muszynski, DDS'],
    ],
    who: 'Full-arch implants may help patients with failing teeth, severe denture frustration, or a goal of fixed teeth that do not come out at night.',
    approach: 'Elm Ridge discusses goals, smile, bite, bone, health history, finances, and final tooth design before treatment. The number and position of implants depends on the case; not every full-arch case uses exactly four implants.',
    detailSections: [
      { title: 'All-on-4, All-on-X, and fixed implant teeth', html: '<p>Many patients search for All-on-4 or All-on-X when they are really looking for the same broad solution: fixed implant teeth that replace an entire upper or lower arch. At Elm Ridge, the plan is based on bone, bite, anatomy, restorative space, hygiene access, and final tooth design instead of forcing every patient into one implant count.</p>' },
      { title: 'Workflow and timeline', html: htmlList(['Consultation and imaging.', 'Discussion of goals, smile, bite, bone, health history, finances, and final tooth design.', 'Extractions and implant placement when appropriate.', 'Immediate temporary fixed teeth the same day or next day when possible.', 'Healing phase.', 'Final zirconia teeth after healing, commonly around 5-7 months. Timelines vary.']) },
      { title: 'Full-arch fixed implants vs snap-on dentures', html: simpleTable(['Option', 'What to know'], [['Full-arch fixed implants', 'Teeth do not come out at night, usually feel stronger for chewing, and are often best when the patient wants maximum stability. They are more expensive and involve more planning.'], ['Snap-on dentures', 'Removable and usually less expensive than fixed full-arch treatment. Lower snap-ons can be a strong middle-ground option; upper snap-ons are more case-dependent.']]) },
      { title: 'Upper arch planning', html: '<p>For the upper arch, fixed full-arch dental implants may be a better fit than an upper snap-on denture when the patient wants the palate uncovered, stronger stability, and a result that does not depend on removable denture suction. Upper snap-on dentures can work in selected cases, but softer upper-jaw bone, sinus anatomy, implant angulation, and attachment design can make them less forgiving than lower snap-on dentures.</p>' },
      { title: 'Complex surgical cases', html: '<p>Some complex full-arch surgical cases may require oral surgeon involvement. Elm Ridge can still manage restorative planning and restore the case when appropriate.</p>' },
      { title: 'Typical cost range', html: costRangeHtml(`${costRanges.fullArch}, or ${costRanges.fullArchBoth}`, 'Costs vary with extractions, implant number and position, temporary teeth, final zirconia design, bone needs, and financing choices.') },
    ],
    payment: costContext,
    faq: [
      ['Does every full-arch case use four implants?', 'No. All-on-4-style treatment is one approach, but implant number and position depend on the case.'],
      ['Are the final teeth zirconia?', 'Zirconia is the go-to final material. Acrylic is used only rarely or selectively when appropriate.'],
      ['Will I get temporary teeth right away?', 'Immediate temporary fixed teeth may be possible the same day or next day, but it depends on the case.'],
      ['Is this better than a snap-on denture?', 'It can be when the patient wants maximum stability and fixed teeth, but cost, anatomy, surgery, and goals matter.'],
    ],
  },
  'all-on-4-dental-implants-killeen-tx': {
    title: 'All-on-4 Dental Implants in Killeen, TX | Elm Ridge',
    h1: 'All-on-4 Dental Implants in Killeen',
    answer: 'All-on-4 is a common term patients use for fixed implant teeth. At Elm Ridge, full-arch treatment is planned around anatomy, bone, bite, restorative space, final tooth design, and long-term support.',
    glance: [
      ['Main term', 'Full-arch dental implants'],
      ['All-on-X', 'Broader term for full-arch implant treatment where implant number and position may vary'],
      ['Typical range', `${costRanges.fullArch}; ${costRanges.fullArchBoth}`],
      ['Provider focus', 'Jeff Muszynski, DDS'],
    ],
    who: 'This page is useful for patients who have heard of All-on-4 and want to understand how it fits into a responsible full-arch plan.',
    detailSections: [
      { title: 'Why Elm Ridge avoids one-size-fits-all language', html: '<p>The final teeth have to fit the face, bite, bone, smile, and cleaning access. Four implants may be appropriate for some cases, but other cases need a different number or position.</p>' },
      { title: 'Where All-on-X fits', html: '<p>All-on-X is a broader search term for full-arch implant treatment where the number or position of implants may vary. Sometimes four implants are appropriate. Sometimes a different full-arch approach may be better for support, hygiene, bone, bite forces, or the final tooth design.</p>' },
      { title: 'Typical full-arch workflow', html: htmlList(['Consultation and imaging.', 'Smile, bite, bone, health history, and finance discussion.', 'Extractions and implant placement when appropriate.', 'Immediate temporary teeth same day or next day when possible.', 'Healing phase.', 'Final zirconia teeth commonly around 5-7 months.']) },
      { title: 'Typical cost range', html: costRangeHtml(`${costRanges.fullArch}, or ${costRanges.fullArchBoth}`, 'The range depends on arch, implant number, extractions, bone needs, temporary teeth, final material, and restorative design.') },
    ],
    payment: costContext,
    faq: [
      ['Is All-on-4 the same as full-arch dental implants?', 'It is one style of full-arch implant treatment, but not every case uses exactly four implants.'],
      ['Does Elm Ridge restore full-arch cases placed elsewhere?', 'Sometimes, after evaluation and with records, implant details, and imaging as needed.'],
      ['What is the final material?', 'Zirconia is the go-to final material at Elm Ridge.'],
    ],
  },
  'snap-on-dentures-killeen-tx': {
    h1: 'Snap-On Dentures When a Loose Denture Needs More Stability',
    answer: 'Snap-on dentures attach to dental implants for better retention than a traditional removable denture. At Elm Ridge, they are typically strongest and most predictable as a lower-arch solution.',
    glance: [
      ['Typical range', costRanges.snapOnDenture],
      ['Implants', 'Often 2 or 4; four is better when anatomy and finances allow'],
      ['Strongest use', 'Usually lower-arch denture stability'],
      ['Provider focus', 'Jeff Muszynski, DDS'],
    ],
    who: 'Snap-on dentures can help patients who struggle with a loose lower denture, want a removable option with more retention, or need a middle-ground between traditional dentures and fixed full-arch implants.',
    detailSections: [
      { title: 'Lower vs upper snap-on dentures', html: simpleTable(['Option', 'How Elm Ridge explains it'], [['Lower snap-on denture', 'Usually more predictable. Two implants can make a major improvement over a loose lower denture; four implants are better when possible.'], ['Upper snap-on denture', 'More case-dependent. Softer bone, sinus anatomy, implant angulation, and attachment design matter more.'], ['Fixed full-arch upper implants', 'Often better when the patient wants maximum stability and no palatal coverage, but more expensive and more involved.']]) },
      { title: 'Upper snap-on nuance', html: '<p>Upper snap-on dentures can be less predictable than lower snap-ons because the upper jaw often has softer bone, sinus anatomy can limit implant position, and removing the palate means the denture depends more heavily on implant support and attachment design. Upper snap-on dentures can work in selected cases, but they should be planned carefully.</p>' },
      { title: 'New denture or retrofit', html: '<p>A new denture or retrofitting an existing denture may be possible when appropriate. The existing denture must fit well enough and have enough restorative space for attachments.</p>' },
      { title: 'Typical cost range', html: costRangeHtml(costRanges.snapOnDenture, 'Cost depends on implant number, whether a new denture is needed, extractions, grafting, attachments, maintenance, and financing choices.') },
    ],
    payment: costContext,
    faq: [
      ['Are snap-on dentures fixed?', 'No. They snap onto implants for retention but are still removed for cleaning.'],
      ['Are two implants enough?', 'Two lower implants can be a major improvement. Four implants are better when anatomy and finances allow.'],
      ['Are upper snap-on dentures the same as lower snap-ons?', 'No. Upper cases are more dependent on bone, sinus anatomy, implant angle, palate design, and attachments.'],
      ['When is fixed full-arch better?', 'Often when the patient wants maximum stability, no palatal coverage, and a stronger long-term option.'],
    ],
  },
  'dentures-vs-implants-killeen-tx': {
    h1: 'Dentures, Snap-On Dentures, and Full-Arch Implants Compared',
    answer: 'Traditional dentures, snap-on dentures, implant bridges, and full-arch dental implants all solve different versions of tooth loss. Elm Ridge compares stability, maintenance, cost, bone, surgery, and long-term goals honestly.',
    detailSections: [
      { title: 'How the options compare', html: simpleTable(['Option', 'Best fit'], [['Traditional denture', 'Lower upfront cost and no implant surgery, but removable, less stable, and does not preserve bone like implants.'], ['Snap-on denture', 'A removable middle-ground option, especially useful for loose lower dentures.'], ['Implant bridge', 'Fixed replacement for several missing teeth without reshaping healthy neighboring teeth.'], ['Full-arch fixed implants', 'Fixed teeth for a whole arch with the strongest stability, higher cost, and more involved planning.']]) },
      { title: 'Long-term value', html: implantValueHtml() },
      { title: 'Upper snap-on consideration', html: '<p>Upper snap-on dentures can be less predictable than lower snap-ons. If the patient wants the palate uncovered and wants a highly stable result, fixed full-arch dental implants may be a stronger long-term option when anatomy and budget allow.</p>' },
    ],
    payment: costContext,
  },
  'dental-crowns-killeen-tx': {
    intro: 'A crown should not just cover a tooth. It should protect what is left, fit the bite, and look like it belongs there.',
    glance: [
      ['Typical range', costRanges.crown],
      ['Core buildup', costRanges.coreBuildup],
      ['Workflow', 'Lab-made crown; no same-day crowns'],
      ['Timing', 'Preparation, temporary crown, final cement about 2 weeks later'],
    ],
    who: 'Crowns can help cracked teeth, heavily filled teeth, worn teeth, teeth after root canal treatment, and teeth that need stronger protection than a filling can provide.',
    approach: 'Elm Ridge uses lab-made crowns only. Most crown workflows use intraoral scanning when appropriate, and material selection depends on bite, tooth location, strength needs, esthetics, and the clinical situation.',
    detailSections: [
      { title: 'When a crown makes sense', html: htmlList(['A large old filling has weakened the tooth.', 'A crack or fracture needs protection.', 'A back tooth has had root canal treatment.', 'Wear or bite forces have compromised the tooth.', 'A lab-made restoration is needed for strength and fit.']) },
      { title: 'When something else may be better', html: htmlList(['A small cavity may only need a tooth-colored filling.', 'A front tooth cosmetic concern may be better handled with bonding or a veneer.', 'A tooth split below the gumline may need extraction and replacement rather than a crown.']) },
      { title: 'Materials and technology', html: '<p>Common materials include modern porcelain options such as zirconia and e.max/lithium disilicate. Gold may be used when requested or necessary, and PFM may be used when necessary. Elm Ridge uses intraoral scanning for about 90% of applications, while choosing traditional impressions when they produce a better result.</p>' },
      { title: 'What happens if a crown is delayed', html: '<p>A weakened tooth can crack farther, lose more structure, or become painful. If the nerve becomes involved, a root canal or extraction may enter the conversation.</p>' },
      { title: 'Typical cost range', html: costRangeHtml(`${costRanges.crown}; ${costRanges.coreBuildup}`, 'A buildup is needed only when there is not enough solid tooth structure to support the crown.') },
    ],
    payment: costContext,
    faq: [
      ['Do you do same-day crowns?', 'No. Elm Ridge provides lab-made crowns only.'],
      ['How long does a crown take?', 'A typical crown is prepared first, then the final crown is cemented about 2 weeks later.'],
      ['Will I have a temporary crown?', 'Yes, in most crown workflows. The temporary protects the tooth while the lab-made crown is being made.'],
      ['Which crown material is best?', 'It depends on tooth location, bite, strength needs, esthetics, and clinical situation.'],
      ['Do back teeth need crowns after root canals?', 'Crowns are strongly recommended for posterior teeth after root canal treatment because back teeth absorb heavier chewing forces and are at higher risk of fracture.'],
    ],
  },
  'root-canal-killeen-tx': {
    h1: 'Root Canal Treatment When a Tooth Can Still Be Saved',
    glance: [
      ['Typical range', costRanges.rootCanal],
      ['Molar root canals', 'Yes, many cases'],
      ['Retreatments', 'Not offered'],
      ['Technology', 'CBCT for nearly every case, especially posterior teeth; rotary endodontics'],
    ],
    who: 'Root canal treatment may help when tooth pain, deep decay, trauma, swelling, or infection involves the nerve but the tooth is still restorable.',
    approach: 'Elm Ridge uses CBCT for nearly every root canal case, especially posterior teeth, because missed canals can contribute to failed treatment. Rotary endodontics is used, and same-day start is offered when possible.',
    detailSections: [
      { title: 'Root canal vs extraction', html: '<p>A root canal is meant to save a tooth by cleaning the infected or inflamed nerve space and sealing it. Extraction may be better when the tooth is cracked beyond repair, lacks enough structure for a crown, has severe bone loss, or has a poor long-term outlook.</p>' },
      { title: 'Why posterior teeth often need crowns', html: '<p>Crowns are strongly recommended for posterior teeth after root canal treatment because back teeth absorb heavier chewing forces and are at higher risk of fracture.</p>' },
      { title: 'Boundary: retreatments', html: '<p>Elm Ridge performs many root canals, including molars, but does not perform root canal retreatments. If retreatment is needed, the team will explain referral options.</p>' },
      { title: 'Typical cost range', html: costRangeHtml(costRanges.rootCanal, 'A crown after root canal treatment is a separate restoration and may be recommended for long-term strength.') },
    ],
    payment: costContext,
  },
  'molar-root-canal-killeen-tx': {
    h1: 'Molar Root Canals Planned With CBCT Imaging',
    glance: [
      ['Typical range', costRanges.rootCanal],
      ['Complexity', 'Molars often have multiple canals and heavier chewing forces'],
      ['Retreatments', 'Not offered'],
      ['Provider focus', 'Jeff Muszynski, DDS'],
    ],
    who: 'Molar root canals may help when a back tooth has lingering pain, biting pain, swelling, deep decay, or infection but still has enough structure to restore.',
    approach: 'Elm Ridge uses CBCT for nearly every root canal case, especially posterior teeth, to better evaluate canal anatomy. Rotary endodontics is used, and a same-day start is possible when the schedule and diagnosis allow.',
    detailSections: [
      { title: 'Why molars are more complex', html: '<p>Molars often have multiple roots and canals. Hidden anatomy matters because missed canals can contribute to failed treatment.</p>' },
      { title: 'Crown after molar root canal', html: '<p>A crown is strongly recommended for molars after root canal treatment because back teeth absorb heavy chewing forces and are more likely to fracture if left unprotected.</p>' },
      { title: 'When extraction may be better', html: '<p>If the tooth is cracked below the gumline, has too little remaining structure, or cannot be restored predictably, Elm Ridge will explain extraction and replacement options.</p>' },
      { title: 'Typical cost range', html: costRangeHtml(costRanges.rootCanal, 'The crown, if needed, is separate and depends on material, buildup needs, and insurance.') },
    ],
    payment: costContext,
  },
  'tooth-extractions-killeen-tx': {
    h1: 'Tooth Extractions With a Plan for What Comes Next',
    glance: [
      ['Simple extraction', costRanges.simpleExtraction],
      ['Surgical extraction', costRanges.surgicalExtraction],
      ['Socket preservation', costRanges.socketGraft],
      ['Provider focus', 'Jeff Muszynski, DDS'],
    ],
    who: 'An extraction may be needed when a tooth is broken beyond repair, severely infected, loose, impacted, painful, or not restorable. If saving the tooth is a better choice, Elm Ridge will say so.',
    detailSections: [
      { title: 'Simple vs surgical extraction', html: '<p>A simple extraction is usually more straightforward. A surgical extraction may involve a broken tooth, difficult root shape, bone removal, sectioning the tooth, or other complexity.</p>' },
      { title: 'When saving the tooth may be better', html: '<p>A root canal, crown, or periodontal treatment may be better when the tooth has a predictable long-term outlook. Elm Ridge compares the options before recommending removal.</p>' },
      { title: 'Replacement planning', html: htmlList(['Socket preservation may be recommended when future implant replacement is possible.', 'An immediate denture may be planned when several teeth are removed.', 'A single implant, bridge, partial, or denture may be discussed depending on the site.']) },
      { title: 'Typical cost range', html: costRangeHtml(`${costRanges.simpleExtraction} for simple extractions; ${costRanges.surgicalExtraction} for surgical extractions`, 'Socket preservation, sedation, implants, dentures, and other treatment are separate when needed.') },
    ],
    payment: costContext,
  },
  'wisdom-teeth-removal-killeen-tx': {
    h1: 'Wisdom Teeth Removal, Case by Case',
    glance: [
      ['Typical range', costRanges.wisdomTooth],
      ['Scope', 'Most wisdom teeth, case-dependent'],
      ['Referral', 'Used for unusually complex cases'],
      ['Comfort options', 'Nitrous oxide or oral conscious sedation when appropriate'],
    ],
    who: 'Wisdom teeth may need removal when they are painful, infected, hard to clean, damaging nearby teeth, or likely to create problems.',
    detailSections: [
      { title: 'What makes wisdom teeth more complex', html: htmlList(['Depth and angle of the tooth', 'Root shape and development', 'Closeness to nerves or sinus', 'Infection or swelling', 'Medical history and comfort needs']) },
      { title: 'When referral is appropriate', html: '<p>Elm Ridge removes most wisdom teeth, case-dependent. If the anatomy or risk level makes a specialist a better fit, the practice will explain that clearly and refer appropriately.</p>' },
      { title: 'Typical cost range', html: costRangeHtml(costRanges.wisdomTooth, 'Cost depends on tooth position, complexity, imaging, sedation when applicable, and insurance.') },
    ],
    payment: costContext,
  },
  'dentures-killeen-tx': {
    h1: 'Dentures, Partials, Immediate Dentures, and Implant Options',
    glance: [
      ['Complete dentures', costRanges.completeDentures],
      ['Partial dentures', costRanges.partialDentures],
      ['Immediate dentures', costRanges.immediateDentures],
      ['Implant upgrade', 'Snap-on or fixed full-arch options when appropriate'],
    ],
    who: 'Dentures may help when many or all teeth are missing or need removal, especially when the patient wants a lower upfront cost or a removable solution.',
    approach: 'Elm Ridge discusses dentures honestly. They are a valid option, but they can require sore-spot adjustments, relines, repairs, replacement, and they do not preserve bone like implants.',
    detailSections: [
      { title: 'Types of dentures', html: htmlList(['Complete dentures replace a full upper or lower arch.', 'Partial dentures replace several missing teeth while some natural teeth remain.', 'Immediate dentures are placed the day teeth are removed, then adjusted as gums and bone heal.']) },
      { title: 'Fit, chewing, and bone change', html: '<p>Dentures sit on gums and bone that change over time. That can affect fit, chewing, speech, sore spots, and the need for relines or replacement.</p>' },
      { title: 'Impressions and scanning', html: '<p>Elm Ridge uses intraoral scanning for about 90% of applications, but traditional impressions may still be better for dentures in some cases because soft tissue movement and borders matter.</p>' },
      { title: 'Dentures vs implant options', html: '<p>Traditional dentures are usually lower upfront cost. Snap-on dentures can improve retention, especially for lower dentures. Fixed full-arch implants are usually stronger and more stable, but cost more and involve more planning.</p>' },
      { title: 'Typical cost range', html: costRangeHtml(`${costRanges.completeDentures} for complete dentures; ${costRanges.partialDentures} for partial dentures; ${costRanges.immediateDentures} for immediate dentures`, 'Relines, extractions, grafting, implants, attachments, and repairs are separate when needed.') },
    ],
    payment: costContext,
  },
  'partial-dentures-killeen-tx': {
    h1: 'Partial Dentures When Some Natural Teeth Remain',
    glance: [
      ['Typical range', costRanges.partialDentures],
      ['Best for', 'Several missing teeth with usable natural teeth remaining'],
      ['Alternative options', 'Bridge, implant bridge, or individual implants'],
      ['Maintenance', 'Removable appliance with cleaning and adjustment needs'],
    ],
    who: 'Partial dentures can help when several teeth are missing and a removable solution fits the budget, anatomy, or timeline better than fixed treatment.',
    detailSections: [
      { title: 'When a partial makes sense', html: htmlList(['Several missing teeth in different areas', 'A lower upfront-cost plan is needed', 'Implants are not the right fit right now', 'Remaining teeth can help support a removable appliance']) },
      { title: 'When a bridge or implant may be better', html: '<p>Fixed options may be better when the patient wants less movement, stronger chewing, or a result that does not come out at night.</p>' },
      { title: 'Typical cost range', html: costRangeHtml(costRanges.partialDentures, 'Cost depends on design, materials, number of teeth replaced, extractions, and insurance.') },
    ],
    payment: costContext,
  },
  'immediate-dentures-killeen-tx': {
    h1: 'Immediate Dentures for Planned Tooth Removal',
    glance: [
      ['Typical range', costRanges.immediateDentures],
      ['Placed', 'The day teeth are removed when appropriate'],
      ['Follow-up', 'Adjustments are expected as healing changes the gums'],
      ['Provider focus', 'Jeff Muszynski, DDS'],
    ],
    who: 'Immediate dentures may help patients who need teeth removed but do not want to go without teeth during the first healing phase.',
    detailSections: [
      { title: 'What immediate dentures are', html: '<p>An immediate denture is made before extractions and placed the day teeth are removed when appropriate. It is useful, but the mouth changes quickly during healing.</p>' },
      { title: 'What to expect after placement', html: '<p>Sore spots, bite adjustments, looseness, and follow-up visits are common. A reline or replacement may be needed as gums and bone shrink.</p>' },
      { title: 'Planning replacement options', html: '<p>Immediate dentures can be part of a traditional denture plan, a snap-on denture plan, or a staged implant plan depending on the patient goals and anatomy.</p>' },
      { title: 'Typical cost range', html: costRangeHtml(costRanges.immediateDentures, 'Extractions, grafting, relines, implants, and future replacement teeth are separate when needed.') },
    ],
    payment: costContext,
  },
  'dental-fillings-killeen-tx': {
    h1: 'Tooth-Colored Fillings When the Tooth Can Stay Conservative',
    glance: [
      ['Typical range', costRanges.fillings],
      ['Material', 'Tooth-colored fillings only'],
      ['Best for', 'Small to moderate cavities, chips, and replacement of selected old fillings'],
      ['Provider focus', 'Jeff Muszynski, DDS and Kayla Muszynski, DDS'],
    ],
    who: 'Fillings help when damage is small enough that the tooth can be repaired without covering it with a crown.',
    detailSections: [
      { title: 'When a filling is enough', html: htmlList(['A cavity is small or moderate.', 'A small chip or worn edge can be repaired conservatively.', 'An old filling has failed but enough strong tooth remains.']) },
      { title: 'When a crown may be better', html: '<p>A crown may be more predictable when a filling would be too large, a tooth is cracked, an old filling has weakened the tooth, or the tooth has had root canal treatment.</p>' },
      { title: 'Sensitivity and cracks', html: '<p>Some sensitivity after a filling can be normal, but lingering pain, biting pain, or a sharp crack feeling should be checked. Cracks around old fillings can change the treatment plan.</p>' },
      { title: 'Typical cost range', html: costRangeHtml(costRanges.fillings, 'Cost depends on size, number of surfaces, tooth location, insurance, and complexity.') },
    ],
    payment: costContext,
  },
  'dental-bridges-killeen-tx': {
    h1: 'Dental Bridges When a Fixed Non-Implant Option Makes Sense',
    answer: 'A traditional dental bridge replaces a missing tooth by using crowns on neighboring teeth for support. It can be a good fixed option when those teeth can responsibly carry the load.',
    glance: [
      ['Best for', 'One or more missing teeth with strong neighboring teeth'],
      ['Main comparison', 'Traditional bridge vs implant bridge'],
      ['Cleaning', 'Requires cleaning under the bridge'],
      ['Provider focus', 'Jeff Muszynski, DDS and Kayla Muszynski, DDS'],
    ],
    who: 'A bridge may help when a patient wants a fixed replacement and implants are not the best fit because of timeline, anatomy, medical history, budget, or patient preference.',
    detailSections: [
      { title: 'Traditional bridge vs implant bridge', html: simpleTable(['Option', 'Tradeoff'], [['Traditional bridge', 'Can be faster and less surgical, and insurance may favor it in some cases. It requires reshaping neighboring teeth.'], ['Implant bridge', 'Does not require reshaping adjacent healthy teeth, but involves implant surgery, healing time, and different cost factors.']]) },
      { title: 'When an implant may be better', html: '<p>An implant may be better when neighboring teeth are healthy and do not need crowns. Preserving those teeth can matter over the long term.</p>' },
      { title: 'Maintenance', html: '<p>Bridges need careful cleaning around the edges and under the replacement tooth. Elm Ridge explains the tools and technique so the supporting teeth stay healthy.</p>' },
      { title: 'Cost and insurance', html: `<p>Bridge cost depends on span length, supporting teeth, materials, buildup needs, and insurance. ${insuranceCaveat}</p>` },
    ],
    payment: costContext,
  },
  'cosmetic-dentistry-killeen-tx': {
    h1: 'Cosmetic Dentistry That Still Looks Like You',
    intro: 'Most people do not want a fake-looking smile. They want the details cleaned up without losing themselves.',
    answer: 'Elm Ridge plans cosmetic dentistry around natural-looking results, tooth structure, bite, facial features, goals, and budget. Treatment may include whitening, bonding, veneers, clear aligners, crowns, or a staged combination.',
    glance: [
      ['Philosophy', 'Natural-looking and conservative when appropriate'],
      ['Options', 'Whitening, bonding, veneers, clear aligners, crowns, bridges'],
      ['Planning', 'Function and bite matter, not just appearance'],
      ['Doctors', 'Jeff Muszynski, DDS and Kayla Muszynski, DDS'],
    ],
    who: 'Cosmetic dentistry may help with chips, wear, gaps, discoloration, crowded teeth, old dental work, uneven edges, or a smile that no longer feels like it fits.',
    approach: 'Elm Ridge does not push every patient toward the same bright, flat, overly perfect result. The team discusses what can be improved conservatively and when stronger restorative treatment is needed.',
    detailSections: [
      { title: 'How options are chosen', html: htmlList(['Whitening can brighten natural enamel before other cosmetic work.', 'Bonding can repair small chips, gaps, or shape issues conservatively.', 'Veneers can change front-tooth shape, shade, and proportion in selected cases.', 'Clear aligners can move teeth before restorations so less tooth structure has to be changed.', 'Crowns may be needed when teeth are weak, cracked, heavily filled, or worn.']) },
      { title: 'When cosmetic treatment should wait', html: '<p>Gum disease, active cavities, unstable bite problems, severe wear, infection, or failing old dental work may need to be addressed before cosmetic dentistry makes sense.</p>' },
      { title: 'Before-and-after photos', html: '<p>Before-and-after imagery is shown for education and conversation only. Individual results vary. Images are shared with patient consent.</p>' },
    ],
    extra: cosmeticGalleryHtml(),
    payment: costContext,
  },
  'veneers-killeen-tx': {
    h1: 'Veneers Planned for Shape, Proportion, and Restraint',
    glance: [
      ['Typical range', costRanges.veneers],
      ['Best for', 'Selected front-tooth shape, shade, proportion, and symmetry changes'],
      ['Comparison', 'Veneers vs bonding vs crowns vs whitening'],
      ['Provider focus', 'Kayla Muszynski, DDS and Jeff Muszynski, DDS'],
    ],
    who: 'Veneers may help when front teeth have cosmetic concerns that whitening or bonding cannot predictably solve.',
    detailSections: [
      { title: 'Veneers vs other options', html: simpleTable(['Option', 'Best use'], [['Whitening', 'Brightens natural enamel but does not change shape or old dental work.'], ['Bonding', 'Conservative for small chips or gaps, but stains and chips more easily than porcelain.'], ['Veneers', 'Changes front-tooth shape, shade, and proportion when the teeth are strong enough.'], ['Crowns', 'Better when teeth are weak, heavily filled, cracked, or need full coverage.']]) },
      { title: 'When veneers may not be right', html: '<p>Veneers may not be best for severe bite issues, heavy grinding, active decay, unstable gums, or teeth that need crowns instead of thin porcelain coverage.</p>' },
      { title: 'Typical cost range', html: costRangeHtml(costRanges.veneers, 'Cost depends on tooth number, porcelain choice, bite, records, temporary needs, and lab work.') },
    ],
    payment: costContext,
  },
  'cosmetic-bonding-killeen-tx': {
    h1: 'Cosmetic Bonding for Small Changes Without Overdoing It',
    answer: 'Cosmetic bonding uses tooth-colored composite to repair small chips, close selected small gaps, and improve tooth shape with a conservative approach.',
    glance: [
      ['Good for', 'Small chips, small gaps, shape changes, conservative touchups'],
      ['Limitations', 'Can stain or chip more easily than porcelain'],
      ['Alternative', 'Veneers or crowns for larger changes'],
      ['Provider focus', 'Kayla Muszynski, DDS'],
    ],
    detailSections: [
      { title: 'When bonding works well', html: htmlList(['Small chips at the edge of a tooth', 'Small spaces or black triangles in selected cases', 'Minor shape or length changes', 'A conservative test before porcelain treatment']) },
      { title: 'When bonding may not be enough', html: '<p>Bonding may not be ideal for large color changes, heavy bite forces, major wear, broad smile redesign, or areas where porcelain would be more durable.</p>' },
      { title: 'Maintenance', html: '<p>Bonding can stain, chip, or need polishing and repairs over time. Elm Ridge explains the tradeoff before treatment.</p>' },
    ],
    payment: costContext,
  },
  'teeth-whitening-killeen-tx': {
    h1: 'Custom Take-Home Whitening Trays',
    glance: [
      ['Typical range', costRanges.whitening],
      ['Method', 'Custom trays with take-home whitening gel'],
      ['Important limit', 'Crowns, fillings, and veneers do not whiten like enamel'],
      ['Provider focus', 'Kayla Muszynski, DDS'],
    ],
    who: 'Whitening can help patients with natural tooth discoloration who want a brighter smile before bonding, veneers, crowns, or clear aligner planning.',
    detailSections: [
      { title: 'Why custom trays matter', html: '<p>Custom trays help the whitening gel contact teeth more evenly and reduce messy overflow compared with one-size-fits-all options.</p>' },
      { title: 'When whitening should be timed carefully', html: '<p>If crowns, fillings, veneers, or bonding are planned on visible teeth, whitening often needs to happen first so final materials can be matched to the new shade.</p>' },
      { title: 'Typical cost range', html: costRangeHtml(costRanges.whitening, 'Elm Ridge uses custom trays with take-home whitening gel.') },
    ],
    payment: costContext,
  },
  'clear-aligners-killeen-tx': {
    h1: 'Clear Aligners Planned Around Your Bite and Next Steps',
    glance: [
      ['Typical range', costRanges.clearAligners],
      ['Brands', 'Multiple clear aligner brands when appropriate'],
      ['Good for', 'Mild/moderate crowding, spacing, relapse after braces, minor bite issues'],
      ['Also useful for', 'Pre-restorative alignment before veneers, crowns, or implants'],
    ],
    who: 'Clear aligners may help adults and teens with mild to moderate crowding, spacing, relapse after braces, minor bite issues, or teeth that need positioning before cosmetic or restorative work.',
    approach: 'Elm Ridge uses clear aligners as the primary term because the practice can use multiple brands. The goal is responsible tooth movement, not locking every patient into one brand name.',
    detailSections: [
      { title: 'Clear aligners vs cosmetic restorations', html: '<p>Sometimes the best cosmetic move is to move the teeth first, then use less bonding, veneer, or crown material. In other cases, restorations address shape or color better than aligners alone.</p>' },
      { title: 'Timeline and retainers', html: '<p>Treatment length depends on the amount of movement and how well aligners are worn. Retainers are part of protecting the result after treatment.</p>' },
      { title: 'Typical cost range', html: costRangeHtml(costRanges.clearAligners, 'Cost depends on case complexity, records, monitoring, refinements, retainers, insurance orthodontic benefits, and financing.') },
    ],
    payment: costContext,
  },
  'sleep-apnea-dentist-killeen-tx': {
    h1: 'Sleep Apnea Oral Appliance Therapy With Physician Diagnosis',
    glance: [
      ['Typical appliance range', costRanges.sleepAppliance],
      ['Testing workflow', 'Take-home sleep studies; data sent to sleep physician'],
      ['Diagnosis', 'Physician diagnosis required before appliance delivery'],
      ['Scope', 'Mild/moderate OSA and CPAP-intolerant patients when appropriate'],
    ],
    who: 'Oral appliance therapy may help patients with mild to moderate obstructive sleep apnea, patients who cannot tolerate CPAP, or severe OSA cases only with physician involvement.',
    approach: 'Elm Ridge supports the dental side of sleep apnea care. The practice does not independently diagnose sleep apnea; recorded sleep-study data is sent to a sleep physician for official medical diagnosis.',
    detailSections: [
      { title: 'Snoring vs sleep apnea', html: '<p>Snoring can be annoying, but sleep apnea is a medical condition that needs proper testing and diagnosis. An oral appliance should not be delivered as a shortcut around that process.</p>' },
      { title: 'How the appliance process works', html: htmlList(['Discuss symptoms, CPAP history, and medical-dental fit.', 'Use a take-home sleep study workflow when appropriate.', 'Send recorded data to a sleep physician for official diagnosis.', 'Deliver an FDA-cleared oral appliance only after physician diagnosis and dental evaluation.', 'Adjust and follow up as needed.']) },
      { title: 'Insurance boundary', html: '<p>Medical insurance billing is for appliances only, not sleep studies. Requirements vary by plan and documentation.</p>' },
      { title: 'Typical cost range', html: costRangeHtml(costRanges.sleepAppliance, 'Medical insurance may help when requirements are met.') },
    ],
    payment: costContext,
  },
  'tmj-splint-therapy-killeen-tx': {
    h1: 'Limited TMJ Splint Therapy for Conservative Care',
    answer: 'Elm Ridge provides limited TMJ care focused on splint therapy and conservative support. Complex TMJ disorders may require referral.',
    glance: [
      ['Scope', 'Limited splint therapy/conservative care'],
      ['May help with', 'Clenching, grinding, jaw soreness, tooth wear'],
      ['Not full-scope', 'Advanced joint disorder treatment or surgery'],
      ['Provider focus', 'Jeff Muszynski, DDS'],
    ],
    who: 'A splint may help when symptoms are connected to clenching, grinding, muscle soreness, tooth wear, or bite-related stress.',
    detailSections: [
      { title: 'Why conservative care comes first', html: '<p>TMJ symptoms can have many causes. Conservative approaches are usually best to try before surgery or irreversible treatment.</p>' },
      { title: 'What a splint can and cannot do', html: '<p>A splint may protect teeth and reduce overload from clenching or grinding. It is not a cure-all for every jaw joint problem, headache, or facial pain condition.</p>' },
      { title: 'When referral may be needed', html: '<p>Advanced joint disease, complex pain, locking, trauma, neurologic symptoms, or symptoms that do not fit a conservative dental pattern may require specialty or medical referral.</p>' },
    ],
  },
  'sedation-dentistry-killeen-tx': {
    h1: 'Sedation Options for a Calmer Dental Visit',
    answer: 'Elm Ridge offers nitrous oxide and oral conscious sedation for appropriate patients. IV sedation, deep sedation, and general anesthesia are not offered.',
    glance: [
      ['Nitrous oxide', 'Yes; light relaxation that wears off quickly'],
      ['Oral conscious sedation', 'Yes; evaluated candidates only'],
      ['IV sedation', 'Not offered'],
      ['Provider focus', 'Jeff Muszynski, DDS'],
    ],
    who: 'Sedation options may help patients with dental anxiety, a past difficult experience, a strong gag reflex, or longer treatment that feels hard to get through comfortably.',
    detailSections: [
      { title: 'Nitrous vs oral conscious sedation', html: simpleTable(['Option', 'What to know'], [['Nitrous oxide', 'Light relaxation through a nose mask. It wears off quickly and many patients can drive afterward.'], ['Oral conscious sedation', 'Prescription medication for deeper relaxation while the patient remains responsive. It requires evaluation, instructions, and a driver.']]) },
      { title: 'What Elm Ridge does not offer', html: '<p>Elm Ridge does not offer IV sedation, deep sedation, or general anesthesia. If that level of sedation is needed, the team will explain referral options.</p>' },
    ],
  },
  'nitrous-oxide-dentist-killeen-tx': {
    h1: 'Nitrous Oxide for Light Dental Relaxation',
    answer: 'Nitrous oxide can help take the edge off a dental visit while keeping the patient awake and responsive. It wears off quickly after the appointment.',
    glance: [
      ['Best for', 'Light anxiety or mild comfort support'],
      ['Recovery', 'Wears off quickly'],
      ['Driver', 'Often not needed for nitrous alone'],
      ['Related option', 'Oral conscious sedation for evaluated candidates'],
    ],
    detailSections: [
      { title: 'When nitrous makes sense', html: htmlList(['Mild to moderate nervousness', 'Shorter procedures', 'Patients who want relaxation without oral sedative planning', 'Appointments where a quick recovery matters']) },
      { title: 'When something stronger may be discussed', html: '<p>Oral conscious sedation may be considered for evaluated candidates when anxiety, appointment length, or procedure complexity calls for a deeper level of relaxation. IV sedation is not offered.</p>' },
    ],
  },
  'oral-conscious-sedation-killeen-tx': {
    h1: 'Oral Conscious Sedation for Evaluated Candidates',
    answer: 'Oral conscious sedation uses prescribed medication for deeper relaxation while the patient remains responsive. It is not IV sedation and it requires planning, instructions, and a driver.',
    glance: [
      ['Sedation type', 'Prescription oral medication'],
      ['Driver', 'Required'],
      ['IV sedation', 'Not offered'],
      ['Provider focus', 'Jeff Muszynski, DDS'],
    ],
    detailSections: [
      { title: 'What the visit requires', html: htmlList(['A review of health history and medications', 'Clear pre-visit and post-visit instructions', 'A responsible driver', 'A plan for the procedure and recovery time']) },
      { title: 'Boundaries', html: '<p>Oral conscious sedation is not deep sedation, general anesthesia, or IV sedation. Patients remain responsive, and not every patient is a candidate.</p>' },
    ],
  },
};

const emergencyCostText = `Emergency exam, X-ray, and triage commonly range from ${costRanges.emergency}. Treatment such as a filling, crown, root canal, extraction, medication, or follow-up care is separate.`;

const emergencyEnhancements = {
  'emergency-dentist-killeen-tx': {
    answer: 'For urgent dental problems, call first. Elm Ridge offers same-day emergency appointments when possible and triages severe pain, swelling, broken teeth, knocked-out permanent teeth, and infection symptoms honestly.',
    now: `Call ${phoneDisplay} as early as possible. Describe your symptoms, how long they have been happening, whether swelling is present, and whether there was trauma. Use the appointment form only for non-urgent requests.`,
    treat: 'Elm Ridge can examine the problem, take X-rays or imaging, relieve sharp edges, treat infection when appropriate, repair broken teeth, start a root canal when possible, remove a tooth when needed, or build a staged plan.',
    costText: emergencyCostText,
    detailSections: [
      { title: 'What is prioritized', html: htmlList(['True trauma', 'Knocked-out permanent teeth', 'Facial swelling', 'Severe or uncontrolled pain', 'Infection symptoms', 'Broken teeth with pain or sharp edges']) },
      { title: 'What may not be same-day', html: '<p>A painless cosmetic chip may be seen same-day if the schedule allows, but it is not guaranteed. Complex treatment may need diagnosis first and treatment on a later visit.</p>' },
      { title: 'Typical emergency visit cost', html: costRangeHtml(costRanges.emergency, 'Treatment is separate and depends on the diagnosis.') },
    ],
  },
  'broken-tooth-killeen-tx': {
    answer: 'A broken tooth can be minor, painful, infected, or structurally hopeless. Call first so Elm Ridge can help decide whether you need urgent care and what to avoid until you are seen.',
    now: 'If the tooth has a sharp edge, avoid chewing on that side. If a piece came off, save it if available. Call first, especially if there is pain, swelling, bleeding, or sensitivity.',
    wait: 'A painless small cosmetic chip can often wait briefly, but deeper breaks, pain on biting, exposed inner tooth, swelling, or trauma should be handled urgently.',
    treat: 'Treatment might be smoothing, bonding, a filling, a crown, root canal treatment, or extraction if the tooth cannot be restored predictably.',
    treatmentOptions: 'A crown is common when the tooth is weak or cracked. Root canal treatment may be needed if the nerve is involved. Extraction and implant or bridge planning may be discussed if the tooth is not restorable.',
    costText: emergencyCostText,
    detailSections: [
      { title: 'Common next decisions', html: simpleTable(['Finding', 'Likely conversation'], [['Small chip', 'Smoothing, bonding, or filling.'], ['Large break or cracked cusp', 'Crown, sometimes with buildup.'], ['Pain, swelling, or nerve exposure', 'Root canal vs extraction depending on restorability.'], ['Split tooth below the gumline', 'Extraction and replacement planning may be more predictable.']]) },
    ],
  },
  'toothache-killeen-tx': {
    answer: 'A toothache is a symptom, not a diagnosis. It can come from a cavity, cracked tooth, bite trauma, gum infection, sinus pressure, or a nerve problem.',
    now: 'Call first and describe whether the pain is sharp, throbbing, lingering to cold or heat, worse when biting, waking you up, or paired with swelling.',
    wait: 'Pain that is worsening, waking you up, causing swelling, or making it hard to bite should not be ignored. Severe swelling or trouble swallowing belongs in urgent medical care.',
    treat: 'Elm Ridge can diagnose the source and recommend a filling, crown, root canal, extraction, bite adjustment, medication when appropriate, or referral if the problem is outside dental scope.',
    treatmentOptions: 'Toothache treatment may involve X-rays, CBCT when needed, a filling, crown, root canal, extraction, or abscess treatment. The right answer depends on diagnosis.',
    costText: emergencyCostText,
    detailSections: [
      { title: 'When root canal enters the conversation', html: '<p>Lingering temperature pain, spontaneous throbbing, swelling, or pain that wakes you up can mean the nerve is inflamed or infected. Elm Ridge performs many root canals, including molars, but not retreatments.</p>' },
    ],
  },
  'dental-abscess-killeen-tx': {
    answer: 'A dental abscess or swelling can become serious. Call first for dental triage, and go to the ER for severe swelling, trouble breathing, trouble swallowing, major trauma, or a medical emergency.',
    now: 'Call Elm Ridge and describe the swelling location, fever, drainage, pain level, and whether swallowing or breathing is affected. Do not try to drain swelling yourself.',
    wait: 'Swelling should not be treated casually. Rapidly spreading swelling, fever, trouble swallowing, trouble breathing, or swelling near the eye needs urgent medical attention.',
    treat: 'Elm Ridge can diagnose whether the source is tooth-related and discuss root canal treatment, extraction, drainage when appropriate, medication when indicated, or referral.',
    treatmentOptions: 'Abscess treatment may include X-rays or CBCT, antibiotics when appropriate, root canal treatment, extraction, or staged treatment after infection control.',
    costText: emergencyCostText,
    detailSections: [
      { title: 'Why antibiotics are not the whole fix', html: '<p>Medication can be appropriate in some infections, but the source usually still needs dental treatment such as root canal treatment or extraction.</p>' },
    ],
  },
  'lost-crown-killeen-tx': {
    answer: 'A lost crown should be checked because the tooth underneath may be sensitive, decayed, cracked, or at risk of shifting or breaking.',
    now: 'Save the crown and call first. Do not use superglue. If the crown fits easily and the bite feels normal, temporary dental cement may be used carefully until you are seen.',
    wait: 'A lost crown can sometimes wait briefly if there is no pain, no sharp edge, and no bite problem, but sensitivity, pain, swelling, or a loose tooth should be handled promptly.',
    treat: 'Elm Ridge can evaluate the tooth and crown, recement the crown when appropriate, replace it, treat decay, build up the tooth, or discuss root canal or extraction if needed.',
    treatmentOptions: 'Treatment might include recementing, a new crown, buildup, root canal treatment, or replacement planning if the tooth is not restorable.',
    costText: emergencyCostText,
    detailSections: [
      { title: 'When a crown can be reused', html: '<p>The crown has to fit well, the tooth has to be healthy enough, and the bite has to be stable. Decay, cracks, or poor fit may mean a new crown is safer.</p>' },
    ],
  },
  'knocked-out-tooth-killeen-tx': {
    answer: 'A knocked-out permanent tooth is urgent. Call immediately, keep the tooth moist, do not scrub the root, and seek help as quickly as possible.',
    now: 'Pick the tooth up by the crown, not the root. If possible, place it gently back in the socket. If not, keep it in milk or saliva and call immediately. Do not scrub the root.',
    wait: 'Do not wait on a knocked-out permanent tooth. Baby teeth should not be replanted. Major facial trauma, uncontrolled bleeding, or a medical emergency belongs in the ER.',
    treat: 'Elm Ridge can evaluate the injury, attempt stabilization when appropriate, address pain, take X-rays, and discuss monitoring or replacement options if the tooth cannot be saved.',
    treatmentOptions: 'Treatment may include reimplantation and stabilization, X-rays, follow-up monitoring, root canal treatment later, or replacement planning. Success cannot be guaranteed.',
    costText: emergencyCostText,
    detailSections: [
      { title: 'Permanent vs baby teeth', html: '<p>Permanent teeth are time-sensitive and may be replanted in selected cases. Baby teeth should not be replanted because that can damage the developing permanent tooth.</p>' },
      { title: 'If the tooth cannot be saved', html: '<p>Replacement options may include an implant, bridge, partial denture, or staged plan depending on age, bone, bite, and injury pattern.</p>' },
    ],
  },
};

function buildServicesHub() {
  const groups = [
    ['Family & Preventive Dentistry', [
      ['Family dentistry', '/family-dentist-killeen-tx', 'Care for children once teeth are present, adults, and seniors.'],
      ['Dental cleanings', '/dental-cleanings-killeen-tx', 'Routine cleanings, exams, gum monitoring, and periodontal maintenance when appropriate.'],
      ['Dental exams', '/dental-cleanings-killeen-tx', 'Diagnostic visits with X-rays as needed and clear next steps.'],
      ['Fillings', '/dental-fillings-killeen-tx', 'Tooth-colored fillings for cavities and small fractures.'],
      ['Gum health', '/family-dentist-killeen-tx', 'Routine periodontal therapy and scaling/root planing when appropriate; advanced disease is referred.'],
    ]],
    ['Restorative Dentistry', [
      ['Dental crowns', '/dental-crowns-killeen-tx', 'Lab-made crowns only, designed to protect and blend naturally.'],
      ['Dental bridges', '/dental-bridges-killeen-tx', 'Fixed bridges when neighboring teeth can support the plan.'],
      ['Root canals', '/root-canal-killeen-tx', 'Root canals including many molar root canals; no retreatments.'],
      ['Tooth extractions', '/tooth-extractions-killeen-tx', 'Simple and surgical extractions with replacement planning.'],
      ['Wisdom teeth removal', '/wisdom-teeth-removal-killeen-tx', 'Most wisdom teeth, case-dependent, with referral for unusually complex cases.'],
      ['Dentures and partials', '/dentures-killeen-tx', 'Traditional dentures, partial dentures, and immediate dentures.'],
    ]],
    ['Dental Implants', [
      ['Dental implants', '/dental-implants-killeen-tx', 'Single implants, implant bridges, snap-on dentures, and full-arch options.'],
      ['Single tooth implants', '/single-tooth-implant-killeen-tx', 'A stand-alone replacement when one tooth is missing.'],
      ['Implant bridges', '/implant-bridge-killeen-tx', 'Fixed implant-supported bridges for multiple missing teeth.'],
      ['Snap-on dentures', '/snap-on-dentures-killeen-tx', 'Removable dentures retained by implants.'],
      ['Full-arch dental implants', '/full-arch-dental-implants-killeen-tx', 'Surgery and restorative treatment for full-arch cases.'],
      ['Socket grafting and limited sinus bumps', '/bone-grafting-killeen-tx', 'Bone-preservation and selected upper-implant support procedures when anatomy calls for it.'],
    ]],
    ['Cosmetic Dentistry', [
      ['Cosmetic dentistry', '/cosmetic-dentistry-killeen-tx', 'Natural-looking changes planned around your face and bite.'],
      ['Veneers', '/veneers-killeen-tx', 'Porcelain veneers for selected smile-design cases.'],
      ['Cosmetic bonding', '/cosmetic-bonding-killeen-tx', 'Conservative repairs for chips, gaps, and small shape changes.'],
      ['Teeth whitening', '/teeth-whitening-killeen-tx', 'Custom trays with take-home whitening gel.'],
      ['Clear aligners', '/clear-aligners-killeen-tx', 'Clear aligner treatment using multiple brands when appropriate.'],
      ['Smile makeovers', '/cosmetic-dentistry-killeen-tx', 'Coordinated cosmetic and restorative planning.'],
    ]],
    ['Emergency Dentistry', [
      ['Emergency dentist', '/emergency-dentist-killeen-tx', 'One clear emergency page for tooth pain, swelling, broken teeth, lost crowns, knocked-out teeth, and same-day triage when possible.'],
    ]],
    ['Comfort and Adjacent Care', [
      ['Nitrous oxide', '/nitrous-oxide-dentist-killeen-tx', 'Light relaxation that wears off quickly.'],
      ['Oral conscious sedation', '/oral-conscious-sedation-killeen-tx', 'Prescription oral sedation for evaluated candidates; no IV sedation.'],
      ['Sleep apnea oral appliances', '/sleep-apnea-dentist-killeen-tx', 'FDA-cleared oral appliances after physician diagnosis.'],
      ['Take-home sleep studies workflow', '/sleep-apnea-dentist-killeen-tx', 'Recorded data is sent to a sleep physician for diagnosis.'],
      ['TMJ splint therapy', '/tmj-splint-therapy-killeen-tx', 'Limited TMJ care focused on splint therapy.'],
    ]],
  ];

  writePage('services', {
    path: '/services',
    title: 'Dental Services in Killeen, TX | Elm Ridge',
    description: 'Explore Elm Ridge dental services in Killeen, including family care, implants, cosmetic dentistry, dentures, emergencies, sedation, and sleep apnea appliances.',
    crumb: 'Services',
    kicker: 'Services',
    h1: 'Dental Services in One Killeen Office',
    intro: 'Elm Ridge provides everyday family dentistry and more involved treatment planning without making patients feel rushed or sold to.',
    body: `<section class="py-16 bg-white"><div class="max-w-6xl mx-auto px-6 space-y-14">
      ${groups.map(([group, items]) => `<section><div class="max-w-3xl mb-6"><h2 class="font-display text-4xl text-charcoal mb-3">${esc(group)}</h2></div>${cardGrid(items.map(([label, href, text]) => ({ label, href, text, kicker: group })))}</section>`).join('')}
      <section class="bg-stone border border-teal-light p-8"><h2 class="font-display text-4xl text-charcoal mb-4">Not Sure Where to Start?</h2><p class="text-charcoal/70 leading-8 mb-6">Call and describe what is going on. The team can help you decide whether you need a routine visit, consultation, emergency appointment, or a second opinion.</p>${pillLinks([serviceLinks.newPatients, serviceLinks.insurance, serviceLinks.reviews, serviceLinks.appointment])}</section>
    </div></section>`,
    faq: [
      ['Does Elm Ridge see children?', 'Yes, children are seen as part of family dentistry once teeth are present. Elm Ridge does not market as a pediatric specialty office.'],
      ['Does Elm Ridge place dental implants?', 'Yes. Elm Ridge provides implant planning, surgery, and restoration for many implant cases, including full-arch dental implants.'],
      ['Does Elm Ridge offer IV sedation?', 'No. Elm Ridge offers nitrous oxide and oral conscious sedation for evaluated candidates, but not IV sedation.'],
    ],
    headSchemas: [simpleSchema('Service', 'Dental Services in Killeen', '/services', 'Dental service hub for Elm Ridge Implant and Family Dentistry.')],
  });
}

function makePage(overrides) {
  const page = { ...overrides, ...(serviceEnhancements[overrides.slug] || {}) };
  const name = page.name;
  return {
    slug: page.slug,
    title: page.title || `${name} in Killeen, TX | Elm Ridge`,
    description: page.description || `${practiceName} provides ${name.toLowerCase()} in Killeen with clear explanations, private-practice care, and practical next steps.`,
    h1: page.h1 || name,
    crumb: page.crumb || name,
    kicker: page.kicker || 'Dental Service',
    intro: page.intro || `Clear, practical ${name.toLowerCase()} guidance from Elm Ridge Implant and Family Dentistry in Killeen.`,
    answer: page.answer || `${name} may be recommended when it is the most sensible way to protect comfort, function, appearance, or long-term oral health. Elm Ridge starts with diagnosis before recommending treatment.`,
    glance: page.glance || defaultServiceGlance(page),
    who: page.who || defaultWhoText(page),
    approach: page.approach,
    detailSections: page.detailSections || [],
    nextQuestions: page.nextQuestions,
    expect: page.expect || defaultExpectText(page),
    call: page.call || defaultCallText(page),
    payment: page.payment,
    extra: page.extra || '',
    providers: page.providers || ['Jeff Muszynski, DDS', 'Kayla Muszynski, DDS'],
    related: page.related || [serviceLinks.services, serviceLinks.newPatients, serviceLinks.insurance, serviceLinks.appointment, serviceLinks.reviews],
    faq: page.faq || standardFaq(name),
    image: page.image,
    alt: page.alt,
    medical: page.medical ?? true,
    serviceType: page.serviceType,
    procedureType: page.procedureType,
    bodyLocation: page.bodyLocation,
  };
}

function buildServicePages() {
  const pages = [
    makePage({
      slug: 'family-dentist-killeen-tx',
      name: 'Family Dentistry',
      title: 'Family Dentist in Killeen, TX | Elm Ridge',
      h1: 'Family Dentistry for Kids, Adults, and Grandparents',
      answer: 'Elm Ridge sees children once teeth are present, adults, and seniors in one private Killeen office. This is family dentistry, not a pediatric specialty office.',
      glance: [['Children', 'Seen once teeth are present.'], ['Adults', 'Cleanings, exams, fillings, crowns, gum monitoring, and long-term care.'], ['Military families', 'Dependents, spouses, and families are welcome.'], ['Not offered', 'Medicaid and in-office membership plan.']],
      who: 'Family dentistry helps households that want one dependable dental home for preventive care, small repairs, larger restorative needs, and honest guidance as needs change over time.',
      expect: 'A first visit usually includes a review of health history, appropriate X-rays, a dental and gum evaluation, and a clear discussion of any findings.',
      call: 'Call for routine care, a new child visit, a second opinion, bleeding gums, a broken tooth, or recurring sensitivity.',
      providers: ['Jeff Muszynski, DDS', 'Kayla Muszynski, DDS'],
      related: [{ label: 'Dental cleanings', href: '/dental-cleanings-killeen-tx' }, { label: 'Fillings', href: '/dental-fillings-killeen-tx' }, { label: 'Crowns', href: '/dental-crowns-killeen-tx' }, serviceLinks.newPatients, serviceLinks.kayla],
      faq: [
        ['Do you see kids?', 'Yes. Elm Ridge sees children once teeth are present as part of family dentistry.'],
        ['Are you a pediatric specialty office?', 'No. Children are welcome, but Elm Ridge is not marketed as a pediatric specialty office.'],
        ['Do you accept Medicaid?', 'No. Elm Ridge does not accept Medicaid.'],
      ],
    }),
    makePage({ slug: 'dental-cleanings-killeen-tx', name: 'Dental Cleanings', h1: 'Dental Cleanings That Do More Than Polish Teeth', answer: 'Dental cleanings at Elm Ridge remove buildup, check gum health, and help catch small problems before they become expensive surprises.', related: [{ label: 'Family dentistry', href: '/family-dentist-killeen-tx' }, { label: 'Dental fillings', href: '/dental-fillings-killeen-tx' }, serviceLinks.newPatients, serviceLinks.kayla], medical: false }),
    makePage({ slug: 'dental-fillings-killeen-tx', name: 'Dental Fillings', h1: 'Tooth-Colored Fillings for Cavities and Small Breaks', answer: 'Dental fillings repair small to moderate areas of decay or damage. Elm Ridge uses tooth-colored materials and explains when a filling is enough versus when a crown is the better long-term answer.', related: [{ label: 'Dental crowns', href: '/dental-crowns-killeen-tx' }, { label: 'Broken tooth', href: '/broken-tooth-killeen-tx' }, serviceLinks.kayla] }),
    makePage({ slug: 'dental-bridges-killeen-tx', name: 'Dental Bridges', h1: 'Fixed Bridges for Missing Teeth', answer: 'A dental bridge can replace one or more missing teeth when the neighboring teeth can support crowns. Elm Ridge also compares implant bridges when implants may be a better foundation.', related: [{ label: 'Implant bridge', href: '/implant-bridge-killeen-tx' }, { label: 'Single tooth implant', href: '/single-tooth-implant-killeen-tx' }, { label: 'Dentures', href: '/dentures-killeen-tx' }, serviceLinks.kayla] }),
    makePage({ slug: 'dental-crowns-killeen-tx', name: 'Dental Crowns', title: 'Natural-Looking Dental Crowns in Killeen, TX | Elm Ridge', h1: 'A stronger, longer-lasting fix for a cracked, worn, or heavily filled tooth', answer: 'Elm Ridge provides lab-made crowns only. A crown may protect a cracked, heavily filled, root-canal-treated, or worn tooth while being shaped and shaded to blend naturally.', related: [{ label: 'Root canals', href: '/root-canal-killeen-tx' }, { label: 'Broken tooth', href: '/broken-tooth-killeen-tx' }, { label: 'Crown cost', href: '/crown-cost-killeen-tx' }, serviceLinks.kayla] }),
    makePage({ slug: 'root-canal-killeen-tx', name: 'Root Canal Therapy', title: 'Root Canals in Killeen, TX | Elm Ridge', h1: 'Root Canal Treatment When a Tooth Can Still Be Saved', answer: 'Elm Ridge performs many root canals, including molar root canals. The practice does not perform root canal retreatments.', providers: ['Jeff Muszynski, DDS'], related: [{ label: 'Molar root canals', href: '/molar-root-canal-killeen-tx' }, { label: 'Dental crowns', href: '/dental-crowns-killeen-tx' }, { label: 'Toothache', href: '/toothache-killeen-tx' }, { label: 'Root canal cost', href: '/root-canal-cost-killeen-tx' }, serviceLinks.jeff], faq: [['Do you do molar root canals?', 'Yes. Elm Ridge performs many root canals, including molar root canals.'], ['Do you do root canal retreatments?', 'No. Elm Ridge does not perform root canal retreatments and will explain referral options when retreatment is needed.'], ['Will I need a crown after a root canal?', 'Often, especially on back teeth. Elm Ridge will explain whether a crown is recommended for your tooth.']] }),
    makePage({ slug: 'molar-root-canal-killeen-tx', name: 'Molar Root Canals', h1: 'Molar Root Canals Without Guesswork', answer: 'Elm Ridge performs many molar root canals when the tooth can be predictably saved. Root canal retreatments are not performed.', providers: ['Jeff Muszynski, DDS'], related: [{ label: 'Root canals', href: '/root-canal-killeen-tx' }, { label: 'Dental crowns', href: '/dental-crowns-killeen-tx' }, { label: 'Toothache', href: '/toothache-killeen-tx' }, { label: 'Dental abscess', href: '/dental-abscess-killeen-tx' }, { label: 'Emergency dentistry', href: '/emergency-dentist-killeen-tx' }, serviceLinks.jeff], faq: [['Do you perform root canal retreatment?', 'No. Elm Ridge performs many root canals, including molars, but does not perform retreatments.'], ['Why do molars often need crowns?', 'Molars take heavy chewing forces, so crowns are often recommended after root canal treatment to protect the tooth.']] }),
    makePage({ slug: 'tooth-extractions-killeen-tx', name: 'Tooth Extractions', h1: 'Tooth Extractions With a Replacement Plan When Needed', answer: 'Elm Ridge performs simple and surgical extractions, including many wisdom tooth cases. If a tooth can be saved predictably, the team will say so.', providers: ['Jeff Muszynski, DDS'], related: [{ label: 'Wisdom teeth', href: '/wisdom-teeth-removal-killeen-tx' }, { label: 'Bone grafting', href: '/bone-grafting-killeen-tx' }, { label: 'Single tooth implant', href: '/single-tooth-implant-killeen-tx' }, serviceLinks.jeff] }),
    makePage({ slug: 'wisdom-teeth-removal-killeen-tx', name: 'Wisdom Teeth Removal', h1: 'Wisdom Teeth Removal, Case by Case', answer: 'Elm Ridge removes most wisdom teeth, depending on anatomy and complexity. If a wisdom tooth case is unusually complex or better suited for a specialist, the practice will explain options and refer appropriately.', providers: ['Jeff Muszynski, DDS'], related: [{ label: 'Tooth extractions', href: '/tooth-extractions-killeen-tx' }, { label: 'Oral conscious sedation', href: '/oral-conscious-sedation-killeen-tx' }, { label: 'Nitrous oxide', href: '/nitrous-oxide-dentist-killeen-tx' }, serviceLinks.jeff] }),
    makePage({ slug: 'dentures-killeen-tx', name: 'Dentures', h1: 'Dentures, Partials, Immediate Dentures, and Implant Options', answer: 'Elm Ridge offers traditional dentures, partial dentures, immediate dentures, snap-on dentures, and implant-supported options. The point is to compare comfort, function, cost, and long-term maintenance honestly.', providers: ['Jeff Muszynski, DDS'], related: [{ label: 'Partial dentures', href: '/partial-dentures-killeen-tx' }, { label: 'Immediate dentures', href: '/immediate-dentures-killeen-tx' }, { label: 'Snap-on dentures', href: '/snap-on-dentures-killeen-tx' }, { label: 'Dentures vs implants', href: '/dentures-vs-implants-killeen-tx' }, serviceLinks.jeff] }),
    makePage({ slug: 'partial-dentures-killeen-tx', name: 'Partial Dentures', h1: 'Partial Dentures for Several Missing Teeth', answer: 'Partial dentures can replace several missing teeth with a removable appliance. Elm Ridge compares them with bridges and implants so patients understand the tradeoffs.', related: [{ label: 'Dentures', href: '/dentures-killeen-tx' }, { label: 'Dental bridges', href: '/dental-bridges-killeen-tx' }, { label: 'Implant bridge', href: '/implant-bridge-killeen-tx' }] }),
    makePage({ slug: 'immediate-dentures-killeen-tx', name: 'Immediate Dentures', h1: 'Immediate Dentures for Same-Day Tooth Removal Plans', answer: 'Immediate dentures can be placed the day teeth are removed when appropriate. They are temporary in the sense that gums and bone change after extractions, so adjustments and follow-up matter.', providers: ['Jeff Muszynski, DDS'], related: [{ label: 'Tooth extractions', href: '/tooth-extractions-killeen-tx' }, { label: 'Dentures', href: '/dentures-killeen-tx' }, { label: 'Post-op instructions', href: '/post-op/immediate-dentures' }] }),
    makePage({ slug: 'dental-implants-killeen-tx', name: 'Dental Implants', title: 'Dental Implants in Killeen, TX | Elm Ridge', h1: 'Dental Implants Planned, Placed, and Restored in One Killeen Office', answer: 'Elm Ridge provides dental implants in Killeen, including single implants, implant bridges, snap-on dentures, full-arch dental implants, bone grafting, sinus lifts, and restoration of implants placed elsewhere after evaluation.', providers: ['Jeff Muszynski, DDS'], related: implantRelated, image: 'cbct-implant-planning-killeen.webp', alt: '3D dental implant planning at Elm Ridge in Killeen' }),
    makePage({ slug: 'single-tooth-implant-killeen-tx', name: 'Single Tooth Implant', h1: 'Replacing One Missing Tooth With an Implant', answer: 'A single tooth implant can replace one missing tooth without reshaping healthy neighboring teeth, when bone, gum health, bite, and timing support the plan.', providers: ['Jeff Muszynski, DDS'], related: implantRelated }),
    makePage({ slug: 'implant-bridge-killeen-tx', name: 'Implant Bridge', h1: 'Implant Bridges for Multiple Missing Teeth', answer: 'An implant bridge can replace multiple missing teeth with fewer implants than one implant per tooth. Elm Ridge plans both the surgical and restorative parts of the case.', providers: ['Jeff Muszynski, DDS'], related: implantRelated, faq: [['Can an implant bridge replace several teeth?', 'Yes. It can replace multiple teeth in a row when the implants and bite can support the design.'], ['Can Elm Ridge restore implants placed elsewhere?', 'Yes, after evaluation and with records, system information, and imaging as needed.']] }),
    makePage({ slug: 'full-arch-dental-implants-killeen-tx', name: 'Full-Arch Dental Implants', h1: 'Full-Arch Dental Implants for Fixed Tooth Replacement', answer: 'Elm Ridge provides surgery and restorative treatment for full-arch dental implant cases. Zirconia is the go-to final material; acrylic is used only in rare or selected situations when appropriate.', providers: ['Jeff Muszynski, DDS'], related: implantRelated, faq: [['Do you provide both surgery and restoration?', 'Yes. Elm Ridge provides surgery and restorative treatment for full-arch cases.'], ['What final material do you usually use?', 'Zirconia is the go-to final material. Acrylic is reserved for rare or selected situations when appropriate.'], ['Can you restore implants placed elsewhere?', 'Sometimes, after evaluation and with records, system details, and imaging as needed.']] }),
    makePage({ slug: 'all-on-4-dental-implants-killeen-tx', name: 'All-on-4-Style Treatment', h1: 'All-on-4-Style Treatment as Part of Full-Arch Planning', answer: 'All-on-4-style treatment is one way to support a full arch of teeth. Elm Ridge uses full-arch dental implants as the main term because the right number and position of implants depends on the case.', providers: ['Jeff Muszynski, DDS'], related: implantRelated }),
    makePage({ slug: 'snap-on-dentures-killeen-tx', name: 'Snap-On Dentures', h1: 'Snap-On Dentures for Better Denture Stability', answer: 'Snap-on dentures attach to dental implants for better stability than traditional dentures, while still being removable for cleaning.', providers: ['Jeff Muszynski, DDS'], related: implantRelated }),
    makePage({ slug: 'dentures-vs-implants-killeen-tx', name: 'Dentures vs Implants', title: 'Dentures vs Implants in Killeen, TX | Elm Ridge', h1: 'Dentures, Snap-On Dentures, and Full-Arch Implants Compared', answer: 'Traditional dentures, snap-on dentures, and full-arch dental implants solve different problems. Elm Ridge helps patients compare stability, chewing, maintenance, surgery, cost, and long-term goals without pretending one option fits everyone.', providers: ['Jeff Muszynski, DDS'], related: implantRelated, faq: [['Will insurance cover full-arch implants?', `${insuranceCaveat} Dental implant benefits vary widely, and many plans limit implant coverage. Elm Ridge can estimate benefits before treatment.`], ['Do dentures stop bone loss?', 'Traditional dentures do not replace tooth roots, so the jawbone can continue to change over time. Implants can help preserve bone where they are placed.']] }),
    makePage({ slug: 'bone-grafting-killeen-tx', name: 'Bone Grafting', h1: 'Bone Grafting for Implant and Extraction Planning', answer: 'Bone grafting may be recommended after an extraction or before an implant when the jaw needs more support or better ridge shape for future treatment.', providers: ['Jeff Muszynski, DDS'], related: implantRelated }),
    makePage({ slug: 'sinus-lift-killeen-tx', name: 'Sinus Lift', h1: 'Sinus Lifts When Upper Implant Planning Needs More Bone', answer: 'A sinus lift may be needed for some upper back tooth implant cases when the sinus is close to the jawbone where an implant would be placed.', providers: ['Jeff Muszynski, DDS'], related: implantRelated }),
    makePage({ slug: 'cosmetic-dentistry-killeen-tx', name: 'Cosmetic Dentistry', title: 'Cosmetic Dentistry in Killeen, TX | Elm Ridge', h1: 'Cosmetic Dentistry That Still Looks Like You', answer: 'Elm Ridge offers veneers, cosmetic bonding, custom take-home whitening trays, clear aligners, crowns, bridges, and smile planning with a natural-looking result as the goal.', related: cosmeticRelated, providers: ['Jeff Muszynski, DDS', 'Kayla Muszynski, DDS'], image: 'cosmetic dentistry killeen 1.webp', alt: 'Cosmetic dentistry result at Elm Ridge in Killeen' }),
    makePage({ slug: 'veneers-killeen-tx', name: 'Veneers', h1: 'Veneers Planned for Shape, Proportion, and Restraint', answer: 'Veneers can change the visible shape, shade, and proportion of front teeth. Elm Ridge uses them selectively when they make sense for the tooth structure and smile goals.', related: cosmeticRelated, providers: ['Kayla Muszynski, DDS', 'Jeff Muszynski, DDS'] }),
    makePage({ slug: 'cosmetic-bonding-killeen-tx', name: 'Cosmetic Bonding', h1: 'Cosmetic Bonding for Chips, Gaps, and Small Shape Changes', answer: 'Cosmetic bonding can repair small chips, close selected small gaps, and improve tooth shape with tooth-colored composite. It is often more conservative than veneers but not right for every case.', related: cosmeticRelated, providers: ['Kayla Muszynski, DDS'] }),
    makePage({ slug: 'teeth-whitening-killeen-tx', name: 'Teeth Whitening', h1: 'Custom Take-Home Whitening Trays', answer: 'Elm Ridge offers teeth whitening with custom trays and take-home whitening gel. Crowns, fillings, and veneers do not whiten like natural enamel, so timing matters if dental work is planned.', related: cosmeticRelated, providers: ['Kayla Muszynski, DDS'], medical: false }),
    makePage({ slug: 'clear-aligners-killeen-tx', name: 'Clear Aligners', h1: 'Clear Aligners Without Locking You Into One Brand', answer: 'Elm Ridge offers clear aligners and uses multiple brands when appropriate. The focus is on tooth movement that fits your bite, goals, and long-term dental health.', related: cosmeticRelated, providers: ['Jeff Muszynski, DDS', 'Kayla Muszynski, DDS'] }),
    makePage({ slug: 'sedation-dentistry-killeen-tx', name: 'Sedation Dentistry', h1: 'Sedation Options for a Calmer Dental Visit', answer: 'Elm Ridge offers nitrous oxide and oral conscious sedation for evaluated candidates. Elm Ridge does not offer IV sedation, deep sedation, or general anesthesia.', providers: ['Jeff Muszynski, DDS'], related: [{ label: 'Nitrous oxide', href: '/nitrous-oxide-dentist-killeen-tx' }, { label: 'Oral conscious sedation', href: '/oral-conscious-sedation-killeen-tx' }, serviceLinks.jeff, serviceLinks.appointment], faq: [['Do you offer IV sedation?', 'No. Elm Ridge offers nitrous oxide and oral conscious sedation, but not IV sedation.'], ['Can I drive after nitrous oxide?', 'Most patients can drive after nitrous oxide because it wears off quickly.'], ['Do I need a driver for oral conscious sedation?', 'Yes. Oral conscious sedation requires a driver and planning before the appointment.']] }),
    makePage({ slug: 'nitrous-oxide-dentist-killeen-tx', name: 'Nitrous Oxide', h1: 'Nitrous Oxide for Light Dental Relaxation', answer: 'Nitrous oxide can help take the edge off dental visits and wears off quickly after the appointment.', providers: ['Jeff Muszynski, DDS'], related: [{ label: 'Sedation dentistry', href: '/sedation-dentistry-killeen-tx' }, { label: 'Oral conscious sedation', href: '/oral-conscious-sedation-killeen-tx' }, serviceLinks.appointment] }),
    makePage({ slug: 'oral-conscious-sedation-killeen-tx', name: 'Oral Conscious Sedation', h1: 'Oral Conscious Sedation for Evaluated Candidates', answer: 'Oral conscious sedation uses prescribed medication for deeper relaxation while the patient remains responsive. It requires evaluation, instructions, and a driver. It is not IV sedation.', providers: ['Jeff Muszynski, DDS'], related: [{ label: 'Sedation dentistry', href: '/sedation-dentistry-killeen-tx' }, { label: 'Nitrous oxide', href: '/nitrous-oxide-dentist-killeen-tx' }, serviceLinks.jeff] }),
    makePage({ slug: 'sleep-apnea-dentist-killeen-tx', name: 'Sleep Apnea Oral Appliances', title: 'Sleep Apnea Dentist in Killeen, TX | Elm Ridge', h1: 'Sleep Apnea Oral Appliance Therapy in Killeen', answer: 'Elm Ridge helps with take-home sleep studies and FDA-cleared oral appliances for appropriate mild to moderate obstructive sleep apnea and CPAP-intolerant patients. A sleep physician must make the official diagnosis before appliance delivery.', providers: ['Jeff Muszynski, DDS'], related: [{ label: 'Insurance and financing', href: '/insurance-and-financing' }, serviceLinks.jeff, serviceLinks.appointment], extra: '<h2>Important Medical Boundary</h2><p>Recorded sleep-study data is sent to a sleep physician for official medical diagnosis. Severe OSA is handled with physician involvement. Medical insurance billing applies to appliances only, not sleep studies.</p>', faq: [['Can a dentist diagnose sleep apnea?', 'No. A sleep physician makes the official medical diagnosis.'], ['Do you use FDA-cleared oral appliances?', 'Yes. Elm Ridge uses FDA-cleared oral appliances and does not present one appliance brand as the only option.'], ['Does medical insurance cover sleep studies?', 'Elm Ridge bills medical insurance for appliances only, not sleep studies.']] }),
    makePage({ slug: 'tmj-splint-therapy-killeen-tx', name: 'TMJ Splint Therapy', h1: 'TMJ Splint Therapy for Limited TMJ Care', answer: 'Elm Ridge provides limited TMJ care focused on splint therapy. If a patient needs more advanced care, the practice will explain and refer appropriately.', providers: ['Jeff Muszynski, DDS'], related: [serviceLinks.services, serviceLinks.newPatients, serviceLinks.appointment, serviceLinks.jeff] }),
  ];
  const preserveLegacyDesignedPages = new Set([
    'dental-implants-killeen-tx',
    'cosmetic-dentistry-killeen-tx',
  ]);

  pages
    .filter(({ slug }) => !preserveLegacyDesignedPages.has(slug))
    .forEach(createServicePage);

  [
    {
      slug: 'emergency-dentist-killeen-tx',
      h1: 'Emergency Dentist in Killeen: When to Call and When to Go to the ER',
      title: 'Emergency Dentist in Killeen, TX | Elm Ridge',
      description: 'Call Elm Ridge for emergency dental care in Killeen. Same-day appointments when possible, with ER guidance for severe swelling, trauma, or medical emergencies.',
      intro: 'Call first for tooth pain, swelling, broken teeth, lost crowns, knocked-out teeth, or urgent dental concerns.',
      answer: 'For dental emergencies, call first. Elm Ridge offers same-day emergency appointments when possible, but same-day care is not guaranteed without an appointment.',
      now: `Call ${phoneDisplay} as early as possible. Describe pain, swelling, trauma, fever, broken teeth, or lost restorations so the team can help triage the next step.`,
      treat: 'Elm Ridge can evaluate the problem, take X-rays when needed, relieve pain when possible, stabilize broken teeth, treat infection, perform root canals or extractions when appropriate, and explain follow-up options.',
      related: emergencyRelated,
      faq: [
        ['Do you take walk-ins?', 'Appointments are recommended. If someone walks in with an urgent concern and the schedule allows, Elm Ridge will try to help, but same-day care is not guaranteed without an appointment.'],
        ['Is after-hours emergency guidance available?', 'After-hours emergency guidance is available for patients of record. The phone prompt after hours can reach a doctor. New patients with urgent concerns should call during business hours as early as possible.'],
        ['What symptoms should go to the ER?', 'Go to the ER for severe swelling, trouble breathing, trouble swallowing, uncontrolled bleeding, major trauma, or any medical emergency.'],
      ],
    },
    {
      slug: 'broken-tooth-killeen-tx',
      h1: 'I Broke a Tooth. What Should I Do?',
      title: 'Broken Tooth in Killeen, TX | Elm Ridge',
      description: 'Broken tooth in Killeen? Learn what to do now, when to call Elm Ridge, and when a crown, root canal, extraction, or ER care may be needed.',
      intro: 'A broken tooth can be a small cosmetic chip, a painful fracture, or a sign that the tooth is structurally compromised.',
      answer: 'If you broke a tooth, avoid chewing on it, save any fragment if you have it, and call Elm Ridge. A painless cosmetic chip may be seen same-day if possible, but same-day care is not guaranteed.',
      question: 'I broke a tooth. What should I do right now?',
      now: 'Rinse gently with warm water, avoid chewing on that side, and cover sharp edges with orthodontic wax if needed. Save any tooth fragment in a small bag and call before using an online form.',
      wait: 'A tiny painless chip may be less urgent, but pain, swelling, a loose piece, bleeding, or a crack that hurts to bite should be handled promptly. If you are not sure, call and describe what happened.',
      treat: 'Elm Ridge can check whether the tooth is restorable, smooth or protect sharp edges, repair small breaks, place a lab-made crown, perform a root canal when appropriate, or discuss extraction and replacement options.',
      treatmentOptions: 'Possible next steps include bonding, a filling, a crown, root canal treatment, extraction, or a staged plan if swelling or infection is present.',
      related: emergencyRelated,
      nextQuestions: [
        { label: 'Dental crowns', href: '/dental-crowns-killeen-tx', text: 'When a broken tooth needs stronger coverage than a filling.' },
        { label: 'Root canals', href: '/root-canal-killeen-tx', text: 'When a fracture or deep decay reaches the nerve.' },
        { label: 'Tooth extractions', href: '/tooth-extractions-killeen-tx', text: 'When a tooth cannot be predictably saved.' },
      ],
      faq: [
        ['Should I save the broken piece?', 'Yes, if you have it. Bring it with you, but do not delay calling if you cannot find it.'],
        ['Can a broken tooth wait if it does not hurt?', 'Sometimes, but not always. A painless crack can still worsen, so call for guidance.'],
        ['Should I go to the ER for a broken tooth?', 'Go to the ER for major trauma, uncontrolled bleeding, severe swelling, trouble breathing, trouble swallowing, or a medical emergency.'],
      ],
      isSymptom: true,
    },
    {
      slug: 'toothache-killeen-tx',
      h1: 'I Have a Toothache. What Should I Do?',
      title: 'Toothache Relief in Killeen, TX | Elm Ridge',
      description: 'Toothache in Killeen? Learn when to call Elm Ridge, what not to do, and how fillings, crowns, root canals, extractions, or gum care may help.',
      intro: 'Tooth pain that comes and goes can still be a sign of decay, cracks, nerve inflammation, bite trauma, gum problems, or infection.',
      answer: 'Call Elm Ridge if a toothache repeats, lingers, wakes you up, hurts to bite, or comes with swelling or fever. Do not put aspirin directly on the gums or tooth.',
      question: 'My tooth hurts. What should I do right now?',
      now: 'Keep the area clean, avoid chewing on the painful side, and call. If you can take over-the-counter pain medicine safely, follow the label or your physician guidance.',
      wait: 'Brief sensitivity that disappears quickly may not be an emergency, but pain that lingers, pulses, wakes you up, or comes with swelling should be evaluated soon.',
      treat: 'Elm Ridge can diagnose the source, take X-rays, test the tooth, and discuss fillings, crowns, root canals, extractions, gum care, or referral depending on the cause.',
      treatmentOptions: 'A toothache may need a filling, crown, root canal, extraction, periodontal treatment, bite adjustment, medication, or no treatment beyond monitoring if the tooth tests healthy.',
      related: emergencyRelated,
      nextQuestions: [
        { label: 'Root canals', href: '/root-canal-killeen-tx', text: 'When tooth pain comes from an inflamed or infected nerve.' },
        { label: 'Molar root canals', href: '/molar-root-canal-killeen-tx', text: 'How Elm Ridge handles many back-tooth root canals.' },
        { label: 'Dental abscess', href: '/dental-abscess-killeen-tx', text: 'What to know if pain comes with swelling.' },
      ],
      faq: [
        ['Should I put aspirin on my tooth?', 'No. Aspirin can burn the gum tissue and does not treat the cause of the toothache.'],
        ['Can a toothache go away on its own?', 'Pain can fade temporarily even when the underlying problem remains, so recurring or lingering pain should be evaluated.'],
        ['When is tooth pain an emergency?', 'Swelling, fever, trouble swallowing, trouble breathing, uncontrolled pain, or trauma should be treated urgently.'],
      ],
      isSymptom: true,
    },
    {
      slug: 'dental-abscess-killeen-tx',
      h1: 'I Think I Have a Dental Abscess. What Should I Do?',
      title: 'Dental Abscess Treatment in Killeen, TX | Elm Ridge',
      description: 'Dental abscess or swelling in Killeen? Call Elm Ridge and go to the ER for breathing trouble, swallowing trouble, severe swelling, or medical emergencies.',
      intro: 'Swelling can become serious quickly, so dental infection symptoms deserve direct guidance.',
      answer: 'Call Elm Ridge for dental swelling or a suspected abscess. Go to the ER for severe swelling, trouble breathing, trouble swallowing, uncontrolled bleeding, major trauma, or a medical emergency.',
      question: 'I have swelling or a possible abscess. What should I do right now?',
      now: 'Call as early as possible. If swelling is spreading, affecting breathing or swallowing, or making you feel seriously ill, go to the ER instead of waiting for a dental appointment.',
      wait: 'Dental swelling should not be watched casually. Even if pain improves, infection can remain and may need dental treatment to address the source.',
      treat: 'Elm Ridge can evaluate the tooth, take imaging, treat infection when appropriate, and explain whether root canal treatment, extraction, drainage, medication, or referral is needed.',
      treatmentOptions: 'Treatment depends on the source and severity. Antibiotics alone usually do not fix the dental cause, so root canal treatment, extraction, or other dental treatment may be needed.',
      related: emergencyRelated,
      nextQuestions: [
        { label: 'Root canals', href: '/root-canal-killeen-tx', text: 'One way to treat infection when the tooth can be saved.' },
        { label: 'Tooth extractions', href: '/tooth-extractions-killeen-tx', text: 'When the tooth cannot be predictably saved.' },
        { label: 'Emergency dentist', href: '/emergency-dentist-killeen-tx', text: 'How Elm Ridge handles urgent dental calls.' },
      ],
      faq: [
        ['Can antibiotics fix a dental abscess?', 'Antibiotics may help control infection in some situations, but dental treatment is usually needed to address the source.'],
        ['When should swelling go to the ER?', 'Go to the ER for severe swelling, trouble breathing, trouble swallowing, uncontrolled bleeding, major trauma, or a medical emergency.'],
        ['Should I wait if the abscess drains?', 'No. Drainage may reduce pressure, but the source still needs evaluation.'],
      ],
      isSymptom: true,
    },
    {
      slug: 'lost-crown-killeen-tx',
      h1: 'I Lost a Crown. What Should I Do?',
      title: 'Lost Crown in Killeen, TX | Elm Ridge',
      description: 'Lost a crown in Killeen? Save it, avoid chewing on the tooth, and call Elm Ridge to see whether it can be recemented or needs replacement.',
      intro: 'A lost crown is not always painful, but the tooth underneath may be exposed, sensitive, decayed, or weakened.',
      answer: 'If a crown comes off, save it, avoid chewing on that side, do not use superglue, and call Elm Ridge for an evaluation.',
      question: 'I lost a crown. What should I do right now?',
      now: 'Put the crown in a small bag and bring it with you. Avoid sticky foods and chewing on that side. Pharmacy temporary cement may help only if the crown fits easily and the bite feels normal.',
      wait: 'If the tooth is painful, sharp, loose, swollen, or very sensitive, call promptly. Even without pain, the uncovered tooth can shift, decay, or break if it is left alone too long.',
      treat: 'Elm Ridge can evaluate the tooth and crown, recement it when appropriate, or explain whether decay, fracture, root canal treatment, buildup, or a new lab-made crown is needed.',
      treatmentOptions: 'Possible next steps include recementing the crown, replacing it, building up the tooth, treating decay, root canal treatment, or discussing extraction if the tooth is not restorable.',
      related: emergencyRelated,
      nextQuestions: [
        { label: 'Dental crowns', href: '/dental-crowns-killeen-tx', text: 'How lab-made crowns protect weakened teeth.' },
        { label: 'Crown cost', href: '/crown-cost-killeen-tx', text: 'What affects the estimate if the crown needs replacement.' },
        { label: 'Root canals', href: '/root-canal-killeen-tx', text: 'When the tooth under a crown becomes painful or infected.' },
      ],
      faq: [
        ['Can I glue my crown back on?', 'Do not use superglue. Temporary dental cement may be used only if the crown fits easily and the bite feels normal.'],
        ['Can Elm Ridge reuse my old crown?', 'Sometimes. The tooth and crown have to be evaluated first. Decay, fracture, or poor fit may mean replacement is needed.'],
        ['Is a lost crown an emergency?', 'It can be urgent if there is pain, swelling, sensitivity, a sharp edge, or trouble chewing. Call for guidance.'],
      ],
      isSymptom: true,
    },
    {
      slug: 'knocked-out-tooth-killeen-tx',
      h1: 'A Permanent Tooth Was Knocked Out. What Should I Do?',
      title: 'Knocked-Out Tooth in Killeen, TX | Elm Ridge',
      description: 'Knocked-out permanent tooth in Killeen? Call immediately. Learn how to handle the tooth and when to go to the ER for trauma or severe bleeding.',
      intro: 'A knocked-out permanent tooth is urgent and time-sensitive.',
      answer: 'For a knocked-out permanent tooth, call immediately. Hold the tooth by the crown, keep it moist, and do not scrub the root. Baby teeth should not be replanted.',
      question: 'A permanent tooth was knocked out. What should I do right now?',
      now: 'Pick the tooth up by the crown, not the root. If possible, place it gently back in the socket. If not, keep it in milk or saliva and call immediately. Do not scrub the root.',
      wait: 'Do not wait. Time matters for a knocked-out permanent tooth. If there was major facial trauma, uncontrolled bleeding, or a medical emergency, go to the ER.',
      treat: 'Elm Ridge can evaluate the tooth, stabilize it when appropriate, address pain or injury, and discuss replacement options if the tooth cannot be saved.',
      treatmentOptions: 'Treatment may include reimplantation and stabilization, X-rays, follow-up monitoring, root canal treatment later, or replacement planning if the tooth cannot be saved.',
      related: emergencyRelated,
      nextQuestions: [
        { label: 'Emergency dentist', href: '/emergency-dentist-killeen-tx', text: 'How to call and get triaged quickly.' },
        { label: 'Dental implants', href: '/dental-implants-killeen-tx', text: 'One replacement option if a tooth cannot be saved.' },
        { label: 'Dental bridges', href: '/dental-bridges-killeen-tx', text: 'A non-removable replacement option in selected cases.' },
      ],
      faq: [
        ['Should I put a baby tooth back in?', 'No. Baby teeth should not be replanted because that can damage the developing permanent tooth.'],
        ['Should I clean the tooth?', 'Do not scrub the root. If it is dirty, gently rinse with milk or saline if available, then keep it moist.'],
        ['When should I go to the ER?', 'Go to the ER for major trauma, uncontrolled bleeding, severe swelling, trouble breathing, trouble swallowing, or any medical emergency.'],
      ],
      isSymptom: true,
    },
  ].forEach((page) => createEmergencyPage({ ...page, isEmergency: true }));
}

function buildCostPages() {
  [
    ['dental-implant-cost-killeen-tx', 'Dental Implant Cost in Killeen, TX | Elm Ridge', 'Dental Implant Cost in Killeen', 'A single dental implant commonly ranges from $3,500-$6,500. The lower end is closer to implant, abutment, and crown only; the higher end may include extraction, socket preservation grafting, and other needed extras.', ['Implant, abutment, and crown', 'Whether extraction is needed', 'Socket preservation graft', 'Limited sinus bump if needed', 'Temporary tooth options', 'Final restoration material', '3D imaging and planning', 'Insurance benefits and financing'], 'An implant estimate requires diagnosis, imaging, and a restorative plan because the implant screw is only one part of the final tooth.', implantRelated],
    ['full-arch-dental-implant-cost-killeen-tx', 'Full-Arch Dental Implant Cost in Killeen, TX | Elm Ridge', 'Full-Arch Dental Implant Cost', 'Full-arch fixed dental implants commonly range from $25,000-$35,000 per arch, or $50,000-$70,000 for both arches. Cost varies because surgery, temporary teeth, final material, number of implants, grafting, and restorative design differ by case.', ['Upper or lower arch', 'Number and position of implants', 'Extractions and bone shaping', 'Temporary fixed teeth', 'Final zirconia restoration', 'Bite and smile design', 'Maintenance needs', 'Insurance benefits and financing'], 'Full-arch planning needs imaging, bite evaluation, smile design, and a discussion of whether fixed full-arch, snap-on dentures, or traditional dentures fit best.', implantRelated],
    ['snap-on-denture-cost-killeen-tx', 'Snap-On Denture Cost in Killeen, TX | Elm Ridge', 'Snap-On Denture Cost', 'Snap-on dentures commonly range from $8,000-$14,000 per arch. Cost depends on implant number, attachments, whether teeth need removal, bone grafting, and denture design.', ['Number of implants', 'New denture or modifying an existing denture', 'Extractions', 'Attachment system', 'Attachment maintenance', 'Denture material and design', 'Insurance benefits and financing'], 'An exam clarifies whether snap-on dentures are realistic and whether a traditional denture or full-arch fixed plan should also be compared.', implantRelated],
    ['crown-cost-killeen-tx', 'Dental Crown Cost in Killeen, TX | Elm Ridge', 'Dental Crown Cost', 'Lab-made crowns commonly range from $900-$1,600 per tooth. A core buildup commonly ranges from $250-$500 when needed.', ['Tooth location', 'Remaining tooth structure', 'Whether a core buildup is needed', 'Crown material', 'Root canal history', 'Bite forces', 'Replacing an old crown or large filling', 'Insurance plan'], 'A crown estimate requires checking how much tooth remains and whether the bite and nerve are healthy.', [{ label: 'Dental crowns', href: '/dental-crowns-killeen-tx' }, serviceLinks.insurance]],
    ['root-canal-cost-killeen-tx', 'Root Canal Cost in Killeen, TX | Elm Ridge', 'Root Canal Cost', 'Root canals commonly range from $600-$1,200. Cost depends on the tooth type, number of canals, infection, crown needs, and insurance benefits. Elm Ridge performs many root canals, including molars, but not retreatments.', ['Tooth type', 'Number and shape of canals', 'CBCT or imaging needs', 'Infection or abscess complexity', 'Whether a crown is needed afterward', 'Insurance plan'], 'Diagnosis and X-rays are needed because a toothache might require a filling, crown, root canal, extraction, or referral.', [{ label: 'Root canals', href: '/root-canal-killeen-tx' }, { label: 'Molar root canals', href: '/molar-root-canal-killeen-tx' }, serviceLinks.insurance]],
    ['clear-aligner-cost-killeen-tx', 'Clear Aligner Cost in Killeen, TX | Elm Ridge', 'Clear Aligner Cost', 'Clear aligners commonly range from $3,500-$5,500. Cost depends on case complexity, treatment length, records, refinements, retainers, and insurance orthodontic benefits.', ['Crowding, spacing, or relapse complexity', 'Treatment length', 'Records and digital scans', 'Refinements', 'Retainers', 'Insurance orthodontic benefits', 'Financing'], 'A clear aligner consultation is needed to confirm whether aligners are appropriate and which brand or workflow fits.', [{ label: 'Clear aligners', href: '/clear-aligners-killeen-tx' }, serviceLinks.insurance]],
    ['emergency-dentist-cost-killeen-tx', 'Emergency Dentist Cost in Killeen, TX | Elm Ridge', 'Emergency Dentist Cost', 'Emergency exam, X-ray, and triage commonly range from $150-$350. Treatment is separate and depends on diagnosis.', ['Emergency exam', 'X-rays', 'Urgency and triage needs', 'Whether same-day treatment is needed', 'Treatment type, billed separately', 'Insurance plan'], 'An emergency visit starts with diagnosis because the same symptom can have very different causes and costs.', emergencyRelated],
    ['sleep-apnea-appliance-cost-killeen-tx', 'Sleep Apnea Appliance Cost in Killeen, TX | Elm Ridge', 'Sleep Apnea Appliance Cost', 'Sleep apnea oral appliances commonly range from $2,500-$3,500. Medical insurance may help when requirements are met. Elm Ridge bills medical insurance for appliances only, not sleep studies.', ['Appliance type', 'Records and scans', 'Physician diagnosis and documentation', 'Medical insurance requirements', 'Follow-up adjustment', 'Dental evaluation findings'], 'A physician diagnosis is required before appliance delivery, and the dental visit confirms whether oral appliance therapy is appropriate.', [{ label: 'Sleep apnea dentist', href: '/sleep-apnea-dentist-killeen-tx' }, serviceLinks.insurance, serviceLinks.jeff]],
  ].forEach(([slug, title, h1, answer, factors, exam, related]) => createCostPage({
    slug,
    title,
    h1,
    answer,
    factors,
    exam,
    related,
    ownerApprovedRange: ownerCostRangeData[slug]?.ownerApprovedRange || '',
    description: `${h1} explained clearly. Learn what affects estimates, insurance, financing, and why Elm Ridge verifies benefits before treatment.`,
    crumb: h1,
    intro: slug === 'emergency-dentist-cost-killeen-tx'
      ? 'Emergency visits start with diagnosis, then treatment options and costs are explained clearly before care whenever possible.'
      : 'Cost should be estimated honestly after diagnosis, not invented for a web page.',
  }));
}

function buildNewPatientInsuranceAppointmentPages() {
  writePage('new-patients', {
    path: '/new-patients',
    title: 'New Patients | Elm Ridge Implant and Family Dentistry',
    description: 'New patients are welcome at Elm Ridge in Killeen. Learn what to expect, insurance and financing options, emergency visit guidance, children\'s care, sedation options, and how to request an appointment.',
    crumb: 'New Patients',
    kicker: 'New Patients',
    h1: 'New Patients Are Welcome at Elm Ridge',
    intro: `Elm Ridge Implant and Family Dentistry is a privately owned dental office in Killeen led by Jeff Muszynski, DDS and Kayla Muszynski, DDS. We see children, adults, families, emergency patients, and patients looking for everything from routine care to implants, cosmetic dentistry, and second opinions.<br /><span class="block mt-4 text-teal text-sm uppercase tracking-[0.24em]">${reviewPhrase}</span>`,
    heroPrimaryLabel: `Call ${phoneDisplay}`,
    heroPrimaryHref: phoneHref,
    heroSecondaryLabel: 'Request an Appointment',
    heroSecondaryHref: '/request-appointment',
    body: `<section class="py-12 bg-white"><div class="max-w-6xl mx-auto px-6">
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 not-prose">
        ${[
          ['Accepting new patients', 'Yes'],
          ['Children', 'Yes, once teeth are present'],
          ['Emergency visits', 'Same-day when possible; call first'],
          ['Insurance', 'In-network with most major PPO plans'],
          ['Medicaid', 'Not accepted'],
          ['Financing', 'CareCredit and Cherry available'],
          ['Sedation', 'Nitrous oxide and oral conscious sedation; no IV sedation'],
          ['Friday hours', 'Closed Fridays'],
          ['Location', addressLine],
        ].map(([label, value]) => `<div class="border border-teal-light bg-stone p-5"><p class="text-xs uppercase tracking-[0.24em] text-teal-dark mb-2">${label}</p><p class="text-charcoal font-semibold leading-7">${value}</p></div>`).join('')}
      </div>
    </div></section>
    <section class="py-16 bg-stone"><div class="max-w-6xl mx-auto px-6 grid lg:grid-cols-[0.9fr,1.1fr] gap-10 items-start">
      <div>
        <p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-4">First Visit</p>
        <h2 class="font-display text-5xl text-charcoal leading-tight mb-5">What to expect at your first visit</h2>
        <p class="text-charcoal/70 leading-8">Your first appointment is built around clarity. Elm Ridge will not treat every new patient visit like the same script, but the goal is always to understand what you need, explain what the team sees, and give you practical next steps.</p>
      </div>
      <div class="grid sm:grid-cols-2 gap-4 not-prose">
        ${[
          'We get to know your goals and concerns.',
          'We review your dental and medical history.',
          'We take appropriate X-rays or imaging as needed.',
          'The doctor performs an exam.',
          'We explain findings in plain language.',
          'You get options, priorities, and next steps.',
          'We review insurance and payment estimates before treatment when possible.',
          'Bring your photo ID, insurance card, medication list, and any recent dental X-rays if available.',
        ].map((item, index) => `<div class="bg-white border border-teal-light p-5"><p class="text-teal-dark text-xs uppercase tracking-[0.2em] mb-3">Step ${index + 1}</p><p class="text-charcoal/75 leading-7">${item}</p></div>`).join('')}
      </div>
    </div></section>
    <section class="py-16 bg-white"><div class="max-w-6xl mx-auto px-6">
      <div class="max-w-3xl mb-8">
        <p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-4">Who We Care For</p>
        <h2 class="font-display text-5xl text-charcoal leading-tight mb-5">A dental home for real family life</h2>
        <p class="text-charcoal/70 leading-8">Elm Ridge sees adults, children once teeth are present, families, patients with dental anxiety, patients who need implants or more complex planning, and patients who want a second opinion before moving forward.</p>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 not-prose">
        ${[
          ['Adults and families', 'Preventive, restorative, cosmetic, and urgent dental care in one privately owned office.'],
          ['Children', 'Children are seen as part of family dentistry once teeth are present. Elm Ridge is not a pediatric specialty office.'],
          ['Anxious patients', 'The team can talk through comfort options, pacing, and what to expect before treatment.'],
          ['Implant and complex-care patients', 'Consultations can help compare implants, dentures, full-arch options, and restorative choices.'],
          ['Second opinions', 'Bring your questions. The goal is a clear explanation, not pressure.'],
          ['Military families', 'Elm Ridge treats military families, spouses, and dependents from the Fort Cavazos / Fort Hood area. Active-duty service members are not currently treated through active-duty military dental programs.'],
        ].map(([label, text]) => `<div class="border border-teal-light bg-stone p-6"><h3 class="font-display text-3xl text-charcoal mb-3">${label}</h3><p class="text-charcoal/65 leading-7">${text}</p></div>`).join('')}
      </div>
    </div></section>
    <section class="py-16 bg-stone"><div class="max-w-6xl mx-auto px-6">
      <div class="max-w-3xl mb-8">
        <p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-4">Care You Can Start Here</p>
        <h2 class="font-display text-5xl text-charcoal leading-tight mb-5">Routine visits, bigger questions, and urgent problems</h2>
        <p class="text-charcoal/70 leading-8">You do not have to know the exact service you need before calling. The team can help you decide whether to start with a cleaning, exam, consultation, emergency visit, or second opinion.</p>
      </div>
      ${cardGrid([
        { kicker: 'Family Dentistry', label: 'Cleanings, exams, fillings, crowns, and children\'s care', href: '/family-dentist-killeen-tx', text: 'Steady family dental care for children once teeth are present, adults, and seniors.' },
        { kicker: 'Emergency Care', label: 'Tooth pain, broken teeth, swelling, and knocked-out teeth', href: '/emergency-dentist-killeen-tx', text: 'Call first for urgent dental problems. Same-day care is available when the schedule allows.' },
        { kicker: 'Implants and Dentures', label: 'Single implants, implant bridges, snap-on dentures, and full-arch options', href: '/dental-implants-killeen-tx', text: 'Start with diagnosis, imaging, and a clear comparison of tooth replacement choices.' },
        { kicker: 'Cosmetic Dentistry', label: 'Veneers, bonding, whitening, and clear aligners', href: '/cosmetic-dentistry-killeen-tx', text: 'Natural-looking cosmetic planning that fits your teeth, bite, and goals.' },
        { kicker: 'Comfort Options', label: 'Nitrous oxide and oral conscious sedation', href: '/sedation-dentistry-killeen-tx', text: 'Comfort options are available for appropriate patients. IV sedation is not offered.' },
        { kicker: 'Sleep Apnea', label: 'Take-home sleep studies and oral appliances', href: '/sleep-apnea-dentist-killeen-tx', text: 'Oral appliances may be used after sleep-study data and physician diagnosis.' },
      ])}
      <div class="mt-8">${pillLinks([{ label: 'See all services', href: '/services' }, { label: 'Read patient reviews', href: '/reviews' }])}</div>
    </div></section>
    <section class="py-16 bg-white"><div class="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-8">
      <div class="border border-teal-light bg-stone p-8">
        <p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-4">Insurance and Payment</p>
        <h2 class="font-display text-4xl text-charcoal mb-5">Clear estimates before treatment whenever possible</h2>
        <div class="prose-page space-y-5">
          <p>Elm Ridge is in-network with most major PPO dental plans and can file many out-of-network PPO plans. Benefits vary by employer and plan. ${insuranceCaveat}</p>
          <ul><li>Most major PPO plans are accepted.</li><li>Medicaid is not accepted.</li><li>Many Medicare Advantage dental plans may be accepted depending on the plan.</li><li>Traditional Medicare generally does not cover routine dental care.</li><li>TRICARE Dental Program / United Concordia is accepted where appropriate.</li><li>CareCredit and Cherry are available.</li><li>Payment is due at the time of service.</li><li>In-house arrangements may be considered case by case.</li></ul>
        </div>
        <div class="mt-6">${pillLinks([{ label: 'Insurance and financing', href: '/insurance-and-financing' }])}</div>
      </div>
      <div class="border border-teal-light bg-white p-8">
        <p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-4">Scheduling</p>
        <h2 class="font-display text-4xl text-charcoal mb-5">How appointment requests work</h2>
        <div class="prose-page space-y-5">
          <p>The fastest way to schedule is to call <a href="${phoneHref}">${phoneDisplay}</a>. You can also use the appointment request form for non-emergency visits.</p>
          <p>Online scheduling is currently an appointment request, not guaranteed real-time booking. For urgent dental problems, call instead of using the form so the team can triage timing and symptoms.</p>
          <p>Appointments are recommended. Walk-ins are not guaranteed, though the team will try to help when the schedule allows.</p>
        </div>
        <div class="mt-6">${pillLinks([{ label: 'Request an appointment', href: '/request-appointment' }, { label: `Call ${phoneDisplay}`, href: phoneHref }])}</div>
      </div>
    </div></section>
    <section class="py-16 bg-stone"><div class="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-8">
      <div class="bg-white border border-teal-light p-8">
        <p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-4">Second Opinions</p>
        <h2 class="font-display text-4xl text-charcoal mb-5">A careful second look is welcome</h2>
        <div class="prose-page space-y-5">
          <p>Elm Ridge offers second opinions for patients who want another set of eyes before committing to treatment.</p>
          <p>The doctors may take their own X-rays or imaging for diagnostic accuracy and medical-legal documentation, even if another office has already taken images. That is not meant to make you repeat things unnecessarily; it helps the team make and document decisions responsibly.</p>
          <p>If recent diagnostic-quality X-rays are sent from another office, Elm Ridge can review them, but may still take its own images if needed. When duplicative images are needed and insurance does not pay, or when a patient does not have insurance, the team avoids charging for duplicative images when appropriate.</p>
        </div>
      </div>
      <div class="bg-white border border-teal-light p-8">
        <p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-4">Emergencies</p>
        <h2 class="font-display text-4xl text-charcoal mb-5">For urgent dental problems, call first</h2>
        <div class="prose-page space-y-5">
          <p>For urgent dental problems, call <a href="${phoneHref}">${phoneDisplay}</a>. Same-day appointments are available when possible.</p>
          <p>True trauma, knocked-out permanent teeth, swelling, severe pain, and infection symptoms are prioritized. Painless cosmetic chips may be seen same-day if possible, but same-day care is not guaranteed.</p>
          <p>Go to the ER for severe swelling, trouble breathing, trouble swallowing, uncontrolled bleeding, major trauma, or any medical emergency.</p>
        </div>
        <div class="mt-6">${pillLinks([{ label: 'Emergency dentist', href: '/emergency-dentist-killeen-tx' }, { label: 'Broken tooth', href: '/broken-tooth-killeen-tx' }, { label: 'Toothache', href: '/toothache-killeen-tx' }, { label: 'Dental abscess', href: '/dental-abscess-killeen-tx' }, { label: 'Knocked-out tooth', href: '/knocked-out-tooth-killeen-tx' }])}</div>
      </div>
    </div></section>
    <section class="py-16 bg-white"><div class="max-w-6xl mx-auto px-6">
      <div class="max-w-3xl mb-8">
        <p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-4">Meet Your Doctors</p>
        <h2 class="font-display text-5xl text-charcoal leading-tight mb-5">A husband-and-wife private-practice team</h2>
        <p class="text-charcoal/70 leading-8">Jeff Muszynski, DDS and Kayla Muszynski, DDS both attended Abilene Christian University and graduated from the University of Oklahoma College of Dentistry. Jeff graduated dental school in 2014, and Kayla graduated dental school in 2015.</p>
      </div>
      <div class="grid md:grid-cols-2 gap-6 not-prose">
        <a href="/dr-jeff-muszynski-dds" class="group block border border-teal-light bg-stone hover:border-teal transition-colors">
          <img src="/Jeff%20photo.webp" alt="Jeff Muszynski, DDS" class="w-full h-80 object-cover" loading="lazy" decoding="async" />
          <div class="p-6"><h3 class="font-display text-4xl text-charcoal mb-2">Jeff Muszynski, DDS</h3><p class="text-charcoal/65 leading-7">Implants, oral surgery, root canals, restorative dentistry, cosmetic dentistry, and family care.</p><p class="mt-4 text-xs uppercase tracking-[0.22em] text-teal-dark font-semibold">Read Dr. Jeff's profile</p></div>
        </a>
        <a href="/dr-kayla-muszynski-dds" class="group block border border-teal-light bg-stone hover:border-teal transition-colors">
          <img src="/kayla%20photo.webp" alt="Kayla Muszynski, DDS" class="w-full h-80 object-cover" loading="lazy" decoding="async" />
          <div class="p-6"><h3 class="font-display text-4xl text-charcoal mb-2">Kayla Muszynski, DDS</h3><p class="text-charcoal/65 leading-7">Family dentistry, restorative dentistry, cleanings and exams, cosmetic dentistry, veneers, whitening, and clear aligner care.</p><p class="mt-4 text-xs uppercase tracking-[0.22em] text-teal-dark font-semibold">Read Dr. Kayla's profile</p></div>
        </a>
      </div>
      <div class="mt-8">${pillLinks([{ label: 'Meet both doctors', href: '/doctors' }, { label: 'Request an appointment', href: '/request-appointment' }])}</div>
    </div></section>`,
    faq: [
      ['Are you accepting new patients?', 'Yes.'],
      ['Do you see children?', 'Yes, children are seen as part of family dentistry once teeth are present.'],
      ['Do you accept Medicaid?', 'No, Elm Ridge does not accept Medicaid.'],
      ['Do you accept PPO insurance?', 'Elm Ridge is in-network with most major PPO dental plans and can file many out-of-network PPO plans. Benefits vary by employer and plan.'],
      ['Do you offer payment plans?', 'CareCredit and Cherry are available. In-house arrangements may be considered case by case.'],
      ['Do you offer sedation?', 'Yes, Elm Ridge offers nitrous oxide and oral conscious sedation for appropriate patients. IV sedation is not offered.'],
      ['Do you take walk-ins?', 'Appointments are recommended. If someone walks in with an urgent concern and the schedule allows, the team will try to help, but same-day care is not guaranteed without an appointment.'],
      ['Do you offer second opinions?', 'Yes. Elm Ridge offers second opinions and may take its own imaging for diagnostic accuracy.'],
      ['Do you see military families?', 'Yes, Elm Ridge treats military families, spouses, and dependents from the Fort Cavazos / Fort Hood area. Active-duty service members are not currently treated through active-duty military dental programs.'],
      ['What should I do if I have a dental emergency?', `Call ${phoneDisplay}. For severe swelling, trouble breathing, trouble swallowing, uncontrolled bleeding, major trauma, or medical emergency, go to the ER.`],
    ],
    footerTitle: 'Ready to schedule?',
    footerText: 'Call or request an appointment online. Online scheduling is currently an appointment request, not guaranteed real-time booking. For emergencies, call instead of using the form.',
    footerPrimaryLabel: `Call ${phoneDisplay}`,
    footerPrimaryHref: phoneHref,
    footerSecondaryLabel: 'Request an Appointment',
    footerSecondaryHref: '/request-appointment',
    headSchemas: [
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'New Patients Are Welcome at Elm Ridge',
        url: `${domain}/new-patients`,
        description: 'New patients are welcome at Elm Ridge in Killeen. Learn what to expect, insurance and financing options, emergency visit guidance, children\'s care, sedation options, and how to request an appointment.',
        isPartOf: { '@id': `${domain}/#website` },
        about: dentistEntityRef,
        mainEntity: dentistEntityRef,
      }, 'new_patients_webpage'),
    ],
  });

  writePage('insurance-and-financing', {
    path: '/insurance-and-financing',
    title: 'Dental Insurance and Financing in Killeen, TX | Elm Ridge',
    description: 'Elm Ridge works with many PPO dental plans, CareCredit, Cherry, and case-by-case payment arrangements. Learn Medicaid, TRICARE, Medicare, and payment details.',
    crumb: 'Insurance and Financing',
    kicker: 'Insurance and Payment',
    h1: 'Dental Insurance and Financing',
    intro: 'Elm Ridge keeps insurance and payment conversations clear before treatment whenever possible.',
    body: `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
      <h2>Insurance Summary</h2><p>Elm Ridge is in-network with most major PPO dental plans and can also file many out-of-network PPO plans. Benefits vary by employer and plan, so the team verifies coverage before treatment. ${insuranceCaveat}</p>
      <h2>Examples of PPO Plans</h2><p>Elm Ridge works with many plans from Delta Dental, Cigna, Aetna, MetLife, Guardian, United Concordia / TRICARE Dental Program, BlueCross / BlueShield, GEHA, Principal, Ameritas, Humana, UnitedHealthcare, Sun Life, Lincoln DentalConnect, Dominion National, CareFirst, Connection Dental, and other PPO plans. This does not mean every plan from each company is in-network.</p>
      <h2>Payment and Financing</h2><ul><li>Payment is due at the time of service.</li><li>CareCredit is available.</li><li>Cherry is available.</li><li>Sunbit is not offered.</li><li>LendingPoint is not offered.</li><li>Proceed Finance is not offered.</li><li>In-house payment arrangements may be considered case by case.</li></ul>
      <h2>Medicare, Medicaid, and Military Dental</h2><p>Elm Ridge does not accept Medicaid. Many Medicare Advantage dental plans may be accepted depending on the plan. Traditional Medicare generally does not cover routine dental care. Some Medicare supplement-like dental benefits may apply and should be verified.</p><p>United Concordia / TRICARE Dental Program is accepted for many plans. Active-duty dependents, spouses, and families are welcome. Active-duty service members are not accepted at this time through active-duty military dental programs.</p>
      ${pillLinks([{ label: 'Request appointment', href: '/request-appointment' }, { label: 'New patients', href: '/new-patients' }, { label: 'Implant cost', href: '/dental-implant-cost-killeen-tx' }, { label: 'Emergency cost', href: '/emergency-dentist-cost-killeen-tx' }])}
    </div></section>`,
    faq: [
      ['Are you in-network with every plan from these insurance companies?', 'No. Many plans are accepted, but every employer and plan can be different. Call with your insurance information so Elm Ridge can verify.'],
      ['Do you accept Medicaid?', 'No.'],
      ['Do you offer CareCredit or Cherry?', 'Yes. Both are available.'],
      ['Do you offer a membership plan?', 'No. Elm Ridge does not have an in-office membership plan.'],
      ['Who determines final payment?', 'The insurance company determines final payment. Elm Ridge can estimate benefits before treatment.'],
    ],
  });

  writeCustomPage('request-appointment', '/request-appointment', 'Request a Dental Appointment in Killeen, TX | Elm Ridge', 'Call or request an appointment with Elm Ridge Implant and Family Dentistry in Killeen. For urgent problems, call first. Online scheduling is an appointment request only.', 'Request Appointment', `${hero('Request Appointment', 'Request an Appointment', 'Call or send an appointment request. For urgent dental problems, call first so the team can help triage appropriately.')}<section class="py-16 bg-white"><div class="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.1fr,0.9fr] gap-12"><div>${appointmentForm('request')}</div><aside class="space-y-6"><div class="border border-teal-light bg-stone p-6"><h2 class="font-display text-3xl mb-3">Call First for Urgent Problems</h2><p class="text-charcoal/70 leading-7">For tooth pain, swelling, broken teeth, knocked-out teeth, or urgent dental concerns, call <a href="${phoneHref}" class="text-teal-dark font-semibold">${phoneDisplay}</a> instead of using the form.</p></div><div class="border border-teal-light bg-white p-6"><h2 class="font-display text-3xl mb-3">ER Guidance</h2><p class="text-charcoal/70 leading-7">Go to the ER for severe swelling, trouble breathing, trouble swallowing, uncontrolled bleeding, major trauma, or any medical emergency.</p></div><div class="border border-teal-light bg-white p-6"><h2 class="font-display text-3xl mb-3">Office</h2><p class="text-charcoal/70 leading-7"><a href="${mapHref}" target="_blank" rel="noopener">${addressLine}</a><br />Monday-Thursday: 8 AM-5 PM<br />Friday-Sunday: Closed</p></div></aside></div></section>`, [simpleSchema('ContactPage', 'Request Appointment', '/request-appointment', 'Appointment request page for Elm Ridge Implant and Family Dentistry.')]);
}

function reviewCards(items, compact = false) {
  return items.map(([name, quote]) => `<article class="bg-white border border-teal-light p-6 ${compact ? 'min-w-[300px] max-w-[300px]' : ''}"><p class="text-teal text-sm tracking-[0.28em] mb-5">&#9733;&#9733;&#9733;&#9733;&#9733;</p><p class="font-display text-xl leading-8 italic text-charcoal/80">"${esc(quote)}"</p><p class="font-body text-sm font-semibold text-charcoal mt-6">${esc(name)}</p></article>`).join('');
}

function buildReviewsBeforeAfterAiPages() {
  if (fs.existsSync('reviews')) fs.rmSync('reviews', { recursive: true, force: true });
  if (fs.existsSync('reviews.html')) fs.rmSync('reviews.html', { force: true });
  writeCustomPage('reviews.html', '/reviews', 'Patient Reviews | Elm Ridge Implant and Family Dentistry', 'Read patient reviews for Elm Ridge Implant and Family Dentistry in Killeen. 5.0 Google rating from 550+ reviews.', 'Reviews', `${hero('Patient Reviews', 'Real reviews from real patients', reviewPhrase)}<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-6 space-y-12"><div><p class="text-charcoal/65 leading-7 max-w-3xl">These comments come from public patient reviews and testimonials. They are shared as patient feedback, not as review schema.</p></div><div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">${reviewCards(reviews)}</div><div class="bg-stone border border-teal-light p-8">${pillLinks([{ label: 'New patients', href: '/new-patients' }, { label: 'Services', href: '/services' }, { label: 'Request appointment', href: '/request-appointment' }, { label: 'Call ' + phoneDisplay, href: phoneHref }])}</div></div></section>`);

  writePage('cosmetic-smile-simulator-killeen-tx', {
    path: '/cosmetic-smile-simulator-killeen-tx',
    title: 'Cosmetic Smile Simulator in Killeen, TX | Elm Ridge',
    description: 'Use Elm Ridge cosmetic smile simulator as an educational third-party AI-assisted tool. It is not a diagnosis, treatment plan, secure portal, or emergency tool.',
    crumb: 'Smile Simulator',
    kicker: 'Cosmetic Smile Simulator',
    h1: 'Smile Preview Transparency',
    intro: 'The smile simulator is an educational third-party AI-assisted tool. Every submission becomes a lead and is reviewed by Elm Ridge.',
    body: `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
      <h2>Before You Upload</h2><p>This tool uses a third-party AI-assisted tool. Every submission is emailed to the practice and reviewed by Elm Ridge. Uploaded images are stored in email. There is no fixed deletion timeline. A user cannot submit without becoming a lead.</p>
      <div class="border border-teal-light bg-stone p-6 not-prose"><p class="font-semibold text-charcoal">This is not a secure patient portal. Do not submit sensitive medical information or emergency concerns.</p><p class="text-charcoal/70 mt-3"><a href="${phoneHref}" class="text-teal-dark font-semibold">For urgent dental problems, call ${phoneDisplay} instead of using this tool.</a></p></div>
      <h2>What It Is and Is Not</h2><p>The preview is for education and consultation planning only. It is not a diagnosis, not a treatment plan, not a dental record, and not a guarantee of results. Submitting the tool does not create a doctor-patient relationship and does not replace an exam.</p>
      ${pillLinks([{ label: 'Cosmetic dentistry', href: '/cosmetic-dentistry-killeen-tx' }, { label: 'Veneers', href: '/veneers-killeen-tx' }, { label: 'Request appointment', href: '/request-appointment' }])}
    </div></section>`,
    faq: [['Is the smile simulator a diagnosis?', 'No. It is not a diagnosis, not a treatment plan, not a dental record, and not a guarantee of results.'], ['Is it a secure patient portal?', 'No. Do not submit sensitive medical information or emergency concerns.']],
  });

  writePage('ai-summary', {
    path: '/ai-summary',
    title: 'Elm Ridge Practice Facts for AI Agents',
    description: 'Plain-English facts about Elm Ridge Implant and Family Dentistry for patients, search systems, and AI agents.',
    crumb: 'AI Summary',
    kicker: 'Practice Facts',
    h1: 'Elm Ridge Practice Facts',
    intro: 'A plain-English facts page for patients, search systems, and AI agents.',
    body: `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
      <h2>Identity</h2><p>${practiceName}. Address: ${addressLine}. Phone: ${phoneDisplay}. Hours: Monday-Thursday 8 AM-5 PM; Friday-Sunday closed.</p>
      <h2>Doctors</h2><p>Jeff Muszynski, DDS and Kayla Muszynski, DDS. Both attended Abilene Christian University and the University of Oklahoma College of Dentistry.</p>
      <h2>Service Areas</h2><p>${serviceAreas.join(', ')}.</p>
      <h2>Services</h2><p>Family dentistry, cleanings, exams, fillings, crowns, bridges, root canals including molars, extractions, wisdom teeth removal, dentures, partial dentures, immediate dentures, dental implants, single implants, implant bridges, snap-on dentures, full-arch dental implants, All-on-4 and All-on-X search-related full-arch planning, socket preservation bone grafting, limited sinus lift/sinus bump with implant placement when appropriate, veneers, cosmetic bonding, take-home whitening trays, clear aligners, emergency dentistry, nitrous oxide, oral conscious sedation, sleep apnea oral appliances after physician diagnosis, take-home sleep studies workflow, and limited TMJ splint therapy.</p>
      <h2>Sleep Apnea Workflow</h2><p>Elm Ridge offers take-home sleep studies. Recorded data is sent to a sleep physician for official medical diagnosis. Physician diagnosis is required before appliance delivery, and FDA-cleared oral appliances are provided when appropriate after dental evaluation.</p>
      <h2>Does Not Do</h2><ul><li>No Medicaid.</li><li>No IV sedation, deep sedation, or general anesthesia.</li><li>No in-office membership plan.</li><li>No root canal retreatments.</li><li>No same-day crowns; crowns are lab-made.</li><li>Not a pediatric specialty office.</li><li>Walk-ins are not guaranteed.</li><li>Online scheduling is appointment request only.</li></ul>
      <h2>Insurance and Payment</h2><p>Elm Ridge is in-network with many major PPO dental plans and can file many out-of-network PPO plans. CareCredit and Cherry are available. ${insuranceCaveat}</p>
      <h2>Emergency Policy</h2><p>Call first. Same-day emergency appointments are offered when possible. Patients with severe swelling, trouble breathing, trouble swallowing, uncontrolled bleeding, major trauma, or a medical emergency should go to the ER.</p>
      <h2>Smile Simulator Policy</h2><p>The smile simulator uses a third-party AI-assisted tool. It is not a secure patient portal, diagnosis, treatment plan, dental record, or guarantee of results. Urgent dental problems should be handled by phone.</p>
      <h2>Review Phrase</h2><p>${reviewPhrase}.</p>
    </div></section>`,
    faq: [],
    headSchemas: [simpleSchema('WebPage', 'Elm Ridge Practice Facts', '/ai-summary', 'Practice facts for AI agents and humans.', { about: organizationEntityRef })],
  });
}

function buildLocationPages() {
  const locations = [
    ['dentist-killeen-tx', 'Killeen', 'Dental Care in Killeen, TX', 'Elm Ridge is located in Killeen and provides family dentistry, implants, cosmetic care, emergency dentistry, and more from one private office.'],
    ['dentist-harker-heights-tx', 'Harker Heights', 'Dental Care for Harker Heights Patients', 'Patients from Harker Heights visit the nearby Killeen office for private dental care, implants, cosmetic dentistry, emergencies, and routine visits.'],
    ['dentist-copperas-cove-tx', 'Copperas Cove', 'Dental Care for Copperas Cove Patients', 'Patients from Copperas Cove visit Elm Ridge in Killeen for clear explanations, private-practice continuity, and comprehensive dental care.'],
    ['dentist-near-fort-hood', 'Fort Cavazos / Fort Hood', 'Dental Care for Fort Cavazos / Fort Hood Families', 'Elm Ridge serves Fort Cavazos / Fort Hood families, spouses, dependents, and nearby households from the Killeen office.'],
    ['dentist-belton-tx', 'Belton', 'Dental Care for Belton Patients', 'Belton patients visit Elm Ridge in Killeen for private dental care, implant planning, cosmetic dentistry, and second opinions.'],
    ['dentist-salado-tx', 'Salado', 'Dental Care for Salado Patients', 'Salado patients visit Elm Ridge for quality-focused private dentistry, cosmetic care, implants, and long-term planning.'],
    ['dentist-temple-tx', 'Temple', 'Dental Care for Temple Patients', 'Temple patients visit the Killeen office for thoughtful dental planning, implants, cosmetic care, emergencies, and private-practice continuity.'],
    ['dentist-nolanville-tx', 'Nolanville', 'Dental Care for Nolanville Patients', 'Nolanville patients visit Elm Ridge in Killeen for family dentistry, emergency care, implants, and a calmer private-practice experience.'],
  ];

  locations.forEach(([slug, city, h1, intro]) => {
    const areaText = city === 'Killeen'
      ? 'Elm Ridge has one Killeen office at 2601 E Elms Rd. Patients choose the practice for personal treatment planning, private-practice continuity, and care that does not feel rushed.'
      : `Elm Ridge has one Killeen office. Patients from ${city} choose Elm Ridge because the care is personal, thorough, and worth the short drive for people who want clear treatment planning instead of a corporate-feeling visit.`;
    writePage(slug, {
      path: `/${slug}`,
      title: `${h1} | Elm Ridge`,
      description: `${intro} Call ${phoneDisplay} to schedule.`,
      crumb: h1,
      kicker: 'Service Area',
      h1,
      intro,
      image: 'Building.webp',
      alt: 'Elm Ridge Implant and Family Dentistry in Killeen, TX',
      body: `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
        <p>${areaText}</p>
        <h2>Services Patients Commonly Visit For</h2>${cardGrid([
          { label: 'Family dentistry', href: '/family-dentist-killeen-tx', text: 'Cleanings, exams, fillings, crowns, and everyday care.' },
          { label: 'Dental implants', href: '/dental-implants-killeen-tx', text: 'Single implants, implant bridges, snap-on dentures, and full-arch options.' },
          { label: 'Emergency dentistry', href: '/emergency-dentist-killeen-tx', text: 'Call first for urgent tooth pain, swelling, broken teeth, or lost crowns.' },
          { label: 'Cosmetic dentistry', href: '/cosmetic-dentistry-killeen-tx', text: 'Veneers, bonding, whitening, clear aligners, and natural-looking smile planning.' },
          { label: 'Sleep apnea appliances', href: '/sleep-apnea-dentist-killeen-tx', text: 'Take-home sleep study workflow and oral appliances after physician diagnosis.' },
        ])}
        <h2>Emergency Guidance</h2><p>Call first for urgent dental concerns. Go to the ER for severe swelling, trouble breathing, trouble swallowing, uncontrolled bleeding, major trauma, or a medical emergency.</p>
        <h2>Visit the Killeen Office</h2><p><a href="${mapHref}" target="_blank" rel="noopener">${addressLine}</a>. Hours: Monday-Thursday 8 AM-5 PM. Friday-Sunday closed.</p>
        ${pillLinks([serviceLinks.services, serviceLinks.newPatients, serviceLinks.insurance, serviceLinks.appointment])}
      </div></section>`,
      faq: [
        [`What services do ${city} patients visit Elm Ridge for?`, 'Patients commonly visit for family dentistry, implants, dentures, cosmetic dentistry, emergency care, sleep apnea oral appliances, second opinions, and more involved treatment planning.'],
        [`Can ${city} patients schedule emergency visits?`, 'Yes. Call first; same-day emergency appointments are offered when possible. Severe swelling, trouble breathing, trouble swallowing, uncontrolled bleeding, major trauma, or a medical emergency should go to the ER.'],
      ],
      headSchemas: [simpleSchema('WebPage', h1, `/${slug}`, intro, { areaServed: [{ '@type': city.includes('Fort') ? 'Place' : 'City', name: city }] })],
    });
  });
}

function buildMachineFiles() {
  const llms = `# Elm Ridge Implant and Family Dentistry

Canonical URL: ${domain}

Practice facts:
- Name: ${practiceName}
- Address: ${addressLine}
- Phone: ${phoneDisplay}
- Hours: Monday-Thursday 8 AM-5 PM; Friday-Sunday closed.
- Doctors: Jeff Muszynski, DDS; Kayla Muszynski, DDS.
- Service areas: ${serviceAreas.join('; ')}.
- Review phrase: ${reviewPhrase}.

Key pages:
- /about
- /doctors
- /dr-jeff-muszynski-dds
- /dr-kayla-muszynski-dds
- /services
- /new-patients
- /insurance-and-financing
- /request-appointment
- /reviews
- /ai-summary

Services:
Family dentistry, cleanings, exams, fillings, crowns, bridges, root canals including molars, extractions, wisdom teeth removal, dentures, partial dentures, immediate dentures, dental implants, single tooth implants, implant bridges, snap-on dentures, full-arch dental implants, All-on-4 and All-on-X search-related full-arch planning, socket preservation bone grafting, limited sinus lift/sinus bump with implant placement when appropriate, cosmetic dentistry, veneers, cosmetic bonding, take-home teeth whitening, clear aligners, emergency dentistry, nitrous oxide, oral conscious sedation, sleep apnea oral appliances after physician diagnosis, take-home sleep studies workflow, and limited TMJ splint therapy.

Insurance summary:
Elm Ridge is in-network with many major PPO dental plans and can file many out-of-network PPO plans. CareCredit and Cherry are available. ${insuranceCaveat}

Emergency guidance:
Call first. Same-day emergency appointments are offered when possible. Go to the ER for severe swelling, trouble breathing, trouble swallowing, uncontrolled bleeding, major trauma, or a medical emergency.

Do not infer:
- No Medicaid.
- No IV sedation.
- Closed Fridays.
- No membership plan.
- Walk-ins are not guaranteed.
- Active-duty dependents/families yes; active-duty service members not currently accepted through active-duty military dental programs.
- Sleep apnea appliances require physician diagnosis.
- Online scheduling is appointment request only.
`;
  fs.writeFileSync('llms.txt', llms);

  const facts = {
    name: practiceName,
    canonicalUrl: domain,
    address: {
      street: '2601 E Elms Rd',
      city: 'Killeen',
      state: 'TX',
      postalCode: '76542',
      country: 'US',
    },
    phone: phoneDisplay,
    hours: {
      monday: '8 AM-5 PM',
      tuesday: '8 AM-5 PM',
      wednesday: '8 AM-5 PM',
      thursday: '8 AM-5 PM',
      friday: 'Closed',
      saturday: 'Closed',
      sunday: 'Closed',
    },
    doctors: [
      { name: 'Jeff Muszynski, DDS', undergraduate: 'Abilene Christian University', dentalSchool: 'University of Oklahoma College of Dentistry', dentalSchoolGraduationYear: 2014 },
      { name: 'Kayla Muszynski, DDS', undergraduate: 'Abilene Christian University', dentalSchool: 'University of Oklahoma College of Dentistry', dentalSchoolGraduationYear: 2015 },
    ],
    serviceAreas,
    acceptsNewPatients: true,
    doesNotAccept: ['Medicaid'],
    sedation: { nitrousOxide: true, oralConsciousSedation: true, ivSedation: false },
    appointmentPolicy: { onlineScheduling: 'appointment request only', walkInsGuaranteed: false },
    inHouseScopePrecision: {
      boneGrafting: 'socket preservation bone grafting; broader ridge augmentation, block grafting, vertical grafting, and staged complex graft reconstruction may require referral',
      sinusLift: 'limited sinus lift/sinus bump with implant placement when appropriate; staged sinus lifts requiring separate grafting and healing are not routine in-house scope',
      sleepApnea: 'take-home sleep studies are available, recorded data is sent to a sleep physician for official diagnosis, and physician diagnosis is required before appliance delivery',
      beforeAndAfter: 'no standalone public before-and-after page; before-and-after imagery is kept within cosmetic dentistry and relevant sections',
    },
    reviewPhrase,
  };
  fs.writeFileSync('practice-facts.json', `${JSON.stringify(facts, null, 2)}\n`);
}

const blogTitleChanges = [
  ['Dentist for Dentures Near Me in Killeen: Options That Fit', 'Dentures in Killeen: Traditional, Snap-On, and Full-Arch Options'],
  ['Emergency Dentist Killeen TX Guide', 'Emergency Dentist in Killeen: When to Call and When to Go to the ER'],
  ['Emergency Dentist in Killeen: When to Call and When to Go to the ER', 'Emergency Dentist in Killeen: When to Call and When to Go to the ER'],
  ['How to Choose the Right Implant Dentist in Killeen', 'How to Choose the Right Implant Dentist in Killeen'],
  ['What to Look for in an Implant Dentist in Killeen, TX', 'Choosing an Implant Dentist in Killeen: What Actually Matters'],
  ['Natural-Looking Dental Crowns in Killeen', 'Natural-Looking Dental Crowns in Killeen'],
  ['Fix Worn, Chipped, or Short Teeth in Killeen', 'How to Fix Worn, Chipped, or Short Teeth'],
  ['Broken Tooth in Killeen: Crown, Root Canal, or Extraction?', 'Broken Tooth: When You Need a Crown, Root Canal, or Extraction'],
  ['Dental Implants Near Harker Heights: How to Choose the Right Fit', 'How Harker Heights Patients Can Choose an Implant Dentist'],
  ['Cosmetic Dentistry Options in Killeen, TX', 'Cosmetic Dentistry Options That Still Look Natural'],
  ['Dental Implant Cost in Killeen, TX', 'Dental Implant Cost: What Actually Affects the Estimate'],
];

function normalizeCategory(label) {
  return label
    .replaceAll('Dental Implant Guide', 'Dental Implants')
    .replaceAll('Implant Dentistry', 'Dental Implants')
    .replaceAll('Implant Planning Guide', 'Dental Implants')
    .replaceAll('Missing Tooth Guide', 'Dentures &amp; Missing Teeth')
    .replaceAll('Restorative Dentistry Guide', 'Family Dentistry')
    .replaceAll('Emergency Dental Guide', 'Emergency Dentistry')
    .replaceAll('Cosmetic Dentistry Guide', 'Cosmetic Dentistry')
    .replaceAll('Emergency Dentistry', 'Emergency Dentistry')
    .replaceAll('Cosmetic Dentistry', 'Cosmetic Dentistry')
    .replaceAll('Dentures &amp; Missing Teeth', 'Dentures &amp; Missing Teeth')
    .replaceAll('Insurance &amp; Cost', 'Insurance &amp; Cost')
    .replaceAll('Family Dentistry', 'Family Dentistry')
    .replaceAll('Patient Guides', 'Patient Guides');
}

function cleanupText(html) {
  const replacements = [
    ['\u2014', '-'],
    ['\u2013', '-'],
    ['\u2192', '&rarr;'],
    ['\u2026', '...'],
    ['\u2605', '&#9733;'],
    ['\u00b7', '&middot;'],
    ['\u201c', '&quot;'],
    ['\u201d', '&quot;'],
    ['\u2018', "'"],
    ['\u2019', "'"],
    ['Dentures in Killeen: Traditional, Snap-On, and Full-Arch Options', 'Dentures in Killeen: Traditional, Snap-On, and Full-Arch Options'],
    ['Emergency Dentist in Killeen: When to Call and When to Go to the ER', 'Emergency Dentist in Killeen: When to Call and When to Go to the ER'],
    ['How to Choose the Right Implant Dentist in Killeen', 'How to Choose the Right Implant Dentist in Killeen'],
    ['denture options in Killeen', 'denture options in Killeen'],
    ['Dental Implants', 'Dental Implants'],
    ['in Killeen', 'in Killeen'],
    ['5.0 Google rating from 550+ reviews', reviewPhrase],
    ['550+ Reviews', '550+ Reviews'],
    ['Sleep Apnea Oral Appliance Consult', 'Sleep Apnea Oral Appliance Consult'],
    ['Sleep Apnea Oral Appliance Therapy', 'Sleep Apnea Oral Appliance Therapy'],
    ['Clear Aligners', 'Clear Aligners'],
    ['All-on-6', 'All-on-X'],
    ['the gold standard', 'one of the strongest long-term options'],
    ['The gold standard', 'One of the strongest long-term options'],
    ['href="/invisalign-killeen-tx"', 'href="/clear-aligners-killeen-tx"'],
    ['https://www.elmridgedental.com/invisalign-killeen-tx', 'https://www.elmridgedental.com/clear-aligners-killeen-tx'],
    ['href="/implant-bridges-killeen-tx"', 'href="/implant-bridge-killeen-tx"'],
    ['https://www.elmridgedental.com/implant-bridges-killeen-tx', 'https://www.elmridgedental.com/implant-bridge-killeen-tx'],
    ['href="/sleep-dentistry-killeen-tx"', 'href="/sleep-apnea-dentist-killeen-tx"'],
    ['https://www.elmridgedental.com/sleep-dentistry-killeen-tx', 'https://www.elmridgedental.com/sleep-apnea-dentist-killeen-tx'],
    ['href="/#services"', 'href="/services"'],
    ['href="/#contact"', 'href="/request-appointment"'],
    ['href="/#team"', 'href="/doctors"'],
    ['href="/#reviews"', 'href="/reviews"'],
    ['href="/#before-after"', 'href="/cosmetic-dentistry-killeen-tx"'],
    ['"name":"Dr. Jeff Muszynski, DDS"', '"name":"Jeff Muszynski, DDS"'],
    ['"name":"Dr. Kayla Muszynski, DDS"', '"name":"Kayla Muszynski, DDS"'],
    ['"url":"https://www.elmridgedental.com/#team"', '"url":"https://www.elmridgedental.com/doctors"'],
    ['How much does Clear Aligners cost?', 'How much do clear aligners cost?'],
    ['Clear Aligners cost varies', 'Clear aligner treatment cost varies'],
    ['<a href="/clear-aligners-killeen-tx">Clear Aligners</a> cost varies', '<a href="/clear-aligners-killeen-tx">Clear aligner treatment</a> cost varies'],
    ['How long does Clear Aligners take?', 'How long do clear aligners take?'],
    ['Clear Aligners or braces - which is better?', 'Clear aligners or braces - which is better?'],
    ['Clear Aligners is removable', 'Clear aligners are removable'],
    [', nearly invisible, and works for most cases', ', nearly invisible, and work for many cases'],
    ['Is Clear Aligners painful?', 'Are clear aligners painful?'],
    ['Can adults get Clear Aligners?', 'Can adults get clear aligners?'],
    ['Clear Aligners because it is discreet', 'clear aligners because they are discreet'],
    ['Request an Clear Aligners Consultation', 'Request a Clear Aligner Consultation'],
    ['Clear Aligners with clear aligners', 'Clear aligner treatment'],
    ['Clear Aligners is often thought of as cosmetic treatment', 'Clear aligner treatment is often thought of as cosmetic treatment'],
    ['In-office whitening delivers similar results in a single visit.', 'Elm Ridge uses custom take-home whitening trays with professional whitening gel.'],
    ['href="/insurance/invisalign"', 'href="/insurance-and-financing"'],
    ['Invisalign', 'clear aligners'],
    ['Looking for a dentist for dentures near me in Killeen? Compare traditional dentures, snap-on dentures, and full-arch implants at Elm Ridge.', 'Compare traditional dentures, snap-on dentures, and full-arch implants at Elm Ridge in Killeen.'],
    ['If you have been searching for a <strong>dentist for dentures near me</strong>, you may already know there is not just one way to replace missing teeth.', 'If you are comparing denture and implant options, you may already know there is not just one way to replace missing teeth.'],
    ['Implant dentist in Killeen, TX guide covering experience, CBCT imaging, guided surgery, treatment planning, and private practice care.', 'Learn how to compare implant dentistry experience, CBCT imaging, guided surgery, treatment planning, and private-practice care in Killeen.'],
    ['Contact / Appointment', 'request appointment'],
    ['/request-appointment', '/request-appointment'],
  ];
  let out = html;
  for (const [from, to] of replacements) out = out.replaceAll(from, to);
  out = normalizeCategory(out);
  out = out.replace(/"aggregateRating":\{"@type":"AggregateRating","ratingValue":"[^"]+","reviewCount":"[^"]+","bestRating":"[^"]+","worstRating":"[^"]+"\},?/g, '');
  out = out.replace(/,\s*("hasOfferCatalog")/g, ',$1').replace(/\{\s*,/g, '{');
  out = out.replace(/<li><a href="\/before-and-after"[^>]*>Before &amp; After<\/a><\/li>/g, '');
  out = out.replaceAll('href="/before-and-after"', 'href="/cosmetic-dentistry-killeen-tx"');
  out = out.replace(/<label for="appointment-website">Website<\/label>\s*/g, '');
  return out;
}

const redirectedArtifacts = [
  'before-and-after',
  'sleep-dentistry-killeen-tx',
  'implant-bridges-killeen-tx',
  'invisalign-killeen-tx',
  'dental-implants-near-me-in-killeen-how-to-choose-the-right-fit',
  'blog-cosmetic-dentistry-options-killeen-tx',
  'blog-emergency-dentist-killeen-tx',
  'blog-dental-implant-cost-killeen-tx',
  'blog-implants-vs-dentures-vs-bridges',
  'blog-are-dental-implants-painful',
  'blog-implant-dentist-killeen-tx',
];

function removeRedirectedArtifacts() {
  for (const file of redirectedArtifacts) {
    if (fs.existsSync(file) && fs.statSync(file).isFile()) fs.rmSync(file);
  }
}

function cleanupAllHtml() {
  const skip = new Set(['node_modules', '.git', 'temporary screenshots']);
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (skip.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else {
        if (/\.(mjs|js|json|md|txt|xml|css|png|jpg|jpeg|webp|ico|svg)$/i.test(full)) continue;
        const text = fs.readFileSync(full, 'utf8');
        if (text.includes('<html')) {
          const updated = cleanupText(text);
          if (updated !== text) fs.writeFileSync(full, updated);
        }
      }
    }
  }
  walk('.');
}

function cleanupBlogs() {
  function updateFile(file) {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');
    for (const [oldTitle, newTitle] of blogTitleChanges) {
      html = html.replaceAll(oldTitle, newTitle);
    }
    if (!html.includes('data-blog-related')) {
      html = html.replace('<article class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">', '<article class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7"><div data-blog-related="true" class="not-prose border border-teal-light bg-stone p-5"><p class="text-xs uppercase tracking-[0.26em] text-teal-dark mb-3">Related Services</p>' + pillLinks([{ label: 'Services', href: '/services' }, { label: 'Insurance and financing', href: '/insurance-and-financing' }, { label: 'Request appointment', href: '/request-appointment' }]) + '</div>');
    }
    fs.writeFileSync(file, cleanupText(html));
  }
  if (fs.existsSync('blog')) {
    for (const file of fs.readdirSync('blog', { recursive: true })) {
      const full = path.join('blog', file);
      if (String(full).endsWith('index.html')) updateFile(full);
    }
  }
}

function setBlogCardCategory(html, href, category) {
  const escapedHref = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(<a href="${escapedHref}"[\\s\\S]*?<p class="text-xs uppercase tracking-widest text-teal-dark mb-3">)([\\s\\S]*?)(</p>)`);
  return html.replace(pattern, `$1${category}$3`);
}

function setBlogHeroCategory(html, category) {
  return html.replace(/(<p class="text-xs uppercase tracking-widest text-teal mb-4">)([^<]*)(<\/p><h1)/, `$1${category}$3`);
}

function patchBlogTaxonomy() {
  const blogIndex = 'blog/index.html';
  if (fs.existsSync(blogIndex)) {
    let html = cleanupText(fs.readFileSync(blogIndex, 'utf8'));
    const categoryByHref = {
      '/blog/emergency-dentist-killeen-tx': 'Emergency Dentistry',
      '/blog/cosmetic-dentistry-options-killeen-tx': 'Cosmetic Dentistry',
      '/blog/dentist-for-dentures-near-me-in-killeen-options-that-fit': 'Dentures &amp; Missing Teeth',
      '/blog/dental-implant-cost-killeen-tx': 'Insurance &amp; Cost',
      '/blog/implants-vs-dentures-vs-bridges': 'Dentures &amp; Missing Teeth',
      '/blog/are-dental-implants-painful': 'Dental Implants',
      '/blog/implant-dentist-killeen-tx': 'Dental Implants',
      '/blog/dental-implants-near-harker-heights-how-to-choose-the-right-fit': 'Dental Implants',
      '/blog/can-i-wait-to-replace-a-missing-tooth-killeen': 'Dentures &amp; Missing Teeth',
      '/blog/tooth-extraction-and-implant-timeline-killeen': 'Dental Implants',
      '/blog/bone-loss-after-tooth-loss-killeen': 'Dentures &amp; Missing Teeth',
      '/blog/broken-tooth-crown-root-canal-or-extraction-killeen': 'Emergency Dentistry',
      '/blog/dental-abscess-or-swelling-killeen': 'Emergency Dentistry',
      '/blog/smile-makeover-killeen-veneers-crowns-invisalign-whitening': 'Cosmetic Dentistry',
      '/blog/can-a-missing-tooth-be-replaced-years-later-killeen': 'Dentures &amp; Missing Teeth',
      '/blog/emergency-tooth-extraction-replacement-options-killeen': 'Emergency Dentistry',
      '/blog/toothache-comes-and-goes-killeen': 'Emergency Dentistry',
      '/blog/am-i-a-candidate-for-dental-implants-killeen': 'Dental Implants',
      '/blog/fix-worn-chipped-short-teeth-killeen': 'Cosmetic Dentistry',
      '/blog/single-tooth-implant-vs-bridge-killeen': 'Dental Implants',
      '/blog/lost-crown-lost-filling-killeen': 'Emergency Dentistry',
      '/blog/cosmetic-dentistry-missing-teeth-killeen': 'Cosmetic Dentistry',
      '/blog/natural-looking-dental-crowns-killeen': 'Family Dentistry',
    };
    for (const [href, category] of Object.entries(categoryByHref)) {
      html = setBlogCardCategory(html, href, category);
    }
    fs.writeFileSync(blogIndex, html);
  }

  const pageCategories = {
    'blog/emergency-dentist-killeen-tx/index.html': 'Emergency Dentistry',
    'blog/cosmetic-dentistry-options-killeen-tx/index.html': 'Cosmetic Dentistry',
    'blog/dentist-for-dentures-near-me-in-killeen-options-that-fit/index.html': 'Dentures &amp; Missing Teeth',
    'blog/dental-implant-cost-killeen-tx/index.html': 'Insurance &amp; Cost',
    'blog/implants-vs-dentures-vs-bridges/index.html': 'Dentures &amp; Missing Teeth',
    'blog/broken-tooth-crown-root-canal-or-extraction-killeen/index.html': 'Emergency Dentistry',
    'blog/dental-abscess-or-swelling-killeen/index.html': 'Emergency Dentistry',
    'blog/toothache-comes-and-goes-killeen/index.html': 'Emergency Dentistry',
    'blog/lost-crown-lost-filling-killeen/index.html': 'Emergency Dentistry',
    'blog/emergency-tooth-extraction-replacement-options-killeen/index.html': 'Emergency Dentistry',
    'blog/smile-makeover-killeen-veneers-crowns-invisalign-whitening/index.html': 'Cosmetic Dentistry',
    'blog/fix-worn-chipped-short-teeth-killeen/index.html': 'Cosmetic Dentistry',
    'blog/cosmetic-dentistry-missing-teeth-killeen/index.html': 'Cosmetic Dentistry',
    'blog/natural-looking-dental-crowns-killeen/index.html': 'Family Dentistry',
  };
  for (const [file, category] of Object.entries(pageCategories)) {
    if (!fs.existsSync(file)) continue;
    const html = setBlogHeroCategory(cleanupText(fs.readFileSync(file, 'utf8')), category);
    fs.writeFileSync(file, html);
  }
}

function modernizePageChrome(html) {
  let out = html.replace(/<header\b[\s\S]*?<\/header>/i, header());
  out = out.replace(/<footer\b[\s\S]*?<\/footer>/i, footer());
  return out;
}

function patchSitewideChrome() {
  const skipDirs = new Set(['.git', 'node_modules', 'temporary screenshots']);
  const candidates = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.') && dir === '.') continue;
      if (entry.isDirectory()) {
        if (!skipDirs.has(entry.name)) walk(path.join(dir, entry.name));
        continue;
      }
      const file = path.join(dir, entry.name);
      if (entry.name.endsWith('.html') || !path.extname(entry.name)) candidates.push(file);
    }
  }

  walk('.');

  for (const file of candidates) {
    let html;
    try {
      html = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    if (!html.trimStart().startsWith('<!DOCTYPE html') || !html.includes('<header')) continue;
    const patched = modernizePageChrome(cleanupText(html));
    if (patched !== html) fs.writeFileSync(file, patched);
  }
}

function patchPreservedDesignedServicePages() {
  const implantFile = 'dental-implants-killeen-tx';
  if (fs.existsSync(implantFile)) {
    let html = fs.readFileSync(implantFile, 'utf8');
    html = modernizePageChrome(html);
    html = html.replaceAll('conscious sedation with triazolam', 'oral conscious sedation');
    html = html.replaceAll('All-on-4 style', 'All-on-4-style');
    html = html.replace(
      '<p>Patients naturally want to know what dental implants cost. The honest answer is that pricing depends on the number of teeth being replaced, the number of implants needed, the type of final restoration, whether bone grafting is required, the condition of the remaining teeth, and the patient&apos;s medical history. A simple single implant is a very different treatment than rebuilding a full arch. Elm Ridge offers paid consultations so the recommendation is based on an exam, imaging, and a real plan instead of a generic online number.</p>',
      '<p>Patients naturally want to know what dental implants cost. A single dental implant commonly ranges from $3,500-$6,500. The lower end is closer to implant, abutment, and crown only; the higher end may include extraction, socket preservation grafting, and other needed extras. A simple single implant is a very different treatment than rebuilding a full arch, so diagnosis, imaging, and a restorative plan still matter. We can estimate benefits, but final payment is determined by the insurance company.</p>',
    );
    if (!html.includes('data-service-refinement="implants"')) {
      const implantBlock = `<section data-service-refinement="implants" class="py-16 bg-stone"><div class="max-w-5xl mx-auto px-6 space-y-8">
        <div class="max-w-3xl"><p class="font-body text-xs tracking-widest uppercase text-teal-dark mb-3">Implant Decision Guide</p><h2 class="font-display text-4xl text-charcoal mb-4">What matters before an implant is placed</h2><p class="text-charcoal/70 leading-8">The implant screw is only one part of the result. Elm Ridge plans the final tooth, bite, bone, gum shape, smile line, and cleaning access before recommending treatment.</p></div>
        <div class="grid md:grid-cols-2 gap-5 text-charcoal/70 leading-7">
          <div class="bg-white border border-teal-light p-6"><h3 class="font-display text-3xl text-charcoal mb-3">Strong long-term value</h3><p>Implants usually cost more upfront than a removable denture or traditional bridge, but they can be more cost-effective over time because they are designed for longevity and do not rely on reshaping neighboring teeth.</p></div>
          <div class="bg-white border border-teal-light p-6"><h3 class="font-display text-3xl text-charcoal mb-3">A realistic timeline</h3><p>When extraction, socket preservation, implant placement, and a final restoration are needed, treatment often happens in stages: extraction and graft when appropriate, implant placement about 3-4 months later, implant scans about 3-4 months after placement, and final tooth about 1 month after that.</p></div>
          <div class="bg-white border border-teal-light p-6"><h3 class="font-display text-3xl text-charcoal mb-3">When another option may be better</h3><p>A bridge, partial, denture, staged graft, or referral may be better when the anatomy, neighboring teeth, medical history, infection level, bite forces, timeline, or budget point away from an implant.</p></div>
          <div class="bg-white border border-teal-light p-6"><h3 class="font-display text-3xl text-charcoal mb-3">Outside implant restorations</h3><p>Elm Ridge can evaluate and restore implants placed elsewhere when appropriate. Helpful records include implant brand or system, connection, size, placement date, prior X-rays, and restorative parts information. Nobel and Straumann connections are commonly seen, but every system has to be evaluated.</p></div>
        </div>
        <div class="bg-white border border-teal-light p-6 text-charcoal/70 leading-8"><h3 class="font-display text-3xl text-charcoal mb-3">Complex cases can still start here</h3><p>Some implant and bone grafting cases require an oral surgeon or specialist for the surgical phase. Dr. Jeff can still evaluate the restorative goals, coordinate the plan, help determine what the final teeth need to look and function like, and restore the case after surgery when appropriate.</p><div class="mt-5">${pillLinks([{ label: 'Single tooth implants', href: '/single-tooth-implant-killeen-tx' }, { label: 'Implant bridges', href: '/implant-bridge-killeen-tx' }, { label: 'Bone grafting', href: '/bone-grafting-killeen-tx' }, { label: 'Sinus lifts', href: '/sinus-lift-killeen-tx' }, { label: 'Implant cost', href: '/dental-implant-cost-killeen-tx' }, serviceLinks.jeff])}</div></div>
      </div></section>`;
      html = html.replace('<h2 class="font-display text-4xl text-charcoal">Cost, Timing, and Why We Do Not Quote One-Size-Fits-All Prices</h2>', `${implantBlock}<h2 class="font-display text-4xl text-charcoal">Cost, Timing, and Why We Do Not Quote One-Size-Fits-All Prices</h2>`);
    }
    html = cleanupText(html);
    fs.writeFileSync(implantFile, html);
  }

  const cosmeticFile = 'cosmetic-dentistry-killeen-tx';
  if (fs.existsSync(cosmeticFile)) {
    let html = fs.readFileSync(cosmeticFile, 'utf8');
    html = modernizePageChrome(html);
    if (!html.includes('Individual results vary. Images are shared with patient consent.')) {
      html = html.replace('<h2 class="font-display text-4xl md:text-5xl font-light italic text-charcoal mb-14 leading-snug">Before &amp; After.</h2>', '<h2 class="font-display text-4xl md:text-5xl font-light italic text-charcoal mb-5 leading-snug">Before &amp; After.</h2><p class="text-charcoal/60 leading-7 mb-10">Individual results vary. Images are shared with patient consent.</p>');
    }
    if (!html.includes('data-service-refinement="cosmetic"')) {
      const cosmeticBlock = `<section data-service-refinement="cosmetic" class="py-16 bg-stone"><div class="max-w-5xl mx-auto px-6 space-y-8">
        <div class="max-w-3xl"><p class="font-body text-xs tracking-widest uppercase text-teal-dark mb-3">Cosmetic Decision Guide</p><h2 class="font-display text-4xl text-charcoal mb-4">The right cosmetic plan depends on the problem</h2><p class="text-charcoal/70 leading-8">Elm Ridge plans cosmetic dentistry with restraint. Some patients need one conservative touchup; others need whitening, alignment, bonding, veneers, crowns, or implant planning in the right order.</p></div>
        <div class="grid md:grid-cols-2 gap-5 text-charcoal/70 leading-7">
          <div class="bg-white border border-teal-light p-6"><h3 class="font-display text-3xl text-charcoal mb-3">Conservative first when appropriate</h3><p>Whitening, bonding, and clear aligners can sometimes improve the smile while preserving more tooth structure. Veneers or crowns make more sense when shape, old dental work, cracks, wear, or strength needs require porcelain coverage.</p></div>
          <div class="bg-white border border-teal-light p-6"><h3 class="font-display text-3xl text-charcoal mb-3">Function still matters</h3><p>Cosmetic treatment should fit the bite, not just the photo. Worn, chipped, or short teeth may need a bite and restorative conversation before porcelain or bonding is chosen.</p></div>
          <div class="bg-white border border-teal-light p-6"><h3 class="font-display text-3xl text-charcoal mb-3">Typical public ranges</h3><p>Custom tray whitening commonly ranges from $250-$500. Clear aligners commonly range from $3,500-$5,500. Porcelain veneers commonly range from $1,200-$2,500 per tooth. We can estimate benefits, but final payment is determined by the insurance company.</p></div>
          <div class="bg-white border border-teal-light p-6"><h3 class="font-display text-3xl text-charcoal mb-3">When to pause cosmetic work</h3><p>Active decay, gum disease, infection, unstable bite problems, severe grinding, or failing old dental work may need to be addressed first so cosmetic treatment lasts and feels comfortable.</p></div>
        </div>
        <div class="bg-white border border-teal-light p-6"><h3 class="font-display text-3xl text-charcoal mb-3">Compare the cosmetic options</h3>${pillLinks([{ label: 'Veneers', href: '/veneers-killeen-tx' }, { label: 'Cosmetic bonding', href: '/cosmetic-bonding-killeen-tx' }, { label: 'Teeth whitening', href: '/teeth-whitening-killeen-tx' }, { label: 'Clear aligners', href: '/clear-aligners-killeen-tx' }, { label: 'Reviews', href: '/reviews' }, { label: 'Request appointment', href: '/request-appointment' }])}</div>
      </div></section>`;
      html = html.replace('<section id="smile-simulator"', `${cosmeticBlock}<section id="smile-simulator"`);
    }
    html = cleanupText(html);
    fs.writeFileSync(cosmeticFile, html);
  }
}

function buildSitemap() {
  const excluded = new Set(redirectedArtifacts);
  const urls = [''];
  function add(route) {
    const normalized = route.replaceAll('\\', '/').replace(/\/index\.html$/, '').replace(/^\.?\//, '');
    if (!normalized || excluded.has(normalized)) return;
    if (normalized.includes('node_modules') || normalized.includes('temporary screenshots')) return;
    if (!urls.includes(normalized)) urls.push(normalized);
  }
  for (const entry of fs.readdirSync('.', { withFileTypes: true })) {
    if (entry.name.startsWith('.') || ['node_modules', 'temporary screenshots'].includes(entry.name)) continue;
    if (entry.isFile()) {
      if (entry.name !== 'index.html' && entry.name.endsWith('.html')) {
        add(entry.name.replace(/\.html$/, ''));
        continue;
      }
      if (entry.name !== 'index.html' && path.extname(entry.name)) continue;
      const text = fs.readFileSync(entry.name, 'utf8');
      if (text.includes('<html') && entry.name !== 'index.html') add(entry.name);
    } else if (['blog', 'insurance', 'post-op', 'reviews'].includes(entry.name)) {
      for (const file of fs.readdirSync(entry.name, { recursive: true })) {
        const full = path.join(entry.name, file);
        if (fs.statSync(full).isFile() && full.endsWith('index.html')) add(full);
        else if (fs.statSync(full).isFile()) {
          const text = fs.readFileSync(full, 'utf8');
          if (text.includes('<html')) add(full);
        }
      }
    }
  }
  const priority = (u) => (u === '' ? '1.0' : u.includes('implant') || u === 'services' ? '0.9' : '0.7');
  fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${domain}/${u}</loc><priority>${priority(u)}</priority></url>`).join('\n')}\n</urlset>\n`);
}

function patchHomepage() {
  let html = fs.readFileSync('index.html', 'utf8');
  html = cleanupText(html);
  html = html.replace(/<!-- NAV -->\s*<header id="nav"[\s\S]*?<\/header>/, `<!-- NAV -->\n  ${header()}`);
  html = html.replace(/<footer class="bg-charcoal[\s\S]*?<\/footer>/, footer());
  html = html.replace('Patient Rating', reviewPhrase);
  html = html.replace(/\s*<p class="font-body text-xs tracking-widest uppercase text-white\/80">550\+ Reviews<\/p>/, '');
  html = html.replace('Most Insurances Accepted', 'In-Network With Most Major PPO Plans');
  html = html.replace('Same-Day Emergency Appointments', 'Same-Day Emergencies When Possible');
  html = html.replace('Financing Available', 'CareCredit and Cherry Available');
  html = html.replace('From single-tooth replacements to full-arch All-on-4 restorations - the most natural tooth replacement outcome available in dentistry.', 'From single-tooth implants to full-arch dental implants - often searched as All-on-4, All-on-X, or fixed implant teeth - treatment is planned around your bone, bite, anatomy, and long-term function.');
  html = html.replace('From single-tooth replacements to full-arch dental implants, including All-on-4 and All-on-X options when appropriate, planned around long-term function instead of a one-size-fits-all implant count.', 'From single-tooth implants to full-arch dental implants - often searched as All-on-4, All-on-X, or fixed implant teeth - treatment is planned around your bone, bite, anatomy, and long-term function.');
  html = html.replace('Custom oral appliances to treat sleep apnea and snoring - a comfortable, CPAP-free alternative.', 'Take-home sleep study workflow with physician diagnosis and FDA-cleared oral appliance therapy when appropriate.');
  html = html.replace('Take-home sleep studies with physician diagnosis and FDA-cleared oral appliance therapy when appropriate.', 'Take-home sleep study workflow with physician diagnosis and FDA-cleared oral appliance therapy when appropriate.');
  html = html.replace('Gentle, efficient extractions - including wisdom teeth - with your comfort as the priority.', 'Simple and surgical extractions, including many wisdom teeth, with replacement planning when it matters.');
  html = html.replace("Modern techniques make root canals far more comfortable than their reputation - we'll change your mind.", 'Root canals, including many molar root canals, planned with CBCT when appropriate and clear crown guidance afterward.');
  html = html.replace('Custom-fit dentures - traditional or implant-supported - crafted for comfort and a natural look.', 'Traditional dentures, partials, immediate dentures, snap-on dentures, and full-arch options compared honestly.');
  html = html.replace("We'll do our best to get you in the office and out of pain as soon as possible, often times on the same day.", 'Call first for urgent dental problems. Same-day emergency appointments are available when possible.');
  html = html.replace("Your dental care shouldn't have to wait on finances. We partner with CareCredit and Cherry to offer flexible payment plans that fit your budget - apply in minutes and know your options before your first visit. Interest-free options may be available!", `Elm Ridge is in-network with most major PPO dental plans and offers CareCredit and Cherry. ${insuranceCaveat}`);
  html = html.replace('Dental implants are the gold standard for replacing missing teeth - and Elm Ridge is one of the few general practices to place <em>and</em> restore implants entirely in-house, using state-of-the-art 3D imaging for precision every time.', 'Dental implants are often one of the strongest long-term options for replacing missing teeth. They usually cost more upfront than dentures or bridges, but they can be more cost-effective over time because they are designed for longevity and do not rely on reshaping neighboring teeth.');
  html = html.replace('Dental implants are often one of the strongest long-term tooth replacement options. They usually cost more upfront than dentures or bridges, but they can be more cost-effective over time because they are designed for longevity and do not rely on reshaping neighboring teeth.', 'Dental implants are often one of the strongest long-term options for replacing missing teeth. They usually cost more upfront than dentures or bridges, but they can be more cost-effective over time because they are designed for longevity and do not rely on reshaping neighboring teeth.');
  html = html.replace("Whether you're missing one tooth or need a full-arch restoration, we'll walk you through every step with honest answers and a clear treatment plan.", "Whether you're missing one tooth or comparing fixed implant teeth for a full arch, we'll walk you through realistic options, timing, cost, and long-term maintenance.");
  html = html.replace('Single implants, implant bridges, All-on-4, and All-on-6 full-arch solutions', 'Single implants, implant bridges, full-arch dental implants, and All-on-4 or All-on-X options when appropriate');
  html = html.replace('Single implants, implant bridges, All-on-4, and All-on-X full-arch solutions', 'Single implants, implant bridges, full-arch dental implants, and All-on-4 or All-on-X options when appropriate');
  if (!html.includes('Individual results vary. Images are shared with patient consent.')) {
    html = html.replace('<h2 class="font-display text-4xl md:text-5xl font-light italic text-charcoal mb-14 leading-snug">Before &amp; After.</h2>', '<h2 class="font-display text-4xl md:text-5xl font-light italic text-charcoal mb-5 leading-snug">Before &amp; After.</h2><p class="font-body text-sm text-charcoal/60 leading-7 mb-10">Individual results vary. Images are shared with patient consent.</p>');
  }
  html = html.replace('<section id="before-after" class="py-20 bg-white">', '<section id="cosmetic-results" class="py-20 bg-white">');
  html = html.replace('<h2 class="font-display text-4xl md:text-5xl font-light italic text-charcoal mb-5 leading-snug">Before &amp; After.</h2>', '<h2 class="font-display text-4xl md:text-5xl font-light italic text-charcoal mb-5 leading-snug">Cosmetic results.</h2>');
  html = html.replace(/>\s*See Before &amp; After\s*</g, '>Explore Cosmetic Dentistry<');
  html = html.replace(
    /<a href="\/request-appointment" class="inline-block px-8 py-4 bg-teal text-white font-body font-semibold tracking-widest uppercase text-xs hover:bg-teal-dark active:scale-95 transition-\[background-color,transform\] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-dark">\s*Come Meet Us\s*<\/a>/,
    '<a href="/doctors" class="inline-block px-8 py-4 bg-teal text-white font-body font-semibold tracking-widest uppercase text-xs hover:bg-teal-dark active:scale-95 transition-[background-color,transform] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-dark">Come Meet Us</a>',
  );
  html = html.replace(
    /(<div class="h-\[420px\] md:h-\[460px\] overflow-hidden bg-stone">\s*)<img src="Jeff photo\.webp"([^>]*?)\/>\s*(<\/div>)/,
    '$1<a href="/dr-jeff-muszynski-dds" aria-label="Read Jeff Muszynski, DDS profile" class="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"><img src="Jeff photo.webp"$2/></a>$3',
  );
  html = html.replace(
    /(<div class="h-\[420px\] md:h-\[460px\] overflow-hidden bg-stone">\s*)<img src="kayla photo\.webp"([^>]*?)\/>\s*(<\/div>)/,
    '$1<a href="/dr-kayla-muszynski-dds" aria-label="Read Kayla Muszynski, DDS profile" class="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"><img src="kayla photo.webp"$2/></a>$3',
  );
  html = html.replace(/<section id="reviews" class="py-20 bg-stone">[\s\S]*?<\/section>\s*\n\s*<!-- SERVICES -->/, `<section id="reviews" class="py-20 bg-stone">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <p class="font-body text-xs tracking-widest uppercase text-teal-dark mb-3">${reviewPhrase}</p>
          <h2 class="font-display text-4xl md:text-5xl font-light italic text-charcoal leading-snug">Real reviews from real patients.</h2>
        </div>
        <a href="/reviews" class="inline-flex items-center justify-center px-7 py-3 border border-teal text-teal font-body font-semibold tracking-widest uppercase text-xs hover:bg-teal hover:text-white">Read Patient Reviews</a>
      </div>
      <div id="home-review-carousel" class="overflow-hidden border-y border-teal-light py-6" aria-label="Patient review carousel">
        <div id="home-review-track" class="flex gap-4">${reviewCards(reviews.slice(0, 10), true)}</div>
      </div>
    </div>
  </section>

  <!-- SERVICES -->`);
  html = html.replaceAll('href="#contact"', 'href="/request-appointment"');
  html = html.replaceAll('href="#before-after"', 'href="/cosmetic-dentistry-killeen-tx"');
  html = html.replaceAll('href="#reviews"', 'href="/reviews"');
  html = html.replaceAll('href="#services"', 'href="/services"');
  html = html.replaceAll('href="/request-appointment"', 'href="/request-appointment"');
  html = html.replace(/<label for="appointment-website">Website<\/label>\s*/g, '');
  html = html.replace(
    /<input id="appointment-website" type="text" name="website" tabindex="-1" autocomplete="off"(?![^>]*aria-hidden="true")\s*\/>/g,
    '<input id="appointment-website" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />',
  );
  html = html.replace('Upload a clear smile photo to create an AI-assisted cosmetic smile preview.', 'Upload a clear smile photo to create an educational preview using a third-party AI-assisted tool.');
  if (!html.includes('This is not a secure patient portal. Do not submit sensitive medical information or emergency concerns.')) {
    html = html.replace(
      /(\s*)<input\s+id="smilePhoto"/,
      `$1<div style="margin: 16px 0; padding: 14px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px; color: #7c2d12; font-size: 14px; line-height: 1.5;"><strong>This is not a secure patient portal. Do not submit sensitive medical information or emergency concerns.</strong><br />For urgent dental problems, call 254-699-4127 instead of using this tool. Every submission is emailed to the practice and reviewed by Elm Ridge. Uploaded images are stored in email. There is no fixed deletion timeline. The preview is not a diagnosis, not a treatment plan, not a dental record, not a doctor-patient relationship, and not a guarantee of results. It does not replace an exam.</div>$1<input id="smilePhoto"`,
    );
  }
  html = html.replace('I understand this creates a simulated cosmetic preview for educational\n        purposes only. It is not a diagnosis, treatment plan, or guarantee of outcome.', 'I understand this third-party AI-assisted preview is for education and consultation planning only. It is not a diagnosis, not a treatment plan, not a dental record, not a doctor-patient relationship, and not a guarantee of results.');
  if (!html.includes("const homeReviewCarousel")) {
    html = html.replace('const carousel = document.getElementById(\'ba-carousel\');', `const homeReviewCarousel = document.getElementById('home-review-carousel');
    const homeReviewTrack = document.getElementById('home-review-track');
    if (homeReviewCarousel && homeReviewTrack) {
      homeReviewTrack.innerHTML += homeReviewTrack.innerHTML;
      let reviewPos = 0;
      let reviewPaused = false;
      const reviewReduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      homeReviewCarousel.addEventListener('mouseenter', () => { reviewPaused = true; });
      homeReviewCarousel.addEventListener('mouseleave', () => { reviewPaused = false; });
      homeReviewCarousel.addEventListener('focusin', () => { reviewPaused = true; });
      homeReviewCarousel.addEventListener('focusout', () => { reviewPaused = false; });
      const animateReviews = () => {
        if (!reviewReduceMotion && !reviewPaused) {
          reviewPos -= 0.55;
          const midpoint = homeReviewTrack.scrollWidth / 2;
          if (Math.abs(reviewPos) >= midpoint) reviewPos = 0;
          homeReviewTrack.style.transform = 'translateX(' + reviewPos + 'px)';
        }
        requestAnimationFrame(animateReviews);
      };
      requestAnimationFrame(animateReviews);
    }

    const carousel = document.getElementById('ba-carousel');`);
  }
  fs.writeFileSync('index.html', html);
}

function main() {
  buildCorePages();
  buildDoctorPages();
  buildServicesHub();
  buildServicePages();
  buildCostPages();
  buildNewPatientInsuranceAppointmentPages();
  buildReviewsBeforeAfterAiPages();
  buildLocationPages();
  buildMachineFiles();
  cleanupAllHtml();
  cleanupBlogs();
  patchBlogTaxonomy();
  patchPreservedDesignedServicePages();
  patchHomepage();
  patchSitewideChrome();
  removeRedirectedArtifacts();
  buildSitemap();
}

main();

export { blogTitleChanges };
