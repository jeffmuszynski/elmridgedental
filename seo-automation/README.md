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

## Automated Blog Publishing

The local blog publisher runs the full pipeline without copy-paste:

```bash
npm run seo:auto-publish-blog
```

It:

- chooses the next topic from `SEO_TOPIC_QUEUE_URL` when configured, otherwise from the local SEO queue and ledger,
- generates a first draft with OpenAI,
- runs a second-pass AI review,
- renders the approved blog page,
- updates the blog index, sitemap, and SEO ledger,
- runs the SEO smoke test,
- commits and pushes the website repo.

The script aborts if the git worktree has unrelated uncommitted changes.

`SEO_TOPIC_QUEUE_URL` can point at the token-protected Apps Script export endpoint
so topic selection follows the active Target_Keywords/GSC scoring logic.

## Planned Live Integrations

- Google Sheets or Apps Script for audit/topic input.
- Google Search Console for keyword performance input.
- Google Business Profile for final publishing.
- Slack only if approval or notifications remain useful.
- LLM provider for draft generation and second-pass review.

Credentials belong in local ignored files or platform secrets, never in this repo.
