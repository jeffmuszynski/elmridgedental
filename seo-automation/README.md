# SEO / GBP / Blog Automation

This folder is the local automation layer for Elm Ridge website content. It is intentionally separate from the OpenDental dashboard project and should not contain PHI, raw patient data, credentials, or private API output.

## Current Stage

The first milestone is a local dry run:

```bash
npm run seo:dry-run
```

That command reads:

- `seo-automation/config.json`
- `seo-automation/ledger.json`
- `seo-automation/topic-queue.example.json`
- `gbp/images.json`
- `sitemap.xml`

It produces a blog/GBP content plan in the terminal. With `--write`, it writes a local draft JSON file under `seo-automation/drafts/`, which is ignored by Git.

## Examples

```bash
npm run seo:dry-run -- --topic "how long do dental implants last killeen tx" --bucket implants
npm run seo:dry-run -- --queue seo-automation/topic-queue.example.json --write
npm run seo:test
```

## Planned Live Integrations

- Google Sheets or Apps Script for audit/topic input.
- Google Search Console for keyword performance input.
- Google Business Profile for final publishing.
- Slack only if approval or notifications remain useful.
- LLM provider for draft generation and second-pass review.

Credentials belong in local ignored files or platform secrets, never in this repo.
