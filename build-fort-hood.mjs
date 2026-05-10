import fs from 'fs';
import { writePage, jsonLd, dentistEntityRef, domain } from './site-helpers.mjs';

const fortHoodServiceSchema = jsonLd({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Private Dental Care Near Fort Hood',
  url: `${domain}/dentist-near-fort-hood`,
  description:
    'Private dental care near Fort Hood including family dentistry, emergency dentistry, dental implants, cosmetic dentistry, and preventive care.',
  provider: dentistEntityRef,
  areaServed: [
    { '@type': 'Place', name: 'Fort Hood' },
    { '@type': 'City', name: 'Killeen' },
    { '@type': 'City', name: 'Harker Heights' },
    { '@type': 'City', name: 'Nolanville' },
    { '@type': 'City', name: 'Copperas Cove' },
  ],
  serviceType: [
    'Family Dentistry',
    'Emergency Dentistry',
    'Dental Implants',
    'Cosmetic Dentistry',
  ],
}, 'fort-hood-service');

writePage('dentist-near-fort-hood', {
  path: '/dentist-near-fort-hood',
  title: 'Dentist Near Fort Hood | Elm Ridge Implant and Family Dentistry',
  description:
    'Looking for a private dentist near Fort Hood? Elm Ridge Implant and Family Dentistry in Killeen offers family, emergency, cosmetic, and implant care with a focus on comfort, consistency, and long-term results.',
  crumb: 'Dentist Near Fort Hood',
  kicker: 'Private Dental Care Near Fort Hood',
  h1: 'Dentist Near Fort Hood',
  intro:
    'Private dental care in Killeen for families, service members, spouses, and retirees who want consistent, high-quality care close to home.',
  heroPrimaryLabel: 'Schedule an Appointment',
  heroPrimaryHref: '/#contact',
  heroSecondaryLabel: 'Call for Emergency Dental Care',
  heroSecondaryHref: 'tel:+12546994127',
  body: `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
    <h2>Why Choose a Private Dentist Near Fort Hood?</h2>
    <p>Many patients searching for a dentist near Fort Hood are not looking for a "military dentist." They are looking for a high-quality private practice nearby: familiar faces, clear communication, organized records, and treatment that feels thoughtful rather than rushed.</p>
    <p>Elm Ridge Implant and Family Dentistry is a privately owned practice in Killeen. That matters. You are not walking into a rotating-provider environment or a corporate office where the treatment tone changes every few months. You see a stable team, you build a relationship with your dentists, and your care is planned with the long view in mind.</p>
    <p>For families juggling PCS uncertainty, training schedules, kids' appointments, and work, that kind of consistency is practical. It means fewer surprises, clearer records, and a dental home that still feels organized when life around it is not.</p>

    <h2>Dental Services for Fort Hood Families</h2>
    <p>We provide comprehensive private dental care close to Fort Hood, including routine preventive care and more advanced treatment when needed.</p>
    <div class="grid md:grid-cols-2 gap-5 not-prose">
      <a href="/family-dentist-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Family Dentistry</h3><p class="text-charcoal/65 leading-7">Wellness exams, cleanings, preventive care, and practical long-term care for every age.</p></a>
      <a href="/emergency-dentist-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Emergency Dentistry</h3><p class="text-charcoal/65 leading-7">Urgent care for tooth pain, swelling, broken teeth, lost crowns, and dental infections.</p></a>
      <a href="/dental-implants-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Dental Implants</h3><p class="text-charcoal/65 leading-7">Single-tooth implants, implant bridges, and coordinated in-house implant treatment.</p></a>
      <a href="/full-arch-dental-implants-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Full-Arch Dental Implants</h3><p class="text-charcoal/65 leading-7">Fixed full-arch teeth for patients missing most or all teeth in an upper or lower arch.</p></a>
      <a href="/snap-on-dentures-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Snap-On Dentures</h3><p class="text-charcoal/65 leading-7">Implant-retained dentures for patients who want better lower-denture stability.</p></a>
      <a href="/cosmetic-dentistry-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Cosmetic Dentistry</h3><p class="text-charcoal/65 leading-7">Veneers, whitening, bonding, and smile planning with a natural, polished result.</p></a>
      <a href="/dental-crowns-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Dental Crowns</h3><p class="text-charcoal/65 leading-7">Protect and restore cracked, broken, or heavily restored teeth.</p></a>
      <a href="/root-canal-killeen-tx" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-3xl text-charcoal mb-3">Root Canal Therapy</h3><p class="text-charcoal/65 leading-7">Save painful or infected teeth when extraction is not the best answer.</p></a>
    </div>
    <p>Patients also come to us for <a href="/invisalign-killeen-tx">Invisalign</a>, crowns, root canals, cleanings, and preventive care when they want one private office that can coordinate both the everyday and the more complex parts of dentistry.</p>

    <h2>Dental Implants and Military Moves</h2>
    <p>Military families move. That is real, and it is one reason some people hesitate to start implant treatment. We understand that concern. We prefer to complete our own implant cases from start to finish whenever possible because that is how treatment is ideally coordinated. But a possible move should not automatically mean delaying needed care.</p>
    <p>When implant treatment is postponed too long, the situation can become more complicated. Bone loss can continue, teeth can drift, the bite can change, and what might have been a more straightforward plan can become larger and more expensive later. That is especially true when a tooth has already been lost and the site is being watched instead of planned.</p>
    <p>If you are exploring <a href="/dental-implants-killeen-tx">dental implants near Fort Hood</a>, the better first step is a real consultation. We can review what the timeline would look like, what parts of treatment are time-sensitive, and whether waiting actually helps or simply makes the case harder later.</p>

    <h2>Why Implant System Choice Matters</h2>
    <p>If life changes during treatment, careful documentation matters. We keep detailed records, imaging, restorative planning notes, and implant information so the case is clearly documented.</p>
    <p>We also use globally recognized implant systems and connections, primarily Straumann and Nobel Biocare. Those systems are widely recognized by experienced implant dentists, which can help support continuity of care if treatment ever needs to continue elsewhere.</p>
    <p>That is not a promise that every case can be transferred easily. Every case is different, and continuity depends on timing, healing, anatomy, and what part of treatment has already been completed. But using well-known systems and organized records can make a real difference if follow-up needs to happen somewhere else.</p>
    <p>We also help patients think through <a href="/insurance/implants">implant insurance and financing</a> early, because a realistic payment plan can make it easier to move forward before the case becomes more complex.</p>

    <h2>Emergency Dental Care Near Fort Hood</h2>
    <p>Dental emergencies do not wait for a clean break in the schedule. We see patients from Fort Hood who need help with severe toothaches, broken teeth, swelling, infections, lost crowns, painful biting, or a tooth that suddenly feels unstable.</p>
    <p>If you are looking for an <a href="/emergency-dentist-killeen-tx">emergency dentist near Fort Hood</a>, call as early in the day as you can. We do our best to accommodate urgent needs quickly and explain the diagnosis clearly so you know what needs to happen next.</p>

    <h2>A Better Experience Than Starting Over Every Time You Move</h2>
    <p>One of the frustrations many patients describe is having to retell their story every time they switch offices. Old treatment plans are unclear. Records are incomplete. Nobody seems to know what was started, what was recommended, or what matters most to the patient.</p>
    <p>We work hard to make the opposite experience feel normal here. That means organized records, clear explanations, careful treatment planning, and helping patients understand not just what we recommend, but why. Whether you stay in the area for years or life eventually takes you somewhere else, the goal is the same: leave each visit knowing what is happening, what comes next, and what options are still on the table.</p>

    <h2>Conveniently Located in Killeen</h2>
    <p>Elm Ridge Implant and Family Dentistry is conveniently located in Killeen and regularly serves patients from Fort Hood, Fort Cavazos, Harker Heights, Nolanville, Copperas Cove, and nearby communities. For many patients, private care nearby is worth the short drive because they want a stable office that feels personal, organized, and genuinely invested in the outcome.</p>
  </div></section>`,
  faqHeading: 'Dentist Near Fort Hood FAQ',
  faq: [
    ['Do you see patients from Fort Hood?', 'Yes. We regularly see patients who live or work near Fort Hood and want private dental care in nearby Killeen.'],
    ['Are you a military dentist?', 'No. Elm Ridge Implant and Family Dentistry is a privately owned dental practice. Many service members, spouses, retirees, and military families choose us because they want consistent private-practice care outside of a corporate or on-base clinic setting.'],
    ['Can I start dental implant treatment if I might move?', 'Often, yes. A possible future move should not automatically stop you from getting needed care. We keep detailed records and use widely recognized implant systems, which can help support continuity of care if treatment ever needs to be continued elsewhere. That said, every case is different and transfer is never something we guarantee.'],
    ['What implant brands do you use?', 'We primarily use Straumann and Nobel Biocare connections, which are well-known systems widely recognized by experienced implant dentists.'],
    ['Do you offer emergency dental appointments near Fort Hood?', 'Yes. We do our best to accommodate urgent dental needs quickly for tooth pain, swelling, broken teeth, lost crowns, and similar problems. Call as early as possible for the best chance of being seen the same day.'],
    ['Do you treat military spouses and families?', 'Yes. We care for families, spouses, retirees, and anyone who wants consistent relationship-based dental care in a private office setting.'],
    [{
      question: 'Do you offer financing?',
      answer: 'Yes. We offer financing options through CareCredit and Cherry, and we can also help patients understand insurance benefits before treatment.',
      answerHtml: 'Yes. We offer financing options through <a href="/insurance-and-financing">CareCredit and Cherry</a>, and we can also help patients understand insurance benefits before treatment.',
    }][0],
  ],
  footerTitle: 'Looking for a Private Dentist Near Fort Hood?',
  footerText:
    'Schedule with Elm Ridge Implant and Family Dentistry in Killeen for family, emergency, cosmetic, and implant care with a consistent private-practice team.',
  footerPrimaryLabel: 'Schedule an Appointment',
  footerPrimaryHref: '/#contact',
  footerSecondaryLabel: 'Call 254-699-4127',
  footerSecondaryHref: 'tel:+12546994127',
  headSchemas: [fortHoodServiceSchema],
});

function patchFile(file, replacer) {
  const original = fs.readFileSync(file, 'utf8');
  const updated = replacer(original);
  if (updated !== original) {
    fs.writeFileSync(file, updated);
  }
}

patchFile('index.html', (html) => {
  if (html.includes('/dentist-near-fort-hood')) return html;
  return html.replace(
    `<a href="/dentist-temple-tx" class="text-teal-dark hover:text-charcoal transition-[color] duration-200">Temple</a>.`,
    `<a href="/dentist-temple-tx" class="text-teal-dark hover:text-charcoal transition-[color] duration-200">Temple</a>, and <a href="/dentist-near-fort-hood" class="text-teal-dark hover:text-charcoal transition-[color] duration-200">Fort Hood</a>.`,
  );
});

patchFile('family-dentist-killeen-tx', (html) => {
  if (html.includes('/dentist-near-fort-hood')) return html;
  return html.replace(
    `<h2>What "Family Dentistry" Actually Includes</h2>`,
    `<p>Many patients looking for a <a href="/dentist-near-fort-hood">family dentist near Fort Hood</a> choose Elm Ridge because they want private-practice continuity, clear communication, and a team that gets to know everyone in the household instead of starting from scratch at each visit.</p><h2>What "Family Dentistry" Actually Includes</h2>`,
  );
});

patchFile('emergency-dentist-killeen-tx', (html) => {
  if (html.includes('/dentist-near-fort-hood')) return html;
  return html.replace(
    `<h2 class="font-display text-4xl text-charcoal">Not a Corporate Rush Job</h2>`,
    `<p>Patients searching for a <a href="/dentist-near-fort-hood">private dentist near Fort Hood</a> often find us first because they need urgent care now and a calmer long-term dental home later.</p><h2 class="font-display text-4xl text-charcoal">Not a Corporate Rush Job</h2>`,
  );
});

patchFile('dental-implants-killeen-tx', (html) => {
  if (html.includes('/dentist-near-fort-hood')) return html;
  return html.replace(
    `<h2 class="font-display text-4xl text-charcoal">CBCT Imaging for Every Implant Case</h2>`,
    `<p>Many patients researching <a href="/dentist-near-fort-hood">dental implants near Fort Hood</a> want a private office that can coordinate both the surgical and restorative sides of treatment in one place. That continuity is a major reason they come to Elm Ridge.</p><h2 class="font-display text-4xl text-charcoal">CBCT Imaging for Every Implant Case</h2>`,
  );
});

patchFile('sitemap.xml', (xml) => {
  if (xml.includes('dentist-near-fort-hood')) return xml;
  return xml.replace(
    '</urlset>',
    `  <url><loc>https://www.elmridgedental.com/dentist-near-fort-hood</loc><priority>0.7</priority></url>\n</urlset>`,
  );
});
