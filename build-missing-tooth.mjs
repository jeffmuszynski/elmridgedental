import fs from 'fs';
import { writePage, jsonLd, dentistEntityRef, domain, faqSchema } from './site-helpers.mjs';

const missingToothServiceSchema = jsonLd({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Missing Tooth Replacement Consultation',
  url: `${domain}/what-happens-if-you-dont-replace-a-missing-tooth`,
  description:
    'Evaluation and treatment planning for missing teeth, bone loss, grafting, and replacement options in Killeen, TX.',
  provider: dentistEntityRef,
  areaServed: [
    { '@type': 'City', name: 'Killeen' },
    { '@type': 'City', name: 'Harker Heights' },
    { '@type': 'City', name: 'Copperas Cove' },
    { '@type': 'City', name: 'Belton' },
    { '@type': 'City', name: 'Temple' },
    { '@type': 'Place', name: 'Fort Hood' },
  ],
  serviceType: [
    'Dental Implants',
    'Tooth Extractions',
    'Tooth Replacement Consultation',
    'Implant Bridges',
  ],
}, 'missing-tooth-service');

const missingToothFaq = [
  {
    question: 'Can one missing tooth really affect other teeth?',
    answer:
      'Yes. Even one missing tooth can change how nearby teeth lean, how the opposing tooth erupts, and how your bite functions over time.',
  },
  {
    question: 'What is super-eruption?',
    answer:
      'Super-eruption happens when the tooth above or below an empty space starts drifting farther out because it no longer has an opposing tooth to stop it.',
  },
  {
    question: 'Does bone shrink after tooth loss?',
    answer:
      'Yes. Once a tooth root is gone, the surrounding jawbone usually starts shrinking because it is no longer being stimulated the way it was when the tooth was present.',
  },
  {
    question: 'Is grafting always necessary after an extraction?',
    answer:
      'No. Some sites heal well without grafting, while others benefit from socket preservation to support a cleaner future implant or bridge plan. It depends on the tooth, the bone, and the long-term plan.',
  },
  {
    question: 'Can I get an implant immediately after extraction?',
    answer:
      'Sometimes. In the right case, an implant can be placed the same day as the extraction. In other cases, it is safer to graft first and let the site heal before implant placement.',
  },
  {
    question: 'What happens if I wait years to replace a tooth?',
    answer:
      'The site can lose bone, nearby teeth can drift, the opposing tooth can over-erupt, and the bite can change. Treatment is often still possible later, but it may be more complex and more expensive.',
  },
];

writePage('what-happens-if-you-dont-replace-a-missing-tooth', {
  path: '/what-happens-if-you-dont-replace-a-missing-tooth',
  title: "What Happens If You Don't Replace a Missing Tooth? | Killeen, TX",
  description:
    'A missing tooth can lead to shifting teeth, bone loss, bite changes, and more complex treatment later. Learn your replacement options at Elm Ridge Implant and Family Dentistry.',
  crumb: 'Missing Tooth Consequences',
  kicker: 'Missing Tooth Guide',
  h1: "What Happens If You Don't Replace a Missing Tooth?",
  intro:
    'A missing tooth is rarely just a cosmetic issue. Over time, the surrounding teeth, the opposing teeth, the bone in the jaw, and the bite itself can all start changing. The goal is not to pressure anyone. It is to help you understand what usually happens so you can make a clear decision earlier, while treatment is often simpler.',
  heroPrimaryLabel: 'Schedule an Evaluation',
  heroPrimaryHref: '/#contact',
  heroSecondaryLabel: 'Call 254-699-4127',
  heroSecondaryHref: 'tel:+12546994127',
  body: `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
    <h2>It Often Starts Small</h2>
    <p>Most people do not lose a tooth and immediately feel a crisis. The space may not show much. Chewing may still feel possible. Life is busy. Cost may be a factor. Other priorities take over.</p>
    <p>That is understandable. But the mouth rarely treats a missing tooth as a neutral event. The space changes the forces on everything around it. What starts as a single missing tooth can become a more involved restorative problem if it sits too long.</p>

    <h2>Teeth Can Drift and Shift</h2>
    <p>Teeth are not fixed like fence posts in concrete. They respond to pressure and to missing contact. When one tooth is gone, the neighboring teeth often start leaning into the space. That can create food traps, crooked contacts, gum irritation, and a bite that no longer comes together the same way.</p>
    <div class="not-prose border border-teal-light bg-stone p-6">
      <p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-4">Visual Placeholder</p>
      <div class="grid md:grid-cols-3 gap-4">
        <div class="border border-teal-light bg-white p-5"><p class="font-semibold text-charcoal mb-2">1. Tooth is lost</p><p class="text-charcoal/65 leading-7">An open space remains where the root and crown used to be.</p></div>
        <div class="border border-teal-light bg-white p-5"><p class="font-semibold text-charcoal mb-2">2. Neighboring teeth lean</p><p class="text-charcoal/65 leading-7">Teeth beside the space begin drifting toward the opening.</p></div>
        <div class="border border-teal-light bg-white p-5"><p class="font-semibold text-charcoal mb-2">3. Cleaning and bite worsen</p><p class="text-charcoal/65 leading-7">Contacts change, flossing gets harder, and future replacement becomes less straightforward.</p></div>
      </div>
    </div>

    <h2>Opposing Teeth Can Over-Erupt</h2>
    <p>If a tooth loses the tooth it normally bites against, it can start moving farther out of the gum over time. This is called super-eruption. It can change how the teeth meet, create interferences, and reduce the space available for a future replacement tooth.</p>
    <div class="not-prose border border-teal-light bg-stone p-6">
      <p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-4">Visual Placeholder</p>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="border border-teal-light bg-white p-5"><p class="font-semibold text-charcoal mb-2">Healthy bite relationship</p><p class="text-charcoal/65 leading-7">Upper and lower teeth stop each other in a balanced position.</p></div>
        <div class="border border-teal-light bg-white p-5"><p class="font-semibold text-charcoal mb-2">After tooth loss</p><p class="text-charcoal/65 leading-7">The opposing tooth can drift farther into the space and complicate future treatment.</p></div>
      </div>
    </div>

    <h2>Bone Loss After Tooth Extraction</h2>
    <p>Bone exists around teeth because tooth roots stimulate it. Once a root is gone, the body starts remodeling that area. Some shrinkage is expected after extraction. If the site is left alone for a long time, the ridge can become narrower and shorter, making future implant treatment harder.</p>
    <div class="not-prose border border-teal-light bg-stone p-6">
      <p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-4">Visual Placeholder</p>
      <div class="grid md:grid-cols-3 gap-4">
        <div class="border border-teal-light bg-white p-5"><p class="font-semibold text-charcoal mb-2">At extraction</p><p class="text-charcoal/65 leading-7">The socket is present, and the ridge still reflects the lost root.</p></div>
        <div class="border border-teal-light bg-white p-5"><p class="font-semibold text-charcoal mb-2">Early healing</p><p class="text-charcoal/65 leading-7">The ridge starts narrowing as the body remodels the empty site.</p></div>
        <div class="border border-teal-light bg-white p-5"><p class="font-semibold text-charcoal mb-2">Longer delay</p><p class="text-charcoal/65 leading-7">Bone volume can be reduced enough that grafting becomes more likely before implant placement.</p></div>
      </div>
    </div>

    <h2>Why Socket Preservation Grafting Matters</h2>
    <p>When a tooth is extracted and future replacement is likely, socket preservation grafting can help maintain the shape of the ridge while the site heals. It does not freeze the bone perfectly in place, and it is not needed in every case, but it can reduce how much collapse happens and make future implant treatment more manageable.</p>
    <p>This is one reason emergency extractions and planned extractions should not be thought of only as "taking the tooth out." The long-term replacement plan matters from the start. If a tooth cannot be saved, we want to think about what the site needs next, not just what hurts today.</p>

    <h2>A Typical Extraction-to-Implant Timeline</h2>
    <p>Every case is different, but this is a common sequence when a tooth cannot be saved and an implant is likely to be the long-term answer.</p>
    <div class="not-prose border border-teal-light bg-stone p-6">
      <p class="text-xs uppercase tracking-[0.28em] text-teal-dark mb-4">Visual Placeholder</p>
      <div class="grid md:grid-cols-5 gap-4">
        <div class="border border-teal-light bg-white p-5"><p class="font-semibold text-charcoal mb-2">1. Evaluation</p><p class="text-charcoal/65 leading-7">Diagnose the tooth, infection, bite, and bone.</p></div>
        <div class="border border-teal-light bg-white p-5"><p class="font-semibold text-charcoal mb-2">2. Extraction and graft</p><p class="text-charcoal/65 leading-7">Remove the tooth and preserve the site when appropriate.</p></div>
        <div class="border border-teal-light bg-white p-5"><p class="font-semibold text-charcoal mb-2">3. Healing</p><p class="text-charcoal/65 leading-7">Allow roughly 3 to 4 months for the site to mature.</p></div>
        <div class="border border-teal-light bg-white p-5"><p class="font-semibold text-charcoal mb-2">4. Implant placement</p><p class="text-charcoal/65 leading-7">Place the implant once the site is ready.</p></div>
        <div class="border border-teal-light bg-white p-5"><p class="font-semibold text-charcoal mb-2">5. Final crown</p><p class="text-charcoal/65 leading-7">After integration, deliver the definitive tooth.</p></div>
      </div>
    </div>

    <h2>What Are My Tooth Replacement Options?</h2>
    <p>The right answer depends on the tooth position, the condition of the neighboring teeth, bone availability, and budget. Common options include:</p>
    <div class="not-prose grid md:grid-cols-3 gap-5">
      <a href="/single-tooth-implant-killeen-tx" class="block border border-teal-light bg-stone p-6 hover:border-teal transition-colors">
        <p class="font-display text-3xl text-charcoal mb-3">Single Tooth Implant</p>
        <p class="text-charcoal/65 leading-7">Usually the cleanest long-term option when the neighboring teeth are healthy.</p>
      </a>
      <div class="border border-teal-light bg-stone p-6">
        <p class="font-display text-3xl text-charcoal mb-3">Traditional Bridge</p>
        <p class="text-charcoal/65 leading-7">Sometimes a practical answer if the teeth next to the space already need crowns.</p>
      </div>
      <a href="/dentures-killeen-tx" class="block border border-teal-light bg-stone p-6 hover:border-teal transition-colors">
        <p class="font-display text-3xl text-charcoal mb-3">Partial Denture</p>
        <p class="text-charcoal/65 leading-7">A removable option when several teeth are missing or cost is the main constraint.</p>
      </a>
    </div>
    <p>We also help patients compare <a href="/dental-implants-killeen-tx">dental implants</a>, <a href="/implant-bridges-killeen-tx">implant bridges</a>, and other practical options after extraction so the replacement plan matches the whole mouth, not just one space.</p>

    <h2>When Should a Missing Tooth Be Replaced?</h2>
    <p>Earlier treatment is often simpler than waiting until teeth shift, bone shrinks, bite changes worsen, surrounding teeth become damaged, or treatment becomes more complex. That does not mean every missing tooth has to be replaced immediately. It means the consequences of waiting should be understood before "later" quietly turns into a much harder case.</p>
    <p>We understand many patients delay treatment because of cost. The goal is not pressure. The goal is helping patients understand their options before the situation becomes more complicated. Financing options can often help patients move forward sooner while spreading payments into more manageable monthly amounts. If that is part of your decision, we can talk through <a href="/insurance/implants">implant insurance</a> and <a href="/insurance-and-financing">financing</a> without making the conversation feel sales-driven.</p>
    <p>If you think a tooth may need to come out soon, it also helps to read the related extraction information first. Start with <a href="/tooth-extractions-killeen-tx">tooth extractions</a>, or if the area is already painful or swollen, call for an <a href="/emergency-dentist-killeen-tx">emergency evaluation</a> so we can stabilize the problem and make a plan.</p>
  </div></section>`,
  faqHeading: 'Missing Tooth FAQ',
  faq: missingToothFaq,
  footerTitle: 'Need Help Thinking Through a Missing Tooth?',
  footerText:
    'Schedule an evaluation with Elm Ridge Implant and Family Dentistry in Killeen. We can explain what is changing now, what can wait, and what may become harder if the space sits too long.',
  footerPrimaryLabel: 'Schedule an Evaluation',
  footerPrimaryHref: '/#contact',
  footerSecondaryLabel: 'Call 254-699-4127',
  footerSecondaryHref: 'tel:+12546994127',
  headSchemas: [missingToothServiceSchema],
});

function patchFile(file, replacer) {
  const original = fs.readFileSync(file, 'utf8');
  const updated = replacer(original);
  if (updated !== original) {
    fs.writeFileSync(file, updated);
  }
}

function replaceFaqScript(html, faqItems) {
  return html.replace(
    /<script type="application\/ld\+json"[^>]*>\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?<\/script>/,
    faqSchema(faqItems),
  );
}

const emergencyFaq = [
  {
    question: 'Do you offer same-day emergency appointments?',
    answer:
      'We do our best to see urgent dental problems quickly, often the same day. Call early for the best chance of being seen.',
  },
  {
    question: 'Should I go to the ER for a toothache?',
    answer:
      'The ER may help with severe swelling, trauma, or medical danger, but dental treatment usually requires a dentist. If breathing or swallowing is affected, seek emergency medical care immediately.',
  },
  {
    question: 'What happens if my tooth cannot be saved?',
    answer:
      'We focus first on diagnosing the problem and getting pain or infection under control. If the tooth cannot be predictably restored, extraction may be the healthiest next step, and we will also talk through grafting and future replacement options.',
  },
  {
    question: 'Should I replace a tooth after extraction?',
    answer:
      'Often, yes. The right replacement depends on the tooth position, the bite, the neighboring teeth, and your goals, but leaving a space too long can allow teeth to shift and bone to shrink.',
  },
  {
    question: 'Can I get a dental implant after an emergency extraction?',
    answer:
      'Sometimes. Some cases are good candidates for grafting and a staged implant plan, and some may be candidates for immediate implant placement. It depends on infection, bone, and the specific tooth site.',
  },
  {
    question: 'What happens if I wait too long to replace a missing tooth?',
    answer:
      'Bone loss, tooth movement, and bite changes can make future replacement more involved. Treatment is often still possible later, but it may be less simple than it would have been earlier.',
  },
];

patchFile('emergency-dentist-killeen-tx', (html) => {
  if (!html.includes('What Happens If a Tooth Cannot Be Saved?')) {
    html = html.replace(
      `<h2 class="font-display text-4xl text-charcoal">Common Emergency Dental Problems</h2>`,
      `<h2 class="font-display text-4xl text-charcoal">What Happens If a Tooth Cannot Be Saved?</h2><p>The first step is still the same: diagnose the tooth and relieve pain or infection. If the tooth cannot be predictably restored, extraction may be the healthiest option. When the future plan points that direction, we may also recommend socket preservation grafting to help maintain bone for a later replacement.</p><p>A common sequence is emergency evaluation, pain control, extraction when needed, about 3 to 4 months of healing, implant placement, another 3 to 4 months of integration, and then the final implant crown. Not every case follows that exact timeline, but that is often the framework. If you want to understand the bigger picture, read <a href="/what-happens-if-you-dont-replace-a-missing-tooth">what happens if you do not replace a missing tooth</a>.</p><p>If replacement is likely, we usually discuss <a href="/dental-implants-killeen-tx">dental implants</a>, a <a href="/single-tooth-implant-killeen-tx">single tooth implant</a>, the extraction plan itself, and any relevant <a href="/insurance-and-financing">financing options</a> early so the site is protected instead of ignored.</p><h2 class="font-display text-4xl text-charcoal">Common Emergency Dental Problems</h2>`,
    );
  }

  const faqSection = `<h2 class="font-display text-4xl text-charcoal">Emergency Dental FAQ</h2><div class="space-y-4"><details class="bg-stone border border-teal-light p-6"><summary class="font-semibold">Do you offer same-day emergency appointments?</summary><p class="mt-3">We do our best to see urgent dental problems quickly, often the same day. Call early for the best chance of being seen.</p></details><details class="bg-stone border border-teal-light p-6"><summary class="font-semibold">Should I go to the ER for a toothache?</summary><p class="mt-3">The ER may help with severe swelling, trauma, or medical danger, but dental treatment usually requires a dentist. If breathing or swallowing is affected, seek emergency medical care immediately.</p></details><details class="bg-stone border border-teal-light p-6"><summary class="font-semibold">What happens if my tooth cannot be saved?</summary><p class="mt-3">We focus first on diagnosing the problem and getting pain or infection under control. If the tooth cannot be predictably restored, extraction may be the healthiest next step, and we will also talk through grafting and future replacement options.</p></details><details class="bg-stone border border-teal-light p-6"><summary class="font-semibold">Should I replace a tooth after extraction?</summary><p class="mt-3">Often, yes. The right replacement depends on the tooth position, the bite, the neighboring teeth, and your goals, but leaving a space too long can allow teeth to shift and bone to shrink.</p></details><details class="bg-stone border border-teal-light p-6"><summary class="font-semibold">Can I get a dental implant after an emergency extraction?</summary><p class="mt-3">Sometimes. Some cases are good candidates for grafting and a staged implant plan, and some may be candidates for immediate implant placement. It depends on infection, bone, and the specific tooth site.</p></details><details class="bg-stone border border-teal-light p-6"><summary class="font-semibold">What happens if I wait too long to replace a missing tooth?</summary><p class="mt-3">Bone loss, tooth movement, and bite changes can make future replacement more involved. Treatment is often still possible later, but it may be less simple than it would have been earlier.</p></details></div>`;
  html = html.replace(
    /<h2 class="font-display text-4xl text-charcoal">Emergency Dental FAQ<\/h2><div class="space-y-4">[\s\S]*?<\/div><\/div><\/section>/,
    `${faqSection}</div></section>`,
  );
  html = replaceFaqScript(html, emergencyFaq);
  return html;
});

const implantFaq = [
  {
    question: 'Do you place dental implants in-house?',
    answer:
      'Yes. Dr. Jeff Muszynski places and restores dental implants at Elm Ridge Implant and Family Dentistry in Killeen, so planning, surgery, and final teeth can be coordinated by one team.',
  },
  {
    question: 'Do you offer All-on-4 or fixed full-arch implant teeth?',
    answer:
      'Yes. We evaluate patients for fixed full-arch implant options, including All-on-4 style treatment, as well as removable implant-retained options.',
  },
  {
    question: 'Do you offer snap-on implant dentures?',
    answer:
      'Yes. Snap-on implant dentures can improve stability for patients who want a removable denture that attaches to implants.',
  },
  {
    question: 'How much do dental implants cost?',
    answer:
      'Cost depends on the number of implants, whether extractions or bone grafting are needed, the type of final teeth, materials, and the overall complexity of the case. We review cost after an exam and CBCT-based consultation.',
  },
  {
    question: 'Can I be sedated for implant treatment?',
    answer:
      'Elm Ridge offers nitrous oxide and oral conscious sedation with triazolam for appropriate candidates. Not everyone is a candidate, but everyone is welcome to be evaluated.',
  },
  {
    question: 'Why do you use CBCT imaging?',
    answer:
      'CBCT imaging helps evaluate bone and anatomy in 3D, which is important for precise implant planning and avoiding critical structures.',
  },
  {
    question: 'How long do dental implants take to heal?',
    answer:
      'Most implant cases need about 3 to 4 months of healing before the final restoration. Some grafting or sinus cases may take longer.',
  },
  {
    question: 'Are dental implants painful?',
    answer:
      'Patients are numbed for implant placement. Soreness, swelling, or tenderness can happen afterward, but the visit is planned to keep the experience controlled and comfortable.',
  },
  {
    question: "What happens if I don't replace a missing tooth?",
    answer:
      'Over time, nearby teeth can drift, opposing teeth can over-erupt, and the bone in the missing-tooth site can shrink. That can make future treatment more involved than it would have been earlier.',
  },
  {
    question: 'Can teeth shift after losing a tooth?',
    answer:
      'Yes. Teeth can lean into the open space and the opposing tooth can start moving farther out, which is one reason replacing a missing tooth is often easier sooner than later.',
  },
  {
    question: 'Why does bone loss matter for dental implants?',
    answer:
      'Dental implants need enough bone for stable placement. If bone shrinks after tooth loss, grafting may become more likely before the implant can be placed.',
  },
  {
    question: 'Can I finance dental implant treatment?',
    answer:
      'Yes. We can help you understand implant insurance, out-of-pocket costs, and financing options so the decision is based on real numbers instead of guessing.',
  },
];

patchFile('dental-implants-killeen-tx', (html) => {
  if (!html.includes('Why Replacing a Missing Tooth Earlier Is Often Easier')) {
    html = html.replace(
      `<h2 class="font-display text-4xl text-charcoal">Why Patients Choose Elm Ridge for Implants</h2>`,
      `<h2 class="font-display text-4xl text-charcoal">Why Replacing a Missing Tooth Earlier Is Often Easier</h2><p>One missing tooth can stay quiet for a while, but the site usually does not stay unchanged. Teeth can start drifting, the opposing tooth can over-erupt, and the bone in the area can gradually shrink. That is one reason we encourage patients to understand <a href="/what-happens-if-you-dont-replace-a-missing-tooth">what happens if you do not replace a missing tooth</a> before the space has been sitting for years.</p><p>If a single tooth is missing, a <a href="/single-tooth-implant-killeen-tx">single tooth implant</a> is often the cleanest long-term solution. If the timing or finances need to be thought through, we can also walk you through <a href="/insurance/implants">implant insurance</a> and broader <a href="/insurance-and-financing">financing options</a> without making the conversation feel rushed.</p><h2 class="font-display text-4xl text-charcoal">Why Patients Choose Elm Ridge for Implants</h2>`,
    );
  }

  const faqSection = `<section class="py-16 bg-stone"><div class="max-w-4xl mx-auto px-6"><h2 class="font-display text-4xl mb-8">Dental Implant FAQ</h2><div class="space-y-4"><details class="bg-white border border-teal-light p-6"><summary class="font-semibold">Do you place dental implants in-house?</summary><p class="mt-3 text-charcoal/65">Yes. Dr. Jeff Muszynski places and restores dental implants at Elm Ridge in Killeen, so planning, surgery, and final teeth can be coordinated by one team.</p></details><details class="bg-white border border-teal-light p-6"><summary class="font-semibold">Do you offer All-on-4 or fixed full-arch implant teeth?</summary><p class="mt-3 text-charcoal/65">Yes. We evaluate patients for fixed full-arch implant options, including All-on-4 style treatment, as well as removable implant-retained options.</p></details><details class="bg-white border border-teal-light p-6"><summary class="font-semibold">Do you offer snap-on implant dentures?</summary><p class="mt-3 text-charcoal/65">Yes. Snap-on implant dentures can improve stability for patients who want a removable denture that attaches to implants.</p></details><details class="bg-white border border-teal-light p-6"><summary class="font-semibold">How much do dental implants cost?</summary><p class="mt-3 text-charcoal/65">Cost depends on the number of implants, whether extractions or bone grafting are needed, the type of final teeth, materials, and the overall complexity of the case. We review cost after an exam and CBCT-based consultation.</p></details><details class="bg-white border border-teal-light p-6"><summary class="font-semibold">Can I be sedated for implant treatment?</summary><p class="mt-3 text-charcoal/65">Elm Ridge offers nitrous oxide and oral conscious sedation with triazolam for appropriate candidates. Not everyone is a candidate, but everyone is welcome to be evaluated.</p></details><details class="bg-white border border-teal-light p-6"><summary class="font-semibold">Why do you use CBCT imaging?</summary><p class="mt-3 text-charcoal/65">CBCT imaging helps evaluate bone and anatomy in 3D, which is important for precise implant planning and avoiding critical structures.</p></details><details class="bg-white border border-teal-light p-6"><summary class="font-semibold">How long do dental implants take to heal?</summary><p class="mt-3 text-charcoal/65">Most implant cases need about 3 to 4 months of healing before the final restoration. Some grafting or sinus cases may take longer.</p></details><details class="bg-white border border-teal-light p-6"><summary class="font-semibold">Are dental implants painful?</summary><p class="mt-3 text-charcoal/65">Patients are numbed for implant placement. Soreness, swelling, or tenderness can happen afterward, but the visit is planned to keep the experience controlled and comfortable.</p></details><details class="bg-white border border-teal-light p-6"><summary class="font-semibold">What happens if I don't replace a missing tooth?</summary><p class="mt-3 text-charcoal/65">Over time, nearby teeth can drift, opposing teeth can over-erupt, and the bone in the missing-tooth site can shrink. That can make future treatment more involved than it would have been earlier.</p></details><details class="bg-white border border-teal-light p-6"><summary class="font-semibold">Can teeth shift after losing a tooth?</summary><p class="mt-3 text-charcoal/65">Yes. Teeth can lean into the open space and the opposing tooth can start moving farther out, which is one reason replacing a missing tooth is often easier sooner than later.</p></details><details class="bg-white border border-teal-light p-6"><summary class="font-semibold">Why does bone loss matter for dental implants?</summary><p class="mt-3 text-charcoal/65">Dental implants need enough bone for stable placement. If bone shrinks after tooth loss, grafting may become more likely before the implant can be placed.</p></details><details class="bg-white border border-teal-light p-6"><summary class="font-semibold">Can I finance dental implant treatment?</summary><p class="mt-3 text-charcoal/65">Yes. We can help you understand <a href="/insurance/implants">implant insurance</a>, out-of-pocket costs, and <a href="/insurance-and-financing">financing options</a> so the decision is based on real numbers instead of guessing.</p></details></div></div></section>`;
  html = html.replace(
    /<section class="py-16 bg-stone"><div class="max-w-4xl mx-auto px-6"><h2 class="font-display text-4xl mb-8">Dental Implant FAQ<\/h2><div class="space-y-4">[\s\S]*?<\/div><\/div><\/section>/,
    faqSection,
  );
  html = replaceFaqScript(html, implantFaq);
  return html;
});

patchFile('tooth-extractions-killeen-tx', (html) => {
  if (!html.includes('What Happens If a Tooth Cannot Be Saved?')) {
    html = html.replace(
      `<p><a href="/post-op/extractions">Tooth Extraction Aftercare Instructions â†’</a></p>`,
      `<p><a href="/post-op/extractions">Tooth Extraction Aftercare Instructions â†’</a></p><h2>What Happens If a Tooth Cannot Be Saved?</h2><p>Sometimes the first goal is simply to get you out of pain and control infection. If the tooth cannot be predictably restored, extraction may be the healthiest next step. When appropriate, we may recommend socket preservation grafting at the same visit to help maintain bone for a future replacement.</p><p>A typical path is emergency evaluation, extraction, about 3 to 4 months of healing, implant placement, another 3 to 4 months of integration, and then the final implant crown. Some cases can move faster and some need more staging, but it helps to understand the sequence early. Learn more about <a href="/what-happens-if-you-dont-replace-a-missing-tooth">what happens if you do not replace a missing tooth</a> if you want the bigger picture.</p><p>If replacement is likely, we often discuss <a href="/dental-implants-killeen-tx">dental implants</a>, a <a href="/single-tooth-implant-killeen-tx">single tooth implant</a>, and any relevant <a href="/insurance-and-financing">financing options</a> right away so the site is protected instead of ignored.</p>`,
    );
  }
  html = html.replace(
    `The longer you go without replacing a missing tooth, the more the surrounding teeth shift and the underlying bone resorbs. We give you the time and information to make a real decision, not a pressured one.`,
    `The longer you go without replacing a missing tooth, the more the surrounding teeth shift and the underlying bone resorbs. We give you the time and information to make a real decision, not a pressured one. If you want a clearer explanation of the long-term changes, read <a href="/what-happens-if-you-dont-replace-a-missing-tooth">what happens if you do not replace a missing tooth</a>.`,
  );
  return html;
});

patchFile('sitemap.xml', (xml) => {
  if (xml.includes('what-happens-if-you-dont-replace-a-missing-tooth')) return xml;
  return xml.replace(
    '</urlset>',
    `  <url><loc>https://www.elmridgedental.com/what-happens-if-you-dont-replace-a-missing-tooth</loc><priority>0.7</priority></url>\n</urlset>`,
  );
});

patchFile('what-happens-if-you-dont-replace-a-missing-tooth', (html) =>
  html
    .replace(
      `<title>What Happens If You Don't Replace a Missing Tooth? | Killeen, TX | Elm Ridge Implant and Family Dentistry</title>`,
      `<title>What Happens If You Don't Replace a Missing Tooth? | Killeen, TX</title>`,
    )
    .replace(
      `content="What Happens If You Don't Replace a Missing Tooth? | Killeen, TX | Elm Ridge Implant and Family Dentistry"`,
      `content="What Happens If You Don't Replace a Missing Tooth? | Killeen, TX"`,
    )
    .replace(
      `<meta name="twitter:title" content="What Happens If You Don't Replace a Missing Tooth? | Killeen, TX | Elm Ridge Implant and Family Dentistry" />`,
      `<meta name="twitter:title" content="What Happens If You Don't Replace a Missing Tooth? | Killeen, TX" />`,
    ),
);
