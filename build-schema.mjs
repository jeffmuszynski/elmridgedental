import fs from 'fs';
import path from 'path';
import { domain, practiceName } from './site-helpers.mjs';

const dentistSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dentist',
  '@id': `${domain}/#dentist`,
  name: practiceName,
  image: `${domain}/Building.webp`,
  url: domain,
  telephone: '+1-254-699-4127',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2601 E. Elms Rd',
    addressLocality: 'Killeen',
    addressRegion: 'TX',
    postalCode: '76542',
    addressCountry: 'US',
  },
  areaServed: [
    { '@type': 'City', name: 'Killeen' },
    { '@type': 'City', name: 'Harker Heights' },
    { '@type': 'City', name: 'Nolanville' },
    { '@type': 'City', name: 'Belton' },
    { '@type': 'City', name: 'Salado' },
  ],
};

const postOpFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What should I expect after a tooth extraction?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Some oozing is normal after an extraction, but you should not be soaking through gauze repeatedly. Use firm pressure with gauze directly over the site and avoid straws, smoking, forceful spitting, and aggressive rinsing for 1 week.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to heal after dental implants?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Typical implant healing is 3 to 4 months. Healing may be 6 months if sinus grafting was performed.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it normal to have sensitivity after a filling?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Some cold sensitivity is normal for a few days to a couple of weeks after a filling. It should gradually improve.',
      },
    },
    {
      '@type': 'Question',
      name: 'When can I eat after dental work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'After a filling, do not eat until numbness has worn off. After an extraction, eat soft foods for 24 hours and avoid seeds, popcorn, small particles, and carbonated beverages for 3 days.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long should I wear immediate dentures?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Leave immediate dentures in for the first 48 hours, removing only to clean. After 48 hours, remove them at night while sleeping and at least once daily for cleaning.',
      },
    },
  ],
};

const serviceProcedures = {
  'dental-implants-killeen-tx': ['Dental Implants', 'Surgical', 'Jaw'],
  'single-tooth-implant-killeen-tx': ['Single Dental Implant', 'Surgical', 'Jaw'],
  'implant-bridges-killeen-tx': ['Implant Bridges', 'Surgical', 'Jaw'],
  'full-arch-dental-implants-killeen-tx': ['Full-Arch Dental Implants', 'Surgical', 'Jaw'],
  'all-on-4-dental-implants-killeen-tx': ['All-on-4 Dental Implants', 'Surgical', 'Jaw'],
  'snap-on-dentures-killeen-tx': ['Snap-On Dentures', 'Surgical', 'Jaw'],
  'dental-crowns-killeen-tx': ['Dental Crowns', 'Restorative', 'Tooth'],
  'root-canal-killeen-tx': ['Root Canal Therapy', 'Restorative', 'Tooth'],
  'dentures-killeen-tx': ['Dentures', 'Restorative', 'Mouth'],
  'invisalign-killeen-tx': ['Invisalign', 'Orthodontic', 'Teeth'],
  'cosmetic-dentistry-killeen-tx': ['Cosmetic Dentistry', 'Restorative', 'Teeth'],
  'emergency-dentist-killeen-tx': ['Emergency Dental Care', 'Diagnostic', 'Mouth'],
  'sleep-dentistry-killeen-tx': ['Sleep Dentistry Consultation', 'Diagnostic', 'Airway'],
};

const postOpMedicalPages = {
  'post-op/fillings': ['Post-Operative Instructions for Dental Fillings', 'Dental Fillings'],
  'post-op/crowns': ['Post-Operative Instructions for Temporary Crowns', 'Temporary Crowns'],
  'post-op/extractions': ['Post-Operative Instructions for Tooth Extractions', 'Tooth Extractions'],
  'post-op/implants': ['Post-Operative Instructions for Dental Implants', 'Dental Implants'],
  'post-op/bone-graft': ['Post-Operative Instructions for Bone Grafting', 'Bone Grafting'],
  'post-op/root-canal': ['Post-Operative Instructions for Root Canal Therapy', 'Root Canal Therapy'],
  'post-op/deep-cleaning': ['Post-Operative Instructions for Deep Cleanings', 'Deep Cleanings'],
  'post-op/whitening': ['Post-Operative Instructions for Teeth Whitening', 'Teeth Whitening'],
  'post-op/immediate-dentures': ['Post-Operative Instructions for Immediate Dentures', 'Immediate Dentures'],
};

function schemaScript(schema, marker) {
  return `<script type="application/ld+json" data-schema="${marker}">${JSON.stringify(schema)}</script>`;
}

function removeManagedSchemas(html) {
  return html.replace(/<script type="application\/ld\+json"(?: data-schema="[^"]+")?>([\s\S]*?)<\/script>/g, (match, json) => {
    if (match.includes('data-schema="global-dentist"') || match.includes('data-schema="post-op-faq"') || match.includes('data-schema="medical-procedure"') || match.includes('data-schema="medical-web-page"')) {
      return '';
    }
    try {
      const parsed = JSON.parse(json);
      if (parsed?.['@type'] === 'Dentist') return '';
    } catch {
      return match;
    }
    return match;
  });
}

function injectHeadSchema(html, schema, marker) {
  if (html.includes(`data-schema="${marker}"`)) return html;
  return html.replace('</head>', `${schemaScript(schema, marker)}</head>`);
}

function appendBodySchema(html, schema, marker) {
  if (html.includes(`data-schema="${marker}"`)) return html;
  return html.replace('</body>', `${schemaScript(schema, marker)}</body>`);
}

function medicalProcedureSchema([name, procedureType, bodyLocation]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name,
    procedureType,
    bodyLocation,
    provider: {
      '@type': 'Dentist',
      '@id': `${domain}/#dentist`,
      name: practiceName,
    },
  };
}

function medicalWebPageSchema([name, about]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name,
    about: {
      '@type': 'MedicalProcedure',
      name: about,
    },
    publisher: {
      '@type': 'Dentist',
      '@id': `${domain}/#dentist`,
      name: practiceName,
    },
  };
}

function homeBreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: domain,
      },
    ],
  };
}

function routeForFile(file) {
  return file.replaceAll('\\', '/');
}

function htmlFiles(dir = '.') {
  const files = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (item.name === '.git' || item.name === 'node_modules' || item.name === 'temporary screenshots') continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...htmlFiles(full));
      continue;
    }
    if (!item.isFile()) continue;
    const text = fs.readFileSync(full, 'utf8');
    if (text.includes('<html') && text.includes('</head>')) files.push(full);
  }
  return files;
}

for (const file of htmlFiles()) {
  const route = routeForFile(file);
  let html = removeManagedSchemas(fs.readFileSync(file, 'utf8'));
  html = injectHeadSchema(html, dentistSchema, 'global-dentist');

  if (route === 'post-operative-instructions') {
    html = appendBodySchema(html, postOpFaqSchema, 'post-op-faq');
  }

  if (serviceProcedures[route]) {
    html = appendBodySchema(html, medicalProcedureSchema(serviceProcedures[route]), 'medical-procedure');
  }

  if (postOpMedicalPages[route]) {
    html = appendBodySchema(html, medicalWebPageSchema(postOpMedicalPages[route]), 'medical-web-page');
  }

  if (!html.includes('"@type":"BreadcrumbList"') && !html.includes('"@type": "BreadcrumbList"')) {
    html = appendBodySchema(html, homeBreadcrumbSchema(), 'breadcrumb');
  }

  fs.writeFileSync(file, html);
}
