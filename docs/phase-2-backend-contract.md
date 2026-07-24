# Whole Body OS — Phase 2 backend contract

Phase 1 deliberately consolidates public content and visual structure without
presenting unfinished operational systems as live.

## Agreed implementation order

1. Supabase Auth and one cross-domain identity
2. Unified PostgreSQL data model and Row Level Security
3. Observer scoring using the minimum current score across every dimension
4. Stripe payments with Feed First enforcement inside database transactions
5. Contracts and Triangle Protocol validation
6. Encrypted vault export and recovery
7. Kill switch, only after authorization, audit, and recovery paths are proven

## Observer invariants

- The Observer is a bounded seat, not a global administrator.
- An empty Position 9 is represented by `Ø`.
- The latest score must be selected independently for every dimension.
- The system score is the minimum of those current dimension scores.
- No seal can form while the Observer seat or an operating position is empty.
- Public pages never expose assignee email addresses or operational scores.

## Financial invariants

- Feed First validation and the resulting ledger writes are one atomic database
  transaction.
- Stripe webhook events are verified, idempotent, and recorded before effects
  are applied.
- Money is stored in integer minor units or a fixed-precision decimal type.
- Hashes are cryptographic and include stable transaction identity; display
  hashes are never treated as tamper-proof accounting on their own.

## Schema review required before migration

The supplied Prisma v3 draft is product direction, not yet a runnable migration.
Before adoption it needs relation fixes, explicit role-model ownership, typed OS
layer enums, order-to-user relations, complete reverse relations, and a database
constraint strategy for one active Quincunx assignment per position.

The current working schema remains untouched until this review is complete.
