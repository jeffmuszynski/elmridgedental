import fs from 'fs';

export const domain = 'https://www.elmridgedental.com';
export const practiceName = 'Elm Ridge Implant and Family Dentistry';
export const dentistEntityRef = {
  '@id': 'https://www.elmridgedental.com/#dentist',
};
export const globalDentistSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dentist',
  '@id': 'https://www.elmridgedental.com/#dentist',
  name: 'Elm Ridge Implant and Family Dentistry',
  image: 'https://www.elmridgedental.com/Building.webp',
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
    { '@type': 'Place', name: 'Fort Cavazos' },
  ],
  medicalSpecialty: [
    'Dentistry',
    'Cosmetic Dentistry',
    'Implant Dentistry',
    'Sleep Dentistry',
  ],
  sameAs: [
    'https://www.facebook.com/ElmRidgeDental/',
    'https://www.yelp.com/biz/elm-ridge-implant-and-family-dentistry-killeen',
    'https://www.bbb.org/us/tx/killeen/profile/dentist/elm-ridge-implant-and-family-dentistry-0825-1000182119',
    'https://www.google.com/search?q=Elm+Ridge+Implant+and+Family+Dentistry&kgmid=/g/11gcmpmzf9',
    'https://killeenchamber.com/ElmRidgeImplantandFamilyDentistry?i=Nzg%3D',
    'https://nextdoor.com/pages/elm-ridge-implant-and-family-dentistry-killeen-tx/',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '559',
    bestRating: '5',
    worstRating: '1',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Dental Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Dental Implants', url: 'https://www.elmridgedental.com/dental-implants-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'All-on-4 Dental Implants', url: 'https://www.elmridgedental.com/all-on-4-dental-implants-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Full-Arch Dental Implants', url: 'https://www.elmridgedental.com/full-arch-dental-implants-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Single Tooth Implants', url: 'https://www.elmridgedental.com/single-tooth-implant-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Implant Bridges', url: 'https://www.elmridgedental.com/implant-bridges-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Snap-On Dentures', url: 'https://www.elmridgedental.com/snap-on-dentures-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Dentures', url: 'https://www.elmridgedental.com/dentures-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Cosmetic Dentistry', url: 'https://www.elmridgedental.com/cosmetic-dentistry-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Invisalign', url: 'https://www.elmridgedental.com/invisalign-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Dental Crowns', url: 'https://www.elmridgedental.com/dental-crowns-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Root Canals', url: 'https://www.elmridgedental.com/root-canal-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Sleep Dentistry', url: 'https://www.elmridgedental.com/sleep-dentistry-killeen-tx' } },
      { '@type': 'Offer', itemOffered: { '@type': 'MedicalProcedure', name: 'Emergency Dentistry', url: 'https://www.elmridgedental.com/emergency-dentist-killeen-tx' } },
    ],
  },
};

export const doctorPersonSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://www.elmridgedental.com/#dr-jeff',
    name: 'Dr. Jeff Muszynski, DDS',
    jobTitle: 'Dentist',
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Abilene Christian University' },
      { '@type': 'CollegeOrUniversity', name: 'University of Oklahoma College of Dentistry' },
    ],
    worksFor: dentistEntityRef,
    url: 'https://www.elmridgedental.com/#team',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://www.elmridgedental.com/#dr-kayla',
    name: 'Dr. Kayla Muszynski, DDS',
    jobTitle: 'Dentist',
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Abilene Christian University' },
      { '@type': 'CollegeOrUniversity', name: 'University of Oklahoma College of Dentistry' },
    ],
    worksFor: dentistEntityRef,
    url: 'https://www.elmridgedental.com/#team',
  },
];

export function head(title, description, path) {
  const pageTitle = title.includes(practiceName) ? title : `${title} | ${practiceName}`;
  const url = `${domain}${path}`;
  const image = `${domain}/hero.webp`;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${pageTitle}</title><meta name="description" content="${description}" /><meta name="robots" content="index, follow" /><link rel="canonical" href="${url}" /><meta property="og:site_name" content="${practiceName}" /><meta property="og:title" content="${pageTitle}" /><meta property="og:description" content="${description}" /><meta property="og:type" content="website" /><meta property="og:url" content="${url}" /><meta property="og:image" content="${image}" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${pageTitle}" /><meta name="twitter:description" content="${description}" /><meta name="twitter:image" content="${image}" /><link rel="icon" type="image/webp" href="/square logo.webp" /><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" /><script src="https://cdn.tailwindcss.com"></script><script>tailwind.config={theme:{extend:{colors:{teal:{DEFAULT:'#7FBDBD',dark:'#5A9A9A',light:'#A8D4D4',pale:'#EAF4F4'},charcoal:'#2C3E3E',stone:'#F5F0EB'},fontFamily:{display:['Cormorant Garamond','Georgia','serif'],body:['DM Sans','system-ui','sans-serif']}}}}</script><style>html{scroll-behavior:smooth}section{scroll-margin-top:120px}.prose-page p{line-height:1.8;color:rgba(44,62,62,.72)}.prose-page h2{font-family:'Cormorant Garamond',Georgia,serif;font-size:2.35rem;line-height:1.1;color:#2C3E3E;margin-top:2rem}.prose-page h3{font-size:1.05rem;font-weight:700;color:#2C3E3E;margin-top:1.5rem}.prose-page a{color:#5A9A9A;font-weight:600}.prose-page ul{list-style:disc;padding-left:1.25rem;color:rgba(44,62,62,.72);line-height:1.8}.prose-page table{width:100%;border-collapse:collapse;background:white}.prose-page th,.prose-page td{border:1px solid #A8D4D4;padding:.9rem;text-align:left;vertical-align:top}.prose-page th{background:#EAF4F4;color:#2C3E3E}.stop-card input{accent-color:#5A9A9A}</style><script type="application/ld+json" data-schema="doctor-persons">${JSON.stringify(doctorPersonSchemas)}</script><script type="application/ld+json" data-schema="global-dentist">{"@context":"https://schema.org","@type":"Dentist","@id":"https://www.elmridgedental.com/#dentist","name":"Elm Ridge Implant and Family Dentistry","image":"https://www.elmridgedental.com/Building.webp","url":"https://www.elmridgedental.com","telephone":"+1-254-699-4127","email":"contact@elmridgedental.com","priceRange":"$","address":{"@type":"PostalAddress","streetAddress":"2601 E. Elms Rd","addressLocality":"Killeen","addressRegion":"TX","postalCode":"76542","addressCountry":"US"},"geo":{"@type":"GeoCoordinates","latitude":31.0976,"longitude":-97.722},"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday"],"opens":"08:00","closes":"17:00"}],"areaServed":[{"@type":"City","name":"Killeen"},{"@type":"City","name":"Harker Heights"},{"@type":"City","name":"Belton"},{"@type":"City","name":"Copperas Cove"},{"@type":"City","name":"Nolanville"},{"@type":"City","name":"Salado"},{"@type":"City","name":"Temple"},{"@type":"Place","name":"Fort Cavazos"}],"medicalSpecialty":["Dentistry","Cosmetic Dentistry","Implant Dentistry","Sleep Dentistry"],"sameAs":["https://www.facebook.com/ElmRidgeDental/","https://www.yelp.com/biz/elm-ridge-implant-and-family-dentistry-killeen","https://www.bbb.org/us/tx/killeen/profile/dentist/elm-ridge-implant-and-family-dentistry-0825-1000182119","https://www.google.com/search?q=Elm+Ridge+Implant+and+Family+Dentistry&kgmid=/g/11gcmpmzf9","https://killeenchamber.com/ElmRidgeImplantandFamilyDentistry?i=Nzg%3D","https://nextdoor.com/pages/elm-ridge-implant-and-family-dentistry-killeen-tx/"],"aggregateRating":{"@type":"AggregateRating","ratingValue":"5.0","reviewCount":"559","bestRating":"5","worstRating":"1"},"hasOfferCatalog":{"@type":"OfferCatalog","name":"Dental Services","itemListElement":[{"@type":"Offer","itemOffered":{"@type":"MedicalProcedure","name":"Dental Implants","url":"https://www.elmridgedental.com/dental-implants-killeen-tx"}},{"@type":"Offer","itemOffered":{"@type":"MedicalProcedure","name":"All-on-4 Dental Implants","url":"https://www.elmridgedental.com/all-on-4-dental-implants-killeen-tx"}},{"@type":"Offer","itemOffered":{"@type":"MedicalProcedure","name":"Full-Arch Dental Implants","url":"https://www.elmridgedental.com/full-arch-dental-implants-killeen-tx"}},{"@type":"Offer","itemOffered":{"@type":"MedicalProcedure","name":"Single Tooth Implants","url":"https://www.elmridgedental.com/single-tooth-implant-killeen-tx"}},{"@type":"Offer","itemOffered":{"@type":"MedicalProcedure","name":"Implant Bridges","url":"https://www.elmridgedental.com/implant-bridges-killeen-tx"}},{"@type":"Offer","itemOffered":{"@type":"MedicalProcedure","name":"Snap-On Dentures","url":"https://www.elmridgedental.com/snap-on-dentures-killeen-tx"}},{"@type":"Offer","itemOffered":{"@type":"MedicalProcedure","name":"Dentures","url":"https://www.elmridgedental.com/dentures-killeen-tx"}},{"@type":"Offer","itemOffered":{"@type":"MedicalProcedure","name":"Cosmetic Dentistry","url":"https://www.elmridgedental.com/cosmetic-dentistry-killeen-tx"}},{"@type":"Offer","itemOffered":{"@type":"MedicalProcedure","name":"Invisalign","url":"https://www.elmridgedental.com/invisalign-killeen-tx"}},{"@type":"Offer","itemOffered":{"@type":"MedicalProcedure","name":"Dental Crowns","url":"https://www.elmridgedental.com/dental-crowns-killeen-tx"}},{"@type":"Offer","itemOffered":{"@type":"MedicalProcedure","name":"Root Canals","url":"https://www.elmridgedental.com/root-canal-killeen-tx"}},{"@type":"Offer","itemOffered":{"@type":"MedicalProcedure","name":"Sleep Dentistry","url":"https://www.elmridgedental.com/sleep-dentistry-killeen-tx"}},{"@type":"Offer","itemOffered":{"@type":"MedicalProcedure","name":"Emergency Dentistry","url":"https://www.elmridgedental.com/emergency-dentist-killeen-tx"}}]}}</script><script type="application/ld+json" data-schema="breadcrumb">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://www.elmridgedental.com"}]}</script><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:domain+'/'},{'@type':'ListItem',position:2,name,item:domain+path}]})}</script><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:qas.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))})}</script></head>`;
}

export function withHeadSchemas(documentHtml, ...schemas) {
  const tags = schemas.filter(Boolean).join('');
  if (!tags) return documentHtml;
  return documentHtml.replace('</head>', `${tags}</head>`);
}

export function header() {
  return `<header id="nav" class="sticky top-0 z-50 bg-white/85 backdrop-blur-sm border-b border-white/80"><div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 lg:gap-6"><a href="/" class="flex-shrink-0"><img src="/ELMRIDGE.webp" alt="${practiceName}" class="h-14 sm:h-16 lg:h-[80px] w-auto max-w-[min(68vw,260px)] sm:max-w-none object-contain" /></a><nav class="hidden lg:flex flex-1 justify-center items-center gap-6"><a href="/#services" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal">Services</a><a href="/dental-implants-killeen-tx" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal">Implants</a><a href="/cosmetic-dentistry-killeen-tx" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal">Cosmetic</a><a href="/faq" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal">FAQ</a><a href="/#team" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal">About</a><a href="/#reviews" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal">Reviews</a></nav><div class="hidden lg:flex items-center gap-3"><a href="tel:+12546994127" class="font-body text-xs font-semibold tracking-[0.08em] text-charcoal/75 whitespace-nowrap">254-699-4127</a><a href="/#contact" class="px-7 py-3 bg-teal text-white font-body font-semibold tracking-[0.2em] uppercase text-xs hover:bg-teal-dark whitespace-nowrap">Request Appointment</a></div><button id="menu-btn" aria-label="Open menu" class="lg:hidden p-2 text-charcoal"><svg id="icon-menu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg><svg id="icon-close" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hidden"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button></div><div id="mobile-menu" class="hidden lg:hidden bg-white border-t border-teal-light px-6 pb-6 pt-4 flex-col gap-3"><a href="/#services" class="block font-body text-xs tracking-widest uppercase text-charcoal py-2">Services</a><a href="/dental-implants-killeen-tx" class="block font-body text-xs tracking-widest uppercase text-charcoal py-2">Implants</a><a href="/cosmetic-dentistry-killeen-tx" class="block font-body text-xs tracking-widest uppercase text-charcoal py-2">Cosmetic</a><a href="/faq" class="block font-body text-xs tracking-widest uppercase text-charcoal py-2">FAQ</a><a href="/#team" class="block font-body text-xs tracking-widest uppercase text-charcoal py-2">Our Doctors</a><a href="/#contact" class="mt-2 inline-block px-6 py-3 bg-teal text-white font-body font-semibold tracking-widest uppercase text-xs">Request an Appointment</a></div></header>`;
}

export function footer() {
  return `<footer class="bg-charcoal pt-16 pb-8"><div class="max-w-7xl mx-auto px-6"><div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12"><div><div class="inline-flex items-center justify-center w-24 h-24 bg-teal overflow-hidden mb-5"><img src="/square logo.webp" alt="${practiceName} logo" class="w-20 h-20 object-contain" loading="lazy" decoding="async" /></div><h3 class="font-display text-xl font-light text-white mb-3" style="letter-spacing:0.04em;">Elm Ridge Implant<br />and Family Dentistry</h3><p class="font-body text-sm text-white/45 leading-relaxed">A practice built on lasting relationships and exceptional care.</p></div><div><p class="font-body text-xs tracking-widest uppercase text-teal mb-5">Navigation</p><ul class="space-y-3"><li><a href="/#services" class="font-body text-sm text-white/55 hover:text-white">Services</a></li><li><a href="/dental-implants-killeen-tx" class="font-body text-sm text-white/55 hover:text-white">Implants</a></li><li><a href="/cosmetic-dentistry-killeen-tx" class="font-body text-sm text-white/55 hover:text-white">Cosmetic</a></li><li><a href="/faq" class="font-body text-sm text-white/55 hover:text-white">FAQ</a></li><li><a href="/#team" class="font-body text-sm text-white/55 hover:text-white">Our Doctors</a></li><li><a href="/#before-after" class="font-body text-sm text-white/55 hover:text-white">Before &amp; After</a></li><li><a href="/#contact" class="font-body text-sm text-white/55 hover:text-white">Contact</a></li><li><a href="/insurance-and-financing" class="font-body text-sm text-white/55 hover:text-white">Insurance &amp; Financing</a></li><li><a href="/post-operative-instructions" class="font-body text-sm text-white/55 hover:text-white">Post-Op Instructions</a></li><li><a href="/blog" class="font-body text-sm text-white/55 hover:text-white">Blog</a></li><li><a href="/accessibility-statement" class="font-body text-sm text-white/55 hover:text-white">Accessibility</a></li></ul></div><div><p class="font-body text-xs tracking-widest uppercase text-teal mb-5">Contact</p><address class="not-italic space-y-3"><p class="font-body text-sm text-white/55">2601 E Elms Rd<br />Killeen, TX 76542</p><p><a href="tel:+12546994127" class="font-body text-sm text-white/55 hover:text-white">254-699-4127</a></p><p class="font-body text-sm text-white/55">Monday - Thursday: 8am - 5pm<br />Friday - Sunday: Closed</p></address></div></div><div class="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3"><p class="font-body text-xs text-white/30">&copy; 2026 ${practiceName}. All rights reserved.</p><p class="font-body text-xs text-white/30">Designed for the community we serve.</p></div></div></footer>`;
}

export const menuScript = `<script>const menuBtn=document.getElementById('menu-btn'),mobileMenu=document.getElementById('mobile-menu'),iconMenu=document.getElementById('icon-menu'),iconClose=document.getElementById('icon-close');if(menuBtn&&mobileMenu){menuBtn.addEventListener('click',()=>{const open=!mobileMenu.classList.contains('hidden');mobileMenu.classList.toggle('hidden');mobileMenu.classList.toggle('flex');iconMenu&&iconMenu.classList.toggle('hidden',!open);iconClose&&iconClose.classList.toggle('hidden',open)});mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileMenu.classList.add('hidden');mobileMenu.classList.remove('flex');iconMenu&&iconMenu.classList.remove('hidden');iconClose&&iconClose.classList.add('hidden')}));}</script>`;

export function breadcrumb(path, name) {
  return ``;
}

export function faqSchema(qas) {
  return ``;
}

export function writePage(file, opts) {
  const { path, title, description, crumb, kicker, h1, intro, image, alt, body, faq = [] } = opts;
  const imageHtml = image ? `<div><img src="/${image}" alt="${alt}" class="w-full shadow-2xl" loading="eager" decoding="async" /></div>` : '';
  const grid = image ? 'grid lg:grid-cols-2 gap-12 items-center' : '';
  const faqHtml = faq.length ? `<section class="py-16 bg-stone"><div class="max-w-4xl mx-auto px-6"><h2 class="font-display text-4xl mb-8">Frequently Asked Questions</h2><div class="space-y-4">${faq.map(([q,a])=>`<details class="bg-white border border-teal-light p-6"><summary class="font-semibold">${q}</summary><p class="mt-3 text-charcoal/65 leading-7">${a}</p></details>`).join('')}</div></div></section>` : '';
  fs.writeFileSync(file, `${withHeadSchemas(head(title, description, path), faq.length ? faqSchema(faq) : '', breadcrumb(path, crumb))}<body class="font-body text-charcoal bg-stone">${header()}<main id="main-content"><section class="bg-charcoal text-white py-20"><div class="max-w-6xl mx-auto px-6 ${grid}"><div><nav class="text-xs uppercase tracking-widest text-teal mb-6"><a href="/">Home</a> / ${crumb}</nav><p class="text-xs uppercase tracking-widest text-teal mb-4">${kicker}</p><h1 class="font-display text-5xl md:text-6xl font-light leading-tight mb-6">${h1}</h1><p class="text-white/70 leading-8 text-lg mb-8">${intro}</p><div class="flex flex-col sm:flex-row gap-4"><a href="/#contact" class="inline-block bg-teal px-8 py-4 text-xs uppercase tracking-widest font-semibold text-center">Request an Appointment</a><a href="tel:+12546994127" class="inline-block border border-teal px-8 py-4 text-xs uppercase tracking-widest font-semibold text-teal text-center">Call 254-699-4127</a></div></div>${imageHtml}</div></section>${body}${faqHtml}<section class="py-16 bg-charcoal text-white text-center"><div class="max-w-3xl mx-auto px-6"><h2 class="font-display text-4xl mb-4">Ready for a clearer plan?</h2><p class="text-white/65 mb-8">Schedule a visit with Elm Ridge Implant and Family Dentistry in Killeen.</p><a href="/#contact" class="inline-block bg-teal px-8 py-4 text-xs uppercase tracking-widest font-semibold">Request an Appointment</a></div></section></main>${footer(false)}<script src="/accessibility.js" defer></script>${menuScript}</body></html>`);
}
