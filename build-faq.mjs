import fs from 'fs';
import path from 'path';
import { head, header, footer, menuScript, breadcrumb, faqSchema, domain } from './site-helpers.mjs';

const faqSections = [
  {
    title: 'New Patient Basics',
    qas: [
      ['Are you accepting new patients?', `Yes. We welcome new patients of all ages — from young children to seniors — at our Killeen office. You can request an appointment by calling (254) 699-4127 or through our online appointment request form.`],
      ['What should I expect on my first visit?', `Your first visit usually takes 60-90 minutes. We'll review your health history, take digital X-rays and (if needed) a 3D CBCT scan, perform a comprehensive exam, and discuss what we see — what's healthy, what needs attention, and your options. You'll leave with a clear, no-pressure understanding of any recommended treatment.`],
      ['How often should I come in for a checkup?', `For most patients, every six months. Patients with active gum disease, a history of decay, or specific risk factors may benefit from more frequent visits. We'll recommend the right schedule for you at your first exam.`],
      ['Do you see children?', `Yes — we're a family practice and routinely see kids. The American Academy of Pediatric Dentistry recommends a child's first dental visit by age one or within six months of their first tooth, whichever comes first.`],
      ['Can my whole family book back-to-back appointments?', `Yes, and we encourage it. Just let our front desk know how many family members need to be seen and we'll block the time together when our schedule allows.`],
      ['How do I schedule an appointment?', `Call us at (254) 699-4127 during business hours (Monday-Thursday, 8 AM-5 PM) or use the appointment request form on our website. We typically respond to online requests within one business day.`],
    ],
  },
  {
    title: 'Insurance, Costs, and Payment',
    qas: [
      ['What dental insurance do you accept?', `We're in-network with most major PPO dental plans and accept many others as out-of-network providers. Call (254) 699-4127 with your specific plan and we'll verify your coverage before your appointment.`],
      ['Do you accept Tricare?', `Many of our patients are military-affiliated through Fort Cavazos. Coverage depends on which Tricare dental program you have (Active Duty Dental Program vs. Tricare Dental Program through United Concordia). Call us with your member ID and we'll verify your specific coverage.`],
      ["What if I don't have dental insurance?", `We offer payment options including CareCredit financing for qualifying patients. Many treatments are also more affordable than people expect — call for an estimate on the procedure you're considering and we'll be transparent about cost before any work is done.`],
      ['How much does a routine exam and cleaning cost?', `Without insurance, a comprehensive new-patient exam at our office is around $107, with X-rays and cleaning billed separately. With most PPO insurance, preventive visits (exams, cleanings, X-rays) are typically covered at or near 100%.`],
      ['How much do dental implants cost in Killeen, TX?', `A single dental implant — including the implant post, abutment, and crown — generally falls in the $3,500-$5,500 range, depending on whether bone grafting is needed. Full-arch implant solutions like All-on-4 are more involved. We do 3D CBCT-guided planning so you get an accurate quote after a consultation, not a wide guess.`],
      ['How much does Invisalign cost?', `Most Invisalign cases at our office fall in the $4,000-$6,500 range depending on case complexity and length of treatment. Many dental insurance plans contribute toward orthodontic care. We offer monthly payment plans through CareCredit.`],
      ["Why didn't my insurance pay for my treatment?", `Common reasons include reaching your annual maximum, frequency limits (e.g., two cleanings per year), missing tooth clauses, waiting periods on new policies, or services classified as cosmetic. We have a dedicated insurance team that can help you understand any explanation of benefits — see our insurance pages for detailed explanations.`],
    ],
  },
  {
    title: 'Daily Dental Care',
    qas: [
      ['How often should I brush my teeth?', `Twice a day for two minutes each time, using a soft-bristled brush and fluoride toothpaste. Brushing right before bed is the most important — saliva flow drops at night, leaving teeth more vulnerable to decay.`],
      ['Should I use an electric or manual toothbrush?', `Electric toothbrushes — especially oscillating-rotating or sonic models — remove more plaque than manual brushes for most people. They're particularly helpful for patients with arthritis, braces, or implants. A manual brush used correctly still works well.`],
      ['Do I really need to floss every day?', `Yes. Brushing only cleans about 60% of each tooth's surface — flossing reaches the contact points between teeth where decay and gum disease typically start. If traditional floss is hard for you, a water flosser is a reasonable alternative.`],
      ['What kind of toothpaste should I use?', `Any ADA-accepted fluoride toothpaste works. If you have specific concerns — sensitivity, gum disease, dry mouth, or a high cavity risk — we can recommend a prescription-strength or specialty paste at your visit.`],
      ['Is fluoride safe?', `Yes, at the low concentrations found in toothpaste, mouthwash, and community water. Fluoride is one of the most studied substances in public health and the CDC ranks community water fluoridation among the top public health achievements of the 20th century.`],
      ['What causes bad breath?', `The most common cause is bacteria on the tongue and between teeth — improving your hygiene and adding tongue cleaning often resolves it. Persistent bad breath despite good hygiene can signal gum disease, dry mouth, sinus issues, or GI problems and is worth a dental exam.`],
    ],
  },
  {
    title: 'Common Issues and Symptoms',
    qas: [
      ['Why are my gums bleeding?', `Bleeding gums almost always indicate gingivitis — the early, reversible stage of gum disease — caused by plaque buildup along the gumline. With professional cleaning and improved daily care, bleeding usually resolves within two weeks. Persistent bleeding warrants a periodontal evaluation.`],
      ['Why are my teeth sensitive to hot or cold?', `Common causes include exposed root surfaces from gum recession, worn enamel, cracked teeth, decay, or recent dental work. Sensitivity that lingers more than a few seconds after a stimulus, or that wakes you at night, suggests a deeper issue and should be evaluated.`],
      ['I have a toothache. What should I do?', `Take an over-the-counter pain reliever appropriate for you, rinse with warm salt water, and call us at (254) 699-4127. Toothache pain rarely resolves on its own — the underlying problem (decay reaching the nerve, infection, fracture) needs treatment.`],
      ['I think I have a cavity. What happens next?', `At your visit we'll confirm with X-rays and an exam. Small cavities are typically restored with a tooth-colored filling in one appointment. Larger cavities may need a crown, and cavities that have reached the nerve usually need a root canal followed by a crown.`],
      ['My tooth is cracked or chipped — is that an emergency?', `A small chip without pain isn't an emergency but should still be evaluated soon to prevent further damage. A larger crack with pain, or a fractured tooth exposing the inner pulp, is urgent — call us the same day.`],
      ['Why do I grind my teeth at night?', `Common causes include stress, sleep apnea, malocclusion (bad bite), and caffeine or alcohol use. Long-term grinding (bruxism) can fracture teeth and worsen TMJ pain. A custom night guard is the standard protective treatment.`],
    ],
  },
  {
    title: 'Procedures and Treatments',
    qas: [
      ['Do dental implants hurt?', `The procedure itself is performed under local anesthesia (and sedation if preferred), so you don't feel pain during placement. Most patients describe post-op discomfort as milder than a tooth extraction and manageable with over-the-counter pain relievers for 1-3 days.`],
      ['How long do dental implants last?', `With good care, the implant post itself can last a lifetime — studies show 95%+ success rates at 10 years. The crown attached to the implant typically lasts 15-25 years before needing replacement, depending on bite forces and hygiene.`],
      ['Am I a candidate for dental implants?', `Most adults with healthy gums and adequate jawbone are candidates. Bone grafting can rebuild missing bone if needed. Uncontrolled diabetes, heavy smoking, and certain medications affect healing — we'll evaluate your specific situation with a 3D CBCT scan during consultation.`],
      ['How long does Invisalign take?', `Most adult cases finish in 12-18 months. Mild cases can wrap up in as little as 6 months; complex cases may take 24+ months. You'll wear each aligner about 1-2 weeks before switching to the next.`],
      ['Invisalign or braces — which is better?', `Both straighten teeth effectively. Invisalign is removable (easier eating and hygiene), nearly invisible, and works for most cases. Traditional braces are sometimes better for severe rotations, large gaps, or complex bite issues. We'll tell you honestly which is right for your case.`],
      ['Do root canals hurt?', `Modern root canals don't hurt during the procedure — you're numb. The discomfort people associate with root canals is usually the pain of the infected tooth before treatment. Mild soreness for a few days afterward is normal and typically managed with over-the-counter pain relievers.`],
      ['Why do I need a crown after a root canal?', `A root-canaled tooth is hollowed out and brittle, making it vulnerable to fracture. A crown protects the remaining tooth structure and restores full chewing function — without one, the tooth often cracks within a few years.`],
      ["What's the difference between a crown and a veneer?", `A crown covers the entire tooth and restores function for damaged or heavily restored teeth. A veneer covers only the front surface and is mainly cosmetic — it requires less tooth reduction but isn't appropriate for weakened teeth.`],
      ['How does professional teeth whitening work?', `We use a higher-concentration peroxide gel than you can buy over the counter, which breaks down stains within the enamel. Take-home trays typically lighten teeth by several shades over two weeks. In-office whitening delivers similar results in a single visit.`],
      ['How long does whitening last?', `Six months to two years, depending on your habits — coffee, tea, red wine, and tobacco shorten the result. Maintenance touch-ups with take-home trays keep teeth bright between professional sessions.`],
    ],
  },
  {
    title: 'Dental Anxiety and Sedation',
    qas: [
      [`I'm scared of the dentist. Can you help?`, `Yes — dental anxiety is one of the most common things we treat, and we take it seriously. Strategies range from numbing gel and patient communication to nitrous oxide ("laughing gas") and oral conscious sedation. Tell us what you're nervous about and we'll build a plan that works for you.`],
      ['What sedation options do you offer?', `We offer nitrous oxide (mild relaxation, wears off in minutes), oral conscious sedation (a pill taken before the appointment for deeper relaxation), and local anesthesia. Most patients don't need sedation for routine care, but it's available when it helps.`],
      ['Is dental sedation safe?', `Yes, when administered by a trained provider. We monitor vital signs throughout sedation appointments and adjust dosage to your weight, health history, and procedure. Sedation in a dental office is among the lowest-risk procedural sedations in medicine.`],
      ['Will I be unconscious during sedation?', `With the sedation we offer, no — you're relaxed and drowsy but able to respond. You may not remember much of the appointment afterward, which is common and normal. True general anesthesia (full unconsciousness) is reserved for hospital-based oral surgery.`],
    ],
  },
  {
    title: 'Dental Emergencies',
    qas: [
      ['What counts as a dental emergency?', `Severe tooth pain, a knocked-out tooth, a broken or cracked tooth with pain, swelling in the face or gums, uncontrolled bleeding after an injury, or a lost crown or filling causing pain. Call us at (254) 699-4127 — we make every effort to see emergencies the same day.`],
      ['What should I do if my tooth gets knocked out?', `Pick it up by the crown (not the root), rinse it gently with milk or saline if dirty, and try to place it back in the socket. If you can't, store it in milk or saliva and get to a dentist within 30-60 minutes — the sooner, the better the chance of saving the tooth.`],
      ['I have a swollen face — is that urgent?', `Yes. Facial swelling usually indicates a dental abscess (infection), which can spread quickly and become dangerous. Call us immediately, or go to the emergency room if swelling involves your eye, neck, or makes it hard to breathe or swallow.`],
      ['I have a toothache after hours — what should I do?', `Take an over-the-counter pain reliever, rinse with warm salt water, and call our office. Our voicemail provides after-hours guidance for urgent situations. For severe swelling, breathing difficulty, or trauma, go to the emergency room.`],
    ],
  },
  {
    title: 'About Elm Ridge Implant and Family Dentistry',
    qas: [
      ['Where are you located?', `2601 E Elms Rd, Killeen, TX 76542 — we're conveniently located for patients from Killeen, Harker Heights, Belton, Copperas Cove, Nolanville, Fort Cavazos, Salado, and Temple.`],
      ['What are your office hours?', `Monday through Thursday, 8 AM to 5 PM. We're closed Friday, Saturday, and Sunday.`],
      ['Who are the dentists?', `Drs. Jeff and Kayla Muszynski — a husband-and-wife team who both earned their dental degrees from the University of Oklahoma College of Dentistry. Dr. Kayla was raised in Belton, TX, and the practice has served Bell County since 2017.`],
      ['Is your office wheelchair accessible?', `Yes. Our office is fully accessible with ramps, wide hallways, and ample parking close to the entrance.`],
      ['Do you offer same-day appointments?', `We reserve time each day for emergencies and same-day needs. Call us early in the day at (254) 699-4127 and we'll do our best to fit you in.`],
      ['How do I leave a review?', `We're grateful for every review — they help other Killeen-area patients find honest dental care. You can leave a Google review by searching "Elm Ridge Implant and Family Dentistry" on Google and clicking "Write a Review".`],
    ],
  },
];

const firstLinkRules = [
  { key: 'dental implants', regex: /\bdental implants\b/i, href: '/dental-implants-killeen-tx' },
  { key: 'Invisalign', regex: /\bInvisalign\b/i, href: '/invisalign-killeen-tx' },
  { key: 'All-on-4', regex: /\bAll-on-4\b/i, href: '/all-on-4-dental-implants-killeen-tx' },
  { key: 'full-arch', regex: /\bfull-arch\b/i, href: '/full-arch-dental-implants-killeen-tx' },
  { key: 'single tooth', regex: /\bsingle tooth\b/i, href: '/single-tooth-implant-killeen-tx' },
  { key: 'root canal', regex: /\broot canal\b/i, href: '/root-canal-killeen-tx' },
  { key: 'cosmetic', regex: /\bcosmetic\b/i, href: '/cosmetic-dentistry-killeen-tx' },
  { key: 'veneer', regex: /\bveneer\b/i, href: '/cosmetic-dentistry-killeen-tx' },
  { key: 'whitening', regex: /\bwhitening\b/i, href: '/cosmetic-dentistry-killeen-tx' },
  { key: 'crown', regex: /\bcrown\b/i, href: '/dental-crowns-killeen-tx' },
  { key: 'snap-on dentures', regex: /\bsnap-on dentures\b/i, href: '/snap-on-dentures-killeen-tx' },
  { key: 'denture', regex: /\bdenture(s)?\b/i, href: '/dentures-killeen-tx' },
  { key: 'implant bridge', regex: /\bimplant bridge\b/i, href: '/implant-bridges-killeen-tx' },
  { key: 'sleep apnea', regex: /\bsleep apnea\b/i, href: '/sleep-dentistry-killeen-tx' },
  { key: 'snoring', regex: /\bsnoring\b/i, href: '/sleep-dentistry-killeen-tx' },
  { key: 'night guard', regex: /\bnight guard\b/i, href: '/sleep-dentistry-killeen-tx' },
  { key: 'emergency', regex: /\bemergency\b/i, href: '/emergency-dentist-killeen-tx' },
  { key: 'insurance', regex: /\binsurance\b/i, href: '/insurance-and-financing' },
  { key: 'Tricare', regex: /\bTricare\b/i, href: '/insurance-and-financing' },
  { key: 'CareCredit', regex: /\bCareCredit\b/i, href: '/insurance-and-financing' },
  { key: 'annual maximum', regex: /\bannual maximum\b/i, href: '/insurance/annual-maximum' },
  { key: 'explanation of benefits', regex: /\bexplanation of benefits\b/i, href: '/insurance/why-didnt-insurance-pay' },
];

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function addFirstLinks(text, linked) {
  let html = escapeHtml(text);
  for (const rule of firstLinkRules) {
    if (linked.has(rule.key)) continue;
    if (!rule.regex.test(html)) continue;
    html = html.replace(rule.regex, (match) => `<a href="${rule.href}">${match}</a>`);
    linked.add(rule.key);
  }
  return html;
}

function buildFaqBody() {
  const linked = new Set();
  return faqSections.map((section) => {
    const qaHtml = section.qas.map(([question, answer]) => `
      <article class="border-t border-teal-light/70 pt-6 first:border-t-0 first:pt-0">
        <h3 class="font-body text-xl md:text-2xl font-semibold text-charcoal leading-snug">${escapeHtml(question)}</h3>
        <p class="mt-3 text-charcoal/72 leading-8">${addFirstLinks(answer, linked)}</p>
      </article>
    `).join('');
    return `
      <section class="space-y-8">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-teal-dark mb-3">FAQ Category</p>
          <h2 class="font-display text-4xl md:text-5xl font-light text-charcoal">${section.title}</h2>
        </div>
        <div class="space-y-8">${qaHtml}</div>
      </section>
    `;
  }).join('');
}

function patchNavFooter(html) {
  if (!html.includes('href="/faq"')) {
    html = html.replace(
      '<a href="/cosmetic-dentistry-killeen-tx" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal">Cosmetic</a><a href="/#team" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal">About</a>',
      '<a href="/cosmetic-dentistry-killeen-tx" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal">Cosmetic</a><a href="/faq" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal">FAQ</a><a href="/#team" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal">About</a>'
    );
    html = html.replace(
      '<a href="/cosmetic-dentistry-killeen-tx" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal transition-[color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-dark">Cosmetic</a>\n        <a href="#team"         class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal transition-[color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-dark whitespace-nowrap">About</a>',
      '<a href="/cosmetic-dentistry-killeen-tx" class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal transition-[color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-dark">Cosmetic</a>\n        <a href="/faq"          class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal transition-[color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-dark">FAQ</a>\n        <a href="#team"         class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal transition-[color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-dark whitespace-nowrap">About</a>'
    );
    html = html.replace(
      '<a href="#cosmetic"     class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal transition-[color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-dark">Cosmetic</a>\n        <a href="#team"         class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal transition-[color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-dark whitespace-nowrap">About</a>',
      '<a href="#cosmetic"     class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal transition-[color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-dark">Cosmetic</a>\n        <a href="/faq"          class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal transition-[color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-dark">FAQ</a>\n        <a href="#team"         class="font-body text-xs tracking-[0.38em] uppercase text-charcoal/55 hover:text-charcoal transition-[color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-dark whitespace-nowrap">About</a>'
    );
    html = html.replace(
      '<a href="/cosmetic-dentistry-killeen-tx" class="block font-body text-xs tracking-widest uppercase text-charcoal py-2">Cosmetic</a><a href="/#team" class="block font-body text-xs tracking-widest uppercase text-charcoal py-2">Our Doctors</a>',
      '<a href="/cosmetic-dentistry-killeen-tx" class="block font-body text-xs tracking-widest uppercase text-charcoal py-2">Cosmetic</a><a href="/faq" class="block font-body text-xs tracking-widest uppercase text-charcoal py-2">FAQ</a><a href="/#team" class="block font-body text-xs tracking-widest uppercase text-charcoal py-2">Our Doctors</a>'
    );
    html = html.replace(
      '<a href="#cosmetic"     class="block font-body text-xs tracking-widest uppercase text-charcoal hover:text-teal-dark py-2 transition-[color] duration-200">Cosmetic</a>\n      <a href="#team"         class="block font-body text-xs tracking-widest uppercase text-charcoal hover:text-teal-dark py-2 transition-[color] duration-200">Our Doctors</a>',
      '<a href="#cosmetic"     class="block font-body text-xs tracking-widest uppercase text-charcoal hover:text-teal-dark py-2 transition-[color] duration-200">Cosmetic</a>\n      <a href="/faq"          class="block font-body text-xs tracking-widest uppercase text-charcoal hover:text-teal-dark py-2 transition-[color] duration-200">FAQ</a>\n      <a href="#team"         class="block font-body text-xs tracking-widest uppercase text-charcoal hover:text-teal-dark py-2 transition-[color] duration-200">Our Doctors</a>'
    );
  }

  if (!html.includes('>FAQ</a></li>')) {
    html = html.replace(
      '<li><a href="/cosmetic-dentistry-killeen-tx" class="font-body text-sm text-white/55 hover:text-white">Cosmetic</a></li><li><a href="/#team" class="font-body text-sm text-white/55 hover:text-white">Our Doctors</a></li>',
      '<li><a href="/cosmetic-dentistry-killeen-tx" class="font-body text-sm text-white/55 hover:text-white">Cosmetic</a></li><li><a href="/faq" class="font-body text-sm text-white/55 hover:text-white">FAQ</a></li><li><a href="/#team" class="font-body text-sm text-white/55 hover:text-white">Our Doctors</a></li>'
    );
  }

  return html;
}

function patchHomeServices(html) {
  if (!html.includes('Complete Care,<br />All in One Practice.')) return html;
  return html.replace(
    /<div class="flex items-center">[\s\S]*?<\/div>\s*<\/div>/,
    `<div class="flex flex-col justify-center">
          <p class="font-body text-base text-charcoal/60 leading-relaxed">
            From routine checkups to complex restorations, Elm Ridge offers comprehensive dental services under one roof — less referrals, less hassle.
          </p>
          <p class="font-body text-sm text-charcoal/65 leading-7 mt-4">
            Questions before your visit? Read our <a href="/faq" class="text-teal-dark font-semibold hover:text-charcoal">FAQ</a> for clear answers about insurance, anxiety, emergencies, implants, and first visits.
          </p>
        </div>
      </div>`
  );
}

function walkRouteFiles(root) {
  const out = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '.claude' || entry.name === '.do' || entry.name === 'temporary screenshots' || entry.name === 'assets') continue;
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkRouteFiles(full));
      continue;
    }
    if (entry.name === 'index.html' || path.extname(entry.name) === '') {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('<!DOCTYPE html') || content.includes('<html')) out.push(full);
    }
  }
  return out;
}

const flatFaq = faqSections.flatMap((section) => section.qas);
const body = buildFaqBody();
const faqHtml = `${head(
  'Dental FAQ — Killeen, TX | Elm Ridge Implant and Family Dentistry',
  'Dental FAQ in Killeen, TX with answers about insurance, costs, procedures, anxiety, emergencies, and first visits from Elm Ridge.',
  '/faq'
)}<body class="font-body text-charcoal bg-stone">${header()}<main id="main-content"><section class="bg-charcoal text-white py-20"><div class="max-w-5xl mx-auto px-6"><nav class="text-xs uppercase tracking-widest text-teal mb-6"><a href="/">Home</a> / FAQ</nav><p class="text-xs uppercase tracking-widest text-teal mb-4">Patient Questions</p><h1 class="font-display text-5xl md:text-6xl font-light leading-tight mb-6">Frequently Asked Questions</h1><p class="text-white/70 leading-8 text-lg max-w-3xl">Honest answers to the questions our Killeen dental patients ask most.</p><p class="text-white/70 leading-8 text-lg max-w-3xl mt-6">These are the same practical answers Drs. Jeff and Kayla Muszynski give every day in their Killeen office. If your situation is more specific, we are always happy to talk it through in person and explain what actually applies to your teeth, your health history, and your goals.</p></div></section><section class="py-16 bg-white"><div class="max-w-5xl mx-auto px-6 prose-page space-y-16">${body}</div></section><section class="py-16 bg-charcoal text-white text-center"><div class="max-w-3xl mx-auto px-6"><h2 class="font-display text-4xl mb-4">Still have a question?</h2><p class="text-white/65 mb-8">Call our office or request an appointment and we will help you get a clear answer.</p><a href="/#contact" class="inline-block bg-teal px-8 py-4 text-xs uppercase tracking-widest font-semibold">Request an Appointment</a></div></section></main>${footer()}${faqSchema(flatFaq)}${breadcrumb('/faq', 'FAQ')}<script src="/accessibility.js" defer></script>${menuScript}</body></html>`;

fs.writeFileSync('faq', faqHtml);

for (const file of walkRouteFiles('.')) {
  let html = fs.readFileSync(file, 'utf8');
  const original = html;
  html = patchNavFooter(html);
  if (path.basename(file) === 'index.html') html = patchHomeServices(html);
  if (html !== original) fs.writeFileSync(file, html);
}

let sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const faqLoc = `${domain}/faq`;
if (!sitemap.includes(faqLoc)) {
  sitemap = sitemap.replace('</urlset>', `  <url><loc>${faqLoc}</loc><priority>0.7</priority></url>\n</urlset>`);
  fs.writeFileSync('sitemap.xml', sitemap);
}
