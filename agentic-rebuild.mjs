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
  return sections.map((section) => `<h2>${esc(section.title)}</h2><p>${section.text}</p>`).join('');
}

function defaultNextQuestions(page, related) {
  const supportHrefs = new Set(['/services', '/new-patients', '/insurance-and-financing', '/request-appointment', '/reviews']);
  return uniqueLinks(related)
    .filter((item) => !supportHrefs.has(item.href))
    .slice(0, 4)
    .map((item) => ({
      label: item.label,
      href: item.href,
      text: `See how this connects with ${item.label.toLowerCase()} at Elm Ridge.`,
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
    <h2>Insurance and Payment</h2>
    <p>Emergency visits may involve an exam, X-rays, same-day treatment, or a staged plan. ${insuranceCaveat}</p>
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
    <h2>Will insurance apply?</h2>
    <p>Emergency visits may involve an exam, X-rays, same-day treatment, or a staged plan. ${insuranceCaveat}</p>
    ${nextQuestionsSection(page.nextQuestions || [])}
    ${relatedSection(links)}
  </div></section>`;
}

function createEmergencyPage(page) {
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

const standardCostFactors = [
  'insurance plan',
  'deductible',
  'annual maximum',
  'remaining benefits',
  'treatment complexity',
  'imaging',
  'materials',
  'number of teeth',
  'sedation, when applicable',
  'grafting or additional procedures, when applicable',
  'financing selection, when applicable',
];

const ownerCostRangeData = {
  // TODO(owner): Replace null values only with owner-approved public ranges.
  'dental-implant-cost-killeen-tx': { ownerApprovedRange: null, needed: 'single implant, abutment/crown, extraction, grafting, sinus lift, temporary tooth options' },
  'full-arch-dental-implant-cost-killeen-tx': { ownerApprovedRange: null, needed: 'per-arch fixed full-arch range, temporary prosthesis, final zirconia, acrylic/select alternatives, extractions/grafting' },
  'snap-on-denture-cost-killeen-tx': { ownerApprovedRange: null, needed: 'implant-retained denture range by implant count, attachment maintenance, new versus existing denture' },
  'crown-cost-killeen-tx': { ownerApprovedRange: null, needed: 'lab-made crown range, buildup/core range, crown replacement considerations' },
  'root-canal-cost-killeen-tx': { ownerApprovedRange: null, needed: 'anterior, premolar, molar root canal ranges and crown-after-root-canal estimate notes' },
  'clear-aligner-cost-killeen-tx': { ownerApprovedRange: null, needed: 'clear aligner treatment range by case complexity, records, refinements, retainers' },
  'emergency-dentist-cost-killeen-tx': { ownerApprovedRange: null, needed: 'emergency exam, X-rays/imaging, common same-day treatment estimate ranges' },
  'sleep-apnea-appliance-cost-killeen-tx': { ownerApprovedRange: null, needed: 'oral appliance range, records/scans, follow-up, medical insurance billing notes' },
};

function costBody(page) {
  const factors = [...new Set([...page.factors, ...standardCostFactors])];
  return `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
    <div class="border border-teal-light bg-teal-pale/50 p-6">
      <p class="font-body text-xs tracking-[0.28em] uppercase text-teal-dark mb-3">Cost Estimate Basics</p>
      <p class="text-charcoal/75 leading-8 text-lg">${page.answer}</p>
    </div>
    ${page.ownerApprovedRange ? `<h2>Owner-Approved Cost Range</h2><p>${esc(page.ownerApprovedRange)}</p>` : ''}
    <h2>What Affects Cost?</h2>
    <ul>${factors.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
    <h2>Insurance and Benefits</h2>
    <p>Elm Ridge is in-network with many major PPO dental plans and can file many out-of-network PPO plans. Benefits vary by employer and plan. ${insuranceCaveat}</p>
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
  { label: 'Before and after', href: '/before-and-after' },
  serviceLinks.reviews,
];

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
      ['Bone grafting and sinus lifts', '/bone-grafting-killeen-tx', 'Supporting procedures when anatomy calls for it.'],
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
  const name = overrides.name;
  return {
    slug: overrides.slug,
    title: overrides.title || `${name} in Killeen, TX | Elm Ridge`,
    description: overrides.description || `${practiceName} provides ${name.toLowerCase()} in Killeen with clear explanations, private-practice care, and practical next steps.`,
    h1: overrides.h1 || name,
    crumb: overrides.crumb || name,
    kicker: overrides.kicker || 'Dental Service',
    intro: overrides.intro || `Clear, practical ${name.toLowerCase()} guidance from Elm Ridge Implant and Family Dentistry in Killeen.`,
    answer: overrides.answer || `${name} may be recommended when it is the most sensible way to protect comfort, function, appearance, or long-term oral health. Elm Ridge starts with diagnosis before recommending treatment.`,
    glance: overrides.glance || defaultServiceGlance(overrides),
    who: overrides.who || defaultWhoText(overrides),
    approach: overrides.approach,
    detailSections: overrides.detailSections || [],
    nextQuestions: overrides.nextQuestions,
    expect: overrides.expect || defaultExpectText(overrides),
    call: overrides.call || defaultCallText(overrides),
    payment: overrides.payment,
    extra: overrides.extra || '',
    providers: overrides.providers || ['Jeff Muszynski, DDS', 'Kayla Muszynski, DDS'],
    related: overrides.related || [serviceLinks.services, serviceLinks.newPatients, serviceLinks.insurance, serviceLinks.appointment, serviceLinks.reviews],
    faq: overrides.faq || standardFaq(name),
    image: overrides.image,
    alt: overrides.alt,
    medical: overrides.medical ?? true,
    serviceType: overrides.serviceType,
    procedureType: overrides.procedureType,
    bodyLocation: overrides.bodyLocation,
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
    makePage({ slug: 'dental-crowns-killeen-tx', name: 'Dental Crowns', title: 'Natural-Looking Dental Crowns in Killeen, TX | Elm Ridge', h1: 'What Makes a Dental Crown Look Natural?', answer: 'Elm Ridge provides lab-made crowns only. A crown may protect a cracked, heavily filled, root-canal-treated, or worn tooth while being shaped and shaded to blend naturally.', related: [{ label: 'Root canals', href: '/root-canal-killeen-tx' }, { label: 'Broken tooth', href: '/broken-tooth-killeen-tx' }, { label: 'Crown cost', href: '/crown-cost-killeen-tx' }, serviceLinks.kayla] }),
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
    ['dental-implant-cost-killeen-tx', 'Dental Implant Cost in Killeen, TX | Elm Ridge', 'Dental Implant Cost in Killeen', 'Dental implant cost depends on the number of missing teeth, whether extraction, grafting, sinus lift, temporary teeth, or final crown/bridge/denture work is needed. Elm Ridge does not publish unapproved fixed prices online.', ['Number of implants', 'Extraction needs', 'Bone grafting or sinus lift', 'Type of final tooth or teeth', 'Sedation or temporary teeth', 'Insurance benefits and annual maximums'], 'An implant estimate requires diagnosis, imaging, and a restorative plan because the implant screw is only one part of the final tooth.', implantRelated],
    ['full-arch-dental-implant-cost-killeen-tx', 'Full-Arch Dental Implant Cost in Killeen, TX | Elm Ridge', 'Full-Arch Dental Implant Cost', 'Full-arch cost varies because surgery, temporary teeth, final material, number of implants, grafting, and restorative design differ by case. Public numeric ranges are omitted until owner-approved.', ['Upper or lower arch', 'Number and position of implants', 'Extractions and bone reduction', 'Temporary prosthesis', 'Final zirconia restoration', 'Maintenance and financing'], 'Full-arch planning needs imaging, bite evaluation, smile design, and a discussion of whether fixed full-arch, snap-on dentures, or traditional dentures fit best.', implantRelated],
    ['snap-on-denture-cost-killeen-tx', 'Snap-On Denture Cost in Killeen, TX | Elm Ridge', 'Snap-On Denture Cost', 'Snap-on denture cost depends on implant number, attachments, whether teeth need removal, bone grafting, and denture design. Elm Ridge avoids fake online prices.', ['Two to four implants', 'New or existing denture', 'Extractions', 'Attachment maintenance', 'Insurance benefits', 'Financing'], 'An exam clarifies whether snap-on dentures are realistic and whether a traditional denture or full-arch fixed plan should also be compared.', implantRelated],
    ['crown-cost-killeen-tx', 'Dental Crown Cost in Killeen, TX | Elm Ridge', 'Dental Crown Cost', 'Crown cost depends on tooth condition, buildup needs, material, lab work, insurance benefits, and whether root canal treatment is also needed.', ['Tooth location', 'Need for buildup', 'Lab-made material', 'Root canal history', 'Insurance coverage', 'Replacement of old dental work'], 'A crown estimate requires checking how much tooth remains and whether the bite and nerve are healthy.', [{ label: 'Dental crowns', href: '/dental-crowns-killeen-tx' }, serviceLinks.insurance]],
    ['root-canal-cost-killeen-tx', 'Root Canal Cost in Killeen, TX | Elm Ridge', 'Root Canal Cost', 'Root canal cost depends on the tooth type, number of canals, infection, crown needs, and insurance benefits. Elm Ridge performs many root canals, including molars, but not retreatments.', ['Front tooth, premolar, or molar', 'Canal complexity', 'Need for crown', 'Emergency visit', 'Insurance coverage', 'Financing'], 'Diagnosis and X-rays are needed because a toothache might require a filling, crown, root canal, extraction, or referral.', [{ label: 'Root canals', href: '/root-canal-killeen-tx' }, { label: 'Molar root canals', href: '/molar-root-canal-killeen-tx' }, serviceLinks.insurance]],
    ['clear-aligner-cost-killeen-tx', 'Clear Aligner Cost in Killeen, TX | Elm Ridge', 'Clear Aligner Cost', 'Clear aligner cost depends on case complexity, treatment length, records, refinements, retainers, and insurance orthodontic benefits.', ['Complexity of movement', 'Treatment length', 'Records and monitoring', 'Retainers', 'Insurance orthodontic benefits', 'Financing'], 'A clear aligner consultation is needed to confirm whether aligners are appropriate and which brand or workflow fits.', [{ label: 'Clear aligners', href: '/clear-aligners-killeen-tx' }, serviceLinks.insurance]],
    ['emergency-dentist-cost-killeen-tx', 'Emergency Dentist Cost in Killeen, TX | Elm Ridge', 'Emergency Dentist Cost', 'Emergency dental cost depends on the exam, X-rays, diagnosis, and whether same-day treatment such as a filling, crown, root canal, extraction, or medication is needed.', ['Emergency exam', 'X-rays or imaging', 'Same-day treatment', 'Staged treatment', 'Insurance benefits', 'Financing'], 'An emergency visit starts with diagnosis because the same symptom can have very different causes and costs.', emergencyRelated],
    ['sleep-apnea-appliance-cost-killeen-tx', 'Sleep Apnea Appliance Cost in Killeen, TX | Elm Ridge', 'Sleep Apnea Appliance Cost', 'Sleep apnea appliance cost depends on medical insurance, physician diagnosis, appliance design, records, follow-up, and documentation. Elm Ridge bills medical insurance for appliances only, not sleep studies.', ['Physician diagnosis', 'Medical insurance requirements', 'Appliance type', 'Records and scans', 'Follow-up adjustment', 'Documentation'], 'A physician diagnosis is required before appliance delivery, and the dental visit confirms whether oral appliance therapy is appropriate.', [{ label: 'Sleep apnea dentist', href: '/sleep-apnea-dentist-killeen-tx' }, serviceLinks.insurance, serviceLinks.jeff]],
  ].forEach(([slug, title, h1, answer, factors, exam, related]) => createCostPage({
    slug,
    title,
    h1,
    answer,
    factors,
    exam,
    related,
    ownerApprovedRange: ownerCostRangeData[slug]?.ownerApprovedRange || '',
    description: `${h1} explained without fake online prices. Learn what affects estimates, insurance, financing, and why Elm Ridge verifies benefits before treatment.`,
    crumb: h1,
    intro: 'Cost should be estimated honestly after diagnosis, not invented for a web page.',
  }));
}

function buildNewPatientInsuranceAppointmentPages() {
  writePage('new-patients', {
    path: '/new-patients',
    title: 'New Dental Patients in Killeen, TX | Elm Ridge',
    description: 'New patient information for Elm Ridge in Killeen: first visits, kids, insurance, Medicaid, military families, emergency appointments, sedation, and payment options.',
    crumb: 'New Patients',
    kicker: 'New Patients',
    h1: 'New Patients Are Welcome',
    intro: 'Here is what to know before your first visit with Elm Ridge Implant and Family Dentistry in Killeen.',
    body: `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
      <h2>Quick Answers</h2>${atAGlance([
        ['Accepting new patients', 'Yes.'],
        ['Children', 'Yes, when teeth are present. Not a pediatric specialty office.'],
        ['Insurance', 'Most major PPO plans; no Medicaid.'],
        ['Online scheduling', 'Appointment request only, not guaranteed real-time booking.'],
      ])}
      <h2>Your First Visit</h2><p>Your first visit usually includes a review of your health history, concerns, appropriate X-rays or imaging, a dental and gum evaluation, and a clear explanation of findings. Bring your insurance card, photo ID, medication list, and any recent X-rays if another office has them.</p>
      <h2>Insurance, Military Families, and Payment</h2><p>Elm Ridge is in-network with many major PPO plans and can file many out-of-network PPO plans. Elm Ridge does not accept Medicaid. Military dependents, spouses, and families are welcome. Elm Ridge does not currently treat active-duty service members through active-duty military dental programs.</p><p>Payment is due at the time of service. CareCredit and Cherry are available, and in-house arrangements may be considered case by case. ${insuranceCaveat}</p>
      <h2>Emergencies and Walk-Ins</h2><p>Same-day emergency appointments are offered when possible. Call first. Walk-ins are not guaranteed, though the team will try to help if the schedule allows. For severe swelling, trouble breathing, uncontrolled bleeding, major trauma, or a medical emergency, go to the ER.</p>
      <h2>Second Opinions</h2><p>Second opinions are welcome. If recent diagnostic-quality X-rays from another office are sent over, Elm Ridge can review them, but the practice may still take its own images if needed for diagnostic accuracy. If duplicative images are needed and insurance does not pay, or if the patient does not have insurance, Elm Ridge avoids charging for duplicative images when appropriate.</p>
      <h2>Comfort Options</h2><p>Elm Ridge offers nitrous oxide and oral conscious sedation for evaluated candidates. IV sedation is not offered.</p>
      ${pillLinks([{ label: 'Request appointment', href: '/request-appointment' }, { label: 'Insurance and financing', href: '/insurance-and-financing' }, { label: 'Services', href: '/services' }, { label: 'Emergency care', href: '/emergency-dentist-killeen-tx' }, { label: 'Reviews', href: '/reviews' }, serviceLinks.jeff, serviceLinks.kayla])}
    </div></section>`,
    faq: [
      ['Do you accept Medicaid?', 'No. Elm Ridge does not accept Medicaid.'],
      ['Do you offer payment plans?', 'CareCredit and Cherry are available. Case-by-case in-house arrangements may be discussed.'],
      ['Do you offer second opinions?', 'Yes. Elm Ridge offers second opinions and may take its own imaging when needed.'],
      ['Do you see active-duty service members?', 'Not at this time through active-duty military dental programs. Dependents, spouses, and families are welcome.'],
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
  writeCustomPage('reviews', '/reviews', 'Patient Reviews | Elm Ridge Implant and Family Dentistry', 'Read patient reviews for Elm Ridge Implant and Family Dentistry in Killeen. 5.0 Google rating from 550+ reviews.', 'Reviews', `${hero('Patient Reviews', 'Real reviews from real patients', reviewPhrase)}<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-6 space-y-12"><div><p class="text-charcoal/65 leading-7 max-w-3xl">These comments come from public patient reviews and testimonials. They are shared as patient feedback, not as review schema.</p></div><div id="review-carousel" class="overflow-hidden border-y border-teal-light py-6" aria-label="Featured patient review carousel"><div id="review-track" class="flex gap-4">${reviewCards(reviews.slice(0, 12), true)}</div></div><div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">${reviewCards(reviews)}</div><div class="bg-stone border border-teal-light p-8">${pillLinks([{ label: 'New patients', href: '/new-patients' }, { label: 'Services', href: '/services' }, { label: 'Request appointment', href: '/request-appointment' }, { label: 'Call ' + phoneDisplay, href: phoneHref }])}</div></div></section><script>(function(){const carousel=document.getElementById('review-carousel');const track=document.getElementById('review-track');if(!carousel||!track)return;track.innerHTML+=track.innerHTML;let pos=0;let paused=false;const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;carousel.addEventListener('mouseenter',()=>paused=true);carousel.addEventListener('mouseleave',()=>paused=false);carousel.addEventListener('focusin',()=>paused=true);carousel.addEventListener('focusout',()=>paused=false);function tick(){if(!reduce&&!paused){pos-=0.55;const midpoint=track.scrollWidth/2;if(Math.abs(pos)>=midpoint)pos=0;track.style.transform='translateX('+pos+'px)';}requestAnimationFrame(tick);}tick();})();</script>`);

  const gallery = [
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
  writeCustomPage('before-and-after', '/before-and-after', 'Before and After Gallery | Elm Ridge Dental', 'View Elm Ridge before and after smile photos shared with patient consent. Individual results vary.', 'Before and After', `${hero('Before and After', 'Before & After Gallery', 'Individual results vary. Images are shared with patient consent.')}<section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-6"><p class="mb-8 text-charcoal/65">Individual results vary. Images are shared with patient consent.</p><div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">${gallery.map(([src, alt]) => `<figure class="bg-stone border border-teal-light p-3"><img src="/${src}" alt="${alt}" class="w-full aspect-[4/3] object-cover" loading="lazy" decoding="async" /><figcaption class="sr-only">${alt}</figcaption></figure>`).join('')}</div><div class="mt-10">${pillLinks([{ label: 'Cosmetic dentistry', href: '/cosmetic-dentistry-killeen-tx' }, { label: 'Dental implants', href: '/dental-implants-killeen-tx' }, { label: 'Full-arch implants', href: '/full-arch-dental-implants-killeen-tx' }, { label: 'Veneers', href: '/veneers-killeen-tx' }, { label: 'Bonding', href: '/cosmetic-bonding-killeen-tx' }, { label: 'Whitening', href: '/teeth-whitening-killeen-tx' }])}</div></div></section>`);

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
      ${pillLinks([{ label: 'Cosmetic dentistry', href: '/cosmetic-dentistry-killeen-tx' }, { label: 'Before and after', href: '/before-and-after' }, { label: 'Request appointment', href: '/request-appointment' }])}
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
      <h2>Services</h2><p>Family dentistry, cleanings, exams, fillings, crowns, bridges, root canals including molars, extractions, wisdom teeth removal, dentures, partial dentures, immediate dentures, dental implants, single implants, implant bridges, snap-on dentures, full-arch dental implants, All-on-4-style treatment, bone grafting, sinus lifts, veneers, cosmetic bonding, take-home whitening trays, clear aligners, emergency dentistry, nitrous oxide, oral conscious sedation, sleep apnea oral appliances, take-home sleep studies workflow, and limited TMJ splint therapy.</p>
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
    const areaText = city === 'Killeen' ? 'Elm Ridge is located in Killeen at 2601 E Elms Rd.' : `Patients from ${city} visit the Elm Ridge office in Killeen for dental care.`;
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
        ])}
        <h2>Emergency Guidance</h2><p>Call first for urgent dental concerns. Go to the ER for severe swelling, trouble breathing, trouble swallowing, uncontrolled bleeding, major trauma, or a medical emergency.</p>
        <h2>Visit the Killeen Office</h2><p><a href="${mapHref}" target="_blank" rel="noopener">${addressLine}</a>. Hours: Monday-Thursday 8 AM-5 PM. Friday-Sunday closed.</p>
        ${pillLinks([serviceLinks.services, serviceLinks.newPatients, serviceLinks.insurance, serviceLinks.appointment])}
      </div></section>`,
      faq: [
        [`Does Elm Ridge have an office in ${city}?`, city === 'Killeen' ? 'Yes. Elm Ridge is located in Killeen.' : `No. Patients from ${city} visit the Killeen office.`],
        [`Can ${city} patients schedule emergency visits?`, 'Yes. Call first; same-day emergency appointments are offered when possible.'],
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
- /before-and-after
- /ai-summary

Services:
Family dentistry, cleanings, exams, fillings, crowns, bridges, root canals including molars, extractions, wisdom teeth removal, dentures, partial dentures, immediate dentures, dental implants, single tooth implants, implant bridges, snap-on dentures, full-arch dental implants, All-on-4-style treatment, bone grafting, sinus lifts, cosmetic dentistry, veneers, cosmetic bonding, take-home teeth whitening, clear aligners, emergency dentistry, nitrous oxide, oral conscious sedation, sleep apnea oral appliances, take-home sleep studies workflow, and limited TMJ splint therapy.

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
  ['Natural-Looking Dental Crowns in Killeen', 'What Makes a Dental Crown Look Natural?'],
  ['Fix Worn, Chipped, or Short Teeth in Killeen', 'How to Fix Worn, Chipped, or Short Teeth'],
  ['Broken Tooth in Killeen: Crown, Root Canal, or Extraction?', 'Broken Tooth: When You Need a Crown, Root Canal, or Extraction'],
  ['Dental Implants Near Harker Heights: How to Choose the Right Fit', 'How Harker Heights Patients Can Choose an Implant Dentist'],
  ['Cosmetic Dentistry Options in Killeen, TX', 'Cosmetic Dentistry Options That Still Look Natural'],
  ['Dental Implant Cost in Killeen, TX', 'Dental Implant Cost: What Actually Affects the Estimate'],
];

function normalizeCategory(label) {
  return label
    .replaceAll('Dental Implants', 'Dental Implants')
    .replaceAll('Dental Implants', 'Dental Implants')
    .replaceAll('Dental Implants', 'Dental Implants')
    .replaceAll('Dentures &amp; Missing Teeth', 'Dentures &amp; Missing Teeth')
    .replaceAll('Emergency Dentistry', 'Emergency Dentistry')
    .replaceAll('Cosmetic Dentistry', 'Cosmetic Dentistry')
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
    ['href="/#before-after"', 'href="/before-and-after"'],
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
    ['Looking for a dentist for dentures near me in Killeen? Compare traditional dentures, snap-on dentures, and full-arch implants at Elm Ridge.', 'Compare traditional dentures, snap-on dentures, and full-arch implants at Elm Ridge in Killeen.'],
    ['If you have been searching for a <strong>dentist for dentures near me</strong>, you may already know there is not just one way to replace missing teeth.', 'If you are comparing denture and implant options, you may already know there is not just one way to replace missing teeth.'],
    ['Implant dentist in Killeen, TX guide covering experience, CBCT imaging, guided surgery, treatment planning, and private practice care.', 'Learn how to compare implant dentistry experience, CBCT imaging, guided surgery, treatment planning, and private-practice care in Killeen.'],
    ['Contact / Appointment', 'request appointment'],
    ['/request-appointment', '/request-appointment'],
  ];
  let out = html;
  for (const [from, to] of replacements) out = out.replaceAll(from, to);
  for (const [oldTitle, newTitle] of blogTitleChanges) out = out.replaceAll(oldTitle, newTitle);
  out = normalizeCategory(out);
  out = out.replace(/"aggregateRating":\{"@type":"AggregateRating","ratingValue":"[^"]+","reviewCount":"[^"]+","bestRating":"[^"]+","worstRating":"[^"]+"\},?/g, '');
  out = out.replace(/,\s*("hasOfferCatalog")/g, ',$1').replace(/\{\s*,/g, '{');
  out = out.replace(/<label for="appointment-website">Website<\/label>\s*/g, '');
  return out;
}

const redirectedArtifacts = [
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
      const text = fs.readFileSync(entry.name, 'utf8');
      if (text.includes('<html') && entry.name !== 'index.html') add(entry.name);
    } else if (['blog', 'insurance', 'post-op'].includes(entry.name)) {
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
  html = html.replace('Patient Rating', reviewPhrase);
  html = html.replace(/\s*<p class="font-body text-xs tracking-widest uppercase text-white\/80">550\+ Reviews<\/p>/, '');
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
  html = html.replaceAll('href="#before-after"', 'href="/before-and-after"');
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
  patchHomepage();
  removeRedirectedArtifacts();
  buildSitemap();
}

main();

export { blogTitleChanges };
