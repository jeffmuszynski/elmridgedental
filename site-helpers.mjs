import fs from 'fs';

export const domain = 'https://www.elmridgedental.com';
export const practiceName = 'Elm Ridge Implant and Family Dentistry';
export const dentistEntityRef = {
  '@id': 'https://www.elmridgedental.com/#dentist',
};
export const organizationEntityRef = {
  '@id': 'https://www.elmridgedental.com/#organization',
};
export const globalDentistSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dentist',
  '@id': 'https://www.elmridgedental.com/#dentist',
  name: 'Elm Ridge Implant and Family Dentistry',
  image: 'https://www.elmridgedental.com/Building.webp',
  logo: 'https://www.elmridgedental.com/favicon-512.png',
  url: 'https://www.elmridgedental.com',
  telephone: '+1-254-699-4127',
  email: 'contact@elmridgedental.com',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2601 E. Elms Rd',
    addressLocality: 'Killeen',
    addressRegion: 'TX',
    postalCode: '76542',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 31.0976,
    longitude: -97.722,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '08:00',
      closes: '17:00',
    },
  ],
  areaServed: [
    { '@type': 'City', name: 'Killeen' },
    { '@type': 'City', name: 'Harker Heights' },
    { '@type': 'City', name: 'Belton' },
    { '@type': 'City', name: 'Copperas Cove' },
    { '@type': 'City', name: 'Nolanville' },
    { '@type': 'City', name: 'Salado' },
    { '@type': 'City', name: 'Temple' },
    { '@type': 'Place', name: 'Fort Hood' },
    { '@type': 'Place', name: 'Fort Cavazos' },
  ],
  medicalSpecialty: [
    'Dentistry',
    'Cosmetic Dentistry',
    'Dental Implants',
    'Sleep Apnea Oral Appliance Therapy',
  ],
  sameAs: [
    'https://www.facebook.com/ElmRidgeDental/',
    'https://www.yelp.com/biz/elm-ridge-implant-and-family-dentistry-killeen',
    'https://www.bbb.org/us/tx/killeen/profile/dentist/elm-ridge-implant-and-family-dentistry-0825-1000182119',
    'https://www.google.com/search?q=Elm+Ridge+Implant+and+Family+Dentistry&kgmid=/g/11gcmpmzf9',
    'https://killeenchamber.com/ElmRidgeImplantandFamilyDentistry?i=Nzg%3D',
    'https://nextdoor.com/pages/elm-ridge-implant-and-family-dentistry-killeen-tx/',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Dental Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Dental Implants', url: 'https://www.elmridgedental.com/dental-implants-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'All-on-4 Dental Implants', url: 'https://www.elmridgedental.com/all-on-4-dental-implants-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Full-Arch Dental Implants', url: 'https://www.elmridgedental.com/full-arch-dental-implants-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Single Tooth Implants', url: 'https://www.elmridgedental.com/single-tooth-implant-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Implant Bridges', url: 'https://www.elmridgedental.com/implant-bridge-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Snap-On Dentures', url: 'https://www.elmridgedental.com/snap-on-dentures-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Dentures', url: 'https://www.elmridgedental.com/dentures-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Cosmetic Dentistry', url: 'https://www.elmridgedental.com/cosmetic-dentistry-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Clear Aligners', url: 'https://www.elmridgedental.com/clear-aligners-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Dental Crowns', url: 'https://www.elmridgedental.com/dental-crowns-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Root Canals', url: 'https://www.elmridgedental.com/root-canal-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Sleep Apnea Oral Appliances', url: 'https://www.elmridgedental.com/sleep-apnea-dentist-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Emergency Dentistry', url: 'https://www.elmridgedental.com/emergency-dentist-killeen-tx' } },
    ],
  },
};

export const globalOrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.elmridgedental.com/#organization',
  name: practiceName,
  url: domain,
  logo: {
    '@type': 'ImageObject',
    url: `${domain}/favicon-512.png`,
  },
  image: `${domain}/Building.webp`,
  telephone: '+1-254-699-4127',
  email: 'contact@elmridgedental.com',
  sameAs: globalDentistSchema.sameAs,
};

export const globalWebsiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.elmridgedental.com/#website',
  name: practiceName,
  url: domain,
  publisher: organizationEntityRef,
};

export const doctorPersonSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://www.elmridgedental.com/#dr-jeff',
    name: 'Jeff Muszynski, DDS',
    jobTitle: 'Dentist',
    image: 'https://www.elmridgedental.com/Jeff%20photo.webp',
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Abilene Christian University' },
      { '@type': 'CollegeOrUniversity', name: 'University of Oklahoma College of Dentistry' },
    ],
    worksFor: dentistEntityRef,
    url: 'https://www.elmridgedental.com/dr-jeff-muszynski-dds',
    knowsAbout: [
      'Dental implants',
      'Full-arch dental implants',
      'Oral surgery',
      'Root canals',
      'Sedation dentistry',
      'Sleep apnea oral appliances',
      'Cosmetic dentistry',
      'Family dentistry',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://www.elmridgedental.com/#dr-kayla',
    name: 'Kayla Muszynski, DDS',
    jobTitle: 'Dentist',
    image: 'https://www.elmridgedental.com/kayla%20photo.webp',
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Abilene Christian University' },
      { '@type': 'CollegeOrUniversity', name: 'University of Oklahoma College of Dentistry' },
    ],
    worksFor: dentistEntityRef,
    url: 'https://www.elmridgedental.com/dr-kayla-muszynski-dds',
    knowsAbout: [
      'Cosmetic dentistry',
      'Family dentistry',
      'Pediatric and family care',
      'Restorative dentistry',
      'Cleanings and exams',
      'Crowns',
      'Bridges',
      'Veneers',
      'Whitening',
    ],
  },
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function stripHtml(value) {
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeFaqItems(qas) {
  return qas.map((item) => {
    if (Array.isArray(item)) {
      const [question, answer] = item;
      return { question, answer, answerHtml: escapeHtml(answer) };
    }
    const question = item.question ?? item.q ?? '';
    const answer = item.answer ?? stripHtml(item.answerHtml ?? '');
    const answerHtml = item.answerHtml ?? escapeHtml(answer);
    return { question, answer, answerHtml };
  });
}

function jsonLdTag(schema, dataSchema) {
  const attr = dataSchema ? ` data-schema="${dataSchema}"` : '';
  return `<script type="application/ld+json"${attr}>${JSON.stringify(schema)}</script>`;
}

export function head(title, description, path) {
  const hasBrand = title.includes(practiceName) || /\|\s*Elm Ridge\s*$/.test(title);
  const pageTitle = hasBrand ? title : `${title} | ${practiceName}`;
  const url = `${domain}${path}`;
  const image = `${domain}/hero.webp`;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${pageTitle}</title><meta name="description" content="${description}" /><meta name="robots" content="index, follow" /><meta name="application-name" content="${practiceName}" /><meta name="apple-mobile-web-app-title" content="${practiceName}" /><link rel="canonical" href="${url}" /><meta property="og:site_name" content="${practiceName}" /><meta property="og:title" content="${pageTitle}" /><meta property="og:description" content="${description}" /><meta property="og:type" content="website" /><meta property="og:url" content="${url}" /><meta property="og:image" content="${image}" /><meta property="og:image:alt" content="${practiceName}" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${pageTitle}" /><meta name="twitter:description" content="${description}" /><meta name="twitter:image" content="${image}" /><link rel="shortcut icon" href="/favicon.ico" /><link rel="icon" href="/favicon.ico" sizes="any" /><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" /><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" /><link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" /><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" /><link rel="manifest" href="/site.webmanifest" /><meta name="theme-color" content="#7FBDBD" /><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" /><script src="https://cdn.tailwindcss.com"></script><script>tailwind.config={theme:{extend:{colors:{teal:{DEFAULT:'#7FBDBD',dark:'#5A9A9A',light:'#A8D4D4',pale:'#EAF4F4'},charcoal:'#2C3E3E',stone:'#F5F0EB'},fontFamily:{display:['Cormorant Garamond','Georgia','serif'],body:['DM Sans','system-ui','sans-serif']}}}}</script><style>html{scroll-behavior:smooth}section{scroll-margin-top:120px}.prose-page p{line-height:1.8;color:rgba(44,62,62,.72)}.prose-page h2{font-family:'Cormorant Garamond',Georgia,serif;font-size:2.35rem;line-height:1.1;color:#2C3E3E;margin-top:2rem}.prose-page h3{font-size:1.05rem;font-weight:700;color:#2C3E3E;margin-top:1.5rem}.prose-page a{color:#5A9A9A;font-weight:600}.prose-page ul{list-style:disc;padding-left:1.25rem;color:rgba(44,62,62,.72);line-height:1.8}.prose-page table{width:100%;border-collapse:collapse;background:white}.prose-page th,.prose-page td{border:1px solid #A8D4D4;padding:.9rem;text-align:left;vertical-align:top}.prose-page th{background:#EAF4F4;color:#2C3E3E}.stop-card input{accent-color:#5A9A9A}</style>${jsonLdTag(doctorPersonSchemas, 'doctor-persons')}${jsonLdTag(globalOrganizationSchema, 'global-organization')}${jsonLdTag(globalWebsiteSchema, 'global-website')}${jsonLdTag(globalDentistSchema, 'global-dentist')}</head>`;
}

export function withHeadSchemas(documentHtml, ...schemas) {
  const tags = schemas.filter(Boolean).join('');
  if (!tags) return documentHtml;
  return documentHtml.replace('</head>', `${tags}</head>`);
}

export function header() {
  return `<header id="nav" class="sticky top-0 z-50 bg-white/85 backdrop-blur-sm border-b border-white/80"><div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 lg:gap-6"><a href="/" class="flex-shrink-0"><img src="/ELMRIDGE.webp" alt="${practiceName}" class="h-14 sm:h-16 lg:h-[80px] w-auto max-w-[min(68vw,260px)] sm:max-w-none object-contain" /></a><nav class="hidden lg:flex flex-1 justify-center items-center gap-6"><a href="/services" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal">Services</a><a href="/dental-implants-killeen-tx" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal">Dental Implants</a><a href="/cosmetic-dentistry-killeen-tx" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal">Cosmetic Dentistry</a><a href="/doctors" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal">Doctors</a><a href="/new-patients" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal">New Patients</a><a href="/patient-reviews" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal">Reviews</a></nav><div class="hidden lg:flex items-center gap-3"><a href="tel:+12546994127" class="font-body text-xs font-semibold tracking-[0.08em] text-charcoal/75 whitespace-nowrap">254-699-4127</a><a href="/request-appointment" class="px-7 py-3 bg-teal text-white font-body font-semibold tracking-[0.2em] uppercase text-xs hover:bg-teal-dark whitespace-nowrap">Request Appointment</a></div><button id="menu-btn" aria-label="Open menu" class="lg:hidden p-2 text-charcoal"><svg id="icon-menu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg><svg id="icon-close" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hidden"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button></div><div id="mobile-menu" class="hidden lg:hidden bg-white border-t border-teal-light px-6 pb-6 pt-4 flex-col gap-3"><a href="/services" class="block font-body text-xs tracking-widest uppercase text-charcoal py-2">Services</a><a href="/dental-implants-killeen-tx" class="block font-body text-xs tracking-widest uppercase text-charcoal py-2">Dental Implants</a><a href="/cosmetic-dentistry-killeen-tx" class="block font-body text-xs tracking-widest uppercase text-charcoal py-2">Cosmetic Dentistry</a><a href="/doctors" class="block font-body text-xs tracking-widest uppercase text-charcoal py-2">Doctors</a><a href="/new-patients" class="block font-body text-xs tracking-widest uppercase text-charcoal py-2">New Patients</a><a href="/patient-reviews" class="block font-body text-xs tracking-widest uppercase text-charcoal py-2">Reviews</a><a href="/request-appointment" class="mt-2 inline-block px-6 py-3 bg-teal text-white font-body font-semibold tracking-widest uppercase text-xs">Request an Appointment</a></div></header>`;
}

export function footer() {
  return `<footer class="bg-charcoal pt-16 pb-8"><div class="max-w-7xl mx-auto px-6"><div class="grid grid-cols-1 md:grid-cols-[1.1fr,1.2fr,0.9fr] gap-12 mb-12"><div><div class="w-24 h-24 mb-5"><img src="/square logo.webp" alt="${practiceName} logo" class="w-full h-full object-contain" loading="lazy" decoding="async" /></div><h3 class="font-display text-xl font-light text-white mb-3" style="letter-spacing:0.04em;">Elm Ridge Implant<br />and Family Dentistry</h3><p class="font-body text-sm text-white/45 leading-relaxed">Private dental care in Killeen built on clear answers, familiar faces, and long-term relationships.</p></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6"><div><p class="font-body text-xs tracking-widest uppercase text-teal mb-5">Navigation</p><ul class="space-y-3"><li><a href="/services" class="font-body text-sm text-white/55 hover:text-white">Services</a></li><li><a href="/dental-implants-killeen-tx" class="font-body text-sm text-white/55 hover:text-white">Dental Implants</a></li><li><a href="/cosmetic-dentistry-killeen-tx" class="font-body text-sm text-white/55 hover:text-white">Cosmetic Dentistry</a></li><li><a href="/doctors" class="font-body text-sm text-white/55 hover:text-white">Doctors</a></li><li><a href="/new-patients" class="font-body text-sm text-white/55 hover:text-white">New Patients</a></li><li><a href="/patient-reviews" class="font-body text-sm text-white/55 hover:text-white">Reviews</a></li><li><a href="/request-appointment" class="font-body text-sm text-white/55 hover:text-white">Request Appointment</a></li></ul></div><div><p class="font-body text-xs tracking-widest uppercase text-teal mb-5">Patient Resources</p><ul class="space-y-3"><li><a href="/insurance-and-financing" class="font-body text-sm text-white/55 hover:text-white">Insurance &amp; Financing</a></li><li><a href="/post-operative-instructions" class="font-body text-sm text-white/55 hover:text-white">Post-Op Instructions</a></li><li><a href="/faq" class="font-body text-sm text-white/55 hover:text-white">FAQ</a></li><li><a href="/blog" class="font-body text-sm text-white/55 hover:text-white">Patient Education</a></li><li><a href="/ai-summary" class="font-body text-sm text-white/55 hover:text-white">Practice Facts</a></li><li><a href="/accessibility-statement" class="font-body text-sm text-white/55 hover:text-white">Accessibility</a></li></ul></div></div><div><p class="font-body text-xs tracking-widest uppercase text-teal mb-5">Contact</p><address class="not-italic space-y-3"><p class="font-body text-sm text-white/55"><a href="https://www.google.com/maps?q=2601+E+Elms+Rd,+Killeen,+TX+76542" target="_blank" rel="noopener" class="hover:text-white">2601 E Elms Rd<br />Killeen, TX 76542</a></p><p><a href="tel:+12546994127" class="font-body text-sm text-white/55 hover:text-white">254-699-4127</a></p><p class="font-body text-sm text-white/55">Monday - Thursday: 8 AM - 5 PM<br />Friday - Sunday: Closed</p></address></div></div><div class="border-t border-white/10 pt-6 pr-16 sm:pr-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"><p class="font-body text-xs text-white/30">&copy; 2026 ${practiceName}. All rights reserved.</p><p class="font-body text-xs text-white/30">Designed for the community we serve.</p></div></div></footer>`;
}

export const menuScript = `<script>const menuBtn=document.getElementById('menu-btn'),mobileMenu=document.getElementById('mobile-menu'),iconMenu=document.getElementById('icon-menu'),iconClose=document.getElementById('icon-close');if(menuBtn&&mobileMenu){menuBtn.addEventListener('click',()=>{const open=!mobileMenu.classList.contains('hidden');mobileMenu.classList.toggle('hidden');mobileMenu.classList.toggle('flex');iconMenu&&iconMenu.classList.toggle('hidden',!open);iconClose&&iconClose.classList.toggle('hidden',open)});mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileMenu.classList.add('hidden');mobileMenu.classList.remove('flex');iconMenu&&iconMenu.classList.remove('hidden');iconClose&&iconClose.classList.add('hidden')}));}</script>`;

export function breadcrumb(path, name) {
  const itemListElement = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${domain}/` },
  ];
  if (path && path !== '/') {
    itemListElement.push({
      '@type': 'ListItem',
      position: 2,
      name,
      item: `${domain}${path}`,
    });
  }
  return jsonLdTag({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  }, 'breadcrumb');
}

export function faqSchema(qas) {
  const items = normalizeFaqItems(qas);
  return jsonLdTag({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }, 'faq-page');
}

export function medicalProcedureSchema(name, procedureType, bodyLocation) {
  return jsonLdTag({
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name,
    procedureType,
    bodyLocation,
    provider: dentistEntityRef,
  }, 'medical-procedure');
}

export function jsonLd(schema, dataSchema = '') {
  return jsonLdTag(schema, dataSchema);
}

export function writePage(file, opts) {
  const {
    path,
    title,
    description,
    crumb,
    kicker,
    h1,
    intro,
    image,
    alt,
    body,
    faq = [],
    faqHeading = 'Frequently Asked Questions',
    heroPrimaryLabel = 'Request an Appointment',
    heroPrimaryHref = '/request-appointment',
    heroSecondaryLabel = 'Call 254-699-4127',
    heroSecondaryHref = 'tel:+12546994127',
    footerTitle = 'Ready for a clearer plan?',
    footerText = 'Schedule a visit with Elm Ridge Implant and Family Dentistry in Killeen.',
    footerPrimaryLabel = 'Request an Appointment',
    footerPrimaryHref = '/request-appointment',
    footerSecondaryLabel = '',
    footerSecondaryHref = '',
    headSchemas = [],
  } = opts;
  const faqItems = normalizeFaqItems(faq);
  const imageHtml = image ? `<div><img src="/${image}" alt="${alt}" class="w-full shadow-2xl" loading="eager" decoding="async" /></div>` : '';
  const grid = image ? 'grid lg:grid-cols-2 gap-12 items-center' : '';
  const faqHtml = faqItems.length ? `<section class="py-16 bg-stone"><div class="max-w-4xl mx-auto px-6"><h2 class="font-display text-4xl mb-8">${faqHeading}</h2><div class="space-y-4">${faqItems.map(({ question, answerHtml })=>`<details class="bg-white border border-teal-light p-6"><summary class="font-semibold">${question}</summary><p class="mt-3 text-charcoal/65 leading-7">${answerHtml}</p></details>`).join('')}</div></div></section>` : '';
  const footerSecondaryCta = footerSecondaryLabel ? `<a href="${footerSecondaryHref}" class="inline-block border border-teal px-8 py-4 text-xs uppercase tracking-widest font-semibold text-teal">${footerSecondaryLabel}</a>` : '';
  fs.writeFileSync(file, `${withHeadSchemas(head(title, description, path), faqItems.length ? faqSchema(faqItems) : '', breadcrumb(path, crumb), ...headSchemas)}<body class="font-body text-charcoal bg-stone">${header()}<main id="main-content"><section class="bg-charcoal text-white py-20"><div class="max-w-6xl mx-auto px-6 ${grid}"><div><nav class="text-xs uppercase tracking-widest text-teal mb-6"><a href="/">Home</a> / ${crumb}</nav><p class="text-xs uppercase tracking-widest text-teal mb-4">${kicker}</p><h1 class="font-display text-5xl md:text-6xl font-light leading-tight mb-6">${h1}</h1><p class="text-white/70 leading-8 text-lg mb-8">${intro}</p><div class="flex flex-col sm:flex-row gap-4"><a href="${heroPrimaryHref}" class="inline-block bg-teal px-8 py-4 text-xs uppercase tracking-widest font-semibold text-center">${heroPrimaryLabel}</a><a href="${heroSecondaryHref}" class="inline-block border border-teal px-8 py-4 text-xs uppercase tracking-widest font-semibold text-teal text-center">${heroSecondaryLabel}</a></div></div>${imageHtml}</div></section>${body}${faqHtml}<section class="py-16 bg-charcoal text-white text-center"><div class="max-w-3xl mx-auto px-6"><h2 class="font-display text-4xl mb-4">${footerTitle}</h2><p class="text-white/65 mb-8">${footerText}</p><div class="flex flex-col sm:flex-row items-center justify-center gap-4"><a href="${footerPrimaryHref}" class="inline-block bg-teal px-8 py-4 text-xs uppercase tracking-widest font-semibold">${footerPrimaryLabel}</a>${footerSecondaryCta}</div></div></section></main>${footer(false)}<script src="/accessibility.js" defer></script>${menuScript}</body></html>`);
}
