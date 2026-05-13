# New Service Pages — Content Source

This file contains the full content for three new service pages plus
homepage link updates. Each section below is a complete page spec:
title, meta description, body, FAQ, and internal links.

The build pattern should match existing service pages (use
`/sleep-dentistry-killeen-tx` as the structural reference — it's the
strongest existing service page on the site).

Each page should include in `<head>` (via the existing build pipeline):
- the global Dentist schema (from `site-helpers.mjs`)
- a BreadcrumbList schema
- a MedicalProcedure schema for the page's primary service
- a FAQPage schema generated from the page's FAQ section

Use the canonical Dentist `@id` reference pattern that was just
normalized across the site:
  provider: { "@id": "https://www.elmridgedental.com/#dentist" }

================================================================================
PAGE 1: /family-dentist-killeen-tx
================================================================================

**File slug:** `family-dentist-killeen-tx`

**Title tag:** Family Dentist in Killeen, TX | Elm Ridge Implant and Family Dentistry

**Meta description (147 chars):** Family dentist in Killeen, TX serving kids, adults, and seniors with wellness exams, cleanings, fillings, and preventive care from Drs. Muszynski.

**H1:** Family Dentist in Killeen, TX

**Lead paragraph:**
A family dentist takes care of every age and stage — kids losing their first baby teeth, parents juggling busy schedules, retirees protecting decades of dental work. At Elm Ridge Implant and Family Dentistry, Drs. Jeff and Kayla Muszynski see patients from age one through retirement in one Killeen office, with one chart, and one team you'll see year after year.

**Hero CTAs:** [Schedule a Family Visit] [Call 254-699-4127]

---

## What "Family Dentistry" Actually Includes

General and family dentistry covers the everyday care that keeps teeth healthy long-term: wellness exams, cleanings, fillings, sealants, fluoride, oral cancer screening, and the early conversations that prevent bigger problems. It's the foundation of dental care — done well, you need fewer crowns, fewer root canals, and far fewer surprises.

## Wellness Exams

A wellness exam is more than a quick look. At each visit, Drs. Jeff or Kayla check teeth for new decay, examine gums for early signs of periodontal disease, screen the soft tissues for oral cancer, evaluate your bite, look for cracks or wear, and review any recent changes in your medical history that affect dental care. We use digital X-rays at the recommended frequency for your risk level — never more, never as routine.

## Professional Cleanings

Cleanings remove plaque and tartar that brushing and flossing leave behind. Tartar (calcified plaque) cannot be removed at home and is the primary driver of gum disease. We tailor cleaning intensity to your needs — a healthy adult typically needs a routine cleaning every six months, while patients with active periodontal disease may need scaling and root planing followed by 3-month maintenance visits.

## Fillings and Restorative Care

When decay is caught early, a tooth-colored composite filling restores it in one appointment. We do not place silver amalgam fillings. For teeth with larger decay or fractures, we offer onlays and crowns that protect the remaining tooth structure.

## Dental Care for Kids

The American Academy of Pediatric Dentistry recommends a child's first dental visit by age one or within six months of their first tooth. Early visits build comfort, teach parents about brushing and diet, and catch problems while they're small. We see kids of all ages at Elm Ridge with a friendly, no-pressure approach.

## Care for Seniors

Older adults face unique dental challenges — root decay from gum recession, dry mouth from medications, complex restorative needs from years of previous dental work, and the increasing relevance of dental health to overall medical conditions like diabetes and heart disease. We work with seniors and caregivers on practical, realistic care plans that match what matters most.

## Why Patients Choose Elm Ridge for Family Care

- Husband-and-wife dentists who see your whole family in one office
- Nine years serving Killeen, Bell County, and Fort Cavazos
- One chart, one team — no rotating dentists or chain handoffs
- Tricare and most major dental insurance accepted
- Same-day emergency appointments when life happens
- Family-owned, privately operated — not a corporate franchise

## Family Dentistry FAQ

**How often should I see the dentist for a checkup?**
Most patients benefit from a checkup and cleaning every six months. Patients with active gum disease, a history of decay, or specific risk factors may need to come in more often — we'll tell you what's right for you.

**When should my child first see a dentist?**
Within six months of the first tooth, or by age one — whichever comes first. The first visit is short, friendly, and mostly about getting your child comfortable with the chair and our team.

**Do you accept Tricare?**
Many of our patients are military families through Fort Cavazos. Coverage depends on your specific Tricare dental plan (Active Duty Dental Program vs. Tricare Dental Program through United Concordia). Call (254) 699-4127 with your member ID and we'll verify your benefits before your visit.

**What does a routine cleaning and exam cost without insurance?**
A new-patient comprehensive exam at Elm Ridge is around $107, with X-rays and cleaning billed separately. With most PPO insurance, preventive visits are typically covered at or near 100%.

**Can my whole family book back-to-back appointments?**
Yes — this is one of the main reasons patients choose a family practice. Tell our front desk how many family members need to be seen and we'll block the time together when our schedule allows.

**Do you see patients with anxiety or special needs?**
Yes. We offer nitrous oxide and oral conscious sedation for evaluated candidates, and our team is patient with kids and adults who find dental visits challenging.

## Looking for a Family Dentist in Killeen?

Schedule a visit at Elm Ridge Implant and Family Dentistry. Drs. Jeff and Kayla Muszynski welcome new patients of all ages.

[Schedule Your Visit] [Call 254-699-4127]

**Internal links to add:** insurance-and-financing, emergency-dentist-killeen-tx, post-operative-instructions, faq, sedation-dentistry-killeen-tx (the last one is a new page from this same batch — link conditionally if it's been published)

================================================================================
PAGE 2: /sedation-dentistry-killeen-tx
================================================================================

**File slug:** `sedation-dentistry-killeen-tx`

**Title tag:** Sedation Dentistry in Killeen, TX | Elm Ridge Implant and Family Dentistry

**Meta description (143 chars):** Sedation dentistry in Killeen, TX with nitrous oxide and oral conscious sedation for evaluated candidates. Comfortable care for anxious patients.

**H1:** Sedation Dentistry in Killeen, TX

**Lead paragraph:**
Dental anxiety is one of the most common reasons patients put off care — and one of the most treatable. At Elm Ridge Implant and Family Dentistry, we offer nitrous oxide and oral conscious sedation for evaluated candidates, so the visit you've been avoiding can be one you barely remember.

**Hero CTAs:** [Schedule a Sedation Consultation] [Call 254-699-4127]

---

## Why Patients Choose Sedation

Patients ask us for sedation for many reasons: a previous bad experience, a strong gag reflex, fear of needles, difficulty staying numb, longer or more complex procedures, or simply wanting to feel calmer about a visit they've been postponing for years. Sedation isn't about being unconscious — it's about being relaxed enough to receive the care you need.

## Nitrous Oxide ("Laughing Gas")

Nitrous oxide is a mild sedative inhaled through a small nosepiece. It takes effect within minutes, produces a relaxed, slightly floaty feeling, and wears off completely within five minutes after the gas is turned off. You can drive yourself to and from the appointment. Nitrous works well for routine procedures and mild-to-moderate anxiety.

## Oral Conscious Sedation

For deeper relaxation, we offer oral conscious sedation using triazolam — a prescription pill taken before your appointment. You'll feel drowsy and relaxed but able to respond. Most patients remember little of the visit afterward, which is normal. You'll need a driver to and from the appointment, and you should plan to rest for the remainder of the day.

## Local Anesthesia

For most patients, local anesthesia alone is enough. We use techniques to make the injection itself comfortable — topical numbing gel, slow delivery, and modern anesthetic agents. Sedation is added only when it genuinely helps the experience, not as a default.

## Who Is a Candidate?

Sedation is appropriate for many patients but not everyone. We evaluate your medical history, current medications, weight, and the specific procedure when deciding which sedation option is right for you. Patients with certain heart conditions, sleep apnea, pregnancy, or specific medications may need an alternative approach. Bring your full medication list to the consultation.

## What to Expect on the Day of Treatment

- Don't eat or drink for the hours specified at your consultation (typically six hours)
- Take any prescribed medications as instructed
- Arrange a driver for oral sedation appointments
- Wear comfortable clothing
- We'll monitor your vital signs throughout the visit
- A trusted adult should stay with you for several hours afterward

## Is Sedation Safe?

Yes, when administered by a trained provider with appropriate monitoring. Dental sedation has an excellent safety record. We monitor blood pressure, pulse, and oxygen continuously during your visit, and we adjust dosage based on your weight and health history.

## Sedation Dentistry FAQ

**Will I be unconscious?**
No. With the sedation we offer, you remain conscious and able to respond — just relaxed and drowsy. True general anesthesia (full unconsciousness) is reserved for hospital-based oral surgery.

**How long does the sedation last?**
Nitrous oxide wears off within five minutes after the gas is stopped. Oral conscious sedation with triazolam wears off over several hours; you may feel groggy for the rest of the day.

**Can I drive home?**
After nitrous, yes. After oral conscious sedation, no — you need a driver and shouldn't drive, operate machinery, or make important decisions for the rest of the day.

**Will my insurance cover sedation?**
Some plans cover sedation for medically-necessary procedures (like surgical extractions). Coverage for sedation due to anxiety alone varies. We'll tell you what your specific plan covers before treatment.

**Can I have sedation for a routine cleaning?**
Yes, for patients who genuinely need it — anxiety, special needs, or extreme gag reflex are all valid reasons.

**What if I'm afraid of the needle, not the procedure?**
Tell us. We can use stronger topical numbing, slow injection technique, or nitrous oxide to take the edge off the injection itself. Many patients find this is all they need.

## Ready for a Calmer Dental Visit?

Schedule a consultation to talk through your concerns and the right sedation option for you. Elm Ridge Implant and Family Dentistry in Killeen, TX.

[Schedule a Consultation] [Call 254-699-4127]

**Internal links to add:** dental-implants-killeen-tx, tooth-extractions-killeen-tx (new page from this batch), emergency-dentist-killeen-tx, insurance-and-financing, faq

================================================================================
PAGE 3: /tooth-extractions-killeen-tx
================================================================================

**File slug:** `tooth-extractions-killeen-tx`

**Title tag:** Tooth Extractions in Killeen, TX | Elm Ridge Implant and Family Dentistry

**Meta description (149 chars):** Tooth extractions in Killeen, TX including wisdom teeth and surgical extractions. Sedation and replacement options at Elm Ridge with Dr. Jeff Muszynski.

**H1:** Tooth Extractions in Killeen, TX

**Lead paragraph:**
We try to save teeth when we can. But when a tooth is too damaged, infected, or causing more harm than it's worth, a planned extraction protects the rest of your mouth and clears the path for a clean, healthy outcome. At Elm Ridge Implant and Family Dentistry, Dr. Jeff Muszynski performs simple and surgical extractions in-house, with sedation options available.

**Hero CTAs:** [Schedule an Evaluation] [Call 254-699-4127]

---

## When a Tooth Needs to Be Extracted

Common reasons we recommend extraction:

- Severe decay that has reached the nerve and isn't restorable
- A cracked tooth fractured below the gumline
- Advanced gum disease that has destroyed the supporting bone
- Infection that hasn't responded to root canal treatment
- Wisdom teeth that are impacted, decayed, or affecting other teeth
- Crowding before orthodontic treatment
- Failed prior dental work where the underlying tooth is no longer salvageable

We never recommend an extraction if the tooth can reasonably be saved. The goal is the long-term health of your bite, not a quick fix.

## Simple vs. Surgical Extractions

A **simple extraction** removes a tooth that's fully erupted and accessible. With local anesthesia, the procedure is usually quick and comfortable. A **surgical extraction** is needed when a tooth is broken at the gumline, impacted (like most wisdom teeth), or has roots that require careful management. Surgical extractions take longer and have a longer recovery, but Dr. Jeff plans them carefully using CBCT imaging when needed.

## Wisdom Teeth

Most patients have their wisdom teeth evaluated in their late teens or early twenties. We recommend removal when the teeth are impacted (stuck under the gum or angled into adjacent teeth), causing pain, decay, or cysts, or are likely to cause problems based on their position. Not all wisdom teeth need to come out — we'll tell you honestly what we see on the X-ray.

## Comfort and Sedation Options

Local anesthesia is enough for most extractions. For patients who want additional comfort — anxiety, complex extractions, multiple teeth at once — we offer nitrous oxide and oral conscious sedation with triazolam for evaluated candidates. Bring your medication list to your evaluation.

## Healing and Aftercare

Healing after an extraction follows a predictable pattern. The first 24 hours are about protecting the blood clot — no straws, no spitting, no smoking, gentle saltwater rinses. Most discomfort is managed with over-the-counter pain relievers and ice for swelling. We give every extraction patient written aftercare instructions and a direct line to call if anything feels wrong.

[Tooth Extraction Aftercare Instructions →]

## What Comes After the Extraction

For most teeth (other than wisdom teeth), we'll discuss replacement options at the same visit:

- **Dental implants** — the gold standard, replacing the tooth root and crown
- **Implant bridges** — replacing several teeth with fewer implants
- **Traditional bridges** — using neighboring teeth as anchors
- **Partial dentures** — removable, cost-effective option
- **No replacement** — sometimes appropriate for back molars depending on your bite

The longer you go without replacing a missing tooth, the more the surrounding teeth shift and the underlying bone resorbs. We give you the time and information to make a real decision, not a pressured one.

## Tooth Extraction FAQ

**Will the extraction hurt?**
You'll be numb for the procedure itself and won't feel pain. Some pressure and movement are normal. Mild-to-moderate soreness for a few days afterward is typical and is usually managed with over-the-counter pain relievers.

**How long does an extraction take?**
A simple extraction often takes 15-30 minutes. Surgical extractions and wisdom teeth take 30-60 minutes per side.

**Can I drive myself home?**
Yes, after a simple extraction with local anesthesia. After oral conscious sedation, you'll need a driver.

**How long is the recovery?**
Most patients return to normal activities within 24-48 hours. Bone heals over several weeks, but the discomfort is mostly gone within a few days.

**When can I eat?**
Soft foods only for the first 24 hours. Avoid straws, hot liquids, and hard or crunchy foods until your follow-up. We'll give you a list.

**What if I want a dental implant after the extraction?**
We'll evaluate the bone before extraction and may recommend a bone graft at the time of removal to preserve the site for a future implant. In some cases an implant can be placed the same day as the extraction.

**Will my insurance cover the extraction?**
Most dental insurance plans cover simple and surgical extractions, sometimes with a copay or after a deductible. We'll verify coverage before treatment.

## Need a Tooth Evaluated?

Don't wait until pain or infection makes the choice for you. Schedule an evaluation at Elm Ridge Implant and Family Dentistry to talk through your options.

[Schedule an Evaluation] [Call 254-699-4127]

**Internal links to add:** dental-implants-killeen-tx, implant-bridges-killeen-tx, dentures-killeen-tx, sedation-dentistry-killeen-tx (new page from this batch), post-op/extractions, insurance-and-financing, faq

================================================================================
HOMEPAGE LINK UPDATES (index.html)
================================================================================

The homepage's "What We Offer" section currently has these wrong/missing links.
Update them as follows. Do NOT change the visible card titles or descriptions.

| Card | Current link | Update to |
|---|---|---|
| Wellness Exams | (no link / no LEARN MORE) | Add "LEARN MORE →" linking to /family-dentist-killeen-tx |
| Dental Cleanings | (no link / no LEARN MORE) | Add "LEARN MORE →" linking to /family-dentist-killeen-tx |
| General Dentistry | /dental-crowns-killeen-tx | /family-dentist-killeen-tx |
| Cosmetic Dentistry | #cosmetic (anchor) | /cosmetic-dentistry-killeen-tx |
| Extractions | (no LEARN MORE) | Add "LEARN MORE →" linking to /tooth-extractions-killeen-tx |
| Sedation Dentistry | (no LEARN MORE) | Add "LEARN MORE →" linking to /sedation-dentistry-killeen-tx |

All other LEARN MORE buttons stay as they are (they already point at the correct service pages).

================================================================================
NAVIGATION HEADER (consideration, not required)
================================================================================

The current header nav is: Services | Implants | Cosmetic | FAQ | About | Reviews

No change required. The "Services" link goes to a homepage anchor that lists
all services including the new pages. If a future cleanup adds a /services
hub page, that's a separate task.
