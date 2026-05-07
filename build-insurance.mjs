import fs from 'fs';
import { head, header, footer, menuScript, breadcrumb, faqSchema, domain, practiceName } from './site-helpers.mjs';

const careCreditUrl = 'https://www.carecredit.com/doctor-locator/killeen-tx/elm-ridge-implant-family-dentistry-927rpj/';
const cherryUrl = 'https://pay.withcherry.com/elmridgedental?utm_source=finder-revamp&m=15801';

const insurancePages = [
  'insurance-and-financing',
  'insurance/crowns',
  'insurance/implants',
  'insurance/invisalign',
  'insurance/why-didnt-insurance-pay',
  'insurance/annual-maximum',
];

function pageSchema(path, name, description) {
  return `<script type="application/ld+json" data-schema="insurance-webpage">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: `${domain}${path}`,
    publisher: {
      '@type': 'Dentist',
      '@id': `${domain}/#dentist`,
      name: practiceName,
    },
  })}</script>`;
}

function cardLink(href, title, text) {
  return `<a href="${href}" class="block bg-white border border-teal-light p-6 hover:border-teal transition-colors"><h3 class="font-display text-2xl text-charcoal mb-3">${title}</h3><p class="text-charcoal/65 leading-7">${text}</p></a>`;
}

function ctaBlock() {
  return `<section class="py-16 bg-charcoal text-white text-center"><div class="max-w-3xl mx-auto px-6"><h2 class="font-display text-4xl mb-4">Questions about benefits or financing?</h2><p class="text-white/65 mb-8">Our team can help estimate benefits and explain payment options before treatment begins.</p><a href="/#contact" class="inline-block bg-teal px-8 py-4 text-xs uppercase tracking-widest font-semibold">Request an Appointment</a></div></section>`;
}

function supportCoverageTable(page) {
  const rows = page.path.includes('crowns')
    ? [['Crown', 'Often major care with deductible, coinsurance, annual maximum, and frequency rules.'], ['Replacement crown', 'May be limited if the plan says the previous crown is too recent.']]
    : page.path.includes('implants')
      ? [['Implant body', 'May be covered, excluded, or downgraded depending on the plan.'], ['Implant crown or denture', 'May be reviewed separately from the surgical implant placement.']]
      : page.path.includes('invisalign')
        ? [['Orthodontic benefit', 'May have a lifetime maximum and age limits.'], ['Adult Invisalign', 'Coverage varies widely and may not be included.']]
        : page.path.includes('annual-maximum')
          ? [['Preventive care', 'May use little or none of the annual maximum depending on the plan.'], ['Major care', 'Can use the annual maximum quickly.']]
          : [['Covered service', 'May still leave a balance because of deductibles, coinsurance, or maximums.'], ['Denied or reduced claim', 'May reflect plan rules, documentation requests, or alternate benefits.']];
  return `<h2>Common Coverage Pattern</h2><p>These examples are general patterns only, not promises of payment.</p><table><thead><tr><th>Situation</th><th>Common Pattern</th></tr></thead><tbody>${rows.map(([a,b])=>`<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody></table><p><strong>Coverage varies significantly by plan.</strong> Contact your insurance provider or our office for details regarding your specific benefits.</p>`;
}

function shell({ file, path, title, description, crumb, intro, body, faq }) {
  fs.writeFileSync(file, `${head(title, description, path)}
<body class="font-body text-charcoal bg-stone">
${header()}
<main id="main-content">
  <section class="bg-charcoal text-white py-20">
    <div class="max-w-5xl mx-auto px-6">
      <nav class="text-xs uppercase tracking-widest text-teal mb-6"><a href="/">Home</a> / ${crumb}</nav>
      <p class="font-body text-xs uppercase tracking-widest text-teal mb-4">Insurance &amp; Financing</p>
      <h1 class="font-display text-5xl md:text-6xl font-light leading-tight mb-6">${title}</h1>
      <p class="text-white/70 leading-8 text-lg max-w-3xl">${intro}</p>
    </div>
  </section>
  ${body}
  ${ctaBlock()}
</main>
${footer()}
${faqSchema(faq)}
${breadcrumb(path, crumb)}
${pageSchema(path, title, description)}
<script src="/accessibility.js" defer></script>
${menuScript}
</body></html>`);
}

const mainFaq = [
  ['Can I still come if you are out-of-network?', 'Yes. Being out-of-network does not prevent you from receiving care. We still file claims and help maximize your benefits.'],
  ['Why doesn’t my insurance cover everything?', 'Dental insurance is designed to help offset costs, not fully cover treatment.'],
  ['Is my estimate a guarantee?', 'No. Final payment is determined by the insurance company after processing.'],
  ['When is payment due?', 'Payment is due at the time of service.'],
  ['Do you offer financing?', 'Yes, we offer CareCredit and Cherry financing.'],
];

shell({
  file: 'insurance-and-financing',
  path: '/insurance-and-financing',
  title: 'Insurance & Financing',
  description: 'Dental insurance and financing information for Elm Ridge Implant and Family Dentistry in Killeen, TX. Learn about estimates, benefits, CareCredit, and Cherry.',
  crumb: 'Insurance & Financing',
  intro: 'Understanding dental insurance can be confusing. Our goal is to make things as clear and straightforward as possible so you know what to expect before treatment.',
  faq: mainFaq,
  body: `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-8">
    <h2>How Dental Insurance Works</h2>
    <p>Dental insurance helps offset the cost of care. It is not designed to fully cover every recommended treatment. Most dental plans are built around contract rules that may have little to do with what is best for your health, comfort, function, or long-term result.</p>
    <p>Plans typically include a deductible, an annual maximum, percentage-based coverage, and frequency limitations. A plan may pay a higher percentage for preventive care and a lower percentage for larger restorative care. Some plans replace clinical judgment with rules about timing, replacement frequency, alternate benefits, or missing teeth.</p>
    <p>Treatment decisions should not be dictated solely by insurance. Insurance can be useful, and we work hard to help patients use benefits wisely, but the best dental plan is the one based on your diagnosis, your goals, and your long-term health.</p>
    <h2>Estimates vs Reality</h2>
    <p>We provide our best estimate based on the information available to us at the time. That may include the plan information you provide, benefit details available from the insurance company, and our experience with similar claims.</p>
    <p>Insurance companies do NOT guarantee payment in advance. Even when a plan gives an estimate or pre-treatment estimate, final payment is determined after claim processing. The insurance company may process a claim differently because of eligibility, plan limitations, remaining annual maximum, deductibles, missing information, waiting periods, or internal plan rules.</p>
    <p><strong>All estimates are just that—estimates, not guarantees.</strong></p>
    <h2>Common Misunderstandings</h2>
    <ul><li>"Covered" does not mean free. It usually means the plan may contribute if plan rules are met.</li><li>Estimates are not guarantees. Final payment is decided after claim processing.</li><li>Insurance companies may downgrade benefits to a lower-cost alternate procedure.</li><li>Annual maximums are often lower than patients expect, especially for larger treatment plans.</li></ul>
    <h2>Payment Policy</h2>
    <p>Payment is due at the time services are rendered. We help estimate insurance and maximize benefits whenever possible, but patients are responsible for any amount not paid by insurance. Patients are also responsible for understanding their own benefits, including deductibles, annual maximums, waiting periods, excluded services, and frequency limitations.</p>
    <p>Our team is happy to help you interpret available information, but your insurance plan is a contract between you, your employer or plan sponsor, and the insurance company. The insurance company makes the final claim decision.</p>
    <h2>In-Network vs Out-of-Network</h2>
    <div class="bg-teal-pale border border-teal-light p-6">
      <p class="font-display text-3xl text-charcoal mb-3">Being out-of-network does NOT mean you cannot be a patient at our office.</p>
      <ul><li>We still file claims on your behalf when possible</li><li>We still make every effort to help maximize your insurance benefits</li></ul>
      <p><strong>“In many cases, patients are surprised to find that their out-of-network benefits are very similar to in-network coverage.”</strong></p>
    </div>
    <p>We focus on providing the best care—not limiting treatment based on insurance restrictions. If a plan is out-of-network, we can still help you understand likely benefits and how claims may be filed.</p>
    <div class="not-prose">
      <a href="/#contact" class="inline-block bg-teal px-8 py-4 text-center font-body text-xs font-semibold uppercase tracking-widest text-white hover:bg-teal-dark" style="color:#fff;">Call Us to Check Your Benefits</a>
    </div>
    <h2>Insurance Plans</h2>
    <p>We are in-network with many major dental insurance providers, including:</p>
    <ul><li>Delta Dental</li><li>MetLife</li><li>Cigna</li><li>Aetna</li><li>Guardian</li><li>UnitedHealthcare</li><li>and many more</li></ul>
    <p>If you do not see your plan listed, contact our office or your insurance provider to verify your benefits.</p>
    <p><strong>Out-of-network? No problem.</strong> Many patients use out-of-network benefits successfully.</p>
    <h2>Common Coverage Patterns</h2>
    <p>These are general patterns only. A crown may be covered at 50% by one plan but denied entirely by another depending on waiting periods, frequency limitations, and plan details.</p>
    <table><thead><tr><th>Procedure</th><th>Common Coverage Pattern</th></tr></thead><tbody><tr><td>Preventive visits</td><td>Often covered at a higher percentage, subject to frequency rules.</td></tr><tr><td>Fillings</td><td>Often covered after deductible, depending on material and plan rules.</td></tr><tr><td>Crowns</td><td>Often considered major care with deductibles, annual maximums, and replacement limits.</td></tr><tr><td>Dental implants</td><td>Coverage varies widely. Some plans exclude implants or cover only parts of treatment.</td></tr><tr><td>Invisalign</td><td>Often tied to orthodontic benefits, lifetime maximums, and adult coverage rules.</td></tr></tbody></table>
    <p><strong>Coverage varies significantly by plan.</strong> Contact your insurance provider or our office for details regarding your specific benefits.</p>
    <h2>Financing Options</h2>
    <div class="grid md:grid-cols-2 gap-5 not-prose">
      <a href="${careCreditUrl}" target="_blank" rel="noopener" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><p class="font-display text-3xl text-charcoal mb-3">CareCredit</p><p class="text-charcoal/65 leading-7">CareCredit offers healthcare financing options that can help patients spread dental treatment costs over time, subject to approval and plan terms.</p></a>
      <a href="${cherryUrl}" target="_blank" rel="noopener" class="block bg-stone border border-teal-light p-6 hover:border-teal transition-colors"><p class="font-display text-3xl text-charcoal mb-3">Cherry Financing</p><p class="text-charcoal/65 leading-7">Cherry offers a simple application process and flexible payment options for eligible patients, subject to approval and plan terms.</p></a>
    </div>
    <h2>Learn More About Your Coverage</h2>
    <div class="not-prose grid md:grid-cols-2 gap-4">
      ${cardLink('/insurance/crowns', 'Dental Crowns', 'How crown benefits, deductibles, frequency limits, and replacement rules may affect coverage.')}
      ${cardLink('/insurance/implants', 'Dental Implants', 'Why implant coverage varies and how annual maximums, exclusions, and financing can affect treatment.')}
      ${cardLink('/insurance/invisalign', 'Invisalign', 'How orthodontic benefits, lifetime maximums, and adult coverage rules may apply.')}
      ${cardLink('/insurance/why-didnt-insurance-pay', 'Why Didn’t Insurance Pay?', 'Common reasons claims process differently than expected.')}
      ${cardLink('/insurance/annual-maximum', 'Annual Maximums', 'What annual maximums are and why they matter for larger treatment plans.')}
    </div>
    <div class="bg-charcoal text-white p-7">
      <h2 class="text-white mt-0">Not in-network? That’s okay.</h2>
      <p class="text-white/75">Being out-of-network does NOT mean you cannot be a patient at our office.<br />We still help file claims and maximize your benefits.<br />In many cases, patients are surprised to find that their out-of-network benefits are very similar to in-network coverage.</p>
    </div>
    <h2>Insurance FAQ</h2>
    <div class="space-y-4">${mainFaq.map(([q,a])=>`<details class="bg-stone border border-teal-light p-6"><summary class="font-semibold text-charcoal">${q}</summary><p class="mt-3 text-charcoal/65 leading-7">${a}</p></details>`).join('')}</div>
  </div></section>`,
});

const supportPages = [
  {
    file: 'insurance/crowns',
    path: '/insurance/crowns',
    title: 'Dental Crown Insurance Coverage',
    crumb: 'Dental Crown Insurance',
    servicePath: '/dental-crowns-killeen-tx',
    serviceLabel: 'Dental Crowns',
    description: 'Learn how dental insurance may apply to crowns, including deductibles, frequency limits, replacement rules, and estimates at Elm Ridge in Killeen.',
    intro: 'Dental crown coverage can be helpful, but it depends on your plan rules, deductible, annual maximum, and whether the insurance company considers the crown eligible.',
    h2: 'How Insurance May Apply to Dental Crowns',
    content: `<p>Dental crowns are commonly considered a major restorative service. Many plans partially cover crowns when the tooth meets the plan’s requirements, but coverage is never automatic and should not be treated as guaranteed.</p>
    <p>A crown may be recommended when a tooth is cracked, heavily filled, broken, worn down, root canal treated, or too damaged for a filling alone. The insurance company may still apply its own rules before paying a claim. Those rules can include deductibles, waiting periods, replacement limitations, frequency limits, and alternate benefit clauses.</p>
    <p>Some plans cover a percentage of an approved fee after the deductible is met. The approved fee may be different from the office fee. If the plan allows a crown but pays based on a lower alternate benefit, the remaining balance may be the patient’s responsibility.</p>
    <h2>Deductibles and Annual Maximums</h2><p>Most plans require a deductible before major services are paid. A plan may also have an annual maximum, which is the total amount the insurance company will pay during the plan year. Once the annual maximum is reached, the patient is responsible for additional treatment costs until benefits renew.</p>
    <p>For many patients, this is where crown estimates become confusing. A plan may say crowns are covered at a certain percentage, but that percentage is usually applied after the deductible and only up to the plan's allowed amount. If the remaining annual maximum is low, the insurance payment may be lower than the percentage listed in the benefit summary.</p>
    <p>It is also common for different family members on the same plan to have different remaining benefits depending on care already completed during the year. One person may have nearly all of the annual maximum available, while another may have already used most of it for cleanings, fillings, periodontal therapy, or other treatment.</p>
    <h2>Frequency and Replacement Limitations</h2><p>Crown replacement rules are common. A plan may only cover replacement after a certain number of years, even when a crown is broken, leaking, decayed, or clinically needs replacement. These limitations are insurance contract rules, not clinical guarantees that the old crown is still healthy.</p>
    <p>If a crown was placed recently by another office, the plan may deny replacement even when the tooth needs treatment. If a crown is older, the insurance company may request x-rays, photos, or a narrative explaining why replacement is necessary.</p>
    <p>Replacement rules can be especially frustrating when a crown fails because of new decay, a fracture, an open margin, bite forces, or trauma. A tooth can need treatment even when the insurance company says the existing crown is too new for replacement benefits. In those situations, our role is to document the clinical problem clearly and help you understand the difference between insurance limitations and actual dental need.</p>
    <h2>Materials and Alternate Benefits</h2><p>Some plans also use material restrictions or alternate benefit rules. A plan may pay based on a less expensive crown type even when a more esthetic or more appropriate material is selected for the tooth. The best crown material depends on tooth position, bite forces, smile visibility, remaining tooth structure, and long-term goals.</p>
    <p>A common misunderstanding is that "covered" means the crown will be free or mostly paid for. In reality, one plan may cover a crown at 50%, another may apply a waiting period, and another may deny replacement because of frequency limitations.</p>
    <p>Elm Ridge Implant and Family Dentistry explains why a crown is recommended, what the crown is meant to protect, and how insurance may apply. We do not want patients surprised by plan rules after treatment is completed.</p>
    <h2>Estimates Are Not Guarantees</h2><p>We provide our best estimate based on available information, but insurance companies do not guarantee final payment in advance. Final payment is determined after claim processing. Patients are responsible for any amount not paid by insurance.</p>
    <p>If a pre-treatment estimate is submitted, it can be useful for planning, but it is still not a promise that the claim will pay exactly as expected. Eligibility can change, benefits can be used by another claim, and plan rules may be applied differently when the final claim is processed.</p>
    <h2>How Elm Ridge Helps</h2><p>Our team helps estimate benefits, submit claims when possible, and explain expected patient portions before treatment. We also help patients understand why a crown is recommended clinically, so the decision is not based only on what insurance may or may not pay.</p>
    <p>Learn more about <a href="/dental-crowns-killeen-tx">dental crowns in Killeen</a> or return to <a href="/insurance-and-financing">Insurance &amp; Financing</a>.</p>`,
    faq: [
      ['Are dental crowns covered by insurance?', 'Crowns are often partially covered when plan requirements are met, but coverage depends on your specific benefits, deductible, and limitations.'],
      ['Can insurance deny a crown?', 'Yes. A plan may deny a crown because of frequency limits, replacement rules, missing information, or plan exclusions.'],
      ['Is a crown estimate guaranteed?', 'No. Final payment is determined by the insurance company after claim processing.'],
    ],
  },
  {
    file: 'insurance/implants',
    path: '/insurance/implants',
    title: 'Dental Implant Insurance Coverage',
    crumb: 'Dental Implant Insurance',
    servicePath: '/dental-implants-killeen-tx',
    serviceLabel: 'Dental Implants',
    description: 'Learn how dental insurance may apply to dental implants, including exclusions, annual maximums, separate claim parts, and financing options.',
    intro: 'Dental implant coverage varies widely. Some plans help with parts of treatment, some exclude implants, and many plans are limited by annual maximums.',
    h2: 'Why Implant Coverage Varies',
    content: `<p>Dental implants are one of the most plan-dependent areas of dental insurance. Some plans include implant benefits. Some exclude implants completely. Others may not pay for the implant itself but may contribute toward related parts of treatment, such as an extraction, bone graft, implant crown, or denture.</p>
    <p>Because implant treatment is often completed in phases, claims may be processed separately. For example, an extraction, graft, implant placement, abutment, and crown may each be reviewed under different plan rules. That does not mean each part will be covered. It means the insurance company may apply different codes, percentages, exclusions, deductibles, and maximums to each step.</p>
    <h2>Annual Maximums Often Matter</h2><p>Many dental plans have annual maximums that are low compared with comprehensive implant treatment. Even when a plan includes implant benefits, the annual maximum may limit what the insurance company pays in a plan year. Larger implant plans may need to be sequenced, financed, or phased depending on clinical needs and patient goals.</p>
    <p>For example, a patient may have benefits available but still have a maximum that is much smaller than the total cost of replacing a missing tooth. That does not mean the plan is useless. It means the benefit may offset part of the treatment while the patient is responsible for the rest. This is one reason we prefer to review implant treatment in phases, so patients can understand what may be billed at each step.</p>
    <p>When multiple teeth are missing, the annual maximum becomes even more important. Single implants, implant bridges, snap-on dentures, and fixed full-arch implant options may involve different codes and different claim timing. The insurance estimate should be viewed as a planning tool, not as a promise of payment.</p>
    <h2>Implant Exclusions and Alternate Benefits</h2><p>Some plans exclude implants but offer an alternate benefit toward a removable denture or traditional bridge. A plan may also pay toward a crown but deny the implant body. These rules come from the insurance contract. They do not mean implants are unnecessary or inappropriate.</p>
    <p>A common misunderstanding is that implant coverage is all-or-nothing. For example, a plan may deny the implant body but pay toward the crown, or it may downgrade the benefit to a removable partial denture allowance. These are plan rules, not a judgment about which treatment is best for the patient.</p>
    <p>An alternate benefit can make a claim look misleading because the insurance company may pay toward what it considers a lower-cost option. For a missing tooth, that may be a removable partial denture or bridge allowance. The patient can still choose implant treatment, but the insurance payment may be based on the alternate service rather than the actual implant procedure.</p>
    <h2>Why Treatment Planning Matters</h2><p>Implant treatment should be planned around health, function, bone anatomy, bite forces, esthetics, and long-term maintenance. Insurance is part of the conversation, but it should not be the only deciding factor. Dr. Jeff uses CBCT imaging to evaluate bone, nerves, sinuses, and implant position before recommending treatment.</p>
    <p>Patients from Killeen, Harker Heights, Copperas Cove, Belton, Temple, and Salado often choose Elm Ridge because implant placement and restoration can be planned carefully in one private practice setting. That continuity matters when treatment has several steps and decisions.</p>
    <h2>Out-of-Network Implant Benefits</h2><p><strong>Being out-of-network does NOT prevent treatment.</strong> We still file claims on your behalf when possible and help estimate benefits before treatment begins.</p>
    <p><strong>“In many cases, patients are surprised to find that their out-of-network benefits are very similar to in-network coverage.”</strong></p>
    <p>Elm Ridge focuses on providing the best care—not limiting treatment based on insurance restrictions. Dr. Jeff uses CBCT imaging for implant planning and discusses realistic options based on your bone, bite, missing teeth, medical history, and long-term goals.</p>
    <h2>Financing and Implant Treatment</h2><p>Financing is commonly used for implant treatment because dental insurance may only offset part of the cost. Elm Ridge works with CareCredit and Cherry to help eligible patients spread treatment costs over time, subject to approval and plan terms.</p>
    <p>At the consultation, the goal is to understand what kind of implant solution fits the patient first: one missing tooth, several missing teeth, a loose denture, or a full-arch replacement. After the clinical plan is clear, insurance and financing can be discussed with better context.</p>
    <p>Learn more about <a href="/dental-implants-killeen-tx">dental implants in Killeen</a> or return to <a href="/insurance-and-financing">Insurance &amp; Financing</a>.</p>`,
    faq: [
      ['Does insurance cover dental implants?', 'Coverage varies widely. Some plans include implant benefits, some exclude implants, and some only contribute toward related parts of treatment.'],
      ['Can I use out-of-network benefits for implants?', 'Often, yes. Being out-of-network does not prevent treatment, and many patients use out-of-network benefits successfully.'],
      ['Why is financing often used for implants?', 'Dental insurance annual maximums may limit payment for larger implant treatment, so financing can help eligible patients manage costs over time.'],
      ['What implant cost factors affect insurance estimates?', 'The number of implants, extractions, grafting, final teeth, materials, and plan exclusions can all affect what insurance may or may not pay.'],
      ['Does insurance cover bone grafting for implants?', 'Sometimes. Bone grafting may be reviewed separately and is subject to plan rules, documentation, deductibles, and annual maximums.'],
      ['Can insurance downgrade implant benefits?', 'Yes. Some plans apply an alternate benefit toward a denture or bridge instead of paying toward the implant treatment selected.'],
    ],
  },
  {
    file: 'insurance/invisalign',
    path: '/insurance/invisalign',
    title: 'Invisalign Insurance Coverage',
    crumb: 'Invisalign Insurance',
    servicePath: '/invisalign-killeen-tx',
    serviceLabel: 'Invisalign',
    description: 'Learn how dental insurance may apply to Invisalign, orthodontic benefits, lifetime maximums, adult coverage, and treatment estimates.',
    intro: 'Invisalign is often handled through orthodontic benefits, which can be different from regular dental coverage.',
    h2: 'How Invisalign Benefits Usually Work',
    content: `<p>Invisalign coverage is commonly tied to orthodontic benefits rather than standard restorative dental benefits. That means the plan may have separate rules, a separate lifetime maximum, age limits, waiting periods, and different payment timing.</p>
    <p>Some plans include orthodontic benefits for children only. Some include adult orthodontic benefits. Some do not include orthodontic coverage at all. Even when orthodontic coverage exists, the benefit may be limited to a lifetime maximum that does not renew each year.</p>
    <h2>Lifetime Maximums</h2><p>An orthodontic lifetime maximum is the total amount the plan may pay toward orthodontic treatment over a person’s lifetime. If that benefit has already been used for braces or previous orthodontic care, it may not be available again.</p>
    <p>A common surprise is that orthodontic coverage may be a once-in-a-lifetime benefit rather than an annual benefit. Even when Invisalign is covered, the plan may only contribute up to a fixed lifetime amount.</p>
    <p>Unlike an annual maximum, a lifetime orthodontic maximum usually does not reset each year. The plan may also pay the benefit over time rather than all at once.</p>
    <h2>Adult Coverage Varies</h2><p>Adult Invisalign coverage varies significantly. Some plans cover adult orthodontics, some only cover dependents, and some exclude clear aligners even when they cover traditional braces. The insurance company makes the final decision after claim processing.</p>
    <p>Adult coverage can also depend on the subscriber's employer plan. Two plans from the same insurance company may treat Invisalign very differently. One may include adult orthodontic benefits, another may limit orthodontics to children, and another may exclude orthodontics completely. That is why the insurance company must verify the specific plan, not just the insurance company name.</p>
    <p>Some plans also pay orthodontic benefits in installments. Instead of paying the full benefit at the start, the plan may pay a portion when treatment begins and additional amounts over time while the plan remains active. If coverage changes during treatment, the remaining benefit may be affected.</p>
    <h2>Estimates and Treatment Decisions</h2><p>We can help estimate benefits based on available plan information, but estimates are not guarantees. Invisalign treatment should be based on your bite, crowding, spacing, goals, and long-term dental health—not only on insurance coverage.</p>
    <p>Some patients choose Invisalign because straighter teeth can be easier to clean, improve bite balance, and create a better foundation for cosmetic or restorative care. Others are focused on appearance and confidence. Either way, insurance is only one part of the decision.</p>
    <h2>What We Review Before Invisalign</h2><p>Before recommending Invisalign, Elm Ridge Implant and Family Dentistry evaluates tooth position, gum health, bite forces, crowding, spacing, wear, recession, and cosmetic goals. Clear aligners are not simply a product; they are a treatment plan that should fit the patient's mouth and long-term dental needs.</p>
    <p>Insurance may describe Invisalign as an orthodontic benefit, but patients often think of it as part of cosmetic dentistry. Both can be true. Alignment can improve the appearance of a smile, but it can also improve the foundation for crowns, veneers, bonding, whitening, and implant restorations.</p>
    <h2>Questions to Ask Your Plan</h2><p>Useful questions include whether adult orthodontics are covered, whether clear aligners are included, whether there is a lifetime maximum, whether any orthodontic benefit has already been used, and whether payments are made upfront or over time. Our team can help interpret available benefit information, but final claim decisions come from the insurance company.</p>
    <h2>Financing Invisalign</h2><p>If orthodontic benefits are limited or unavailable, financing may help eligible patients move forward with treatment. Elm Ridge offers CareCredit and Cherry financing options, subject to approval and plan terms.</p>
    <p>For many adults, the decision comes down to timing, comfort, and value. A limited insurance benefit can help, but it may not cover the full fee. Patients should also consider the convenience of removable aligners, the esthetic advantage of clear trays, and the benefit of improving tooth position before future dental work is needed.</p>
    <p>Patients from Killeen and nearby communities often ask whether Invisalign is "worth it" if insurance only pays a small amount. The answer depends on the diagnosis and goals. If alignment can improve smile balance, make hygiene easier, reduce crowding, or support restorative care, it may still be a good investment even when insurance only offsets part of the cost.</p>
    <p>We keep the insurance conversation straightforward: we estimate what we can, explain what is uncertain, and avoid promising payment that the insurance company has not guaranteed.</p>
    <p>Learn more about <a href="/invisalign-killeen-tx">Invisalign in Killeen</a> or return to <a href="/insurance-and-financing">Insurance &amp; Financing</a>.</p>`,
    faq: [
      ['Does insurance cover Invisalign?', 'Some plans cover Invisalign under orthodontic benefits, but adult coverage and clear aligner coverage vary by plan.'],
      ['What is an orthodontic lifetime maximum?', 'It is the total amount a plan may pay toward orthodontic care over a person’s lifetime, and it usually does not reset each year.'],
      ['Can adults have Invisalign benefits?', 'Some plans include adult orthodontic benefits, but many do not. Benefits must be verified with the plan.'],
    ],
  },
  {
    file: 'insurance/why-didnt-insurance-pay',
    path: '/insurance/why-didnt-insurance-pay',
    title: 'Why Didn’t Insurance Pay?',
    crumb: 'Why Insurance Did Not Pay',
    servicePath: '/#services',
    serviceLabel: 'Dental Services',
    description: 'Common reasons dental insurance may not pay as expected, including deductibles, annual maximums, waiting periods, frequency limits, and downgrade clauses.',
    intro: 'When dental insurance does not pay as expected, it is frustrating. Most denials or reductions come from plan rules, not from whether treatment was needed.',
    h2: 'Common Reasons Dental Insurance Pays Less Than Expected',
    content: `<p>Dental insurance can be helpful, but it is also full of contract rules. A claim may process differently than expected even when treatment is necessary, properly documented, and submitted correctly.</p>
    <p>The insurance company decides final payment after reviewing the claim. That decision may depend on eligibility, remaining benefits, plan limitations, documentation, and the exact contract your employer or plan sponsor purchased.</p>
    <p>This can feel unfair because the language patients hear from insurance companies often sounds simple: covered, not covered, in-network, out-of-network, basic, major, preventive. In reality, the final payment may depend on several rules at once. A service can be listed as covered and still pay less than expected because of a deductible, maximum, waiting period, downgrade, or frequency limit.</p>
    <h2>Deductible Not Met</h2><p>Many plans require the patient to pay a deductible before certain benefits apply. Preventive services may be exempt, but restorative or major services often require the deductible first.</p>
    <p>One common misunderstanding is that a covered procedure should not have any out-of-pocket cost. A procedure can be covered and still leave a balance because of deductibles, coinsurance, plan maximums, or downgraded benefits.</p>
    <h2>Annual Maximum Reached</h2><p>The annual maximum is the total amount the plan will pay during the benefit year. If the maximum is reached, the plan may not pay additional claims until benefits renew.</p>
    <h2>Waiting Periods</h2><p>Some plans require a waiting period before covering certain procedures. A patient may be eligible for cleanings immediately but have to wait before coverage applies to crowns, dentures, implants, or other major services.</p>
    <h2>Frequency Limits</h2><p>Frequency limits restrict how often a service is covered. A plan may only pay for certain x-rays, cleanings, crowns, dentures, or replacements after a specific amount of time has passed.</p>
    <h2>Downgrade Clause</h2><p>A downgrade clause means the plan pays based on a lower-cost alternative instead of the treatment actually provided. For example, a plan may pay based on a metal crown allowance even when a tooth-colored crown is placed.</p>
    <h2>Alternate Benefit</h2><p>An alternate benefit means the insurance company decides a different procedure is the plan’s payable option. The plan may apply payment toward the alternate option and leave the difference as the patient’s responsibility.</p>
    <h2>Missing Tooth Clause</h2><p>A missing tooth clause may limit or deny replacement of a tooth that was missing before the plan began. This can affect bridges, partial dentures, implants, or other tooth replacement treatment.</p>
    <h2>Documentation Requests</h2><p>Insurance companies may request x-rays, photos, periodontal charting, narratives, dates of previous treatment, or additional clinical details. A request for more information does not automatically mean the claim will be denied. It means the claim is being reviewed under the plan's rules.</p>
    <p>When appropriate, Elm Ridge Implant and Family Dentistry can provide supporting information. Some decisions can be clarified or corrected, but some denials are simply the result of plan limitations. We will be honest about what can reasonably be done.</p>
    <h2>Coordination of Benefits</h2><p>If a patient has more than one dental plan, coordination of benefits may affect payment. Primary and secondary insurance do not always combine to pay the full balance. The secondary plan may reduce payment based on what the primary plan already paid, or it may apply its own limitations.</p>
    <h2>Out-of-Network Processing</h2><p>Out-of-network claims can also process differently depending on the plan. Being out-of-network does not mean you cannot be a patient at our office, and it does not automatically mean there are no benefits. Many patients still use out-of-network benefits successfully, but the insurance company determines the allowed amount and final payment.</p>
    <h2>How to Avoid Surprises</h2><p>The best way to reduce surprises is to provide accurate insurance information early, let the team know about any plan changes, and understand that estimates are not guarantees. We can help estimate benefits, but patients are responsible for any amount not paid by insurance.</p>
    <p>If something looks wrong on an explanation of benefits, our team can help you understand what the insurance company sent back. Sometimes the issue is missing information. Other times it is a plan limitation. Either way, clear communication helps patients know what happened and what the next reasonable step should be.</p>
    <h2>What Elm Ridge Can Do</h2><p>We can help submit claims, provide supporting documentation when appropriate, and explain the information we receive from the insurance company. We cannot force an insurance company to pay, and estimates are not guarantees.</p>
    <p>Return to <a href="/insurance-and-financing">Insurance &amp; Financing</a> or explore our <a href="/#services">dental services</a>.</p>`,
    faq: [
      ['Why did insurance pay less than expected?', 'Common reasons include deductibles, annual maximums, waiting periods, frequency limits, downgrade clauses, alternate benefits, or missing tooth clauses.'],
      ['Does a denial mean treatment was unnecessary?', 'No. Insurance denials often reflect plan rules, not whether treatment was clinically needed.'],
      ['Can Elm Ridge appeal or resubmit a claim?', 'When appropriate, we can help provide documentation or resubmit information, but the insurance company makes the final decision.'],
    ],
  },
  {
    file: 'insurance/annual-maximum',
    path: '/insurance/annual-maximum',
    title: 'Dental Insurance Annual Maximums',
    crumb: 'Annual Maximums',
    servicePath: '/#services',
    serviceLabel: 'Dental Services',
    description: 'Learn what a dental insurance annual maximum is, why it does not roll over, and how it affects larger treatment plans.',
    intro: 'The annual maximum is one of the most important dental insurance limits to understand, especially for crowns, implants, dentures, and larger treatment plans.',
    h2: 'What Is an Annual Maximum?',
    content: `<p>A dental insurance annual maximum is the total amount the insurance company will pay toward covered dental care during a benefit year. Once the plan has paid that amount, additional treatment is typically the patient’s responsibility until the benefit year resets.</p>
    <p>Annual maximums vary by plan. Many plans have maximums that are modest compared with the cost of larger restorative or implant treatment. This is one reason dental insurance should be viewed as help toward care, not complete coverage.</p>
    <h2>Typical Limits</h2><p>Many dental plans have annual maximums in a range such as $1,000 to $2,000, though some plans are lower or higher. The exact number depends on the plan purchased by the employer, plan sponsor, or individual policyholder.</p>
    <p>Patients are often surprised that annual maximums may be lower than the cost of a crown, denture, bridge, or implant plan. The maximum is the insurance company's payment limit, not the total cost of care.</p>
    <p>The annual maximum may apply differently depending on the service. Preventive care, diagnostic care, fillings, crowns, root canals, dentures, implants, and orthodontic treatment may all be handled differently by the plan.</p>
    <p>It is important to understand that the annual maximum is not the total cost of treatment and not the amount the patient can spend. It is the cap on what the insurance company may pay. If a treatment plan is larger than the remaining maximum, the patient portion may be higher even when the service is technically covered.</p>
    <h2>Annual Maximums Usually Do Not Roll Over</h2><p>In most plans, unused benefits do not roll over into the next year. If a plan has $1,500 available and only $500 is used, the unused amount usually disappears when the benefit year ends. Some plans have exceptions, but rollover benefits are not standard.</p>
    <h2>How Annual Maximums Affect Larger Treatment</h2><p>Larger treatment plans can exceed the annual maximum quickly. A crown, denture, implant, graft, bridge, or combination of treatment may use most or all of the available benefit. After that, the insurance company may not pay more until the benefit renews.</p>
    <p>For patients who need multiple procedures, we may discuss sequencing treatment across benefit years when it is clinically reasonable. However, delaying treatment just to wait for benefits is not always wise. Infection, cracks, bite problems, pain, or failing teeth may worsen if care is postponed.</p>
    <h2>Use It or Lose It</h2><p>Because most dental benefits do not roll over, unused benefits may be lost at the end of the plan year. This is why preventive visits, diagnosed restorative care, periodontal maintenance, and planned treatment should not be ignored until the last minute. Waiting until December can make scheduling harder and may leave too little time to complete treatment properly.</p>
    <p>That said, using benefits should never mean rushing into treatment without understanding the diagnosis. Elm Ridge Implant and Family Dentistry wants patients to make informed decisions based on dental health first, then use insurance wisely where it helps.</p>
    <h2>Planning Multi-Step Treatment</h2><p>Some care happens in stages. Implant treatment, dentures, crowns after root canals, and larger restorative plans may require healing time, lab work, or multiple appointments. The claim timing may not match the exact day a patient first discusses treatment. This matters when benefits renew, deductibles reset, or insurance changes.</p>
    <p>For example, an extraction and graft may happen before an implant is placed. A root canal may be followed by a crown. A denture may need adjustments or relines after healing. Each step can affect the annual maximum differently.</p>
    <h2>Questions Worth Asking</h2><p>Helpful questions include how much of your annual maximum remains, when the benefit year renews, whether a deductible still applies, and whether any planned treatment has frequency limits or waiting periods. Our team can help gather available information, but the insurance company controls final claim processing.</p>
    <h2>Planning Around Benefits</h2><p>Our team can help estimate how much of the annual maximum remains and how that may affect the treatment plan. Estimates are not guarantees, because the insurance company determines final payment after processing claims.</p>
    <p>Financing may also help eligible patients move forward when annual maximums are not enough for needed care. Elm Ridge offers CareCredit and Cherry financing options, subject to approval and plan terms.</p>
    <p>Return to <a href="/insurance-and-financing">Insurance &amp; Financing</a> or explore our <a href="/#services">dental services</a>.</p>`,
    faq: [
      ['What is a dental insurance annual maximum?', 'It is the total amount the insurance company will pay toward covered dental care during a benefit year.'],
      ['Does unused dental insurance roll over?', 'Usually no. Most unused benefits do not roll over when the benefit year ends.'],
      ['Can larger treatment exceed my annual maximum?', 'Yes. Crowns, implants, dentures, bridges, and larger plans can exceed the annual maximum quickly.'],
    ],
  },
];

fs.mkdirSync('insurance', { recursive: true });
for (const page of supportPages) {
  shell({
    file: page.file,
    path: page.path,
    title: page.title,
    description: page.description,
    crumb: page.crumb,
    intro: page.intro,
    faq: page.faq,
    body: `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
      <div class="not-prose mb-8 flex flex-col sm:flex-row gap-3">
        <a href="/insurance-and-financing" class="inline-block border border-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-teal-dark hover:bg-teal-pale">Insurance &amp; Financing</a>
        <a href="${page.servicePath}" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white hover:bg-teal-dark">${page.serviceLabel}</a>
      </div>
      <h2>${page.h2}</h2>
      ${supportCoverageTable(page)}
      ${page.content}
      <h2>FAQ</h2>
      <div class="not-prose space-y-4">${page.faq.map(([q,a])=>`<details class="bg-stone border border-teal-light p-6"><summary class="font-semibold text-charcoal">${q}</summary><p class="mt-3 text-charcoal/65 leading-7">${a}</p></details>`).join('')}</div>
    </div></section>`,
  });
}

function insertFooterLink(html) {
  if (html.includes('/insurance-and-financing')) return html;
  return html.replace(
    '<li><a href="/post-operative-instructions" class="font-body text-sm text-white/55 hover:text-white">Post-Op Instructions</a></li>',
    '<li><a href="/insurance-and-financing" class="font-body text-sm text-white/55 hover:text-white">Insurance &amp; Financing</a></li><li><a href="/post-operative-instructions" class="font-body text-sm text-white/55 hover:text-white">Post-Op Instructions</a></li>'
  );
}

function addServiceInsuranceLinks() {
  const snippets = [
    ['dental-crowns-killeen-tx', '<section class="py-12 bg-white"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-stone p-7"><h2 class="font-display text-3xl text-charcoal mb-3">Dental Crown Insurance</h2><p class="text-charcoal/65 leading-7 mb-5">Learn how deductibles, frequency limits, and replacement rules may affect crown coverage.</p><a href="/insurance/crowns" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">Learn About Crown Insurance</a></div></section>'],
    ['dental-implants-killeen-tx', '<section class="py-12 bg-white"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-stone p-7"><h2 class="font-display text-3xl text-charcoal mb-3">Dental Implant Insurance</h2><p class="text-charcoal/65 leading-7 mb-5">Implant coverage varies widely. Learn how benefits, exclusions, annual maximums, and financing may apply.</p><a href="/insurance/implants" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">Learn About Implant Insurance</a></div></section>'],
    ['single-tooth-implant-killeen-tx', '<section class="py-12 bg-white"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-stone p-7"><h2 class="font-display text-3xl text-charcoal mb-3">Dental Implant Insurance</h2><p class="text-charcoal/65 leading-7 mb-5">Implant coverage varies widely. Learn how benefits, exclusions, annual maximums, and financing may apply.</p><a href="/insurance/implants" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">Learn About Implant Insurance</a></div></section>'],
    ['implant-bridges-killeen-tx', '<section class="py-12 bg-white"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-stone p-7"><h2 class="font-display text-3xl text-charcoal mb-3">Dental Implant Insurance</h2><p class="text-charcoal/65 leading-7 mb-5">Implant coverage varies widely. Learn how benefits, exclusions, annual maximums, and financing may apply.</p><a href="/insurance/implants" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">Learn About Implant Insurance</a></div></section>'],
    ['full-arch-dental-implants-killeen-tx', '<section class="py-12 bg-white"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-stone p-7"><h2 class="font-display text-3xl text-charcoal mb-3">Dental Implant Insurance</h2><p class="text-charcoal/65 leading-7 mb-5">Implant coverage varies widely. Learn how benefits, exclusions, annual maximums, and financing may apply.</p><a href="/insurance/implants" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">Learn About Implant Insurance</a></div></section>'],
    ['all-on-4-dental-implants-killeen-tx', '<section class="py-12 bg-white"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-stone p-7"><h2 class="font-display text-3xl text-charcoal mb-3">Dental Implant Insurance</h2><p class="text-charcoal/65 leading-7 mb-5">Implant coverage varies widely. Learn how benefits, exclusions, annual maximums, and financing may apply.</p><a href="/insurance/implants" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">Learn About Implant Insurance</a></div></section>'],
    ['snap-on-dentures-killeen-tx', '<section class="py-12 bg-white"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-stone p-7"><h2 class="font-display text-3xl text-charcoal mb-3">Dental Implant Insurance</h2><p class="text-charcoal/65 leading-7 mb-5">Implant coverage varies widely. Learn how benefits, exclusions, annual maximums, and financing may apply.</p><a href="/insurance/implants" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">Learn About Implant Insurance</a></div></section>'],
    ['invisalign-killeen-tx', '<section class="py-12 bg-white"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-stone p-7"><h2 class="font-display text-3xl text-charcoal mb-3">Invisalign Insurance</h2><p class="text-charcoal/65 leading-7 mb-5">Learn how orthodontic benefits, lifetime maximums, and adult coverage may apply to Invisalign.</p><a href="/insurance/invisalign" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">Learn About Invisalign Insurance</a></div></section>'],
    ['cosmetic-dentistry-killeen-tx', '<section class="py-12 bg-white"><div class="max-w-4xl mx-auto px-6 border border-teal-light bg-stone p-7"><h2 class="font-display text-3xl text-charcoal mb-3">Insurance for Cosmetic and Restorative Care</h2><p class="text-charcoal/65 leading-7 mb-5">Coverage depends on the procedure and plan rules. Learn more about crowns, Invisalign, and annual maximums.</p><div class="flex flex-col sm:flex-row gap-3"><a href="/insurance/crowns" class="inline-block bg-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-white">Crown Insurance</a><a href="/insurance/invisalign" class="inline-block border border-teal px-6 py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-teal-dark">Invisalign Insurance</a></div></div></section>'],
  ];

  for (const [file, snippet] of snippets) {
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    if (html.includes(snippet)) continue;
    html = html.replace('</main>', `${snippet}</main>`);
    fs.writeFileSync(file, html);
  }
}

for (const file of fs.readdirSync('.')) {
  if (fs.statSync(file).isFile()) {
    const html = fs.readFileSync(file, 'utf8');
    if (html.includes('<footer class="bg-charcoal')) fs.writeFileSync(file, insertFooterLink(html));
  }
}

addServiceInsuranceLinks();

let sitemap = fs.readFileSync('sitemap.xml', 'utf8');
for (const route of insurancePages) {
  const loc = `${domain}/${route}`;
  if (!sitemap.includes(loc)) {
    sitemap = sitemap.replace('</urlset>', `  <url><loc>${loc}</loc><priority>${route === 'insurance-and-financing' ? '0.7' : '0.6'}</priority></url>\n</urlset>`);
  }
}
fs.writeFileSync('sitemap.xml', sitemap);
