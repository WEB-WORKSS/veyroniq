# Veyroniq

Website and product workspace for **Veyroniq**, predictive maintenance software for industrial equipment. Live at https://www.veyroniq.site.

Stage: **building the initial product**. The workspace uses fictional sample data; detection and forecasting models and the AWS pipeline are proposed, not deployed.

## Stack

Vite 5 · React 18 · JavaScript · Tailwind CSS 4 · React Router 6 · Lucide icons · amazon-cognito-identity-js. Hosted on Vercel.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — everything works with no keys
npm run dev                  # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server (includes the private `/app` center) |
| `npm run build` | Client build → SSR build → prerenders `/`, `/privacy`, `/terms` to static HTML |
| `npm run preview` | Serve the production build |
| `npm run check` | Validates all 14 AWS Activate answers and LinkedIn character limits |
| `npm run docs` | Regenerates `docs/*.md` from the business record |
| `npm run assets` | Re-renders logo PNG, LinkedIn banner and OG image |

## Routes

| Route | Purpose |
|---|---|
| `/` | Marketing site (prerendered) |
| `/login`, `/signup`, `/forgot-password` | Authentication (Amazon Cognito) |
| `/onboarding` | Workspace setup after sign-up |
| `/dashboard` | Customer workspace: overview, assets, alerts, work orders, inspections, reports, activity, settings |
| `/app` | Private founder application center (LinkedIn kit, AWS Activate answers, checklist) |
| `/privacy`, `/terms` | Legal (prerendered) |
| anything else | 404 |

## Single source of truth

`src/data/business.js` holds every business fact with a status (`verified` / `assumed` / `missing`), the feature classification and the AWS service classification. The website, SEO, team section, LinkedIn kit (`src/data/linkedin.js`), AWS answer engine (`src/data/aws-answers.js`) and `docs/` all read from it. Change facts there.

## Integration status — be precise about what works

| Area | Status |
|---|---|
| Marketing site, pricing, AWS section, team, legal | Done |
| Sample workspace (CRUD, search, filters, sorting, CSV export, print-to-PDF) | Done — data stored in the visitor's browser only |
| Contact form | Done — opens the visitor's email app pre-filled. Set `VITE_LEAD_ENDPOINT` to POST JSON to a real endpoint instead |
| Sign-up, sign-in, email confirmation, forgot password, global sign-out | **Code written, not tested** — needs a Cognito user pool. Without keys the screens explain that accounts aren't open yet, and no fake sign-in happens |
| Workspace API (server persistence) | **Not built.** Client calls are ready (see contract below) |
| Payments | Not configured. Pricing CTAs go to the contact form |

### Turning on authentication

1. Create a Cognito user pool: sign-in with email, required attribute `name`, email verification on.
2. Add an app client **without a client secret** (SRP auth flow).
3. Create a group named `admin` and add the founder's user.
4. Set `VITE_COGNITO_USER_POOL_ID` and `VITE_COGNITO_CLIENT_ID` in Vercel (all environments) and redeploy.
5. Test every flow in `docs/deployment-checklist.md` before saying auth works.

### Workspace API contract

When `VITE_API_URL` is set and a user is signed in, the dashboard calls:

- `GET {API}/workspace` → `{ assets, alerts, workOrders, inspections, activity }`
- `PUT {API}/workspace` with the same shape
- `GET/PUT {API}/profile` → onboarding answers

Each request sends `Authorization: Bearer <Cognito ID token>`. The API must verify the token (API Gateway Cognito authorizer) and scope data to the user's organisation. Suggested build: API Gateway + Lambda + DynamoDB.

### Private application center (`/app`)

`/app` is not linked anywhere and is `noindex`. Because this is a static site with no backend yet, **the application center is compiled only into `npm run dev`**. Public production builds ship a "Private area" page at `/app` instead, so the AWS answers and checklist are not in the public bundle.

To use it: run `npm run dev` and open http://localhost:5173/app. Only set `VITE_ENABLE_APP_CENTER=true` for a deployment that is itself protected (for example a Vercel deployment with Password Protection, or once Cognito + an `admin` group are configured). The in-page admin-group check alone is client-side and is not sufficient protection.

Note: this repository is public, so `src/data/*` and `docs/*` (including the drafted AWS answers) are readable on GitHub. They contain no secrets.

## SEO

Unique titles, descriptions, canonical URLs, Open Graph and Twitter cards per route; JSON-LD Organization and SoftwareApplication; `robots.txt` (private routes disallowed); `sitemap.xml`; `X-Robots-Tag: noindex` headers for app routes in `vercel.json`. Public pages are prerendered so content is in the HTML.

## Deployment (Vercel)

`vercel.json` sets the Vite build, output `dist`, an SPA fallback to `200.html` for client routes, and security headers. Pushing to `main` deploys production. See `docs/deployment-checklist.md`.

Browser support: current Chrome, Edge, Firefox and Safari (ES2020+).

© 2026 Veyroniq
