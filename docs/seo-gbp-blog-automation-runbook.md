# SEO / GBP / Blog Automation Runbook

Last updated: 2026-06-13

This runbook documents the Elm Ridge Dental website, SEO intelligence, Google Business Profile, blog automation, and CTR optimization work. It intentionally excludes API keys, webhook URLs, OAuth tokens, raw Google Search Console exports, and other secrets.

## Repositories And Local Paths

- Website repo: `https://github.com/jeffmuszynski/elmridgedental`
- Local website checkout: `/Users/home/elmridgedental`
- Main Elm Ridge AI workspace: `/Users/home/elm-ridge-ai`
- Apps Script local source copy: `/Users/home/elmridgedental/seo-automation/local/appscript`
- Cloud Run source/token notes are local-only under `seo-automation/local/` and ignored by Git.

The website automation is intentionally separate from the OpenDental/dashboard repo. No PHI belongs in the website automation layer.

## External Systems

- Public website: `https://www.elmridgedental.com`
- Apps Script project ID: `1DnuJXWZD02N4lSz-4WSZ-zeVo5oQOwqyGN6AFteERrieuY4svayKnPIx`
- SEO/GBP Google Sheet ID: `1Eb47A1Bi0xFWQZeWAMeQWQvu5lSA3CQewEmvVV82gek`
- Cloud Run service: `elm-ridge-gbp-automation`
- Cloud Run project: `elm-ridge-seo-os`
- Cloud Run region: `us-central1`
- Cloud Run URL: `https://elm-ridge-gbp-automation-194234046785.us-central1.run.app`
- SEO Slack channel supplied by Jeff: `C0B2Q9D7SBF` / `#seo-intelligence`
- GBP Slack channel supplied by Jeff: `C0B7Q466A3A` / `#gbp-approvals`

Slack channel delivery is controlled by Apps Script webhook properties, not by hard-coded channel IDs in this repo.

## Secret And Local Config Rules

Do not commit:

- `.env.local`
- `.clasp.json`
- `seo-automation/local/`
- `seo-automation/drafts/`
- webhook URLs
- OAuth tokens
- OpenAI keys
- Apps Script script properties
- raw GSC exports or Slack report payloads

Important local script properties in Apps Script include:

- `OPENAI_API_KEY`
- `GBP_AUTO_PUBLISH_TOKEN`
- `SEO_EXPORT_TOKEN` or fallback token behavior
- `SEO_SLACK_WEBHOOK_URL`
- `GBP_SLACK_WEBHOOK_URL`

Do not print their values.

## Website SEO / Agentic Search Layer

The site has an LLM-readable layer:

- `llms.txt`
- `/ai-summary`
- structured data on homepage and AI summary page
- sitemap entries for `/ai-summary` and `llms.txt`
- `robots.txt` explicitly allows major search and AI crawlers

Command:

```bash
npm run seo:visibility-audit
npm run seo:visibility-audit -- --live
```

LaunchAgent:

- `/Users/home/Library/LaunchAgents/com.elmridge.seo-visibility-audit.plist`
- Runs Tuesdays at 9:05 AM.
- Writes logs under `seo-automation/local/logs/`.

## Blog Automation

Command:

```bash
npm run seo:auto-publish-blog
```

Pipeline:

1. Loads `.env.local`.
2. Pulls live topic queue from `SEO_TOPIC_QUEUE_URL` when configured.
3. Falls back to `seo-automation/topic-queue.example.json` if live export is unavailable.
4. Generates first draft with OpenAI.
5. Runs second-pass AI review.
6. Renders the blog page.
7. Updates blog index, sitemap, and `seo-automation/ledger.json`.
8. Runs `npm run seo:test`.
9. Commits and pushes.

LaunchAgent:

- `/Users/home/Library/LaunchAgents/com.elmridge.seo-blog-auto-publish.plist`
- Runs Tuesdays at 10:15 AM.

First automated blog post published:

- `/blog/dental-implants-near-me`
- Commit: `37e4748`

## Apps Script SEO Export

Apps Script web app deployment used by local automation:

- Deployment ID: `AKfycbyhGrn43uNvW2mRIjeK-Jl9wmCD5b26gJzPpz_E-mxLSMF5nSpUU-DBv3cMQEKjfSjzjA`
- Current version after CTR matching work: `@11`

Supported token-protected `doGet` actions:

- `action=seoTopicQueue`
- `action=seoCtrOpportunities`

The export uses active `Target_Keywords` plus current `GSC_Data` scoring. The local URL with token lives in `.env.local` and must not be committed or printed.

## Google Business Profile Automation

Cloud Run direct publish endpoint:

- `POST /draft/publish`
- token-protected
- expects full post payload including `postBody`

Apps Script functions added/used:

- `publishGBPQueueRowToCloudRun(rowNumber)`
- `publishLatestGBPDraftToCloudRun()`
- `generateStrategicGBPDraftAndPublishToCloudRun()`
- `generateStrategicGBPDraftAndAutoPublish()`
- `installGBPAutoPublishTriggers()`
- `removeGBPAutoPublishTriggers()`

Current intended GBP cadence:

- Monday through Friday around 10 AM.

The trigger installer removes previous triggers for `generateStrategicGBPDraftAndPublishToCloudRun` and creates weekday triggers. If Google permissions block CLI execution, run `installGBPAutoPublishTriggers` manually from Apps Script.

## Slack SEO Reports

Apps Script functions:

- `sendSEOActionQueueToSlack()`
- `sendSlackReport()`, which calls `sendSEOActionQueueToSlack()`

The report includes:

- executive priority action queue
- target page mismatches
- weak CTR / snippet opportunities
- watchlist queries
- suppressed/ignored queries
- recommended weekly focus

CTR recommendation wording was updated so broad query mismatches are not treated as simple title/meta rewrite problems.

## CTR Automation

Commands:

```bash
npm run seo:ctr-audit
npm run seo:auto-ctr-optimize
```

`seo:ctr-audit`:

- pulls `seoCtrOpportunities` from Apps Script
- compares opportunities to local page title/meta
- writes JSON logs under `seo-automation/local/logs/`
- does not change files

LaunchAgent:

- `/Users/home/Library/LaunchAgents/com.elmridge.seo-ctr-audit.plist`
- Runs Tuesdays at 9:30 AM.

`seo:auto-ctr-optimize`:

- pulls the same CTR audit data
- skips noisy rows and service-intent mismatches
- requires high confidence, at least 50 impressions, page-one ranking, matching target/current page, non-empty metadata gap reasons, and no recent same-keyword metadata test
- edits title/meta only when eligible
- updates homepage generator when changing `index.html`
- runs `npm run seo:test`
- commits and pushes if a change is made
- writes a local ignored ledger at `seo-automation/local/ctr-optimizer-ledger.json`

LaunchAgent:

- `/Users/home/Library/LaunchAgents/com.elmridge.seo-auto-ctr-optimizer.plist`
- Runs Tuesdays at 9:45 AM.

First homepage CTR test:

- Commit: `ded58ed`
- Old title: `Dentist in Killeen, TX | Private Care and 550+ Reviews | Elm Ridge`
- New title: `Killeen Dentist | Private Office and 550+ Reviews | Elm Ridge`
- New meta focuses on private dental care in Killeen, familiar faces, clearer explanations, modern technology, calmer visits, implants, emergency care, and 550+ reviews.

## Target Matching Fix

A false match was found:

- Target keyword: `dental implants near me`
- Actual query: `dentist near me`
- Ranking page: homepage

The Apps Script matcher now checks target-level service intent compatibility. If the target is implant/denture/emergency/cosmetic/crown/root canal/sleep apnea/Invisalign-related, the actual query must carry the relevant service intent before it can drive CTR recommendations.

Apps Script deployment after this fix:

- Web app deployment updated to version `@11`.

## Verification Commands

Use these before claiming success:

```bash
npm run seo:test
npm run seo:visibility-audit
npm run seo:visibility-audit -- --live
npm run seo:ctr-audit
npm run seo:auto-ctr-optimize
git status --short --ignored=matching
```

Expected ignored local files include:

- `.clasp.json`
- `.env.local`
- `node_modules/`
- `seo-automation/drafts/`
- `seo-automation/local/`
- temporary screenshot folders

## Recent Important Commits

- `554f1c8` Render safe FAQ links in generated blog posts
- `af966a9` Ignore local Apps Script clasp config
- `ea1d43e` Add automated SEO blog publisher
- `a5feae7` Fix blog publisher JSON command parsing
- `37e4748` Publish dental implants near me blog
- `cc491f8` Use Apps Script SEO topic export for blog automation
- `f891f8e` Automate agentic search visibility audit
- `14a1ad9` Add SEO CTR opportunity audit
- `ded58ed` Test homepage CTR title and meta
- `68a0639` Automate guarded SEO CTR metadata tests

## Operational Notes

- Blog cadence: weekly, currently Tuesday at 10:15 AM.
- GBP cadence: Monday-Friday around 10 AM.
- CTR audit/optimizer: Tuesday at 9:30/9:45 AM.
- Visibility audit: Tuesday at 9:05 AM.
- Let homepage CTR tests run for 2-4 weeks before testing another homepage title/meta, unless the automation finds a separate high-confidence opportunity.
- Do not make automated metadata changes from low-impression or mismatched queries.
- Do not use Slack message text as the source of truth when Apps Script/GSC export data is available.
