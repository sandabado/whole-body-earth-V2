# Sovereign Guild payments

The Guild uses one Stripe-hosted Checkout Session for its $11.11 monthly
subscription. The application does not collect card or wallet-payment details.

## Environment

Configure these values in the deployment environment, never in source:

- `STRIPE_SECRET_KEY` — server-side Stripe key. `STRIPE_RESTRICTED_KEY` remains
  supported for the existing consultation checkout.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — reserved for Stripe.js integrations.
  The current hosted redirect does not require it.
- `STRIPE_GUILD_WEBHOOK_SECRET` — signing secret for `/api/guild/webhook`.
  The route falls back to `STRIPE_WEBHOOK_SECRET` for single-endpoint setups.
- `NEXT_PUBLIC_APP_URL` — canonical origin used for Checkout return URLs.

Register the Guild webhook endpoint for:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

The Phase 1 webhook verifies and logs these events. Phase 2 must persist
subscription state in Prisma before membership status is used for authorization.
The `?membership=active` return parameter is presentation state, not proof of an
active subscription.

## Stablecoin availability

Stripe can show eligible payment methods dynamically in hosted Checkout. Standard
stablecoin payments require Crypto to be approved and enabled for the Stripe
account, and availability varies by business and customer region.

Recurring stablecoin subscriptions are currently an account-gated/private-preview
Stripe capability. Do not advertise crypto as available for the monthly Guild
subscription until Stripe has enabled that capability for the production account.
No separate crypto route is needed once the account is eligible.

References:

- https://docs.stripe.com/payments/accept-stablecoin-payments
- https://docs.stripe.com/billing/subscriptions/stablecoins
- https://docs.stripe.com/payments/payment-methods/payment-method-support
