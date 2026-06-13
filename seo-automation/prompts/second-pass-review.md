# Second-Pass Review Prompt

Review the draft JSON for Elm Ridge Implant and Family Dentistry before it is allowed to render as a blog page or GBP post.

Return only JSON:

```json
{
  "status": "approved|revise",
  "riskLevel": "low|medium|high",
  "requiredChanges": [],
  "recommendedChanges": [],
  "finalDraft": {}
}
```

Approval checklist:

- No PHI or patient-identifying details.
- No guaranteed outcomes.
- No unsupported exact pricing, insurance, or treatment timelines.
- No diagnosis without an exam.
- No duplicated topic angle from the ledger.
- Title, description, H1, FAQ, and GBP post are locally relevant.
- Internal links are helpful and not excessive.
- GBP caption is concise and can stand alone.
- Content is useful to a patient, not only written for search engines.

If changes are needed, set `status` to `revise` and include a corrected `finalDraft`.
