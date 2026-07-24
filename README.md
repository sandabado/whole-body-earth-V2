# Whole Body OS

One application for Whole Body Earth and its five pillar journeys, built with
Next.js App Router and designed to deploy on Vercel.

## Engineering baseline

- Next.js 16 App Router with a single `src/proxy.ts` entry for Supabase session
  refresh, route aliases, and domain-aware pillar routing.
- Shared navigation, tokens, and pillar-aware components. Individual pillar content is organized under `src/app/pillars/*`.
- Whole Body Earth remains the root portal. Studios, Press, Foundation,
  Community/Presence, and Guardian also resolve through short routes and their
  dedicated domains.
- Guardian includes the public Quincunx/Position 9 constitutional model. Live
  assignment and coherence scoring remain Phase 2 authenticated capabilities.
- Supabase is the application data source of truth. Partnership applications are validated server-side and inserted only with a server-only Supabase service-role key.
- No payment, scheduling, reader, or ephemeris flow is represented as live until its backend contract exists.

## Local development

```bash
npm install
npm run dev
```

Use `.env.example` as the environment contract. Never commit `.env.local` or production keys.

## Deployment contract

Set these in Vercel for each environment:

| Service | Required variables | Notes |
| --- | --- | --- |
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | The service-role key is server-only. Apply all files in `supabase/migrations/` before enabling application intake. |
| Resend | `RESEND_API_KEY`, `ADMIN_EMAIL` | Replace the default Resend sender with a verified Whole Body domain before production email. |
| Stripe | `STRIPE_RESTRICTED_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | Checkout is not implemented yet. Use Checkout Sessions, a least-privilege restricted key, dynamic payment methods, and verified webhooks when it is. |
| Calendly | `CALENDLY_URL` | The `/calendar` booking CTA opens this HTTPS URL. Set it to the appropriate hosted event, routing, or scheduling page. |
| Swiss Ephemeris | `SWISSEPH_API_URL`, `SWISSEPH_API_KEY` | Base URL and server-only key for the separately deployed natal-chart service in `services/ephemeris`. |

## Planned integration boundaries

- **Stripe:** There is no checkout route yet. Product/price IDs, fulfillment rules, tax settings, and webhook event handling must be defined before introducing one.
- **Calendly:** The public calendar uses one configurable external scheduling handoff. Keep booking ownership, event types, confirmation, and webhooks in the hosted scheduling system until a server-owned intake contract is introduced.
- **Swiss Ephemeris:** The separately deployable Node service lives in `services/ephemeris`. Keep calculations server-side, retain its license record, and never expose its key to the browser.
- **Press reader:** Secure reader accounts and watermarked editions are intentionally marked as forthcoming until authentication, purchase entitlements, and storage access policies are designed together.

## Verification

```bash
npx tsc --noEmit
npm run lint
npm run build
```

The production build is the source-of-truth release check.
## Homepage archive and rollback

The original homepage is preserved at `/home-alt-1`.

To revert the living homepage, replace `src/app/page.tsx` with `src/app/home-alt-1/page.tsx`, then build and deploy. The archive intentionally keeps the original v1 layout and components intact.
