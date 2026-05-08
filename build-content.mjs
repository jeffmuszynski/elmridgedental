import fs from 'fs';
import { head, header, footer, menuScript, breadcrumb, faqSchema, writePage, domain, withHeadSchemas, medicalProcedureSchema } from './site-helpers.mjs';

writePage('sleep-dentistry-killeen-tx', {
  path: '/sleep-dentistry-killeen-tx',
  title: 'Sleep Dentistry Killeen TX | Sleep Apnea Testing and Oral Appliances',
  description: 'Sleep dentistry in Killeen, TX with home sleep tests, STOP-Bang screening, snoring help, sleep apnea consults, and oral appliance therapy at Elm Ridge.',
  crumb: 'Sleep Dentistry',
  kicker: 'Sleep Dentistry',
  h1: 'Sleep Dentistry in Killeen, TX',
  intro: 'Snoring, poor sleep, and untreated sleep apnea can affect your health, your mood, your partner, and your daily energy. Elm Ridge helps patients test at home and explore comfortable oral appliance options when appropriate.',
  image: 'sleep-apnea-airway-ai.webp',
  alt: 'Illustration of a restricted airway improved by mandibular advancement oral appliance',
  body: `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
    <h2>What Is Sleep Apnea?</h2><p>Sleep apnea is a condition where breathing repeatedly stops or becomes restricted during sleep. In obstructive sleep apnea, the airway collapses or becomes blocked. Your brain wakes the body just enough to reopen the airway, often without you remembering it.</p>
    <p>AHI stands for apnea-hypopnea index. It estimates how many times per hour your breathing stops or becomes significantly reduced. An AHI of 5 to 14 is commonly considered mild sleep apnea, 15 to 29 is moderate, and 30 or more is severe.</p>
    <h2>Why We Care About Sleep Apnea</h2><p>Untreated sleep apnea is linked with fragmented sleep, oxygen drops, high blood pressure, heart disease, stroke, diabetes, mood changes, daytime sleepiness, and difficulty concentrating. It can also affect energy, weight, libido, irritability, and the patience you bring home at the end of the day.</p>
    <h2>Snoring Affects More Than the Person Snoring</h2><p>Snoring often disrupts a spouse or partner first. Many patients ask about sleep treatment because their partner is exhausted, sleeping in another room, or tired of nudging them all night. Snoring is not always sleep apnea, but loud habitual snoring deserves attention.</p>
    <h2>Home Sleep Testing</h2><p>Elm Ridge offers home sleep testing so patients can sleep in their own bed during a normal night. No awkward sleep hotel. No unnecessary referral loop just to get started. Home sleep tests are often more comfortable, more convenient, and commonly less expensive than a lab-based sleep study.</p>
    <p>The results are read by a sleep physician. That physician makes the official diagnosis and treatment recommendations. If oral appliance therapy is appropriate, our dental team can help with a custom mandibular advancement device.</p>
    <h2>STOP-Bang Sleep Apnea Risk Check</h2><p>This screening tool does not diagnose sleep apnea, but it can help you decide whether testing makes sense.</p>
    <div class="stop-card bg-stone border border-teal-light p-6 space-y-3"><div id="stopbang" class="grid gap-3"><label><input type="checkbox" /> Snoring: Do you snore loudly?</label><label><input type="checkbox" /> Tired: Do you often feel tired, fatigued, or sleepy during the day?</label><label><input type="checkbox" /> Observed: Has anyone seen you stop breathing, choke, or gasp during sleep?</label><label><input type="checkbox" /> Pressure: Do you have or are you treated for high blood pressure?</label><label><input type="checkbox" /> BMI: Is your BMI over 35?</label><label><input type="checkbox" /> Age: Are you older than 50?</label><label><input type="checkbox" /> Neck: Is your neck circumference over 16 inches?</label><label><input type="checkbox" /> Gender: Are you male?</label></div><div class="mt-5 bg-white border border-teal-light p-4"><p class="font-semibold text-charcoal">Your STOP-Bang score: <span id="stopbang-score">0</span> / 8</p><p id="stopbang-risk" class="text-charcoal/65 mt-2">0-2 is generally low risk, 3-4 is intermediate risk, and 5-8 is high risk. Symptoms still matter even with a lower score.</p></div></div>
    <h2>Red Flags That Should Not Be Ignored</h2><ul><li>Observed pauses in breathing, choking, or gasping during sleep</li><li>Loud snoring most nights</li><li>Morning headaches or dry mouth</li><li>Daytime sleepiness, fatigue, poor focus, or irritability</li><li>High blood pressure or difficult-to-control blood pressure</li><li>Waking frequently to use the restroom</li><li>Falling asleep while reading, watching TV, or driving</li></ul>
    <h2>Mandibular Advancement Devices</h2><p>A mandibular advancement device gently holds the lower jaw forward during sleep. That forward position can help open the airway and reduce collapse. We use custom, titratable oral appliances rather than one-size-fits-all boil-and-bite devices.</p>
    <img src="/mandibular-advancement-device-ai.webp" alt="Custom mandibular advancement oral appliance for sleep apnea treatment" class="w-full shadow-xl my-8" loading="lazy" decoding="async" />
    <p>For many mild to moderate sleep apnea patients, oral appliance therapy can be highly effective and is often better tolerated than CPAP. CPAP may still be the best choice for some patients, especially severe cases, but many people struggle with the mask, noise, bulky equipment, travel inconvenience, and distilled water. A dental sleep appliance is quiet, compact, easy to travel with, and does not create noise for your bed partner.</p>
    <p>Medical insurance may help pay toward a mandibular advancement appliance in some cases. Coverage depends on the medical plan, diagnosis, documentation, and treatment recommendation.</p>
    <h2>Dr. Jeff's Personal Story</h2><p>Dr. Jeff has always snored. His wife eventually encouraged him to get a sleep study, and he was diagnosed with mild sleep apnea. He thought he slept fine and had normal energy. After treating himself with a mandibular advancement device, his wife reports no snoring, and he reports waking less, sleeping deeper, feeling more rested, and having a better mood in the morning.</p>
    <h2>Medical References</h2><p>Patients can review sleep apnea information from the <a href="https://www.nhlbi.nih.gov/health/sleep-apnea" target="_blank" rel="noopener">National Heart, Lung, and Blood Institute</a>, oral appliance guidance from the <a href="https://aasm.org/aasm-and-aadsm-issue-new-joint-clinical-practice-guideline-for-oral-appliance-therapy/" target="_blank" rel="noopener">American Academy of Sleep Medicine</a>, and STOP-Bang scoring from the <a href="https://www.stopbang.ca/osa/results.php" target="_blank" rel="noopener">official STOP-Bang resource</a>.</p>
  </div></section><script>document.addEventListener('input',()=>{const box=document.getElementById('stopbang');if(!box)return;const score=box.querySelectorAll('input:checked').length;document.getElementById('stopbang-score').textContent=score;let risk='Low risk range. If symptoms are present, testing may still be appropriate.';if(score>=5)risk='High risk range. A sleep test is strongly worth discussing.';else if(score>=3)risk='Intermediate risk range. A sleep test may be appropriate, especially with symptoms or observed breathing pauses.';document.getElementById('stopbang-risk').textContent=risk;});</script>`,
  faq: [
    ['Can a dentist diagnose sleep apnea?', 'A sleep physician makes the official diagnosis. Elm Ridge can provide home sleep testing, and results are interpreted by a sleep physician.'],
    ['What does AHI mean?', 'AHI estimates how many times per hour breathing stops or becomes significantly reduced during sleep.'],
    ['Can an oral appliance replace CPAP?', 'CPAP is often first-line therapy, especially for severe sleep apnea. Oral appliance therapy can be an effective alternative for adults who prefer it or cannot tolerate CPAP, especially in many mild to moderate cases.'],
    ['Will medical insurance help pay for a mandibular advancement device?', 'Sometimes. Coverage depends on your medical insurance plan, diagnosis, documentation, and medical necessity requirements.']
  ],
  headSchemas: [
    medicalProcedureSchema('Sleep Dentistry Consultation', 'Diagnostic', 'Airway'),
  ],
});

writePage('family-dentist-killeen-tx', {
  path: '/family-dentist-killeen-tx',
  title: 'Family Dentist in Killeen, TX | Elm Ridge Implant and Family Dentistry',
  description: 'Family dentist in Killeen, TX serving kids, adults, and seniors with wellness exams, cleanings, fillings, and preventive care from Drs. Muszynski.',
  crumb: 'Family Dentist',
  kicker: 'Family Dentistry',
  h1: 'Family Dentist in Killeen, TX',
  intro: `A family dentist takes care of every age and stage — kids losing their first baby teeth, parents juggling busy schedules, retirees protecting decades of dental work. At Elm Ridge Implant and Family Dentistry, Drs. Jeff and Kayla Muszynski see patients from age one through retirement in one Killeen office, with one chart, and one team you'll see year after year.`,
  heroPrimaryLabel: 'Schedule a Family Visit',
  heroPrimaryHref: '/#contact',
  heroSecondaryLabel: 'Call 254-699-4127',
  heroSecondaryHref: 'tel:+12546994127',
  body: `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
    <h2>What "Family Dentistry" Actually Includes</h2>
    <p>General and family dentistry covers the everyday care that keeps teeth healthy long-term: wellness exams, cleanings, fillings, sealants, fluoride, oral cancer screening, and the early conversations that prevent bigger problems. It's the foundation of dental care — done well, you need fewer crowns, fewer root canals, and far fewer surprises.</p>
    <h2>Wellness Exams</h2>
    <p>A wellness exam is more than a quick look. At each visit, Drs. Jeff or Kayla check teeth for new decay, examine gums for early signs of periodontal disease, screen the soft tissues for oral cancer, evaluate your bite, look for cracks or wear, and review any recent changes in your medical history that affect dental care. We use digital X-rays at the recommended frequency for your risk level — never more, never as routine.</p>
    <h2>Professional Cleanings</h2>
    <p>Cleanings remove plaque and tartar that brushing and flossing leave behind. Tartar (calcified plaque) cannot be removed at home and is the primary driver of gum disease. We tailor cleaning intensity to your needs — a healthy adult typically needs a routine cleaning every six months, while patients with active periodontal disease may need scaling and root planing followed by 3-month maintenance visits.</p>
    <h2>Fillings and Restorative Care</h2>
    <p>When decay is caught early, a tooth-colored composite filling restores it in one appointment. We do not place silver amalgam fillings. For teeth with larger decay or fractures, we offer onlays and crowns that protect the remaining tooth structure.</p>
    <h2>Dental Care for Kids</h2>
    <p>The American Academy of Pediatric Dentistry recommends a child's first dental visit by age one or within six months of their first tooth. Early visits build comfort, teach parents about brushing and diet, and catch problems while they're small. We see kids of all ages at Elm Ridge with a friendly, no-pressure approach.</p>
    <h2>Care for Seniors</h2>
    <p>Older adults face unique dental challenges — root decay from gum recession, dry mouth from medications, complex restorative needs from years of previous dental work, and the increasing relevance of dental health to overall medical conditions like diabetes and heart disease. We work with seniors and caregivers on practical, realistic care plans that match what matters most.</p>
    <h2>Why Patients Choose Elm Ridge for Family Care</h2>
    <ul>
      <li>Husband-and-wife dentists who see your whole family in one office</li>
      <li>Nine years serving Killeen, Bell County, and Fort Cavazos</li>
      <li>One chart, one team — no rotating dentists or chain handoffs</li>
      <li>Tricare and most major <a href="/insurance-and-financing">dental insurance</a> accepted</li>
      <li><a href="/emergency-dentist-killeen-tx">Same-day emergency appointments</a> when life happens</li>
      <li>Family-owned, privately operated — not a corporate franchise</li>
    </ul>
  </div></section>`,
  faqHeading: 'Family Dentistry FAQ',
  faq: [
    {
      question: 'How often should I see the dentist for a checkup?',
      answer: `Most patients benefit from a checkup and cleaning every six months. Patients with active gum disease, a history of decay, or specific risk factors may need to come in more often — we'll tell you what's right for you.`,
    },
    {
      question: 'When should my child first see a dentist?',
      answer: `Within six months of the first tooth, or by age one — whichever comes first. The first visit is short, friendly, and mostly about getting your child comfortable with the chair and our team.`,
    },
    {
      question: 'Do you accept Tricare?',
      answer: `Many of our patients are military families through Fort Cavazos. Coverage depends on your specific Tricare dental plan (Active Duty Dental Program vs. Tricare Dental Program through United Concordia). Call (254) 699-4127 with your member ID and we'll verify your benefits before your visit.`,
      answerHtml: `Many of our patients are military families through Fort Cavazos. Coverage depends on your specific <a href="/insurance-and-financing">Tricare dental plan</a> (Active Duty Dental Program vs. Tricare Dental Program through United Concordia). Call (254) 699-4127 with your member ID and we'll verify your benefits before your visit.`,
    },
    {
      question: 'What does a routine cleaning and exam cost without insurance?',
      answer: `Call (254) 699-4127 with your insurance information and we'll give you a clear out-of-pocket estimate before your visit. With most PPO insurance, preventive visits are typically covered at or near 100%.`,
    },
    {
      question: 'Can my whole family book back-to-back appointments?',
      answer: `Yes — this is one of the main reasons patients choose a family practice. Tell our front desk how many family members need to be seen and we'll block the time together when our schedule allows.`,
    },
    {
      question: 'Do you see patients with anxiety or special needs?',
      answer: `Yes. We offer nitrous oxide and oral conscious sedation for evaluated candidates, and our team is patient with kids and adults who find dental visits challenging.`,
      answerHtml: `Yes. We offer nitrous oxide and <a href="/sedation-dentistry-killeen-tx">oral conscious sedation</a> for evaluated candidates, and our team is patient with kids and adults who find dental visits challenging.`,
    },
  ],
  footerTitle: 'Looking for a Family Dentist in Killeen?',
  footerText: 'Schedule a visit at Elm Ridge Implant and Family Dentistry. Drs. Jeff and Kayla Muszynski welcome new patients of all ages.',
  footerPrimaryLabel: 'Schedule Your Visit',
  footerPrimaryHref: '/#contact',
  footerSecondaryLabel: 'Call 254-699-4127',
  footerSecondaryHref: 'tel:+12546994127',
  headSchemas: [
    medicalProcedureSchema('Family and General Dentistry', 'Preventive', 'Teeth and Gums'),
  ],
});

writePage('sedation-dentistry-killeen-tx', {
  path: '/sedation-dentistry-killeen-tx',
  title: 'Sedation Dentistry in Killeen, TX | Elm Ridge Implant and Family Dentistry',
  description: 'Sedation dentistry in Killeen, TX with nitrous oxide and oral conscious sedation for evaluated candidates. Comfortable care for anxious patients.',
  crumb: 'Sedation Dentistry',
  kicker: 'Sedation Dentistry',
  h1: 'Sedation Dentistry in Killeen, TX',
  intro: `Dental anxiety is one of the most common reasons patients put off care — and one of the most treatable. At Elm Ridge Implant and Family Dentistry, we offer nitrous oxide and oral conscious sedation for evaluated candidates, so the visit you've been avoiding can be one you barely remember.`,
  heroPrimaryLabel: 'Schedule a Sedation Consultation',
  heroPrimaryHref: '/#contact',
  heroSecondaryLabel: 'Call 254-699-4127',
  heroSecondaryHref: 'tel:+12546994127',
  body: `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
    <h2>Why Patients Choose Sedation</h2>
    <p>Patients ask us for sedation for many reasons: a previous bad experience, a strong gag reflex, fear of needles, difficulty staying numb, longer or more complex procedures, or simply wanting to feel calmer about a visit they've been postponing for years. Sedation isn't about being unconscious — it's about being relaxed enough to receive the care you need.</p>
    <h2>Nitrous Oxide ("Laughing Gas")</h2>
    <p>Nitrous oxide is a mild sedative inhaled through a small nosepiece. It takes effect within minutes, produces a relaxed, slightly floaty feeling, and wears off completely within five minutes after the gas is turned off. You can drive yourself to and from the appointment. Nitrous works well for routine procedures and mild-to-moderate anxiety.</p>
    <h2>Oral Conscious Sedation</h2>
    <p>For deeper relaxation, we offer oral conscious sedation using triazolam — a prescription pill taken before your appointment. You'll feel drowsy and relaxed but able to respond. Most patients remember little of the visit afterward, which is normal. You'll need a driver to and from the appointment, and you should plan to rest for the remainder of the day.</p>
    <h2>Local Anesthesia</h2>
    <p>For most patients, local anesthesia alone is enough. We use techniques to make the injection itself comfortable — topical numbing gel, slow delivery, and modern anesthetic agents. Sedation is added only when it genuinely helps the experience, not as a default.</p>
    <h2>Who Is a Candidate?</h2>
    <p>Sedation is appropriate for many patients but not everyone. We evaluate your medical history, current medications, weight, and the specific procedure when deciding which sedation option is right for you. Patients with certain heart conditions, sleep apnea, pregnancy, or specific medications may need an alternative approach. Bring your full medication list to the consultation.</p>
    <h2>What to Expect on the Day of Treatment</h2>
    <ul>
      <li>Don't eat or drink for the hours specified at your consultation (typically six hours)</li>
      <li>Take any prescribed medications as instructed</li>
      <li>Arrange a driver for oral sedation appointments</li>
      <li>Wear comfortable clothing</li>
      <li>We'll monitor your vital signs throughout the visit</li>
      <li>A trusted adult should stay with you for several hours afterward</li>
    </ul>
    <h2>Is Sedation Safe?</h2>
    <p>Yes, when administered by a trained provider with appropriate monitoring. Dental sedation has an excellent safety record. We monitor blood pressure, pulse, and oxygen continuously during your visit, and we adjust dosage based on your weight and health history.</p>
  </div></section>`,
  faqHeading: 'Sedation Dentistry FAQ',
  faq: [
    {
      question: 'Will I be unconscious?',
      answer: 'No. With the sedation we offer, you remain conscious and able to respond — just relaxed and drowsy. True general anesthesia (full unconsciousness) is reserved for hospital-based oral surgery.',
    },
    {
      question: 'How long does the sedation last?',
      answer: 'Nitrous oxide wears off within five minutes after the gas is stopped. Oral conscious sedation with triazolam wears off over several hours; you may feel groggy for the rest of the day.',
    },
    {
      question: 'Can I drive home?',
      answer: `After nitrous, yes. After oral conscious sedation, no — you need a driver and shouldn't drive, operate machinery, or make important decisions for the rest of the day.`,
    },
    {
      question: 'Will my insurance cover sedation?',
      answer: "Some plans cover sedation for medically-necessary procedures (like surgical extractions). Coverage for sedation due to anxiety alone varies. We'll tell you what your specific plan covers before treatment.",
      answerHtml: `Some plans cover sedation for medically-necessary procedures (like <a href="/tooth-extractions-killeen-tx">surgical extractions</a>). Coverage for sedation due to anxiety alone varies. We'll tell you what your specific <a href="/insurance-and-financing">plan</a> covers before treatment.`,
    },
    {
      question: `What if I'm afraid of the needle, not the procedure?`,
      answer: `We use a stronger, specially formulated and custom compounded topical anesthetic (numbing gel) and a slow injection technique to try to minimize discomfort with the injections. We can also use nitrous oxide (laughing gas) to help take the edge off. Many patients find this is all they need.`,
    },
  ],
  footerTitle: 'Ready for a Calmer Dental Visit?',
  footerText: 'Schedule a consultation to talk through your concerns and the right sedation option for you. Elm Ridge Implant and Family Dentistry in Killeen, TX.',
  footerPrimaryLabel: 'Schedule a Consultation',
  footerPrimaryHref: '/#contact',
  footerSecondaryLabel: 'Call 254-699-4127',
  footerSecondaryHref: 'tel:+12546994127',
  headSchemas: [
    medicalProcedureSchema('Sedation Dentistry', 'Therapeutic', 'Mouth'),
  ],
});

writePage('tooth-extractions-killeen-tx', {
  path: '/tooth-extractions-killeen-tx',
  title: 'Tooth Extractions in Killeen, TX | Elm Ridge Implant and Family Dentistry',
  description: 'Tooth extractions in Killeen, TX including wisdom teeth and surgical extractions. Sedation and replacement options at Elm Ridge with Dr. Jeff Muszynski.',
  crumb: 'Tooth Extractions',
  kicker: 'Tooth Extractions',
  h1: 'Tooth Extractions in Killeen, TX',
  intro: `We try to save teeth when we can. But when a tooth is too damaged, infected, or causing more harm than it's worth, a planned extraction protects the rest of your mouth and clears the path for a clean, healthy outcome. At Elm Ridge Implant and Family Dentistry, Dr. Jeff Muszynski performs simple and surgical extractions in-house, with sedation options available.`,
  heroPrimaryLabel: 'Schedule an Evaluation',
  heroPrimaryHref: '/#contact',
  heroSecondaryLabel: 'Call 254-699-4127',
  heroSecondaryHref: 'tel:+12546994127',
  body: `<section class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7">
    <h2>When a Tooth Needs to Be Extracted</h2>
    <p>Common reasons we recommend extraction:</p>
    <ul>
      <li>Severe decay that has reached the nerve and isn't restorable</li>
      <li>A cracked tooth fractured below the gumline</li>
      <li>Advanced gum disease that has destroyed the supporting bone</li>
      <li>Infection that hasn't responded to root canal treatment</li>
      <li>Wisdom teeth that are impacted, decayed, or affecting other teeth</li>
      <li>Crowding before orthodontic treatment</li>
      <li>Failed prior dental work where the underlying tooth is no longer salvageable</li>
    </ul>
    <p>We never recommend an extraction if the tooth can reasonably be saved. The goal is the long-term health of your bite, not a quick fix.</p>
    <h2>Simple vs. Surgical Extractions</h2>
    <p>A <strong>simple extraction</strong> removes a tooth that's fully erupted and accessible. With local anesthesia, the procedure is usually quick and comfortable. A <strong>surgical extraction</strong> is needed when a tooth is broken at the gumline, impacted (like most wisdom teeth), or has roots that require careful management. Surgical extractions take longer and have a longer recovery, but Dr. Jeff plans them carefully using CBCT imaging when needed.</p>
    <h2>Wisdom Teeth</h2>
    <p>Most patients have their wisdom teeth evaluated in their late teens or early twenties. We recommend removal when the teeth are impacted (stuck under the gum or angled into adjacent teeth), causing pain, decay, or cysts, or are likely to cause problems based on their position. Not all wisdom teeth need to come out — we'll tell you honestly what we see on the X-ray.</p>
    <h2>Comfort and Sedation Options</h2>
    <p>Local anesthesia is enough for most extractions. For patients who want additional comfort — anxiety, complex extractions, multiple teeth at once — we offer nitrous oxide and <a href="/sedation-dentistry-killeen-tx">oral conscious sedation with triazolam</a> for evaluated candidates. Bring your medication list to your evaluation.</p>
    <h2>Healing and Aftercare</h2>
    <p>Healing after an extraction follows a predictable pattern. The first 24 hours are about protecting the blood clot — no straws, no spitting, no smoking, gentle saltwater rinses. Most discomfort is managed with over-the-counter pain relievers and ice for swelling. We give every extraction patient written aftercare instructions and a direct line to call if anything feels wrong.</p>
    <p><a href="/post-op/extractions">Tooth Extraction Aftercare Instructions →</a></p>
    <h2>What Comes After the Extraction</h2>
    <p>For most teeth (other than wisdom teeth), we'll discuss replacement options at the same visit:</p>
    <ul>
      <li><a href="/dental-implants-killeen-tx"><strong>Dental implants</strong></a> — the gold standard, replacing the tooth root and crown</li>
      <li><a href="/implant-bridges-killeen-tx"><strong>Implant bridges</strong></a> — replacing several teeth with fewer implants</li>
      <li><strong>Traditional bridges</strong> — using neighboring teeth as anchors</li>
      <li><a href="/dentures-killeen-tx"><strong>Partial dentures</strong></a> — removable, cost-effective option</li>
      <li><strong>No replacement</strong> — sometimes appropriate for back molars depending on your bite</li>
    </ul>
    <p>The longer you go without replacing a missing tooth, the more the surrounding teeth shift and the underlying bone resorbs. We give you the time and information to make a real decision, not a pressured one.</p>
  </div></section>`,
  faqHeading: 'Tooth Extraction FAQ',
  faq: [
    {
      question: 'Will the extraction hurt?',
      answer: `You'll be numb for the procedure itself and won't feel pain. Some pressure and movement are normal. Mild-to-moderate soreness for a few days afterward is typical and is usually managed with over-the-counter pain relievers.`,
    },
    {
      question: 'How long does an extraction take?',
      answer: 'A simple extraction often takes 15-30 minutes. Surgical extractions and wisdom teeth take 30-60 minutes per side.',
    },
    {
      question: 'Can I drive myself home?',
      answer: `Yes, after a simple extraction with local anesthesia. After oral conscious sedation, you'll need a driver.`,
    },
    {
      question: 'How long is the recovery?',
      answer: 'Most patients return to normal activities within 24-48 hours. Bone heals over several weeks, but the discomfort is mostly gone within a few days.',
    },
    {
      question: 'When can I eat?',
      answer: `Soft foods only for the first 24 hours. Avoid straws, hot liquids, and hard or crunchy foods until your follow-up. We'll give you a list.`,
    },
    {
      question: 'What if I want a dental implant after the extraction?',
      answer: `We'll evaluate the bone before extraction and may recommend a bone graft at the time of removal to preserve the site for a future implant. In some cases an implant can be placed the same day as the extraction.`,
    },
    {
      question: 'Will my insurance cover the extraction?',
      answer: `Most dental insurance plans cover simple and surgical extractions, sometimes with a copay or after a deductible. We'll verify coverage before treatment.`,
      answerHtml: `Most <a href="/insurance-and-financing">dental insurance</a> plans cover simple and surgical extractions, sometimes with a copay or after a deductible. We'll verify coverage before treatment.`,
    },
  ],
  footerTitle: 'Need a Tooth Evaluated?',
  footerText: `Don't wait until pain or infection makes the choice for you. Schedule an evaluation at Elm Ridge Implant and Family Dentistry to talk through your options.`,
  footerPrimaryLabel: 'Schedule an Evaluation',
  footerPrimaryHref: '/#contact',
  footerSecondaryLabel: 'Call 254-699-4127',
  footerSecondaryHref: 'tel:+12546994127',
  headSchemas: [
    medicalProcedureSchema('Tooth Extractions', 'Surgical', 'Teeth'),
  ],
});

function blog(file, path, title, desc, body, faq) {
  fs.writeFileSync(file, `${withHeadSchemas(head(title + ' | Blog', desc, path), faqSchema(faq), breadcrumb(path, 'Blog'))}<body class="font-body text-charcoal bg-stone">${header()}<main><section class="bg-charcoal text-white py-20"><div class="max-w-4xl mx-auto px-6"><nav class="text-xs uppercase tracking-widest text-teal mb-6"><a href="/">Home</a> / <a href="/blog">Blog</a></nav><p class="text-xs uppercase tracking-widest text-teal mb-4">Dental Implant Guide</p><h1 class="font-display text-5xl md:text-6xl font-light leading-tight mb-6">${title}</h1><p class="text-white/70 leading-8 text-lg">${desc}</p></div></section><article class="py-16 bg-white"><div class="max-w-4xl mx-auto px-6 prose-page space-y-7"><p class="bg-stone border border-teal-light p-5"><strong>Need a personalized answer?</strong> <a href="/#contact">Schedule an implant consultation</a> with Elm Ridge Implant and Family Dentistry in Killeen.</p>${body}</div></article><section class="py-16 bg-stone"><div class="max-w-4xl mx-auto px-6"><h2 class="font-display text-4xl mb-8">FAQ</h2><div class="space-y-4">${faq.map(([q,a])=>`<details class="bg-white border border-teal-light p-6"><summary class="font-semibold">${q}</summary><p class="mt-3 text-charcoal/65 leading-7">${a}</p></details>`).join('')}</div></div></section><section class="py-16 bg-charcoal text-white text-center"><div class="max-w-3xl mx-auto px-6"><h2 class="font-display text-4xl mb-4">Ready to compare your real options?</h2><p class="text-white/65 mb-8">Elm Ridge Implant and Family Dentistry can evaluate your teeth, bone, bite, and goals so you know what actually makes sense.</p><a href="/#contact" class="inline-block bg-teal px-8 py-4 text-xs uppercase tracking-widest font-semibold">Schedule an Implant Consultation</a></div></section></main>${footer(false)}${menuScript}</body></html>`);
}

const posts = [
  ['blog-dental-implant-cost-killeen-tx','/blog-dental-implant-cost-killeen-tx','How Much Do Dental Implants Cost in Killeen, TX?','Dental implant cost in Killeen, TX explained, including grafting, implant types, dentures, bridges, insurance, and long-term value at Elm Ridge.'],
  ['blog-implants-vs-dentures-vs-bridges','/blog-implants-vs-dentures-vs-bridges','Dental Implants vs Dentures vs Bridges: Which Is Best Long-Term?','Dental implants vs dentures vs bridges in Killeen, TX: compare cost, comfort, function, longevity, and long-term replacement options.'],
  ['blog-are-dental-implants-painful','/blog-are-dental-implants-painful','Are Dental Implants Painful? What to Expect Before, During, and After','Dental implants pain guide for Killeen, TX patients covering anesthesia, healing, soreness, sedation options, and what to expect before and after.'],
  ['blog-implant-dentist-killeen-tx','/blog-implant-dentist-killeen-tx','What to Look for in an Implant Dentist in Killeen, TX','Implant dentist in Killeen, TX guide covering experience, CBCT imaging, guided surgery, treatment planning, and private practice care.']
];

fs.writeFileSync('blog', `${withHeadSchemas(head('Dental Blog | Elm Ridge Implant and Family Dentistry','Dental blog from Elm Ridge Implant and Family Dentistry in Killeen, TX covering implants, cosmetic dentistry, emergencies, Invisalign, and more.','/blog'), breadcrumb('/blog','Blog'))}<body class="font-body text-charcoal bg-stone">${header()}<main><section class="bg-charcoal text-white py-20"><div class="max-w-5xl mx-auto px-6"><h1 class="font-display text-5xl md:text-6xl font-light mb-6">Dental Blog</h1><p class="text-white/70 leading-8 text-lg max-w-3xl">Decision-focused dental guides for patients in Killeen, Harker Heights, Copperas Cove, Belton, Temple, and Salado.</p></div></section><section class="py-16 bg-white"><div class="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-6">${posts.map(([f,p,t,d])=>`<a href="${p}" class="block bg-stone border border-teal-light p-7 hover:border-teal transition-colors"><p class="text-xs uppercase tracking-widest text-teal-dark mb-3">Implant Dentistry</p><h2 class="font-display text-3xl text-charcoal mb-4">${t}</h2><p class="text-charcoal/65 leading-7">${d}</p></a>`).join('')}</div></section></main>${footer(false)}${menuScript}</body></html>`);

blog(posts[0][0], posts[0][1], posts[0][2], posts[0][3], `<p><strong>How much do dental implants cost in Killeen, TX?</strong> The honest answer is that implant treatment is not one product and not one fee. A single tooth implant, an implant bridge, a snap-on denture, and full-arch fixed teeth are completely different treatments.</p><p>Across the United States, published estimates commonly place a complete single-tooth implant in a broad range around $3,000 to $6,000 or more when the implant, abutment, and crown are included. Larger cases can range much higher because they involve more implants, more planning, temporary teeth, and a final prosthesis.</p><h2>Why Online Implant Prices Are Often Misleading</h2><p>A low advertised fee may only include the implant screw. It may not include the abutment, crown, CBCT scan, extraction, bone graft, temporary tooth, sedation, or follow-up.</p><h2>What Affects Dental Implant Cost?</h2><ul><li>Number of missing teeth</li><li>Whether a tooth must be extracted</li><li>Bone grafting or sinus lift needs</li><li>Type of final tooth: crown, bridge, snap-on denture, or fixed full-arch bridge</li><li>Use of CBCT planning and surgical guides</li></ul><h2>Implants vs Dentures vs Bridges</h2><p>Traditional dentures usually cost less up front but can move and may not preserve chewing force. Bridges can be excellent when adjacent teeth already need crowns, but they require reshaping neighboring teeth. Implants usually cost more initially but replace the missing root and can protect nearby teeth.</p><h2>How to Get a Real Number</h2><p>Elm Ridge offers paid implant consultations because real recommendations require an exam, imaging, and a conversation about goals. Patients from <a href="/dentist-harker-heights-tx">Harker Heights</a>, <a href="/dentist-copperas-cove-tx">Copperas Cove</a>, <a href="/dentist-belton-tx">Belton</a>, <a href="/dentist-temple-tx">Temple</a>, and <a href="/dentist-salado-tx">Salado</a> often come to Killeen for that clarity.</p><p>Learn more about <a href="/dental-implants-killeen-tx">dental implants in Killeen</a> or <a href="/#contact">request an implant consultation</a>.</p>`, [['What is the average cost of one dental implant?','National ranges often put a complete single implant with abutment and crown around $3,000 to $6,000 or more, but your actual fee depends on your plan.'],['Does insurance cover dental implants?','Some plans contribute toward parts of treatment, but coverage varies. Elm Ridge can help patients understand benefits and financing options.']]);

blog(posts[1][0], posts[1][1], posts[1][2], posts[1][3], `<p><strong>Dental implants vs dentures vs bridges</strong> is one of the most important decisions patients make after tooth loss. Each option can be right. The best choice depends on how many teeth are missing, your budget, bone support, comfort expectations, and long-term goals.</p><h2>Dental Implants</h2><p>Dental implants replace the root portion of a missing tooth and support a crown, bridge, or denture. They are usually the closest option to natural tooth function and do not require cutting down healthy neighboring teeth.</p><h2>Dentures</h2><p>Complete and partial dentures replace missing teeth with a removable appliance. They are often the most affordable initial solution and can restore appearance quickly. Immediate dentures can be placed the day teeth are removed, then adjusted as the gums heal.</p><h2>Bridges</h2><p>A traditional bridge uses neighboring teeth as anchors. It can replace one or more missing teeth and is fixed in place. When adjacent teeth already need crowns, a bridge may be a practical solution.</p><h2>Cost Over Time</h2><p>Dentures are often lower cost up front but may need replacement, relines, adhesives, and adjustments. Bridges are fixed but place responsibility on the anchor teeth. Implants are usually higher initial investment but may offer better function and preserve neighboring teeth.</p><p>Learn about <a href="/dental-implants-killeen-tx">dental implants</a>, <a href="/dentures-killeen-tx">dentures</a>, or <a href="/#contact">schedule a consultation</a>.</p>`, [['Are implants better than dentures?','Implants are usually more stable and closer to natural chewing, but dentures may be appropriate for budget, anatomy, or medical reasons.'],['Is a bridge better than an implant?','A bridge can be excellent when neighboring teeth need crowns. If neighboring teeth are healthy, an implant may avoid reshaping them.']]);

blog(posts[2][0], posts[2][1], posts[2][2], posts[2][3], `<p><strong>Are dental implants painful?</strong> This is one of the most common questions patients ask before scheduling an implant consultation in Killeen, TX. The short answer: implant treatment is usually more manageable than people imagine when it is planned well.</p><h2>Before Treatment</h2><p>The first visit is about diagnosis and planning. Dr. Jeff reviews the tooth or missing space, takes imaging, evaluates bone, and discusses the final restoration.</p><h2>During Treatment</h2><p>Local anesthetic is used to numb the area. Patients should not feel sharp pain during implant placement. Pressure, vibration, and awareness of movement are possible, but the goal is to keep the experience controlled and comfortable.</p><p>For anxious patients, Elm Ridge can discuss nitrous oxide and oral conscious sedation options for evaluated candidates.</p><h2>After Treatment</h2><p>Many patients feel soreness, swelling, or tenderness for a few days. The amount depends on the complexity of the case. A simple single implant is different from extractions, grafting, or full-arch implant treatment.</p><p>Read more about <a href="/dental-implants-killeen-tx">dental implants in Killeen</a> or <a href="/#contact">request a visit</a>.</p>`, [['How painful are dental implants?','Most patients describe pressure and soreness rather than sharp pain because local anesthetic is used during placement.'],['Can anxious patients get sedation?','Elm Ridge offers nitrous oxide and oral conscious sedation options for evaluated candidates.']]);

blog(posts[3][0], posts[3][1], posts[3][2], posts[3][3], `<p><strong>Choosing an implant dentist in Killeen, TX</strong> is not the same as choosing a place for a simple filling. Dental implants involve surgery, restorative design, bite planning, maintenance, and a financial decision that can range from a single tooth to full-mouth treatment.</p><h2>Look for Complete Planning</h2><p>The implant is only one part of the result. The final crown, bridge, denture, or fixed full-arch prosthesis determines how treatment looks and functions.</p><h2>Ask About CBCT Imaging</h2><p>CBCT imaging provides a 3D view of bone and anatomy. Dr. Jeff uses CBCT on implant cases because flat x-rays cannot show everything needed for precise implant planning. When extra precision is helpful, in-house 3D printed surgical guides can transfer the digital plan to the appointment.</p><h2>Ask Who Places and Restores the Implant</h2><p>Elm Ridge places and restores implants in-house, which helps patients understand the full plan from one team.</p><h2>Red Flags to Avoid</h2><ul><li>No CBCT imaging for implant planning</li><li>Quotes that do not include the final tooth</li><li>No discussion of alternatives</li><li>Pressure to commit before diagnosis</li><li>No clear maintenance plan</li></ul><p>Start with the <a href="/dental-implants-killeen-tx">dental implants page</a> or <a href="/#contact">request a consultation</a>.</p>`, [['What should I ask an implant dentist?','Ask who places the implant, who restores it, whether CBCT imaging is used, what the final tooth will be, and whether the quote includes all phases.'],['Is CBCT imaging important for implants?','Yes. CBCT imaging helps evaluate bone and anatomy in 3D for safer, more precise planning.']]);

const urls = ['','faq','dental-implants-killeen-tx','single-tooth-implant-killeen-tx','implant-bridges-killeen-tx','full-arch-dental-implants-killeen-tx','all-on-4-dental-implants-killeen-tx','snap-on-dentures-killeen-tx','dentures-killeen-tx','family-dentist-killeen-tx','sedation-dentistry-killeen-tx','tooth-extractions-killeen-tx','cosmetic-dentistry-killeen-tx','emergency-dentist-killeen-tx','invisalign-killeen-tx','root-canal-killeen-tx','dental-crowns-killeen-tx','sleep-dentistry-killeen-tx','insurance-and-financing','insurance/crowns','insurance/implants','insurance/invisalign','insurance/why-didnt-insurance-pay','insurance/annual-maximum','post-operative-instructions','post-op/fillings','post-op/crowns','post-op/extractions','post-op/implants','post-op/bone-graft','post-op/root-canal','post-op/deep-cleaning','post-op/whitening','post-op/immediate-dentures','accessibility-statement','dentist-harker-heights-tx','dentist-copperas-cove-tx','dentist-belton-tx','dentist-temple-tx','dentist-salado-tx','dentist-nolanville-tx','blog','blog-cosmetic-dentistry-options-killeen-tx','blog-emergency-dentist-killeen-tx',...posts.map(p=>p[1].slice(1))];
fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u,i)=>`  <url><loc>${domain}/${u}</loc><priority>${i===0?'1.0':u.includes('implant')?'0.9':'0.7'}</priority></url>`).join('\n')}\n</urlset>\n`);
