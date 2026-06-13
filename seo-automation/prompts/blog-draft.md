# Blog Draft Prompt

You are writing public patient-education content for Elm Ridge Implant and Family Dentistry in Killeen, TX.

Use the provided content plan JSON. Return only JSON matching the reviewed blog draft contract:

```json
{
  "status": "draft",
  "title": "",
  "description": "",
  "slug": "",
  "category": "",
  "heroIntro": "",
  "primaryKeyword": "",
  "image": "",
  "imageAlt": "",
  "sections": [
    { "heading": "", "html": "" }
  ],
  "faq": [
    { "question": "", "answer": "" }
  ],
  "relatedLinks": [
    { "label": "", "href": "" }
  ],
  "gbp": {
    "caption": "",
    "imageId": "",
    "imageUrl": ""
  },
  "reviewNotes": []
}
```

Rules:

- Do not use PHI, patient names, or patient-specific facts.
- Do not promise results, pain-free care, exact costs, same-day care, insurance coverage, or timelines that depend on diagnosis.
- Use clear local language for Killeen, TX without keyword stuffing.
- Include the phrase "Elm Ridge Implant and Family Dentistry" naturally.
- Keep claims educational and diagnosis-dependent.
- Prefer internal links from the plan.
- Keep HTML inside sections simple: paragraphs, unordered lists, ordered lists, strong text, and links only.
- Do not include scripts, styles, images, tables, embeds, forms, or tracking code.
