# Pre-deployment checklist

## Every deploy
- [ ] `npm run check` passes (AWS answer validation, LinkedIn limits)
- [ ] `npm run build` succeeds and prints `prerendered /`, `/privacy`, `/terms`
- [ ] `npm run preview` → home, privacy, terms, login, signup, forgot-password, onboarding, dashboard, 404 all load
- [ ] `/app` in the production build shows "Private area" (unless `VITE_ENABLE_APP_CENTER=true` on a protected deployment)
- [ ] No secrets in `VITE_*` variables

## Before calling auth "working"
- [ ] Create Cognito user pool (email sign-in, `name` attribute, email verification) and an app client **without** a secret
- [ ] Set `VITE_COGNITO_USER_POOL_ID` and `VITE_COGNITO_CLIENT_ID` in Vercel
- [ ] Test sign-up → email code → onboarding → dashboard
- [ ] Test sign-in, wrong password, remember-me off, forgot password, expired code, sign-out (global)
- [ ] Create `admin` group, add founder, confirm `/app` access rules
- [ ] Build the workspace API (see README) before storing real customer data

## Before the AWS Activate application
- [ ] Confirm every "assumed" and "missing" fact in /app → Business information
- [ ] Create the LinkedIn company page; record the real URL in `business.js`
- [ ] Add founder LinkedIn URL to `business.js`
- [ ] Re-run `npm run docs` and review `docs/aws-activate-answers.md`

## Before taking payments
- [ ] Confirm pricing, entitlements and billing terms
- [ ] Legal review of Privacy Policy and Terms (governing law, legal entity, hosting region)
- [ ] Configure a payment provider; pricing CTAs currently route to the contact form
