---
sidebar_position: 1
title: Understanding Invoices
description: Invoice types, statuses, and how invoices work on ÉquiSettle.
---

# Understanding Invoices

Invoices represent money owed. They're the financial backbone of your collection work — every payment, reminder, and analytics metric ties back to invoices.

## Three invoice types

### Case-related

- **Created automatically** when you create a case with an amount and due date
- Linked directly to a specific case
- Contributes to the case's outstanding balance
- This is the most common type

### Standalone

- Created independently — not linked to any case
- Useful for tracking invoices that don't need full case management yet
- Can later be **converted into a case** if collection efforts are needed
- Can be **linked to an existing case** (becomes case-related)

### Payment-plan

- **Auto-generated** when a payment plan is set up
- Each installment in the plan gets its own invoice with a specific due date
- These invoices replace the original case-related invoice (which gets superseded)
- Used for tracking individual installment payments

## Invoice statuses

| Status | What it means | Outstanding balance |
|--------|--------------|-------------------|
| **Unpaid** | Full amount is owed. This is the starting status for new invoices. | Full amount |
| **Paid** | Full payment received and confirmed. | £0 |
| **Partially paid** | Some payment received, but a balance remains. | Reduced by payment amount |
| **Superseded** | Replaced by another invoice or a payment plan. Not an error — it means a new arrangement has taken its place. | £0 (closed) |
| **Void** | Cancelled or annulled. Used when an invoice was created in error or is no longer valid. | £0 (closed) |
| **Cancelled** | No longer active. Similar to void. | £0 (closed) |

### Dead-end statuses

Superseded, void, and cancelled are considered **dead-end statuses**. Invoices with these statuses:

- Have zero outstanding balance
- Are marked as closed
- Don't appear in analytics totals
- Don't receive automatic reminders
- Cannot be converted to cases (void and cancelled)

## Key fields on an invoice

| Field | What it means |
|-------|--------------|
| **Amount** | The total invoiced — what was originally charged |
| **Outstanding balance** | What's still owed (amount minus any payments received) |
| **Due date** | When payment is expected |
| **Invoice number** | A unique reference — auto-generated or imported from your CSV/accounting software |
| **Category** | How the invoice is classified: accounts receivable, expense, payment, or other |
| **Currency** | Defaults to your company's currency setting |
| **Line items** | Optional — a breakdown of what's being charged (description, quantity, price per item) |

## How "closed" works

Every invoice has a closed flag that separates active invoices from finished ones:

- **Open invoices** (not closed) — active, appear in analytics, can receive reminders
- **Closed invoices** — finished, excluded from analytics totals and outstanding balance calculations

Invoices are automatically closed when:
- They're fully paid
- They're superseded by a payment plan
- They're voided or cancelled
- Their linked case is closed

Closed invoices can be **reopened** if their linked case is reopened — nothing is permanently lost.
