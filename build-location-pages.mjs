import { writePage, jsonLd, dentistEntityRef, domain } from './site-helpers.mjs';

function locationServiceSchema(city, slug, description) {
  const nearbyAreas = [
    { '@type': 'City', name: 'Killeen' },
    { '@type': 'City', name: 'Harker Heights' },
    { '@type': 'City', name: 'Copperas Cove' },
    { '@type': 'City', name: 'Belton' },
    { '@type': 'City', name: 'Temple' },
    { '@type': 'City', name: 'Salado' },
    { '@type': 'City', name: 'Nolanville' },
    { '@type': 'Place', name: 'Fort Hood' },
    { '@type': 'Place', name: 'Fort Cavazos' },
  ].filter((place) => place.name !== city);
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Private Dental Care Near ${city}, TX`,
    url: `${domain}/${slug}`,
    description,
    provider: dentistEntityRef,
    areaServed: [
      { '@type': 'City', name: city },
      ...nearbyAreas,
    ],
    serviceType: [
      'Family Dentistry',
      'Emergency Dentistry',
      'Dental Implants',
      'Cosmetic Dentistry',
    ],
  }, `${slug}-service`);
}

function serviceCards(city) {
  return `
    <div class="grid md:grid-cols-2 gap-5 not-prose">
      <a href="/family-dentist-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Family Dentistry</h3><p class="text-charcoal/65 leading-7">Cleanings, exams, fillings, crowns, and practical long-term care for ${city} families who want one dependable dental home.</p></a>
      <a href="/emergency-dentist-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Emergency Dental Care</h3><p class="text-charcoal/65 leading-7">Urgent help for tooth pain, swelling, broken teeth, lost crowns, and the kind of problems that do not wait for a convenient week.</p></a>
      <a href="/dental-implants-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Dental Implants</h3><p class="text-charcoal/65 leading-7">Single-tooth implants, implant bridges, and carefully planned tooth replacement for patients who want something long-lasting and natural-looking.</p></a>
      <a href="/full-arch-dental-implants-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Full-Arch Options</h3><p class="text-charcoal/65 leading-7">Full-arch dental implants and <a href="/snap-on-dentures-killeen-tx">snap-on dentures</a> for patients weighing bigger decisions about stability, function, and quality of life.</p></a>
      <a href="/cosmetic-dentistry-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Cosmetic Dentistry</h3><p class="text-charcoal/65 leading-7">Whitening, bonding, veneers, and smile planning designed to look polished, believable, and in proportion to the rest of your face.</p></a>
      <a href="/dental-crowns-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Crowns and Root Canals</h3><p class="text-charcoal/65 leading-7"><a href="/dental-crowns-killeen-tx">Crowns</a> and <a href="/root-canal-killeen-tx">root canal therapy</a> for cracked, painful, or heavily restored teeth when the goal is to save structure and keep the plan moving.</p></a>
    </div>`;
}

function bodyFor(config) {
  return `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
    <p>${config.bodyIntroOne}</p>
    <p>${config.bodyIntroTwo}</p>

    <h2>Why Patients from ${config.city} Say It Is Worth the Drive</h2>
    <p>${config.worthDriveIntro}</p>
    <div class="grid sm:grid-cols-2 gap-4 not-prose">
      <div class="border border-teal-light p-5 bg-white">
        <p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-2">Private Practice</p>
        <p class="text-charcoal/65 leading-7">Patients see familiar faces, get clear recommendations, and build care around an ongoing relationship instead of a revolving-door office model.</p>
      </div>
      <div class="border border-teal-light p-5 bg-white">
        <p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-2">Social Proof</p>
        <p class="text-charcoal/65 leading-7">With 550+ five-star reviews, Elm Ridge has become the office many patients choose when they want quality and trust, not just the nearest chair.</p>
      </div>
      <div class="border border-teal-light p-5 bg-white">
        <p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-2">Implant Expertise</p>
        <p class="text-charcoal/65 leading-7">Dr. Jeff plans and restores implant cases with CBCT imaging and an eye toward the final result, whether the case is one tooth or a much larger reconstruction.</p>
      </div>
      <div class="border border-teal-light p-5 bg-white">
        <p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-2">Comfort</p>
        <p class="text-charcoal/65 leading-7">A calm office, curated music, ceiling-mounted TVs, headphones, blankets, and other thoughtful details make visits feel more personal and less clinical.</p>
      </div>
    </div>

    <h2>Care Patients from ${config.city} Commonly Come For</h2>
    <p>${config.serviceIntro}</p>
    ${serviceCards(config.city)}

    <h2>A Private-Practice Experience That Feels Different</h2>
    <p>${config.experienceParagraph}</p>

    <h2>Implant Expertise When the Case Is More Complex</h2>
    <p>${config.implantParagraph}</p>
    <p>That is a big reason patients from ${config.city} who are weighing <a href="/dental-implants-killeen-tx">dental implants in Killeen</a>, <a href="/full-arch-dental-implants-killeen-tx">full-arch dental implants</a>, or <a href="/snap-on-dentures-killeen-tx">snap-on implant dentures</a> choose to come here instead of bouncing between multiple offices.</p>

    <h2>Convenient from ${config.city}</h2>
    <p>${config.locationParagraph}</p>
    <a href="https://www.google.com/maps?q=2601+E+Elms+Rd,+Killeen,+TX+76542" class="inline-block border border-teal px-8 py-4 text-xs uppercase tracking-widest text-teal-dark font-semibold">Get Directions</a>
  </div></section>`;
}

const pages = [
  {
    file: 'dentist-belton-tx',
    path: '/dentist-belton-tx',
    city: 'Belton',
    title: 'Private Dentist Near Belton, TX',
    description: 'For Belton patients, Elm Ridge Implant and Family Dentistry is worth the drive for familiar faces, advanced implant planning, and 550+ five-star reviews.',
    intro: 'Private dental care worth the drive for Belton patients who want familiar faces, modern implant planning, and long-term care in a privately owned office.',
    bodyIntroOne: 'Patients from Belton usually have dental options closer to home, so when they come to Elm Ridge it is rarely just about convenience. It is because they want a private office where the plan feels thoughtful, the explanation makes sense, and the same team is still there when follow-up matters.',
    bodyIntroTwo: 'That can matter for a family looking for one dependable dental home, for someone comparing cosmetic options carefully, or for a patient trying to decide whether a cracked tooth, missing tooth, or uncomfortable denture needs a more serious conversation. Elm Ridge Implant and Family Dentistry is in Killeen, but many Belton patients decide the added clarity and continuity are worth the short drive.',
    worthDriveIntro: 'For Belton patients, the office that feels right is often the office they stay with. That matters more than ever when treatment is complex, timelines matter, or you simply do not want to repeat the same story to a new dentist every year.',
    serviceIntro: 'We see patients from Belton for routine care, second opinions, urgent dental problems, and larger implant or restorative treatment plans.',
    experienceParagraph: 'Elm Ridge is intentionally non-corporate. Patients notice that the pace feels calmer, the explanations are clearer, and the office environment is designed to make visits easier without becoming gimmicky. That difference tends to matter to patients who have been through rushed, high-volume care before and know they want something more consistent.',
    implantParagraph: 'When the question is bigger than a simple filling, the details matter. Dr. Jeff places and restores implants in-house, documents cases carefully, and uses CBCT imaging when planning requires a real 3D view of bone and anatomy. That helps patients understand not just what can be done, but what is most sensible long term.',
    locationParagraph: 'Elm Ridge Implant and Family Dentistry is located at 2601 E Elms Rd in Killeen. For many Belton patients, the route is simple enough for routine visits and absolutely worth it when the goal is more trust, more continuity, and a stronger long-term plan.',
    faq: [
      ['Do you see patients from Belton?', 'Yes. We regularly welcome Belton patients who want private, relationship-based care in nearby Killeen.'],
      ['Why do Belton patients choose Elm Ridge?', 'Many want a privately owned office with familiar faces, clear treatment planning, advanced implant capability, and a reputation built on 550+ five-star reviews.'],
      ['Do you offer dental implants near Belton?', 'Yes. We provide single-tooth implants, implant bridges, full-arch options, and snap-on denture planning from our Killeen office.'],
      ['Can I get emergency dental care if I live in Belton?', 'Yes. Call us for urgent tooth pain, swelling, broken teeth, lost crowns, or another dental problem that needs timely care.'],
      ['Is Elm Ridge worth the drive from Belton?', 'For many patients, yes. They make the drive because they want private-practice continuity, more thoughtful recommendations, and an office they trust for the long term.'],
    ],
  },
  {
    file: 'dentist-copperas-cove-tx',
    path: '/dentist-copperas-cove-tx',
    city: 'Copperas Cove',
    title: 'Private Dentist Near Copperas Cove, TX',
    description: 'Copperas Cove patients choose Elm Ridge Implant and Family Dentistry for steady private-practice care, implant expertise, and 550+ five-star reviews.',
    intro: 'Private dental care near Copperas Cove for patients who want clear answers, consistent doctors, and a more thoughtful experience than a high-volume office.',
    bodyIntroOne: 'Patients from Copperas Cove often come to Elm Ridge because they want dentistry that feels steady, practical, and well explained. Some are dealing with a tooth that suddenly hurts. Others are comparing bigger decisions about implants, dentures, crowns, or cosmetic work and want a team that takes time to talk through the tradeoffs.',
    bodyIntroTwo: 'Elm Ridge Implant and Family Dentistry is in Killeen, but for many Copperas Cove patients the short drive makes sense when the office on the other end feels more organized, more personal, and more capable of handling both the routine and the complicated parts of dentistry in one place.',
    worthDriveIntro: 'Quality starts to matter a lot more when the diagnosis is not simple or when you are tired of feeling rushed. Patients from Copperas Cove often tell us they want one office that can explain the situation honestly and help them move forward with a clear plan.',
    serviceIntro: 'Patients from Copperas Cove come to us for preventive care, urgent visits, implant planning, cosmetic improvements, and restorative treatment that needs a steadier hand.',
    experienceParagraph: 'This is a private practice built around continuity. Patients see the same doctors, the office keeps things organized, and small comfort details like music, TVs, headphones, and blankets make visits easier without making the experience feel forced or overproduced.',
    implantParagraph: 'Dr. Jeff plans implant treatment with modern imaging and a practical long view. That matters when the decision involves an extraction, grafting, timing, or the choice between a bridge, a denture, or an implant-based option. Patients do better when the conversation is specific and the records are meticulous.',
    locationParagraph: 'Elm Ridge Implant and Family Dentistry is located at 2601 E Elms Rd in Killeen. For many Copperas Cove patients, the route is straightforward enough that choosing a private office with stronger continuity feels like the better long-term choice.',
    faq: [
      ['Do you see patients from Copperas Cove?', 'Yes. We welcome Copperas Cove patients who want private dental care in nearby Killeen.'],
      ['Why do Copperas Cove patients choose Elm Ridge?', 'Many want familiar doctors, honest treatment planning, implant expertise, and the confidence that comes from 550+ five-star reviews.'],
      ['Do you offer dental implants near Copperas Cove?', 'Yes. We offer implant consultations, CBCT-based planning, implant placement, and restoration for single teeth, multiple teeth, and full-arch cases.'],
      ['Can I get emergency dental care if I live in Copperas Cove?', 'Yes. Call us for tooth pain, swelling, a broken tooth, a lost crown, or another urgent dental concern.'],
      ['Is Elm Ridge worth the drive from Copperas Cove?', 'For many patients, yes. They choose the drive because they want a private office that feels calmer, clearer, and more consistent than a corporate alternative.'],
    ],
  },
  {
    file: 'dentist-harker-heights-tx',
    path: '/dentist-harker-heights-tx',
    city: 'Harker Heights',
    title: 'Private Dentist Near Harker Heights, TX',
    description: 'Just minutes from Harker Heights, Elm Ridge Implant and Family Dentistry offers familiar faces, careful planning, and 550+ five-star reviews.',
    intro: 'Private dental care near Harker Heights for families, professionals, and military households who want familiar faces, advanced treatment planning, and a calmer office experience.',
    bodyIntroOne: 'Harker Heights patients are close enough to Killeen that they do not have to settle for the office that is merely closest. Many come to Elm Ridge because they want a private-practice experience with consistent doctors, clear communication, and care that feels more personal than a chain or rotating-provider model.',
    bodyIntroTwo: 'That matters whether the need is routine family dentistry, an emergency visit, a second opinion on a cracked or missing tooth, or a bigger conversation about implants and long-term tooth replacement. The office is nearby. The difference is that it feels intentional.',
    worthDriveIntro: 'For many Harker Heights patients, the appeal is not distance at all. It is the combination of proximity, private-practice continuity, advanced implant capability, and an office culture that feels thoughtful instead of transactional.',
    serviceIntro: 'We serve Harker Heights patients who want one office they can trust for cleanings, emergencies, cosmetic work, implants, and the treatment decisions that come with real-life wear and tear.',
    experienceParagraph: 'Patients from Harker Heights often tell us they appreciate the office atmosphere here. Familiar music, ceiling-mounted TVs, headphones, blankets, and a more human pace help visits feel easier, especially for busy families and patients who have had rougher dental experiences elsewhere.',
    implantParagraph: 'When implant treatment is on the table, precision matters. Dr. Jeff plans and restores implants in-house and uses CBCT imaging when the case calls for a true 3D understanding of bone, anatomy, and the final restoration. That helps support better decisions and clearer expectations.',
    locationParagraph: 'Elm Ridge Implant and Family Dentistry is located at 2601 E Elms Rd in Killeen, making the drive from Harker Heights practical for everything from preventive care to emergency visits and larger treatment plans.',
    faq: [
      ['Do you see patients from Harker Heights?', 'Yes. We regularly care for patients from Harker Heights who want a private office just minutes away in Killeen.'],
      ['Why do Harker Heights patients choose Elm Ridge?', 'They often want private-practice continuity, implant expertise, a calmer office atmosphere, and the reassurance of 550+ five-star reviews.'],
      ['Do you offer dental implants near Harker Heights?', 'Yes. We provide single-tooth implants, implant bridges, full-arch treatment, and snap-on denture planning from our Killeen office.'],
      ['Can I get emergency dental care if I live in Harker Heights?', 'Yes. Call us if you have severe tooth pain, swelling, a broken tooth, or another urgent concern.'],
      ['Is Elm Ridge worth the drive from Harker Heights?', 'For many patients, absolutely. The drive is short, and they choose it because the office feels more personal, more organized, and better suited to long-term care.'],
    ],
  },
  {
    file: 'dentist-salado-tx',
    path: '/dentist-salado-tx',
    city: 'Salado',
    title: 'Private Dentist Near Salado, TX',
    description: 'Salado patients choose Elm Ridge Implant and Family Dentistry for quality-focused private care, natural-looking implant planning, and 550+ five-star reviews.',
    intro: 'Private dental care worth the drive from Salado for patients who care about quality, continuity, natural-looking results, and a relationship with the team behind the work.',
    bodyIntroOne: 'Patients from Salado rarely come to Elm Ridge because they want the fastest option. They usually come because they care about detail, trust, and the difference between treatment that is simply completed and treatment that is thoughtfully planned. That is especially true for cosmetic dentistry, implant care, and larger restorative decisions.',
    bodyIntroTwo: 'Elm Ridge Implant and Family Dentistry is in Killeen, but Dr. Jeff and Dr. Kayla Muszynski call Salado home. That makes caring for Salado patients personal. Many choose the practice because they want a private office where quality still feels like the point of the work.',
    worthDriveIntro: 'Salado patients often tell us they would rather drive a little farther and feel confident about the recommendation than stay closer and wonder whether the planning was rushed. That is a fair instinct, and it matches how we practice.',
    serviceIntro: 'We see Salado patients for family dentistry, cosmetic treatment, implants, urgent dental care, and second opinions when the stakes feel high enough that quality matters more than pure convenience.',
    experienceParagraph: 'The office environment is modern and calm without trying too hard. Familiar music, TVs, headphones, blankets, and small comfort details help the visit feel easier, but the deeper difference is that patients feel known here instead of processed.',
    implantParagraph: 'Implant treatment can be simple or highly technical depending on the anatomy and the goal. Dr. Jeff plans implants with CBCT imaging, restores cases in-house, and thinks carefully about what the final result needs to look and function like before treatment begins. That attention to the end result matters to Salado patients who value craftsmanship.',
    locationParagraph: 'Elm Ridge Implant and Family Dentistry is located at 2601 E Elms Rd in Killeen. For many Salado patients, the drive is easy enough to make routine care practical and more complex treatment feel well worth it.',
    faq: [
      ['Do you see patients from Salado?', 'Yes. We regularly care for patients from Salado who want private, quality-focused dental care in nearby Killeen.'],
      ['Why do Salado patients choose Elm Ridge?', 'Many want a privately owned office, careful cosmetic and implant planning, a team they trust, and the reassurance that comes with 550+ five-star reviews.'],
      ['Do you offer dental implants near Salado?', 'Yes. We provide single-tooth implants, implant bridges, full-arch treatment, and snap-on denture options from our Killeen office.'],
      ['Can I get emergency dental care if I live in Salado?', 'Yes. Call us for urgent tooth pain, swelling, broken teeth, lost restorations, or another concern that needs timely attention.'],
      ['Is Elm Ridge worth the drive from Salado?', 'For many patients, yes. They choose the drive because they want a private office that feels more personal, more meticulous, and more invested in long-term outcomes.'],
    ],
  },
  {
    file: 'dentist-temple-tx',
    path: '/dentist-temple-tx',
    city: 'Temple',
    title: 'Private Dentist Near Temple, TX',
    description: 'Temple patients make the drive to Elm Ridge Implant and Family Dentistry for careful diagnosis, advanced implant planning, and 550+ five-star reviews.',
    intro: 'Private dental care near Temple for patients who want careful explanations, advanced implant planning, and a more personal office than a high-volume dental chain.',
    bodyIntroOne: 'Temple patients often arrive with thoughtful questions. They want to understand what is happening, what the options actually are, and what the long-term cost of the wrong choice could be. That is a good fit for how Elm Ridge practices.',
    bodyIntroTwo: 'Whether someone needs a second opinion about a missing tooth, a crown, a root canal, cosmetic dentistry, or a full implant plan, the appeal is usually the same: a private office that takes diagnosis seriously and explains the plan clearly without making the conversation feel rushed or sales-driven.',
    worthDriveIntro: 'Patients from Temple often decide Elm Ridge is worth the drive because they want a team that can combine technology, clinical judgment, and continuity in one place. That balance matters when the decision is not simple.',
    serviceIntro: 'Temple patients come to us for everything from preventive care and emergencies to implants, cosmetic dentistry, and larger restorative plans that benefit from more careful coordination.',
    experienceParagraph: 'The office feels modern but still personal. Patients notice the steady pace, the way questions are answered, and the comfort details that make visits easier. That combination can be especially valuable for people who have had enough of rushed care and fragmented communication.',
    implantParagraph: 'Implant planning is where careful diagnosis really matters. Dr. Jeff uses CBCT imaging when needed, restores implants in-house, and thinks through the entire sequence before treatment begins. Patients from Temple often appreciate that the recommendation comes with real context instead of a generic script.',
    locationParagraph: 'Elm Ridge Implant and Family Dentistry is located at 2601 E Elms Rd in Killeen. For many Temple patients, the route is straightforward enough that a short drive for clearer planning and stronger continuity feels like an easy trade.',
    faq: [
      ['Do you see patients from Temple?', 'Yes. We welcome Temple patients who want private dental care in nearby Killeen.'],
      ['Why do Temple patients choose Elm Ridge?', 'They often want a privately owned office, more careful explanations, implant expertise, and the trust signal of 550+ five-star reviews.'],
      ['Do you offer dental implants near Temple?', 'Yes. We offer implant consultations, CBCT-based planning, and implant treatment for single teeth, multiple teeth, and full-arch cases.'],
      ['Can I get emergency dental care if I live in Temple?', 'Yes. Call us for severe tooth pain, swelling, broken teeth, or another urgent dental problem.'],
      ['Is Elm Ridge worth the drive from Temple?', 'For many patients, yes. They choose the drive because they want more thoughtful planning, stronger continuity, and a practice that feels less corporate.'],
    ],
  },
];

for (const page of pages) {
  writePage(page.file, {
    path: page.path,
    title: page.title,
    description: page.description,
    crumb: `Dentist Near ${page.city}, TX`,
    kicker: `Private Dental Care Near ${page.city}`,
    h1: `Dentist Near ${page.city}, TX`,
    intro: page.intro,
    image: 'Building.webp',
    alt: 'Exterior of Elm Ridge Implant and Family Dentistry building in Killeen, TX',
    body: bodyFor(page),
    faqHeading: `${page.city} FAQ`,
    faq: page.faq,
    heroPrimaryLabel: 'Request an Appointment',
    heroPrimaryHref: '/#contact',
    heroSecondaryLabel: 'Call 254-699-4127',
    heroSecondaryHref: 'tel:+12546994127',
    footerTitle: `Looking for a private dentist near ${page.city}?`,
    footerText: `If you want familiar faces, careful planning, and a private office that patients trust enough to drive for, we'd love to meet you.`,
    footerPrimaryLabel: 'Schedule Your Visit',
    footerPrimaryHref: '/#contact',
    footerSecondaryLabel: 'Call 254-699-4127',
    footerSecondaryHref: 'tel:+12546994127',
    headSchemas: [locationServiceSchema(page.city, page.file, page.description)],
  });
}
