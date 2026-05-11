import { writePage, jsonLd, dentistEntityRef, domain } from './site-helpers.mjs';

const file = 'dentist-nolanville-tx';
const path = '/dentist-nolanville-tx';
const city = 'Nolanville';
const title = 'Private Dentist Near Nolanville, TX';
const description = 'Patients from Nolanville choose Elm Ridge Implant and Family Dentistry for private, relationship-based care, advanced implant treatment, and 550+ five-star reviews in nearby Killeen.';

const locationServiceSchema = jsonLd({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Private Dental Care Near Nolanville, TX',
  url: `${domain}${path}`,
  description,
  provider: dentistEntityRef,
  areaServed: [
    { '@type': 'City', name: 'Nolanville' },
    { '@type': 'City', name: 'Killeen' },
    { '@type': 'City', name: 'Harker Heights' },
    { '@type': 'City', name: 'Copperas Cove' },
    { '@type': 'Place', name: 'Fort Hood' },
    { '@type': 'Place', name: 'Fort Cavazos' },
  ],
  serviceType: [
    'Family Dentistry',
    'Emergency Dentistry',
    'Dental Implants',
    'Cosmetic Dentistry',
  ],
}, 'dentist-nolanville-tx-service');

writePage(file, {
  path,
  title,
  description,
  crumb: 'Dentist Near Nolanville, TX',
  kicker: 'Private Dental Care Near Nolanville',
  h1: 'Dentist Near Nolanville, TX',
  intro: 'Private dental care near Nolanville for patients who want familiar faces, stronger long-term planning, and a private office that feels more personal than corporate dentistry.',
  image: 'Building.webp',
  alt: 'Exterior of Elm Ridge Implant and Family Dentistry building in Killeen, TX',
  heroPrimaryLabel: 'Request an Appointment',
  heroPrimaryHref: '/#contact',
  heroSecondaryLabel: 'Call 254-699-4127',
  heroSecondaryHref: 'tel:+12546994127',
  body: `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
    <p>Nolanville patients are close enough to Killeen that they do not have to settle for the office that is merely closest. Many choose Elm Ridge because they want a private practice with stable doctors, organized records, and the sense that the plan is being built for them rather than read off a script.</p>
    <p>That matters for routine family care, but it matters even more when the situation is more complicated. Missing teeth, implant decisions, cosmetic changes, cracked teeth, and urgent dental problems all feel easier to navigate when the office is calm, clear, and consistent from one visit to the next.</p>

    <h2>Why Patients from Nolanville Say It Is Worth the Drive</h2>
    <p>Many Nolanville patients want one office they can trust for cleanings, emergencies, cosmetic work, and implant planning without feeling shuffled between different providers. That continuity is a major reason they choose Elm Ridge.</p>
    <div class="grid sm:grid-cols-2 gap-4 not-prose">
      <div class="border border-teal-light p-5 bg-white"><p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-2">Private Practice</p><p class="text-charcoal/65 leading-7">Patients see familiar faces and get recommendations that feel thoughtful, not rushed.</p></div>
      <div class="border border-teal-light p-5 bg-white"><p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-2">Social Proof</p><p class="text-charcoal/65 leading-7">With 550+ five-star reviews, Elm Ridge has become the choice many patients make when trust matters more than convenience alone.</p></div>
      <div class="border border-teal-light p-5 bg-white"><p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-2">Implant Expertise</p><p class="text-charcoal/65 leading-7">Dr. Jeff places and restores implants in-house and uses CBCT imaging when precision matters.</p></div>
      <div class="border border-teal-light p-5 bg-white"><p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-2">Comfort</p><p class="text-charcoal/65 leading-7">A calmer office atmosphere, curated music, TVs, headphones, and practical comfort details make visits easier.</p></div>
    </div>

    <h2>Care Nolanville Patients Commonly Come For</h2>
    <div class="grid md:grid-cols-2 gap-5 not-prose">
      <a href="/family-dentist-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Family Dentistry</h3><p class="text-charcoal/65 leading-7">Preventive care, cleanings, exams, fillings, and long-term family dentistry in one office.</p></a>
      <a href="/emergency-dentist-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Emergency Dental Care</h3><p class="text-charcoal/65 leading-7">Urgent help for tooth pain, swelling, broken teeth, lost crowns, and similar problems.</p></a>
      <a href="/dental-implants-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Dental Implants</h3><p class="text-charcoal/65 leading-7">Single-tooth implants, implant bridges, and long-term tooth replacement options.</p></a>
      <a href="/snap-on-dentures-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Snap-On Dentures</h3><p class="text-charcoal/65 leading-7">Implant-retained dentures for patients who want more lower-denture stability.</p></a>
      <a href="/cosmetic-dentistry-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Cosmetic Dentistry</h3><p class="text-charcoal/65 leading-7">Whitening, bonding, veneers, and smile planning built around natural-looking results.</p></a>
      <a href="/insurance-and-financing" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Insurance and Financing</h3><p class="text-charcoal/65 leading-7">Clear conversations about insurance, CareCredit, and Cherry before larger treatment begins.</p></a>
    </div>

    <h2>A Private-Practice Experience That Feels Different</h2>
    <p>Patients from Nolanville often mention that the office feels more personal than what they expected. The pace is calmer, the explanations are clearer, and small comfort details help visits feel easier without turning the experience into a gimmick.</p>

    <h2>Implant Expertise When the Case Is More Complex</h2>
    <p>When a case involves missing teeth, grafting, timing, or questions about whether a tooth should be saved or replaced, Dr. Jeff plans with a full 3D view when needed. That gives patients a more realistic conversation about what the options are and what the long-term tradeoffs look like.</p>
    <p>That is why many Nolanville patients choose to come here for <a href="/dental-implants-killeen-tx">dental implants in Killeen</a>, <a href="/full-arch-dental-implants-killeen-tx">full-arch dental implants</a>, and <a href="/snap-on-dentures-killeen-tx">snap-on implant dentures</a> rather than piecing treatment together from multiple offices.</p>

    <h2>Convenient from Nolanville</h2>
    <p>Elm Ridge Implant and Family Dentistry is located at 2601 E Elms Rd in Killeen. For many Nolanville patients, the drive is easy enough that the benefits of a private office with stronger continuity make the decision pretty straightforward.</p>
    <a href="https://www.google.com/maps?q=2601+E+Elms+Rd,+Killeen,+TX+76542" class="inline-block border border-teal px-8 py-4 text-xs uppercase tracking-widest text-teal-dark font-semibold">Get Directions</a>
  </div></section>`,
  faqHeading: 'Nolanville FAQ',
  faq: [
    ['Do you see patients from Nolanville?', 'Yes. We regularly welcome patients from Nolanville who want private dental care in nearby Killeen.'],
    ['Why do Nolanville patients choose Elm Ridge?', 'Many want familiar doctors, clear treatment planning, advanced implant capability, and the trust signal of 550+ five-star reviews.'],
    ['Do you offer dental implants near Nolanville?', 'Yes. We provide implant consultations, CBCT-based planning, implant placement, and restoration for single teeth, multiple teeth, and larger cases.'],
    ['Can I get emergency dental care if I live in Nolanville?', 'Yes. Call us for urgent tooth pain, swelling, a broken tooth, lost crowns, or another dental problem that should not wait.'],
    ['Is Elm Ridge worth the drive from Nolanville?', 'For many patients, yes. They choose the drive because they want a private office that feels calmer, more personal, and more consistent long term.'],
  ],
  footerTitle: 'Looking for a private dentist near Nolanville?',
  footerText: `If you want stronger continuity, clearer planning, and an office patients trust enough to drive for, we'd love to meet you.`,
  footerPrimaryLabel: 'Schedule Your Visit',
  footerPrimaryHref: '/#contact',
  footerSecondaryLabel: 'Call 254-699-4127',
  footerSecondaryHref: 'tel:+12546994127',
  headSchemas: [locationServiceSchema],
});
