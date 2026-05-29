# Old Wix URL Redirect Audit

Canonical domain: `https://www.elmridgedental.com`

These old indexed URLs were detected from search results for `elmridgedental.com` and mapped to the closest relevant current page. Redirects are implemented in `serve.mjs` so the DigitalOcean-hosted Node server returns direct one-hop `301` responses.

Production diagnosis: the live DigitalOcean App Platform deployment appeared to be serving the repository as a static site, so `serve.mjs` was not active in production. That is why `/dentalimplants` still returned a static-host 404 even though the local Node server redirected correctly. The repo now includes a `Dockerfile` and `.do/app.yaml` web service spec so DigitalOcean can run `node serve.mjs` as the production entry point.

| Old URL | 301 destination | Notes |
| --- | --- | --- |
| `https://www.elmridgedental.com/contact-us` | `https://www.elmridgedental.com/#contact` | Contact section replacement. |
| `https://www.elmridgedental.com/patient-reviews` | `https://www.elmridgedental.com/#reviews` | Review section replacement. |
| `https://www.elmridgedental.com/before-and-after` | `https://www.elmridgedental.com/#before-after` | Before-and-after section replacement. |
| `https://www.elmridgedental.com/dentalimplants` | `https://www.elmridgedental.com/dental-implants-killeen-tx` | Direct implant page replacement. |
| `https://www.elmridgedental.com/cosmeticdentistry` | `https://www.elmridgedental.com/cosmetic-dentistry-killeen-tx` | Direct cosmetic page replacement. |
| `https://www.elmridgedental.com/invisalign` | `https://www.elmridgedental.com/invisalign-killeen-tx` | Direct Invisalign page replacement. |
| `https://www.elmridgedental.com/rootcanals` | `https://www.elmridgedental.com/root-canal-killeen-tx` | Direct root canal page replacement. |
| `https://www.elmridgedental.com/dentures` | `https://www.elmridgedental.com/dentures-killeen-tx` | Direct dentures page replacement. |
| `https://www.elmridgedental.com/extractions` | `https://www.elmridgedental.com/emergency-dentist-killeen-tx` | Closest current page because there is no dedicated extraction page. |
| `https://www.elmridgedental.com/generaldentistry` | `https://www.elmridgedental.com/#services` | Service overview replacement. |
| `https://www.elmridgedental.com/cleanings` | `https://www.elmridgedental.com/#services` | Service overview replacement. |
| `https://www.elmridgedental.com/wellnessexams` | `https://www.elmridgedental.com/#services` | Service overview replacement. |
| `https://www.elmridgedental.com/sedation` | `https://www.elmridgedental.com/#services` | Service overview replacement. |

## Missing Strong Replacements

The following old pages do not currently have a dedicated one-to-one replacement:

- `generaldentistry`
- `cleanings`
- `wellnessexams`
- `sedation`
- `extractions`

Best future SEO improvement: create dedicated pages for preventive dentistry/cleanings, general dentistry, extractions, and sedation dentistry, then update these redirects to point to those exact pages.
